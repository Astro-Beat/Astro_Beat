// build/build-single.js
// Uso: node build/build-single.js
// Genera ../astrobeat-watch.html autocontenido a partir de index.html + css/* + js/*
const fs=require('fs');
const path=require('path');
const ROOT=path.resolve(__dirname,'..');

let html=fs.readFileSync(path.join(ROOT,'index.html'),'utf8');

html=html.replace(/<link rel="stylesheet" href="(css\/[^"]+)">/g,(m,href)=>{
  const css=fs.readFileSync(path.join(ROOT,href),'utf8');
  return `<style>\n/* ==== ${href} ==== */\n${css}\n</style>`;
});

html=html.replace(/<script defer src="(js\/[^"]+)"><\/script>/g,(m,src)=>{
  const js=fs.readFileSync(path.join(ROOT,src),'utf8');
  return `<script>\n/* ==== ${src} ==== */\n${js}\n</script>`;
});

const out=path.join(ROOT,'astrobeat-watch.html');
fs.writeFileSync(out,html);
console.log('✓ Build generado:',out,`(${(html.length/1024).toFixed(1)} KB)`);