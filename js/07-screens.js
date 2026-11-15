// ===== MODULE: SCREENS (16) rendered from core view-model =====
(function(AB){
'use strict';
const {TH,PROTO,CFG,LBL,MIS,clk,fx,clamp,g}=AB;
const G=AB.G; // never reassigned

const I=(n,c="")=>`<svg class="i ${c}" aria-hidden="true"><use href="#i-${n}"/></svg>`;
const dot=s=>`<i class="d s${s}"></i>`;
const H=(t,b=1)=>`<div class="hd">${b?`<a data-go="7" aria-label="Volver al menú">${I("back")}</a>`:""}<b>${t}</b><time>${clk()}</time></div>`;
const row=(ic,tone,l,v,s)=>`<div class="rw"><span class="chip ${tone}">${I(ic)}</span><b>${l}</b><em>${v}</em>${s==null?"":dot(s)}</div>`;
const step=(t,i)=>`<div class="step"><i>${i+1}</i>${t}</div>`;
const face=i=>{
  const c=["#34c759","#ffd60a","#ff9f0a","#ff453a"][i];
  const m=["M8 14.500q4 3.500 8 0","M8.500 15h7","M8 15q2-2 4 0t4 0","M8 16q4-3.500 8 0"][i];
  return `<svg class="face" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="10.500" fill="${c}"/><circle cx="8.500" cy="10" r="1.300" fill="#13203a"/><circle cx="15.500" cy="10" r="1.300" fill="#13203a"/><path d="${m}" fill="none" stroke="#13203a" stroke-width="1.700" stroke-linecap="round"/></svg>`;
};
const scene=(helmet,id)=>`<svg viewBox="0 0 200 110" preserveAspectRatio="xMidYMax meet" aria-hidden="true"><defs><radialGradient id="${id}" cx=".35" cy=".25" r=".9"><stop offset="0" stop-color="#6fb4ff"/><stop offset=".55" stop-color="#1f5fd0"/><stop offset="1" stop-color="#0b1f55"/></radialGradient></defs><g fill="#9db4e8"><circle cx="22" cy="20" r="1.300"/><circle cx="176" cy="28" r="1.500"/><circle cx="150" cy="9" r="1"/><circle cx="40" cy="62" r="1"/></g><circle cx="100" cy="${helmet?190:178}" r="${helmet?115:105}" fill="url(#${id})"/>${helmet?'<circle cx="100" cy="46" r="27" fill="#f1f4fc" stroke="#c9d4ee" stroke-width="3"/><rect x="80" y="32" width="40" height="27" rx="13.500" fill="#14264d"/><path d="M86 41q8-6 16-3" stroke="#fff" stroke-opacity=".55" stroke-width="3" fill="none" stroke-linecap="round"/><rect x="88" y="70" width="24" height="9" rx="4" fill="#dfe6f6"/>':""}</svg>`;
const ROBOT=`<svg viewBox="0 0 80 72" preserveAspectRatio="xMidYMid meet" aria-hidden="true"><path d="M40 6v8" stroke="#1f6feb" stroke-width="3" stroke-linecap="round"/><circle cx="40" cy="5" r="3.500" fill="#1f6feb"/><rect x="12" y="14" width="56" height="44" rx="17" fill="#fff" stroke="#b7d1fb" stroke-width="3"/><rect x="20" y="24" width="40" height="24" rx="12" fill="#14264d"/><circle cx="32" cy="36" r="4" fill="#59c8ff"/><circle cx="48" cy="36" r="4" fill="#59c8ff"/><rect x="4" y="30" width="6" height="12" rx="3" fill="#b7d1fb"/><rect x="70" y="30" width="6" height="12" rx="3" fill="#b7d1fb"/></svg>`;
const Sl=s=>s<25?"Bajo":s<50?"Medio":"Alto";
const ago=a=>{const m=Math.round((AB.K.ts-a.t)/60000);return m<1?"Ahora":`Hace ${m} min`;};
const alertTxt=a=>`${a.name} ${a.hi?"alta":"baja"}: ${fx(a.val,a.k==="rad"?2:a.k==="temp"||a.k==="p"?1:0)} ${a.unit} (límite ${a.hi?">":"<"}${a.thr})`;
function line(arr,k,mn,mx,col){
  const a=arr.slice(-G.histN),n=Math.max(1,a.length-1);
  return `<polyline fill="none" stroke="${col}" stroke-width="1.6" points="${a.map((h,i)=>h[k]==null?"":`${(i/n*196+2).toFixed(1)},${(86-clamp((h[k]-mn)/(mx-mn),0,1)*80).toFixed(1)}`).join(" ")}"/>`;
}

const SCREENS=[
  V=>{
    const h=new Date().getHours(),gr=h<12?"Buenos días":h<20?"Buenas tardes":"Buenas noches";
    return `<div class="hd"><b class="brand"><img class="brand-logo" src="assets/Logo.png" alt="">AstroBeat</b><time>${clk()}</time></div>
      <div class="big">${gr}</div>
      <div class="sub" style="text-align:center">Día 124 de misión</div>
      <div class="card st ${["ok","y","r"][V.glob]}" data-go="1">
        <span class="chip ${["green","amber","red"][V.glob]}">${I(V.glob?"warn":"check")}</span>
        <div><div class="sub">Estado de salud</div><b>${LBL[V.glob]}</b></div>${I("next","mut")}
      </div>
      <div class="fill">${scene(true,"pg1")}</div>`;
  },
  V=>`${H("Signos vitales")}
    ${row("heart","red","FC",fx(V.f.hr)+" bpm",V.st.hr)}
    ${row("drop","blue","SpO₂",fx(V.f.spo2)+" %",V.st.spo2)}
    ${row("thermo","orange","Temp.",fx(V.f.temp,1)+" °C",V.st.temp)}
    ${row("bolt","violet","Estrés",Sl(V.S),V.S<25?0:V.S<50?1:2)}
    ${row("moon","indigo","Sueño",fx(V.f.sleep,1)+" h",V.f.sleep>=8?0:V.f.sleep>=6?1:2)}`,
  V=>`${H("Síntomas")}
    <div class="q">¿Cómo te sientes hoy?</div>
    <div class="grid2">${["Bien","Cansancio leve","Mareos","Dolor de cabeza"].map((t,i)=>`<div class="opt ${G.sym===i?"on":""}" data-act="sym" data-i="${i}">${face(i)}${t}</div>`).join("")}</div>
    <div class="fill"></div>
    <button class="btn" data-act="save">Guardar</button>`,
  V=>`${H("Actividad")}
    ${row("pulse","green","Ejercicio",fx(V.f.ex)+" min",V.f.ex>=60?0:1)}
    ${row("fork","amber","Comidas","Completas")}
    ${row("drop","blue","Hidratación",fx(V.f.water,1)+" L",V.f.water>=2.5?0:1)}
    <div class="wk">${[["L",35],["M",60],["X",85],["J",45],["V",30],["S",50],["D",70]].map(([d,h])=>`<div><i style="height:${h}%"></i>${d}</div>`).join("")}</div>
    <div class="card cr">Créditos de bienestar<b>${fx(V.cr)} / 100</b></div>`,
  V=>{
    const p=clamp(g(V.f.sleep,0)/8,0,1)*251;
    const q=V.f.sleep>=7?"Buena":V.f.sleep>=6?"Regular":"Baja";
    const cl=["#4a55d6","#8aa0ff","#b79cff"];
    return `${H("Sueño")}
      <div class="fill"><svg viewBox="0 0 100 100" aria-hidden="true">
        <circle cx="50" cy="50" r="40" fill="none" stroke="#dfe5f8" stroke-width="9"/>
        <circle cx="50" cy="50" r="40" fill="none" stroke="#6d4ae0" stroke-width="9" stroke-linecap="round"
          stroke-dasharray="${p} 251" transform="rotate(-90 50 50)"/>
        <text x="50" y="53" text-anchor="middle" font-size="19" font-weight="800" fill="#13203a">${fx(V.f.sleep,1)} h</text>
        <text x="50" y="67" text-anchor="middle" font-size="8" fill="#5a6785">de 8 h</text>
      </svg></div>
      <div class="card cr">Calidad<b>${q}</b></div>
      <div class="sb">${[60,30,50,25,70,35,80,40,65,30,55,85].map((h,i)=>`<i style="height:${h}%;background:${cl[i%3]}"></i>`).join("")}</div>
      <div class="lg"><span><i style="background:${cl[0]}"></i>Profundo</span><span><i style="background:${cl[1]}"></i>Ligero</span><span><i style="background:${cl[2]}"></i>REM</span></div>`;
  },
  V=>{
    const a=AB.K.alerts[0];
    return `${H("Alertas")}${a?`<div class="card ${a.sev===2?"r":"y"} al">
        <span class="chip ${a.sev===2?"red":"amber"}">${I("warn")}</span>
        <div><b>${a.name} fuera de rango</b><div class="sub">${alertTxt(a)}</div></div>
      </div>
      <div class="card b"><b>¿Qué hacer?</b><div class="sub">${a.sev===2?"Sigue el protocolo de emergencia.":"Verifica las condiciones de medición y repite la medición."}</div></div>
      <div class="fill"></div>
      <button class="btn o" data-go="10">Ver detalles</button>`
      :`<div class="card ok al"><span class="chip green">${I("check")}</span>
        <div><b>Sin alertas activas</b><div class="sub">Todos los parámetros están en rango.</div></div>
      </div><div class="fill"></div>`}`;
  },
  V=>`${H("Recomendaciones")}
    <div class="fill">${ROBOT}</div>
    <div class="card b" style="text-align:center">${V.glob===0?"Mantén una buena hidratación y descansa lo suficiente para tu misión.":V.flex?"Descansa y respira profundo: el descanso flexible puede reducir tu estrés fisiológico.":V.cause.t+"."}</div>
    <button class="btn o" data-go="13">Ver más consejos</button>`,
  V=>`${H("Menú",0)}
    <div class="grid2">${[["home","slate","Inicio",0],["heart","red","Signos vitales",1],["clip","blue","Síntomas",2],["pulse","green","Actividad",3],["chart","violet","Historial",8],["bell","amber","Alertas",10],["sliders","slate","Configuración",14],["globe","indigo","Estado de misión",15]].map(([i,t,l,n])=>`<div class="tile" data-go="${n}"><span class="chip ${t}">${I(i)}</span>${l}</div>`).join("")}</div>`,
  V=>`${H("Historial")}
    <div class="tabs">${["24 h","7 días","30 días"].map((t,i)=>`<a data-act="tabH" data-i="${i}" class="${G.tabH===i?"on":""}">${t}</a>`).join("")}</div>
    <svg class="chart" viewBox="0 0 200 96" aria-hidden="true">
      <rect width="200" height="96" rx="8" fill="#fff"/>
      ${[24,48,72].map(y=>`<path d="M0 ${y}H200" stroke="#e6ecf7"/>`).join("")}
      ${line(AB.K.hist,"hr",40,160,"#e5322d")}
      ${line(AB.K.hist,"spo2",85,100,"#1f6feb")}
      ${line(AB.K.hist,"temp",35,40,"#ff9f0a")}
    </svg>
    <div class="lg"><span><i style="background:#e5322d"></i>FC</span><span><i style="background:#1f6feb"></i>SpO₂</span><span><i style="background:#ff9f0a"></i>Temp.</span></div>
    <div class="fill"></div>`,
  V=>`${H("Detalle de registro")}
    <div class="sub">${new Date().toLocaleDateString("es",{day:"numeric",month:"short",year:"numeric"})} · ${clk()}</div>
    ${row("heart","red","FC",fx(V.f.hr)+" bpm",V.st.hr)}
    ${row("drop","blue","SpO₂",fx(V.f.spo2)+" %",V.st.spo2)}
    ${row("thermo","orange","Temp.",fx(V.f.temp,1)+" °C",V.st.temp)}
    <div class="card"><div class="sub">Notas</div>${V.glob?V.cause.t:"Sin anomalías"}</div>
    <div class="fill"></div>
    <button class="btn o" data-act="note">Agregar nota</button>`,
  V=>{
    const L=AB.K.alerts.filter(a=>G.tabA===0||(G.tabA===1?a.sev===2:a.sev===1));
    return `${H("Alertas")}
      <div class="tabs">${["Todos","Críticas","Avisos"].map((t,i)=>`<a data-act="tabA" data-i="${i}" class="${G.tabA===i?"on":""}">${t}</a>`).join("")}</div>
      ${L.slice(0,3).map(a=>`<div class="card ${a.sev===2?"r":"y"} al">
        <span class="chip ${a.sev===2?"red":"amber"}">${I(a.sev===2?"warn":"info")}</span>
        <div><b>${a.name}</b> <span class="sub">${ago(a)}</span><div class="sub">${alertTxt(a)}</div></div>
      </div>`).join("")||'<div class="card">Sin alertas en esta categoría.</div>'}
      <div class="fill"></div>
      <button class="btn o" data-act="clear">Limpiar historial</button>`;
  },
  V=>{
    const a=AB.K.alerts.find(x=>x.sev===2);
    return V.glob===2&&a?`
      <div class="ctr">${I("warn","xl")}<div class="big">Emergencia activa</div><div class="sub">${a.name} fuera de rango</div></div>
      <div class="card wh"><div class="sub">${a.name} actual</div><b class="val">${fx(a.val,a.k==="temp"||a.k==="p"?1:a.k==="rad"?2:0)} ${a.unit}</b><div class="sub">${V.cause.t} · confianza ${fx(V.cause.c,2)}</div></div>
      ${PROTO.r.slice(0,3).map(step).join("")}
      <div class="fill"></div>
      <button class="btn w" data-act="call">${I("antenna")}Contactar Tierra</button>`
      :`${H("Emergencia")}
      <div class="card ok al"><span class="chip green">${I("check")}</span><div><b>Sin emergencia activa</b><div class="sub">Si el estado pasa a crítico, esta pantalla se abre sola.</div></div></div>
      <div class="fill"></div>`;
  },
  V=>{
    const L=V.glob===2?PROTO.r:PROTO.y;
    return `${H("Protocolo")}${L.map(step).join("")}
      <div class="fill"></div>
      <div class="sub tag">${PROTO.tag}</div>
      <button class="btn" data-act="call">${I("headset")}Llamar a Tierra</button>`;
  },
  V=>`${H("Recomendaciones")}
    <div class="card b"><b>${V.cause.t}</b><div class="sub">Confianza ${fx(V.cause.c,2)}</div></div>
    <div class="card">
      <div class="cr" style="margin-bottom:.3em">Índice de estrés<b>${fx(V.S,1)}</b></div>
      ${[["Fisiología",V.Sbio],["Variabilidad",V.Shrv],["Sueño",V.Ssleep],["CO₂",V.Sco2]].map(([l,x])=>`<div class="mb"><span>${l}</span><span class="tr"><span style="width:${Math.round(x*100)}%"></span></span><span>${fx(x,2)}</span></div>`).join("")}
      ${V.flex?`<div class="sub">Mitigado −${fx(V.mit,1)} por bienestar</div>`:""}
    </div>
    <div class="fill"></div>
    <div class="card ok chk">${I("check")}<span>Descansa y respira profundo. Repite la medición en 5 min.</span></div>`,
  V=>`${H("Configuración")}
    ${[["heart","red","FC >","hr","hy",1],["drop","blue","SpO₂ <","spo2","ly",1],["thermo","orange","Temp. >","temp","hy",.5]].map(([ic,t,l,k,f,st])=>`<div class="rw sm"><span class="chip ${t}">${I(ic)}</span><b>${l}</b><input type="number" step="${st}" value="${TH[k][f]}" data-th="${k}.${f}" aria-label="${l}"></div>`).join("")}
    <div class="rw sm"><span class="chip slate">${I("bell")}</span><b>Alertas sonoras</b><label class="sw"><input type="checkbox" data-act="snd" aria-label="Alertas sonoras" ${G.sound?"checked":""}><i></i></label></div>
    <div class="fill"></div>
    <button class="btn" data-act="saveCfg">Guardar cambios</button>
    <div class="sub tag">Prototipo educativo; no es un dispositivo médico ni sustituye criterio clínico.</div>`,
  V=>`${H("Estado de misión")}
    <div class="card al"><span class="chip blue">${I("globe")}</span><div><b>Misión activa</b><div class="sub">Día 124 de misión</div></div>${dot(0)}</div>
    <div class="card ${["ok","y","r"][V.glob]}"><div class="sub">Salud del astronauta</div><b class="val">${MIS[V.glob]}</b></div>
    <div class="card"><div class="cr">Última actualización<b>${clk()}</b></div><div class="cr" style="margin-top:.3em">Créditos de bienestar<b>${fx(V.cr)}</b></div></div>
    <div class="fill">${scene(false,"pg2")}</div>`
];

Object.assign(AB,{SCREENS,line,H,row,dot,step,face,scene,ROBOT,I,Sl,ago,alertTxt});
})(window.AstroBeat=window.AstroBeat||{});