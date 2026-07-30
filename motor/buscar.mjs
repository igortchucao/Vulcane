// ============================================================
//  MOTOR 1 · Buscar empresas
//  Padrão: OpenStreetMap (grátis, sem chave).
//  Opcional: Google Places (se houver chave no config).
// ============================================================

import { config } from "./config.mjs";

// Normaliza um telefone brasileiro pro formato do wa.me (55 + DDD + número).
export function normalizarWhatsapp(bruto) {
  if (!bruto) return null;
  let d = String(bruto).replace(/\D/g, "");
  d = d.replace(/^0+/, "");           // tira zeros à esquerda
  if (d.startsWith("55")) d = d.slice(2);
  // sobrou DDD + número? (10 ou 11 dígitos)
  if (d.length < 10 || d.length > 11) return null;
  return "55" + d;
}

// ---------- Fonte A: OpenStreetMap (Overpass) ----------
async function buscarOSM() {
  const { sul, oeste, norte, leste } = config.bbox;
  const box = `(${sul},${oeste},${norte},${leste})`;
  const filtros = config.nichos.map((n) => `${n}${box};`).join("\n");
  const query = `[out:json][timeout:60];\n(\n${filtros}\n);\nout center tags;`;

  const endpoints = [
    "https://overpass-api.de/api/interpreter",
    "https://overpass.kumi.systems/api/interpreter",
    "https://maps.mail.ru/osm/tools/overpass/api/interpreter",
    "https://overpass.private.coffee/api/interpreter",
  ];

  const espera = (ms) => new Promise((r) => setTimeout(r, ms));

  let dados = null;
  for (const url of endpoints) {
    for (let tentativa = 1; tentativa <= 2 && !dados; tentativa++) {
      try {
        const r = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "Accept": "application/json",
            "User-Agent": "VulcaneLeadTool/1.0 (contato via vulcane.com.br)",
          },
          body: "data=" + encodeURIComponent(query),
        });
        if (r.status === 429) {
          console.log(`  (${url}: ocupado, esperando 5s...)`);
          await espera(5000);
          throw new Error("HTTP 429");
        }
        if (!r.ok) throw new Error("HTTP " + r.status);
        dados = await r.json();
      } catch (e) {
        if (tentativa === 2) console.log(`  (endpoint ${url} falhou: ${e.message}, tentando outro...)`);
      }
    }
    if (dados) break;
  }
  if (!dados) throw new Error("Overpass indisponível. Tente de novo em 1 min.");

  return (dados.elements || []).map((el) => {
    const t = el.tags || {};
    const site = t.website || t["contact:website"] || t.url || null;
    const tel = t.phone || t["contact:phone"] || t["contact:mobile"] || null;
    return {
      nome: t.name || "(sem nome)",
      ramo: t.shop || t.amenity || t.craft || "negócio",
      site: site && !/^https?:\/\//.test(site) ? "http://" + site : site,
      whatsapp: normalizarWhatsapp(tel),
      telefoneBruto: tel || null,
      fonte: "OpenStreetMap",
    };
  });
}

// ---------- Fonte B: Google Places (opcional) ----------
async function buscarGoogle() {
  const key = config.googlePlacesApiKey;
  const { sul, oeste, norte, leste } = config.bbox;
  const lat = (sul + norte) / 2;
  const lng = (oeste + leste) / 2;
  const raio = 6000; // ~6km
  const resultados = [];

  for (const termo of ["loja", "restaurante", "lanchonete", "salão", "loja de roupas"]) {
    const url =
      `https://maps.googleapis.com/maps/api/place/textsearch/json` +
      `?query=${encodeURIComponent(termo + " em " + config.cidade)}` +
      `&location=${lat},${lng}&radius=${raio}&key=${key}`;
    const r = await fetch(url);
    const j = await r.json();
    for (const p of j.results || []) {
      // pega detalhes (telefone + site) — 1 chamada por lugar
      const det = await fetch(
        `https://maps.googleapis.com/maps/api/place/details/json` +
          `?place_id=${p.place_id}&fields=name,website,formatted_phone_number,types&key=${key}`
      ).then((x) => x.json());
      const d = det.result || {};
      resultados.push({
        nome: d.name || p.name,
        ramo: (d.types && d.types[0]) || "negócio",
        site: d.website || null,
        whatsapp: normalizarWhatsapp(d.formatted_phone_number),
        telefoneBruto: d.formatted_phone_number || null,
        fonte: "Google Places",
      });
    }
  }
  return resultados;
}

export async function buscarEmpresas() {
  const usarGoogle = !!config.googlePlacesApiKey;
  console.log(`🔎 Buscando empresas em ${config.cidade} via ${usarGoogle ? "Google Places" : "OpenStreetMap"}...`);
  const brutos = usarGoogle ? await buscarGoogle() : await buscarOSM();

  // dedup por nome + tira os sem nome
  const vistos = new Set();
  const limpos = [];
  for (const e of brutos) {
    const chave = e.nome.toLowerCase().trim();
    if (chave === "(sem nome)" || vistos.has(chave)) continue;
    vistos.add(chave);
    limpos.push(e);
  }
  console.log(`   → ${limpos.length} empresas encontradas.`);
  return limpos;
}
