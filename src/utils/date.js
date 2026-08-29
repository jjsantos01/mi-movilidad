export function getMomentoDia(hora) {
  if (hora <= 11) return 'Mañana';
  if (hora <= 18) return 'Tarde';
  return 'Noche';
}

export function parseFechaHora(fechaHora) {
  if (!fechaHora) return new Date(0);
  const [datePart = '', timePart = '00:00:00'] = String(fechaHora).trim().split(/\s+/);
  const dateTokens = datePart.split('-');
  if (dateTokens.length !== 3) return new Date(0);

  const isYearFirst = dateTokens[0].length === 4;
  const [year, month, day] = isYearFirst
    ? [parseInt(dateTokens[0], 10), parseInt(dateTokens[1], 10), parseInt(dateTokens[2], 10)]
    : [parseInt(dateTokens[2], 10), parseInt(dateTokens[1], 10), parseInt(dateTokens[0], 10)];

  const timeTokens = timePart.split(':');
  const hour = parseInt(timeTokens[0], 10) || 0;
  const minute = parseInt(timeTokens[1], 10) || 0;
  const second = parseInt(timeTokens[2], 10) || 0;

  return new Date(year, month - 1, day, hour, minute, second);
}

export function parseDateTime(dateTimeString) {
  return parseFechaHora(dateTimeString);
}

