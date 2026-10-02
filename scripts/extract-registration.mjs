import fs from 'node:fs/promises';
const api=JSON.parse(await fs.readFile('reference/accounts/student-internal-api.json','utf8'));
const programs=api.filter(e=>e.path.startsWith('/api/v1/hackathon?')).map(({body:b})=>({slug:b.slug,name:b.name,tagline:b.tagline,color:b.branding.primary_color,participants:b.total_participants,open:b.is_registration_open,questions:b.registration_questions}));
await fs.writeFile('src/content/accounts/registration-programs.json',JSON.stringify(programs,null,2));
