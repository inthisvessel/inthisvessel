// In This Vessel: shared behavior for the case study and about pages.
(()=>{
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));

// vessel logo fills and the reading bar grows as you scroll
const vfill=$('#vfill'),bar=$('.readbar');
function onScroll(){
  const h=document.documentElement.scrollHeight-innerHeight,p=h>0?clamp(scrollY/h,0,1):0;
  if(vfill)vfill.setAttribute('y',30-30*p);
  if(bar)bar.style.width=(p*100)+'%';
}
addEventListener('scroll',onScroll,{passive:true});onScroll();

// reveal blocks that start below the fold
const rio=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.remove('pre');rio.unobserve(e.target)}}),{threshold:.12});
$$('.reveal').forEach(el=>{if(el.getBoundingClientRect().top>innerHeight){el.classList.add('pre');rio.observe(el)}});

// count up numbers that carry data-count
const cio=new IntersectionObserver(es=>es.forEach(e=>{
  if(!e.isIntersecting||reduce)return;cio.unobserve(e.target);
  const el=e.target,to=+el.dataset.count,suf=el.dataset.suffix||'',pre=el.dataset.prefix||'',t0=performance.now();
  const step=t=>{const p=clamp((t-t0)/1100,0,1);el.textContent=pre+Math.round(to*(1-Math.pow(1-p,3)))+suf;if(p<1)requestAnimationFrame(step)};
  requestAnimationFrame(step);
}),{threshold:.6});
$$('[data-count]').forEach(el=>cio.observe(el));

// flip cards
$$('.flip').forEach(b=>b.addEventListener('click',()=>b.setAttribute('aria-pressed',b.getAttribute('aria-pressed')!=='true')));

// decision log: tabs plus a step-through of finding, insight, decision, outcome, tradeoff
$$('.decision').forEach(root=>{
  const data=JSON.parse(root.querySelector('script[type="application/json"]').textContent);
  const tabs=root.querySelector('.dec-tabs'),body=root.querySelector('.dec-body');
  const labels=[['finding','Finding'],['insight','Insight'],['decision','Decision'],['outcome','Outcome'],['tradeoff','Tradeoff accepted']];
  let cur=0,shown=1;
  tabs.innerHTML=data.map((d,i)=>`<button type="button" role="tab" aria-selected="${i===0}" data-i="${i}">0${i+1} · ${d.short}</button>`).join('');
  function draw(){
    const d=data[cur];
    body.innerHTML=`<div><div class="mono muted">DECISION 0${cur+1} OF 0${data.length}</div><h3 style="margin-top:10px">${d.q}</h3>
      <div class="dec-ctrl"><button class="sbtn dark" type="button" data-a="next" ${shown>=5?'disabled':''}>Show next step →</button><button class="sbtn" type="button" data-a="all">Show all</button></div></div>
      <div class="steps">${labels.map(([k,l],i)=>`<div class="stepx${i<shown?' on':''}${k==='tradeoff'?' trade':''}"><small>${l}</small><p>${d[k]}</p></div>`).join('')}</div>`;
  }
  tabs.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;cur=+b.dataset.i;shown=1;
    tabs.querySelectorAll('button').forEach(x=>x.setAttribute('aria-selected',x===b));draw()});
  body.addEventListener('click',e=>{const b=e.target.closest('[data-a]');if(!b)return;shown=b.dataset.a==='all'?5:Math.min(5,shown+1);draw()});
  if(reduce)shown=5;
  draw();
});
})();
