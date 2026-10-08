"""Ten source/asset refinement passes. Browser layout and device QA remain separate."""
from pathlib import Path
import json,re,hashlib
from fontTools.ttLib import TTFont
css=Path('app/globals.css').read_text();theme=Path('app/dod-theme.css').read_text();page=Path('app/page.tsx').read_text();svg=Path('public/art/desert-title.svg').read_text()
font=TTFont('public/fonts/Cinzel-VariableFont_wght.ttf');cmap=font.getBestCmap();upm=font['head'].unitsPerEm
width=lambda t,size:sum(font['hmtx'][cmap[ord(c)]][0] for c in t)/upm*size
assert width('Movement',13)<=4.75*16
for role in ['display','body','reading']:assert re.search(r'--dod-font-'+role+r':\s*"DOD Cinzel VF"',theme)
assert svg.count('<title id="title">Desert of Desolation</title>')==1 and '<text' not in svg and '<path' in svg
assert 'width:min(100%,240px);height:auto;max-height:none' in css
assert 'src="/logos/icon-white.png" alt="Eye of Horus"' in page
assert 'aria-hidden="true">𓆣' in page and 'pointer-events:none' in css
assert 'font-size:.6875rem' in css and 'font-size:.8125rem!important' in css
assert 'repeating-linear-gradient(8deg,#46593805' in css
assert '.master-sheet[data-sheet-theme] .record-block h3{background:var(--record-panel)}' in css
assert 'prefers-reduced-motion' in css

def luminance(c):
 s=[int(c[i:i+2],16)/255 for i in (1,3,5)];s=[v/12.92 if v<=.04045 else ((v+.055)/1.055)**2.4 for v in s];return sum(v*w for v,w in zip(s,[.2126,.7152,.0722]))
def ratio(a,b):
 a,b=sorted([luminance(a),luminance(b)]);return (b+.05)/(a+.05)
contrast={f'{fg} on {bg}':round(ratio(fg,bg),2) for fg,bg in [('#252923','#a7cda2'),('#252923','#99bfa0'),('#252923','#bedab7'),('#F1E6C9','#121A33'),('#B4ACC6','#121A33'),('#CBA760','#121A33')]}
assert min(contrast.values())>=4.5
passes=[
 ('Art authority','Retained DOD_SITE, moonlit-ink tokens, approved desert backdrop, and existing Eye branding.'),
 ('Title ornament','Created one transparent lotus/papyrus carved-gold ornament with empty center; inspected raster source.'),
 ('Exact title','Composed Cinzel outline lettering; inspected rendered SVG; graphic now replaces visible title text in home and header.'),
 ('Typography','Aligned display/body/reading tokens to Art Engine Cinzel; reduced entire menu to 13px and legal disclosure to 11px.'),
 ('Green family','Darkened record paper to #A7CDA2; replaced colored cells and all six character panels with related greens.'),
 ('Parchment','Added very faint CSS fibers and tonal wash; no new campaign backgrounds or media.'),
 ('Whole-site detail','Applied carved double rules, muted gold card corners, night haze, and consistent restrained panels.'),
 ('Contrast','Checked opaque text/background colors >=4.5:1; decoration stays behind content and uses no parent opacity.'),
 ('Phone fit','Checked row minimum columns at 320/375/390/430 and real Cinzel Movement label width; corrected shared Eye rule overriding title size.'),
 ('Accessibility consistency','Exact title alt text, decorative glyphs aria-hidden, preserved touch areas, reduced-motion support and semantic controls. Browser inspection unavailable.')]
result={'version':'1.5.1-alpha.19','method':'Ten source/asset refinement passes; not ten browser screenshots','passes':[{'pass':i+1,'focus':a,'change_and_check':b} for i,(a,b) in enumerate(passes)],'contrast_ratios':contrast,'widths_px':[320,375,390,430],'asset_render_inspected':True,'browser_layout_qa':False,'physical_iphone_qa':False,'campaign_mutation':False}
Path('docs/VISUAL_TEN_PASSES_ALPHA19.json').write_text(json.dumps(result,indent=2)+'\n')
print('PASS: ten source/asset passes, exact Cinzel title, preserved Eye, green family, smaller menu/legal, real font label width and text contrast >=4.5:1.')
