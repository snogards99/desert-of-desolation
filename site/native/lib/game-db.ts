import { env } from 'cloudflare:workers';
export function gameDB(){return (env as unknown as {DB:D1Database}).DB;}
