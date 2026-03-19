# SURVEYS — Plano de Execução

## Visão Geral

Transformar o formulário de pesquisa de satisfação de clientes (Customer Support Survey) em um quiz interativo estilo **Typeform**, estilizado com a identidade visual da Guday, com respostas enviadas para o Google Sheets.

**Público-alvo:** Funcionários da Guday
**Layout de referência:** Typeform (uma pergunta por vez, transição suave, barra de progresso)

---

## Etapa 1 — Tradução do PDF para Português

**Objetivo:** Traduzir `Example-Customer Support Survey.pdf` para pt-BR e salvar em arquivo `.md`.

**Arquivo de saída:** `survey-pt.md`

**O que fazer:**
- Ler o PDF `Example-Customer Support Survey.pdf`
- Traduzir todos os textos para pt-BR (perguntas, instruções, opções de resposta)
- Manter a estrutura original do formulário (seções, tipos de campo, ordem)
- Adaptar linguagem para o contexto interno da Guday (tom profissional mas acessível)

---

## Etapa 2 — Levantamento do Style Guide da Guday

**Objetivo:** Extrair cores, tipografia e padrões visuais do site guday.com.br e documentar em `styleguide.md`.

**Fonte:** https://guday.com.br/

**O que extrair:**
- **Fontes:** famílias tipográficas (headings, body), pesos, tamanhos
- **Cores:** paleta principal, secundária, neutros, estados (hover, foco, erro)
- **Componentes base:** botões, inputs, espaçamentos
- **Tom visual geral**

**Arquivo preenchido:** `styleguide.md`

---

## Etapa 3 — Integração com Google Sheets (Apps Script)

**Objetivo:** Configurar o Google Sheets para receber as respostas do quiz via Google Apps Script Web App.

**Planilha:** https://docs.google.com/spreadsheets/d/1odHMi10HfqqQW_yrD8WP-lolOC5p6UiwsjTO_pzV4L8/edit

### Como funciona a integração

```
[quiz.html] → fetch() POST → [Apps Script Web App URL] → [Google Sheets]
```

O Apps Script atua como um **endpoint HTTP** que recebe os dados do quiz e escreve na planilha. Não requer backend, OAuth, ou login do respondente.

### Passos para configurar (feitos uma vez, manualmente)

1. Abrir a planilha no Google Sheets
2. Ir em **Extensões → Apps Script**
3. Colar o código abaixo no editor:

```javascript
function doPost(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const data = JSON.parse(e.postData.contents);

  // Adiciona cabeçalho se a planilha estiver vazia
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(["Timestamp", ...Object.keys(data)]);
  }

  sheet.appendRow([new Date().toISOString(), ...Object.values(data)]);

  return ContentService
    .createTextOutput(JSON.stringify({ status: "ok" }))
    .setMimeType(ContentService.MimeType.JSON);
}
```

4. Clicar em **Implantar → Nova implantação**
5. Tipo: **App da Web**
6. Executar como: **Minha conta**
7. Quem tem acesso: **Qualquer pessoa**
8. Copiar a **URL da implantação** gerada
9. Colar a URL no `quiz.html` (variável `SHEETS_ENDPOINT`)

### Estrutura das colunas na planilha

| Timestamp | Pergunta 1 | Pergunta 2 | ... | Pergunta N |
|---|---|---|---|---|
| 2026-03-17T10:00:00Z | Resposta | Resposta | ... | Resposta |

---

## Etapa 4 — Criação do Quiz Interativo em HTML

**Objetivo:** Criar o quiz em um único arquivo HTML, inspirado no Typeform, com estilo Guday.

**Arquivo de saída:** `quiz.html`

**Requisitos técnicos:**
- HTML5 + CSS3 + JavaScript vanilla (sem frameworks)
- Arquivo único, self-contained
- Fontes via CDN (conforme styleguide)
- Responsivo (mobile-first)
- Variável `SHEETS_ENDPOINT` no topo do JS para configurar o endpoint

