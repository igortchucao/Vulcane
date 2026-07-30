// ============================================================
//  Vulcane · Bot de Respostas · REGRAS
//  Mexa só aqui pra controlar o que o bot responde.
//  O bot só responde quem TE MANDA mensagem (nunca dispara frio).
// ============================================================

export const respostas = {
  // Liga/desliga o bot inteiro sem fechar o programa.
  ativo: true,

  // Não responder nesses horários (formato 24h). Fora daqui, silêncio total.
  // Deixe null pra responder a qualquer hora.
  horario: { inicio: 8, fim: 22 },

  // Espera aleatória antes de responder (parece humano, evita ban).
  delay: { minSeg: 4, maxSeg: 12 },

  // --- Saudação: 1ª vez que um contato novo te chama ------
  saudacao:
    "Opa, aqui é o Igor da Vulcane 🔥 Obrigado pela mensagem! " +
    "Me conta rapidinho o que você precisa — pode ser sobre aparecer no Google, " +
    "site ou preço, que eu já te explico.",

  // --- Regras por palavra-chave (ordem importa: a 1ª que casar vence) ---
  // Cada regra responde no MÁXIMO 1x por contato (não repete).
  regras: [
    {
      nome: "preco",
      palavras: ["preço", "preco", "preços", "valor", "valores", "quanto", "quanto custa", "orçamento", "orcamento", "tabela"],
      resposta:
        "Claro! Nossos planos 👇\n\n" +
        "🟢 *Entrada — Google Meu Negócio:* R$397 (aparecer no Maps/busca em até 3 dias)\n\n" +
        "🌐 *Sites (pagamento único):*\n" +
        "• Essencial (1 página): R$1.800\n" +
        "• Profissional ⭐ (site + catálogo + carrinho no WhatsApp): R$2.900\n" +
        "• Premium (mais páginas + SEO): a partir de R$5.000\n\n" +
        "🔧 *Manutenção mensal (opcional):*\n" +
        "• Cuidar: R$197/mês · • Crescer: R$397/mês\n\n" +
        "Quer que eu monte uma prévia da sua empresa pra você ver? Sem compromisso 😉",
    },
    {
      nome: "google",
      palavras: ["google", "maps", "aparecer", "meu negócio", "meu negocio"],
      resposta:
        "Perfeito! O Google Meu Negócio é a porta de entrada 🚪\n" +
        "Por R$397 eu deixo você aparecendo no Maps e na busca com foto, horário, " +
        "WhatsApp e avaliações — no ar em até 3 dias.\n" +
        "Me manda o nome e a cidade da sua empresa que eu já te mostro como está hoje.",
    },
    {
      nome: "site",
      palavras: ["site", "página", "pagina", "loja online", "catálogo", "catalogo"],
      resposta:
        "Boa! Eu faço sites que vendem — com catálogo e botão de WhatsApp, " +
        "no capricho e otimizado pro celular 📱\n" +
        "Me conta o ramo da sua empresa que eu monto uma prévia pra você ver antes de decidir.",
    },
    {
      nome: "prazo",
      palavras: ["prazo", "quanto tempo", "demora", "quando fica pronto"],
      resposta:
        "O Google fica no ar em até 3 dias. Site simples, cerca de uma semana. " +
        "Depende do material (fotos, textos) — mas eu te ajudo com tudo.",
    },
    {
      nome: "interesse",
      palavras: ["quero", "fechar", "vamos", "bora", "como faço", "como faco", "pode fazer"],
      resposta:
        "Show! 🙌 Pra começar eu preciso só do nome da empresa, cidade e o que vocês " +
        "fazem. Me manda aqui que eu já dou o primeiro passo hoje.",
    },
  ],

  // --- Se não casar nenhuma regra (e não for a 1ª msg) ----
  // Deixe "" (vazio) pra o bot ficar quieto e você responder pessoalmente.
  fallback: "",
};
