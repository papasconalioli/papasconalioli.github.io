/* Shared script for index.html and biografia.html. Every block checks that its section exists on the page. */
// Typing effect
const WORDS={es:["Ingeniero Biomédico","Electrofisiología auricular","Procesado de señales biomédicas","Gemelos digitales","Percusionista"],
en:["Biomedical Engineer","Atrial electrophysiology","Biomedical signal processing","Digital twins","Percussionist"]};
let LANG="es";let words=WORDS.es;
let w=0,c=0,del=false;const el=document.getElementById("typed");
if(el)(function type(){
  const cur=words[w];
  el.textContent=cur.slice(0,c);
  if(!del&&c<cur.length){c++;setTimeout(type,80)}
  else if(!del){del=true;setTimeout(type,1600)}
  else if(c>0){c--;setTimeout(type,40)}
  else{del=false;w=(w+1)%words.length;setTimeout(type,300)}
})();

// Reveal on scroll + skill bars + counters + staggered course lists
const io=new IntersectionObserver(es=>{es.forEach(e=>{
  if(!e.isIntersecting)return;
  e.target.classList.add("show");
  e.target.querySelectorAll(".fill").forEach(f=>f.style.width=f.dataset.w+"%");
  e.target.querySelectorAll(".c-list li").forEach((li,i)=>li.style.transitionDelay=(.15+i*.09)+"s");
  const n=e.target.querySelector("[data-count]");
  if(n){let t=+n.dataset.count,i=0;const st=Math.ceil(t/20);const s=setInterval(()=>{i=Math.min(t,i+st);n.textContent=i;if(i>=t)clearInterval(s)},50)}
  io.unobserve(e.target);
})},{threshold:.15});
document.querySelectorAll(".reveal").forEach(r=>io.observe(r));

// Congress filters
document.querySelectorAll("#filters button").forEach(b=>b.onclick=()=>{
  document.querySelectorAll("#filters button").forEach(x=>x.classList.toggle("on",x===b));
  const f=b.dataset.f;
  document.querySelectorAll(".cong").forEach(c=>c.classList.toggle("hide",f!=="all"&&!c.classList.contains(f)));
});

// Nav + progress bar
const nav=document.getElementById("nav"),pb=document.getElementById("progress");
addEventListener("scroll",()=>{
  nav.classList.toggle("scrolled",scrollY>30);
  const h=document.documentElement.scrollHeight-innerHeight;
  pb.style.width=(scrollY/h*100)+"%";
});
// Mobile menu
const links=document.getElementById("links");
document.getElementById("burger").onclick=()=>links.classList.toggle("open");
links.querySelectorAll("a").forEach(a=>a.onclick=()=>links.classList.remove("open"));
document.getElementById("yr").textContent=new Date().getFullYear();

{ // Gallery: hide photos that don't exist yet (and the whole section if empty) + lightbox
const gal=document.getElementById("gallery"),lb=document.getElementById("lightbox");
if(gal&&lb){
const checkGal=()=>{if(!gal.querySelector(".g-item"))document.getElementById("galeria").style.display="none"};
gal.querySelectorAll("img").forEach(img=>{
  const kill=()=>{img.parentElement.remove();checkGal()};
  if(img.complete&&img.naturalWidth===0)kill();else img.addEventListener("error",kill);
  img.parentElement.onclick=()=>{lb.querySelector("img").src=img.src;lb.classList.add("open")};
});
lb.onclick=()=>lb.classList.remove("open");
addEventListener("keydown",e=>{if(e.key==="Escape")lb.classList.remove("open")});
}}

// Documents: hide PDF cards whose file isn't uploaded yet
const docs=[...document.querySelectorAll(".doc")];
Promise.all(docs.map(d=>fetch(d.getAttribute("href"),{method:"HEAD"}).then(r=>{if(!r.ok)d.remove()}).catch(()=>d.remove())))
  .then(()=>{const s=document.getElementById("documentos");if(s&&!document.querySelector(".doc"))s.style.display="none"});

