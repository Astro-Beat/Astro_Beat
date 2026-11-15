// ===== MODULE: UTIL + RNG =====
(function(AB){
'use strict';
const $=s=>document.querySelector(s);
const clamp=(v,a,b)=>Math.min(b,Math.max(a,v));
const g=(v,d)=>v==null?d:v;
const fx=(v,d=0)=>v==null?"—":v.toFixed(d);
const clk=()=>new Date().toLocaleTimeString("es",{hour:"2-digit",minute:"2-digit"});
function mulberry32(a){
  return()=>{
    a|=0; a=a+0x6D2B79F5|0;
    let t=Math.imul(a^a>>>15,1|a);
    t=t+Math.imul(t^t>>>7,61|t)^t;
    return ((t^t>>>14)>>>0)/4294967296;
  };
}
function gaussOf(rng){
  const u1=Math.max(rng(),1e-12),u2=rng();
  return Math.sqrt(-2*Math.log(u1))*Math.cos(2*Math.PI*u2);
}
Object.assign(AB,{$,clamp,g,fx,clk,mulberry32,gaussOf});
})(window.AstroBeat=window.AstroBeat||{});