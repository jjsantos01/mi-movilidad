export function getTotalViajes(viajes) {
  const totalViajes = (viajes || []).length;
  const el = document.getElementById('totalViajes');
  if (el) el.textContent = totalViajes.toLocaleString();
}

export function getTotalRecargas(data) {
  const totalRecargas = (data || []).reduce((total, viaje) => {
    if (!viaje) return total;
    const op = String(viaje.operacion || '').trim().toUpperCase();
    if (op === '00-RECARGA' || op.indexOf('RECARGA') !== -1) {
      const rawMonto = viaje.monto;
      const montoNum = typeof rawMonto === 'number'
        ? rawMonto
        : parseFloat(String(rawMonto || '').replace(',', '.'));
      if (Number.isFinite(montoNum)) {
        return total + montoNum;
      }
    }
    return total;
  }, 0);
  const el = document.getElementById('totalRecargas');
  if (el) el.textContent = `$${totalRecargas.toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 0})}`;
}

