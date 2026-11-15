// ===== MODULE: CONFIG (single source of truth) =====
(function(AB){
'use strict';
const TH={
  hr:{lr:40,ly:45,hy:120,hr:150,u:"bpm",n:"FC"},
  spo2:{lr:92,ly:95,u:"%",n:"SpO₂"},
  temp:{lr:35,ly:36,hy:38,hr:39,u:"°C",n:"Temp"},
  p:{lr:60,ly:70,u:"kPa",n:"Presión"},
  co2:{hy:2500,hr:5000,u:"ppm",n:"CO₂"},
  rad:{hy:0.5,hr:1.0,u:"mSv/h",n:"Radiación"}
};
const RANGE={hr:[20,220],spo2:[50,100],temp:[30,43],p:[0,120],co2:[0,20000],rad:[0,100]};
const SIGMA={hr:2,spo2:.5,temp:.1,p:.3,co2:40,rad:.01};
const CFG={win:5,rrWin:30,rrJitterMs:30,esc:3,deesc:5,lossCycles:3,rapidDropKpaMin:-0.5,rmssdRefMs:50,
  w:{bio:.35,hrv:.2,sleep:.2,co2:.25},maxMit:15,
  cr:{ex:40,sleep:30,water:20,survey:10},
  goal:{ex:60,sleep:8,sleepMin:6,w0:2.5,w1:3.0},
  dtMs:60000,dtEmergencyMs:10000,seed:42};
const KEYS=["hr","spo2","temp","p","co2","rad"];
const DOM={bio:["hr","spo2","temp"],env:["p","co2","rad"]};
const LBL=["Normal","Atención","Crítico"];
const MIS=["Estable","Atención","Crítica"];
const PROTO={
  tag:"Ilustrativo, inspirado en ISS — no sustituye procedimiento oficial",
  y:["Reducir la carga de trabajo","Verificar scrubbers CDRA","Hidratarse",
     "Repetir la medición en 15 min","Notificar al MCC"],
  r:["Colocar mascarilla / O₂ de emergencia","Aislar el módulo",
     "Ejecutar el protocolo de emergencia","Contactar al MCC y al flight surgeon"]
};
Object.assign(AB,{TH,RANGE,SIGMA,CFG,KEYS,DOM,LBL,MIS,PROTO});
})(window.AstroBeat=window.AstroBeat||{});