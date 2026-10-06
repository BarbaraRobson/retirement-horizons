import {PRESETS} from './rules.js';

export function validDate(s){
 if(typeof s!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(s))return false;
 const t=new Date(s+'T12:00:00Z');return Number.isFinite(+t)&&t.toISOString().slice(0,10)===s;
}
const mo=s=>validDate(s)?Number(s.slice(0,4))*12+Number(s.slice(5,7))-1:null;
const num=x=>typeof x==='number'&&Number.isFinite(x);
const ageAt=(s,m)=>(m-mo(s))/12;

// Errors prevent calculation; unusual but possible choices remain editable warnings.
export function inputErrors(d){
 const e=[],start=mo(d.start),need=(ok,msg)=>{if(!ok)e.push(msg);};
 need(start!==null,'Enter a valid plan valuation date.');
 function scan(o,path=''){
  if(!o||typeof o!=='object')return;
  for(const [k,v] of Object.entries(o)){
   const p=path?path+'.'+k:k;
   if(typeof v==='number'){
    need(Number.isFinite(v),`${p}: enter a finite number.`);
    if(!['real','inflation','returnShift','fxShock'].includes(k))need(v>=0,`${p}: negative values are not supported.`);
   }
   if(v&&typeof v==='object')scan(v,p);
  }
 }
 scan(d);
 d.people.forEach(p=>{
  need(validDate(p.dob),`${p.label}: enter a valid date of birth.`);
  if(validDate(p.dob)&&start!==null){const a=ageAt(p.dob,start);need(a>=18&&a<120,`${p.label}: check the date of birth; this app supports adult retirement plans.`);need(num(p.endAge)&&p.endAge>a&&p.endAge<=120,`${p.label}: planning end age must be later than current age and no more than 120.`);if(p.deathAge!==null)need(num(p.deathAge)&&p.deathAge>a&&p.deathAge<=p.endAge,`${p.label}: death age must be after current age and within the planning horizon.`);}
  if((p.db.gross||0)>0)need(Math.abs(p.db.free+p.db.taxed+p.db.untaxed-100)<.01,`${p.label}: pension tax components must total 100%.`);
  for(const k of ['free','taxed','untaxed','survivor','deductible'])need(num(p.db[k])&&p.db[k]>=0&&p.db[k]<=100,`${p.label}: pension ${k} must be between 0 and 100%.`);
  if(p.db.start)need(validDate(p.db.start),`${p.label}: enter a valid defined benefit commencement date.`);
  need(['PSS','Other taxed DB','Other untaxed DB','None'].includes(p.db.kind),`${p.label}: select a supported defined benefit scheme.`);
  if(p.db.kind==='None')need(!(p.db.gross>0),`${p.label}: defined benefit scheme is None but an income is entered; choose the scheme or enter zero.`);
  if(p.otherIncomeEnd)need(validDate(p.otherIncomeEnd),`${p.label}: check the other-income end date.`);
  if(p.uk.ongoingGBP>0)need(validDate(p.uk.ongoingStart),`${p.label}: enter a start date for the continuing UK pension.`);
  if(p.uk.stateGBP>0)need(validDate(p.uk.stateStart),`${p.label}: enter a start date for UK State Pension.`);
  for(const k of ['date','ongoingStart','stateStart','residentSince'])if(p.uk[k])need(validDate(p.uk[k]),`${p.label}: check UK pension ${k} date.`);
  if((p.uk.lumpGBP||0)>0){need(validDate(p.uk.date),`${p.label}: enter a UK lump-sum payment date.`);if(mo(p.uk.date)!==null)need(mo(p.uk.date)>=start,`${p.label}: UK lump-sum date is before the plan; include money already received in opening balances and remove the future receipt.`);need(p.uk.withholdingGBP<=p.uk.lumpGBP,`${p.label}: UK withholding exceeds the gross lump sum.`);if(p.uk.taxMode==='afe')need(p.uk.afeGBP<=p.uk.lumpGBP,`${p.label}: applicable fund earnings exceed the gross lump sum; verify the calculation.`);}
 });
 need(num(d.spending.essential)&&num(d.spending.desired),'Enter essential and desired annual spending.');
 if(num(d.spending.essential)&&num(d.spending.desired))need(d.spending.desired>=d.spending.essential,'Desired spending must be at least essential spending.');
 const h=d.housing;
 if(h.soldDate)need(validDate(h.soldDate),'Check the house-sale settlement date.');
 if(h.enabled){
  need(num(h.balance),'Enter the outstanding settlement balance, including zero if fully paid.');need(validDate(h.expected),'Enter an expected settlement date.');
  for(const k of ['earliest','expected','latest'])if(h[k]){need(validDate(h[k]),`Check the ${k} settlement date.`);if(mo(h[k])!==null)need(mo(h[k])>=start,`${k} settlement is before the plan. Mark settlement as completed or update the dates; past payments are not future expenses.`);}
  if(mo(h.earliest)!==null&&mo(h.expected)!==null)need(h.earliest<=h.expected,'Earliest settlement must not be after expected settlement.');
  if(mo(h.latest)!==null&&mo(h.expected)!==null)need(h.latest>=h.expected,'Latest settlement must not be before expected settlement.');
 }
 const allocations=[['Outside investments',d.assets],...d.accounts.map(a=>[a.label,a])];
 for(const [label,a] of allocations){
  const seen=new Set();for(const c of a.changes){need(num(c.year)&&Number.isInteger(c.year)&&c.year>=1900&&c.year<=2200,`${label}: enter a whole allocation-change year.`);need(!seen.has(c.year),`${label}: two allocation changes use ${c.year}; retain one change per year.`);seen.add(c.year);}
  for(const [name,rows] of [['current allocation',a.mix],...a.changes.map(c=>['allocation for '+c.year,c.mix])]){
   need(rows.length>0&&Math.abs(rows.reduce((s,r)=>s+r.weight,0)-100)<.01,`${label}: ${name} must total 100%.`);
   for(const r of rows){need(Object.hasOwn(PRESETS,r.option)&&num(r.weight)&&r.weight>=0&&r.weight<=100&&num(r.real)&&r.real>=-20&&r.real<=30&&num(r.vol)&&r.vol>=0&&r.vol<=50,`${label}: check weights, returns and volatility in ${name}.`);}
  }
 }
 d.accounts.forEach(a=>{if(validDate(a.accessDate)&&Number.isInteger(a.owner)&&d.people[a.owner]&&validDate(d.people[a.owner].dob)&&ageAt(d.people[a.owner].dob,mo(a.accessDate))<60)need(false,`${a.label}: access before age 60 is unsupported; use a verified external calculation rather than an apparently accessible balance.`);need(['accumulation','pension','smsf','unknown'].includes(a.type),`${a.label}: select a supported account type.`);need(Number.isInteger(a.owner)&&a.owner>=0&&a.owner<2,`${a.label}: select a valid owner.`);for(const k of ['accessDate','pensionDate'])if(a[k])need(validDate(a[k]),`${a.label}: check ${k}.`);if(a.accessDate&&a.pensionDate)need(a.pensionDate>=a.accessDate,`${a.label}: pension commencement precedes its access date.`);});
 for(const [i,c] of d.contributions.entries()){need(Number.isInteger(c.account)&&c.account>=0&&c.account<d.accounts.length,`Contribution ${i+1}: select an existing account.`);if(c.amount>0){need(validDate(c.date),`Contribution ${i+1}: enter a payment date.`);if(mo(c.date)!==null)need(mo(c.date)>=start,`Contribution ${i+1}: past contributions belong in opening balances.`);}}
 const phaseYears=new Set();for(const p of d.spending.phases){need(num(p.year)&&Number.isInteger(p.year), 'Spending phases require whole calendar years.');need(!phaseYears.has(p.year),`Two spending phases use ${p.year}; retain one per year.`);phaseYears.add(p.year);need(num(p.multiplier)&&p.multiplier<=200,'Spending phase percentage must be between 0 and 200%.');}
 for(const ev of d.spending.events){if(ev.amount>0){need(validDate(ev.date),`${ev.label}: enter a payment date.`);if(mo(ev.date)!==null&&ev.repeat===0)need(mo(ev.date)>=start,`${ev.label}: a past one-off payment will not be included; remove it or change its date.`);}need(Number.isInteger(ev.repeat)&&ev.repeat>=0,`${ev.label}: repeat interval must be a whole number of years.`);}
 if(d.spending.homeSaleAge!==null&&validDate(d.people[0].dob))need(d.spending.homeSaleAge>ageAt(d.people[0].dob,start),'Scheduled home-sale age must be after the current age.');
 for(const x of d.inheritances)if(x.mode==='estate')need(x.currency==='GBP',`${x.label}: the UK estate calculator requires amounts and allowances in GBP.`);
 const included=d.inheritances.filter((x,i)=>d.scenario.inheritance!=='none'&&(['all','late','low','high'].includes(d.scenario.inheritance)||d.scenario.inheritance===String(i)));
 for(const x of included){const at=d.scenario.inheritance==='late'?x.lateDate:x.date;need(validDate(at),`${x.label}: enter the receipt date for the selected inheritance scenario.`);if(mo(at)!==null)need(mo(at)>=start,`${x.label}: past inheritance belongs in opening balances.`);need(x.mode==='estate'||num(x.amount),`${x.label}: enter an expected net amount.`);}
 if(d.scenario.survivor!=='none')need(num(d.scenario.deathYear)&&Number.isInteger(d.scenario.deathYear)&&d.scenario.deathYear>Math.floor(start/12),'Survivor scenario needs a death year after the plan start year.');
 for(const [k,v] of Object.entries(d.settings))if(!['withdrawal','rebalance'].includes(k))need(num(v),`${k}: enter a numerical assumption; blank does not mean zero.`);
 need(d.settings.dbCap>0,'Defined benefit income cap must be greater than zero.');
 need(['outside-first','super-first'].includes(d.settings.withdrawal),'Select a supported withdrawal order.');
 need(['none','0','1'].includes(d.scenario.survivor),'Select a supported survivor scenario.');
 need(['normal','poor','crashes'].includes(d.scenario.stress),'Select a supported market scenario.');
 need(['earliest','expected','latest'].includes(d.scenario.timing),'Select a supported settlement timing.');
 need(['none','all','late','low','high',...d.inheritances.map((x,i)=>String(i))].includes(d.scenario.inheritance),'Selected inheritance no longer exists; choose the baseline or an existing inheritance.');
 const bounds={inflation:[-2,10],inflationVol:[0,5],fx:[.5,5],fxVol:[0,30],fxFee:[0,10],cashRate:[0,15],success:[80,99],paths:[100,1500],correlation:[0,.99],returnShift:[-10,10],benefitIndex:[0,10],taxBracketIndex:[0,10],guardThreshold:[5,50],guardStep:[1,30],guardMax:[100,250],crashChance:[0,30],crashSize:[0,70],poorYears:[0,30],poorPenalty:[0,10]};
 for(const [k,[lo,hi]] of Object.entries(bounds))need(num(d.settings[k])&&d.settings[k]>=lo&&d.settings[k]<=hi,`${k}: enter a value between ${lo} and ${hi}.`);
 need(Number.isInteger(d.settings.paths),'Simulation paths must be a whole number.');
 for(const [o,k] of [[d.assets,'ownerShare'],[d.assets,'franking'],[d.assets,'yield'],[d.spending,'survivor']])need(num(o[k])&&o[k]<=100,`${k} must be between 0 and 100%.`);
 return [...new Set(e)];
}

