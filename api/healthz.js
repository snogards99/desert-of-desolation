import { VERSION } from "../audio-renderer/mcp-app.js";

export default function handler(req,res){
  res.setHeader("Cache-Control","no-store");
  res.setHeader("Content-Type","application/json; charset=utf-8");

  if(req.method!=="GET"){
    res.setHeader("Allow","GET");
    res.status(405).json({ok:false,error:"method_not_allowed"});
    return;
  }

  res.status(200).json({
    ok:true,
    service:"dod-audio-renderer",
    version:VERSION,
    stateless:true,
    authority:"google-drive",
    railway:false,
    live_elevenlabs:false
  });
}
