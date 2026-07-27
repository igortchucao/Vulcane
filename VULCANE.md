# 🔥 Vulcane — A forja digital

> Documento-mãe do negócio. Explica o que é a Vulcane, como funciona, o que vende e como opera.
> Se um dia entrar um sócio ou funcionário, é por aqui que ele começa.

---

## 1. O que é

A **Vulcane** é um negócio de **criação e modernização de sites** para empresas de **Divinópolis e região (MG)**.

**Modelo:**
- Quem **não tem** site → a gente cria (site de conversão / catálogo / captação).
- Quem **já tem** → a gente moderniza.

**Fundador:** Igor · **WhatsApp:** (37) 9 9865-2824 · **Site:** https://vulcane.com.br

---

## 2. A marca

| Elemento | Definição |
|---|---|
| **Nome** | Vulcane *(antes "dotVulcan" — mudou porque "dot" travava na fala)* |
| **Conceito** | A forja digital — fogo (impacto que vende) + precisão (o acabamento) |
| **Logo** | O **V forjado** (chevron com faísca em brasa) é a letra "V" do nome → `[V]ulcane.` |
| **Slogan** | **"Forjamos sites que vendem."** / curto: "A forja digital." |
| **Voz** | Mestre-ferreiro digital: confiante, direto, sem jargão. Fala em resultado, não em estética. |

**Paleta:** Brasa `#FF5A1F` · Faísca `#FFC24D` · Obsidiana `#0B0A0F` · Basalto `#14121A` · Fumaça `#F4F1EC`
**Tipografia:** Space Grotesk (títulos) + Inter (texto)
**Arquivos do logo:** `vulcane.com.br/marca/logo.html` (baixa PNG/SVG)

---

## 3. O que a Vulcane vende

### Produtos (pagamento único)
| Plano | O que é | Faixa |
|---|---|---|
| Essencial | Landing / institucional (1 página) | R$ 1.800+ |
| **Profissional** ⭐ | Site completo + catálogo + carrinho/orçamento WhatsApp + painel | R$ 2.900+ |
| Premium | Mais páginas + SEO + integrações | R$ 5.000+ |

### Recorrência (o coração do negócio) 🔑
| Plano | Inclui | Mensal |
|---|---|---|
| Cuidar | Hospedagem, ajustes, cardápio/catálogo atualizado | R$ 197 |
| Crescer | + versões sazonais (Halloween, Natal…) + relatório | R$ 397 |

### Fase 2 (upsell futuro)
Sistema de pedidos com **status no WhatsApp** (aceito → produção → saiu). Projeto R$ 6–15k + mensal.

> Tabela completa (interna): `vulcane.com.br/precos`

**Filosofia de preço:** *land & expand.* O site é a porta de entrada barata; o lucro está no **recorrente** e na **fase 2**. Ancore sempre alto ("de R$ 5.000 por..."). Nos primeiros clientes, use a faixa de baixo pra montar portfólio; depois suba.

---

## 4. Como o negócio funciona (o funil)

```
Prospecção (Instagram/WhatsApp)
      │
      ▼
Protótipo pronto  ──►  vulcane.com.br/prototipo?cliente=CÓDIGO
  (a loja dele já modernizada)          │
      │                                 ▼
      └──►  desperta desejo  ──►  WhatsApp (Igor vende)  ──►  /precos  ──►  fecha
```

**A jogada central:** em vez de *falar* que faz site bom, a Vulcane **mostra a empresa do cliente já modernizada** (spec redesign). O impacto do "antes e depois com a MINHA loja" vende quase sozinho.

---

## 5. O ecossistema (o que já existe no ar)

Tudo hospedado no **Render** (site estático), domínio **vulcane.com.br** (Registro.br), HTTPS grátis.

| Rota | O que é | Público? |
|---|---|---|
| `/` | Página de vendas (SEO local ativo) | ✅ Sim |
| `/indique` | Programa de indicação (10%) | ✅ Sim |
| `/prototipo?cliente=CÓDIGO` | Proposta personalizada por cliente | 🔒 Só com link |
| `/precos` | Tabela de preços interna | 🔒 Escondida |
| `/clientes/NOME/` | Protótipo do cliente (prévia da proposta) | 🔒 Só dentro da proposta |
| `/marca/logo.html` | Baixar logo (PNG/SVG) | 🔒 Interna |
| `/insta.html` | Kit de Instagram (perfil, bio, posts) | 🔒 Interna |

**Proteções das páginas escondidas:** não linkadas + `noindex` + `robots.txt` + "guarda de moldura" (o protótipo do cliente só abre dentro da proposta; acesso direto cai na home). Chave do dono pra abrir em tela cheia: `?dv=1`.

---

## 6. Clientes / protótipos prontos

| Cliente | Ramo | Estilo do protótipo | Código |
|---|---|---|---|
| Loja Reforma | Moda feminina (e-commerce Nuvemshop) | Rosa premium | `reformaluh170726` |
| Chili Burguer | Hamburgueria | Rock anos 90 (carrinho + WhatsApp) | `chiliburguer200726` |
| Encantado Mundo da Criança | Fábrica de brinquedos (infláveis, playgrounds) | Neon jump park (captação de orçamento) | `encantado250726` |

**Como adicionar um cliente novo:**
1. Criar `clientes/NOME/index.html` (copiar o guarda de moldura do `<head>` de outro).
2. Em `prototipo/index.html`, duplicar um bloco de `CLIENTES` e ajustar código, `previewUrl`, textos, ROI.
3. `git push` → no ar em ~1 min.

---

## 7. Como prospectar

**Perfil de alvo ideal:**
- Negócio **médio/grande** (dono acessível, tem budget)
- **Já investe** em marketing/anúncio, ou tem marca forte
- **Site ruim ou inexistente** (dor óbvia)
- **Ticket alto** (o site se paga com 1 venda)

**Canais:** Instagram (DM em 2 tempos — gancho sem link, depois o link) e WhatsApp da loja.
**Horário bom (comércio/food):** terça/quarta, ~15h30 (fora do pico).
**Regra:** só **1 follow-up**. Silêncio ≠ não. Prospecção é **volume** — encher o funil é o jogo.

---

## 8. Marketing próprio

- **Instagram** `@vulcane.sites` (kit pronto em `/insta.html`)
- **Google Meu Negócio** (aparecer no topo local — o de maior impacto)
- **SEO local** ativo no site (título, LocalBusiness, cidades da região)
- **Programa de indicação** (`/indique`) — 10% por cliente fechado, paga só quando fatura

---

## 9. Stack técnica

- **Frontend:** HTML/CSS/JS puro (sem build, sem framework)
- **Hospedagem:** Render (Static Site) · repo GitHub `igortchucao/Vulcane` (branch `main`)
- **Deploy:** `git push` → publica automático
- **Domínio/DNS:** Registro.br (zona DNS: A → `216.24.57.1`, CNAME `www` → Render)
- **Sem backend** — carrinho/orçamento montam mensagem e abrem o WhatsApp (`wa.me`)

---

## 10. Próximos passos

- [ ] Finalizar Google Meu Negócio
- [ ] Subir perfil do Instagram (kit pronto)
- [ ] Follow-up Chili + mandar abordagem Encantado
- [ ] Encher o funil: 5–8 alvos novos em Divinópolis
- [ ] Fechar o 1º cliente → pedir avaliação (combustível do Google)
- [ ] (futuro) Migrar repo/URL de `dotvulcan` → `vulcane` se quiser 100% coerência

---

*Vulcane · A forja digital · Divinópolis/MG · Forjamos sites que vendem.* 🔨🔥
