import { showLoadingMessage } from '../ui/sections.js';

function normalizeHeader(h) {
  return String(h || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '');
}

/**
 * Normaliza el valor de un campo de texto quitando tildes/diacríticos, espacios extras y pasando a mayúsculas.
 * Permite comparar strings como '03-VALIDACIÓN' == '03-VALIDACION'.
 */
export function normalizeValue(v) {
  if (v === null || v === undefined) return '';
  return String(v)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .toUpperCase();
}

/**
 * Normaliza el nombre del organismo al formato canónico esperado por la app.
 */
export function normalizeOrganismo(v) {
  if (v === null || v === undefined) return '';
  const clean = normalizeValue(v);
  if (clean === 'METROBUS') return 'METROBÚS';
  if (clean === 'CABLEBUS') return 'CABLEBÚS';
  return clean;
}

/**
 * Detecta la fila de encabezados analizando las primeras filas y puntuando coincidencias con nombres esperados.
 * Retorna el range apropiado para sheet_to_json.
 */
export function detectRange(worksheet) {
  const sampleRows = XLSX.utils.sheet_to_json(worksheet, { header: 1, range: 0, defval: '' });
  if (!sampleRows || sampleRows.length === 0) return 0;

  const KNOWN_HEADERS = new Set([
    'fechahora', 'fecha', 'organismo', 'linea', 'estacion',
    'operacion', 'monto', 'saldofinal', 'saldo', 'numserie', 'serie'
  ]);

  let bestRowIndex = 0;
  let maxScore = 0;
  const rowsToCheck = Math.min(sampleRows.length, 10);

  for (let r = 0; r < rowsToCheck; r++) {
    const row = sampleRows[r] || [];
    let score = 0;
    for (const cell of row) {
      const normalized = normalizeHeader(String(cell || ''));
      if (normalized && KNOWN_HEADERS.has(normalized)) {
        score++;
      }
    }
    if (score > maxScore) {
      maxScore = score;
      bestRowIndex = r;
    }
  }

  // Si encontramos una fila con al menos 2 encabezados reconocidos, usamos su índice
  if (maxScore >= 2) {
    return bestRowIndex;
  }
  return 0;
}

function valueByCanonical(row, canonical) {
  const map = new Map();
  for (const [k, v] of Object.entries(row)) {
    map.set(normalizeHeader(k), v);
  }
  return map.get(canonical);
}

function valueByAny(row, canonicals) {
  for (const c of canonicals) {
    const v = valueByCanonical(row, c);
    if (v !== undefined && v !== null && v !== '') return v;
  }
  return undefined;
}

export async function excelToJson(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const range = detectRange(worksheet);
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { range });
        const transformedData = jsonData.map((row, index) => {
          const fechaVal = valueByAny(row, ['fechahora','fecha']);
          const organismoVal = valueByAny(row, ['organismo']);
          const lineaVal = valueByAny(row, ['linea']);
          const estacionVal = valueByAny(row, ['estacion']);
          const operacionVal = valueByAny(row, ['operacion']);
          const montoVal = valueByAny(row, ['monto']);
          const saldoVal = valueByAny(row, ['saldofinal']);
          const serieVal = valueByAny(row, ['numserie','num_serie','numserie']);
          return {
            numero: jsonData.length - index, // keep original descending numbering
            num_serie: serieVal != null ? String(serieVal).trim() : '',
            organismo: organismoVal != null ? normalizeOrganismo(organismoVal) : '',
            linea: lineaVal != null ? String(lineaVal).trim() : '',
            estacion: estacionVal != null ? String(estacionVal).trim() : '',
            // Normalizar operacion: quitar tildes, trim y uppercase para consistencia
            operacion: operacionVal != null ? normalizeValue(operacionVal) : undefined,
            monto: montoVal != null ? String(montoVal).trim() : '',
            saldo_final: saldoVal != null ? String(saldoVal).trim() : '',
            fecha: fechaVal != null ? String(fechaVal).trim() : '',
          };
        });
        resolve(transformedData);
      } catch (error) { reject(error); }
    };
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
}

export function bindDropZone(onData) {
  const dropZone = document.getElementById('dropZone');
  const fileInput = document.getElementById('fileInput');
  if (!dropZone || !fileInput) return;

  function handleDrop(e) {
    e.preventDefault();
    dropZone.classList.remove('dragover');
    const files = e.dataTransfer.files;
    if (!files || files.length === 0) return;
    showLoadingMessage();
    excelToJson(files[0]).then(onData).catch(err => {
      const el = document.getElementById('loadingMessage');
      if (el) el.textContent = 'Error al procesar el archivo: ' + err.message;
    });
  }

  dropZone.addEventListener('drop', handleDrop);
  dropZone.addEventListener('dragover', (e) => { e.preventDefault(); dropZone.classList.add('dragover'); });
  dropZone.addEventListener('dragleave', () => dropZone.classList.remove('dragover'));
  dropZone.addEventListener('dragend', () => dropZone.classList.remove('dragover'));
  dropZone.addEventListener('click', () => fileInput.click());
  fileInput.addEventListener('change', (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    showLoadingMessage();
    excelToJson(files[0]).then(onData).catch(err => {
      const el = document.getElementById('loadingMessage');
      if (el) el.textContent = 'Error al procesar el archivo: ' + err.message;
    });
  });
}