if(document.getElementById("map"))(function(){
// ---------- Travel map ----------
// HOW TO ADD A PLACE: add a line to PLACES with the country code (c), names (es/en) and coordinates (lat, lon).
// For a new country, add it to COUNTRIES too (flag, names, and region: "eu" groups it under Europe in the world view).
const COUNTRIES={
  ES:{f:"🇪🇸",es:"España",en:"Spain",r:"eu"},
  PT:{f:"🇵🇹",es:"Portugal",en:"Portugal",r:"eu"},
  FR:{f:"🇫🇷",es:"Francia",en:"France",r:"eu"},
  GB:{f:"🇬🇧",es:"Reino Unido",en:"United Kingdom",r:"eu"},
  IT:{f:"🇮🇹",es:"Italia",en:"Italy",r:"eu"},
  AT:{f:"🇦🇹",es:"Austria",en:"Austria",r:"eu"},
  CZ:{f:"🇨🇿",es:"Chequia",en:"Czechia",r:"eu"},
  HU:{f:"🇭🇺",es:"Hungría",en:"Hungary",r:"eu"},
  SK:{f:"🇸🇰",es:"Eslovaquia",en:"Slovakia",r:"eu"},
  BR:{f:"🇧🇷",es:"Brasil",en:"Brazil",r:"sa"},
};
const PLACES=[
  {c:"ES",es:"Islas Canarias",en:"Canary Islands",lat:27.96,lon:-15.6,home:true},
  {c:"ES",es:"Madrid",en:"Madrid",lat:40.42,lon:-3.70},
  {c:"ES",es:"Barcelona",en:"Barcelona",lat:41.39,lon:2.17},
  {c:"ES",es:"Bilbao",en:"Bilbao",lat:43.26,lon:-2.93},
  {c:"ES",es:"San Sebastián",en:"San Sebastián",lat:43.32,lon:-1.98},
  {c:"ES",es:"Santiago de Compostela",en:"Santiago de Compostela",lat:42.88,lon:-8.54},
  {c:"ES",es:"Vigo",en:"Vigo",lat:42.24,lon:-8.72},
  {c:"ES",es:"A Coruña",en:"A Coruña",lat:43.36,lon:-8.41},
  {c:"ES",es:"Ferrol",en:"Ferrol",lat:43.48,lon:-8.24},
  {c:"ES",es:"Zaragoza",en:"Zaragoza",lat:41.65,lon:-0.89},
  {c:"ES",es:"Huesca",en:"Huesca",lat:42.14,lon:-0.41},
  {c:"ES",es:"Jaca",en:"Jaca",lat:42.57,lon:-0.55},
  {c:"ES",es:"Panticosa",en:"Panticosa",lat:42.72,lon:-0.28},
  {c:"ES",es:"Formigal",en:"Formigal",lat:42.77,lon:-0.36},
  {c:"ES",es:"Lanuza",en:"Lanuza",lat:42.76,lon:-0.32},
  {c:"ES",es:"Aínsa",en:"Aínsa",lat:42.42,lon:0.14},
  {c:"ES",es:"Bielsa",en:"Bielsa",lat:42.63,lon:0.22},
  {c:"ES",es:"Teruel",en:"Teruel",lat:40.34,lon:-1.11},
  {c:"ES",es:"Valencia",en:"Valencia",lat:39.47,lon:-0.38},
  {c:"ES",es:"Murcia",en:"Murcia",lat:37.99,lon:-1.13},
  {c:"ES",es:"Granada",en:"Granada",lat:37.18,lon:-3.60},
  {c:"PT",es:"Lisboa",en:"Lisbon",lat:38.72,lon:-9.14},
  {c:"PT",es:"Oporto",en:"Porto",lat:41.15,lon:-8.61},
  {c:"FR",es:"París",en:"Paris",lat:48.86,lon:2.35},
  {c:"GB",es:"Londres",en:"London",lat:51.51,lon:-0.13},
  {c:"IT",es:"Milán",en:"Milan",lat:45.46,lon:9.19},
  {c:"IT",es:"Bérgamo",en:"Bergamo",lat:45.70,lon:9.67},
  {c:"IT",es:"Turín",en:"Turin",lat:45.07,lon:7.69},
  {c:"IT",es:"Florencia",en:"Florence",lat:43.77,lon:11.26},
  {c:"IT",es:"Pisa",en:"Pisa",lat:43.72,lon:10.40},
  {c:"IT",es:"Roma",en:"Rome",lat:41.90,lon:12.50},
  {c:"IT",es:"Nápoles",en:"Naples",lat:40.85,lon:14.27},
  {c:"IT",es:"Caserta",en:"Caserta",lat:41.07,lon:14.33},
  {c:"IT",es:"Amalfi",en:"Amalfi",lat:40.63,lon:14.60},
  {c:"AT",es:"Viena",en:"Vienna",lat:48.21,lon:16.37},
  {c:"AT",es:"Salzburgo",en:"Salzburg",lat:47.81,lon:13.04},
  {c:"AT",es:"Graz",en:"Graz",lat:47.07,lon:15.44},
  {c:"AT",es:"Hallstatt",en:"Hallstatt",lat:47.56,lon:13.65},
  {c:"AT",es:"Innsbruck",en:"Innsbruck",lat:47.27,lon:11.39},
  {c:"CZ",es:"Praga",en:"Prague",lat:50.08,lon:14.44},
  {c:"HU",es:"Budapest",en:"Budapest",lat:47.50,lon:19.04},
  {c:"SK",es:"Bratislava",en:"Bratislava",lat:48.15,lon:17.11},
  {c:"BR",es:"São Paulo",en:"São Paulo",lat:-23.55,lon:-46.63},
];
const REGIONS={eu:{es:"Europa",en:"Europe",f:"🇪🇺"}};
const MW=1000,MH=386.1,LATN=83,KK=MW/360;
const pj=(lat,lon)=>[(lon+180)*KK,(LATN-lat)*KK];
const mapEl=document.getElementById("map"),mapIn=document.getElementById("mapIn"),arcs=document.getElementById("arcs");
const countryRow=document.getElementById("countryChips"),cityRow=document.getElementById("cityChips");
const viewsBox=document.getElementById("views"),vi=viewsBox.querySelector("i");
const T=(es,en)=>LANG==="en"?en:es;
const home=PLACES.find(p=>p.home);home.xy=pj(home.lat,home.lon);
PLACES.forEach(p=>p.xy=pj(p.lat,p.lon));

// --- build markers: home, one per region (world view), one per country, one per city ---
const mk=(cls,d)=>{const b=document.createElement("button");b.className="pin "+cls;b.style.setProperty("--d",d+"s");
  b.innerHTML='<span class="dot"></span><span class="tip"></span>';mapIn.appendChild(b);return b};
const avg=a=>[a.reduce((s,p)=>s+p[0],0)/a.length,a.reduce((s,p)=>s+p[1],0)/a.length];
const groups={};
Object.keys(COUNTRIES).forEach((code,i)=>{
  const cities=PLACES.filter(p=>p.c===code&&!p.home);if(!cities.length)return;
  const g=groups[code]={code,...COUNTRIES[code],cities,xy:avg(cities.map(p=>p.xy))};
  g.pin=mk("country",i*.3%2.4);g.pin.onclick=e=>{e.stopPropagation();openCountry(code)};
  cities.forEach((p,j)=>{p.pin=mk("city off",0);p.pin.onclick=e=>{e.stopPropagation();focusCity(p)}});
});
const regions={};
Object.entries(REGIONS).forEach(([r,R])=>{
  const gs=Object.values(groups).filter(g=>g.r===r);if(gs.length<2)return;
  regions[r]={...R,r,groups:gs,xy:avg(gs.map(g=>g.xy)),pin:mk("region",.6)};
  regions[r].pin.onclick=e=>{e.stopPropagation();setView("europe")};
});
home.pin=mk("home",0);home.pin.onclick=e=>{e.stopPropagation();home.pin.classList.toggle("act")};

// --- chips ---
const chip=(row,html,on)=>{const b=document.createElement("button");b.innerHTML=html;b.onclick=on;row.appendChild(b);return b};
Object.values(groups).forEach(g=>{g.chip=chip(countryRow,"",()=>openCountry(g.code));
  g.chip.addEventListener("mouseenter",()=>g.pin.classList.add("act"));g.chip.addEventListener("mouseleave",()=>g.pin.classList.remove("act"))});

// --- state ---
let VIEW="world",OPEN=null;
function viewFor(z,cx,cy){
  let tx=50-z*cx/MW*100,ty=50-z*cy/MH*100;
  tx=Math.min(0,Math.max(100-z*100,tx));ty=Math.min(0,Math.max(100-z*100,ty));
  mapIn.style.transform=`translate(${tx}%,${ty}%) scale(${z})`;mapIn.style.setProperty("--z",z);
  mapEl.classList.toggle("zoomed",z>1.5);
  if(z>1.5&&!mapIn.dataset.dl){mapIn.dataset.dl=1;   // fine dots load only when first needed
    mapIn.querySelector(".dl").style.setProperty("--m","url(/assets/map/detail-dots.svg)");
    mapIn.querySelector(".dv").style.setProperty("--m","url(/assets/map/detail-visited-dots.svg)")}
  return z;
}
let Z=1;
function render(){
  // which markers are visible in the current state
  const vis=[];
  Object.values(groups).forEach(g=>{
    const inRegion=VIEW==="world"&&regions[g.r];
    const show=!inRegion&&OPEN!==g.code;
    g.pin.classList.toggle("off",!show);if(show)vis.push({pin:g.pin,xy:g.xy});
    g.cities.forEach(p=>{const s=OPEN===g.code;p.pin.classList.toggle("off",!s);if(s)vis.push({pin:p.pin,xy:p.xy,lead:true});else p.pin.classList.remove("act")});
    g.chip.classList.toggle("on",OPEN===g.code);
  });
  Object.values(regions).forEach(R=>{const s=VIEW==="world"&&!OPEN;R.pin.classList.toggle("off",!s);if(s)vis.push({pin:R.pin,xy:R.xy})});
  layout(vis);
  mapEl.classList.toggle("open",!!OPEN);
  viewsBox.classList.toggle("none",!!OPEN);
  viewsBox.querySelectorAll("button").forEach(b=>b.classList.toggle("on",!OPEN&&b.dataset.v===VIEW));moveViewPill();
  // city chips for the open country
  cityRow.innerHTML="";cityRow.classList.toggle("show",!!OPEN);
  if(OPEN)groups[OPEN].cities.forEach(p=>{const b=chip(cityRow,T(p.es,p.en),()=>focusCity(p));
    b.addEventListener("mouseenter",()=>p.pin.classList.add("act"));b.addEventListener("mouseleave",()=>p.pin.classList.remove("act"))});
}
// spread markers that would overlap on screen; draw a thin leader line back to the real spot
function layout(vis){
  const S=mapEl.clientWidth/MW*Z,D=(innerWidth<860?19:22);
  const pts=vis.map(v=>({...v,x:v.xy[0],y:v.xy[1]}));
  for(let it=0;it<80;it++){let moved=false;
    for(let i=0;i<pts.length;i++)for(let j=i+1;j<pts.length;j++){
      const a=pts[i],b=pts[j];let dx=(b.x-a.x)*S,dy=(b.y-a.y)*S,d=Math.hypot(dx,dy);
      const need=D*(a.pin.classList.contains("city")&&b.pin.classList.contains("city")?.8:1.25);
      if(d<need){if(d<.01){dx=Math.cos(i+j);dy=Math.sin(i+j);d=1}
        const k=(need-d)/2/d/S;a.x-=dx*k;a.y-=dy*k;b.x+=dx*k;b.y+=dy*k;moved=true}}
    if(!moved)break}
  arcs.querySelectorAll(".arc,.lead").forEach(e=>e.remove());
  const [hx,hy]=home.xy;
  pts.forEach((p,i)=>{
    p.pin.style.left=p.x/MW*100+"%";p.pin.style.top=p.y/MH*100+"%";
    if(p.lead&&Math.hypot(p.x-p.xy[0],p.y-p.xy[1])*S>3)line(`M${p.xy[0]} ${p.xy[1]}L${p.x} ${p.y}`,"lead");
    if(!OPEN){const mx=(hx+p.x)/2,my=(hy+p.y)/2-Math.hypot(p.x-hx,p.y-hy)*.32;
      line(`M${hx} ${hy}Q${mx} ${my} ${p.x} ${p.y}`,"arc",i*.05)}
  });
  home.pin.style.left=hx/MW*100+"%";home.pin.style.top=hy/MH*100+"%";
}
function line(d,cls,delay=0){const a=document.createElementNS("http://www.w3.org/2000/svg","path");a.setAttribute("d",d);a.setAttribute("class",cls);a.style.animationDelay=`0s,${delay}s`;arcs.appendChild(a)}

function setView(v){OPEN=null;VIEW=v;
  Z=v==="europe"?viewFor(4.2,...pj(46,7)):viewFor(1,500,193);render()}
function openCountry(code){
  const g=groups[code];OPEN=code;if(g.r==="eu")VIEW="europe";
  const xs=g.cities.map(p=>p.xy[0]),ys=g.cities.map(p=>p.xy[1]);
  const w=Math.max(...xs)-Math.min(...xs),h=Math.max(...ys)-Math.min(...ys);
  const z=g.cities.length<2?4.2:Math.max(4.2,Math.min(10,Math.min(MW*.6/(w||1),MH*.68/(h||1))));
  Z=viewFor(z,(Math.max(...xs)+Math.min(...xs))/2,(Math.max(...ys)+Math.min(...ys))/2);
  render();
  if(g.cities.length===1)setTimeout(()=>g.cities[0].pin.classList.add("act"),700);
  if(innerWidth<860)mapEl.scrollIntoView({behavior:"smooth",block:"center"});
}
function focusCity(p){if(OPEN!==p.c)openCountry(p.c);
  PLACES.forEach(q=>q.pin&&q.pin.classList.toggle("act",q===p))}
function labels(){
  const nC=n=>`${n} ${T(n>1?"lugares":"lugar",n>1?"places":"place")}`;
  home.pin.querySelector(".tip").innerHTML=`${COUNTRIES[home.c].f} ${T(home.es,home.en)}<small>${T("Casa","Home")}</small>`;
  home.pin.setAttribute("aria-label",T(home.es,home.en));
  Object.values(groups).forEach(g=>{const n=g.cities.length;
    g.pin.querySelector(".dot").textContent=n;
    g.pin.querySelector(".tip").innerHTML=`${g.f} ${T(g.es,g.en)}<small>${nC(n)} · ${T("pulsa para ver","tap to explore")}</small>`;
    g.pin.setAttribute("aria-label",`${T(g.es,g.en)}, ${nC(n)}`);
    g.chip.innerHTML=`<span>${g.f}</span>${T(g.es,g.en)}<em>${n}</em>`;
    g.cities.forEach(p=>{p.pin.querySelector(".tip").innerHTML=`${T(p.es,p.en)}<small>${T(g.es,g.en)}</small>`;p.pin.setAttribute("aria-label",T(p.es,p.en))})});
  Object.values(regions).forEach(R=>{const n=R.groups.reduce((s,g)=>s+g.cities.length,0);
    R.pin.querySelector(".dot").textContent=n;
    R.pin.querySelector(".tip").innerHTML=`${R.f} ${T(R.es,R.en)}<small>${nC(n)} · ${R.groups.length} ${T("países","countries")}</small>`;
    R.pin.setAttribute("aria-label",`${T(R.es,R.en)}, ${nC(n)}`)});
  document.getElementById("mapBack").textContent=T("← Volver","← Back");
}
window.renderPlaces=function(){labels();render()};
const moveViewPill=window.moveViewPill=function(){const b=viewsBox.querySelector("button.on")||viewsBox.querySelector("button");vi.style.width=b.offsetWidth+"px";vi.style.transform=`translateX(${b.offsetLeft-3}px)`};
viewsBox.querySelectorAll("button").forEach(b=>b.onclick=()=>setView(b.dataset.v));
document.getElementById("mapBack").onclick=e=>{e.stopPropagation();setView(VIEW)};
mapEl.addEventListener("click",()=>PLACES.forEach(q=>q.pin&&q.pin.classList.remove("act")));
addEventListener("keydown",e=>{if(e.key==="Escape"&&OPEN)setView(VIEW)});
let rT;addEventListener("resize",()=>{clearTimeout(rT);rT=setTimeout(()=>{moveViewPill();render()},150)});
document.getElementById("nPlaces").dataset.count=PLACES.length;
document.getElementById("nCountries").dataset.count=Object.keys(groups).length;
document.querySelectorAll(".t-stats > div").forEach(d=>io.observe(d));
labels();setView("world");

})();

