export function bindDownloads(currentDataRef) {
  const csvBtn = document.getElementById('downloadCSV');
  const jsonBtn = document.getElementById('downloadJSON');
  if (!csvBtn || !jsonBtn) return;

  function convertDataToCSV(rows) {
    if (!rows || rows.length === 0) return '';
    const header = Object.keys(rows[0]).join(',');
    const body = rows.map(r => Object.values(r).join(',')).join('\n');
    return `${header}\n${body}`;
  }

  csvBtn.addEventListener('click', function() {
    const rows = currentDataRef();
    if (!rows || rows.length === 0) return;
    const serie = (rows[0]['num_serie'] || '').slice(-8) || 'datos';
    const csv = convertDataToCSV(rows);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `mi-movilidad-${serie}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  });

  jsonBtn.addEventListener('click', function() {
    const rows = currentDataRef();
    if (!rows || rows.length === 0) return;
    const serie = (rows[0]['num_serie'] || '').slice(-8) || 'datos';
    const json = JSON.stringify(rows, null, 2);
    const blob = new Blob([json], { type: 'application/json;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `mi-movilidad-${serie}.json`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  });
}

