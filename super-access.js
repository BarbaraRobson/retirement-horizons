// Standard taxed-super access assumptions; eligibility still needs fund confirmation.
const birthdays=new Map();
export function birthday(dob,years){
 const key=`${dob}:${years}`;if(birthdays.has(key))return birthdays.get(key);
 if(typeof dob!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(dob))return '';
 const source=new Date(dob+'T12:00:00Z');if(!Number.isFinite(+source)||source.toISOString().slice(0,10)!==dob)return '';
 const year=Number(dob.slice(0,4))+years,month=Number(dob.slice(5,7)),day=Number(dob.slice(8,10));
 const last=new Date(Date.UTC(year,month,0)).getUTCDate();
 const result=`${year}-${dob.slice(5,7)}-${String(Math.min(day,last)).padStart(2,'0')}`;if(birthdays.size>2000)birthdays.clear();birthdays.set(key,result);return result;
}
export function accessMode(a){return a.accessMode||(a.accessDate?'manual':a.type==='pension'?'current':'retired60');}
export function superAccessDate(a,people,start){
 const mode=accessMode(a),dob=people[a.owner]?.dob;
 if(mode==='manual')return a.accessDate||'';
 if(mode==='current')return start;
 return birthday(dob,mode==='retired60'?60:65);
}
// Date: 2026-10-07. Model: GPT-6. Prompt: Automatically calculate super access dates from partners’ birth dates, distinguishing retirement at 60, unrestricted access at 65 and confirmed overrides.
export function pensionStartDate(a,people,start){if(a.keepAccumulation)return '';if(a.pensionDate)return a.pensionDate;if(a.pensionAuto===true)return superAccessDate(a,people,start);return a.type==='pension'?start:'';}
export function dbStartDate(p,start){if(p.db.start)return p.db.start;return p.db.kind==='PSS'?birthday(p.dob,55):start;}
// Date: 2026-10-09. Model: GPT-6. Prompt: Assume retirement access at 60 and PSS pension eligibility at 55, with pension phase following access unless kept in accumulation or overridden.
