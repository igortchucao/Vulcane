// ============================================================
//  Vulcane · Motor de Leads · ORQUESTRADOR
//  Roda tudo:  node rodar.mjs
//  Saída:  leads.json  +  painel.html  (abre no navegador)
// ============================================================

import { writeFileSync } from "node:fs";
import { buscarEmpresas } from "./buscar.mjs";
import { diagnosticarTodos } from "./diagnostico.mjs";
import { gerarPainel } from "./painel.mjs";

console.log("🔥 Vulcane · Motor de Leads\n");

const t0 = Date.now();
const empresas = await buscarEmpresas();

if (empresas.length === 0) {
  console.log("Nenhuma empresa encontrada. Verifique o bbox da cidade no config.mjs.");
  process.exit(0);
}

const leads = await diagnosticarTodos(empresas);

writeFileSync("leads.json", JSON.stringify(leads, null, 2));
writeFileSync("painel.html", gerarPainel(leads));

const quentes = leads.filter((l) => l.score >= 50).length;
const comZap = leads.filter((l) => l.whatsapp).length;

console.log(`\n✅ Pronto em ${((Date.now() - t0) / 1000).toFixed(0)}s`);
console.log(`   ${leads.length} leads · ${quentes} quentes (site ruim/sem site) · ${comZap} com WhatsApp direto`);
console.log(`\n👉 Abra:  motor/painel.html  no navegador e comece a disparar.`);
