import { getMomentoDia } from '../utils/date.js';
import { filterTimtEntryValidations } from './timt.js';

const DAYS = ['lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado', 'domingo'];
const TIMT_ORGANISMO = 'STE';
const TIMT_LINE = 'TIMT';
const TIMT_OPERATION = '03-VALIDACION';

function normalizeItem(item) {
  const [datePart, timePart = '00:00:00'] = String(item.fecha).split(' ');
  const date = new Date(datePart.split('-').reverse().join('-'));
  const hora = parseInt((timePart || '00:00:00').split(':')[0]);
  return {
    ...item,
    dayOfWeek: DAYS[date.getDay()],
    momento_dia: getMomentoDia(isNaN(hora) ? 0 : hora),
    hora: isNaN(hora) ? 0 : hora,
  };
}

function isTimtValidation(viaje) {
  return viaje &&
    viaje.organismo === TIMT_ORGANISMO &&
    viaje.linea === TIMT_LINE &&
    viaje.operacion === TIMT_OPERATION;
}

export function processViajes(data) {
  const processed = (data || [])
    .filter(item => item && item.fecha && item.organismo && item.operacion !== '71-FIN DE VIAJE' && item.operacion !== '00-RECARGA')
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
