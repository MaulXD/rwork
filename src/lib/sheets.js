/**
 * Integração com a planilha de inventário da Thep.
 *
 * Leitura: a planilha é pública, então a página lê o inventário direto pelo
 * endpoint CSV — serve para avisar de número repetido e mostrar o que já existe.
 *
 * Escrita: o Google não aceita gravação anônima. Quem grava é um Apps Script
 * publicado como aplicativo web pela própria conta dona da planilha; a página
 * só faz um POST para a URL desse script. Enquanto ele não existir, o botão de
 * copiar linha resolve — o dado nunca fica preso aqui.
 */

export const SHEET_ID = '14F4f4FTx5tM54QxXz6kAKVYEQiRx6qCUBDb0TNRba2g'
export const SHEET_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/edit?gid=0#gid=0`
export const CSV_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&gid=0`

const CHAVE_URL = 'rwork.sheets-webapp'

export function lerWebAppUrl() {
  try {
    return localStorage.getItem(CHAVE_URL) || ''
  } catch {
    return ''
  }
}

export function gravarWebAppUrl(url) {
  try {
    localStorage.setItem(CHAVE_URL, url || '')
  } catch {
    /* modo privado: só não persiste */
  }
}

/** Parser de CSV que respeita aspas e quebras de linha dentro do campo. */
function parseCSV(texto) {
  const linhas = []
  let campo = ''
  let linha = []
  let aspas = false

  for (let i = 0; i < texto.length; i++) {
    const c = texto[i]
    if (aspas) {
      if (c === '"') {
        if (texto[i + 1] === '"') {
          campo += '"'
          i++
        } else aspas = false
      } else campo += c
    } else if (c === '"') {
      aspas = true
    } else if (c === ',') {
      linha.push(campo)
      campo = ''
    } else if (c === '\n') {
      linha.push(campo)
      linhas.push(linha)
      linha = []
      campo = ''
    } else if (c !== '\r') {
      campo += c
    }
  }
  if (campo || linha.length) {
    linha.push(campo)
    linhas.push(linha)
  }
  return linhas
}

/** Data ISO (AAAA-MM-DD) no formato usado na planilha (DD/MM). */
export function dataCurta(iso) {
  if (!iso) return ''
  const [, m, d] = iso.split('-')
  return m && d ? `${d}/${m}` : ''
}

export function linhaTSV({ pc, anydeskId, modelo, data }) {
  return [pc || '', anydeskId || '', modelo || '', dataCurta(data)].join('\t')
}

/**
 * Lê o inventário publicado. Devolve `{ ok, linhas, erro }` — nunca lança,
 * porque a página precisa continuar funcionando offline ou com a planilha fora.
 */
export async function lerInventario() {
  try {
    const r = await fetch(CSV_URL, { redirect: 'follow' })
    if (!r.ok) return { ok: false, linhas: [], erro: `A planilha respondeu ${r.status}.` }

    const linhas = parseCSV(await r.text())
      .slice(1) // cabeçalho
      .map((l) => ({
        pc: (l[0] || '').trim(),
        anydesk: (l[1] || '').trim(),
        modelo: (l[2] || '').trim(),
        data: (l[3] || '').trim(),
      }))
      .filter((l) => l.pc)

    return { ok: true, linhas, erro: '' }
  } catch (e) {
    return {
      ok: false,
      linhas: [],
      erro: 'Não foi possível ler a planilha daqui — o navegador pode ter bloqueado por CORS.',
    }
  }
}

/**
 * Envia uma linha ao Apps Script. Usa `text/plain` de propósito: com JSON o
 * navegador dispara preflight OPTIONS, que o Apps Script não responde.
 */
export async function enviarLinha(webAppUrl, dados) {
  if (!webAppUrl) return { ok: false, erro: 'Configure antes a URL do Apps Script.' }
  try {
    const r = await fetch(webAppUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({
        pc: dados.pc || '',
        anydesk: dados.anydeskId || '',
        modelo: dados.modelo || '',
        data: dataCurta(dados.data),
      }),
      redirect: 'follow',
    })
    if (!r.ok) return { ok: false, erro: `O Apps Script respondeu ${r.status}.` }

    const txt = await r.text()
    try {
      const j = JSON.parse(txt)
      if (j.ok === false) return { ok: false, erro: j.erro || 'O Apps Script recusou a linha.' }
      return { ok: true, linha: j.linha }
    } catch {
      return { ok: true }
    }
  } catch {
    return {
      ok: false,
      erro: 'Falha ao chamar o Apps Script. Confira se a implantação está com acesso "Qualquer pessoa".',
    }
  }
}

/** Código que ele cola no Apps Script da planilha. */
export const APPS_SCRIPT = `function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    var dados = JSON.parse(e.postData.contents);
    var aba = SpreadsheetApp.openById('${SHEET_ID}').getSheetByName('Página1')
           || SpreadsheetApp.openById('${SHEET_ID}').getSheets()[0];

    if (!dados.pc) return json({ ok: false, erro: 'PC vazio' });

    // Se o PC já existe, atualiza a linha em vez de duplicar.
    var col = aba.getRange(1, 1, aba.getLastRow(), 1).getValues();
    for (var i = 1; i < col.length; i++) {
      if (String(col[i][0]).trim() === String(dados.pc).trim()) {
        aba.getRange(i + 1, 2, 1, 3).setValues([[dados.anydesk, dados.modelo, dados.data]]);
        return json({ ok: true, linha: i + 1, atualizado: true });
      }
    }

    aba.appendRow([dados.pc, dados.anydesk, dados.modelo, dados.data]);
    return json({ ok: true, linha: aba.getLastRow() });
  } catch (err) {
    return json({ ok: false, erro: String(err) });
  } finally {
    lock.releaseLock();
  }
}

function json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}`

export const PASSO_A_PASSO = [
  'Abrir a planilha e ir em Extensões → Apps Script.',
  'Apagar o conteúdo do editor e colar o código acima.',
  'Salvar, depois clicar em Implantar → Nova implantação.',
  'Em tipo, escolher "Aplicativo da Web".',
  'Executar como: Eu. Quem tem acesso: Qualquer pessoa.',
  'Implantar, autorizar o acesso à planilha e copiar a URL gerada (termina em /exec).',
  'Colar a URL no campo aqui embaixo. Pronto — o botão de enviar passa a gravar direto.',
]
