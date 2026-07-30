# 🔥 Vulcane · Motor de Leads + Bot de Respostas

Ferramenta **interna e local** (não vai pro ar).

---

## ⭐ Central de Controle (junta tudo — comece por aqui)

```bash
node servidor.mjs
```

Abra **http://localhost:4700** no navegador. Numa página só você:
- Liga/desliga o **bot** (o QR aparece na própria tela)
- Roda o **motor de leads** com um botão
- Vê a **fila de disparo** e manda no WhatsApp em 1 clique

Deixe a janela do terminal aberta enquanto usa. Ctrl+C encerra tudo.

---

## Ou rode as partes separadas

### Motor de Leads (acha empresas + prepara disparo)

```bash
node rodar.mjs
```

- Busca empresas de Divinópolis, diagnostica quem está fraco no Google/site.
- Gera `painel.html` → abra no navegador → dispare no WhatsApp em 1 clique.
- **Você envia o 1º contato manualmente** (protege seu número de ban).
- Configuração: `config.mjs` (cidade, nichos, oferta, mensagem).

### Bot de Respostas (responde sozinho quem te chama)

```bash
node bot.mjs
```

- 1ª vez: escaneie o QR (WhatsApp → Aparelhos conectados → Conectar aparelho).
- Depois roda sozinho: responde preço, Google, site, prazo… por palavra-chave.
- **Só responde quem TE manda mensagem.** Nunca dispara frio.
- Deixe a janela aberta enquanto quiser o bot ativo. Ctrl+C pra parar.
- Configuração: `respostas.mjs` (saudação, regras, tabela de preço, horário).

### Controles rápidos (edite `respostas.mjs`)
- Pausar o bot: `ativo: false`
- Mudar horário de atendimento: `horario: { inicio: 8, fim: 22 }`
- Editar a tabela de preços: regra `"preco"`
- Adicionar resposta nova: copie um bloco em `regras`

### ⚠️ Regras de segurança (não ignore)
- **Nunca** transforme isto em disparador em massa de 1º contato — bane seu número e é risco LGPD.
- O bot é zona cinza dos termos do WhatsApp. Mantenha volume baixo e humano.
- A pasta `.wwebjs_auth/` é o **login do seu WhatsApp** — está no `.gitignore`, nunca compartilhe.

---

## Setup (só na 1ª vez)
```bash
npm install
```
Usa o Chrome do sistema automaticamente.
