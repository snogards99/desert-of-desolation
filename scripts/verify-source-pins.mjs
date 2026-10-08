import fs from 'node:fs';import path from 'node:path';import {createHash} from 'node:crypto';import {pathToFileURL} from 'node:url';
export const pinRoots=['skills/desert-of-desolation-game/site-runtime','skills/desert-of-desolation-game/server-runtime'];
export const pinFiles=['plugin.json','.codex-plugin/plugin.json','RELEASE_COMPONENTS.json','skills/desert-of-desolation-game/data/ACTIVE_POLICY_OVERRIDES.json','skills/desert-of-desolation-game/data/HOSTING_CONFIG.json','skills/desert-of-desolation-game/data/SITE_PRESENTATION_PROFILE.json','skills/desert-of-desolation-game/data/TIME_OF_DAY_POLICY.json','skills/desert-of-desolation-game/data/VISUAL_THEME.json','skills/desert-of-desolation-game/data/imagery/NODE_IMAGE_STATE_POLICY.json','skills/desert-of-desolation-art-direction/assets/art-engine.json','skills/desert-of-desolation-art-direction/assets/art-engine.mjs'];
export function sourcePaths(plugin){const found=[...pinFiles];function walk(rel){for(const e of fs.readdirSync(path.join(plugin,rel),{withFileTypes:true})){const p=rel+'/'+e.name;if(e.isSymbolicLink())throw Error('Source symlink forbidden: '+p);if(e.isDirectory())walk(p);else if(e.isFile())found.push(p);}}pinRoots.forEach(walk);return [...new Set(found)].sort();}
export function verifySourcePins(root=process.cwd()){
 const plugin=path.join(root,'plugin'),manifest=JSON.parse(fs.readFileSync(path.join(plugin,'SOURCE_INTEGRITY.json'),'utf8')),version=JSON.parse(fs.readFileSync(path.join(plugin,'plugin.json'),'utf8')).version;
 if(manifest.schema_version!==1||manifest.release!==version||manifest.algorithm!=='sha256')throw Error('Source integrity identity mismatch');
 const paths=sourcePaths(plugin);if(JSON.stringify(Object.keys(manifest.files).sort())!==JSON.stringify(paths))throw Error('Source integrity coverage mismatch');
 for(const p of paths){const sha=createHash('sha256').update(fs.readFileSync(path.join(plugin,p))).digest('hex');if(sha!==manifest.files[p])throw Error('Source hash mismatch: '+p);}
 return {release:version,files:paths.length};
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href){const result=verifySourcePins();console.log(`${result.release}: ${result.files} source SHA-256 pins verified.`);}
