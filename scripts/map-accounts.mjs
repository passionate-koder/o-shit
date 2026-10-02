import {chromium} from 'playwright';
import fs from 'node:fs/promises';
const browser=await chromium.launch({channel:'msedge',headless:true});
for(const role of ['student','professional']){
 const context=await browser.newContext({viewport:{width:1440,height:1000},storageState:`reference/accounts/${role}-session.json`});
 await context.route('**/*',route=>{const req=route.request();const url=new URL(req.url());if(['POST','PUT','PATCH','DELETE'].includes(req.method())&&!['identitytoolkit.googleapis.com','securetoken.googleapis.com'].includes(url.hostname))return route.abort();return route.continue();});
 const page=await context.newPage();const api=[];
 page.on('response',async r=>{const u=new URL(r.url());if(u.hostname==='api.hackculture.io'&&r.request().method()==='GET'){try{api.push({path:u.pathname+u.search,status:r.status(),body:await r.json()});}catch{}}});
 async function capture(name){await page.waitForTimeout(700);await fs.writeFile(`reference/accounts/${role}-${name}.html`,await page.content());await page.screenshot({path:`reference/accounts/${role}-${name}.png`,fullPage:true});console.log(role,name,JSON.stringify({url:page.url(),text:(await page.locator('main').count()?await page.locator('main').innerText():await page.locator('body').innerText()).slice(0,14000),links:await page.locator('main a, [role=menu] a').evaluateAll(es=>es.map(e=>({text:e.textContent,href:e.getAttribute('href')}))),buttons:await page.locator('main button,[role=menu] button').allTextContents()}));}
 await page.goto('https://hackculture.io/programs',{waitUntil:'networkidle'});
 await page.getByRole('button',{name:role==='student'?'SR':'SK',exact:true}).click();await capture('account-menu');console.log('MENU',await page.locator('body').innerText().then(t=>t.slice(0,1300)));
 for(const [name,route] of [['profile','/profile'],['my-events','/my-events'],['register','/hackathons/register/code-for-communities-chandigarh'],['register-hackcbs','/hackathons/register/hackcbs-9-0'],['host-auth','/host']]){await page.goto('https://hackculture.io'+route,{waitUntil:'networkidle',timeout:60000});await capture(name);}
 await fs.writeFile(`reference/accounts/${role}-internal-api.json`,JSON.stringify(api,null,2));
 await context.close();
}
await browser.close();
