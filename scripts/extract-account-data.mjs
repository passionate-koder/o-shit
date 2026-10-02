import fs from'node:fs/promises';
await fs.mkdir('src/content/accounts',{recursive:true});
const profiles={};for(const role of ['student','professional']){const api=JSON.parse(await fs.readFile(`reference/accounts/${role}-internal-api.json`,'utf8'));const profile=api.find(r=>r.path.startsWith('/api/v1/auth/me')).body;profiles[role]=profile;for(const entry of api.filter(r=>r.path.startsWith('/api/v1/hackathon?'))){console.log('EVENT',entry.path,Object.keys(entry.body));for(const[key,value]of Object.entries(entry.body))if(/registration|question|form/.test(key))console.log(key,JSON.stringify(value).slice(0,20000));}}
await fs.writeFile('src/content/accounts/profiles.json',JSON.stringify(profiles,null,2));
