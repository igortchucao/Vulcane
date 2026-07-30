// ============================================================
//  Vulcane · Bot · LÓGICA DE RESPOSTA (pura, testável)
//  Isolada aqui pra poder rodar testes sem o WhatsApp real.
// ============================================================

import { respostas } from "./respostas.mjs";

export const semAcento = (s) =>
  s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

export function dentroDoHorario(agora = new Date()) {
  if (!respostas.horario) return true;
  const h = agora.getHours();
  return h >= respostas.horario.inicio && h < respostas.horario.fim;
}

export function acharRegra(texto) {
  const t = semAcento(texto);
  for (const regra of respostas.regras) {
    if (regra.palavras.some((p) => t.includes(semAcento(p)))) return regra;
  }
  return null;
}

// Decide o que responder a uma mensagem, dado o estado do contato.
// Retorna { resposta, tag } ou { resposta: null } se for ficar quieto.
// NÃO muta o estado — quem chama decide gravar.
export function decidirResposta(texto, estadoContato = { saudado: false, regras: {} }) {
  const regra = acharRegra(texto);
  if (regra && !estadoContato.regras[regra.nome]) {
    return { resposta: regra.resposta, tag: regra.nome };
  }
  if (!estadoContato.saudado) {
    return { resposta: respostas.saudacao, tag: "saudação" };
  }
  if (respostas.fallback) {
    return { resposta: respostas.fallback, tag: "fallback" };
  }
  return { resposta: null, tag: "silêncio" };
}
