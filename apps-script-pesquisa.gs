/**
 * Guday — Pesquisa Pós-Compra → Google Sheets
 *
 * Web App que recebe as respostas do post-purchase.html e grava numa aba
 * da planilha. Mesmo padrão do endpoint da LP "Seja um Lojista"
 * (POST no-cors + text/plain, sem CORS headers na resposta).
 *
 * DEPLOY:
 *   1. Abrir a planilha → Extensões → Apps Script
 *   2. Colar este arquivo (substituindo o Código.gs vazio)
 *   3. Implantar → Nova implantação → tipo "App da Web"
 *        - Executar como: Eu
 *        - Quem pode acessar: QUALQUER PESSOA   <-- obrigatório
 *   4. Copiar a URL /exec e colar em SHEET_ENDPOINT no post-purchase.html
 *
 * IMPORTANTE: toda vez que editar este script, criar NOVA implantação
 * (ou "Gerenciar implantações" → editar → Versão: Nova). Salvar só o
 * código NÃO atualiza o Web App publicado.
 */

var SHEET_NAME = 'Respostas';

/** Ordem das colunas. Mudou pergunta no HTML? Mudar aqui também. */
var COLUMNS = [
  'timestamp',
  'lp_source',
  'order_id',
  'email',
  'q0_genero',
  'q1_faixa_etaria',
  'q2_primeiro_contato',
  'q4_chamou_atencao',
  'q5_fatores_convenceram',
  'q6_maior_medo',
  'q7_quase_desistiu',
  'q8_duvidas_respondidas',
  'q9_informacao_faltando',
  'q10_facilidade_pagina',
  'q11_maior_desafio',
  'q13_sugestao_melhoria',
  'user_agent',
  'page_url'
];

function doPost(e) {
  try {
    var payload = JSON.parse(e.postData.contents);
    var sheet = getSheet_();

    var row = COLUMNS.map(function (key) {
      if (key === 'timestamp') {
        return Utilities.formatDate(new Date(), 'America/Sao_Paulo', 'yyyy-MM-dd HH:mm:ss');
      }
      var v = payload[key];
      return (v === undefined || v === null) ? '' : String(v);
    });

    sheet.appendRow(row);

    return ContentService
      .createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    // Loga em aba separada pra não perder resposta por causa de payload torto
    try {
      var errSheet = getErrorSheet_();
      errSheet.appendRow([
        Utilities.formatDate(new Date(), 'America/Sao_Paulo', 'yyyy-MM-dd HH:mm:ss'),
        String(err),
        e && e.postData ? String(e.postData.contents).slice(0, 5000) : '(sem body)'
      ]);
    } catch (e2) {}

    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, error: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/** GET só pra você conferir no browser que o deploy está no ar. */
function doGet() {
  return ContentService
    .createTextOutput('Guday pesquisa pos-compra: endpoint ativo.')
    .setMimeType(ContentService.MimeType.TEXT);
}

function getSheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
  }
  // cabeçalho na primeira execução
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(COLUMNS);
    sheet.getRange(1, 1, 1, COLUMNS.length).setFontWeight('bold');
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function getErrorSheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('_erros');
  if (!sheet) {
    sheet = ss.insertSheet('_erros');
    sheet.appendRow(['timestamp', 'erro', 'payload']);
    sheet.getRange(1, 1, 1, 3).setFontWeight('bold');
    sheet.setFrozenRows(1);
  }
  return sheet;
}
