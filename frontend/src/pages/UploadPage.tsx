import ReferenceImageUpload from '../components/upload/ReferenceImageUpload';
export default function UploadPage({file,onChange}:{file:File|null;onChange:(file:File|null)=>void}){
  return <ReferenceImageUpload file={file} onChange={onChange}/>;
}
