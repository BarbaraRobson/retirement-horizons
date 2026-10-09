export const VERSION='1.1.11';
export const CHECKED='2026-10-06';
export const RULES={
 pensionAge:67, coupleMax:933*26,singleMax:1237.7*26,coupleBasic:855.9*26,singleBasic:1135.4*26,
 coupleAssets:499000,singleAssets:333000,nonHomeExtra:267000,
 coupleIncome:396*26,singleIncome:226*26,deemCouple:110600,deemSingle:66800,deemLow:.0175,deemHigh:.0375,
 cshcCouple:168076,cshcSingle:105048,dbCap:131250,
 nccCap:130000,concessionalCap:32500,transferCap:2100000,
 medicareSingle:28500,medicareSenior:45000,medicareFamily:48000,medicareSeniorFamily:63000,
};
// Medicare amounts above are deliberately editable planning approximations, not verified thresholds.
export const PRESETS={
 cash:{name:'Cash',real:1,vol:1},conservative:{name:'Conservative / income focused',real:2,vol:5.5},
 balanced:{name:'Balanced',real:3.5,vol:10},growth:{name:'Growth',real:4,vol:12},
 highgrowth:{name:'High growth',real:4.5,vol:15},sustainable:{name:'Sustainable high growth',real:4.5,vol:15},
 international:{name:'International shares',real:4.5,vol:18},australian:{name:'Australian shares',real:4.5,vol:18},
 custom:{name:'Custom option',real:3.5,vol:10}
};
export const SOURCES=[
 ['PSS pension access from age 55','https://www.csc.gov.au/Defined-benefit-members/Access-benefit/Plan-retirement/When-can-I-retire/pss/'],
 ['PSS death benefits and spouse rates','https://www.csc.gov.au/-/media/Files/PSS/Factsheets/PSF03-death-benefits.pdf'],
 ['Death benefit pension tax','https://www.ato.gov.au/law/view/document?docid=COG/LCR201610/NAT/ATO/00001'],
 ['PSS pension taxation','https://www.csc.gov.au/Defined-benefit-members/Resources/Learning-centre/How-super-works/Tax-and-your-super/pss/'],
 ['PSSap investment options','https://www.csc.gov.au/Members/Funds-and-products/PSSap/pssap/'],
 ['PSSap target asset allocations','https://www.csc.gov.au/members/resources/product-disclosure-statement/asset-allocation/pssap'],
 ['Age Pension payment rates','https://www.servicesaustralia.gov.au/how-much-age-pension-you-can-get?context=22526'],
 ['Age Pension assets test','https://www.servicesaustralia.gov.au/assets-test-for-age-pension?context=22526'],
 ['Age Pension income test','https://www.servicesaustralia.gov.au/income-test-for-age-pension?context=22526'],
 ['Deeming','https://www.servicesaustralia.gov.au/deeming?context=22526'],
 ['Super and Age Pension','https://www.servicesaustralia.gov.au/superannuation?context=22526'],
 ['Defined benefit deductible amounts','https://guides.dss.gov.au/social-security-guide/1/1/d/44'],
 ['Home sale proceeds exemption','https://guides.dss.gov.au/social-security-guide/4/6/3/90'],
 ['Commonwealth Seniors Health Card','https://www.servicesaustralia.gov.au/income-test-for-commonwealth-seniors-health-card?context=21966'],
 ['Australian resident tax rates','https://www.ato.gov.au/tax-rates-and-codes/tax-rates-australian-residents'],
 ['Medicare levy','https://www.ato.gov.au/individuals-and-families/medicare-and-private-health-insurance/medicare-levy'],
 ['Super pension minimum withdrawals','https://www.ato.gov.au/tax-and-super-professionals/for-superannuation-professionals/self-managed-superannuation-funds-smsf/paying-benefits/paying-superannuation-income-streams'],
 ['Downsizer contributions','https://moneysmart.gov.au/grow-your-super/downsizer-super-contributions'],
 ['Foreign super transfers','https://www.ato.gov.au/individuals-and-families/super-for-individuals-and-families/super/foreign-super-funds/transfer-from-a-foreign-super-fund-to-an-australian-super-fund'],
 ['Partial foreign pension withdrawals','https://www.ato.gov.au/law/view/document?docid=AID/AID201248/NAT/ATO/00001'],
 ['Australia–UK tax treaty','https://www.gov.uk/government/publications/australia-tax-treaties/2003-australia-uk-double-taxation-convention-in-force'],
 ['UK State Pension abroad','https://www.gov.uk/state-pension-if-you-retire-abroad/rates-of-state-pension'],
 ['UK inheritance tax','https://www.gov.uk/inheritance-tax'],
 ['UK residence and inheritance tax','https://www.gov.uk/guidance/inheritance-tax-if-youre-a-long-term-uk-resident'],
 ['UK pension inheritance changes from April 2027','https://www.gov.uk/government/publications/inheritance-tax-on-pensions-technical-note/technical-note-inheritance-tax-on-pensions'],
 ['RBA exchange rates','https://www.rba.gov.au/statistics/frequency/exchange-rates.html'],
 ['Aged care fees','https://www.myagedcare.gov.au/aged-care-home-costs-and-fees'],
 ['iPad installation','https://support.apple.com/guide/ipad/open-as-web-app-ipad8f1f7a29/ipados']
];
export const mix=()=>[{option:'balanced',weight:100,real:3.5,vol:10}];
export function person(label){return {label,dob:'',resident:true,residenceEligible:'unknown',medicare:true,hospital:true,endAge:100,deathAge:null,priorIncome:0,extraTax:0,
 db:{gross:null,free:0,taxed:0,untaxed:100,survivor:67,verified:false,deductible:0,indexed:true,kind:'PSS',start:''},
 uk:{lumpGBP:null,date:'',ongoingGBP:0,ongoingStart:'',reductionGBP:0,survivor:0,stateGBP:0,stateStart:'',taxMode:'unknown',manualTax:0,afeGBP:0,verified:false,provider:'',scheme:'unknown',residentSince:'',vestedGBP:null,contributionsGBP:0,totalGBP:null,withholdingGBP:0,processingDays:30},
 otherIncome:0,otherIncomeEnd:'',taxableOther:100};}
