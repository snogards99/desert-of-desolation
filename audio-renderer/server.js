import { createServer } from "node:http";
import { readFileSync } from "node:fs";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { registerAppResource, registerAppTool, RESOURCE_MIME_TYPE } from "@modelcontextprotocol/ext-apps/server";
import { z } from "zod";

const VERSION = "0.2.0";
const UI_URI = "ui://dod-audio/v2.html";
const html = readFileSync(new URL("./public/audio-widget.html", import.meta.url), "utf8");
const latestStatus = new Map();
const common = { audio_id: z.string().min(1), audio_epoch: z.number().int().nonnegative() };
const bus = z.enum(["narrator", "dialogue", "ambience", "music", "sfx"]);

function reply(structuredContent, text = "") {
  return { structuredContent, content: text ? [{ type: "text", text }] : [] };
}

function createMcp() {
  const mcp = new McpServer(
    { name: "dod-audio-renderer", version: VERSION },
    { instructions: "Render only current-epoch approved audio. Never claim PLAYING unless the UI reports it. Preserve player agency and spoiler gates." }
  );

  registerAppResource(mcp, "dod-audio", UI_URI, {}, async () => ({
    contents: [{
      uri: UI_URI,
      mimeType: RESOURCE_MIME_TYPE,
      text: html,
      _meta: { ui: { prefersBorder: true } }
    }]
  }));

  registerAppTool(mcp, "show_audio_player", {
    title: "Show Desert of Desolation audio player",
    description: "Mount the persistent in-chat Desert of Desolation audio player before issuing playback commands.",
    inputSchema: { audio_epoch: z.number().int().nonnegative() },
    _meta: { ui: { resourceUri: UI_URI } }
  }, async (x) => reply({ command: "SHOW", ...x, status: "READY_FOR_USER_GESTURE" }, "Audio player mounted."));

  registerAppTool(mcp, "preload_audio", {
    title: "Preload game audio",
    description: "Stage one approved current-epoch audio URL in the in-chat player without starting audible playback.",
    inputSchema: { ...common, url: z.string().url(), bus: bus.default("sfx"), gain: z.number().min(0).max(2).optional(), loop: z.boolean().optional() },
    _meta: { ui: { resourceUri: UI_URI } }
  }, async (x) => reply({ command: "PRELOAD", ...x, status: "FETCHING" }, `Preloading ${x.audio_id}.`));

  registerAppTool(mcp, "play_audio", {
    title: "Play game audio",
    description: "Start one approved Desert of Desolation audio asset after mechanics and spoiler gates resolve. If it was not preloaded, the UI stages it first.",
    inputSchema: { ...common, url: z.string().url().optional(), bus: bus.default("sfx"), gain: z.number().min(0).max(2).optional(), loop: z.boolean().optional(), pan: z.number().min(-1).max(1).optional(), distance: z.number().min(0).max(1).optional() },
    _meta: { ui: { resourceUri: UI_URI } }
  }, async (x) => reply({ command: "PLAY", ...x, status: "QUEUED" }, `Queued ${x.audio_id}; renderer confirmation is required before treating it as playing.`));

  registerAppTool(mcp, "stop_audio", {
    title: "Stop game audio",
    description: "Stop one current audio voice.",
    inputSchema: { ...common, fade_ms: z.number().int().min(0).max(10000).optional() },
    _meta: { ui: { resourceUri: UI_URI } }
  }, async (x) => reply({ command: "STOP", ...x, status: "STOP_REQUESTED" }));

  registerAppTool(mcp, "clear_audio_epoch", {
    title: "Clear stale game audio",
    description: "Stop all voices from stale gameplay context and advance the audio epoch.",
    inputSchema: { audio_epoch: z.number().int().nonnegative() },
    _meta: { ui: { resourceUri: UI_URI } }
  }, async (x) => reply({ command: "CLEAR_EPOCH", ...x, status: "CLEAR_REQUESTED" }));

  registerAppTool(mcp, "set_bus_gain", {
    title: "Set game audio bus gain",
    description: "Adjust one non-destructive logical game-audio bus.",
    inputSchema: { audio_epoch: z.number().int().nonnegative(), bus, gain: z.number().min(0).max(1) },
    _meta: { ui: { resourceUri: UI_URI } }
  }, async (x) => reply({ command: "BUS_GAIN", ...x, status: "APPLY_REQUESTED" }));

  registerAppTool(mcp, "set_master_gain", {
    title: "Set master game audio gain",
    description: "Adjust non-destructive master playback gain.",
    inputSchema: { audio_epoch: z.number().int().nonnegative(), gain: z.number().min(0).max(1) },
    _meta: { ui: { resourceUri: UI_URI } }
  }, async (x) => reply({ command: "MASTER", ...x, status: "APPLY_REQUESTED" }));

  registerAppTool(mcp, "duck_bus", {
    title: "Duck game audio bus",
    description: "Smoothly duck a bus for speech intelligibility, then optionally release after a duration.",
    inputSchema: { audio_epoch: z.number().int().nonnegative(), bus, gain: z.number().min(0).max(1), attack_ms: z.number().int().min(10).max(3000).default(120), hold_ms: z.number().int().min(0).max(30000).default(0), release_ms: z.number().int().min(10).max(5000).default(700) },
    _meta: { ui: { resourceUri: UI_URI } }
  }, async (x) => reply({ command: "DUCK", ...x, status: "APPLY_REQUESTED" }));

  registerAppTool(mcp, "set_emitter_position", {
    title: "Set game audio position",
    description: "Update lightweight stereo pan and distance attenuation for one current voice.",
    inputSchema: { ...common, pan: z.number().min(-1).max(1), distance: z.number().min(0).max(1) },
    _meta: { ui: { resourceUri: UI_URI } }
  }, async (x) => reply({ command: "POSITION", ...x, status: "APPLY_REQUESTED" }));

  registerAppTool(mcp, "report_audio_status", {
    title: "Report audio renderer status",
    description: "Internal callback used by the audio UI to report actual preload/playback state.",
    inputSchema: { ...common, status: z.enum(["READY", "PLAYING", "STOPPED", "FAILED", "STALE"]), renderer_id: z.string().min(1), detail: z.string().optional(), started_at: z.string().optional() }
  }, async (x) => {
    latestStatus.set(x.audio_id, { ...x, updated_at: new Date().toISOString() });
    return reply({ accepted: true, ...x });
  });

  registerAppTool(mcp, "get_audio_status", {
    title: "Get audio renderer status",
    description: "Read the latest UI-confirmed status for an audio id. Use this when playback confirmation matters.",
    inputSchema: { audio_id: z.string().min(1) }
  }, async ({ audio_id }) => {
    const status = latestStatus.get(audio_id) ?? { audio_id, status: "UNKNOWN" };
    return reply(status, `Latest renderer status for ${audio_id}: ${status.status}.`);
  });

  return mcp;
}

const http = createServer(async (req, res) => {
  if (req.url === "/healthz") {
    res.writeHead(200, { "content-type": "application/json" });
    res.end(JSON.stringify({ ok: true, service: "dod-audio-renderer", version: VERSION }));
    return;
  }
  if (req.url !== "/mcp") {
    res.writeHead(404, { "content-type": "text/plain" });
    res.end("Not found");
    return;
  }
  const mcp = createMcp();
  const transport = new StreamableHTTPServerTransport({ sessionIdGenerator: undefined });
  res.on("close", () => { transport.close(); mcp.close?.(); });
  await mcp.connect(transport);
  await transport.handleRequest(req, res);
});

const port = Number(process.env.PORT || 8787);
http.listen(port, "0.0.0.0", () => console.log(`DOD audio MCP v${VERSION} listening on :${port}/mcp`));
