// ============================================================
//  Teste automático da lógica do bot (sem WhatsApp real).
//  Roda:  node teste.mjs
// ============================================================

import { decidirResposta } from "./logica.mjs";

// Cada contato tem estado próprio (saudado + regras já usadas).
const casos = [
  { texto: "Oi, tudo bem?",              espera: "saudação" },
  { texto: "quanto custa?",              espera: "preco" },
  { texto: "Qual o VALOR do serviço",    espera: "preco" },   // maiúsculas
  { texto: "quero aparecer no google",   espera: "google" },
  { texto: "vcs fazem site?",            espera: "site" },
  { texto: "qual o prazo de entrega?",   espera: "prazo" },
  { texto: "quero fechar, bora",         espera: "interesse" },
  { texto: "orçamento pra minha loja",   espera: "preco" },   // sem acento no meio
];

let ok = 0;

console.log("🧪 Testando a lógica de resposta do bot\n");
for (const c of casos) {
  // Cada caso é um CONTATO NOVO. Pra testar as regras isoladamente,
  // marco como já saudado — exceto quando o próprio teste é a saudação.
  const estado = { saudado: c.espera !== "saudação", regras: {} };
  const { resposta, tag } = decidirResposta(c.texto, estado);

  const passou = tag === c.espera;
  ok += passou ? 1 : 0;
  console.log(`${passou ? "✅" : "❌"} "${c.texto}"`);
  console.log(`   → [${tag}] ${resposta ? resposta.slice(0, 55).replace(/\n/g, " ") + "…" : "(silêncio)"}`);
  if (!passou) console.log(`   ⚠️ esperava [${c.espera}]`);
}

// Teste de repetição: perguntar preço 2x → só responde 1x
const est2 = { saudado: true, regras: {} };
const r1 = decidirResposta("quanto custa", est2); est2.regras[r1.tag] = true;
const r2 = decidirResposta("e o preço mesmo?", est2);
const naoRepetiu = r1.tag === "preco" && r2.tag === "silêncio";
ok += naoRepetiu ? 1 : 0;
console.log(`\n${naoRepetiu ? "✅" : "❌"} Não repete a mesma resposta pro mesmo contato (anti-spam)`);

const total = casos.length + 1;
console.log(`\n📊 Resultado: ${ok}/${total} testes passaram.`);
process.exit(ok === total ? 0 : 1);
