import type { ErrorRequestHandler, RequestHandler } from 'express';
import { ZodError } from 'zod';

export const notFound:RequestHandler=(_req,res)=>{
  res.status(404).json({error:'المسار غير موجود'});
};
export const errorHandler:ErrorRequestHandler=(error:unknown,_req,res,_next)=>{
  if(error instanceof ZodError){
    res.status(400).json({error:'بيانات الاختيارات غير صالحة',details:error.issues.map(i=>({path:i.path.join('.'),message:'قيمة غير صالحة'}))});
    return;
  }
  if(error instanceof SyntaxError&&'body' in error){
    res.status(400).json({error:'صيغة الطلب غير صالحة'});
    return;
  }
  if(error instanceof Error&&error.message==='Internal prompt rules failed validation'){
    res.status(500).json({error:'تعذّر إنشاء البرومبت بالقواعد المحلية'});
    return;
  }
  res.status(500).json({error:'حدث خطأ غير متوقع'});
};

