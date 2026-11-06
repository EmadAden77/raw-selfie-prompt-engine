import { Camera, ShieldCheck } from 'lucide-react';
export default function Header(){
  return <header className="topbar"><div className="brand"><span className="brand-icon"><Camera size={23}/></span><div><strong>محرك السيلفي الواقعي</strong><span>برومبت دقيق من صورتك المرجعية</span></div></div><div className="header-note"><ShieldCheck size={16}/> هويتك محفوظة في التعليمات</div></header>;
}
