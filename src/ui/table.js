import { inconsistentKeys } from '../data/inconsistencias.js';

let resultsDataTable = null;

export function displayResults(rows) {
  const tableEl = document.getElementById('resultsTable');
  if (!tableEl) return;
  if (!rows || rows.length === 0) {
    if ($.fn.DataTable.isDataTable('#resultsTable')) {
      resultsDataTable.destroy();
      resultsDataTable = null;
    }
    return;
  }

  const allKeys = [...new Set(rows.flatMap(Object.keys))];
  if (!$.fn.DataTable.isDataTable('#resultsTable') || (resultsDataTable && resultsDataTable.columns().header().length !== allKeys.length)) {
    if (resultsDataTable) resultsDataTable.destroy();
    resultsDataTable = $('#resultsTable').DataTable({
      columns: allKeys.map(key => ({ title: key, data: key, defaultContent: '' })),
      data: rows,
      pageLength: 25,
    });
  } else {
    resultsDataTable.clear().rows.add(rows).draw();
  }

  function applyInconsistencyMarks() {
    $('#resultsTable tbody tr').each(function() {
      const rowData = resultsDataTable.row(this).data();
      const key = `${rowData.numero}__${rowData.fecha}`;
      const found = inconsistentKeys.has(key) || rowData._inconsistente;
      if (found) {
        $(this).addClass('inconsistent-row');
        const esperado = rowData._esperado !== undefined ? ` Saldo esperado: ${rowData._esperado}.` : '';
        $(this).attr('title', 'No coincide el monto cobrado con el saldo final.' + esperado);
      } else {
        $(this).removeClass('inconsistent-row');
        $(this).removeAttr('title');
      }
    });
  }

  setTimeout(applyInconsistencyMarks, 10);
  resultsDataTable.on('draw', function() { setTimeout(applyInconsistencyMarks, 10); });

  const checkbox = document.getElementById('showInconsistentCheckbox');
  if (checkbox && !checkbox._bound) {
    $.fn.dataTable.ext.search.push(function(settings, data, dataIndex) {
      if (!document.getElementById('showInconsistentCheckbox').checked) return true;
      const row = resultsDataTable.row(dataIndex).data();
      const key = `${row.numero}__${row.fecha}`;
      return inconsistentKeys.has(key) || row._inconsistente;
    });
    checkbox.addEventListener('change', function() { resultsDataTable.draw(); });
    checkbox._bound = true;
  }
}
