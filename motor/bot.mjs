// ============================================================
//  Vulcane · Bot de Respostas do WhatsApp
//  Roda no SEU número. Só responde quem TE manda mensagem.
//  Uso:  node bot.mjs   (lê o QR uma vez, depois fica sozinho)
//
//  ⚠️ Zona cinza dos termos do WhatsApp. Proteções embutidas:
//     só responde inbound · delay humano · ignora grupos ·
//     1 resposta por regra por contato · respeita horário.
// ============================================================

import { existsSync, readFileSync, writeFileSync } from "node:fs";
import qrcode from "qrcode-terminal";
import pkg from "whatsapp-web.js";
import { respostas } from "./respostas.mjs";
import { decidirResposta, dentroDoHorario } from "./logica.mjs";

const { Client, LocalAuth } = pkg;
const CHROME = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const ARQ_ESTADO = "./.estado-bot.json";

// --- Estado: quem já foi saudado / quais regras já disparei ---
let estado = existsSync(ARQ_ESTADO) ? JSON.parse(readFileSync(ARQ_ESTADO, "utf8")) : {};
const salvar = () => writeFileSync(ARQ_ESTADO, JSON.stringify(estado, null, 2));

// --- Utilidades ---
const espera = (ms) => new Promise((r) => setTimeout(r, ms));
const delayHumano = () => {
  const { minSeg, maxSeg } = respostas.delay;
  return espera((minSeg + Math.random() * (maxSeg - minSeg)) * 1000);
};

// --- Cliente WhatsApp ---
const client = new Client({
  authStrategy: new LocalAuth({ dataPath: "./.wwebjs_auth" }),
  puppeteer: {
    headless: true,
    executablePath: existsSync(CHROME) ? CHROME : undefined,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  },
});

client.on("qr", (qr) => {
  console.log("\n📱 Abra o WhatsApp no celular → Aparelhos conectados → Conectar aparelho → aponte pro QR:\n");
  qrcode.generate(qr, { small: true });
});

client.on("ready", () => {
  console.log("\n✅ Bot conectado e ouvindo. Deixe esta janela aberta.");
  console.log(`   Estado: ${respostas.ativo ? "ATIVO" : "PAUSADO (respostas.ativo = false)"}`);
  console.log("   (Ctrl+C pra parar. Sua sessão fica salva pro próximo boot.)\n");
});

client.on("auth_failure", (m) => console.error("❌ Falha de autenticação:", m));
client.on("disconnected", (r) => console.log("⚠️ Desconectado:", r));

client.on("message", async (msg) => {
  try {
    if (!respostas.ativo) return;
    if (msg.from === "status@broadcast") return;      // ignora status
    if (msg.from.endsWith("@g.us")) return;           // ignora grupos
    if (msg.fromMe) return;                           // só inbound
    if (!msg.body || msg.type !== "chat") return;     // só texto
    if (!dentroDoHorario()) return;

    const id = msg.from;
    estado[id] ??= { saudado: false, regras: {} };

    const { resposta, tag } = decidirResposta(msg.body, estado[id]);
    if (tag && estado[id].regras && respostas.regras.some((r) => r.nome === tag)) {
      estado[id].regras[tag] = true; // marca a regra como já usada com esse contato
    }
    estado[id].saudado = true;
    salvar();

    if (!resposta) {
      console.log(`· ${id}: "${msg.body.slice(0, 40)}" → (silêncio, respondo eu)`);
      return;
    }

    await delayHumano();
    await client.sendMessage(id, resposta);
    console.log(`↩︎ ${id}: "${msg.body.slice(0, 40)}" → [${tag}]`);
  } catch (e) {
    console.error("Erro ao responder:", e.message);
  }
});

console.log("🔥 Vulcane · Bot de Respostas — iniciando (Chrome + WhatsApp Web)...");
client.initialize();
