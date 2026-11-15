// ===== MODULE: DRAWER (☰) =====
(function(AB){
'use strict';
const {$}=AB;
const G=AB.G,SRC=AB.SRC;
const SLD=[
  ["hr","FC",20,220,1],["spo2","SpO₂",50,100,1],["temp","Temp",30,43,.1],
  ["p","Presión",0,120,.5],["co2","CO₂",0,20000,50],["rad","Rad.",0,5,.05],
  ["sleep","Sueño h",0,10,.5],["ex","Ejercicio",0,120,5],["water","Agua L",0,4,.1],
  ["diz","Mareo",1,5,1],["head","Cefalea",1,5,1],["fat","Fatiga",1,5,1]
];

function buildDrawer(){
  const d=$("#drawer");
  d.innerHTML=
    `<h4>Escenario</h4>${[
      ["E1",'<i class="sd g"></i>E1 Nominal'],
      ["E2",'<i class="sd y"></i>E2 Fatiga/CO₂'],
      ["E3A",'<i class="sd r"></i>E3A Despresurización'],
      ["E3B",'<i class="sd r"></i>E3B CO₂ crítico'],
      ["E4",'<i class="sd y"></i>E4 Recuperación'],
      ["M",'<i class="sd n"></i>Manual']
    ].map(([i,t])=>`<button data-sc="${i}" class="${G.sc===i?"on":""}">${t}</button>`).join("")}
    <h4>Reproducción</h4>
    <button data-p="pp">${G.playing?"Pausa":"Reproducir"}</button>
    ${[1,5,20].map(s=>`<button data-sp="${s}" class="${G.speed===s?"on":""}">${s}×</button>`).join("")}
    <button data-p="step">Paso</button>
    <h4>Modo y semilla</h4>
    <button data-m="real" class="${G.mode==="real"?"on":""}">Realista</button>
    <button data-m="demo" class="${G.mode==="demo"?"on":""}">Demo</button>
    Semilla <input id="seed" type="number" value="${G.seed}" style="width:64px">
    <button data-p="reset">Reiniciar</button>
    <h4>Sensor inválido</h4>
    ${AB.KEYS.map(k=>`<button data-inv="${k}" class="${G.inv[k]?"on":""}">${AB.TH[k].n}</button>`).join("")}
    ${G.sc==="M"?`<h4>Sliders manuales</h4>${SLD.map(([k,l,a,b,s])=>`<label><span>${l}</span><input type="range" min="${a}" max="${b}" step="${s}" value="${SRC.man.m[k]}" data-sl="${k}"></label>`).join("")}`:""}
    <h4>Eventos</h4><div id="log">${G.log.map(x=>`<div>${x}</div>`).join("")}</div>
    <p style="margin-top:12px;font-size:11px;opacity:.7">Prototipo educativo; no es un dispositivo médico ni sustituye criterio clínico.</p>`;
}

$("#drawer").addEventListener("click",e=>{
  const t=e.target.closest("button");if(!t)return;
  const D=t.dataset;
  if(D.sc)return AB.setScenario(D.sc);
  if(D.sp){G.speed=+D.sp;AB.restart();buildDrawer();}
  else if(D.p==="pp"){G.playing=!G.playing;AB.restart();buildDrawer();}
  else if(D.p==="step")AB.tick();
  else if(D.p==="reset"){
    G.seed=parseInt($("#seed").value,10)||AB.CFG.seed;
    SRC.sim.reset(G.seed);SRC.man.reset(G.seed);
    AB.setScenario(G.sc);
  }
  else if(D.m){G.mode=D.m;SRC.sim.noise=D.m==="real";buildDrawer();}
  else if(D.inv){G.inv[D.inv]=!G.inv[D.inv];buildDrawer();}
});
$("#drawer").addEventListener("input",e=>{
  const k=e.target.dataset.sl;
  if(k)SRC.man.m[k]=parseFloat(e.target.value);
});

// Menu toggle + click-outside
$("#menu").addEventListener("click",()=>{
  const o=$("#drawer").classList.toggle("open");
  $("#menu").setAttribute("aria-expanded",o);
});
document.addEventListener("click",e=>{
  if(!e.target.closest("#drawer,#menu"))$("#drawer").classList.remove("open");
});

Object.assign(AB,{buildDrawer});
})(window.AstroBeat=window.AstroBeat||{});