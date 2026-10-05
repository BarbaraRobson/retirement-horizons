import {compare} from './model.js';
self.onmessage=e=>{try{const result=compare(e.data.plan,message=>self.postMessage({progress:message}),e.data.advanced);self.postMessage({result});}catch(error){self.postMessage({error:error.message});}};
// Date: 2026-10-06. Model: GPT-6. Prompt: Run financial simulations locally in a Web Worker without blocking the retirement PWA interface.
