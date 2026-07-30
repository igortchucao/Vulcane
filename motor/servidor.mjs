// ============================================================
//  Vulcane · Central de Controle (página única)
//  Junta tudo: rodar o motor de leads, ligar/desligar o bot
//  (com QR na tela) e disparar a fila — num lugar só.
//
//  Uso:  node servidor.mjs   → abre http://localhost:4700
// ============================================================

import { createServer } from "node:http";
import { spawn } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { config } from "./config.mjs";
import { dadosDisparo } from "./painel.mjs";
import { paginaHTML } from "./central.mjs";

const PORTA = 4700;

// --- Estado dos processos-filhos -------------------------
const estado = {
  bot: { proc: null, log: [], status: "parado" },
  leads: { proc: null, log: [], rodando: false },
};

function logar(alvo, linha) {
  const arr = estado[alvo].log;
  arr.push(linha.toString());
  if (arr.length > 400) arr.shift(); // não crescer infinito
}

// --- Ligar / parar o BOT ---------------------------------
function iniciarBot() {
  if (estado.bot.proc) return;
  estado.bot.log = [];
  estado.bot.status = "iniciando";
  const p = spawn(process.execPath, ["bot.mjs"], { cwd: process.cwd() });
  estado.bot.proc = p;
  p.stdout.on("data", (d) => {
    logar("bot", d);
    const s = d.toString();
    if (s.includes("conectado e ouvindo")) estado.bot.status = "ativo";
    else if (s.includes("Conectar aparelho")) estado.bot.status = "aguardando QR";
  });
  p.stderr.on("data", (d) => logar("bot", d));
  p.on("exit", (code) => {
    logar("bot", `\n(bot encerrado, código ${code})`);
    estado.bot.proc = null;
    estado.bot.status = "parado";
  });
}
function pararBot() {
  if (estado.bot.proc) estado.bot.proc.kill();
  estado.bot.proc = null;
  estado.bot.status = "parado";
}

// --- Rodar o MOTOR DE LEADS ------------------------------
function rodarLeads() {
  if (estado.leads.rodando) return;
  estado.leads.log = [];
  estado.leads.rodando = true;
  const p = spawn(process.execPath, ["rodar.mjs"], { cwd: process.cwd() });
  estado.leads.proc = p;
  p.stdout.on("data", (d) => logar("leads", d));
  p.stderr.on("data", (d) => logar("leads", d));
  p.on("exit", () => {
    estado.leads.rodando = false;
    estado.leads.proc = null;
    logar("leads", "\n✅ Concluído. Atualize a fila.");
  });
}

// --- Carregar leads do disco (enriquecidos) --------------
function carregarLeads() {
  if (!existsSync("leads.json")) return [];
  const brutos = JSON.parse(readFileSync("leads.json", "utf8"));
  brutos.sort((a, b) => b.score - a.score);
  return brutos.map((l) => ({
    nome: l.nome, ramo: l.ramo, fonte: l.fonte, score: l.score,
    dores: l.dores, urlFinal: l.urlFinal || null,
    ...dadosDisparo(l),
  }));
}

// --- Roteador HTTP ---------------------------------------
function json(res, obj) {
  res.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(obj));
}

const server = createServer((req, res) => {
  const url = req.url.split("?")[0];

  if (url === "/") {
    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    return res.end(paginaHTML(config));
  }
  if (url === "/api/status") {
    return json(res, {
      bot: { status: estado.bot.status, log: estado.bot.log.join("") },
      leads: { rodando: estado.leads.rodando, log: estado.leads.log.join("") },
      cidade: config.cidade,
    });
  }
  if (url === "/api/leads") return json(res, carregarLeads());
  if (url === "/api/bot/iniciar") { iniciarBot(); return json(res, { ok: true }); }
  if (url === "/api/bot/parar") { pararBot(); return json(res, { ok: true }); }
  if (url === "/api/leads/rodar") { rodarLeads(); return json(res, { ok: true }); }

  res.writeHead(404);
  res.end("não encontrado");
});

server.listen(PORTA, () => {
  console.log(`\n🔥 Vulcane · Central de Controle no ar!`);
  console.log(`   👉 Abra no navegador:  http://localhost:${PORTA}\n`);
  console.log(`   (Deixe esta janela aberta. Ctrl+C pra encerrar tudo.)`);
});

// Encerra os filhos junto com o servidor.
process.on("SIGINT", () => { pararBot(); process.exit(0); });
