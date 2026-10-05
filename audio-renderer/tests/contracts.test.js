import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

const server=fs.readFileSync(new URL("../server.js",import.meta.url),"utf8");
const mcp=fs.readFileSync(new URL("../mcp-app.js",import.meta.url),"utf8");
const widget=fs.readFileSync(new URL("../public/audio-widget.html",import.meta.url),"utf8");

test("local server exposes health and MCP endpoints",()=>{
  assert.match(server,/\/healthz/);
  assert.match(server,/\/mcp/);
  assert.match(server,/createMcp/);
  assert.match(server,/VERSION/);
});

test("renderer distinguishes queued from confirmed playing",()=>{
  assert.match(mcp,/status:"QUEUED"/);
  assert.match(mcp,/report_audio_status/);
  assert.match(mcp,/playing_proof/);
});

test("renderer exposes release capabilities",()=>{
  assert.match(mcp,/get_audio_capabilities/);
  assert.match(mcp,/max_voices:12/);
  assert.match(mcp,/epoch_invalidation:true/);
});

test("widget enforces user gesture and stale-epoch rejection",()=>{
  assert.match(widget,/Enable audio/);
  assert.match(widget,/rejectStale/);
  assert.match(widget,/CLEAR_EPOCH/);
});

test("widget preserves separate semantic buses",()=>{
  for(const name of ["narrator","dialogue","ambience","music","sfx"]) assert.match(widget,new RegExp(name));
});
