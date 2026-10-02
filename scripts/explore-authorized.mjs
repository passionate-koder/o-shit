import { chromium } from 'playwright';
import fs from 'node:fs/promises';
const browser = await chromium.launch({channel:'msedge',headless:true});
const role=process.argv[2] || process.env.HC_ROLE || 'student';
const context=await browser.newContext({viewport:{width:1440,height:1000},storageState:`reference/accounts/${role}-session.json`});
const page=await context.newPage();
const captures=[];
page.on('response',async r=>{if(new URL(r.url()).hostname==='api.hackculture.io'){try{captures.push({path:new URL(r.url()).pathname,method:r.request().method(),status:r.status(),body:await r.json()});}catch{}}});
async function capture(name){await page.waitForTimeout(1000);await fs.writeFile(`reference/accounts/${role}-${name}.html`,await page.content());await page.screenshot({path:`reference/accounts/${role}-${name}.png`,fullPage:true});console.log(name,JSON.stringify({url:page.url(),text:await page.locator('body').innerText(),fields:await page.locator('input,textarea,select').evaluateAll(es=>es.map(e=>({tag:e.tagName,type:e.type,id:e.id,name:e.name,value:e.value,placeholder:e.placeholder,required:e.required,options:e.tagName==='SELECT'?[...e.options].map(o=>({text:o.text,value:o.value})):undefined}))),buttons:await page.locator('button').allTextContents(),links:await page.locator('main a').evaluateAll(es=>es.map(e=>({text:e.textContent,href:e.getAttribute('href')})))}));}
try {
if(process.argv[3]!=='host'){
if(process.argv[3]!=='list'){
await page.goto('https://hackculture.io/hackathons/register/code-for-communities-chandigarh',{waitUntil:'networkidle'});
await capture('registration-live');
await page.waitForTimeout(4000);
await capture('registration-redirect');
if(page.url().includes('/manage/')){
 for(const [name,label] of [['resources','Resources'],['team','Manage Team'],['submissions','Submissions'],['events','Events']]){
 await page.getByRole('button',{name:label,exact:label==='Resources'}).click();await capture('dashboard-'+name);
 if(name==='team'){
 for(const action of ['Create Team','Join Team']){const button=page.getByRole('button',{name:action,exact:true});if(await button.count()){await button.click();await capture('team-'+action.toLowerCase().replace(' ','-'));await page.keyboard.press('Escape');}}
 }
 if(name==='submissions'){
 await page.getByRole('button',{name:'Read more',exact:true}).click();await capture('dashboard-submissions-expanded');await page.locator('div.fixed.inset-0').filter({hasText:'Elimination Round'}).last().locator('button').click();
 await page.getByRole('button',{name:'Grand Finale | Mentorship & Presentations',exact:true}).click();await capture('dashboard-finale');
 }
 }
}
}
 await page.goto('https://hackculture.io/my-events',{waitUntil:'networkidle'});
await capture('my-events-live');
await page.getByRole('button',{name:'Table',exact:true}).click();await capture('my-events-table');
await page.getByText('Sort',{exact:true}).click();await capture('my-events-sort');await page.keyboard.press('Escape');
await page.getByText('Filters',{exact:true}).click();await capture('my-events-filters');await page.keyboard.press('Escape');
const dashboard=page.locator('main a').filter({hasText:/dashboard|manage|view/i}).first();
if(await dashboard.count()){await dashboard.click();await page.waitForTimeout(2500);await capture('dashboard-live');}
}
await page.goto('https://hackculture.io/host',{waitUntil:'networkidle'});
const profiles=JSON.parse(await fs.readFile('src/content/accounts/profiles.json','utf8'));
await page.locator('#work-name').fill(profiles[role].full_name);
await page.locator('#work-email').fill(profiles[role].email);
await page.locator('#work-phone').fill(profiles[role].phone_number.replace(/^\+91/,''));
await capture('host-live');
await page.getByRole('button',{name:'Continue',exact:true}).click();
await capture('host-live-step2');
await page.getByText('Select organization type',{exact:true}).click();
await capture('host-organization-options');
await page.getByRole('option',{name:'Community',exact:true}).click();
await page.locator('#work-entity-name').fill('Workspace recreation test');
await page.locator('#work-designation').fill('Test participant');
await page.getByRole('button',{name:'Continue',exact:true}).click();
await capture('host-live-step3');
if(process.argv.includes('--submit-host')){
 await page.getByText('Select a program',{exact:true}).click();
 await capture('host-program-options');
 await page.getByRole('option').filter({hasText:/Hackathon - hiring/i}).first().click();
 await page.locator('#work-message').fill('Authorized website workflow test for a local recreation. This is a test inquiry, not a request to schedule or publish a real event. No follow-up is needed.');
 await page.getByRole('button',{name:'Submit',exact:true}).click();
 await page.waitForTimeout(3000);await capture('host-submitted');
}
}finally{await fs.writeFile(`reference/accounts/${role}-${process.argv[3]==='host'?'host':'dashboard'}-api.json`,JSON.stringify(captures,null,2));await browser.close();}
