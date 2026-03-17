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
| `read.md` | Esta documentação | ✅ Concluído |

---

## Quiz de Cliente — client-survey.html

**Público-alvo:** Clientes (onboarding CRO)
**Fonte:** `Guday - Client Survey.pdf`
**Perguntas:** 24, organizadas em 4 seções com telas de transição

### Histórico de alterações

| Data | Alteração |
|---|---|
| 2026-03-17 | Criação inicial — 24 perguntas, 4 seções, integração com Sheets |
| 2026-03-17 | Ajuste de copy na tela de boas-vindas (título e texto de introdução) |

### Seções

| Seção | Perguntas |
|---|---|
| Sobre você | 7 |
| Sobre competidores | 4 |
| Sobre a sua audiência | 9 |
| Sobre seu produto | 4 |

### Integração

- **Apps Script implantado em:** 2026-03-17
- **Endpoint:** `https://script.google.com/macros/s/AKfycbxLOnIzVF62r_FoWOEf9VTAdZnY0OmMbVRTYHYHUKPxf-2d3-Tc0qerWXagNO_8uM0/exec`
- **Planilha de destino:** a definir pelo usuário

---

## Decisões Técnicas

| Decisão | Escolha | Motivo |
|---|---|---|
| Integração com Sheets | Google Apps Script Web App | Sem backend, sem OAuth, funciona de HTML estático |
| Framework JS | Vanilla JS | Sem dependências, arquivo único |
| Layout | Typeform-inspired | Uma pergunta por vez, experiência fluida |
| Público quiz.html | Funcionários Guday | Tom interno, profissional e acessível |
| Público client-survey.html | Clientes (onboarding CRO) | Tom consultivo, seções temáticas com transições |
