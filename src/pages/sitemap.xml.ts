import type { APIRoute } from 'astro';
import {projects,route,type Lang} from '../data/site';
export const GET:APIRoute=({site})=>{
 const entries=[];
 for(const lang of ['en','zh'] as Lang[])for(const path of ['','research','projects','publications','cv'])entries.push(new URL(route(lang,path),site).href);
 for(const p of projects)entries.push(new URL(route(p.lang,`projects/${p.slug}`),site).href);
 return new Response(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${entries.map(url=>`<url><loc>${url}</loc></url>`).join('')}</urlset>`,{headers:{'Content-Type':'application/xml'}});
};
