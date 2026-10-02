import{chromium}from'playwright';import fs from'node:fs/promises';
const browser=await chromium.launch({channel:'msedge',headless:true});
for(const role of ['student','professional']){
 const context=await browser.newContext({viewport:{width:1440,height:1000},storageState:`reference/accounts/${role}-session.json`});await context.route('**/*',r=>['POST','PUT','PATCH','DELETE'].includes(r.request().method())&&!/identitytoolkit|securetoken/.test(new URL(r.request().url()).hostname)?r.abort():r.continue());const page=await context.newPage();
 const api=[];page.on('response',async r=>{if(r.url().includes('api.hackculture.io')&&r.request().method()==='GET'){try{api.push({path:new URL(r.url()).pathname,body:await r.json()});}catch{}}});
 for(const step of [1,2,3,4]){
  await page.goto(`https://hackculture.io/onboarding?edit=true&step=${step}`,{waitUntil:'networkidle',timeout:60000});
  await page.waitForFunction(()=>document.body.innerText.includes('Update your information')&&!document.body.innerText.includes('Loading your profile data'),{},{timeout:30000});await page.waitForTimeout(700);
  const file=`reference/accounts/${role}-step-${step}`;await fs.writeFile(file+'.html',await page.content());await page.screenshot({path:file+'.png',fullPage:true});
  console.log(role,step,JSON.stringify({text:(await page.locator('main').innerText()),inputs:await page.locator('input,textarea,select').evaluateAll(es=>es.map(e=>({tag:e.tagName,type:e.type,id:e.id,name:e.name,placeholder:e.placeholder,value:e.value,checked:e.checked,options:e.tagName==='SELECT'?[...e.options].map(o=>({text:o.text,value:o.value})):undefined}))),buttons:await page.locator('main button').allTextContents()}));
 }
 await fs.writeFile(`reference/accounts/${role}-onboarding-api.json`,JSON.stringify(api,null,2));
 await context.close();
}await browser.close();
