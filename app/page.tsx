'use client';

import { useEffect } from 'react';

export default function Page() {
  useEffect(() => {
    // Lógica do Cursor Personalizado
    const cur = document.getElementById('cursor');
    const ring = document.getElementById('cursor-ring');
    let mx = 0, my = 0, rx = 0, ry = 0;
    document.addEventListener('mousemove', (e) => {
      const mouseE = e as MouseEvent;
      mx = mouseE.clientX;
      my = mouseE.clientY;
      if (cur) {
        cur.style.left = mx + 'px';
        cur.style.top = my + 'px';
      }
    });
    const animRing = () => {
      rx += (mx - rx) * 0.12;
      ry += (my - ry) * 0.12;
      if (ring) {
        ring.style.left = rx + 'px';
        ring.style.top = ry + 'px';
      }
      requestAnimationFrame(animRing);
    };
    animRing();

    // Efeito Matrix no Fundo
    const cv = document.getElementById('matrix-canvas') as HTMLCanvasElement;
    if (cv) {
      const ctx = cv.getContext('2d');
      const tokens = ['const', 'let', 'function', 'return', '=>', '{}', '[]', 'async', 'await', '.map(', '.filter(', '.then(', '{...}', 'true', 'false', 'null', 'undefined', 'class', 'import', 'export', 'if(', 'else{', 'for(', 'try{', 'catch', 'JSON', 'fetch('];
      let cols: number, drops: number[], W: number, H: number;
      const resizeCanvas = () => {
        W = cv.width = window.innerWidth;
        H = cv.height = window.innerHeight;
        cols = Math.floor(W / 80);
        drops = Array(cols).fill(1);
      };
      resizeCanvas();
      window.addEventListener('resize', resizeCanvas);
      const drawMatrix = () => {
        if (ctx) {
          ctx.fillStyle = 'rgba(5,5,10,.18)';
          ctx.fillRect(0, 0, W, H);
          ctx.font = '11px JetBrains Mono,monospace';
          drops.forEach((y, i) => {
            const t = tokens[Math.floor(Math.random() * tokens.length)];
            const r = Math.random();
            ctx.fillStyle = r > 0.85 ? 'rgba(201,168,76,.7)' : r > 0.6 ? 'rgba(0,255,136,.5)' : 'rgba(0,212,255,.3)';
            ctx.fillText(t, i * 80 + 10, y * 18);
            if (y * 18 > H && Math.random() > 0.96) drops[i] = 0;
            drops[i] += 0.4;
          });
        }
      };
      setInterval(drawMatrix, 60);
    }

    // Efeito de Digitação (Typewriter)
    const phrases = ['Aprenda o JavaScript que realmente importa.', 'Sem enrolação. Sem pré-requisito.', '7 módulos para você ler qualquer código da IA.'];
    let pi = 0, ci = 0, isDeleting = false;
    const type = () => {
      const full = phrases[pi];
      const display = isDeleting ? full.slice(0, ci - 1) : full.slice(0, ci + 1);
      const typedText = document.getElementById('typed-text');
      if (typedText) {
        typedText.innerHTML = display + '<span class="typed-cursor">|</span>';
      }
      if (!isDeleting) {
        ci++;
        if (ci > full.length) {
          setTimeout(() => { isDeleting = true; }, 1800);
          setTimeout(type, 100);
          return;
        }
      } else {
        ci--;
        if (ci === 0) {
          isDeleting = false;
          pi = (pi + 1) % phrases.length;
        }
      }
      setTimeout(type, isDeleting ? 40 : 70);
    };
    type();

    // Scroll Reveal
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.08 });
    document.querySelectorAll('.reveal').forEach(el => obs.observe(el));

    // Efeito 3D nos Cards
    document.querySelectorAll('.mod-card, .plan-card').forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const mouseE = e as MouseEvent;
        const r = card.getBoundingClientRect();
        const x = mouseE.clientX - r.left, y = mouseE.clientY - r.top;
        const cx = r.width / 2, cy = r.height / 2;
        const rx2 = ((y - cy) / cy) * 6, ry2 = -((x - cx) / cx) * 6;
        (card as HTMLElement).style.transform = `perspective(800px) rotateX(${rx2}deg) rotateY(${ry2}deg) scale(1.02)`;
        (card as HTMLElement).style.setProperty('--mx', x + 'px');
        (card as HTMLElement).style.setProperty('--my', y + 'px');
      });
      card.addEventListener('mouseleave', () => {
        (card as HTMLElement).style.transform = 'perspective(800px) rotateX(0) rotateY(0) scale(1)';
      });
    });

    // Lógica do FAQ (Accordion)
    document.querySelectorAll('.faq-item').forEach(item => {
      const q = item.querySelector('.faq-q');
      if (q) {
        q.addEventListener('click', () => {
          const open = item.classList.contains('open');
          document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
          if (!open) item.classList.add('open');
        });
      }
    });
  }, []);

  return (
    <>
      <style jsx>{`
        :root {
          --bg: #05050a;
          --bg2: #08080f;
          --card: #0c0c16;
          --border: #1a1a2e;
          --gold: #C9A84C;
          --gold2: #e8c56a;
          --green: #00ff88;
          --cyan: #00d4ff;
          --text: #dcdce8;
          --muted: #666680;
          --white: #f0f0ff;
        }

        *{margin:0;padding:0;box-sizing:border-box}
        html{scroll-behavior:smooth}
        body{
          background:var(--bg);
          color:var(--text);
          font-family:'Syne',sans-serif;
          overflow-x:hidden;
          cursor:none;
        }

        #cursor{
          position:fixed;width:12px;height:12px;
          background:var(--gold);border-radius:50%;
          pointer-events:none;z-index:9999;
          transform:translate(-50%,-50%);
          transition:transform .1s,width .2s,height .2s,background .2s;
          mix-blend-mode:difference;
        }
        #cursor-ring{
          position:fixed;width:36px;height:36px;
          border:1px solid var(--gold);border-radius:50%;
          pointer-events:none;z-index:9998;
          transform:translate(-50%,-50%);
          transition:transform .15s ease-out,width .3s,height .3s;
          opacity:.5;
        }
        body:has(a:hover) #cursor,body:has(button:hover) #cursor{width:20px;height:20px}
        body:has(a:hover) #cursor-ring,body:has(button:hover) #cursor-ring{width:52px;height:52px;opacity:.2}

        #matrix-canvas{
          position:fixed;inset:0;
          pointer-events:none;z-index:0;
          opacity:.25;
        }

        .grid-lines{
          position:fixed;inset:0;
          pointer-events:none;z-index:0;
          background-image:
            linear-gradient(rgba(201,168,76,.04) 1px,transparent 1px),
            linear-gradient(90deg,rgba(201,168,76,.04) 1px,transparent 1px);
          background-size:60px 60px;
        }

        nav{
          position:fixed;top:0;left:0;right:0;z-index:100;
          display:flex;justify-content:space-between;align-items:center;
          padding:20px 60px;
          border-bottom:1px solid var(--border);
          background:rgba(5,5,10,.85);
          backdrop-filter:blur(20px);
        }
        .logo{
          font-family:'JetBrains Mono',monospace;
          font-size:14px;font-weight:500;
          letter-spacing:.05em;color:var(--gold);
        }
        .logo span{color:var(--white)}
        .logo em{color:var(--green);font-style:normal}
        nav a{
          font-family:'JetBrains Mono',monospace;
          font-size:11px;font-weight:400;
          letter-spacing:.15em;text-transform:uppercase;
          color:var(--muted);text-decoration:none;
          transition:color .2s;
        }
        nav a:hover{color:var(--gold)}

        .hero{
          min-height:100vh;
          display:flex;flex-direction:column;
          justify-content:center;align-items:center;
          text-align:center;
          padding:140px 24px 80px;
          position:relative;z-index:1;
        }

        .terminal-badge{
          display:inline-flex;align-items:center;gap:8px;
          font-family:'JetBrains Mono',monospace;
          font-size:11px;color:var(--green);
          border:1px solid rgba(0,255,136,.2);
          padding:8px 20px;margin-bottom:48px;
          animation:fadeUp .8s ease both;
          background:rgba(0,255,136,.04);
        }
        .terminal-badge::before{content:'> ';opacity:.5}
        .dot{
          width:6px;height:6px;border-radius:50%;
          background:var(--green);
          animation:pulse 2s infinite;
        }

        .hero h1{
          font-size:clamp(40px,6.5vw,88px);
          font-weight:800;line-height:1.0;
          letter-spacing:-.03em;
          max-width:900px;
          animation:fadeUp .8s ease .1s both;
        }
        .hero h1 .line2{
          display:block;
          background:linear-gradient(135deg,var(--gold) 0%,var(--gold2) 40%,var(--cyan) 100%);
          -webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;
          position:relative;
        }
        
        .glitch{
          position:relative;
          display:inline-block;
        }
        .glitch::before,.glitch::after{
          content:attr(data-text);
          position:absolute;inset:0;
          background:inherit;
          -webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;
        }
        .glitch::before{
          animation:glitch1 4s infinite;
          clip-path:polygon(0 0,100% 0,100% 35%,0 35%);
        }
        .glitch::after{
          animation:glitch2 4s infinite;
          clip-path:polygon(0 65%,100% 65%,100% 100%,0 100%);
        }

        .hero-sub{
          margin-top:32px;
          font-family:'JetBrains Mono',monospace;
          font-size:14px;font-weight:300;
          color:var(--muted);max-width:560px;line-height:1.9;
          animation:fadeUp .8s ease .2s both;
        }
        .hero-sub .typed-cursor{
          color:var(--gold);animation:blink 1s infinite;
        }

        .tools-row{
          margin-top:40px;
          display:flex;align-items:center;gap:12px;flex-wrap:wrap;
          justify-content:center;
          animation:fadeUp .8s ease .3s both;
        }
        .tool-tag{
          font-family:'JetBrains Mono',monospace;
          font-size:11px;color:var(--cyan);
          border:1px solid rgba(0,212,255,.2);
          padding:5px 14px;
          background:rgba(0,212,255,.04);
        }

        .hero-cta{
          margin-top:56px;
          display:flex;gap:16px;flex-wrap:wrap;justify-content:center;
          animation:fadeUp .8s ease .4s both;
        }
        .btn-primary{
          font-family:'JetBrains Mono',monospace;
          font-size:11px;font-weight:500;
          letter-spacing:.15em;text-transform:uppercase;
          background:var(--gold);color:#05050a;
          padding:15px 36px;text-decoration:none;
          position:relative;overflow:hidden;
          transition:transform .2s;
          display:inline-block;
        }
        .btn-primary::after{
          content:'';position:absolute;inset:0;
          background:linear-gradient(90deg,transparent,rgba(255,255,255,.25),transparent);
          transform:translateX(-100%);
          transition:transform .5s;
        }
        .btn-primary:hover::after{transform:translateX(100%)}
        .btn-primary:hover{transform:translateY(-2px)}
        .btn-ghost{
          font-family:'JetBrains Mono',monospace;
          font-size:11px;font-weight:400;
          letter-spacing:.15em;text-transform:uppercase;
          border:1px solid var(--border);color:var(--muted);
          padding:15px 36px;text-decoration:none;
          transition:border-color .2s,color .2s;
          display:inline-block;
        }
        .btn-ghost:hover{border-color:var(--gold);color:var(--gold)}

        .hero-line{
          position:absolute;bottom:0;left:50%;transform:translateX(-50%);
          width:1px;height:80px;
          background:linear-gradient(transparent,var(--gold));
          animation:lineGrow 2s ease 1s both;
        }

        section{position:relative;z-index:1}
        .reveal{
          opacity:0;
          transform:perspective(1000px) rotateX(8deg) translateY(40px);
          transition:opacity .8s ease,transform .8s ease;
        }
        .reveal.visible{
          opacity:1;
          transform:perspective(1000px) rotateX(0) translateY(0);
        }

        .pain{padding:120px 60px;max-width:1100px;margin:0 auto}
        .section-tag{
          font-family:'JetBrains Mono',monospace;
          font-size:10px;letter-spacing:.3em;text-transform:uppercase;
          color:var(--green);margin-bottom:16px;
          display:flex;align-items:center;gap:8px;
        }
        .section-tag::before{content:'//';opacity:.4}
        .section-h{
          font-size:clamp(28px,4vw,52px);
          font-weight:700;line-height:1.15;
          letter-spacing:-.02em;margin-bottom:56px;
        }
        .pain-grid{
          display:grid;
          grid-template-columns:repeat(auto-fit,minmax(260px,1fr));
          gap:1px;background:var(--border);
          border:1px solid var(--border);
        }
        .pain-card{
          background:var(--bg2);
          padding:32px 28px;position:relative;overflow:hidden;
          transition:background .3s;
        }
        .pain-card:hover{background:var(--card)}
        .pain-card::before{
          content:'';position:absolute;top:0;left:0;right:0;height:1px;
          background:linear-gradient(90deg,transparent,var(--gold),transparent);
          opacity:0;transition:opacity .3s;
        }
        .pain-card:hover::before{opacity:1}
        .pain-n{
          font-family:'JetBrains Mono',monospace;
          font-size:10px;color:var(--gold);
          letter-spacing:.2em;margin-bottom:14px;opacity:.6;
        }
        .pain-card p{font-size:13px;color:var(--text);line-height:1.8}
        .pain-card p strong{display:block;color:var(--white);font-weight:600;font-size:14px;margin-bottom:6px}

        .modules-wrap{
          padding:120px 60px;
          background:var(--bg2);
          border-top:1px solid var(--border);
          border-bottom:1px solid var(--border);
        }
        .modules-inner{max-width:1100px;margin:0 auto}
        .mod-grid{
          display:grid;
          grid-template-columns:repeat(auto-fit,minmax(280px,1fr));
          gap:1px;background:var(--border);
          border:1px solid var(--border);
          margin-top:56px;
        }
        .mod-card{
          background:var(--bg);
          padding:28px 24px;
          position:relative;overflow:hidden;
          transition:background .3s,transform .1s;
          transform-style:preserve-3d;
        }
        .mod-card::after{
          content:'';position:absolute;
          inset:0;background:radial-gradient(600px at var(--mx,50%) var(--my,50%),rgba(201,168,76,.06),transparent 60%);
          pointer-events:none;
        }
        .mod-card:hover{background:#0d0d18}
        .mod-num{
          font-family:'JetBrains Mono',monospace;
          font-size:10px;color:var(--gold);
          letter-spacing:.2em;margin-bottom:12px;opacity:.7;
        }
        .mod-title{font-size:14px;font-weight:600;color:var(--white);margin-bottom:8px}
        .mod-desc{font-size:12px;color:var(--muted);line-height:1.75}
        .mod-bonus{background:rgba(201,168,76,.05);border-left:2px solid var(--gold)}

        .code-block{
          background:#090913;
          border:1px solid var(--border);
          border-left:2px solid var(--green);
          padding:20px 24px;
          margin-top:20px;
          font-family:'JetBrains Mono',monospace;
          font-size:12px;line-height:1.9;
          color:#aaa;
          overflow-x:auto;
        }
        .ck{color:#c792ea}.cs{color:var(--gold)}.cf{color:var(--cyan)}.cm{color:#546e7a;font-style:italic}

        .plans-wrap{padding:120px 60px;max-width:1100px;margin:0 auto}
        .plans-grid{
          display:grid;grid-template-columns:1fr 1fr;
          gap:1px;background:var(--border);
          border:1px solid var(--border);
          margin-top:56px;
        }
        @media(max-width:640px){.plans-grid{grid-template-columns:1fr}}
        .plan-card{
          background:var(--card);
          padding:48px 36px;position:relative;overflow:hidden;
        }
        .plan-card.hot{
          background:var(--bg2);
          border:1px solid rgba(201,168,76,.3);
          margin:-1px;z-index:2;
        }
        .plan-card.hot::before{
          content:'';position:absolute;top:-1px;left:10%;right:10%;height:1px;
          background:linear-gradient(90deg,transparent,var(--gold),transparent);
        }
        
        .plan-name{font-family:'JetBrains Mono',monospace;font-size:12px;color:var(--gold);letter-spacing:.2em;margin-bottom:8px}
        .plan-format{font-family:'JetBrains Mono',monospace;font-size:24px;font-weight:700;color:var(--white);margin-bottom:32px}
        .plan-format::before{content:'// ';opacity:.4}
        .plan-price{font-size:56px;font-weight:800;color:var(--white);margin-bottom:4px;letter-spacing:-.02em}
        .plan-price sup{font-size:20px;font-weight:400;margin-right:4px}
        .plan-installment{font-family:'JetBrains Mono',monospace;font-size:12px;color:var(--muted);margin-bottom:40px}
        
        .plan-features{list-style:none;margin-bottom:48px}
        .plan-features li{font-size:13px;color:var(--text);margin-bottom:16px;display:flex;align-items:center;gap:12px}
        .plan-features li.off{color:var(--muted);opacity:.5}
        .plan-features .ico{font-family:'JetBrains Mono',monospace;font-size:11px;color:var(--gold)}
        .plan-features li.off .ico{color:var(--muted)}

        .plan-hot-badge{
          position:absolute;top:24px;right:24px;
          background:var(--gold);color:#05050a;
          font-family:'JetBrains Mono',monospace;
          font-size:9px;font-weight:700;padding:4px 10px;
          letter-spacing:.1em;text-transform:uppercase;
        }

        .guarantee{padding:100px 24px;text-align:center;border-top:1px solid var(--border)}
        .guarantee-inner{max-width:600px;margin:0 auto}
        .shield{font-size:48px;margin-bottom:24px}
        .guarantee h3{font-size:24px;color:var(--white);margin-bottom:16px}
        .guarantee p{font-size:14px;color:var(--muted);line-height:1.8}

        .faq-wrap{padding:120px 60px;max-width:800px;margin:0 auto}
        .faq-item{border-bottom:1px solid var(--border);padding:24px 0}
        .faq-q{
          font-size:16px;font-weight:600;color:var(--white);
          cursor:pointer;display:flex;justify-content:space-between;align-items:center;
        }
        .faq-q::after{content:'+';color:var(--gold);font-family:'JetBrains Mono',monospace}
        .faq-item.open .faq-q::after{content:'-'}
        .faq-a{
          max-height:0;overflow:hidden;
          transition:max-height .4s ease,margin .4s ease;
          font-size:14px;color:var(--muted);line-height:1.8;
        }
        .faq-item.open .faq-a{max-height:200px;margin-top:16px}

        footer{
          padding:80px 60px;text-align:center;
          border-top:1px solid var(--border);
          background:var(--bg2);
        }
        footer .logo{margin-bottom:24px;font-size:12px}
        footer p{font-size:11px;color:var(--muted);margin-bottom:8px;letter-spacing:.05em}

        @keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
        @keyframes pulse{0%{box-shadow:0 0 0 0 rgba(0,255,136,.4)}70%{box-shadow:0 0 0 10px rgba(0,255,136,0)}100%{box-shadow:0 0 0 0 rgba(0,255,136,0)}}
        @keyframes blink{50%{opacity:0}}
        @keyframes lineGrow{from{height:0}to{height:80px}}
        @keyframes glitch1{0%{clip-path:polygon(0 0,100% 0,100% 35%,0 35%);transform:translate(-2px)}50%{transform:translate(2px)}100%{transform:translate(-2px)}}
        @keyframes glitch2{0%{clip-path:polygon(0 65%,100% 65%,100% 100%,0 100%);transform:translate(2px)}50%{transform:translate(-2px)}100%{transform:translate(2px)}}

        @media(max-width:768px){
          nav{padding:20px 24px}
          nav .links{display:none}
          .hero h1{font-size:42px}
          .pain,.modules-wrap,.plans-wrap,.faq-wrap{padding:80px 24px}
        }
      `}</style>
      <div id="cursor"></div>
      <div id="cursor-ring"></div>
      <div className="grid-lines"></div>
      <canvas id="matrix-canvas"></canvas>
      <nav>
        <div className="logo"><em>&sol;&sol;</em> JS <span>CRIADORES</span></div>
        <div className="links">
          <a href="#modulos">Conteúdo</a>
          <a href="#planos" style={{ marginLeft: '32px' }}>Preços</a>
        </div>
      </nav>
      <section className="hero">
        <div className="terminal-badge">
          <span className="dot"></span>
          curso de JavaScript para quem cria com IA
        </div>
        <h1>
          Você usa IA pra criar.<br />
          <span className="line2">
            <span className="glitch" data-text="Mas não entende o código.">Mas não entende o código.</span>
          </span>
        </h1>
        <p className="hero-sub" id="typed-text"></p>
        <div className="tools-row">
          <span className="tool-tag">Lovable</span>
          <span className="tool-tag">v0</span>
          <span className="tool-tag">Bolt</span>
          <span className="tool-tag">Cursor</span>
          <span className="tool-tag">GitHub Copilot</span>
          <span className="tool-tag">+ qualquer outra</span>
        </div>
        <div className="hero-cta">
          <a href="#planos" className="btn-primary">Quero entender o código</a>
          <a href="#modulos" className="btn-ghost">Ver conteúdo</a>
        </div>
        <div className="hero-line"></div>
      </section>
      <section className="pain reveal">
        <p className="section-tag">Para quem é isso</p>
        <h2 className="section-h">Se você já viveu<br />alguma dessas situações…</h2>
        <div className="pain-grid">
          <div className="pain-card">
            <p className="pain-n">erro_01</p>
            <p><strong>A IA gerou um erro vermelho</strong> e você ficou olhando sem saber o que aquele stack trace significa.</p>
          </div>
          <div className="pain-card">
            <p className="pain-n">erro_02</p>
            <p><strong>Você pediu uma mudança simples</strong> e a IA reescreveu tudo — porque você não sabia onde mexer.</p>
          </div>
          <div className="pain-card">
            <p className="pain-n">erro_03</p>
            <p><strong>Você usa v0, Bolt ou Lovable</strong> mas trava toda vez que a IA não entende exatamente o que você precisa.</p>
          </div>
          <div className="pain-card">
            <p className="pain-n">erro_04</p>
            <p><strong>Você copiou um trecho de código</strong> sem entender nada, torceu pra funcionar — e não funcionou.</p>
          </div>
        </div>
      </section>
      <section className="modules-wrap" id="modulos">
        <div className="modules-inner">
          <div className="reveal">
            <p className="section-tag">Conteúdo</p>
            <h2 className="section-h">7 módulos.<br />Do zero ao que importa de verdade.</h2>
          </div>
          <div className="mod-grid">
            <div className="mod-card reveal">
              <p className="mod-num">módulo_01</p>
              <p className="mod-title">Por que JS importa usando IA</p>
              <p className="mod-desc">O papel do JavaScript no que Lovable, v0 e Bolt geram. Por que entender isso muda sua relação com essas ferramentas.</p>
            </div>
            <div className="mod-card reveal">
              <p className="mod-num">módulo_02</p>
              <p className="mod-title">Variáveis — onde os dados vivem</p>
              <p className="mod-desc">const, let, var. Tipos de dados. A IA usa isso o tempo todo sem você perceber.</p>
              <div className="code-block">
                <span className="ck">const</span> nome <span className="cm">= </span><span className="cs">&quot;Maxwel&quot;</span><span className="cm">;</span><br />
                <span className="ck">let</span> contador <span className="cm">= </span><span className="cf">0</span><span className="cm">;</span><br />
                {/* isso é JS — você já entende! */}
              </div>
            </div>
            <div className="mod-card reveal">
              <p className="mod-num">módulo_03</p>
              <p className="mod-title">Funções — o que acontece no clique</p>
              <p className="mod-desc">Toda ação no seu app é uma função. Aprenda a ler, entender e editar independente da ferramenta.</p>
              <div className="code-block">
                <span className="ck">function</span> <span className="cf">aoClicar</span><span className="cm">() {'{'}</span><br />
                &nbsp;&nbsp;{/* o que acontece aqui? */}<br />
                <span className="cm">{'}'}</span>
              </div>
            </div>
            <div className="mod-card reveal">
              <p className="mod-num">módulo_04</p>
              <p className="mod-title">Condicionais — lógica de se/então</p>
              <p className="mod-desc">if, else, operadores. A base de toda regra de negócio que você pede pra IA criar.</p>
            </div>
            <div className="mod-card reveal">
              <p className="mod-num">módulo_05</p>
              <p className="mod-title">Arrays e Objetos — o formato da IA</p>
              <p className="mod-desc">JSON, listas, objetos. Tudo que vai e vem de APIs e bancos de dados passa por aqui.</p>
            </div>
            <div className="mod-card reveal">
              <p className="mod-num">módulo_06</p>
              <p className="mod-title">Como ler um erro sem pânico</p>
              <p className="mod-desc">Console, stack trace, mensagens de erro. Decifre o que o código tá tentando te dizer.</p>
            </div>
            <div className="mod-card reveal">
              <p className="mod-num">módulo_07</p>
              <p className="mod-title">Entendendo o código que a IA escreveu</p>
              <p className="mod-desc">Um componente real gerado por IA, destrinchado linha por linha.</p>
            </div>
            <div className="mod-card mod-bonus reveal">
              <p className="mod-num" style={{ color: 'var(--gold)', opacity: 1 }}>bônus</p>
              <p className="mod-title">Glossário do Criador</p>
              <p className="mod-desc">40 termos que sempre aparecem no Lovable, v0, Bolt, Cursor e Claude.</p>
            </div>
          </div>
        </div>
      </section>
      <section className="plans-wrap" id="planos">
        <div className="reveal">
          <p className="section-tag">Planos</p>
          <h2 className="section-h">Dois formatos.<br />O mesmo conteúdo.</h2>
        </div>
        <div className="plans-grid">
          <div className="plan-card reveal">
            <p className="plan-name">Essencial</p>
            <p className="plan-format">PDF completo</p>
            <p className="plan-price"><sup>R$</sup>47</p>
            <p className="plan-installment">ou 2x de R$24,50</p>
            <ul className="plan-features">
              <li><span className="ico">[✓]</span> PDF com todos os 7 módulos</li>
              <li><span className="ico">[✓]</span> Glossário do Criador (bônus)</li>
              <li><span className="ico">[✓]</span> Exemplos de código reais</li>
              <li><span className="ico">[✓]</span> Acesso vitalício</li>
              <li className="off"><span className="ico">[x]</span> Mini-curso interativo HTML</li>
              <li className="off"><span className="ico">[x]</span> Exercícios práticos</li>
            </ul>
            <a href="#" className="btn-ghost" style={{ display: 'block', textAlign: 'center' }}>Quero o PDF — R$47</a>
          </div>
          <div className="plan-card hot reveal">
            <div className="plan-glow"></div>
            <div className="plan-hot-badge">Mais completo</div>
            <p className="plan-name">Completo</p>
            <p className="plan-format">Mini-curso interativo</p>
            <p className="plan-price"><sup>R$</sup>67</p>
            <p className="plan-installment">ou 3x de R$23,50</p>
            <ul className="plan-features">
              <li><span className="ico">[✓]</span> PDF com todos os 7 módulos</li>
              <li><span className="ico">[✓]</span> Glossário do Criador (bônus)</li>
              <li><span className="ico">[✓]</span> Exemplos de código reais</li>
              <li><span className="ico">[✓]</span> Acesso vitalício</li>
              <li><span className="ico">[✓]</span> Mini-curso interativo HTML</li>
              <li><span className="ico">[✓]</span> Exercícios práticos</li>
            </ul>
            <a href="#" className="btn-primary" style={{ display: 'block', textAlign: 'center' }}>Quero o Completo — R$67</a>
          </div>
        </div>
      </section>
      <section className="guarantee reveal">
        <div className="guarantee-inner">
          <div className="shield">🛡</div>
          <h3>Garantia de 7 dias</h3>
          <p>Se você não sentir que evoluiu no entendimento do código em até 7 dias após a compra, devolvo 100% do seu dinheiro.</p>
        </div>
      </section>
      <section className="faq-wrap">
        <div className="reveal">
          <p className="section-tag">Dúvidas</p>
          <h2 className="section-h" style={{ marginBottom: '48px' }}>FAQ</h2>
        </div>
        <div className="faq-item">
          <div className="faq-q">Preciso ter experiência em programação?</div>
          <div className="faq-a">Zero. O curso foi feito para quem nunca estudou código e usa ferramentas de IA.</div>
        </div>
        <div className="faq-item">
          <div className="faq-q">Qual a diferença real entre os planos?</div>
          <div className="faq-a">No Essencial você recebe o PDF. No Completo você acessa uma página HTML interativa com exercícios.</div>
        </div>
        <div className="faq-item">
          <div className="faq-q">Funciona com qualquer IA de código?</div>
          <div className="faq-a">Sim. O JavaScript gerado pelas ferramentas é o mesmo padrão de mercado.</div>
        </div>
      </section>
      <footer>
        <div className="logo"><em>©</em> Max <span>Arte Digital</span></div>
        <p>Lajeado, RS — 2025</p>
        <p>Produto digital. Sem envio físico.</p>
      </footer>
    </>
  );
}