export function defaults(){const now=new Date();const date=`${now.getFullYear()}-01-01`;return {schema:1,completed:false,example:false,start:date,people:[person('Partner 1'),person('Partner 2')],
 assets:{cash:null,outside:null,costBasis:null,ownerShare:50,yield:2.5,franking:0,discount:true,otherAssets:0,propertyValue:0,rent:0,propertyCost:0,debt:0,debtRate:6,debtPayment:0,debtOwner:50,mix:mix(),changes:[]},
 accounts:[],housing:{enabled:false,soldDate:'',netProceeds:0,earliest:'',expected:'',latest:'',balance:null,costs:0,deposit:0,value:0,state:'',mainHome:true,homeowner:true,reserved:0,rent:0,rentEnd:'',strata:0,extraDelayCost:0,exemptionMonths:24,extensionVerified:false,mortgage:0,mortgageRate:6,mortgagePayment:0,bridge:0,bridgeRate:8},
 spending:{essential:null,desired:null,reserve:30000,estate:0,survivor:75,phases:[],events:[],careAge:85,careAnnual:0,careLump:0,careYears:4,homeSaleAge:null,homeSaleNet:0},
 inheritances:[],contributions:[],settings:{inflation:2.5,inflationVol:1,fx:1/.5249,fxVol:10,fxFee:1,cashRate:3.5,success:95,paths:1000,seed:104729,withdrawal:'outside-first',taxBracketIndex:0,benefitIndex:2.5,guardThreshold:20,guardStep:10,guardMax:200,rebalance:true,correlation:.75,returnShift:0,crashChance:5,crashSize:30,poorYears:8,poorPenalty:2,medicareSingle:28500,medicareSenior:45000,medicareFamily:48000,medicareSeniorFamily:63000,dbCap:131250},
 scenario:{inheritance:'none',timing:'expected',pensionDelay:0,fxShock:0,stress:'normal',survivor:'none',deathYear:null,care:false},lastBackup:null};}
export function demo(){const d=defaults();d.people[0].dob='1967-03-15';d.people[1].dob='1968-08-20';d.people.forEach(p=>{p.residenceEligible='yes';p.db.gross=0;p.db.verified=true;});d.people[0].db.gross=52000;d.people[0].db.free=10;d.people[0].db.untaxed=90;d.people[0].db.deductible=10;d.people[0].uk.lumpGBP=45000;d.people[0].uk.date='2027-03-15';d.people[0].uk.taxMode='manual';d.people[0].uk.manualTax=8000;d.people[0].uk.verified=true;
 d.assets.cash=470000;d.assets.outside=150000;d.assets.costBasis=125000;d.housing={...d.housing,enabled:true,soldDate:'2026-07-01',earliest:'2027-02-01',expected:'2027-04-01',latest:'2027-09-01',balance:400000,costs:15000,value:750000,reserved:415000,rent:1800,strata:7000};
 d.accounts=[{label:'Example super',owner:1,type:'accumulation',balance:350000,accessDate:'2028-08-20',pensionDate:'2028-08-20',fee:300,mix:mix(),changes:[],taxFree:100,manualWithdrawal:0}];
 d.spending.essential=50000;d.spending.desired=75000;d.spending.phases=[{year:2037,multiplier:90},{year:2047,multiplier:80}];d.spending.events=[{label:'Example car',date:'2030-06-01',amount:35000,kind:'expense',repeat:0}];d.completed=true;d.example=true;return d;}
// Date: 2026-10-06. Model: GPT-6. Prompt: Build a generic Australian/UK retirement PWA, structured interview, local data, comparisons, editable assumptions and investment allocation schedules, for GitHub Pages.

// Date: 2026-10-06. Model: GPT-6. Prompt: Version the input-safeguard and financial edge-case fixes.

// Date: 2026-10-07. Model: GPT-6. Prompt: Rewrite the README for iPad/iPhone users with a prominent education and entertainment disclaimer and live address; rename Pensions to Defined benefit and UK pensions; investigate and reduce browser crashes.

// Date: 2026-10-07. Model: GPT-6. Prompt: Increase the default stochastic run count from 400 to 1500, including existing plans on the former default, with consistent bounds and runtime safeguards.

// Date: 2026-10-07. Model: GPT-6. Prompt: Release navigation hardening and delayed-input commit fixes without discarding saved plans.

// Date: 2026-10-07. Model: GPT-6. Prompt: Review PSS survivor percentage, age-55 access and partial-year income; clarify periods, add commencement dates and correct related pension assumptions.

// Date: 2026-10-07. Model: GPT-6. Prompt: Keep the published 67% survivor default and start projections on 1 January of the current year with complete calendar-year results.

// Date: 2026-10-07. Model: GPT-6. Prompt: Automatically calculate super access dates from partners’ birth dates, with retirement assumptions and preserved manual overrides.

// Date: 2026-10-09. Model: GPT-6. Prompt: Add explanatory pop-ups, provisional cash/date suggestions, 1000 paths, automatic retirement/pension defaults, failure timing and a lifetime guardrails median with a 200% cap.

// Date: 2026-10-09. Model: GPT-6. Prompt: Darken the guardrails outcome band and add comparison wealth through retirement, excluding PPOR and subtracting outstanding debts before calculating percentiles.
