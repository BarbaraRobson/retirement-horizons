const CACHE='retirement-horizons-v1.1.5';
const ASSETS=['./','./index.html','./styles.css','./app.js','./model.js','./input-checks.js','./rules.js','./help.js','./worker.js','./manifest.webmanifest','./icons/icon.svg','./icons/icon-192.png','./icons/icon-512.png','./icons/apple-touch-icon.png'];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(ASSETS.map(path=>new Request(new URL(path,self.location.href),{cache:'reload'}))))));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('retirement-horizons-')&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{if(e.request.method!=='GET'||new URL(e.request.url).origin!==self.location.origin)return;e.respondWith(caches.open(CACHE).then(async cache=>{const hit=await cache.match(e.request);if(hit)return hit;try{const response=await fetch(e.request);return response;}catch{if(e.request.mode==='navigate')return cache.match('./index.html');return Response.error();}}));});
// Date: 2026-10-06. Model: GPT-6. Prompt: Cache the generic retirement PWA for offline use without transmitting or caching entered financial data on a server.

// Date: 2026-10-06. Model: GPT-6. Prompt: Cache the input-check module and safely offer the updated app without changing locally stored plans.

// Date: 2026-10-06. Model: GPT-6. Prompt: Prevent stale HTTP-cached files from being installed into a newly versioned offline cache.

// Date: 2026-10-07. Model: GPT-6. Prompt: Rewrite the README for iPad/iPhone users with a prominent education and entertainment disclaimer and live address; rename Pensions to Defined benefit and UK pensions; investigate and reduce browser crashes.

// Date: 2026-10-07. Model: GPT-6. Prompt: Increase the default stochastic run count from 400 to 1500, including existing plans on the former default, with consistent bounds and runtime safeguards.

// Date: 2026-10-07. Model: GPT-6. Prompt: Release navigation hardening and delayed-input commit fixes without discarding saved plans.
