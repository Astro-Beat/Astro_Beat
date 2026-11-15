// ===== MODULE: CORE (analytics + triage + wellness + root cause) — only knows TelemetryFrame =====
(function(AB){
'use strict';
const {TH,CFG,KEYS,DOM,clamp,g}=AB;

const ev=(t,v)=>{
  if(v==null)return null;
  if((t.hr!=null&&v>t.hr)||(t.lr!=null&&v<t.lr))return 2;
  if((t.hy!=null&&v>t.hy)||(t.ly!=null&&v<t.ly))return 1;
  return 0;
};
function stepDom(d,target,valid){
  if(!valid)return;
  if(target>d.s){
    if(target===2){d.s=2;d.n=0;}
    else if(++d.n>=CFG.esc){d.s=1;d.n=0;}
  } else if(target<d.s){
    if(++d.n>=CFG.deesc){d.s-=1;d.n=0;}
  } else d.n=0;
}

function makeCore(){
  const K={bio:{s:0,n:0},env:{s:0,n:0},loss:{bio:0,env:0},
    win:{},rr:[],hist:[],alerts:[],prevSt:{},glob:0,ts:0,V:null};
  KEYS.forEach(k=>K.win[k]=[]);

  const mean=k=>{
    const a=K.win[k].filter(x=>x.v!=null);
    return a.length?a.reduce((s,x)=>s+x.v,0)/a.length:null;
  };
  const slope=k=>{
    const a=K.win[k].filter(x=>x.v!=null);
    if(a.length<3)return null;
    const n=a.length;let sx=0,sy=0,sxy=0,sxx=0;
    for(const q of a){
      const x=q.t/60000;
      sx+=x;sy+=q.v;sxy+=x*q.v;sxx+=x*x;
    }
    const den=n*sxx-sx*sx;
    return den===0?null:(n*sxy-sx*sy)/den;
  };

  K.step=f=>{
    K.ts=f.t;
    KEYS.forEach(k=>{
      K.win[k].push({t:f.t,v:f[k]});
      if(K.win[k].length>CFG.win)K.win[k].shift();
    });
    if(f.rr!=null&&f.hr!=null){
      K.rr.push(f.rr);
      if(K.rr.length>CFG.rrWin)K.rr.shift();
    }
    const st={};
    KEYS.forEach(k=>st[k]=ev(TH[k],f[k]));

    // Triage with hysteresis + debounce, per domain
    for(const d of ["bio","env"]){
      const vs=DOM[d].map(k=>st[k]).filter(x=>x!=null);
      if(!vs.length){
        K.loss[d]++;
        if(K.loss[d]>=CFG.lossCycles)K[d].s=Math.max(K[d].s,1);
      } else {
        K.loss[d]=0;
        stepDom(K[d],Math.max(...vs),true);
      }
    }
    const prev=K.glob;
    K.glob=Math.max(K.bio.s,K.env.s);

    const sm={};
    KEYS.forEach(k=>sm[k]=mean(k));
    const dp=slope("p"),dc=slope("co2");

    let rm=null;
    if(K.rr.length>=3){
      let s=0;
      for(let i=1;i<K.rr.length;i++)s+=(K.rr[i]-K.rr[i-1])**2;
      rm=Math.sqrt(s/(K.rr.length-1));
    }

    const sub=[];
    if(sm.hr!=null)sub.push(clamp((sm.hr-80)/70,0,1),clamp((60-sm.hr)/20,0,1));
    if(sm.spo2!=null)sub.push(clamp((98-sm.spo2)/10,0,1));
    if(sm.temp!=null)sub.push(clamp(Math.abs(sm.temp-37)/2,0,1));

    const Sbio=Math.max(0,...sub);
    const Shrv=rm==null?0:clamp((CFG.rmssdRefMs-rm)/CFG.rmssdRefMs,0,1);
    const Ssleep=clamp((CFG.goal.sleep-g(f.sleep,CFG.goal.sleep))/4,0,1);
    const Sco2=sm.co2==null?0:clamp((sm.co2-1000)/4000,0,1);
    const S=100*(CFG.w.bio*Sbio+CFG.w.hrv*Shrv+CFG.w.sleep*Ssleep+CFG.w.co2*Sco2);

    // Wellness credits
    const G=CFG.goal,C=CFG.cr;
    const ex=C.ex*Math.min(1,g(f.ex,0)/G.ex);
    const sl=g(f.sleep,0);
    const slc=sl>=G.sleep?C.sleep:sl>=G.sleepMin?C.sleep*(sl-G.sleepMin)/(G.sleep-G.sleepMin):0;
    const w=g(f.water,0);
    const wc=w>=G.w0&&w<=G.w1?C.water:w<G.w0?C.water*w/G.w0:C.water*G.w1/w;
    const sv=f.diz!=null?C.survey:0;
    const cr=ex+slc+wc+sv;

    // Mitigation: only YELLOW with purely physiological cause; NEVER changes triage state or measurements
    const phys=K.glob===1&&K.env.s===0;
    const mit=phys?CFG.maxMit*clamp(cr/100,0,1):0;

    // Root cause
    const diz=g(f.diz,1),head=g(f.head,1);
    let cause={t:"Causa no determinada",c:0};
    if(f.co2!=null&&f.co2>TH.co2.hy&&(diz>=4||head>=4)&&dc!=null&&dc>0){
      cause={t:"Probable hipercapnia ambiental",
        c:.4+.4*clamp((f.co2-TH.co2.hy)/2500,0,1)+.2*clamp((Math.max(diz,head)-3)/2,0,1)};
    } else if(dp!=null&&dp<CFG.rapidDropKpaMin&&f.spo2!=null&&f.spo2<95){
      cause={t:"Posible despresurización",c:.5+.5*clamp(-dp/5,0,1)};
    } else if(f.rad!=null&&f.rad>TH.rad.hy&&Math.max(diz,head,g(f.fat,1))<3){
      cause={t:"Exposición a radiación — monitorear",c:.6};
    }

    // Alerts (only on rising edges)
    KEYS.forEach(k=>{
      const s=st[k];
      if(s==null)return;
      if(s>g(K.prevSt[k],0)){
        const t=TH[k];
        const hi=t[s===2?"hr":"hy"]!=null&&f[k]>(t[s===2?"hr":"hy"]);
        K.alerts.unshift({sev:s,k,name:t.n,val:f[k],
          thr:hi?t[s===2?"hr":"hy"]:t[s===2?"lr":"ly"],hi,unit:t.u,t:f.t,cause:cause.t});
      }
      K.prevSt[k]=s;
    });
    if(K.alerts.length>30)K.alerts.length=30;

    K.hist.push({hr:f.hr,spo2:f.spo2,temp:f.temp});
    if(K.hist.length>96)K.hist.shift();

    K.V={f,st,sm,dp,dc,rm,Sraw:S,S:Math.max(0,S-mit),mit,Sbio,Shrv,Ssleep,Sco2,cr,cause,
      glob:K.glob,prev,bio:K.bio.s,env:K.env.s,flex:mit>0};
    return K.V;
  };
  return K;
}
Object.assign(AB,{ev,stepDom,makeCore});
})(window.AstroBeat=window.AstroBeat||{});