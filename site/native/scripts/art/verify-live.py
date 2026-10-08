import json,hashlib,subprocess
from pathlib import Path
from concurrent.futures import ThreadPoolExecutor
origin='https://desert-of-desolation.nreach-1221.chatgpt.site'
root=Path(__file__).resolve().parents[2]
def get(path):
 r=subprocess.run(['curl','-sS','--max-time','45','-w','\n%{http_code}',origin+path],capture_output=True)
 assert r.returncode==0
 body,status=r.stdout.rsplit(b'\n',1);return int(status),body
status,body=get('/api/game?campaign=dod-main');assert status==200;main=json.loads(body)
assert (main['scene'],main['time'],main['revision'])==('dod.prologue.bralizzar.charter',480,2)
assert main['sceneArt']['actor'] is None and main['monsterJournal']==[]
assert 'sha256' not in body.decode() and 'bg.default.' not in body.decode()
status,image=get(main['sceneArt']['environment']['src']);assert status==200
m=json.loads((root/'server-data/scene-art.json').read_text());asset=next(e['assets'][0] for e in m['environments'] if e['environment_id']=='bg.location.bralizzar_room')
assert len(image)==asset['bytes'] and hashlib.sha256(image).hexdigest()==asset['sha256']
paths=['/api/art?campaign=dod-main&revision=2&slot=actor','/api/art?campaign=dod-main&revision=1&slot=environment','/api/art?campaign=dod-main&revision=2&slot=journal','/api/art?campaign=dod-main&revision=2&slot=future','/art/story/troll-alive.png','/art/story/bralizzar-charter.png','/api/art-import']
with ThreadPoolExecutor(max_workers=4) as pool:results=list(pool.map(get,paths))
for path,(status,_) in zip(paths,results):assert status==(403 if path=='/api/art-import' else 404),(path,status)
status,body=get('/api/game?campaign=dod-demo-001');assert status==200;demo=json.loads(body)
assert len(demo['monsterJournal'])==1 and demo['monsterJournal'][0]['image']['src'].endswith('&slot=journal')
status,image=get(demo['monsterJournal'][0]['image']['src']);assert status==200
actor=next(a for a in m['actors'][0]['assets'] if a['state']=='NEUTRAL');assert hashlib.sha256(image).hexdigest()==actor['sha256']
report={'status':'PASS','main_scene':main['scene'],'main_revision':2,'main_time':480,'current_environment_exact_hash':asset['sha256'],'journal_canonical_actor_exact_hash':actor['sha256'],'denied_hidden_actor':True,'denied_stale_revision':True,'denied_main_journal':True,'removed_legacy_unguarded_images':True,'unauthorized_import':403,'campaign_separated_journal':True,'state_writes':0}
(root/'docs/art/live-verification.json').write_text(json.dumps(report,indent=2)+'\n');print(json.dumps(report))
