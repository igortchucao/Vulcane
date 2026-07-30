// ============================================================
//  Vulcane · Motor de Leads · CONFIGURAÇÃO
//  Mexa só aqui. O resto do motor lê estas opções.
// ============================================================

export const config = {
  // --- Onde buscar (bounding box da cidade) ---------------
  // Padrão: Divinópolis/MG. Pra outra cidade, troque as coordenadas
  // (pegue no Google Maps: clique num ponto → aparece "-20.14, -44.89").
  cidade: "Divinópolis/MG",
  bbox: {
    sul: -20.22,
    oeste: -44.98,
    norte: -20.08,
    leste: -44.82,
  },

  // --- Que tipos de negócio caçar -------------------------
  // Cada item vira um filtro no OpenStreetMap. Comente o que não quiser.
  nichos: [
    'node["shop"]',                              // lojas em geral
    'node["amenity"="restaurant"]',              // restaurantes
    'node["amenity"="fast_food"]',               // lanchonetes / hamburguerias
    'node["amenity"="cafe"]',                    // cafés
    'node["amenity"="bar"]',                     // bares
    'node["shop"="beauty"]',                     // salão / estética
    'node["shop"="hairdresser"]',                // cabeleireiro / barbearia
    'node["shop"="clothes"]',                    // moda
    'node["craft"]',                             // oficinas / prestadores
  ],

  // --- Quem VOCÊ é (aparece no WhatsApp) -------------------
  vendedor: {
    nome: "Igor",
    empresa: "Vulcane",
    // Seu WhatsApp NÃO é usado no envio; o link abre pra VOCÊ mandar
    // a partir do seu próprio WhatsApp Web/App.
  },

  // --- Diagnóstico do site --------------------------------
  diagnostico: {
    timeoutMs: 8000,        // acima disso o site é considerado "lento"
    lentoMs: 3500,          // acima disso já conta ponto de dor "lentidão"
    concorrencia: 6,        // quantos sites checar ao mesmo tempo
  },

  // --- Oferta de ENTRADA (a porta de entrada barata) ------
  // Vendemos o Google primeiro (rápido de entregar, fecha fácil).
  // O site vira upsell depois, pra quem já virou cliente.
  oferta: {
    nome: "Perfil da Empresa no Google (Google Meu Negócio)",
    preco: "R$397",
    prazo: "no ar em até 3 dias",
    // O que ENTREGA (honesto — não prometa 1º lugar, isso não se controla):
    entrega: "aparecer no Maps e na busca com foto, horário, WhatsApp e avaliações",
  },

  // --- Mensagem (é o coração da conversão) ----------------
  // Placeholders: {nome} {dor} {vendedor} {empresa} {oferta} {preco} {prazo}
  mensagem: {
    // Negócio SEM site nenhum (alvo nº1 da oferta de Google):
    semSite:
      "Oi! Procurei a {nome} no Google agora e {dor}. Hoje quem pesquisa no " +
      "celular vai no que aparece primeiro — e vocês estão perdendo esse cliente " +
      "pro concorrente. Eu monto o {oferta} de vocês, {prazo}, por {preco}. " +
      "Posso te mostrar como fica? Sem compromisso. — {vendedor}, {empresa}",

    // Negócio que TEM site mas aparece mal no Google:
    comSite:
      "Oi! Procurei a {nome} no Google e {dor}. Antes até de mexer no site, o " +
      "primeiro passo é vocês aparecerem certinho quando o cliente pesquisa. Eu " +
      "monto o {oferta}, {prazo}, por {preco}. Posso te mostrar? Sem compromisso. " +
      "— {vendedor}, {empresa}",
  },

  // --- Google Places (OPCIONAL, deixe vazio pra usar OpenStreetMap) ---
  // Quando quiser dados de telefone melhores: crie uma chave em
  // console.cloud.google.com → ative "Places API" → cole aqui.
  googlePlacesApiKey: "",
};
