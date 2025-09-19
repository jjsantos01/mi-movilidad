export function getMomentoDia(hora) {
  if (hora <= 11) return 'Mañana';
  if (hora <= 18) return 'Tarde';
  return 'Noche';
}

export function parseFechaHora(fechaHora) {
  if (!fechaHora) return new Date(0);
  const [datePart, timePart = '00:00:00'] = fechaHora.split(' ');
  const isoDate = datePart.split('-').reverse().join('-') + 'T' + timePart;
  return new Date(isoDate);
}

export function parseDateTime(dateTimeString) {
  const [datePart, timePart] = dateTimeString.split(' ');
  const [day, month, year] = datePart.split('-');
  const [hour, minute, second] = timePart.split(':');
  return new Date(year, month - 1, day, hour, minute, second);
}

