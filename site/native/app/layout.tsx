import type { Metadata, Viewport } from 'next';
import './globals.css';
import './module-intros.css';
export const metadata:Metadata={title:'Desert of Desolation',description:'The Seekers of Ra',icons:{icon:[{url:'/favicon.ico',type:'image/x-icon',sizes:'16x16 32x32 48x48 64x64 128x128'},{url:'/logos/icon-black.png',type:'image/png',sizes:'1000x1000',media:'(prefers-color-scheme: light)'},{url:'/logos/icon-white.png',type:'image/png',sizes:'1000x1000',media:'(prefers-color-scheme: dark)'}],shortcut:'/favicon.ico',apple:{url:'/logos/icon-white.png',sizes:'1000x1000',type:'image/png'}}};
export const viewport:Viewport={width:"device-width",initialScale:1,viewportFit:"cover",themeColor:"#101617"};
export default function Layout({children}:{children:React.ReactNode}){return <html lang="en"><body>{children}</body></html>}
