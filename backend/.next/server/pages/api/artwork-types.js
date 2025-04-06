"use strict";(()=>{var e={};e.id=730,e.ids=[730],e.modules={3524:e=>{e.exports=require("@prisma/client")},7096:e=>{e.exports=require("bcrypt")},9344:e=>{e.exports=require("jsonwebtoken")},145:e=>{e.exports=require("next/dist/compiled/next-server/pages-api.runtime.prod.js")},2132:(e,r,t)=>{t.r(r),t.d(r,{config:()=>c,default:()=>d,routeModule:()=>l});var a={};t.r(a),t.d(a,{default:()=>p});var s=t(1802),n=t(7153),o=t(6249),i=t(7864),u=t(9823);let handler=async(e,r)=>{switch(e.method){case"GET":return getArtworkTypes(e,r);case"POST":return createArtworkType(e,r);default:return r.setHeader("Allow",["GET","POST"]),r.status(405).json({error:`Methode ${e.method} niet toegestaan`})}},getArtworkTypes=async(e,r)=>{try{let e=await i.Z.artworkType.findMany({orderBy:{name:"asc"}});return r.status(200).json(e)}catch(e){return console.error("Error fetching artwork types:",e),r.status(500).json({error:"Er is een fout opgetreden bij het ophalen van kunstwerk types."})}},createArtworkType=async(e,r)=>{try{let{name:t}=e.body;if(!t)return r.status(400).json({error:"Naam is verplicht."});let a=await i.Z.artworkType.findFirst({where:{name:{equals:t,mode:"insensitive"}}});if(a)return r.status(400).json({error:"Dit type bestaat al."});let s=await i.Z.artworkType.create({data:{name:t}});return r.status(201).json(s)}catch(e){return console.error("Error creating artwork type:",e),r.status(500).json({error:"Er is een fout opgetreden bij het aanmaken van het kunstwerk type."})}},p=(0,u.fS)(handler),d=(0,o.l)(a,"default"),c=(0,o.l)(a,"config"),l=new s.PagesAPIRouteModule({definition:{kind:n.x.PAGES_API,page:"/api/artwork-types",pathname:"/api/artwork-types",bundlePath:"",filename:""},userland:a})}};var r=require("../../webpack-api-runtime.js");r.C(e);var __webpack_exec__=e=>r(r.s=e),t=r.X(0,[222,896],()=>__webpack_exec__(2132));module.exports=t})();