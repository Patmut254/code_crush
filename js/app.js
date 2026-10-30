const $=s=>document.querySelector(s),app=$("#app");
const esc=s=>String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const iso=d=>d.toISOString().slice(0,10);
const P={home:'<path d="M3 11l9-8 9 8v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1z"/>',trophy:'<path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0zM17 5h3v2a3 3 0 0 1-3 3M7 5H4v2a3 3 0 0 0 3 3"/>',user:'<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',flame:'<path d="M12 3c1 4 5 6 5 11a5 5 0 0 1-10 0c0-2 1-3 2-4 0 2 1 3 2 3 0-3-1-6 1-10z"/>',check:'<path d="M5 12l5 5 9-10"/>',x:'<path d="M6 6l12 12M18 6L6 18"/>',back:'<path d="M15 5l-7 7 7 7"/>',bolt:'<path d="M13 2L4 14h7l-1 8 9-12h-7z"/>',lock:'<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>',star:'<path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z"/>',grid:'<rect x="3" y="3" width="7" height="7" rx="2"/><rect x="14" y="3" width="7" height="7" rx="2"/><rect x="3" y="14" width="7" height="7" rx="2"/><rect x="14" y="14" width="7" height="7" rx="2"/>',arrow:'<path d="M5 12h14M13 6l6 6-6 6"/>',play:'<path d="M7 4l13 8-13 8z"/>',bulb:'<path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-4 10.5c.7.7 1 1.5 1 2.5h6c0-1 .3-1.8 1-2.5A6 6 0 0 0 12 3z"/>',code:'<path d="M8 7l-5 5 5 5M16 7l5 5-5 5M14 4l-4 16"/>',heart:'<path d="M12 21s-7.5-4.6-9.5-9.3A5.4 5.4 0 0 1 12 6.3a5.4 5.4 0 0 1 9.5 5.4C19.5 16.4 12 21 12 21z"/>',target:'<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>',braces:'<path d="M8 3H7a2 2 0 0 0-2 2v5a2 2 0 0 1-2 2 2 2 0 0 1 2 2v5a2 2 0 0 0 2 2h1M16 3h1a2 2 0 0 1 2 2v5a2 2 0 0 0 2 2 2 2 0 0 0-2 2v5a2 2 0 0 1-2 2h-1"/>',terminal:'<rect x="3" y="4" width="18" height="16" rx="3"/><path d="M7 9l3 3-3 3M12 15h5"/>',server:'<rect x="3" y="3" width="18" height="8" rx="2"/><rect x="3" y="13" width="18" height="8" rx="2"/><path d="M7 7h.01M7 17h.01M11 7h6M11 17h6"/>',database:'<ellipse cx="12" cy="5" rx="8" ry="3"/><path d="M4 5v14c0 1.7 3.6 3 8 3s8-1.3 8-3V5M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3"/>',palette:'<path d="M12 3a9 9 0 0 0 0 18c1 0 1.7-.8 1.7-1.7 0-.5-.2-.9-.5-1.2-.3-.3-.5-.7-.5-1.2 0-.9.8-1.7 1.7-1.7H16a5 5 0 0 0 5-5c0-4-4-7.2-9-7.2z"/><circle cx="7.5" cy="11" r="1"/><circle cx="10" cy="7" r="1"/><circle cx="15" cy="7.5" r="1"/>',puzzle:'<path d="M10 3h4v2a1.5 1.5 0 0 0 3 0V3h2a2 2 0 0 1 2 2v4h-2a1.5 1.5 0 0 0 0 3h2v7a2 2 0 0 1-2 2h-4v-2a1.5 1.5 0 0 0-3 0v2H5a2 2 0 0 1-2-2v-5h2a1.5 1.5 0 0 0 0-3H3V5a2 2 0 0 1 2-2z"/>',bug:'<rect x="7" y="7" width="10" height="14" rx="5"/><path d="M9 7a3 3 0 0 1 6 0M12 11v10M3 13h4M17 13h4M4 7l3 2M20 7l-3 2M4 20l3-2M20 20l-3-2"/>',seedling:'<path d="M12 21v-9M12 12C12 8 9 5 4 5c0 4.5 3.3 7 8 7zM12 14c0-3.5 2.7-6.5 8-6.5 0 3.8-3 6.5-8 6.5z"/>',rocket:'<path d="M12 15l-3-3c1.5-4.5 5-8 10-9 0 5-3.5 8.5-7 12zM9 12H5l2-4h4M12 15v4l4-2v-4M6 18c-1 1-1.5 2.5-1.5 3.5 1 0 2.5-.5 3.5-1.5"/>',crown:'<path d="M3 8l4 4 5-7 5 7 4-4-2 11H5zM5 22h14"/>',medal:'<circle cx="12" cy="15" r="6"/><path d="M8.5 10L6 3h4l2 4 2-4h4l-2.5 7M12 12.5l.9 1.8 2 .3-1.4 1.4.3 2-1.8-1-1.8 1 .3-2-1.4-1.4 2-.3z"/>',compass:'<circle cx="12" cy="12" r="9"/><path d="M15.5 8.5l-2 5-5 2 2-5z"/>',brain:'<path d="M9 4a3 3 0 0 0-3 3 3 3 0 0 0-2 5 3 3 0 0 0 2 5 3 3 0 0 0 6 1V5a2 2 0 0 0-3-1zM15 4a3 3 0 0 1 3 3 3 3 0 0 1 2 5 3 3 0 0 1-2 5 3 3 0 0 1-6 1"/>',heartoff:'<path d="M12 21s-7.5-4.6-9.5-9.3A5.4 5.4 0 0 1 12 6.3a5.4 5.4 0 0 1 9.5 5.4C19.5 16.4 12 21 12 21z"/><path d="M12 6.3L10 11l3 2-2 4"/>',retry:'<path d="M4 12a8 8 0 1 0 2.3-5.7M4 4v4h4"/>',globe:'<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 2.7 3.8 5.7 3.8 9s-1.3 6.3-3.8 9c-2.5-2.7-3.8-5.7-3.8-9s1.3-6.3 3.8-9z"/>',briefcase:'<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2M3 13h18"/>'};
const ic=(n,z=22,w=2,f="none")=>`<svg width="${z}" height="${z}" viewBox="0 0 24 24" fill="${f}" stroke="currentColor" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${P[n]}</svg>`;
/* a coloured icon on a soft tile of the same colour */
const tile=(n,col,z=44,c="")=>`<span class="itile ${c}" style="--c:${col};width:${z}px;height:${z}px">${ic(n,Math.round(z*.56),2.2)}</span>`;
/* a picture with its coloured icon pinned to the corner */
const masc=(img,icon,col,z=46,c="")=>`<span class="masc ${c}" style="width:${z}px;height:${z}px">${im(img)}${tile(icon,col,Math.max(18,Math.round(z*.42)),"solid")}</span>`;
const im=(k,c="")=>`<img class="${c}" src="assets/${k}.webp" alt="" draggable="false">`;
const AVS=["av_laptop","av_gamer","av_chair","av_curly","av_med","av_bow","av_brown","av_street","av_elena","av_bun","av_navi","av_momo","pixar","roblox","okf","lion","fish","fly"];
const BADGES=[
{id:"first",img:"dog",n:"First Level",icon:"star",col:"#F2A900"},{id:"streak",img:"camel",n:"3 Day Streak",icon:"flame",col:"#F0642D"},{id:"perfect",img:"giraffe",n:"Perfect Score",icon:"medal",col:"#E5383B"},
{id:"bug",img:"bear",n:"Bug Squasher",icon:"bug",col:"#D6455B"},{id:"logic",img:"elephant",n:"Logic Star",icon:"brain",col:"#7B4FD6"},{id:"curious",img:"monkey",n:"Curious Mind",icon:"compass",col:"#0E8FA8"},
{id:"mid",img:"fish",n:"Mid Dev",icon:"rocket",col:"#2E7CF6"},{id:"pro",img:"fly",n:"Pro Dev",icon:"bolt",col:"#F08C00"},{id:"spec",img:"penguin",n:"Specialist",icon:"crown",col:"#E5383B"}];
const blank=()=>({ver:2,name:"",xp:0,days:[],badges:[],lv:{},onboarded:false,lives:5,lt:0,av:"av_laptop"});
/* saves from before 200-level tiers used ids 1-16 */
const upgrade=o=>{if(o&&!o.ver){o.lv=migrateLevelIds(o.lv);o.ver=2}return o};
let S;try{S=Object.assign(blank(),upgrade(JSON.parse(localStorage.getItem("codecrush")||"{}")))}catch(e){S=blank()}
let lvT=null,lvK="js";
let view=S.onboarded?"home":"onboard",tab="home",L=null,user=null,db=null,auth=null,fbOn=false,authErr="";
/* ---------- Firebase ---------- */
function save(){
  try{localStorage.setItem("codecrush",JSON.stringify(S))}catch(e){}
  if(db&&user)db.collection("users").doc(user.uid).set(S).catch(()=>{});
}
function merge(a,b){
  a=upgrade(a);b=upgrade(b);
  const r=blank(),la=a.lv||{},lb=b.lv||{};
  r.name=a.name||b.name;r.lives=b.lives!=null?b.lives:a.lives;r.lt=b.lives!=null?(b.lt||0):(a.lt||0);r.av=a.av||b.av;r.xp=Math.max(a.xp||0,b.xp||0);r.onboarded=true;
  r.days=[...new Set([...(a.days||[]),...(b.days||[])])];r.badges=[...new Set([...(a.badges||[]),...(b.badges||[])])];
  for(const k of new Set([...Object.keys(la),...Object.keys(lb)]))r.lv[k]=Math.max(la[k]||0,lb[k]||0);
  return r;
}
function initFirebase(){
  try{
    if(!window.firebase||typeof FIREBASE_CONFIG==="undefined"||!FIREBASE_CONFIG.apiKey)return;
    firebase.initializeApp(FIREBASE_CONFIG);auth=firebase.auth();db=firebase.firestore();fbOn=true;
    try{firebase.analytics()}catch(e){}
    auth.onAuthStateChanged(async u=>{
      user=u;
      if(u){
        try{const d=await db.collection("users").doc(u.uid).get();if(d.exists)S=merge(S,d.data())}catch(e){}
        if(!S.name)S.name=(u.email||"Coder").split("@")[0];
        S.onboarded=true;save();view="home";
      }
      render();
    });
  }catch(e){fbOn=false}
}
/* ---------- progress ---------- */
const stars=l=>S.lv[l.id]||0,passed=l=>stars(l)>=2;
const UNLOCK_AT=25; // pass 25 levels in a tier to open the next one
const num=l=>l.n; // level number inside its track (1-50)
const TIER_LV=TIERS.map((_,t)=>LV.filter(l=>l.tier===t));
const tierLv=t=>TIER_LV[t];
const tierPassed=t=>tierLv(t).filter(passed).length;
const tierOpen=t=>t===0||tierPassed(t-1)>=UNLOCK_AT;
const tierDone=t=>tierLv(t).every(passed);
// tracks run side by side; a level opens when the previous level in the same track (l.prev) is passed
const unlocked=l=>tierOpen(l.tier)&&(l.n===1||passed(LV[l.prev-1]));
const rankIdx=()=>{let r=0;for(let t=1;t<TIERS.length;t++)if(tierOpen(t))r=t;return r};
const nextLevel=()=>{for(let t=rankIdx();t>=0;t--){const l=tierLv(t).find(l=>unlocked(l)&&!passed(l));if(l)return l}return null};
const trackNext=k=>{for(let t=rankIdx();t>=0;t--){const l=tierLv(t).find(l=>l.trk===k&&unlocked(l)&&!passed(l));if(l)return l}return null};
const MAXL=5,REGEN=20*60*1000;
function tick(){
  if(S.lives>=MAXL){S.lt=0;return false}
  const now=Date.now();if(!S.lt){S.lt=now;return false}
  const n=Math.floor((now-S.lt)/REGEN);if(n<1)return false;
  S.lives=Math.min(MAXL,S.lives+n);S.lt=S.lives>=MAXL?0:S.lt+n*REGEN;return true;
}
function loseLife(){tick();if(S.lives>=MAXL)S.lt=Date.now();S.lives=Math.max(0,S.lives-1)}
const fmt=()=>{if(S.lives>=MAXL||!S.lt)return"";const t=Math.ceil(Math.max(0,REGEN-(Date.now()-S.lt))/1000);return String(Math.floor(t/60)).padStart(2,"0")+":"+String(t%60).padStart(2,"0")};
const heartRow=()=>`<span class="hearts">${Array.from({length:MAXL},(_,i)=>`<span class="${i<S.lives?"":"e"}">${ic("heart",20,2,"currentColor")}</span>`).join("")}</span>`;
const totalStars=()=>LV.reduce((a,l)=>a+stars(l),0);
function streak(){let n=0,d=new Date();if(!S.days.includes(iso(d)))d.setDate(d.getDate()-1);while(S.days.includes(iso(d))){n++;d.setDate(d.getDate()-1)}return n}
function weekRow(){const now=new Date(),dow=(now.getDay()+6)%7,o=[];for(let i=0;i<7;i++){const d=new Date(now);d.setDate(now.getDate()-dow+i);o.push([["Mon","Tue","Wed","Thu","Fri","Sat","Sun"][i],S.days.includes(iso(d))])}return o}
function award(){
  const g=[],add=id=>{if(!S.badges.includes(id)){S.badges.push(id);g.push(BADGES.find(b=>b.id===id))}};
  const cnt=k=>LV.filter(l=>l.trk===k&&passed(l)).length;
  if(LV.some(passed))add("first");
  if(streak()>=3)add("streak");
  if(LV.some(l=>stars(l)===3))add("perfect");
  if(cnt("debug")>=2)add("bug");
  if(cnt("logic")>=2)add("logic");
  if(Object.keys(TRK).every(k=>LV.some(l=>l.trk===k&&passed(l))))add("curious");
  if(tierOpen(1))add("mid");if(tierOpen(2))add("pro");if(tierOpen(3))add("spec");
  return g;
}
const shuffle=a=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
function startLevel(l){
  tick();if(S.lives<1){L={id:l.id};view="nolives";render();return}
  L={id:l.id,i:0,sel:null,score:0,qs:l.qs.map(([q,code,o,a,why])=>{const t=o[a],so=shuffle(o);return{q,code,o:so,a:so.indexOf(t),why}})};
  view="lesson";render();
}
/* ---------- views ---------- */
const nav=()=>`<nav>${[["home","home","Home"],["levels","grid","Levels"],["rewards","trophy","Rewards"],["profile","user","Profile"]].map(([k,i,n])=>`<button data-a="tab" data-k="${k}" class="${tab===k?"on":""}">${ic(i,24)}${n}</button>`).join("")}</nav>`;
const picker=()=>`<div class="avs">${AVS.map(k=>`<button class="avb ${S.av===k?"sel":""}" data-a="av" data-k="${k}" aria-label="Choose avatar">${im(k)}</button>`).join("")}</div>`;
const starRow=(n,z=14)=>`<span class="st stars">${[1,2,3].map(i=>`<span class="${i<=n?"f":""}">${ic("star",z,2,i<=n?"currentColor":"none")}</span>`).join("")}</span>`;
function onboarding(){
  return `<div class="scr lone">
  <div class="row" style="justify-content:space-between;min-height:24px"><img src="assets/logo-full.svg" alt="CodeCrush" class="logo-full" draggable="false">${S.onboarded?"":'<button class="mut" data-a="skip">Skip</button>'}</div>
  <h1>Code Your<br>Next Chapter</h1>
  <p class="mut" style="font-size:16px;line-height:1.4">Short, playful lessons from Beginner to Specialist. Ten minutes a day, no degree required.</p>
  <div class="hero"><div class="blob"></div>${im("hero","float")}</div>
  <div class="dots"><i></i><i></i><i></i></div>
  <button class="btn dark" data-a="start">Let's get started ${ic("arrow",20,2.5)}</button>
  <p style="text-align:center;font-size:14px" class="mut">Already have an account? <button data-a="start" style="font-weight:800;color:var(--ink);text-decoration:underline">Sign in</button></p></div>`;
}
function authView(){
  return `<div class="scr lone"><div class="top"><button class="back" data-a="back" aria-label="Back">${ic("back",20)}</button></div>
  <h1 style="font-size:30px">${fbOn?"Save your progress":"What should we call you?"}</h1>
  <p class="mut">${fbOn?"Sign in to keep your streak, stars and badges on every device.":"Firebase is not set up yet, so progress saves on this device."}</p>
  <h2 style="font-size:15px">Pick your avatar</h2>${picker()}
  ${fbOn?`<input id="em" type="email" placeholder="Email" autocomplete="email"><input id="pw" type="password" placeholder="Password (6+ characters)" autocomplete="current-password">`:""}
  <input id="nm" placeholder="Your name" value="${esc(S.name)}" maxlength="24">
  <div class="err" id="err">${esc(authErr)}</div>
  ${fbOn?`<button class="btn" data-a="login">Sign in</button><button class="btn ghost" data-a="signup">Create account</button>`:""}
  <button class="btn ${fbOn?"ghost":""}" data-a="guest">${fbOn?"Continue as guest":"Start learning"}</button></div>`;
}
function home(){
  const nx=nextLevel(),r=rankIdx();
  return `<div class="scr">
  <div class="row"><div class="av">${im(S.av)}</div><div style="flex:1"><h2>Hi, ${esc(S.name||"there")}!</h2><span class="chip">${ic("target",14)} ${TIERS[r].n}</span> <span class="chip">${ic("bolt",14)} ${S.xp} XP</span></div><img src="assets/logo-icon.svg" alt="CodeCrush" class="logo-icon"></div>
  <div class="streak"><b class="stat">${ic("flame",20)} You're on a ${streak()} day streak!</b><div class="week">${weekRow().map(([d,on])=>`<div class="${on?"on":""}"><span>${on?ic("check",14,3):""}</span>${d}</div>`).join("")}</div></div>
  <div class="card row"><span style="flex:1"><b>Lives</b><div class="mut" style="font-size:12px">${S.lives<MAXL?`Next life in <b class="lt">${fmt()}</b>`:"Full. A wrong answer costs one."}</div></span>${heartRow()}</div>
  <div class="grid">${Object.entries(TRK).map(([k,t])=>{const n=LV.filter(l=>l.trk===k&&passed(l)).length,tot=LV.filter(l=>l.trk===k).length;return `<button class="tr tilt" style="background:${t.bg}" data-a="track" data-k="${k}">${im(t.img,"mas float")}<b class="trn">${tile(t.icon,t.fg,24,"solid")}${t.n}</b><small>${t.sub}</small><div class="bar"><i style="width:${Math.max(n?4:0,n/tot*100)}%"></i></div><small style="margin:4px 0 0">${n}/${tot} levels</small></button>`}).join("")}</div>
  ${nx?`<h2>Continue learning</h2><button class="card row tilt" data-a="lv" data-k="${nx.id}">${masc(TRK[nx.trk].img,TRK[nx.trk].icon,TRK[nx.trk].fg,48)}<span style="flex:1"><b>${TRK[nx.trk].n} ${num(nx)}: ${nx.title}</b><div class="mut" style="font-size:12px">${TIERS[nx.tier].n} · ${TRK[nx.trk].n}</div></span>${ic("play",22,2,"currentColor")}</button>`:`<div class="card row">${masc("penguin","crown","#E5383B",48)}<b>You finished every level. Legend!</b></div>`}
  <p class="mut" style="text-align:center;font-size:13px">${LV.filter(passed).length} of ${LV.length} levels complete</p></div>${nav()}`;
}
function levels(){
  const nx=nextLevel();
  if(lvT==null){const l=nx||LV[0];lvT=l.tier;lvK=l.trk}
  const open=tierOpen(lvT),list=tierLv(lvT).filter(l=>l.trk===lvK),t=TRK[lvK];
  return `<div class="scr"><div class="pills"><div class="pill stat">${ic("bolt",20,2,"currentColor")} ${S.xp} XP</div><div class="pill stat">${ic("star",20,2,"currentColor")} ${totalStars()}</div><div class="pill stat" style="color:var(--bad)">${ic("heart",20,2,"currentColor")} ${S.lives}</div></div>
  <div class="tiertabs">${TIERS.map((x,ti)=>`<button class="tt ${ti===lvT?"on":""} ${tierOpen(ti)?"":"lkd"}" data-a="ltier" data-k="${ti}">${masc(x.img,x.icon,x.col,34)}<span>${x.n}</span><small>${tierPassed(ti)}/${tierLv(ti).length}</small></button>`).join("")}</div>
  ${open?"":`<div class="card row">${tile("lock","#F2A900",36)}<small style="flex:1">Pass ${UNLOCK_AT} ${TIERS[lvT-1].n} levels to unlock ${TIERS[lvT].n} (${tierPassed(lvT-1)}/${UNLOCK_AT})</small></div>`}
  <div class="trkpick">${Object.entries(TRK).map(([k,x])=>{const d=tierLv(lvT).filter(l=>l.trk===k&&passed(l)).length;return `<button class="tp ${k===lvK?"on":""}" style="--c:${x.fg};--b:${x.bg}" data-a="ltrack" data-k="${k}">${masc(x.img,x.icon,x.fg,34)}<span>${x.n}</span><small>${d}/${list.length}</small></button>`}).join("")}</div>
  <div class="row th">${masc(t.img,t.icon,t.fg,56,"float")}<div style="flex:1"><h2>${t.n} · ${TIERS[lvT].n}</h2><small>${t.sub}</small></div></div>
  <div class="lvgrid ${open?"":"locked"}">${list.map(l=>{
    const lk=!unlocked(l),s=stars(l),n=num(l);
    if(lk)return `<button class="lv lk" disabled aria-label="Level ${n} locked">${ic("lock",22,2,"#f5c400")}</button>`;
    if(!s)return `<button class="lv new tilt ${nx&&nx.id===l.id?"cur":""}" data-a="lv" data-k="${l.id}" aria-label="Level ${n}, ${esc(l.title)}">${n}<small>${n===1?"START":"NEW!"}</small></button>`;
    return `<button class="lv done tilt" data-a="lv" data-k="${l.id}" aria-label="Level ${n}, ${esc(l.title)}">${n}${starRow(s,11)}</button>`}).join("")}</div></div>${nav()}`;
}
function rewards(){
  return `<div class="scr"><h1 style="font-size:28px">Rewards</h1><p class="mut">${S.badges.length} of ${BADGES.length} badges earned</p>
  <div class="badges">${BADGES.map(b=>`<div class="bd tilt ${S.badges.includes(b.id)?"":"lock"}">${masc(b.img,b.icon,b.col,62)}${b.n}</div>`).join("")}</div></div>${nav()}`;
}
function profile(){
  return `<div class="scr"><div class="row"><div class="av lg">${im(S.av)}</div><div><h2>${esc(S.name||"Learner")}</h2><small>${user?esc(user.email||"Guest account"):"Saved on this device"}</small></div></div>
  <div class="grid"><div class="card stat">${ic("bolt",26)}<span><b style="font-size:22px">${S.xp}</b><div class="mut">Total XP</div></span></div><div class="card stat">${ic("flame",26)}<span><b style="font-size:22px">${streak()}</b><div class="mut">Day streak</div></span></div>
  <div class="card stat">${ic("star",26)}<span><b style="font-size:22px">${totalStars()}</b><div class="mut">Stars</div></span></div><div class="card stat">${ic("target",26)}<span><b style="font-size:22px">${TIERS[rankIdx()].n}</b><div class="mut">Rank</div></span></div></div>
  <h2 style="font-size:15px">Your avatar</h2>${picker()}
  ${user?`<button class="btn ghost" data-a="out">Sign out</button>`:`<button class="btn" data-a="start">${fbOn?"Sign in to sync":"Edit name"}</button>`}
  <button class="btn ghost" data-a="reset">Reset progress</button></div>${nav()}`;
}
function lesson(){
  const l=LV[L.id-1],q=L.qs[L.i],ans=L.sel!=null,ok=ans&&L.sel===q.a;
  return `<div class="scr lone"><div class="top"><button class="back" data-a="quit" aria-label="Exit lesson">${ic("back",20)}</button><div class="prog">${L.qs.map((_,i)=>`<i class="${i<L.i||(i===L.i&&ans)?"d":""}"></i>`).join("")}</div><b class="stat" style="color:var(--bad)">${ic("heart",20,2,"currentColor")}${S.lives}</b></div>
  <div class="q"><div class="row mut" style="font-weight:800;margin-bottom:6px;font-size:13px">${masc(TRK[l.trk].img,TRK[l.trk].icon,TRK[l.trk].fg,40)}${TRK[l.trk].n} · ${TIERS[l.tier].n} · Level ${num(l)}: ${l.title}</div><h2>${esc(q.q)}</h2>${q.code?`<pre>${esc(q.code)}</pre>`:""}</div>
  <div class="opts">${q.o.map((o,i)=>`<button class="opt ${ans?(i===q.a?"ok":i===L.sel?"bad":""):""}" data-a="opt" data-k="${i}" ${ans?"disabled":""}><span>${esc(o)}</span>${ans&&i===q.a?ic("check",18,3):ans&&i===L.sel?ic("x",18,3):""}</button>`).join("")}</div>
  ${ans?`<div class="fbk ${ok?"ok":"bad"} pop"><b>${ic(ok?"check":"bulb",18,3)} ${ok?"Correct! +10 XP":"Not quite. You lost a life."}</b>${esc(q.why)}</div>`:""}
  <button class="btn nextb" data-a="next" ${ans?"":"disabled"}>${S.lives<1&&ans&&!ok?"Continue":L.i+1===L.qs.length?"Finish":"Next"}</button></div>`;
}
function nolives(){
  return `<div class="scr lone mid" style="text-align:center">${im("catGrump","res float")}<h1 style="font-size:28px">Out of lives</h1>
  <div class="row" style="justify-content:center">${heartRow()}</div>
  <p class="mut">${S.lives>0?"A life is back. Ready to try again?":`Next life in <b class="lt">${fmt()}</b>. You get one back every 20 minutes.`}</p>
  ${S.lives>0&&L?`<button class="btn" data-a="again">Try again</button>`:""}<button class="btn ghost" data-a="levels">Back to levels</button></div>`;
}
function result(){
  const l=LV[L.id-1],ok=L.score>=2,same=LV.find(x=>x.trk===l.trk&&x.tier===l.tier&&x.n===l.n+1),n=same&&unlocked(same)?same:LV.find(x=>x.tier===l.tier&&unlocked(x)&&!passed(x))||same,img=!ok?"catGrump":L.score===3?"lionDance":"ok";
  return `<div class="scr lone mid" style="text-align:center">${im(img,"res float")}
  <h1 style="font-size:30px">${ok?"Level complete!":"So close!"}</h1>${starRow(L.score,34)}
  <p class="mut">${ok?`${L.score} of 3 correct, +${L.score*10} XP`:`${L.score} of 3 correct. You need 2 to move on.`}</p>
  ${L.rank?`<div class="card pop row" style="justify-content:center">${masc(TIERS[L.rank].img,TIERS[L.rank].icon,TIERS[L.rank].col,48)}<b>Rank up: ${TIERS[L.rank].n}!</b></div>`:""}
  ${L.earned.map(b=>`<div class="card pop row" style="justify-content:center">${masc(b.img,b.icon,b.col,48)}<b>New badge: ${b.n}</b></div>`).join("")}
  ${ok&&n&&unlocked(n)?`<button class="btn" data-a="lv" data-k="${n.id}">Next level ${ic("arrow",20,2.5)}</button>`:`<button class="btn" data-a="${ok?"levels":"again"}">${ok?"Back to levels":"Try again"}</button>`}
  <button class="btn ghost" data-a="${ok?"again":"levels"}">${ok?"Play again":"Back to levels"}</button></div>`;
}
function render(){
  if(tick())save();
  app.innerHTML=view==="onboard"?onboarding():view==="auth"?authView():view==="lesson"?lesson():view==="result"?result():view==="nolives"?nolives():tab==="levels"?levels():tab==="rewards"?rewards():tab==="profile"?profile():home();
}
/* ---------- actions ---------- */
function enter(){const n=$("#nm");S.name=((n&&n.value)||"").trim()||S.name||"Coder";S.onboarded=true;save();view="home";tab="home";render()}
async function cred(mk){
  const e=$("#em").value.trim(),p=$("#pw").value;S.name=$("#nm").value.trim()||S.name;
  try{mk?await auth.createUserWithEmailAndPassword(e,p):await auth.signInWithEmailAndPassword(e,p)}
  catch(x){authErr=(x.message||"Could not sign in").replace("Firebase: ","");$("#err").textContent=authErr}
}
function finish(){
  const l=LV[L.id-1],before=rankIdx(),today=iso(new Date());
  if(!S.days.includes(today))S.days.push(today);
  if(L.score>=2&&L.score>stars(l))S.lv[l.id]=L.score;
  L.earned=award();L.rank=rankIdx()>before?rankIdx():0;save();view="result";render();
}
const act={
  start(){authErr="";view="auth";render()},skip(){S.onboarded=true;view="home";render()},
  back(){view=S.onboarded?"home":"onboard";render()},guest:enter,login(){cred(false)},signup(){cred(true)},
  async out(){await auth.signOut();S=blank();save();view="onboard";render()},
  reset(){if(confirm("Reset all progress?")){const n=S.name,a=S.av;S=blank();S.name=n;S.av=a;S.onboarded=true;save();render()}},
  tab(d){tab=d.k;view="home";if(tab==="levels")lvT=null;render()},av(d){const n=$("#nm");if(n)S.name=n.value;S.av=d.k;save();render()},
  lv(d){startLevel(LV[+d.k-1])},ltier(d){lvT=+d.k;render()},ltrack(d){lvK=d.k;render()},track(d){const l=trackNext(d.k);if(l)startLevel(l);else{tab="levels";render()}},
  opt(d){const q=L.qs[L.i];L.sel=+d.k;if(L.sel===q.a){L.score++;S.xp+=10}else loseLife();save();render()},
  next(){if(S.lives<1){save();view="nolives";render();return}if(L.i+1<L.qs.length){L.i++;L.sel=null;render()}else finish()},
  quit(){save();view="home";render()},levels(){tab="levels";view="home";lvT=null;render()},again(){startLevel(LV[L.id-1])}
};
app.addEventListener("click",e=>{const b=e.target.closest("[data-a]");if(b&&!b.disabled&&act[b.dataset.a])act[b.dataset.a](b.dataset)});
/* 3D tilt on cards and tiles */
app.addEventListener("pointermove",e=>{const t=e.target.closest(".tilt");if(!t)return;const r=t.getBoundingClientRect();
  t.style.setProperty("--ry",((e.clientX-r.left)/r.width-.5)*18+"deg");t.style.setProperty("--rx",(.5-(e.clientY-r.top)/r.height)*18+"deg")});
app.addEventListener("pointerout",e=>{const t=e.target.closest(".tilt");if(t&&!t.contains(e.relatedTarget)){t.style.setProperty("--rx","0deg");t.style.setProperty("--ry","0deg")}});
initFirebase();render();
setInterval(()=>{if(tick()){save();render()}else document.querySelectorAll(".lt").forEach(e=>e.textContent=fmt())},1000);
