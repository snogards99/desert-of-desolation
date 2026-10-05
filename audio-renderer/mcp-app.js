import { readFileSync } from "node:fs";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { registerAppResource, registerAppTool, RESOURCE_MIME_TYPE } from "@modelcontextprotocol/ext-apps/server";
import { z } from "zod";

export const VERSION="0.5.0-rc.2";
export const UI_URI="ui://dod-audio/v3.html";
const html=readFileSync(new URL("./public/audio-widget.html",import.meta.url),"utf8");
const bus=z.enum(["narrator","dialogue","ambience","music","sfx"]);
const common={audio_id:z.string().min(1),audio_epoch:z.number().int().nonnegative()};

function reply(structuredContent,text=""){
  return {structuredContent,content:text?[{type:"text",text}]:[]};
}

export function createMcp(){
  const mcp=new McpServer(
    {name:"dod-audio-renderer",version:VERSION},
    {instructions:"Render only approved current-epoch audio. A PLAYING state is authoritative only when report_audio_status returns accepted=true for the same audio_epoch."}
  );

  registerAppResource(mcp,"dod-audio",UI_URI,{},async()=>({
    contents:[{uri:UI_URI,mimeType:RESOURCE_MIME_TYPE,text:html,_meta:{ui:{prefersBorder:true}}}]
  }));

  registerAppTool(mcp,"show_audio_player",{
    title:"Show Desert of Desolation audio player",
    description:"Mount the persistent audio player and prepare for a one-time user gesture unlock.",
    inputSchema:{audio_epoch:z.number().int().nonnegative()},
    _meta:{ui:{resourceUri:UI_URI}}
  },async x=>reply({command:"SHOW",...x,status:"READY_FOR_USER_GESTURE"},"Audio player mounted."));

  registerAppTool(mcp,"get_audio_capabilities",{
    title:"Get audio capabilities",
    description:"Return the renderer feature contract before session playback begins.",
    inputSchema:{},
    _meta:{}
  },async()=>reply({
    renderer:"dod-audio-renderer",
    version:VERSION,
    stateless:true,
    buses:["narrator","dialogue","ambience","music","sfx"],
    max_voices:12,
    preload:true,
    stereo_pan:true,
    distance:true,
    ducking:true,
    epoch_invalidation:true,
    playing_proof:"report_audio_status acknowledgement"
  }));

  registerAppTool(mcp,"preload_audio",{
    title:"Preload game audio",
    description:"Stage an approved current-epoch asset without audible playback.",
    inputSchema:{...common,url:z.string().url(),bus:bus.default("sfx"),gain:z.number().min(0).max(2).optional(),loop:z.boolean().optional()},
    _meta:{ui:{resourceUri:UI_URI}}
  },async x=>reply({command:"PRELOAD",...x,status:"FETCHING"}));

  registerAppTool(mcp,"play_audio",{
    title:"Play game audio",
    description:"Queue an approved asset. Do not treat it as audible until report_audio_status acknowledges PLAYING for the same epoch.",
    inputSchema:{...common,url:z.string().url().optional(),bus:bus.default("sfx"),gain:z.number().min(0).max(2).optional(),loop:z.boolean().optional(),pan:z.number().min(-1).max(1).optional(),distance:z.number().min(0).max(1).optional()},
    _meta:{ui:{resourceUri:UI_URI}}
  },async x=>reply({command:"PLAY",...x,status:"QUEUED"}));

  registerAppTool(mcp,"stop_audio",{
    title:"Stop game audio",
    description:"Stop one voice with optional fade.",
    inputSchema:{...common,fade_ms:z.number().int().min(0).max(10000).optional()},
    _meta:{ui:{resourceUri:UI_URI}}
  },async x=>reply({command:"STOP",...x,status:"STOP_REQUESTED"}));

  registerAppTool(mcp,"clear_audio_epoch",{
    title:"Clear stale audio epoch",
    description:"Stop stale voices and move the renderer to a new epoch.",
    inputSchema:{audio_epoch:z.number().int().nonnegative()},
    _meta:{ui:{resourceUri:UI_URI}}
  },async x=>reply({command:"CLEAR_EPOCH",...x,status:"CLEAR_REQUESTED"}));

  registerAppTool(mcp,"set_bus_gain",{
    title:"Set audio bus gain",
    description:"Set one logical bus gain.",
    inputSchema:{audio_epoch:z.number().int().nonnegative(),bus,gain:z.number().min(0).max(1)},
    _meta:{ui:{resourceUri:UI_URI}}
  },async x=>reply({command:"BUS_GAIN",...x,status:"APPLY_REQUESTED"}));

  registerAppTool(mcp,"set_master_gain",{
    title:"Set master gain",
    description:"Set master playback gain.",
    inputSchema:{audio_epoch:z.number().int().nonnegative(),gain:z.number().min(0).max(1)},
    _meta:{ui:{resourceUri:UI_URI}}
  },async x=>reply({command:"MASTER",...x,status:"APPLY_REQUESTED"}));

  registerAppTool(mcp,"duck_bus",{
    title:"Duck audio bus",
    description:"Smoothly duck a bus for speech intelligibility.",
    inputSchema:{audio_epoch:z.number().int().nonnegative(),bus,gain:z.number().min(0).max(1),attack_ms:z.number().int().min(10).max(3000).default(120),hold_ms:z.number().int().min(0).max(30000).default(0),release_ms:z.number().int().min(10).max(5000).default(700)},
    _meta:{ui:{resourceUri:UI_URI}}
  },async x=>reply({command:"DUCK",...x,status:"APPLY_REQUESTED"}));

  registerAppTool(mcp,"set_emitter_position",{
    title:"Set emitter position",
    description:"Update lightweight pan and distance for one current voice.",
    inputSchema:{...common,pan:z.number().min(-1).max(1),distance:z.number().min(0).max(1)},
    _meta:{ui:{resourceUri:UI_URI}}
  },async x=>reply({command:"POSITION",...x,status:"APPLY_REQUESTED"}));

  registerAppTool(mcp,"report_audio_status",{
    title:"Report audio status",
    description:"Widget callback. This acknowledgement is the authoritative playback proof for READY, PLAYING, STOPPED, FAILED, or STALE.",
    inputSchema:{...common,status:z.enum(["READY","PLAYING","STOPPED","FAILED","STALE"]),renderer_id:z.string().min(1),detail:z.string().optional(),started_at:z.string().optional()},
    _meta:{}
  },async x=>reply({accepted:true,proof:"renderer_ack",...x,acknowledged_at:new Date().toISOString()}));

  return mcp;
}
