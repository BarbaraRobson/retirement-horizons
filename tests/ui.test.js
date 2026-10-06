import test from 'node:test';
import assert from 'node:assert/strict';
import {demo} from '../rules.js';

test('Navigation, assumption warnings and blocked calculations work with saved answers',async()=>{
 const d=demo();d.start='2026-10-01';d.settings.inflation=1;d.assets.mix[0].vol=0;d.spending.essential=80000;d.spending.desired=75000;
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
 assert.equal(JSON.parse(stored.get('retirement-horizons-plan-v1')).people[0].dob,d.people[0].dob);
});
// Date: 2026-10-06. Model: GPT-6. Prompt: Regression-test navigation, visible assumption warnings, blocked invalid calculations and preservation of saved questionnaire answers.

test('Worker failure, timeout, cancellation and page exit retain saved answers',async()=>{
 const d=demo();d.start='2026-10-01';const handlers=new Map(),elements=new Map(),stored=new Map([['retirement-horizons-plan-v1',JSON.stringify(d)]]),timers=new Map(),workers=[];let timerId=0;
 const element=id=>{if(!elements.has(id))elements.set(id,{innerHTML:'',textContent:'',style:{},addEventListener:(kind,fn)=>handlers.set(id+':'+kind,fn)});return elements.get(id);};
 globalThis.document={querySelector:element,querySelectorAll:()=>[]};globalThis.localStorage={getItem:k=>stored.get(k)||null,setItem:(k,v)=>stored.set(k,v)};globalThis.window={addEventListener:(k,fn)=>handlers.set('window:'+k,fn),scrollTo(){}};
 const oldSet=globalThis.setTimeout,oldClear=globalThis.clearTimeout,oldWorker=globalThis.Worker;
 globalThis.setTimeout=(fn,ms)=>{const id=++timerId;timers.set(id,{fn,ms});return id;};globalThis.clearTimeout=id=>timers.delete(id);
 globalThis.Worker=class{constructor(){this.terminated=false;workers.push(this);}postMessage(){}terminate(){this.terminated=true;}};
 try{await import('../app.js?worker-regression');const action=(action,extra={})=>handlers.get('#main:click')({target:{closest:()=>({dataset:{action,...extra}})}});action('nav',{page:'interview'});action('step',{step:'2'});assert(element('#main').innerHTML.includes('Defined benefit and UK pensions'));
 action('calculate');const first=workers.at(-1);assert.equal(timers.size,1);first.onmessage({data:{error:'Device time limit reached'}});assert(first.terminated);assert.equal(timers.size,0);assert(element('#main').innerHTML.includes('Device time limit reached'));
 action('calculate');const second=workers.at(-1);const timer=[...timers.values()].find(t=>t.ms===60000);timer.fn();assert(second.terminated);assert(element('#main').innerHTML.includes('No partial result is shown'));
 action('calculate');action('cancel');assert(workers.at(-1).terminated);assert.equal(timers.size,0);
 action('calculate');handlers.get('window:pagehide')();assert(workers.at(-1).terminated);assert.equal(timers.size,0);assert.equal(stored.get('retirement-horizons-plan-v1'),JSON.stringify(d));
 globalThis.Worker=class{constructor(){throw Error('Worker unavailable');}};action('calculate');assert(element('#main').innerHTML.includes('could not start the calculation worker'));
 }finally{globalThis.setTimeout=oldSet;globalThis.clearTimeout=oldClear;globalThis.Worker=oldWorker;}
});
// Date: 2026-10-07. Model: GPT-6. Prompt: Regression-test the renamed pension section and worker failure, timeout, cancellation and page-exit cleanup without losing saved answers.
