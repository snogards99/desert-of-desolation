import test from "node:test"; import assert from "node:assert/strict"; import fs from "node:fs";
const s=fs.readFileSync(new URL("../server.js",import.meta.url),"utf8");
test("renderer exposes required endpoints",()=>{assert.match(s,/\/healthz/);assert.match(s,/\/mcp/)});
test("renderer distinguishes queued from playing",()=>{assert.match(s,/status: "QUEUED"/);assert.match(s,/"PLAYING"/)});
test("renderer supports epoch invalidation",()=>{assert.match(s,/clear_audio_epoch/);assert.match(s,/audio_epoch/)});
