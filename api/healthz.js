export default function handler(req,res){
  res.status(200).json({
    ok:true,
    service:"dod-audio-renderer",
    version:"0.5.0-rc.1",
    stateless:true
  });
}
