import { getMomentoDia, parseFechaHora } from '../utils/date.js';
import { filterTimtEntryValidations } from './timt.js';

const DAYS = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
const TIMT_ORGANISMO = 'STE';
const TIMT_LINE = 'TIMT';
const TIMT_OPERATION = '03-VALIDACION';

function normalizeItem(item) {
  const dt = parseFechaHora(item.fecha);
  const hora = dt instanceof Date && !isNaN(dt) ? dt.getHours() : 0;
  const dayIndex = dt instanceof Date && !isNaN(dt) ? dt.getDay() : 0;
  return {
    ...item,
    dayOfWeek: DAYS[dayIndex],
    momento_dia: getMomentoDia(hora),
    hora,
  };
}

function isTimtValidation(viaje) {
  if (!viaje || viaje.organismo !== TIMT_ORGANISMO || viaje.linea !== TIMT_LINE) return false;
  const op = String(viaje.operacion || '').trim().toUpperCase();
  return op !== '00-RECARGA' && op.indexOf('RECARGA') === -1;
}

export function processViajes(data) {
  const processed = (data || [])
    .filter(item => {
      if (!item || !item.fecha || !item.organismo) return false;
      const op = String(item.operacion || '').trim().toUpperCase();
      return op !== '71-FIN DE VIAJE' && op !== '00-RECARGA';
    })
    .map(normalizeItem);

  const timtValidations = processed.filter(isTimtValidation);
  if (timtValidations.length === 0) return processed;

  const timtEntries = filterTimtEntryValidations(timtValidations);
  const allowed = new Set(timtEntries);

  return processed.filter(viaje => !isTimtValidation(viaje) || allowed.has(viaje));
}

export function createMetroObject(viajes, selectedOrganismo = 'STC') {
  return (viajes || []).filter(v => v.organismo === selectedOrganismo);
}

export function populateOrganismoSelector(viajes) {
  const organismos = [...new Set((viajes || []).map(v => v.organismo))];
  return ['Todos', ...organismos];
}

export function extractTimtValidations(data) {
  return (data || [])
    .filter(item => isTimtValidation(item))
    .map(normalizeItem);
}
