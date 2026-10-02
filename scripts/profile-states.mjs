import{chromium}from'playwright';import fs from'node:fs/promises';
const b=await chromium.launch({channel:'msedge',headless:true});
for(const role of ['student','professional']){
 const c=await b.newContext({viewport:{width:1440,height:1000},storageState:`reference/accounts/${role}-session.json`});await c.route('**/*',r=>['POST','PUT','PATCH','DELETE'].includes(r.request().method())&&!/identitytoolkit|securetoken/.test(new URL(r.request().url()).hostname)?r.abort():r.continue());
 const p=await c.newPage();
 async function capture(name){await p.waitForTimeout(450);await fs.writeFile(`reference/accounts/${role}-${name}.html`,await p.content());await p.screenshot({path:`reference/accounts/${role}-${name}.png`,fullPage:true});console.log(role,name,JSON.stringify({url:p.url(),text:(await p.locator('body').innerText()).slice(0,18000),inputs:await p.locator('input,textarea,select').evaluateAll(es=>es.map(e=>({tag:e.tagName,type:e.type,name:e.name,id:e.id,placeholder:e.placeholder,value:e.value,options:e.tagName==='SELECT'?[...e.options].map(o=>o.text):undefined}))),buttons:await p.locator('button').allTextContents()}));}
 for(const [name,label] of [['edit','Edit Profile'],['skills','Add skill'],['social','Add link'],['contact','Contact us']]){await p.goto('https://hackculture.io/profile',{waitUntil:'networkidle'});await p.getByRole('button',{name:label,exact:true}).click();await capture(name);}
 await p.goto('https://hackculture.io/profile',{waitUntil:'networkidle'});await p.setViewportSize({width:390,height:844});await capture('profile-mobile');await p.getByRole('button',{name:'Edit Profile',exact:true}).click();await capture('edit-mobile');
 await c.close();
}
await b.close();
