#!/usr/bin/env python3
"""Render and exercise supplied local HTML. No navigation, host requests or audio."""
from pathlib import Path
import argparse, json
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[1]
def run(preview,executable):
    checks=[]
    def check(name,ok):
        if not ok:raise AssertionError(name)
        checks.append(name)
    with sync_playwright() as p:
        browser=p.chromium.launch(executable_path=executable,headless=True,args=['--no-sandbox'])
        ui=browser.new_page();external=[];errors=[]
        def block(route):external.append(route.request.url);route.abort()
        ui.route('**/*',block);ui.on('pageerror',lambda e:errors.append(str(e)))
        ui.set_content(preview.read_text(),wait_until='load')
        for width in [320,390,768,1440]:
            ui.set_viewport_size({'width':width,'height':900})
            check(f'no overflow at {width}px',ui.evaluate('document.documentElement.scrollWidth <= window.innerWidth'))
            sizes=ui.locator('button, input, .dod-button').evaluate_all('(els)=>els.filter(e=>e.offsetParent!==null).map(e=>({w:e.getBoundingClientRect().width,h:e.getBoundingClientRect().height}))')
            check(f'44px controls at {width}px',all(x['w']>=44 and x['h']>=44 for x in sizes))
        ui.set_viewport_size({'width':390,'height':844})
        for panel in ['journal','inventory','map','dialogue']:
            ui.locator(f'[data-panel="{panel}"]').click();check(f'{panel} preview switches',ui.locator(f'[data-content="{panel}"]').is_visible())
        ui.locator('#action-input').fill('Sample only');ui.locator('#action button').click()
        check('action fixture does not dispatch game action','No campaign action sent' in ui.locator('#action-result').inner_text())
        ui.emulate_media(reduced_motion='reduce');check('reduced motion preference visible',ui.evaluate("matchMedia('(prefers-reduced-motion: reduce)').matches"))
        ui.locator('#action-input').focus();check('visible keyboard focus',ui.locator('#action-input').evaluate('(el)=>getComputedStyle(el).outlineStyle')=='solid')
        ui.add_style_tag(content='html {font-size:200% !important}')
        check('200% text no horizontal overflow',ui.evaluate('document.documentElement.scrollWidth <= window.innerWidth'))
        check('private preview no external requests',not external)
        check('all preview images decode',ui.locator('img').evaluate_all('(imgs)=>imgs.every(i=>i.complete&&i.naturalWidth>0)'))
        check('no script errors',not errors)
        browser.close()
    report={'status':'PASS','checks_passed':len(checks),'checks':checks,'environment':'Headless Chromium, local HTML via set_content, no navigation','live_site_tested':False,'audio_playback_tested':False,'physical_device_tested':False}
    (ROOT/'references/browser-validation.json').write_text(json.dumps(report,indent=2)+'\n')
    print(json.dumps({'status':report['status'],'checks_passed':len(checks)},indent=2))
if __name__=='__main__':
    parser=argparse.ArgumentParser(description=__doc__);parser.add_argument('--preview',type=Path,required=True);parser.add_argument('--chromium',default='/usr/bin/chromium');a=parser.parse_args();run(a.preview,a.chromium)