**Fluxo de telas:**

```
[Boas-vindas] → [Pergunta 1] → [Pergunta 2] → ... → [Pergunta N] → [Obrigado]
```

**Funcionalidades:**
- Uma pergunta por vez (estilo Typeform)
- Animação de entrada/saída entre perguntas (slide ou fade)
- Barra de progresso no topo
- Botões "Anterior" e "Próximo" / "Enviar"
- Validação: impede avançar sem responder (exceto campos opcionais)
- Ao final: envia respostas via `fetch()` POST para o Apps Script
- Tela de confirmação após envio bem-sucedido
- Tratamento de erro se o envio falhar

**Tipos de campo suportados:**
- Escala numérica (1 a 5 ou NPS 0–10) com botões visuais
- Múltipla escolha (radio estilizado)
- Caixa de texto livre (textarea auto-resize)
- Seleção única (cards clicáveis)

**Estilização (baseada no styleguide.md):**
- Paleta de cores da Guday
- Tipografia da Guday
- Fundo de tela inteiro por pergunta (full-viewport)
- Estados visuais claros: selecionado, hover, foco, erro

---

## Ordem de Execução

```
1. Ler PDF → traduzir → gerar survey-pt.md
2. Acessar guday.com.br → extrair estilo → preencher styleguide.md
3. Configurar Apps Script na planilha (passo manual do usuário)
4. Gerar quiz.html com endpoint configurável
```

> **Nota:** O passo 3 requer ação manual na conta Google do usuário (não pode ser automatizado). Após obter a URL do Apps Script, basta colar em `quiz.html`.

### Integração concluída

- **Apps Script implantado em:** 2026-03-17
- **Endpoint configurado:** `https://script.google.com/macros/s/AKfycbwGKVNvQfmielomrWN6ef7fiyErB8iGwpK7faOmZNomGAb1X7v85ewrJXpxXx66f4EdUQ/exec`
- **Planilha de destino:** https://docs.google.com/spreadsheets/d/1odHMi10HfqqQW_yrD8WP-lolOC5p6UiwsjTO_pzV4L8/edit

---

## Arquivos do Projeto

| Arquivo | Descrição | Status |
|---|---|---|
| `Example-Customer Support Survey.pdf` | Formulário original em inglês | ✅ Concluído |
| `Guday - Client Survey.pdf` | Questionário de cliente para CRO (original) | ✅ Concluído |
| `survey-pt.md` | Tradução do formulário para pt-BR | ✅ Concluído |
| `styleguide.md` | Guia de estilo visual da Guday | ✅ Concluído |
| `quiz.html` | Quiz de suporte — pesquisa interna com funcionários | ✅ Concluído |
| `client-survey.html` | Quiz de cliente — onboarding CRO (24 perguntas, 4 seções) | ✅ Concluído |
| `post-purchase.html` | Pesquisa pós-compra — 14 perguntas, fluxo direto sem seções | ✅ Concluído |
| `post-purchase questions` | Perguntas-base da pesquisa pós-compra (adaptadas para Guday) | ✅ Concluído |
| `read.md` | Esta documentação | ✅ Concluído |

---

## Quiz de Cliente — client-survey.html

**Público-alvo:** Clientes (onboarding CRO)
**Fonte:** `Guday - Client Survey.pdf`
**Perguntas:** 25, organizadas em 4 seções com telas de transição

### Histórico de alterações

| Data | Alteração |
|---|---|
| 2026-03-17 | Criação inicial — 24 perguntas, 4 seções, integração com Sheets |
| 2026-03-17 | Ajuste de copy na tela de boas-vindas (título e texto de introdução) |
| 2026-03-17 | Nova pergunta em "Sobre competidores": nomeação de 3–5 marcas concorrentes (total: 25 perguntas) |
| 2026-03-17 | Shift+Enter para avançar (+ hint visual abaixo dos botões); botão Recomeçar; persistência de respostas via localStorage |
| 2026-03-17 | Layout mobile: Recomeçar vira link de texto; hint + recomeçar em footer row com space-between; Anterior/Próximo sempre em 2 colunas (grid) |

