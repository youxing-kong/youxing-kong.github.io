"""Render the website's CV content to matching English and Chinese PDFs.
Requires reportlab. Set CV_LATIN_FONT and CV_CHINESE_FONT on non-Windows systems.
"""
import os,json,re
from pathlib import Path
from xml.sax.saxutils import escape
from reportlab.platypus import SimpleDocTemplate,Paragraph,Spacer,KeepTogether
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont

root=Path(__file__).resolve().parents[1]
pdfmetrics.registerFont(TTFont('Latin',os.environ.get('CV_LATIN_FONT',r'C:\Windows\Fonts\arial.ttf')))
pdfmetrics.registerFont(TTFont('LatinBold',os.environ.get('CV_LATIN_BOLD_FONT',r'C:\Windows\Fonts\arialbd.ttf')))
pdfmetrics.registerFont(TTFont('Chinese',os.environ.get('CV_CHINESE_FONT',r'C:\Windows\Fonts\msyh.ttc'),subfontIndex=0))
pdfmetrics.registerFontFamily('Latin',normal='Latin',bold='LatinBold',italic='Latin',boldItalic='LatinBold')
pdfmetrics.registerFontFamily('Chinese',normal='Chinese',bold='Chinese',italic='Chinese',boldItalic='Chinese')
pubs=json.loads((root/'src/content/publications/publications.json').read_text(encoding='utf-8'))
ink=colors.HexColor('#26363c');muted=colors.HexColor('#53636b');accent=colors.HexColor('#365e6b')
for lang in ['en','zh']:
 cv=json.loads((root/f'src/content/{lang}/cv.json').read_text(encoding='utf-8'))
 font='Latin' if lang=='en' else 'Chinese';bold='LatinBold' if lang=='en' else 'Chinese'
 style=ParagraphStyle('body',fontName=font,fontSize=10,leading=13.2 if lang=='en' else 14,textColor=ink,spaceAfter=3 if lang=='en' else 4,wordWrap='CJK' if lang=='zh' else None)
 small=ParagraphStyle('small',parent=style,fontSize=9,leading=12 if lang=='en' else 13,textColor=muted)
 title=ParagraphStyle('title',parent=style,fontName=bold,fontSize=25,leading=31,spaceAfter=9)
 heading=ParagraphStyle('heading',parent=style,fontName=bold,fontSize=14,leading=19,textColor=accent,spaceBefore=12,spaceAfter=9,keepWithNext=True)
 entrytitle=ParagraphStyle('entry',parent=style,fontName=bold,fontSize=10.5,leading=13.5 if lang=='en' else 14.5,spaceAfter=4,keepWithNext=True)
 sub=ParagraphStyle('sub',parent=heading,fontSize=11,leading=15,spaceBefore=9,spaceAfter=8)
 story=[]
 def para(text,s=style):return Paragraph(escape(text),s)
 def section(s):
  for i,e in enumerate(s['entries']):
   block=[para(s['title'],heading)] if i==0 else []
   if e['date']:block.append(para(e['date'],small))
   block.append(para(e['title'],entrytitle))
   block.extend(para(p) for p in e['paragraphs'])
   block.append(Spacer(1,4));story.append(KeepTogether(block))
 def publication(p):
  useChinese=bool(re.search('[\u4e00-\u9fff]',p['authors']+p['title']))
  ps=ParagraphStyle('publication',parent=style,fontName='Chinese' if useChinese else 'Latin',fontSize=9.5,leading=13.4,wordWrap='CJK' if useChinese else None)
  authors=escape(p['authors']);authors=re.sub(r'(Kong, Y\.|Youxing Kong|孔佑兴)',r'<b>\1</b>',authors)
  citation=f"{authors} ({p['year']}). {escape(p['title'])} {escape(p['venue'])}"
  block=[Paragraph(citation,ps)]
  if p['doi']:block.append(Paragraph(f'<link href="https://doi.org/{p["doi"]}" color="#365e6b">https://doi.org/{p["doi"]}</link>',ParagraphStyle('doi',parent=small,fontName='Latin',fontSize=8.5,leading=12)))
  block.append(Spacer(1,6));story.append(KeepTogether(block))
 story.extend([para(cv['name'],title),para('Curriculum Vitae' if lang=='en' else '个人简历',small),para(cv['identity'],entrytitle),para(f"{cv['role']} | {cv['location']}",small),Paragraph(f'<link href="mailto:{cv["email"]}" color="#365e6b">{cv["email"]}</link>',small),Spacer(1,8),para(cv['summary']),para(cv['spine'],small),para(cv['approach'],small)])
 for s in cv['sections'][:4]:section(s)
 story.append(para('Publications' if lang=='en' else '代表性论文',heading))
 for status,label in [('published','Published' if lang=='en' else '已发表'),('preprint','Preprints' if lang=='en' else '预印本')]:
  story.append(para(label,sub))
  for p in sorted([p for p in pubs if p['status']==status],key=lambda p:-p['year']):publication(p)
 for s in cv['sections'][4:]:section(s)
 def footer(canvas,doc):
  canvas.saveState();canvas.setStrokeColor(colors.HexColor('#dce2e4'));canvas.line(46,38,A4[0]-46,38)
  canvas.setFont(font,8);canvas.setFillColor(muted);canvas.drawString(46,25,cv['name']+'  |  '+('Curriculum Vitae' if lang=='en' else '个人简历'))
  canvas.drawRightString(A4[0]-46,25,str(doc.page));canvas.restoreState()
 path=root/f'public/cv/CV_Youxing_Kong_{lang.upper()}.pdf'
 doc=SimpleDocTemplate(str(path),pagesize=A4,rightMargin=46,leftMargin=46,topMargin=40,bottomMargin=52,title=f"{cv['name']} — {'Curriculum Vitae' if lang=='en' else '个人简历'}",author='Youxing Kong',subject=cv['identity'])
 doc.build(story,onFirstPage=footer,onLaterPages=footer)
 print(path.name)
