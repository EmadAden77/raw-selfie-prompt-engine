import { Sparkles } from 'lucide-react';
export default function GenerateButton({loading,onClick,label='توليد البرومبت'}:{loading:boolean;onClick:()=>void;label?:string}){
  return <button type="button" className="button primary" disabled={loading} onClick={onClick}><Sparkles size={18}/>{loading?'جارٍ إنشاء البرومبت...':label}</button>;
}
