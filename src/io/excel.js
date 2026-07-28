import { showLoadingMessage } from '../ui/sections.js';

function normalizeHeader(h) {
  return String(h || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '');
}

/**
 * Normaliza el valor de un campo de texto quitando tildes/diacríticos.
 * Permite comparar strings como '03-VALIDACIÓN' == '03-VALIDACION'.
 */
function normalizeValue(v) {
  if (typeof v !== 'string') return v;
  return v.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

/**
 * Detecta si la primera fila es un título genérico (no una cabecera de datos).
 * Retorna el range apropiado para sheet_to_json.
 */
function detectRange(worksheet) {
  // Leer la primera fila como array sin encabezado
  const firstRows = XLSX.utils.sheet_to_json(worksheet, { header: 1, range: 0 });
  if (!firstRows || firstRows.length < 2) return 0;
  const firstRow = firstRows[0] || [];
  const secondRow = firstRows[1] || [];

  // Verificar si la segunda fila parece una cabecera (contiene 'organismo', 'operacion', etc.)
  const secondRowNormalized = secondRow.map(h => normalizeHeader(String(h || '')));
  const EXPECTED_HEADERS = ['organismo', 'operacion', 'monto'];
  const secondRowIsHeader = EXPECTED_HEADERS.every(h => secondRowNormalized.includes(h));

  // Verificar si la primera fila parece una cabecera
  const firstRowNormalized = firstRow.map(h => normalizeHeader(String(h || '')));
  const firstRowIsHeader = EXPECTED_HEADERS.every(h => firstRowNormalized.includes(h));

  // Si la segunda fila tiene los headers esperados, la primera es el título -> range:1
  if (secondRowIsHeader) return 1;
  // Si la primera fila tiene los headers esperados, no hay título -> range:0
  if (firstRowIsHeader) return 0;
  // Por defecto, asumir que hay fila de título
  return 1;
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
            num_serie: serieVal ?? '',
            organismo: organismoVal,
            linea: lineaVal,
            estacion: estacionVal,
            // Normalizar operacion: quitar tildes para consistencia con comparaciones internas
            operacion: operacionVal != null ? normalizeValue(String(operacionVal)) : undefined,
            monto: montoVal != null ? String(montoVal) : '',
            saldo_final: saldoVal != null ? String(saldoVal) : '',
            fecha: fechaVal,
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