// ---------- Atrium stimulation: click → activation wavefront + isochrones ----------
(function(){
  const svg=document.querySelector(".avatar .la"),shape=document.querySelector(".la .la-shape"),waves=document.getElementById("waves");
  if(!svg||!shape)return;
  const av=document.querySelector(".avatar"),ecg=av.querySelector(".ecg"),hint=document.getElementById("laHint");
  const NS="http://www.w3.org/2000/svg",reduce=matchMedia("(prefers-reduced-motion: reduce)").matches;
  const ISO=["#8f74d6","#9d86e0","#a9a0e6","#9cc3e3","#7fd3cc","#3fb3a7"];   // early (lila) → late (turquoise)
  let stimulated=false;
  setTimeout(()=>{if(!stimulated)hint.classList.add("show")},2500);
  function toSvg(e){const pt=svg.createSVGPoint();pt.x=e.clientX;pt.y=e.clientY;return pt.matrixTransform(svg.getScreenCTM().inverse())}
  function stimulate(x,y){
    stimulated=true;hint.classList.remove("show");
    av.classList.remove("beat");void av.offsetWidth;av.classList.add("beat");setTimeout(()=>av.classList.remove("beat"),500);
    ecg.classList.remove("zap");void ecg.offsetWidth;ecg.classList.add("zap");clearTimeout(ecg._t);ecg._t=setTimeout(()=>ecg.classList.remove("zap"),1500);
    const spark=document.createElementNS(NS,"circle");spark.setAttribute("class","spark");spark.setAttribute("cx",x);spark.setAttribute("cy",y);spark.setAttribute("r",9);waves.appendChild(spark);
    if(reduce){setTimeout(()=>spark.remove(),600);return}
    const front=document.createElementNS(NS,"circle");front.setAttribute("class","front");front.setAttribute("cx",x);front.setAttribute("cy",y);waves.appendChild(front);
    const maxR=760,speed=520,isoEvery=95,isos=[];let t0=null,lastIso=0;
    function step(t){
      if(t0===null)t0=t;const el=t-t0,r=speed*el/1000;
      front.setAttribute("r",r);front.style.strokeOpacity=Math.max(0,.85*(1-r/maxR));
      spark.setAttribute("r",9+Math.sin(el/60)*2);spark.style.opacity=Math.max(0,1-el/700);
      if(el-lastIso>=isoEvery&&r>10){lastIso=el;const c=document.createElementNS(NS,"circle");
        c.setAttribute("class","iso");c.setAttribute("cx",x);c.setAttribute("cy",y);c.setAttribute("r",r);
        c.style.stroke=ISO[Math.min(ISO.length-1,isos.length)];waves.insertBefore(c,front);isos.push(c)}
      if(r<maxR)requestAnimationFrame(step);
      else{front.remove();spark.remove();isos.forEach((c,i)=>{setTimeout(()=>{c.style.strokeOpacity=0;setTimeout(()=>c.remove(),1300)},i*60)})}
    }
    requestAnimationFrame(step);
  }
  shape.addEventListener("click",e=>{const p=toSvg(e);stimulate(p.x,p.y)});
  // keyboard: Enter/Space on the shape stimulates from the centre
  shape.setAttribute("tabindex","0");shape.setAttribute("role","button");
  shape.setAttribute("aria-label",document.documentElement.lang==="en"?"Stimulate the atrium":"Estimular la aurícula");
  shape.addEventListener("keydown",e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();stimulate(340,320)}});
})();

