import { showLoadingMessage } from '../ui/sections.js';

function normalizeHeader(h) {
  return String(h || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '');
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
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { range: 1 });
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
            operacion: operacionVal,
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
