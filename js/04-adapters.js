// ===== MODULE: ADAPTERS (fake, manual, stub) =====
(function(AB){
'use strict';
const {ITelemetrySource,SC,BASE,clamp,mulberry32,gaussOf,CFG,KEYS,RANGE,SIGMA}=AB;

class ScenarioSimulatorAdapter extends ITelemetrySource{
  // Test double of the real hardware: deterministic with seed, ramps + Gaussian noise
  constructor(){super();this.noise=true;this.sc="E1";this.reset(CFG.seed);}
  reset(seed){this.rng=mulberry32(seed);this.c=0;this.t=0;}
  setScenario(id){this.sc=id;this.c=0;}
  next(){
    const v=SC[this.sc](this.c++);
    const dt=this.sc.startsWith("E3")?CFG.dtEmergencyMs:CFG.dtMs;
    this.t+=dt;
    const f={...v,t:this.t,dtMs:dt};
    for(const k of KEYS){
      let x=v[k];
      if(this.noise)x+=gaussOf(this.rng)*SIGMA[k];
      f[k]=clamp(x,...RANGE[k]);
    }
    f.rr=60000/v.hr+(this.noise?gaussOf(this.rng)*CFG.rrJitterMs:0);
    return f;
  }
}

class ManualSlidersAdapter extends ITelemetrySource{
  constructor(){super();this.m={...BASE};this.t=0;this.rng=mulberry32(CFG.seed);}
  reset(seed){this.rng=mulberry32(seed);this.t=0;}
  next(){
    this.t+=CFG.dtMs;
    const f={...this.m,t:this.t,dtMs:CFG.dtMs};
    f.rr=60000/f.hr+gaussOf(this.rng)*CFG.rrJitterMs;
    return f;
  }
}

class RealDeviceAdapter extends ITelemetrySource{
  // TODO: connect real hardware here (WebBluetooth / WebSocket) → return TelemetryFrame
  next(){throw new Error("RealDeviceAdapter: no implementado en este prototipo");}
}

Object.assign(AB,{ScenarioSimulatorAdapter,ManualSlidersAdapter,RealDeviceAdapter});
})(window.AstroBeat=window.AstroBeat||{});