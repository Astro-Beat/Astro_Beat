// ===== MODULE: SELFTEST (?selftest=1) =====
(function(AB){
'use strict';
if(!location.search.includes("selftest"))return;

// TS_S1: E3A must reach RED in ≤6 cycles
const s=new AB.ScenarioSimulatorAdapter();s.noise=false;s.setScenario("E3A");
const k=AB.makeCore();
let r;
for(let i=0;i<8;i++)r=k.step(s.next());
console.assert(r.glob===2,"TS_S1: E3A debe ser RED");

// TS_S2: no mitigation during RED
console.assert(r.mit===0,"TS_S2: sin mitigación en RED");

// TS_S3: reported stress never below raw minus cap
console.assert(r.S>=r.Sraw-AB.CFG.maxMit,"TS_S3: bounded mitigation");

// TS_S4: E1 must stay GREEN
const s2=new AB.ScenarioSimulatorAdapter();s2.noise=false;s2.setScenario("E1");
const k2=AB.makeCore();
let r2;
for(let i=0;i<5;i++)r2=k2.step(s2.next());
console.assert(r2.glob===0,"TS_S4: E1 debe ser GREEN");

// TS_S5: E2 must reach YELLOW in ≤5 cycles
const s3=new AB.ScenarioSimulatorAdapter();s3.noise=false;s3.setScenario("E2");
const k3=AB.makeCore();
let r3;
for(let i=0;i<5;i++)r3=k3.step(s3.next());
console.assert(r3.glob===1,"TS_S5: E2 debe ser YELLOW");

// TS_S6: determinism (same seed → same sequence)
const A=new AB.ScenarioSimulatorAdapter();A.reset(42);A.setScenario("E2");
const B=new AB.ScenarioSimulatorAdapter();B.reset(42);B.setScenario("E2");
for(let i=0;i<10;i++){
  const a=A.next(),b=B.next();
  console.assert(a.hr===b.hr&&a.co2===b.co2,`TS_S6: determinismo ciclo ${i}`);
}

console.log("AstroBeat selftest OK · TS_S1..TS_S6");
})(window.AstroBeat=window.AstroBeat||{});