// ===== MODULE: RENDER + NAVIGATION + TOAST/BEEP =====
(function(AB){
'use strict';
const {$}=AB;
const track=$("#track"),glass=$("#glass");
const G=AB.G;

function fit(pg){
  let b=pg.clientWidth/17;
  pg.style.fontSize=b+"px";
  for(let k=0;k<5&&pg.scrollHeight>pg.clientHeight+1;k++){
    b*=pg.clientHeight/pg.scrollHeight*.985;
    pg.style.fontSize=b+"px";
  }
}
let pressed=false,pending=false,raf=0;
function schedule(){if(raf)return;raf=requestAnimationFrame(()=>{raf=0;render();});}
function render(force){
  const V=AB.K.V;if(!V)return;
  const ae=document.activeElement;
  if(!force&&(pressed||(ae&&/INPUT/.test(ae.tagName)&&ae.closest(".pg")))){pending=true;return;}
  pending=false;
  const old=[...track.children].map(p=>p.scrollTop);
  const act=document.activeElement;
  const hold=act&&act.closest&&act.closest(".pg");
  if(track.children.length!==AB.SCREENS.length){
    track.innerHTML=AB.SCREENS.map((_,i)=>`<section class="pg" aria-label="Pantalla ${i+1}"></section>`).join("");
  }
  AB.SCREENS.forEach((f,i)=>{
    const pg=track.children[i];
    const h=Math.abs(i-G.idx)<=1?f(V):"";
    const cls="pg"+(i===11&&V.glob===2?" red":"");
    if(pg.className!==cls)pg.className=cls;
    if(pg._h!==h){pg._h=h;pg.innerHTML=h;fit(pg);}
  });
  [...track.children].forEach((p,i)=>p.scrollTop=old[i]||0);
  $("#dots").innerHTML=AB.SCREENS.map((_,i)=>`<i class="${i===G.idx?"on":""}"></i>`).join("");
}
function go(n){
  const N=AB.SCREENS.length,to=((n%N)+N)%N,far=Math.abs(to-G.idx)>1;
  G.idx=to;
  if(far)track.style.transition="none";
  track.style.transform=`translateX(calc(${-G.idx} * var(--s)))`;
  if(far){void track.offsetWidth;track.style.transition="";}
  render(true);
  $("#dots").innerHTML=AB.SCREENS.map((_,i)=>`<i class="${i===G.idx?"on":""}"></i>`).join("");
}
function toast(t){
  const e=$("#toast");
  e.textContent=t;e.classList.add("on");
  clearTimeout(toast.h);toast.h=setTimeout(()=>e.classList.remove("on"),2200);
}
function beep(){
  if(!G.sound)return;
  try{
    const a=new (window.AudioContext||window.webkitAudioContext)();
    const o=a.createOscillator(),v=a.createGain();
    o.frequency.value=880;v.gain.value=.08;
    o.connect(v);v.connect(a.destination);
    o.start();o.stop(a.currentTime+.25);
  }catch(e){}
}
function logE(t){
  G.log.unshift(`${AB.clk()} ${t}`);
  G.log.length=Math.min(G.log.length,40);
  const l=$("#log");
  if(l)l.innerHTML=G.log.map(x=>`<div>${x}</div>`).join("");
}

// Click delegation for screen buttons
track.addEventListener("click",e=>{
  const t=e.target.closest("[data-go],[data-act]");
  if(!t)return;
  if(t.dataset.go!=null)return go(+t.dataset.go);
  const a=t.dataset.act,i=+t.dataset.i;
  if(a==="sym"){G.sym=i;render(true);}
  else if(a==="save"){
    G.symOv=[{diz:1,head:1,fat:1},{diz:1,head:1,fat:3},{diz:4,head:1,fat:2},{diz:1,head:4,fat:2}][G.sym];
    toast("Síntomas guardados");
  }
  else if(a==="tabH"){G.tabH=i;G.histN=[24,48,96][i];render(true);}
  else if(a==="tabA"){G.tabA=i;render(true);}
  else if(a==="clear"){AB.K.alerts.length=0;render(true);toast("Historial de alertas limpio");}
  else if(a==="note")toast("Nota agregada al registro");
  else if(a==="call"){
    toast("Enlace con Tierra… retardo simulado 1,3 s");
    setTimeout(()=>toast("Conectado con el MCC (simulado)"),1400);
  }
  else if(a==="snd")G.sound=t.checked;
  else if(a==="saveCfg"){
    document.querySelectorAll("[data-th]").forEach(x=>{
      const[k,f]=x.dataset.th.split(".");
      const v=parseFloat(x.value);
      if(isFinite(v))AB.TH[k][f]=v;
    });
    toast("Cambios guardados");
  }
});

// Press tracking (pauses render while user interacts)
track.addEventListener("pointerdown",()=>{pressed=true;});
const release=()=>{pressed=false;if(pending)setTimeout(schedule,0);};
window.addEventListener("pointerup",release);
window.addEventListener("pointercancel",release);

// Keyboard
window.addEventListener("keydown",e=>{
  if(/INPUT|SELECT/.test(e.target.tagName))return;
  if(e.key==="ArrowRight")go(G.idx+1);
  if(e.key==="ArrowLeft")go(G.idx-1);
});

// Crown (wheel + click)
let wt=0;
$("#crown").addEventListener("wheel",e=>{
  e.preventDefault();
  const n=Date.now();if(n-wt<220)return;wt=n;
  go(G.idx+(e.deltaY>0?1:-1));
},{passive:false});
$("#crown").addEventListener("click",()=>go(0));

// Prev / next / side button
$("#prev").addEventListener("click",()=>go(G.idx-1));
$("#next").addEventListener("click",()=>go(G.idx+1));
$("#sbtn").addEventListener("click",()=>go(7));

// Refit on resize / font load
const refit=()=>{[...track.children].forEach(q=>q._h=null);render(true);};
window.addEventListener("resize",refit);
if(document.fonts&&document.fonts.ready)document.fonts.ready.then(refit);

Object.assign(AB,{render,go,toast,beep,logE,schedule,fit,track,glass});
})(window.AstroBeat=window.AstroBeat||{});