// ---------- Theme toggle ----------
const root=document.documentElement;
document.getElementById("theme").onclick=()=>{
  const t=root.getAttribute("data-theme")==="dark"?"light":"dark";
  root.setAttribute("data-theme",t);try{localStorage.setItem("theme",t)}catch(e){}
};

// ---------- Language toggle ----------
const META={es:{title:document.title,desc:document.querySelector('meta[name=description]').content,
  menu:"Menú",theme:"Cambiar modo claro/oscuro",alt:"Primera página del artículo"},
  en:{title:root.dataset.titleEn||document.title,desc:root.dataset.descEn||"",
  menu:"Menu",theme:"Toggle light/dark mode",alt:"First page of the paper"}};
const trEls=[...document.querySelectorAll("[data-en]")];
trEls.forEach(el=>el.dataset.es=el.innerHTML);
const langBox=document.getElementById("lang");
function setLang(l,save){
  if(l!=="es"&&l!=="en")l="es";
  const changed=l!==LANG;LANG=l;words=WORDS[l];w=0;c=0;del=false;
  trEls.forEach(el=>{el.innerHTML=el.dataset[l];if(changed&&save)el.classList.remove("i18n-fade"),void el.offsetWidth,el.classList.add("i18n-fade")});
  root.lang=l;document.title=META[l].title;document.querySelector('meta[name=description]').content=META[l].desc;
  document.getElementById("burger").setAttribute("aria-label",META[l].menu);
  document.getElementById("theme").setAttribute("aria-label",META[l].theme);
  document.querySelectorAll(".paper img").forEach(i=>i.alt=META[l].alt);
  langBox.dataset.l=l;langBox.querySelectorAll("button").forEach(b=>{const on=b.dataset.set===l;b.classList.toggle("on",on);b.setAttribute("aria-pressed",on)});
  if(window.renderPlaces){renderPlaces();moveViewPill()}
  if(save){try{localStorage.setItem("lang",l)}catch(e){}}
}
langBox.querySelectorAll("button").forEach(b=>b.onclick=()=>setLang(b.dataset.set,true));
let startLang=new URLSearchParams(location.search).get("lang");
if(!startLang){try{startLang=localStorage.getItem("lang")}catch(e){}}
if(!startLang)startLang=(navigator.language||"es").toLowerCase().startsWith("es")?"es":"en";
setLang(startLang,false);
