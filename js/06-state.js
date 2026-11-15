// ===== MODULE: GLOBAL STATE (mutable refs on AB) =====
(function(AB){
'use strict';
const {ScenarioSimulatorAdapter,ManualSlidersAdapter,RealDeviceAdapter,makeCore,CFG}=AB;
const G={idx:0,tabH:0,tabA:0,sym:0,sound:true,playing:true,speed:1,
  mode:"real",seed:CFG.seed,sc:"E1",inv:{},symOv:null,log:[],histN:96};
const SRC={sim:new ScenarioSimulatorAdapter(),
  man:new ManualSlidersAdapter(),
  real:new RealDeviceAdapter()};
AB.G=G;
AB.SRC=SRC;
AB.src=SRC.sim;      // current telemetry adapter (mutable)
AB.K=makeCore();     // current core (mutable — replaced by setScenario)
AB.timer=null;
})(window.AstroBeat=window.AstroBeat||{});