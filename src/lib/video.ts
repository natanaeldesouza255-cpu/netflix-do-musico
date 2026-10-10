export function safeEmbedUrl(value?:string):string|null {
  if(!value)return null;
  try {
    const url=new URL(value);
    if(url.protocol!=='https:'||url.username||url.password||url.port)return null;
    const youtube=['youtube.com','www.youtube.com','youtube-nocookie.com','www.youtube-nocookie.com'].includes(url.hostname)&&/^\/embed\/[A-Za-z0-9_-]+$/.test(url.pathname);
    const vimeo=url.hostname==='player.vimeo.com'&&/^\/video\/\d+$/.test(url.pathname);
    return youtube||vimeo?url.href:null;
  }catch{return null;}
}
