import { TIMT_UNKNOWN_STATION } from '../data/timt.js';

const TABLE_CLASS = 'timt-od-table';

function formatLabel(label) {
  if (!label || String(label).trim() === '') return TIMT_UNKNOWN_STATION;
  return label;
}

export function renderTimtMatrix(matrix) {
  const container = document.getElementById('timtODContainer');
  if (!container) return;

  if (!matrix || (matrix.origins.length === 0 && matrix.destinations.length === 0)) {
    container.innerHTML = '<p>No hay viajes del TIMT para mostrar.</p>';
    return;
  }

  const table = document.createElement('table');
  table.className = TABLE_CLASS;

  const thead = document.createElement('thead');
  const headerRow = document.createElement('tr');
  const corner = document.createElement('th');
  corner.textContent = 'Origen \\ Destino';
  headerRow.appendChild(corner);
  matrix.destinations.forEach(dest => {
    const th = document.createElement('th');
    th.textContent = formatLabel(dest);
    headerRow.appendChild(th);
  });
  const totalHeader = document.createElement('th');
  totalHeader.textContent = 'Total';
  headerRow.appendChild(totalHeader);
  thead.appendChild(headerRow);
  table.appendChild(thead);

  const tbody = document.createElement('tbody');
  matrix.origins.forEach(origin => {
    const row = document.createElement('tr');
    const originCell = document.createElement('th');
    originCell.textContent = formatLabel(origin);
    row.appendChild(originCell);
    matrix.destinations.forEach(dest => {
      const cell = document.createElement('td');
      cell.textContent = matrix.getCount(origin, dest).toLocaleString();
      row.appendChild(cell);
    });
    const totalCell = document.createElement('td');
    totalCell.textContent = matrix.getOriginTotal(origin).toLocaleString();
    row.appendChild(totalCell);
    tbody.appendChild(row);
  });
  table.appendChild(tbody);

  const tfoot = document.createElement('tfoot');
  const footerRow = document.createElement('tr');
  const totalLabel = document.createElement('th');
  totalLabel.textContent = 'Total';
  footerRow.appendChild(totalLabel);
  matrix.destinations.forEach(dest => {
    const cell = document.createElement('th');
    cell.textContent = matrix.getDestinationTotal(dest).toLocaleString();
    footerRow.appendChild(cell);
  });
  const grandTotalCell = document.createElement('th');
  grandTotalCell.textContent = matrix.grandTotal.toLocaleString();
  footerRow.appendChild(grandTotalCell);
  tfoot.appendChild(footerRow);
  table.appendChild(tfoot);

  container.innerHTML = '';
  container.appendChild(table);
}
