import test from 'node:test';
import assert from 'node:assert/strict';
import {demo} from '../rules.js';

test('Navigation, assumption warnings and blocked calculations work with saved answers',async()=>{
 const d=demo();d.settings.paths=400;d.start='2026-10-01';d.settings.inflation=1;d.assets.mix[0].vol=0;d.spending.essential=80000;d.spending.desired=75000;
 const handlers=new Map(),elements=new Map();
 const element=id=>{if(!elements.has(id))elements.set(id,{innerHTML:'',textContent:'',style:{},addEventListener:(kind,fn)=>handlers.set(id+':'+kind,fn)});return elements.get(id);};
 globalThis.document={querySelector:element,querySelectorAll:()=>[]};
 const stored=new Map([['retirement-horizons-plan-v1',JSON.stringify(d)]]);
 globalThis.localStorage={getItem:k=>stored.get(k)||null,setItem:(k,v)=>stored.set(k,v)};
 globalThis.window={addEventListener(){},scrollTo(){}};
 await import('../app.js');
 const nav=page=>handlers.get('#navigation:click')({target:{closest:()=>({dataset:{page}})}});
 nav('interview');assert(element('#main').innerHTML.includes('Build your retirement picture'));
 const action=(action,extra={})=>handlers.get('#main:click')({target:{closest:()=>({dataset:{action,...extra}})}});
 action('step',{step:'6'});assert(element('#main').innerHTML.includes('low long-term assumption'));assert(element('#main').innerHTML.includes('zero market fluctuations'));
 nav('help');assert(element('#main').innerHTML.includes('Understand your plan'));
 nav('interview');action('finish');assert(element('#main').innerHTML.includes('Calculation blocked'));assert(element('#main').innerHTML.includes('Desired spending must be at least essential spending'));
 assert.equal(JSON.parse(stored.get('retirement-horizons-plan-v1')).people[0].dob,d.people[0].dob);assert.equal(JSON.parse(stored.get('retirement-horizons-plan-v1')).settings.paths,1500);assert(stored.has('retirement-horizons-1500-runs-v1'));
});
// Date: 2026-10-06. Model: GPT-6. Prompt: Regression-test navigation, visible assumption warnings, blocked invalid calculations and preservation of saved questionnaire answers.

test('Worker failure, timeout, cancellation and page exit retain saved answers',async()=>{
 const d=demo();d.start='2026-10-01';const handlers=new Map(),elements=new Map(),stored=new Map([['retirement-horizons-plan-v1',JSON.stringify(d)]]),timers=new Map(),workers=[];let timerId=0;
 const element=id=>{if(!elements.has(id))elements.set(id,{innerHTML:'',textContent:'',style:{},addEventListener:(kind,fn)=>handlers.set(id+':'+kind,fn)});return elements.get(id);};
 globalThis.document={querySelector:element,querySelectorAll:()=>[]};globalThis.localStorage={getItem:k=>stored.get(k)||null,setItem:(k,v)=>stored.set(k,v)};globalThis.window={addEventListener:(k,fn)=>handlers.set('window:'+k,fn),scrollTo(){}};
 const oldSet=globalThis.setTimeout,oldClear=globalThis.clearTimeout,oldWorker=globalThis.Worker;
 globalThis.setTimeout=(fn,ms)=>{const id=++timerId;timers.set(id,{fn,ms});return id;};globalThis.clearTimeout=id=>timers.delete(id);
 globalThis.Worker=class{constructor(){this.terminated=false;workers.push(this);}postMessage(){}terminate(){this.terminated=true;}};
 try{await import('../app.js?worker-regression');const action=(action,extra={})=>handlers.get('#main:click')({target:{closest:()=>({dataset:{action,...extra}})}});action('nav',{page:'interview'});action('step',{step:'2'});assert(element('#main').innerHTML.includes('Defined benefit and UK pensions'));assert(element('#main').innerHTML.includes('Defined benefit commencement date'));assert(element('#main').innerHTML.includes('Default 67%'));
 action('calculate');const first=workers.at(-1);assert.equal(timers.size,1);first.onmessage({data:{error:'Device time limit reached'}});assert(first.terminated);assert.equal(timers.size,0);assert(element('#main').innerHTML.includes('Device time limit reached'));
 action('calculate');const second=workers.at(-1);const timer=[...timers.values()].find(t=>t.ms===200000);timer.fn();assert(second.terminated);assert(element('#main').innerHTML.includes('No partial result is shown'));
 action('calculate');action('cancel');assert(workers.at(-1).terminated);assert.equal(timers.size,0);
 action('calculate');handlers.get('window:pagehide')();assert(workers.at(-1).terminated);assert.equal(timers.size,0);assert.equal(stored.get('retirement-horizons-plan-v1'),JSON.stringify({...d,start:`${new Date().getFullYear()}-01-01`}));
 globalThis.Worker=class{constructor(){throw Error('Worker unavailable');}};action('calculate');assert(element('#main').innerHTML.includes('could not start the calculation worker'));
 }finally{globalThis.setTimeout=oldSet;globalThis.clearTimeout=oldClear;globalThis.Worker=oldWorker;}
});
// Date: 2026-10-07. Model: GPT-6. Prompt: Regression-test the renamed pension section and worker failure, timeout, cancellation and page-exit cleanup without losing saved answers.

