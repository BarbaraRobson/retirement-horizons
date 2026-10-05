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
