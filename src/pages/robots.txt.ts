import type { APIRoute } from 'astro';
import {asset} from '../data/site';
export const GET:APIRoute=({site})=>new Response(`User-agent: *\nAllow: /\nSitemap: ${new URL(asset('/sitemap.xml'),site).href}\n`,{headers:{'Content-Type':'text/plain'}});