// Date: 2026-10-07. Model: GPT-6. Prompt: Increase the default stochastic run count from 400 to 1500, including existing plans on the former default, with consistent bounds and runtime safeguards.

test('Repeated pre-simulation navigation keeps controls mounted and releases old form subtrees',async()=>{
 const d=demo(),stored=new Map([['retirement-horizons-plan-v1',JSON.stringify(d)]]),handlers=new Map(),elements=new Map();let navigationWrites=0,removals=0,mainWrites=0,blurred=0;const pending=[];
 const controls=['interview','compare','settlement','scenarios','details','help'].map(page=>({dataset:{page},classList:{toggle(){}},setAttribute(){},removeAttribute(){}}));
 const element=id=>{if(!elements.has(id)){let html='';elements.set(id,{get innerHTML(){return html;},set innerHTML(v){html=v;if(id==='#navigation')navigationWrites++;if(id==='#main')mainWrites++;},textContent:'',style:{},contains:n=>Boolean(n?.inMain),querySelectorAll:s=>s==='[data-bind]'?pending:[{remove(){removals++;}},{remove(){removals++;}}],addEventListener:(kind,fn)=>handlers.set(id+':'+kind,fn)});}return elements.get(id);};
 globalThis.document={querySelector:element,querySelectorAll:s=>s==='#navigation [data-page]'?controls:[],activeElement:null};globalThis.localStorage={getItem:k=>stored.get(k)||null,setItem:(k,v)=>stored.set(k,v)};globalThis.window={addEventListener(){},scrollTo(){}};
 const oldWorker=globalThis.Worker;globalThis.Worker=class{constructor(){throw Error('Navigation must not start a simulation');}};
 try{await import('../app.js?navigation-stress');const nav=page=>handlers.get('#navigation:click')({target:{closest:()=>({dataset:{page}})}});nav('interview');const before=mainWrites;nav('interview');assert.equal(mainWrites,before);
 const field={inMain:true,type:'number',tagName:'INPUT',dataset:{bind:'settings.inflation'},value:'3',min:'',max:'',blur(){blurred++;document.activeElement=null;handlers.get('#main:change')({target:this});}};document.activeElement=field;nav('help');assert.equal(blurred,1);assert.equal(JSON.parse(stored.get('retirement-horizons-plan-v1')).settings.inflation,3);
 pending.push({type:'text',tagName:'INPUT',dataset:{bind:'people.0.label'},value:'Fictional pending edit'});nav('interview');assert.equal(JSON.parse(stored.get('retirement-horizons-plan-v1')).people[0].label,'Fictional pending edit');pending.length=0;
 for(let i=0;i<180;i++)nav(controls[i%controls.length].dataset.page);assert.equal(navigationWrites,1);assert(removals>180);assert.equal(JSON.parse(stored.get('retirement-horizons-plan-v1')).people[0].dob,d.people[0].dob);
 }finally{globalThis.Worker=oldWorker;}
});
// Date: 2026-10-07. Model: GPT-6. Prompt: Stress repeated tab changes before any simulation, retaining navigation nodes and entered answers while releasing old form subtrees.

// Date: 2026-10-07. Model: GPT-6. Prompt: Verify a tab switch saves visible edits even without a native change event.

// Date: 2026-10-07. Model: GPT-6. Prompt: Verify calendar-start migration and visible DB commencement and published survivor-rate guidance.
