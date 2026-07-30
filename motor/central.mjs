// ============================================================
//  Vulcane · Central de Controle · HTML da página
// ============================================================

export function paginaHTML(config) {
  return `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Vulcane · Central</title>
<style>
  :root{--brasa:#FF5A1F;--faisca:#FFC24D;--obs:#0B0A0F;--bas:#14121A;--fum:#F4F1EC;--linha:#26232f}
  *{box-sizing:border-box}
  body{margin:0;background:var(--obs);color:var(--fum);font-family:Inter,system-ui,Arial,sans-serif}
  header{padding:18px 24px;border-bottom:1px solid var(--linha);display:flex;align-items:center;gap:12px;position:sticky;top:0;background:var(--obs);z-index:5}
  header h1{font-family:'Space Grotesk',sans-serif;margin:0;font-size:20px}
  header .cidade{color:#8f8b98;font-size:13px}
  .wrap{max-width:900px;margin:0 auto;padding:20px}
  .painel{background:var(--bas);border:1px solid var(--linha);border-radius:14px;padding:18px;margin-bottom:18px}
  .painel h2{margin:0 0 4px;font-size:17px;font-family:'Space Grotesk',sans-serif}
  .painel .sub{color:#8f8b98;font-size:13px;margin-bottom:12px}
  .row{display:flex;gap:10px;flex-wrap:wrap;align-items:center}
  .btn{border:0;border-radius:8px;padding:10px 16px;font-weight:700;cursor:pointer;text-decoration:none;font-size:14px;color:#000}
  .btn.primaria{background:var(--brasa);color:#fff}
  .btn.verde{background:#25D366}
  .btn.faisca{background:var(--faisca)}
  .btn.escura{background:#2c2937;color:var(--fum);border:1px solid var(--linha)}
  .btn:disabled{opacity:.4;cursor:not-allowed}
  .pill{padding:5px 12px;border-radius:999px;font-size:13px;font-weight:700}
  .pill.ativo{background:#12351f;color:#3ddc7f} .pill.parado{background:#3a2020;color:#ff7a7a}
  .pill.aguardando,.pill.iniciando{background:#3a3210;color:var(--faisca)}
  pre.log{background:var(--obs);border:1px solid var(--linha);border-radius:8px;padding:12px;font-size:11px;line-height:1.2;max-height:340px;overflow:auto;white-space:pre;margin-top:12px}
  /* QR precisa aparecer inteiro e quadrado pra escanear */
  #botLog{max-height:none;line-height:1;font-size:10px;text-align:center;overflow-x:auto}
  .card{background:var(--bas);border:1px solid var(--linha);border-radius:12px;padding:16px;margin-bottom:12px}
  .card.ok{opacity:.4}
  .topo{display:flex;gap:12px;align-items:center;margin-bottom:8px}
  .score{min-width:40px;height:40px;border-radius:9px;display:flex;align-items:center;justify-content:center;font-weight:800;color:#000}
  .card h3{margin:0;font-size:16px} .card small{color:#8f8b98} .card small a{color:var(--faisca)}
  .dores{margin:6px 0;padding-left:18px;color:#d7d4dd;font-size:13px;line-height:1.5}
  textarea{width:100%;height:84px;background:var(--obs);color:var(--fum);border:1px solid var(--linha);border-radius:8px;padding:9px;font-size:12px;resize:vertical}
  .acoes{display:flex;gap:8px;flex-wrap:wrap;margin-top:8px}
  .aviso{color:var(--faisca);font-size:12px;margin-top:8px}
  .stat{color:#8f8b98;font-size:13px;margin:10px 0}
</style></head><body>
<header>
  <h1>🔥 Vulcane · Central</h1>
  <span class="cidade">${config.cidade}</span>
</header>
<div class="wrap">

  <!-- ===== BOT ===== -->
  <section class="painel">
    <div class="row" style="justify-content:space-between">
      <div><h2>🤖 Bot de Respostas</h2><div class="sub">Responde sozinho quem te manda mensagem (preço, Google, site…)</div></div>
      <span id="botPill" class="pill parado">parado</span>
    </div>
    <div class="row">
      <button class="btn primaria" onclick="api('/api/bot/iniciar')">▶ Ligar bot</button>
      <button class="btn escura" onclick="api('/api/bot/parar')">■ Parar</button>
      <span class="sub" style="margin:0">1ª vez: escaneie o QR abaixo no WhatsApp → Aparelhos conectados</span>
    </div>
    <pre class="log" id="botLog">—</pre>
    <div class="aviso">⚠️ Só responde quem te chamou. Nunca use como disparador em massa (bane o número).</div>
  </section>

  <!-- ===== LEADS ===== -->
  <section class="painel">
    <div class="row" style="justify-content:space-between">
      <div><h2>🎯 Fila de Leads</h2><div class="sub">Empresas fracas no Google/site — dispare o 1º contato em 1 clique</div></div>
      <button class="btn faisca" id="btnRodar" onclick="rodar()">🔄 Buscar leads agora</button>
    </div>
    <pre class="log" id="leadsLog" style="display:none"></pre>
    <div class="stat" id="stat">Carregando fila…</div>
    <div id="fila"></div>
  </section>

</div>
<script>
  const chave = (l) => (l.nome + '|' + (l.waLink||'')).slice(0,80);
  const enviados = () => JSON.parse(localStorage.getItem('vulcane_enviados')||'[]');
  function marcarEnviado(k){const e=new Set(enviados());e.add(k);localStorage.setItem('vulcane_enviados',JSON.stringify([...e]));render();}
  function esc(s){return String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));}

  let LEADS=[];
  async function api(u){await fetch(u);tick();}
  async function rodar(){document.getElementById('leadsLog').style.display='block';await fetch('/api/leads/rodar');}
  async function carregarFila(){LEADS=await (await fetch('/api/leads')).json();render();}

  function render(){
    const env=new Set(enviados());
    const stat=document.getElementById('stat');
    if(!LEADS.length){stat.textContent='Nenhum lead ainda. Clique em "Buscar leads agora".';document.getElementById('fila').innerHTML='';return;}
    const zap=LEADS.filter(l=>l.temZap).length, feitos=LEADS.filter(l=>env.has(chave(l))).length;
    stat.textContent=LEADS.length+' leads · '+zap+' com WhatsApp direto · '+feitos+' já enviados';
    document.getElementById('fila').innerHTML=LEADS.map(l=>{
      const k=chave(l), ok=env.has(k)?' ok':'';
      const cor=l.score>=90?'#FF5A1F':l.score>=50?'#FFC24D':'#7a7a85';
      const acaoZap=l.temZap
        ?'<a class="btn verde" href="'+l.waLink+'" target="_blank" onclick="marcarEnviado(\\''+k.replace(/'/g,"")+'\\')">📲 WhatsApp</a>'
        :'<a class="btn faisca" href="'+l.buscaLink+'" target="_blank">📞 Achar zap</a>';
      return '<div class="card'+ok+'">'
        +'<div class="topo"><span class="score" style="background:'+cor+'">'+l.score+'</span>'
        +'<div><h3>'+esc(l.nome)+'</h3><small>'+esc(l.ramo)+' · '+esc(l.fonte)+(l.urlFinal?' · <a href="'+esc(l.urlFinal)+'" target="_blank">ver site</a>':'')+'</small></div></div>'
        +'<ul class="dores">'+l.dores.map(d=>'<li>'+esc(d)+'</li>').join('')+'</ul>'
        +'<textarea readonly>'+esc(l.mensagem)+'</textarea>'
        +'<div class="acoes"><a class="btn escura" href="'+l.provaLink+'" target="_blank">🔍 Ver no Google</a>'
        +acaoZap
        +'<button class="btn escura" onclick="marcarEnviado(\\''+k.replace(/'/g,"")+'\\')">✓ Enviado</button></div>'
        +'</div>';
    }).join('');
  }

  async function tick(){
    const s=await (await fetch('/api/status')).json();
    const pill=document.getElementById('botPill');
    pill.textContent=s.bot.status;
    pill.className='pill '+(s.bot.status==='ativo'?'ativo':s.bot.status==='parado'?'parado':'aguardando');
    document.getElementById('botLog').textContent=s.bot.log||'—';
    const ll=document.getElementById('leadsLog');
    if(s.leads.log)ll.textContent=s.leads.log;
    document.getElementById('btnRodar').disabled=s.leads.rodando;
    document.getElementById('btnRodar').textContent=s.leads.rodando?'Buscando…':'🔄 Buscar leads agora';
    if(tick._rodava&&!s.leads.rodando)carregarFila(); // recarrega fila quando terminar
    tick._rodava=s.leads.rodando;
  }

  carregarFila();
  tick();
  setInterval(tick,2000);
</script>
</body></html>`;
}
