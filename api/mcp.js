import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { createMcp } from "../audio-renderer/mcp-app.js";

export const config={maxDuration:30};

export default async function handler(req,res){
  if(req.method==="OPTIONS"){
    res.setHeader("Access-Control-Allow-Origin","*");
    res.setHeader("Access-Control-Allow-Methods","GET,POST,DELETE,OPTIONS");
    res.setHeader("Access-Control-Allow-Headers","Content-Type,Accept,Mcp-Session-Id,Last-Event-ID");
    res.status(204).end();
    return;
  }

  const mcp=createMcp();
  const transport=new StreamableHTTPServerTransport({sessionIdGenerator:undefined});
  res.on("close",()=>{try{transport.close();}catch{} try{mcp.close?.();}catch{}});
  try{
    await mcp.connect(transport);
    await transport.handleRequest(req,res);
  }catch(err){
    if(!res.headersSent) res.status(500).json({error:"mcp_transport_error",message:String(err?.message||err)});
  }
}
