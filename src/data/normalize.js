import { getMomentoDia } from '../utils/date.js';

export function processViajes(data) {
  return (data || [])
    .filter(item => item && item.fecha && item.organismo && item.operacion !== '71-FIN DE VIAJE' && item.operacion !== '00-RECARGA')
    .map(item => {
      const [datePart, timePart = '00:00:00'] = String(item.fecha).split(' ');
      const date = new Date(datePart.split('-').reverse().join('-'));
      const hora = parseInt((timePart || '00:00:00').split(':')[0]);
      const days = ['lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado', 'domingo'];
      return {
        ...item,
        dayOfWeek: days[date.getDay()],
        momento_dia: getMomentoDia(isNaN(hora) ? 0 : hora),
        hora: isNaN(hora) ? 0 : hora,
      };
    });
}

export function createMetroObject(viajes, selectedOrganismo = 'STC') {
  return (viajes || []).filter(v => v.organismo === selectedOrganismo);
}

export function populateOrganismoSelector(viajes) {
  const organismos = [...new Set((viajes || []).map(v => v.organismo))];
  return ['Todos', ...organismos];
}
