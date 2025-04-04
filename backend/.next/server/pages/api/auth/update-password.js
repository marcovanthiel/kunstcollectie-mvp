"use strict";(()=>{var e={};e.id=557,e.ids=[557],e.modules={3524:e=>{e.exports=require("@prisma/client")},2139:e=>{e.exports=require("@sendgrid/mail")},7096:e=>{e.exports=require("bcrypt")},9344:e=>{e.exports=require("jsonwebtoken")},145:e=>{e.exports=require("next/dist/compiled/next-server/pages-api.runtime.prod.js")},6113:e=>{e.exports=require("crypto")},6332:(e,r,t)=>{t.r(r),t.d(r,{config:()=>p,default:()=>l,routeModule:()=>c});var a={};t.r(a),t.d(a,{default:()=>u});var s=t(1802),o=t(7153),i=t(6249),n=t(7864),d=t(9823);t(7818),t(6113);let handler=async(e,r)=>{if("POST"!==e.method)return r.setHeader("Allow",["POST"]),r.status(405).json({error:`Methode ${e.method} niet toegestaan`});try{let{token:t,password:a}=e.body;if(!t||!a)return r.status(400).json({error:"Token en wachtwoord zijn verplicht."});if(a.length<8)return r.status(400).json({error:"Wachtwoord moet minimaal 8 tekens bevatten."});let s=await n.Z.user.findFirst({where:{email:e.body.email}});if(!s)return r.status(200).json({message:"Wachtwoord is succesvol bijgewerkt."});let o=await (0,d.c_)(a);return await n.Z.user.update({where:{id:s.id},data:{password:o}}),r.status(200).json({message:"Wachtwoord is succesvol bijgewerkt."})}catch(e){return console.error("Password update error:",e),r.status(500).json({error:"Er is een fout opgetreden bij het bijwerken van het wachtwoord."})}},u=handler,l=(0,i.l)(a,"default"),p=(0,i.l)(a,"config"),c=new s.PagesAPIRouteModule({definition:{kind:o.x.PAGES_API,page:"/api/auth/update-password",pathname:"/api/auth/update-password",bundlePath:"",filename:""},userland:a})}};var r=require("../../../webpack-api-runtime.js");r.C(e);var __webpack_exec__=e=>r(r.s=e),t=r.X(0,[222,896,818],()=>__webpack_exec__(6332));module.exports=t})();