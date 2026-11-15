// ===== MODULE: PORT ITelemetrySource + scenario data =====
(function(AB){
'use strict';
class ITelemetrySource{
  next(){throw new Error("not implemented");}
  reset(seed){}
  setScenario(id){}
}
const ramp=(c,a,b,n)=>a+(b-a)*Math.min(1,c/n);
const BASE={hr:65,spo2:98,temp:37,p:101.3,co2:1200,rad:.05,sleep:8,ex:60,water:2.7,diz:1,head:1,fat:1};
const E2={hr:85,spo2:93,temp:37,p:101.3,co2:3800,rad:.05,sleep:5.5,ex:25,water:1.8,diz:3,head:2,fat:4};
const GOALS={sleep:8,ex:60,water:2.7};
const SC={
  E1:c=>({...BASE}),
  E2:c=>({...E2,co2:ramp(c,2500,3800,5)}),
  E3A:c=>({...BASE,p:ramp(c,101.3,65,6),spo2:88,hr:125,diz:5,head:2,fat:3,ex:20,sleep:6}),
  E3B:c=>({...BASE,co2:ramp(c,1200,5500,6),spo2:88,hr:125,diz:5,head:3,fat:3,ex:20,sleep:6}),
  E4:c=>{
    if(c<3)return{...E2,...GOALS,co2:3800};
    const t=c-3;
    return{...E2,...GOALS,co2:ramp(t,3800,1200,5),spo2:ramp(t,93,98,5),hr:ramp(t,85,65,5)};
  }
};
Object.assign(AB,{ITelemetrySource,ramp,BASE,E2,GOALS,SC});
})(window.AstroBeat=window.AstroBeat||{});