"use client";
import "./landing.css";
import { useEffect } from "react";

export default function Page() {
  useEffect(() => {
    // FAQ
    document.querySelectorAll('.faq-item').forEach(item => {
      item.querySelector('.faq-q')?.addEventListener('click', () => {
        const open = item.classList.contains('open');
        document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
        if (!open) item.classList.add('open');
      });
    });
    // Cursor
    const cur = document.getElementById('cursor');
    const ring = document.getElementById('cursor-ring');
    let mx=0,my=0,rx=0,ry=0;
    document.addEventListener('mousemove',(e)=>{mx=e.clientX;my=e.clientY;if(cur){cur.style.left=mx+'px';cur.style.top=my+'px';}});
    function animRing(){rx+=(mx-rx)*.12;ry+=(my-ry)*.12;if(ring){ring.style.left=rx+'px';ring.style.top=ry+'px';}requestAnimationFrame(animRing);}
    animRing();
    // Matrix
    const cv = document.getElementById('matrix-canvas') as HTMLCanvasElement;
    if(cv){
      const ctx = cv.getContext('2d');
      const tokens=['const','let','function','return','=>','{}','[]','async','await','.map(','.filter(','.then(','{...}','true','false','null','class','import','export','if(','JSON','fetch('];
      let cols:number,drops:number[];
      function resize(){cv.width=window.innerWidth;cv.height=window.innerHeight;cols=Math.floor(cv.width/80);drops=Array(cols).fill(1);}
      resize();window.addEventListener('resize',resize);
      function draw(){if(!ctx)return;ctx.fillStyle='rgba(5,5,10,.18)';ctx.fillRect(0,0,cv.width,cv.height);ctx.font='11px monospace';drops.forEach((y,i)=>{const t=tokens[Math.floor(Math.random()*tokens.length)];const r=Math.random();ctx.fillStyle=r>.85?'rgba(201,168,76,.7)':r>.6?'rgba(0,255,136,.5)':'rgba(0,212,255,.3)';ctx.fillText(t,i*80+10,y*18);if(y*18>cv.height&&Math.random()>.96)drops[i]=0;drops[i]+=.4;});}
      setInterval(draw,60);
    }
    // Typed
    const phrases=['Aprenda o JavaScript que realmente importa.','Sem enrolação. Sem pré-requisito.','7 módulos para você ler qualquer código da IA.'];
    let pi=0,ci=0,isDeleting=false;
    function type(){const full=phrases[pi];const display=isDeleting?full.slice(0,ci-1):full.slice(0,ci+1);const el=document.getElementById('typed-text');if(el)el.innerHTML=display+'<span style="color:#C9A84C;animation:blink 1s infinite">|</span>';isDeleting?ci--:ci++;if(!isDeleting&&ci>full.length){setTimeout(()=>{isDeleting=true;},1800);setTimeout(type,100);return;}if(isDeleting&&ci===0){isDeleting=false;pi=(pi+1)%phrases.length;}setTimeout(type,isDeleting?40:70);}
    type();
    // Reveal
    const obs=new IntersectionObserver(entries=>{entries.forEach(e=>{if(e.isIntersecting){(e.target as HTMLElement).style.opacity='1';(e.target as HTMLElement).style.transform='perspective(1000px) rotateX(0) translateY(0)';obs.unobserve(e.target);}});},{threshold:.08});
    document.querySelectorAll('.reveal').forEach(el=>{(el as HTMLElement).style.opacity='0';(el as HTMLElement).style.transform='perspective(1000px) rotateX(8deg) translateY(40px)';(el as HTMLElement).style.transition='opacity .8s ease,transform .8s ease';obs.observe(el);});
    // Tilt
    document.querySelectorAll('.mod-card,.plan-card').forEach(card=>{
      card.addEventListener('mousemove',(e)=>{const me=e as MouseEvent;const r=card.getBoundingClientRect();const x=me.clientX-r.left,y=me.clientY-r.top;const cx=r.width/2,cy=r.height/2;const rx2=((y-cy)/cy)*6,ry2=-((x-cx)/cx)*6;(card as HTMLElement).style.transform=`perspective(800px) rotateX(${rx2}deg) rotateY(${ry2}deg) scale(1.02)`;});
      card.addEventListener('mouseleave',()=>{(card as HTMLElement).style.transform='perspective(800px) rotateX(0) rotateY(0) scale(1)';});
    });
  }, []);

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;700&family=Syne:wght@400;600;700;800&display=swap" rel="stylesheet" />
      <div id="cursor"></div>
      <div id="cursor-ring"></div>
      <div className="grid-lines"></div>
      <canvas id="matrix-canvas"></canvas>
      <nav>
        <div className="logo"><em>//</em> JS <span>para Criadores</span></div>
        <div style={{display:'flex',gap:'32px'}}>
          <a href="#modulos">Conteúdo</a>
          <a href="#planos">Preços</a>
        </div>
      </nav>
      <section className="hero">
        <div className="terminal-badge"><span className="dot"></span>curso de JavaScript para quem cria com IA</div>
        <h1>Você usa IA pra criar.<br /><span className="line2">Mas não entende o código.</span></h1>
        <p className="hero-sub" id="typed-text"></p>
        <div className="tools-row">
          <span className="tool-tag">Lovable</span><span className="tool-tag">v0</span><span className="tool-tag">Bolt</span><span className="tool-tag">Cursor</span><span className="tool-tag">GitHub Copilot</span><span className="tool-tag">+ qualquer outra</span>
        </div>
        <div className="hero-cta">
          <a href="#planos" className="btn-primary">Quero entender o código</a>
          <a href="#modulos" className="btn-ghost">Ver conteúdo</a>
        </div>
      </section>
      <section className="pain reveal">
        <p className="section-tag">Para quem é isso</p>
        <h2 className="section-h">Se você já viveu<br />alguma dessas situações…</h2>
        <div className="pain-grid">
          <div className="pain-card"><p className="pain-n">// erro_01</p><p><strong>A IA gerou um erro vermelho</strong>e você ficou olhando sem saber o que aquele stack trace significa.</p></div>
          <div className="pain-card"><p className="pain-n">// erro_02</p><p><strong>Você pediu uma mudança simples</strong>e a IA reescreveu tudo — porque você não sabia onde mexer.</p></div>
          <div className="pain-card"><p className="pain-n">// erro_03</p><p><strong>Você usa v0, Bolt ou Lovable</strong>mas trava toda vez que a IA não entende o que você precisa.</p></div>
          <div className="pain-card"><p className="pain-n">// erro_04</p><p><strong>Você copiou um trecho de código</strong>sem entender nada, torceu pra funcionar — e não funcionou.</p></div>
        </div>
      </section>
      <section className="modules-wrap" id="modulos">
        <div className="modules-inner">
          <div className="reveal"><p className="section-tag">Conteúdo</p><h2 className="section-h">7 módulos.<br />Do zero ao que importa de verdade.</h2></div>
          <div className="mod-grid">
            <div className="mod-card reveal"><p className="mod-num">// módulo_01</p><p className="mod-title">Por que JS importa usando IA</p><p className="mod-desc">O papel do JavaScript no que Lovable, v0 e Bolt geram. Por que entender isso muda tudo.</p></div>
            <div className="mod-card reveal"><p className="mod-num">// módulo_02</p><p className="mod-title">Variáveis — onde os dados vivem</p><p className="mod-desc">const, let, var. Tipos de dados. A IA usa isso o tempo todo sem você perceber.</p><div className="code-block"><span className="ck">const</span> nome <span className="cm">= </span><span className="cs">&quot;você&quot;</span><span className="cm">;</span><br /><span className="ck">let</span> contador <span className="cm">= </span><span className="cf">0</span><span className="cm">; // já entende!</span></div></div>
            <div className="mod-card reveal"><p className="mod-num">// módulo_03</p><p className="mod-title">Funções — o que acontece no clique</p><p className="mod-desc">Toda ação no seu app é uma função. Leia, entenda e edite em qualquer ferramenta.</p></div>
            <div className="mod-card reveal"><p className="mod-num">// módulo_04</p><p className="mod-title">Condicionais — lógica de se/então</p><p className="mod-desc">if, else, operadores. A base de toda regra de negócio que você pede pra IA criar.</p></div>
            <div className="mod-card reveal"><p className="mod-num">// módulo_05</p><p className="mod-title">Arrays e Objetos — o formato da IA</p><p className="mod-desc">JSON, listas, objetos. Tudo que vai e vem de APIs e bancos de dados passa por aqui.</p></div>
            <div className="mod-card reveal"><p className="mod-num">// módulo_06</p><p className="mod-title">Como ler um erro sem pânico</p><p className="mod-desc">Console, stack trace, mensagens de erro. Decifre o que o código tá tentando te dizer.</p></div>
            <div className="mod-card reveal"><p className="mod-num">// módulo_07</p><p className="mod-title">Entendendo o código que a IA escreveu</p><p className="mod-desc">Um componente real gerado por IA, destrinchado linha por linha.</p></div>
            <div className="mod-card mod-bonus reveal"><p className="mod-num" style={{color:'var(--gold)',opacity:1}}>// bônus</p><p className="mod-title">Glossário do Criador</p><p className="mod-desc">40 termos que sempre aparecem no Lovable, v0, Bolt, Cursor e Claude — em português.</p></div>
          </div>
        </div>
      </section>
      <section className="plans-wrap" id="planos">
        <div className="reveal"><p className="section-tag">Planos</p><h2 className="section-h">Dois formatos.<br />O mesmo conteúdo.</h2></div>
        <div className="plans-grid">
          <div className="plan-card reveal">
            <p className="plan-name">Essencial</p><p className="plan-format">PDF completo</p>
            <p className="plan-price"><sup>R$</sup>47</p><p className="plan-installment">ou 2x de R$24,50</p>
            <ul className="plan-features">
              <li><span className="ico">[✓]</span>PDF com todos os 7 módulos</li>
              <li><span className="ico">[✓]</span>Glossário do Criador</li>
              <li><span className="ico">[✓]</span>Exemplos de código reais</li>
              <li><span className="ico">[✓]</span>Acesso vitalício</li>
              <li className="off"><span className="ico">[x]</span>Mini-curso interativo HTML</li>
              <li className="off"><span className="ico">[x]</span>Exercícios práticos</li>
            </ul>
            <a href="#" className="btn-ghost" style={{display:'block',textAlign:'center'}}>Quero o PDF — R$47</a>
          </div>
          <div className="plan-card hot reveal">
            <div className="plan-hot-badge">Mais completo</div>
            <p className="plan-name">Completo</p><p className="plan-format">Mini-curso interativo</p>
            <p className="plan-price"><sup>R$</sup>67</p><p className="plan-installment">ou 3x de R$23,50</p>
            <ul className="plan-features">
              <li><span className="ico">[✓]</span>PDF com todos os 7 módulos</li>
              <li><span className="ico">[✓]</span>Glossário do Criador</li>
              <li><span className="ico">[✓]</span>Exemplos de código reais</li>
              <li><span className="ico">[✓]</span>Acesso vitalício</li>
              <li><span className="ico">[✓]</span>Mini-curso interativo HTML</li>
              <li><span className="ico">[✓]</span>Exercícios práticos</li>
            </ul>
            <a href="#" className="btn-primary" style={{display:'block',textAlign:'center'}}>Quero o Completo — R$67</a>
          </div>
        </div>
      </section>
      <section className="guarantee reveal">
        <div className="guarantee-inner">
          <div className="shield">🛡</div>
          <h3>Garantia de 7 dias</h3>
          <p>Se você não sentir que evoluiu no entendimento do código em até 7 dias, devolvo 100% do seu dinheiro. Sem perguntas.</p>
        </div>
      </section>
      <section className="faq-wrap">
        <div className="reveal"><p className="section-tag">Dúvidas</p><h2 className="section-h" style={{marginBottom:'48px'}}>FAQ</h2></div>
        <div className="faq-item"><div className="faq-q">Preciso ter experiência em programação?</div><div className="faq-a">Zero. Feito para quem nunca estudou código e usa ferramentas de IA como Lovable, v0 ou Bolt.</div></div>
        <div className="faq-item"><div className="faq-q">Qual a diferença real entre os planos?</div><div className="faq-a">No Essencial você recebe o PDF. No Completo você acessa uma página HTML interativa com exercícios práticos no próprio navegador.</div></div>
        <div className="faq-item"><div className="faq-q">Funciona com qualquer IA de código?</div><div className="faq-a">Sim. O JavaScript que Lovable, v0, Bolt e Cursor geram segue o mesmo padrão. Entendendo a base, você lê qualquer coisa.</div></div>
        <div className="faq-item"><div className="faq-q">Por quanto tempo tenho acesso?</div><div className="faq-a">Acesso vitalício. Baixe o PDF ou acesse o mini-curso quantas vezes quiser, para sempre.</div></div>
      </section>
      <footer>
        <div className="logo"><em>//</em> JS <span>para Criadores</span></div>
        <p>Lajeado, RS — 2025</p>
        <p style={{color:'#C9A84C',fontFamily:'JetBrains Mono,monospace',fontSize:'12px'}}>@mxdigital.ia</p>
        <p>Produto digital. Sem envio físico.</p>
      </footer>
    </>
  );
}