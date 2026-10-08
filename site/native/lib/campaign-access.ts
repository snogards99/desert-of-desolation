import {env} from 'cloudflare:workers';
import source from '../server-data/game.json';
import {createNativeGameService,nativePrincipal} from '../server-runtime/native-game.mjs';
export function gameService(){const e=env as unknown as {DB:D1Database,DOD_CAMPAIGN_OWNER_EMAIL?:string};return createNativeGameService(e.DB,source,e.DOD_CAMPAIGN_OWNER_EMAIL);}
export async function authorizeCampaign(req:Request,campaign:string){return gameService().authorize(nativePrincipal(req),campaign);}
