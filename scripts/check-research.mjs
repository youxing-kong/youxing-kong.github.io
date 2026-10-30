import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
const pairs={};let figures=0;
for(const lang of ['en','zh']){
 const orders=[];
 for(const f of fs.readdirSync(`src/content/projects/${lang}`).filter(f=>f.endsWith('.json'))){
  const p=JSON.parse(fs.readFileSync(`src/content/projects/${lang}/${f}`));
  assert.equal(p.lang,lang);assert.equal(p.slug,f.slice(0,-5));orders.push(p.order);
  assert.ok(p.approvedSections.length>=3);
  pairs[p.slug]??={};pairs[p.slug][lang]=p;
  for(const s of p.approvedSections){assert.ok(s.title&&s.id);for(const b of s.blocks){if(b.type==='figure'){
   const m=b.media;assert.ok(m.alt&&m.label&&m.caption);assert.ok(fs.existsSync('public/'+m.src));
   if(m.kind==='gif')assert.ok(m.poster&&fs.existsSync('public/'+m.poster));
   figures++;
  }else assert.ok(b.text);}}
 }
 assert.equal(new Set(orders).size,6);
}
for(const p of Object.values(pairs)){
 assert.ok(p.en&&p.zh);assert.equal(p.en.order,p.zh.order);
 assert.deepEqual(p.en.approvedSections.map(s=>[s.id,s.blocks.map(b=>b.type)]),p.zh.approvedSections.map(s=>[s.id,s.blocks.map(b=>b.type)]));
}
assert.equal(figures,56);
for(const lang of ['','zh/'])for(const slug of Object.keys(pairs)){
 const html=fs.readFileSync(`dist/${lang}projects/${slug}/index.html`,'utf8');
 for(const bad of ['AI concept illustration','AI 概念插画','适用范围与解释边界','illustrative','invalid'])assert.ok(!html.includes(bad));
}
assert.ok(!fs.existsSync('dist/images/projects/stac-gnss/hero.png'));
console.log(`PASS: six bilingual approved projects, ${figures} complete figure records, bilingual structure, and no obsolete disclosures.`);
