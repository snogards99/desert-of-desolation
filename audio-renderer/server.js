import { createServer } from "node:http";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { createMcp, VERSION } from "./mcp-app.js";

const http=createServer(async(req,res)=>{
  res.setHeader("Cache-Control","no-store");

  if(req.url==="/healthz"){
    res.writeHead(200,{"content-type":"application/json; charset=utf-8"});
    res.end(JSON.stringify({ok:true,service:"dod-audio-renderer",version:VERSION,stateless:true}));
    return;
  }

  if(req.url!=="/mcp"){
    res.writeHead(404,{"content-type":"application/json; charset=utf-8"});
    res.end(JSON.stringify({error:"not_found"}));
    return;
  }

  if(!["GET","POST","DELETE"].includes(req.method||"")){
    res.writeHead(405,{"content-type":"application/json; charset=utf-8","allow":"GET, POST, DELETE"});
    res.end(JSON.stringify({error:"method_not_allowed"}));
    return;
  }

  const mcp=createMcp();
  const transport=new StreamableHTTPServerTransport({sessionIdGenerator:undefined});
  res.on("close",()=>{try{transport.close();}catch{} try{mcp.close?.();}catch{}});

  try{
    await mcp.connect(transport);
    await transport.handleRequest(req,res);
  }catch(err){
    if(!res.headersSent){
      res.writeHead(500,{"content-type":"application/json; charset=utf-8"});
      res.end(JSON.stringify({error:"mcp_transport_error"}));
    }
    console.error("MCP transport error",err);
  }
});

const port=Number(process.env.PORT||8787);
http.listen(port,"0.0.0.0",()=>console.log(`DOD audio MCP v${VERSION} listening on :${port}/mcp`));
