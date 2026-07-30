// ============================================================
//  MOTOR 2 · Diagnóstico do site
//  Dá uma nota de "quão ruim" está o site de cada empresa.
//  Quanto pior o site, mais quente o lead → topo da fila.
// ============================================================

import { config } from "./config.mjs";

// Baixa o HTML do site com timeout, medindo o tempo.
async function baixar(url) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), config.diagnostico.timeoutMs);
  const inicio = Date.now();
  try {
    const r = await fetch(url, {
      signal: ctrl.signal,
      redirect: "follow",
      headers: { "User-Agent": "Mozilla/5.0 (VulcaneLeadBot)" },
    });
    const html = await r.text();
    return { ok: true, status: r.status, ms: Date.now() - inicio, urlFinal: r.url, html };
  } catch (e) {
    return { ok: false, ms: Date.now() - inicio, erro: e.name === "AbortError" ? "timeout" : e.message };
  } finally {
    clearTimeout(t);
  }
}

// Analisa uma empresa e devolve { score, dores[], dorPrincipal }.
export async function diagnosticar(empresa) {
  const dores = [];

  // Sem site nenhum = lead mais quente pra oferta de Google.
  if (!empresa.site) {
    return {
      score: 100,
      temSite: false,
      dores: [
        "não tem site nem ficha completa no Google",
        "quem pesquisa no celular não acha foto, horário nem WhatsApp de vocês",
      ],
      dorPrincipal: "não achei uma ficha completa de vocês — sem site e sem foto/horário/WhatsApp, vocês somem pro cliente",
    };
  }

  const res = await baixar(empresa.site);

  // Site caiu / não responde
  if (!res.ok) {
    return {
      score: 90,
      temSite: true,
      urlFinal: empresa.site,
      dores: [`o site não abriu (${res.erro}) — pra um cliente parece que fechou`],
      dorPrincipal: "o link de vocês nem abriu — o cliente que pesquisa acha isso e desiste",
    };
  }

  const html = res.html.toLowerCase();
  let score = 0;

  // 1) HTTPS
  if (!res.urlFinal.startsWith("https://")) {
    score += 25;
    dores.push("o site não é seguro (sem cadeado HTTPS) — o Google penaliza e o navegador assusta o cliente");
  }
  // 2) Mobile / responsivo
  if (!/<meta[^>]+name=["']?viewport/.test(html)) {
    score += 30;
    dores.push("o site não é feito pra celular — e é lá que quase todo cliente vê");
  }
  // 3) Velocidade
  if (res.ms > config.diagnostico.lentoMs) {
    score += 20;
    dores.push(`o site demora ${(res.ms / 1000).toFixed(1)}s pra abrir — cliente desiste antes`);
  }
  // 4) WhatsApp
  if (!/wa\.me|api\.whatsapp|whatsapp/.test(html)) {
    score += 15;
    dores.push("não tem botão de WhatsApp — o cliente quer falar e não acha como");
  }
  // 5) Sinais de site antigo
  if (/<table[^>]*width|<font|frameset|wix|<marquee/.test(html)) {
    score += 15;
    dores.push("o site tem cara de antigo — passa impressão de negócio parado");
  }
  // 6) Página muito pobre / vazia
  if (res.html.length < 1500) {
    score += 10;
    dores.push("o site é praticamente uma página em branco");
  }

  if (dores.length === 0) {
    dores.push("dá pra deixar o site mais moderno e vendendo mais");
  }

  return {
    score: Math.min(score, 89), // sites que abrem ficam abaixo dos que caíram
    temSite: true,
    urlFinal: res.urlFinal,
    ms: res.ms,
    dores,
    // A dor que entra na mensagem é sobre o Google (porta de entrada),
    // não sobre o site (isso é o upsell depois).
    dorPrincipal: "vocês aparecem, mas sem uma ficha completa (foto, horário, avaliações) o cliente passa direto pro concorrente",
  };
}

// Roda o diagnóstico em lote com concorrência limitada.
export async function diagnosticarTodos(empresas) {
  const n = config.diagnostico.concorrencia;
  const fila = [...empresas];
  const saida = [];
  console.log(`🩺 Diagnosticando ${empresas.length} sites (${n} por vez)...`);

  async function trabalhador() {
    while (fila.length) {
      const emp = fila.shift();
      const diag = await diagnosticar(emp);
      saida.push({ ...emp, ...diag });
      process.stdout.write(".");
    }
  }
  await Promise.all(Array.from({ length: n }, trabalhador));
  process.stdout.write("\n");
  return saida;
}
