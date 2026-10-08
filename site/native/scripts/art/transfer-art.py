"""Upload/check exact approved PNG bytes. Credentials arrive only on hidden stdin."""
import sys, json, subprocess, hashlib
from pathlib import Path
from concurrent.futures import ThreadPoolExecutor
if sys.stdin.isatty():
 import termios
 t=termios.tcgetattr(sys.stdin);t[3]&=~termios.ECHO;termios.tcsetattr(sys.stdin,termios.TCSANOW,t)
 print('Ready for image transfer JSON (input hidden)',flush=True)
c=json.loads(sys.stdin.readline());base=c['origin'].rstrip('/');headers={'x-art-import-key':c['key']}
m=json.loads(Path(__file__).resolve().parents[2].joinpath('server-data/scene-art.json').read_text())
assets=[a for e in m['environments']+m['actors'] for a in e['assets']]
root=Path(__file__).resolve().parents[2]
def upload(a):
 data=(root/'plugin-art-update'/a['package_path']).read_bytes()
 assert len(data)==a['bytes'] and hashlib.sha256(data).hexdigest()==a['sha256']
 r=subprocess.run(['curl','--fail-with-body','-sS','--max-time','120','--config','-','-H','Content-Type: image/png','--data-binary','@'+str(root/'plugin-art-update'/a['package_path']),base+'/api/art-import?key='+a['sha256']],input='header = '+json.dumps('x-art-import-key: '+c['key'])+'\n',capture_output=True,text=True)
 if r.returncode: raise RuntimeError('Image transfer failed: '+str(r.returncode)+' '+r.stdout[:150])
 result=json.loads(r.stdout)
 assert result['verified'] and result['key']==a['sha256']
 return a['sha256']
def check():
 r=subprocess.run(['curl','--fail-with-body','-sS','--max-time','120','--config','-',base+'/api/art-import'],input='header = '+json.dumps('x-art-import-key: '+c['key'])+'\n',capture_output=True,text=True)
 if r.returncode:raise RuntimeError('Storage verification failed: '+str(r.returncode))
 return json.loads(r.stdout)
initial=check()
if c.get('mode','upload')=='upload' and initial['verified']!=len(assets):
 pending=[a for a in assets if a['sha256'] in initial.get('missing',[x['sha256'] for x in assets])]
 with ThreadPoolExecutor(max_workers=6) as pool:done=list(pool.map(upload,pending))
 print(json.dumps({'uploaded':len(done)}),flush=True)
result=check()
assert result['verified']==result['expected']==len(assets),result
print(json.dumps(result),flush=True)
