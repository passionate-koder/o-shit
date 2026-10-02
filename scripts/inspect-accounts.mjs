import { chromium } from 'playwright';
import fs from 'node:fs/promises';
const browser=await chromium.launch({channel:'msedge',headless:true});
await fs.mkdir('reference/accounts',{recursive:true});
const accounts=[{role:'student',email:process.env.HC_STUDENT_EMAIL,password:process.env.HC_STUDENT_PASSWORD},{role:'professional',email:process.env.HC_PRO_EMAIL,password:process.env.HC_PRO_PASSWORD}];
for(const account of accounts){
 if(!account.email||!account.password)throw new Error('Missing account credentials in environment');
 const context=await browser.newContext({viewport:{width:1440,height:1000}});
 const page=await context.newPage();
 const api=[];
 page.on('response',async response=>{const url=new URL(response.url());if(url.hostname==='api.hackculture.io'&&response.request().method()==='GET'){try{const body=await response.json();api.push({path:url.pathname+url.search,status:response.status(),body});}catch{}}});
 await page.goto('https://hackculture.io/auth',{waitUntil:'networkidle',timeout:60000});
 const reject=page.getByRole('button',{name:'Reject optional'});if(await reject.count())await reject.click();
 await page.locator('input[type="email"]').fill(account.email);
 await page.locator('input[type="password"]').fill(account.password);
 await page.locator('form').getByRole('button',{name:'Sign In',exact:true}).click();
 await page.waitForTimeout(6000);
 await page.screenshot({path:`reference/accounts/${account.role}-landing.png`,fullPage:true});
 await fs.writeFile(`reference/accounts/${account.role}-landing.html`,await page.content());
 console.log(account.role,JSON.stringify({url:page.url(),text:(await page.locator('body').innerText()).slice(0,18000),links:await page.locator('a').evaluateAll(es=>es.map(e=>({text:e.textContent,href:e.getAttribute('href')}))),buttons:await page.locator('button').allTextContents()}));
 await context.storageState({path:`reference/accounts/${account.role}-session.json`,indexedDB:true});
 await fs.writeFile(`reference/accounts/${account.role}-api.json`,JSON.stringify(api,null,2));
 await context.close();
}
await browser.close();
