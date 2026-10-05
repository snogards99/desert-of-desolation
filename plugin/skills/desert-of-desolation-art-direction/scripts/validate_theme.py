#!/usr/bin/env python3
from pathlib import Path
import json,hashlib,subprocess,sys,re
from PIL import Image
ROOT=Path(__file__).resolve().parents[1]
def rgb(s): return [int(s[i:i+2],16)/255 for i in (1,3,5)]
def luminance(c):
    v=[x/12.92 if x<=.04045 else ((x+.055)/1.055)**2.4 for x in c]
    return .2126*v[0]+.7152*v[1]+.0722*v[2]
def contrast(a,b):
    x,y=sorted([luminance(a),luminance(b)]);return (y+.05)/(x+.05)
def main():
    checks=[]
    def check(name,condition):
        if not condition: raise AssertionError(name)
        checks.append(name)
    required=['SKILL.md','agents/openai.yaml','assets/theme.tokens.json','assets/theme.css','assets/theme.mjs','assets/art-engine.json','assets/art-engine.mjs','assets/art-manifest.json','assets/reference-ui/home-desktop-approved.png','assets/reference-ui/home-mobile-approved.png','assets/templates/homepage.md','assets/templates/title-splash.md','references/style-bible.md','references/responsive-layout.md','references/component-guidelines.md','references/site-integration.md','references/verification.md']
    for rel in required: check('exists '+rel,(ROOT/rel).is_file())
    t=json.loads((ROOT/'assets/theme.tokens.json').read_text()); c=t['colors']
    ratios=[]
    for foreground in ['ivory','muted-lavender','aged-gold','spectral-light']:
        for background in ['night','deep-blue','purple-shadow']:
            r=contrast(rgb(c[foreground]),rgb(c[background]));check(f'text contrast {foreground}/{background}',r>=4.5);ratios.append(r)
    for a,b in [('ink','paper'),('night','aged-gold')]:
        r=contrast(rgb(c[a]),rgb(c[b]));check(f'text contrast {a}/{b}',r>=4.5);ratios.append(r)
    check('touch target',int(t['layout']['touch-target'].removesuffix('px'))>=44)
    check('mobile breakpoint',t['art']['mobile_breakpoint_px']==760)
    check('semantic controls',t['art']['semantic_controls_required'] is True and t['art']['interactive_hotspot_overlay_forbidden'] is True)
    subprocess.run([sys.executable,str(ROOT/'scripts/build_css.py'),'--check'],check=True,capture_output=True)
    check('generated CSS matches tokens',True)
    eng=json.loads((ROOT/'assets/art-engine.json').read_text())
    check('engine version',eng['engine_version']=='1.1.0')
    check('site mode',eng['modes']['site']=='DOD_SITE')
    check('continue state rule',eng['runtime_rules']['continue_restores_authoritative_state'] is True)
    check('new game rule',eng['runtime_rules']['new_game_requires_existing_confirmation_reset_flow'] is True)
    check('audio ownership',eng['runtime_rules']['audio_engine_ownership']=='EXISTING_GAME_AUDIO_ENGINE')
    man=json.loads((ROOT/'assets/art-manifest.json').read_text());ids=[x['id'] for x in man['entries']]
    check('unique art IDs',len(ids)==len(set(ids)))
    check('private manifest',man['visibility']=='DM_AUTHORING_ONLY' and man['rules']['whole_manifest_to_client'] is False)
    for item in man['entries']:
        if item['available']:
            p=(ROOT/'assets'/item['path']).resolve();check('asset inside skill '+item['id'],p.is_relative_to(ROOT) and p.is_file())
            check('asset hash '+item['id'],hashlib.sha256(p.read_bytes()).hexdigest()==item['sha256'])
    check('desktop dimensions',Image.open(ROOT/'assets/reference-ui/home-desktop-approved.png').size==(1536,1024))
    check('mobile dimensions',Image.open(ROOT/'assets/reference-ui/home-mobile-approved.png').size==(941,1672))
    for n in [16,32,48]: check(f'favicon {n}',Image.open(ROOT/f'assets/icons/favicon-{n}.png').size==(n,n))
    for n in [180,192,512]: check(f'app icon {n}',Image.open(ROOT/f'assets/icons/app-{n}.png').size==(n,n))
    css=(ROOT/'assets/theme.css').read_text(); js=(ROOT/'assets/theme.mjs').read_text()+(ROOT/'assets/art-engine.mjs').read_text()
    check('DOD_SITE CSS present','dod-home-title' in css and 'dod-feature-grid' in css)
    check('no remote fonts',not re.search(r'@import|@font-face',css))
    check('no network audio or state APIs',not re.search(r'\b(?:fetch|XMLHttpRequest|AudioContext|webkitAudioContext|localStorage|sessionStorage|indexedDB)\s*[.(]',js))
    check('reduced motion','prefers-reduced-motion: reduce' in css)
    check('no font binaries',not any(p.suffix.lower() in ['.ttf','.otf','.woff','.woff2'] for p in ROOT.rglob('*')))
    total=sum(p.stat().st_size for p in ROOT.rglob('*') if p.is_file());check('under 25 MiB uncompressed',total<25*1024*1024)
    result={'status':'PASS','checks_passed':len(checks),'lowest_text_contrast':round(min(ratios),4),'uncompressed_bytes':total,'scope':'LOCAL_FINAL_ART_ENGINE','live_site_qa':False,'physical_iphone_qa':False}
    (ROOT/'references/static-validation.json').write_text(json.dumps(result,indent=2)+'\n')
    print(json.dumps(result,indent=2))
if __name__=='__main__': main()
