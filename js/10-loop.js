// ===== MODULE: SIMULATION LOOP + SCENARIO SWITCH =====
(function(AB){
'use strict';
const {$}=AB;
const G=AB.G,SRC=AB.SRC;

function tick(){
  let f;
  try{f=AB.src.next();}
  catch(e){AB.logE(e.message);return;}
  for(const k of AB.KEYS)if(G.inv[k])f[k]=null;
  if(G.symOv&&AB.src===SRC.sim)Object.assign(f,G.symOv);
  const V=AB.K.step(f);
  if(V.glob>V.prev){
    AB.logE(`Estado → ${AB.LBL[V.glob]} · ${V.cause.t}`);
    AB.beep();
    if(V.glob===2){
      AB.go(11);
      $("#watch").classList.remove("shake");
      void $("#watch").offsetWidth;
      $("#watch").classList.add("shake");
    }
  } else if(V.glob<V.prev){
    AB.logE(`Estado → ${AB.LBL[V.glob]}${G.sc==="E4"&&V.glob===0?" · EVENT_RECOVERY":""}`);
  }
  AB.schedule();
}
function restart(){
  clearInterval(AB.timer);
  if(G.playing)AB.timer=setInterval(tick,1000/G.speed);
}
function setScenario(id){
  const last=AB.K.V&&AB.K.V.f;
  G.sc=id;G.symOv=null;
  AB.K=AB.makeCore();
  if(id==="M"){
    const l=last;
    AB.src=SRC.man;
    SRC.man.m={...AB.BASE,...(l?{hr:l.hr,spo2:l.spo2,temp:l.temp,p:l.p,co2:l.co2,rad:l.rad}:{})};
  } else {
    AB.src=SRC.sim;
    SRC.sim.setScenario(id);
  }
  AB.logE(`Escenario ${id}`);
  AB.buildDrawer();
  tick();
  restart();
}
Object.assign(AB,{tick,restart,setScenario});
})(window.AstroBeat=window.AstroBeat||{});