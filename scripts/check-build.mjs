import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
const root=path.resolve('dist');
const base=(process.env.BASE_PATH||'').replace(/\/$/,'');
function walk(dir){return fs.readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(path.join(dir,e.name)):[path.join(dir,e.name)]);}
const html=walk(root).filter(f=>f.endsWith('.html'));
const errors=[];
let links=0;
function resolveUrl(url,file){
 const page='/'+path.relative(root,file).replaceAll(path.sep,'/').replace(/index\.html$/,'');
 const u=new URL(url,`https://local.test${base}${page}`);
 if(u.origin!=='https://local.test')return null;
 if(base&&!u.pathname.startsWith(base+'/')){errors.push(`Missing base prefix: ${url} in ${file}`);return null;}
 let local=decodeURIComponent(u.pathname.slice(base.length));
 let dest=path.join(root,local);
 if(local.endsWith('/'))dest=path.join(dest,'index.html');
 return {dest,hash:u.hash};
}
for(const file of html){
 const body=fs.readFileSync(file,'utf8');
 assert.equal((body.match(/<h1(?:\s|>)/g)||[]).length,1,`Exactly one h1 in ${file}`);
 assert.match(body,/<html lang="(?:en|zh-CN)"/);
 assert.match(body,/<meta name="description" content="[^"]+"/);
 assert.match(body,/<link rel="canonical" href="https:\/\//);
 for(const m of body.matchAll(/(?:href|src)="([^"]+)"/g)){
  if(/^(https?:|mailto:|data:)/.test(m[1]))continue;
  const result=resolveUrl(m[1],file);if(!result)continue;links++;
  if(!fs.existsSync(result.dest)){errors.push(`Broken link ${m[1]} in ${file}`);continue;}
  if(result.hash&&result.dest.endsWith('.html')){
   const target=fs.readFileSync(result.dest,'utf8');
   if(!target.includes(`id="${decodeURIComponent(result.hash.slice(1))}"`))errors.push(`Missing anchor ${m[1]} in ${file}`);
  }
 }
 for(const m of body.matchAll(/<img\b[^>]*>/g))if(!/\balt="[^"]*"/.test(m[0]))errors.push(`Missing image alt in ${file}`);
 if(!file.endsWith('404.html')){
  const relative=path.relative(root,file).replaceAll(path.sep,'/');
  const chinese=relative.startsWith('zh/');
  const paired=chinese?relative.slice(3):'zh/'+relative;
  assert.ok(fs.existsSync(path.join(root,paired)),`Missing language pair ${relative}`);
  const wanted=base+'/'+paired.replace(/index\.html$/,'');
  assert.ok(body.includes(`href="${wanted}" lang="${chinese?'en':'zh-CN'}"`),`Language switch target ${relative}`);
 }
}
const slugs=fs.readdirSync('src/content/projects/en').filter(f=>f.endsWith('.json'));
for(const slug of slugs){assert.ok(fs.existsSync('src/content/projects/zh/'+slug));for(const lang of ['en','zh']){const p=JSON.parse(fs.readFileSync(`src/content/projects/${lang}/${slug}`));for(const key of ['title','summary','question'])assert.ok(p[key],`${slug}: ${key}`);assert.ok(p.approvedSections.length);}}
assert.ok(fs.statSync('dist/cv/CV_Youxing_Kong_ZH.docx').size>1000);
for(const lang of ['en','zh']){
 const cv=JSON.parse(fs.readFileSync(`src/content/${lang}/cv.json`));
 const body=fs.readFileSync(`dist/${lang==='zh'?'zh/':''}cv/index.html`,'utf8');
 const pdf=lang==='en'?'Youxing_Kong_CV_English_20261030.pdf':'Youxing_Kong_CV_Chinese_20261030.pdf';
 assert.ok(body.includes(`href="${base}/cv/${pdf}" download`),`Correct CV download for ${lang}`);
 assert.equal(fs.readFileSync(`dist/cv/${pdf}`).subarray(0,5).toString(),'%PDF-');
 for(const section of cv.sections)assert.ok(body.includes(`id="${section.id}"`),`CV section ${section.id}`);
 assert.equal((body.match(/class="cv-entry(?: no-date)?"/g)||[]).length,cv.sections.reduce((sum,s)=>sum+s.entries.filter(e=>!['citation','subheading'].includes(e.kind)).length,0));
}
assert.equal((fs.readFileSync('dist/sitemap.xml','utf8').match(/<url>/g)||[]).length,10+slugs.length*2);
assert.equal(html.length,11+slugs.length*2);
assert.ok(fs.readFileSync('dist/robots.txt','utf8').includes('Sitemap: https://'));
const pubs=JSON.parse(fs.readFileSync('src/content/publications/publications.json'));
assert.equal(new Set(pubs.map(p=>p.id)).size,pubs.length);
assert.equal(new Set(pubs.filter(p=>p.doi).map(p=>p.doi)).size,pubs.filter(p=>p.doi).length);
assert.ok(pubs.filter(p=>p.selected).length<=5);
if(errors.length){console.error(errors.join('\n'));process.exit(1);}
console.log(`PASS: ${html.length} pages, ${links} internal links/assets, ${slugs.length} bilingual projects, CV, metadata, language pairs and sitemap.`);
