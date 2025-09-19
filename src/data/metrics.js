export function getTotalViajes(viajes) {
  const totalViajes = (viajes || []).length;
  const el = document.getElementById('totalViajes');
  if (el) el.textContent = totalViajes.toLocaleString();
}

export function getTotalRecargas(data) {
  const totalRecargas = (data || []).reduce((total, viaje) => {
    if (viaje.operacion === '00-RECARGA') return total + parseFloat(viaje.monto);
    return total;
  }, 0);
  const el = document.getElementById('totalRecargas');
  if (el) el.textContent = `$${totalRecargas.toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 0})}`;
}

