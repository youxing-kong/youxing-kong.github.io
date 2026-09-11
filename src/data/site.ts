export type Lang = 'en' | 'zh';
export const base = import.meta.env.BASE_URL.replace(/\/$/, '');
export const asset = (path: string) => `${base}/${path.replace(/^\//, '')}`;
export const route = (lang: Lang, path = '') => asset(`${lang === 'zh' ? 'zh/' : ''}${path ? path.replace(/^\/|\/$/g, '') + '/' : ''}`);
export const text = (lang: Lang, en: string, zh: string) => lang === 'zh' ? zh : en;
export const navigation = ['home','research','projects','publications','cv'];
export const labels = {en:['Home','Research','Projects','Publications','CV'],zh:['首页','研究方向','研究项目','学术论文','简历']};
export const projects = Object.values(import.meta.glob('../content/projects/*/*.json', {eager:true,import:'default'})) as any[];
export const projectsFor = (lang: Lang) => projects.filter(p=>p.lang===lang).sort((a,b)=>a.order-b.order);