export function inputWarnings(d){
 const w=[],s=d.settings,start=mo(d.start),h=d.housing;
 if(d.assets.costBasis>d.assets.outside&&d.assets.outside>0)w.push('Cost basis exceeds current outside investment value. The model omits capital-loss carry-forwards; do not rely on its tax calculation for loss-making holdings.');
 
 if(d.people.some(p=>p.db.gross>s.dbCap))w.push('A defined benefit pension exceeds the entered income cap. Birthday-year and survivor cap adjustments are approximate; verify the annual tax separately.');
 if(s.inflation<=1)w.push(`Inflation is ${s.inflation}%. This is a low long-term assumption: compare with 2.5% and a higher-inflation stress case before relying on spending results.`);
 if(s.inflationVol===0)w.push('Inflation variability is zero. Every path uses the same inflation assumption; outcome bands exclude inflation uncertainty.');
 if(s.cashRate-s.inflation>2)w.push('Cash interest is more than 2 percentage points above inflation throughout the projection. Check whether this is realistic after tax over several decades.');
 if(s.fxFee>=5)w.push('Currency conversion fees are 5% or more. Check whether fees were entered as a percentage or a dollar amount.');
 if(s.fx<1||s.fx>3)w.push('Check the exchange-rate direction: enter AUD received for £1, not GBP received for A$1.');
 if(s.fxVol===0&&(d.people.some(p=>p.uk.lumpGBP>0||p.uk.ongoingGBP>0||p.uk.stateGBP>0)||d.inheritances.some(e=>e.currency==='GBP'&&d.scenario.inheritance!=='none')))w.push('GBP/AUD variability is zero despite UK receipts. The results exclude exchange-rate uncertainty.');
 if(s.taxBracketIndex>0)w.push('Tax bracket indexation assumes future policy changes. It can reduce projected tax; compare with the default 0% nominal bracket growth.');
 if(s.benefitIndex>s.inflation+1)w.push('Benefits and means-test thresholds grow faster than inflation. This may overstate future Age Pension support.');
 if(s.paths<400)w.push('Fewer than 400 paths gives coarse tail probabilities. A displayed success percentage is a model sample, not a precise guarantee.');
 if(s.success>=98)w.push('The selected success target is close to the simulation tail. Rare-event estimates are sensitive to sample size and model assumptions.');
 if(start!==null&&start%12===0)w.push('Whole-year projection: opening balances must be at 1 January, with all income and events from that date. Updating the start does not reconstruct past balances. The final planning year extends through December.');
 const allocations=[['Outside investments',d.assets.outside,d.assets],...d.accounts.map(a=>[a.label,a.balance,a])];
 for(const [label,balance,a] of allocations){if(!(balance>0)&&!(a===d.assets&&d.assets.cash>d.spending.reserve))continue;
  for(const [name,rows] of [['current mix',a.mix],...a.changes.map(c=>['mix from '+c.year,c.mix])]){
   const active=rows.filter(r=>r.weight>0);
   if(active.length&&active.every(r=>r.vol===0))w.push(`${label}: ${name} has zero market fluctuations. Returns are deterministic; narrow bands and high success rates do not show investment risk.`);
   else if(active.some(r=>r.vol<1&&r.option!=='cash'))w.push(`${label}: ${name} includes unusually low volatility for a non-cash investment. Check the percentage units.`);
   if(active.some(r=>r.real+s.returnShift>6))w.push(`${label}: ${name} assumes more than 6% annual real return after fund costs/tax. This is optimistic; test lower returns.`);
   if(active.some(r=>r.vol>0&&r.real+s.returnShift>4&&r.vol<5))w.push(`${label}: ${name} combines a high real return with low volatility. Check both assumptions.`);
  }
 }
 if(d.assets.yield>10&&d.assets.outside>0)w.push('Outside investment distribution yield exceeds 10%. Yield is part of total return, not additional return; check for entering a dollar amount as a percentage.');
 if(s.correlation<.25&&allocations.some(x=>x[1]>0&&x[2].mix.filter(r=>r.weight>0&&r.vol>0).length>1))w.push('Low correlation can materially reduce simulated portfolio risk. Check that the options really provide this degree of diversification.');
 d.people.forEach(p=>{
  if(p.db.gross>0&&p.db.kind!=='None'){
   if(!p.db.start)w.push(`${p.label}: defined benefit pension is assumed already payable at the plan start. Enter a commencement date if it starts later.`);
   if(p.db.kind==='PSS'&&p.db.survivor!==67&&p.db.survivor!==85)w.push(`${p.label}: PSS survivor assumption is ${p.db.survivor}%. CSC lists 67% for spouse only, or 85% under the higher dependant option; verify your entitlement.`);
   if(p.db.kind==='PSS'&&validDate(p.dob)&&ageAt(p.dob,mo(p.db.start)??start)<55)w.push(`${p.label}: ordinary PSS retirement access generally starts at 55 subject to retirement conditions. Earlier or invalidity benefits require a verified estimate; disability tax offsets are not modelled.`);
   if(p.db.untaxed===100&&!p.db.verified)w.push(`${p.label}: the default 100% untaxed component may overstate tax. Enter the actual pension components from CSC payment advice.`);
   if(d.scenario.survivor!=='none'||d.people.some(x=>x.deathAge!==null))w.push(`${p.label}: survivor modelling assumes an eligible spouse and an already commenced pension. Death before commencement, initial full-rate payments, child benefits and changed tax components need a separate verified estimate.`);
  }
  if(validDate(p.dob)&&start!==null&&p.endAge<90)w.push(`${p.label}: planning ends before age 90. A short horizon can increase supported spending; compare with age 95–100.`);
  if(validDate(p.dob)&&p.endAge-ageAt(p.dob,start)>60)w.push(`${p.label}: the model is limited to 60 future years; this end age is not fully simulated.`);
  if(p.db.gross>0&&p.db.gross<15000)w.push(`${p.label}: check that the pension is a gross annual amount, not a monthly or fortnightly payment.`);
  if(p.uk.scheme==='none'&&p.uk.ongoingGBP>0)w.push(`${p.label}: UK scheme is None but ongoing UK pension income is still entered; check whether it should be zero.`);
  if(p.uk.withholdingGBP>0&&p.uk.manualTax>0&&p.uk.taxMode==='manual')w.push(`${p.label}: UK withholding and the Australian tax provision are deducted separately. Check any foreign-tax credit or refund to avoid counting the same tax twice.`);
  if(p.uk.reductionGBP>p.uk.ongoingGBP)w.push(`${p.label}: the UK pension reduction exceeds ongoing pension income; ongoing income is floored at zero.`);
  if(start%12!==6&&p.priorIncome===0&&(p.db.gross>0||p.otherIncome>0))w.push(`${p.label}: the plan starts partway through a tax year with zero earlier income. Enter income already received since 1 July to avoid understating tax.`);
 });
 if(d.spending.desired<20000)w.push('Household annual spending is below $20,000. Check that an annual amount was entered, and that essentials include ordinary living costs.');
 if(d.spending.survivor<60)w.push('Survivor spending is below 60% of couple spending. Housing and other fixed costs often fall much less than household size.');
 if(d.spending.phases.some(p=>d.spending.desired*p.multiplier/100<d.spending.essential))w.push('A spending phase falls below essential spending. It will count as a failure even if the smaller payments can be funded.');
 for(const [label,date,amount] of [...d.people.map(p=>[p.label+' UK receipt',p.uk.date,p.uk.lumpGBP]),...d.inheritances.map(e=>[e.label,e.date,e.amount]),...d.spending.events.map(e=>[e.label,e.date,e.amount])])if(amount>0&&mo(date)>start+Math.min(720,Math.ceil(Math.max(...d.people.map(p=>p.endAge-ageAt(p.dob,start)))*12)))w.push(`${label}: date falls beyond the simulated horizon and will not affect results.`);
 if(d.scenario.inheritance!=='none')w.push('This scenario relies on inheritance. Compare with None · baseline; neither timing nor receipt is guaranteed.');
 if(h.enabled){
  if(!h.earliest||!h.latest)w.push('An earliest or latest settlement date is missing; that case falls back to the expected date. Enter timing bounds to test delays.');
  if(mo(h.expected)>=start+24)w.push('Settlement is outside the 24-month cash timeline. The long-term model includes it, but the settlement page does not show the payment; check whether the year is correct.');
  if(h.bridge>0||h.mortgage>0)w.push('Settlement finance is assumed available. Confirm approval, drawdown timing, fees and any required bridge repayment date; borrowed funds are not guaranteed.');
  if(d.people.some(p=>p.uk.lumpGBP>0&&mo(p.uk.date)+Math.ceil((p.uk.processingDays+d.scenario.pensionDelay)/30)===mo(h[d.scenario.timing]||h.expected)))w.push('A UK receipt and settlement fall in the same modelled month. Receipt is applied first, which can hide an earlier settlement deadline; test a one-month payment delay.');
  if(h.netProceeds>0)w.push('House-sale proceeds are descriptive only. Include proceeds already received in Cash; use a dated receipt for a future sale, without counting them twice.');
 }
 for(const [label,bal,rate,pay] of [['Other debt',d.assets.debt,d.assets.debtRate,d.assets.debtPayment],['Mortgage',h.enabled?h.mortgage:0,h.mortgageRate,h.mortgagePayment]])if(bal>0&&pay<=bal*rate/1200)w.push(`${label}: repayments do not cover opening monthly interest. Debt grows rather than paying off.`);
 if(d.spending.homeSaleAge!==null)w.push('Scheduled home-sale proceeds are entered net of replacement housing. Homeowner status and replacement-home costs are not inferred; verify Age Pension treatment separately.');
 if(d.scenario.care)w.push('Care costs are a household allowance, not automatically doubled when both partners need care. Verify overlapping care and refundable accommodation payments separately.');
 if(d.scenario.care&&d.spending.careAnnual===0&&d.spending.careLump===0)w.push('Aged care is enabled but both entered costs are zero; the scenario adds no care expense.');
 if(d.accounts.some(a=>a.type==='pension')&&start%12!==6)w.push('Existing pensions in a partial financial year use an approximate remaining minimum. Actual 1 July balances and withdrawals already made must be checked.');
 if(d.spending.events.length||h.enabled)w.push('Check for duplicated expenses: ordinary annual spending excludes separately entered settlement costs, strata, loan repayments and one-off events.');
 return w;
}
// Date: 2026-10-06. Model: GPT-6. Prompt: Audit Retirement Horizons for edge cases and reasonable user errors; block contradictory inputs and warn about optimistic or risk-free assumptions.

// Date: 2026-10-07. Model: GPT-6. Prompt: Increase the default stochastic run count from 400 to 1500, including existing plans on the former default, with consistent bounds and runtime safeguards.

// Date: 2026-10-07. Model: GPT-6. Prompt: Review PSS survivor percentage, age-55 access and partial-year income; clarify periods, add commencement dates and correct related pension assumptions.

// Date: 2026-10-07. Model: GPT-6. Prompt: Keep the published 67% survivor default and start projections on 1 January of the current year with complete calendar-year results.
