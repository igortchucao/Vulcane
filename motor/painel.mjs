// ============================================================
//  MOTOR 3 · Painel de disparo (NÃO envia sozinho)
//  Gera um HTML com a fila de leads. Cada um tem a mensagem
//  pronta + botão que abre SEU WhatsApp em 1 clique.
// ============================================================

import { config } from "./config.mjs";

export function montarMensagem(lead) {
  const modelo = lead.temSite ? config.mensagem.comSite : config.mensagem.semSite;
  const o = config.oferta;
  return modelo
    .replaceAll("{nome}", lead.nome)
    .replaceAll("{dor}", lead.dorPrincipal)
    .replaceAll("{vendedor}", config.vendedor.nome)
    .replaceAll("{empresa}", config.vendedor.empresa)
    .replaceAll("{oferta}", o.nome)
    .replaceAll("{preco}", o.preco)
    .replaceAll("{prazo}", o.prazo);
}

// Calcula tudo que um lead precisa pra ser disparado. Usado no
// painel estático E no servidor de controle.
export function dadosDisparo(lead) {
  const mensagem = montarMensagem(lead);
  const temZap = !!lead.whatsapp;
  return {
    mensagem,
    temZap,
    waLink: temZap ? `https://wa.me/${lead.whatsapp}?text=${encodeURIComponent(mensagem)}` : null,
    buscaLink: `https://www.google.com/search?q=${encodeURIComponent(lead.nome + " " + config.cidade + " whatsapp")}`,
    provaLink: `https://www.google.com/search?q=${encodeURIComponent(lead.nome + " " + config.cidade)}`,
  };
}

function esc(s) {
  return String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
}

export function gerarPainel(leads) {
  // pior primeiro
  leads.sort((a, b) => b.score - a.score);

  const cards = leads
    .map((lead, i) => {
      const { mensagem: msg, temZap, waLink, buscaLink, provaLink } = dadosDisparo(lead);
      const cor = lead.score >= 90 ? "#FF5A1F" : lead.score >= 50 ? "#FFC24D" : "#7a7a85";

      return `
      <article class="card" data-i="${i}">
        <div class="topo">
          <span class="score" style="background:${cor}">${lead.score}</span>
          <div>
            <h2>${esc(lead.nome)}</h2>
            <small>${esc(lead.ramo)} · ${esc(lead.fonte)}${lead.urlFinal ? ` · <a href="${esc(lead.urlFinal)}" target="_blank">ver site</a>` : ""}</small>
          </div>
        </div>
        <ul class="dores">${lead.dores.map((d) => `<li>${esc(d)}</li>`).join("")}</ul>
        <textarea readonly>${esc(msg)}</textarea>
        <div class="acoes">
          <a class="btn prova" href="${provaLink}" target="_blank">🔍 Ver no Google (print da prova)</a>
          ${
            temZap
              ? `<a class="btn zap" href="${waLink}" target="_blank" onclick="marcar(${i})">📲 Abrir WhatsApp</a>`
              : `<a class="btn busca" href="${buscaLink}" target="_blank">📞 Achar o WhatsApp</a>`
          }
          <button class="btn copiar" onclick="copiar(this, ${i})">Copiar mensagem</button>
          <button class="btn feito" onclick="marcar(${i})">✓ Enviado</button>
        </div>
      </article>`;
    })
    .join("\n");

  const semZap = leads.filter((l) => !l.whatsapp).length;

  return `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Vulcane · Fila de Leads</title>
<style>
  :root{--brasa:#FF5A1F;--faisca:#FFC24D;--obs:#0B0A0F;--bas:#14121A;--fum:#F4F1EC}
  *{box-sizing:border-box}
  body{margin:0;background:var(--obs);color:var(--fum);font-family:Inter,system-ui,Arial,sans-serif;padding:24px}
  header{max-width:820px;margin:0 auto 20px}
  h1{font-family:'Space Grotesk',sans-serif;margin:0 0 4px}
  .resumo{color:#b9b6c0;font-size:14px}
  .card{max-width:820px;margin:0 auto 16px;background:var(--bas);border:1px solid #26232f;border-radius:14px;padding:18px}
  .card.ok{opacity:.4}
  .topo{display:flex;gap:14px;align-items:center;margin-bottom:10px}
  .score{min-width:44px;height:44px;border-radius:10px;display:flex;align-items:center;justify-content:center;font-weight:800;color:#000;font-size:18px}
  h2{margin:0;font-size:18px}
  small{color:#8f8b98} small a{color:var(--faisca)}
  .dores{margin:8px 0;padding-left:18px;color:#d7d4dd;font-size:14px;line-height:1.5}
  textarea{width:100%;height:92px;background:var(--obs);color:var(--fum);border:1px solid #2c2937;border-radius:8px;padding:10px;font-size:13px;resize:vertical}
  .acoes{display:flex;gap:10px;flex-wrap:wrap;margin-top:10px}
  .btn{border:0;border-radius:8px;padding:10px 16px;font-weight:700;cursor:pointer;text-decoration:none;font-size:14px}
  .zap{background:#25D366;color:#000} .busca{background:var(--faisca);color:#000}
  .prova{background:#2c2937;color:var(--faisca);border:1px solid var(--faisca)}
  .copiar{background:#2c2937;color:var(--fum)} .feito{background:transparent;color:#8f8b98;border:1px solid #2c2937}
</style></head><body>
<header>
  <h1>🔥 Fila de Leads — ${esc(config.cidade)}</h1>
  <div class="resumo">${leads.length} empresas · ordenadas pela dor (pior no topo) · ${semZap} sem WhatsApp direto (use o botão de busca)</div>
  <div class="resumo" style="margin-top:6px;color:#FFC24D">⚠️ Envie você mesmo, com calma. Nada de disparo automático — protege seu número de ban.</div>
</header>
${cards}
<script>
  function marcar(i){document.querySelector('[data-i="'+i+'"]').classList.add('ok');salvar()}
  function copiar(btn,i){const t=document.querySelector('[data-i="'+i+'"] textarea');navigator.clipboard.writeText(t.value);btn.textContent='Copiado!';setTimeout(()=>btn.textContent='Copiar mensagem',1200)}
  function salvar(){const f=[...document.querySelectorAll('.card.ok')].map(c=>c.dataset.i);localStorage.setItem('vulcane_enviados',JSON.stringify(f))}
  (function(){const f=JSON.parse(localStorage.getItem('vulcane_enviados')||'[]');f.forEach(i=>{const c=document.querySelector('[data-i="'+i+'"]');if(c)c.classList.add('ok')})})();
</script>
</body></html>`;
}
