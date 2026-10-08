"""Decode approved original MP3s for objective source QA; never generate campaign media."""
from pathlib import Path
import json, subprocess, hashlib
import numpy as np
rows=json.loads(Path('server-data/audio.json').read_text())
policy=Path('lib/media-policy.mjs').read_text()
import re
paths=dict(re.findall(r'\[\s*[\'\"]([^\'\"]+)[\'\"],\s*[\'\"](/audio/[^\'\"]+)[\'\"]\]',policy))
metrics=[]
for media_id,relative in paths.items():
 row=next(x for x in rows if x['media_id']==media_id);path=Path('public'+relative);data=path.read_bytes()
 assert len(data)==row['bytes'] and hashlib.sha256(data).hexdigest()==row['sha256']
 raw=subprocess.check_output(['ffmpeg','-v','error','-i',str(path),'-f','f32le','-ac','2','-ar','22050','pipe:1'])
 samples=np.frombuffer(raw,dtype='<f4').reshape(-1,2);assert np.isfinite(samples).all()
 count=len(samples);windows=samples[:count//1102*1102].reshape(-1,1102,2);rms=np.sqrt(np.mean(windows**2,axis=(1,2)));active=rms[rms>.01]
 metrics.append({'media_id':media_id,'duration_seconds':round(count/22050,3),'decoded_peak':round(float(np.max(np.abs(samples))),5),'quiet_windows_below_minus40_db_percent':round(float(np.mean(rms<=.01)*100),1),'active_rms_dynamic_range_db':round(float(20*np.log10(np.percentile(active,90)/np.percentile(active,10))),2) if len(active)>1 else None,'original_sha256':row['sha256']})
Path('docs/LISTENING_ASSET_QA_ALPHA19.json').write_text(json.dumps({'method':'Decode original bytes into temporary float samples; 50ms RMS windows; source metrics, not listening or runtime output QA','assets':metrics,'generated_audio':False},indent=2)+'\n')
print('PASS:',len(metrics),'original MP3 hashes, finite decoding, measured source peaks and sound density; no audio regeneration.')
for m in metrics:
 if 'voice.narrator' in m['media_id']:print(m['media_id'],m['duration_seconds'],'seconds;',m['quiet_windows_below_minus40_db_percent'],'% quiet windows')
