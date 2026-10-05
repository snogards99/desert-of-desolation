import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { createMcp } from "../audio-renderer/mcp-app.js";

export const config={maxDuration:30};

function setHeaders(res){
  res.setHeader("Access-Control-Allow-Origin","*");
  res.setHeader("Access-Control-Allow-Methods","GET, POST, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers","Content-Type, Accept, Mcp-Session-Id, Last-Event-ID");
  res.setHeader("Access-Control-Expose-Headers","Mcp-Session-Id");
  res.setHeader("Cache-Control","no-store");
  res.setHeader("Vary","Origin");
}

export default async function handler(req,res){
  setHeaders(res);

  if(req.method==="OPTIONS"){
    res.status(204).end();
    return;
  }

  if(!["GET","POST","DELETE"].includes(req.method||"")){
    res.setHeader("Allow","GET, POST, DELETE, OPTIONS");
    res.status(405).json({error:"method_not_allowed"});
    return;
  }

  const mcp=createMcp();
  const transport=new StreamableHTTPServerTransport({sessionIdGenerator:undefined});
  res.on("close",()=>{try{transport.close();}catch{} try{mcp.close?.();}catch{}});

  try{
    await mcp.connect(transport);
    await transport.handleRequest(req,res);
  }catch(err){
    console.error("MCP transport error",err);
    if(!res.headersSent) res.status(500).json({error:"mcp_transport_error"});
  }
}
