# Vulcane · A forja digital

Site institucional e sistema de propostas. 100% estático (HTML/CSS/JS) — sem build, sem dependências.

## Estrutura

```
/
├── index.html            Página de vendas (PÚBLICA, indexável)
├── prototipo.html        Propostas por cliente — acesso via ?cliente=CODIGO
├── robots.txt            Libera a home, bloqueia o resto
├── sitemap.xml
├── clientes/
│   └── reforma/          Protótipo da Loja Reforma (só abre dentro da proposta)
│       ├── index.html
│       └── fotos/
└── marca/                Materiais internos da marca (noindex)
    ├── brand.html        Board de identidade
    └── abstrato.html     Estudo de abstração do logo
```

## Como o cliente acessa

1. Entra em `vulcane.com.br` e digita o código na barra do topo, **ou**
2. Recebe o link direto: `vulcane.com.br/prototipo.html?cliente=CODIGO`

Código inválido → redireciona para a página de vendas.

## Proteções

| Camada | O quê |
|---|---|
| `robots.txt` | Bloqueia buscadores em `/prototipo.html`, `/clientes/`, `/marca/` |
| `noindex` | Meta tag nas páginas que não devem aparecer no Google |
| Código na URL | Não é adivinhável |
| Guarda de moldura | O protótipo do cliente só renderiza **dentro** da proposta |

**Chave do admin:** para abrir um protótipo em tela cheia (ex.: numa reunião), use
`/clientes/reforma/?dv=1`

> Atenção: isso é **discrição**, não segurança. Quem tiver o link consegue ver.
> Não coloque nada confidencial aqui.

## Adicionar um novo cliente

1. Crie a pasta `clientes/NOME/` com o protótipo (copie o guarda de moldura do `<head>` da Reforma).
2. Em `prototipo.html`, duplique o bloco dentro de `CLIENTES` e ajuste:
   - a chave (o código secreto da URL)
   - `previewUrl: "/clientes/NOME/"`
   - textos, mudanças, vantagens e ROI
3. Adicione `Disallow: /clientes/NOME/` no `robots.txt` (ou mantenha o `/clientes/` genérico).

## Deploy (Render)

- Tipo: **Static Site**
- Build command: *(vazio)*
- Publish directory: `.`

Qualquer push na branch conectada publica automaticamente.

## Identidade

- **Brasa** `#FF5A1F` · **Faísca** `#FFC24D` · **Obsidiana** `#0B0A0F` · **Basalto** `#14121A`
- Tipografia: **Space Grotesk** (títulos) + **Inter** (texto)
- Slogan: *Forjamos sites que vendem.*