### Seções

| Seção | Perguntas |
|---|---|
| Sobre você | 7 |
| Sobre competidores | 5 |
| Sobre a sua audiência | 9 |
| Sobre seu produto | 4 |

### Integração

- **Apps Script implantado em:** 2026-03-17
- **Endpoint:** `https://script.google.com/macros/s/AKfycbxLOnIzVF62r_FoWOEf9VTAdZnY0OmMbVRTYHYHUKPxf-2d3-Tc0qerWXagNO_8uM0/exec`
- **Planilha de destino:** a definir pelo usuário

---

## Pesquisa Pós-Compra — post-purchase.html

**Público-alvo:** Clientes que acabaram de comprar na Guday
**Fonte:** `post-purchase questions` (adaptado de modelo Mynd Mushrooms para o contexto de gummy de creatina)
**Perguntas:** 14, fluxo direto sem separação por seções

### Perguntas

| # | Pergunta | Tipo |
|---|---|---|
| 1 | Qual é o seu gênero? | Radio (Feminino, Masculino, Não-binário/Outro, Prefiro não responder) |
| 2 | Qual é a sua faixa etária? | Radio (6 faixas) |
| 3 | Como você conheceu a Guday pela primeira vez? | Radio (8 opções incl. TikTok Shop, influenciador) |
| 4 | O que despertou seu interesse na Guday? | Texto livre |
| 5 | Quais foram os 3 principais fatores que te convenceram a comprar? | Texto livre |
| 6 | Qual era o seu maior medo ou preocupação antes de comprar? | Texto livre |
| 7 | Houve algo que quase te fez desistir da compra? | Texto livre |
| 8 | Quão fácil foi encontrar o que procurava no site? | Escala 0–10 |
| 9 | O que poderíamos ter feito para facilitar sua decisão? | Texto livre (opcional) |
| 10 | Maior desafio ao procurar suplemento de creatina ideal? | Texto livre |
| 11 | Novos sabores de gummy que gostaria? | Checkbox (até 3) |
| 12 | Próximo suplemento em formato gummy? | Checkbox (até 3) |
| 13 | Probabilidade de recomendar a Guday (NPS)? | Escala 0–10 |
| 14 | Como descreveria a Guday para um amigo? | Texto livre |

### Características

- Fluxo direto (sem telas de transição de seção)
- Auto-avanço ao selecionar opção em perguntas radio e NPS (350ms delay)
- Perguntas abertas sem hints sugestivos (para não enviesar respostas)
- Scroll habilitado para telas com muitas opções

### Integração

- **Endpoint:** a configurar (variável `SHEETS_ENDPOINT` no topo do JS)
- **Chave localStorage:** `guday_post_purchase_v1`

---

## Funcionalidades Comuns (quiz.html, client-survey.html e post-purchase.html)

| Funcionalidade | Detalhe |
|---|---|
| Shift+Enter | Avança para a próxima pergunta ou envia o formulário |
| Cmd/Ctrl+Enter | Alternativa ao Shift+Enter (mantido para compatibilidade) |
| Hint de teclado | Texto discreto abaixo dos botões indicando o atalho |
| Botão Recomeçar | Link de texto discreto (sem borda) com ícone de reload, alinhado à direita do hint; limpa localStorage e volta ao início |
| LocalStorage | Salva respostas e tela atual automaticamente; restaura silenciosamente ao reabrir |
| Limpeza do storage | Automática após envio bem-sucedido |
| Chaves de storage | `guday_quiz_v1` (quiz.html) · `guday_client_survey_v1` (client-survey.html) · `guday_post_purchase_v1` (post-purchase.html) |

---

## Decisões Técnicas

