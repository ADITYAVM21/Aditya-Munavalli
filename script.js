const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const reduce=matchMedia('(prefers-reduced-motion:reduce)').matches;
const COL=['var(--p)','var(--y)','var(--b)','var(--g)','var(--o)'];

/* mascots: googly eyes that follow the cursor */
const SAY=['It works on my machine!','NullPointerException? Never met her.','while(true){ build(); }','Stack overflowing with ideas!'];
$$('.blobs').forEach(box=>SAY.forEach((s,i)=>{
  const b=document.createElement('div');b.className='blob';
  b.style.cssText=`--c:${['var(--g)','var(--p)','var(--o)','var(--b)'][i]};--dl:${i*.3}s`;
  b.innerHTML='<i class="eye"><b></b></i><i class="eye"><b></b></i><span class="mouth"></span>';
  b.onclick=e=>{e.stopPropagation();b.classList.remove('sq');void b.offsetWidth;b.classList.add('sq');
    const r=b.getBoundingClientRect(),t=document.createElement('div');t.className='say';t.textContent=s;
    t.style.left=Math.min(Math.max(r.left+r.width/2,110),innerWidth-110)+'px';t.style.top=r.top+'px';document.body.append(t);setTimeout(()=>t.remove(),1800);pop(r.left+r.width/2,r.top,8)};
  box.append(b)}));
let mx=innerWidth/2,my=innerHeight/2,tick=0;
addEventListener('pointermove',e=>{mx=e.clientX;my=e.clientY;if(!tick)tick=requestAnimationFrame(()=>{tick=0;
  $$('.eye').forEach(el=>{const r=el.getBoundingClientRect(),a=Math.atan2(my-r.top-r.height/2,mx-r.left-r.width/2);
    el.firstChild.style.setProperty('--x',Math.cos(a)*6+'px');el.firstChild.style.setProperty('--y',Math.sin(a)*6+'px')})})});

/* confetti */
const BITS=['⭐','✨','💥','🎈','🍩','🔥','💜','🌈'];
function pop(x,y,n=8){n=reduce?Math.min(n,2):n;for(let i=0;i<n;i++){const s=document.createElement('span');s.className='pop';
  s.textContent=BITS[Math.random()*BITS.length|0];s.style.left=x+'px';s.style.top=y+'px';document.body.append(s);
  const a=Math.random()*6.28,d=40+Math.random()*90;
  s.animate([{transform:'translate(0,0) scale(.4)',opacity:1},{transform:`translate(${Math.cos(a)*d}px,${Math.sin(a)*d-40}px) rotate(${Math.random()*360}deg) scale(1.2)`,opacity:0}],{duration:900,easing:'ease-out'}).onfinish=()=>s.remove()}}
addEventListener('click',e=>{if(!e.target.closest('input,canvas'))pop(e.clientX,e.clientY,6)});

/* gate */
const gate=$('#gate'),enter=$('#enter'),msgs=['Inflating blobs…','Compiling jokes…','Feeding the bugs…','Ready!'];
msgs.forEach((m,i)=>setTimeout(()=>{$('#load').textContent=m;if(i==3){enter.hidden=false;enter.focus()}},i*450));
function go(){if(gate.classList.contains('go'))return;gate.classList.add('go');pop(innerWidth/2,innerHeight/2,24);
  setTimeout(()=>document.documentElement.classList.add('in'),350);setTimeout(()=>gate.classList.add('done'),1300)}
enter.onclick=go;addEventListener('keydown',e=>{if(e.key==='Enter'&&!enter.hidden)go()});

/* name letters */
$$('[data-split]').forEach(h=>{const t=h.textContent;h.setAttribute('aria-label',t);h.textContent='';
  [...t].forEach((c,i)=>{const s=document.createElement('span');s.textContent=c===' '?'':c;s.setAttribute('aria-hidden','true');
    s.style.cssText=`--i:${i};--c:${COL[i%5]}`;if(c===' ')s.className='sp';
    s.onpointerenter=()=>{s.classList.remove('j');void s.offsetWidth;s.classList.add('j')};h.append(s)})});

/* typing */
const W=['Java Backend Developer','Spring Boot Developer','Competitive Programmer','Startup Builder','Problem Solver'];
let w=0,l=0,del=false;(function type(){const c=W[w],el=$('#typing');el.textContent=c.slice(0,l);
  if(!del&&l===c.length){del=true;return setTimeout(type,1400)}
  if(del&&l===0){del=false;w=(w+1)%W.length}
  l+=del?-1:1;setTimeout(type,del?40:90)})();

