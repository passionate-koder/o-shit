import fs from 'node:fs/promises';
const path='src/app/api/registrations/route.ts';let s=await fs.readFile(path,'utf8');s=s.replace('q.options.includes(value)','(q.options as string[]).includes(value)');await fs.writeFile(path,s);
const editor='src/components/onboarding-editor.tsx';s=await fs.readFile(editor,'utf8');s=s.replace("'false'===String(true)",'false');await fs.writeFile(editor,s);