| Decisão | Escolha | Motivo |
|---|---|---|
| Integração com Sheets | Google Apps Script Web App | Sem backend, sem OAuth, funciona de HTML estático |
| Framework JS | Vanilla JS | Sem dependências, arquivo único |
| Layout | Typeform-inspired | Uma pergunta por vez, experiência fluida |
| Público quiz.html | Funcionários Guday | Tom interno, profissional e acessível |
| Público client-survey.html | Clientes (onboarding CRO) | Tom consultivo, seções temáticas com transições |
| Público post-purchase.html | Clientes pós-compra | Tom casual, fluxo rápido sem seções, auto-avanço |
| Persistência | localStorage | Sem backend, retomada silenciosa sem fricção |
| Atalho de teclado | Shift+Enter | Mais natural em formulários de texto do que Cmd+Enter |

---

## Cupom TikTok Shop → Shopify

**Objetivo:** Clientes que compram na TikTok Shop recebem um QR code na embalagem. Ao escanear, chegam a uma landing page onde preenchem seus dados e resgatam um cupom de produto grátis para usar na próxima compra acima de R$199 na Guday.

**URL da landing page:** https://cupom-guday.vercel.app

### Arquitetura

```
QR Code (embalagem) → cupom-guday.vercel.app → Form (nome/email/telefone/CPF)
  → API /api/resgatar → Supabase valida CPF + resgata código
  → Código exibido na tela
```

### Stack

| Camada | Tecnologia |
|---|---|
| Landing page | HTML vanilla — mesmo estilo Guday (Plus Jakarta Sans, paleta roxa) |
| API | Vercel Serverless Function (`api/resgatar.js`) |
| Banco | Supabase — tabelas `cupons` e `resgates` |
| Cupons | Shopify Admin API (GraphQL) — desconto KEE3AFXW1AQY |
| App Shopify | "Cupom Tiktok" — client_id `0df096d04e5aa88fbbc3bbc75443dd77` |

### Credenciais e IDs

| Item | Valor |
|---|---|
| Loja Shopify | `gummy-creatine.myshopify.com` |
| Access Token Shopify | `(removido — consultar variáveis de ambiente)` |
| Discount Node ID | `gid://shopify/DiscountCodeNode/1843691356469` |
| Supabase URL | `https://yhwzhvzomooselnbcota.supabase.co` |
| Supabase Project | `yhwzhvzomooselnbcota` |

### Controle de unicidade (dupla camada)

1. **Supabase** — CPF hasheado (SHA-256) na tabela `resgates`. Um CPF só pode resgatar uma vez, independente de e-mail ou dispositivo.
2. **Shopify** — cada código `TIKTOK-*` tem uso único. Mesmo que alguém descubra um código, funciona uma única vez no checkout.

### Arquivos do projeto

| Arquivo | Localização |
|---|---|
| Landing page | `~/cupom-tiktok/landing/index.html` |
| API serverless | `~/cupom-tiktok/landing/api/resgatar.js` |
| Script gerador de códigos | `~/cupom-tiktok/cupom-tiktok/gerar-codigos.mjs` |
| App config Shopify | `~/cupom-tiktok/cupom-tiktok/shopify.app.toml` |
| Documentação original | `cupom-code-documentation.md` (neste repo) |

### Status dos códigos (2026-03-18)

- **5 códigos de teste** gerados (TIKTOK-21ADD7D0, TIKTOK-7AD81078, TIKTOK-8C49AFB6, TIKTOK-96831E8F, TIKTOK-ABABA840)
- **500 códigos definitivos** gerados e salvos no Shopify + Supabase
- Para gerar mais: editar `TOTAL_CODES` em `gerar-codigos.mjs` e rodar `node gerar-codigos.mjs`

### Próximos passos

- [ ] Rodar `shopify app deploy` para atualizar a URL do app (example.com → cupom-guday.vercel.app)
- [ ] Deletar os 5 códigos de teste no Shopify (opcional)
- [ ] Gerar e imprimir o QR Code apontando para https://cupom-guday.vercel.app
- [ ] Testar fluxo completo com CPF real