/* ticker + counters */
$$('.ticker div').forEach(d=>d.innerHTML+=d.innerHTML);
const io=new IntersectionObserver(es=>es.forEach(e=>{if(!e.isIntersecting)return;io.unobserve(e.target);
  const n=+e.target.dataset.n,t0=performance.now();(function f(t){const k=Math.min((t-t0)/1400,1);
  e.target.textContent=Math.round(n*(1-Math.pow(1-k,3)));if(k<1)requestAnimationFrame(f)})(t0)}),{threshold:.6});
$$('.counter').forEach(c=>io.observe(c));

/* scroll bar, active nav, top button */
const links=$$('nav li a'),secs=links.map(a=>$(a.getAttribute('href')));
addEventListener('scroll',()=>{const h=document.documentElement,p=scrollY/(h.scrollHeight-innerHeight);
  $('#bar').style.width=p*100+'%';$('#top').classList.toggle('show',scrollY>600);
  secs.forEach((s,i)=>links[i].classList.toggle('active',s.getBoundingClientRect().top<innerHeight*.4&&s.getBoundingClientRect().bottom>innerHeight*.4))},{passive:true});
$('#top').onclick=()=>scrollTo({top:0});

/* draggable project rail */
const rail=$('.rail');let down=false,sx=0,sl=0,moved=0;
rail.onpointerdown=e=>{if(e.pointerType!=='mouse')return;down=true;moved=0;sx=e.clientX;sl=rail.scrollLeft};
addEventListener('pointermove',e=>{if(!down)return;moved=Math.abs(e.clientX-sx);if(moved>5)rail.classList.add('drag');rail.scrollLeft=sl-(e.clientX-sx)});
addEventListener('pointerup',()=>{down=false;setTimeout(()=>rail.classList.remove('drag'),0)});
$$('.rb').forEach(b=>b.onclick=()=>rail.scrollBy({left:b.dataset.d*340,behavior:'smooth'}));

/* doodle wall */
const cv=$('#cv');if(innerWidth<700){cv.width=800;cv.height=800}const cx=cv.getContext('2d');cx.fillStyle='#fbf4e2';cx.fillRect(0,0,cv.width,cv.height);
let tool='pencil',color='#2a2748',draw=false,last;
['#2a2748','#e0919f','#e3a068','#e8c25a','#9cc18c','#86b9c9','#6a4fb3'].forEach((c,i)=>{const b=document.createElement('button');
  b.style.setProperty('--c',c);b.setAttribute('aria-label','Color '+c);if(!i)b.className='on';
  b.onclick=()=>{color=c;$$('#sw button').forEach(x=>x.classList.toggle('on',x===b));if(tool==='eraser')pick('pencil')};$('#sw').append(b)});
function pick(t){tool=t;$$('[data-tool]').forEach(b=>b.classList.toggle('on',b.dataset.tool===t))}
$$('[data-tool]').forEach(b=>b.onclick=()=>pick(b.dataset.tool));
const pt=e=>{const r=cv.getBoundingClientRect(),k=cv.width/r.width;return[(e.clientX-r.left)*k,(e.clientY-r.top)*k]};
function paint(p){const s=+$('#size').value;
  if(tool==='spray'){cx.fillStyle=color;for(let i=0;i<22;i++){const a=Math.random()*6.28,r=Math.random()*s*2.2;cx.fillRect(p[0]+Math.cos(a)*r,p[1]+Math.sin(a)*r,2.5,2.5)}return}
  cx.strokeStyle=tool==='eraser'?'#fbf4e2':color;cx.lineWidth=tool==='eraser'?s*2:s;cx.lineCap=cx.lineJoin='round';
  cx.beginPath();cx.moveTo(last[0],last[1]);cx.lineTo(p[0]+.01,p[1]);cx.stroke()}
cv.onpointerdown=e=>{draw=true;cv.setPointerCapture(e.pointerId);last=pt(e);paint(last)};
cv.onpointermove=e=>{if(!draw)return;const p=pt(e);paint(p);last=p};
cv.onpointerup=()=>draw=false;
$('#clear').onclick=()=>{cx.fillStyle='#fbf4e2';cx.fillRect(0,0,cv.width,cv.height)};
$('#save').onclick=()=>{const a=document.createElement('a');a.download='my-doodle.png';a.href=cv.toDataURL();a.click()};

/* chaos button */
$('#chaos').onclick=e=>{e.stopPropagation();const h=document.documentElement;if(h.classList.contains('chaos'))return;h.classList.add('chaos');
  const rain=reduce?0:setInterval(()=>pop(Math.random()*innerWidth,Math.random()*innerHeight*.6,3),120);
  setTimeout(()=>{h.classList.remove('chaos');clearInterval(rain)},6000)};
