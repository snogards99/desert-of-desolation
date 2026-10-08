import sqlite3,json,pathlib,hashlib
s=json.loads(pathlib.Path('server-data/game.json').read_text());c=sqlite3.connect(':memory:');c.executescript(pathlib.Path('drizzle/0000_flaky_absorbing_man.sql').read_text());
for row in s['HotRuntimeSnapshot']:
 c.execute('INSERT INTO campaigns VALUES(?,?,?)',(row['campaign_id'],json.dumps(row),int(row['snapshot_revision'])))
before=c.execute('SELECT * FROM campaigns ORDER BY id').fetchall()
assert len(before)==2
# Pending adjudication journals the request, with no gameplay state mutation.
c.execute('INSERT INTO actions VALUES(?,?,?,?,?)',('test','dod-main','Look around','AWAITING_RULES_RESOLUTION','now'))
assert c.execute('SELECT * FROM campaigns ORDER BY id').fetchall()==before
public_json=list(pathlib.Path('public').rglob('*.json'))
assert set(public_json)=={pathlib.Path('public/logos/manifest.json')}
logos=json.loads(public_json[0].read_text())
assert set(logos)=={'schema_version','status','policy','assets'}
assert logos['status']=='OFFICIAL_USER_SUPPLIED'
assert {a['file'] for a in logos['assets']}=={'icon-white.png','icon-black.png','favicon.ico'}
for asset in logos['assets']:
 assert set(asset)=={'file','sha256','role','sizes'}
 assert hashlib.sha256((pathlib.Path('public/logos')/asset['file']).read_bytes()).hexdigest()==asset['sha256']
print('Both baseline checkpoints preserved; pending actions leave state unchanged; no public campaign JSON.')
