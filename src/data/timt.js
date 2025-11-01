import { TIMT_WINDOW_MINUTES } from '../config/constants.js';

const UNKNOWN_STATION = 'desconocido';

function normalizeKey(label) {
  return String(label || UNKNOWN_STATION).trim().toLowerCase();
}

function parseAmount(raw) {
  if (raw === undefined || raw === null) return 0;
  const sanitized = String(raw).replace(/[^\d.,-]/g, '').replace(',', '.');
  const value = parseFloat(sanitized);
  return Number.isFinite(value) ? value : 0;
}

function parseFecha(fecha) {
  if (!fecha) return null;
  const [datePartRaw = '', timePartRaw = '00:00:00'] = String(fecha).trim().split(/\s+/);
  const dateTokens = datePartRaw.split('-');
  if (dateTokens.length !== 3) return null;

  const isYearFirst = dateTokens[0].length === 4;
  const datePart = isYearFirst
    ? dateTokens
    : [dateTokens[2], dateTokens[1], dateTokens[0]];
  const isoDate = datePart.join('-');
  const timePart = timePartRaw.length === 5 ? `${timePartRaw}:00` : timePartRaw;
  const parsed = new Date(`${isoDate}T${timePart}`);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function normalizeStationName(name) {
  if (!name) return '';
  return String(name).trim();
}

function createTripFromEvent(event, parsedDate) {
  const estacionOrigen = normalizeStationName(event.estacion) || UNKNOWN_STATION;
  const monto = parseAmount(event.monto);
  return {
    estacion: estacionOrigen,
    estacionOrigen,
    estacionDestino: UNKNOWN_STATION,
    fecha: event.fecha,
    fechaFin: event.fecha,
    monto,
    eventos: [event],
    _startDate: parsedDate,
    _endDate: parsedDate,
  };
}

function finalizeTrip(trip) {
  const durationMs = trip._endDate - trip._startDate;
  trip.duracionMinutos = Number.isFinite(durationMs) ? Math.round(durationMs / 60000) : 0;
  if (!trip.estacionDestino || !trip.estacionDestino.trim()) {
    trip.estacionDestino = UNKNOWN_STATION;
  }
  return {
    estacion: trip.estacion,
    estacionOrigen: trip.estacionOrigen,
    estacionDestino: trip.estacionDestino,
    fecha: trip.fecha,
    fechaFin: trip.fechaFin,
    monto: Number(trip.monto.toFixed(2)),
    duracionMinutos: trip.duracionMinutos,
    eventos: trip.eventos,
  };
}

export function groupTimtTrips(events, windowMinutes = TIMT_WINDOW_MINUTES) {
  const msWindow = windowMinutes * 60 * 1000;
  const sorted = (events || [])
    .map(event => {
      if (!event) return null;
      const parsedDate = parseFecha(event.fecha);
      if (!parsedDate) return null;
      return { event, parsedDate };
    })
    .filter(Boolean)
    .sort((a, b) => a.parsedDate - b.parsedDate);

  if (sorted.length === 0) return [];

  const trips = [];
  let currentTrip = null;

  sorted.forEach(({ event, parsedDate }) => {
    if (!currentTrip) {
      currentTrip = createTripFromEvent(event, parsedDate);
      return;
    }

    const diff = parsedDate - currentTrip._endDate;
    if (diff <= msWindow) {
      currentTrip.eventos.push(event);
      currentTrip._endDate = parsedDate;
      currentTrip.fechaFin = event.fecha;
      currentTrip.monto += parseAmount(event.monto);
      const stationName = normalizeStationName(event.estacion);
      if (stationName) {
        currentTrip.estacionDestino = stationName;
      }
    } else {
      trips.push(finalizeTrip(currentTrip));
      currentTrip = createTripFromEvent(event, parsedDate);
    }
  });

  if (currentTrip) trips.push(finalizeTrip(currentTrip));

  return trips;
}

export function buildTimtMatrix(trips) {
  const originMap = new Map();
  const destinationMap = new Map();
  const matrix = new Map();

  const register = (mapRef, label) => {
    const key = normalizeKey(label);
    if (!mapRef.has(key)) mapRef.set(key, label || UNKNOWN_STATION);
    return key;
  };

  (trips || []).forEach(trip => {
    const originLabel = normalizeStationName(trip?.estacionOrigen) || UNKNOWN_STATION;
    const destLabel = normalizeStationName(trip?.estacionDestino) || UNKNOWN_STATION;
    const originKey = register(originMap, originLabel);
    const destKey = register(destinationMap, destLabel);
    if (!matrix.has(originKey)) matrix.set(originKey, new Map());
    const row = matrix.get(originKey);
    row.set(destKey, (row.get(destKey) || 0) + 1);
  });

  const origins = Array.from(originMap.values());
  const destinations = Array.from(destinationMap.values());

  const totalsByOrigin = new Map();
  const totalsByDestination = new Map();
  let grandTotal = 0;

  origins.forEach(originLabel => {
    const originKey = normalizeKey(originLabel);
    const row = matrix.get(originKey) || new Map();
    let rowTotal = 0;
    destinations.forEach(destLabel => {
      const destKey = normalizeKey(destLabel);
      const value = row.get(destKey) || 0;
      rowTotal += value;
      totalsByDestination.set(destKey, (totalsByDestination.get(destKey) || 0) + value);
    });
    totalsByOrigin.set(originKey, rowTotal);
    grandTotal += rowTotal;
  });

  return {
    origins,
    destinations,
    getCount(originLabel, destLabel) {
      const originKey = normalizeKey(originLabel);
      const destKey = normalizeKey(destLabel);
      return (matrix.get(originKey)?.get(destKey)) || 0;
    },
    getOriginTotal(label) {
      const key = normalizeKey(label);
      return totalsByOrigin.get(key) || 0;
    },
    getDestinationTotal(label) {
      const key = normalizeKey(label);
      return totalsByDestination.get(key) || 0;
    },
    getStationTotals(label) {
      const key = normalizeKey(label);
      const origin = totalsByOrigin.get(key) || 0;
      const destination = totalsByDestination.get(key) || 0;
      return {
        origin,
        destination,
        total: origin + destination,
      };
    },
    grandTotal,
  };
}

export function filterTimtEntryValidations(events, windowMinutes = TIMT_WINDOW_MINUTES) {
  const trips = groupTimtTrips(events, windowMinutes);
  const allowed = new Set();
  trips.forEach(trip => {
    if (trip.eventos && trip.eventos[0]) {
      allowed.add(trip.eventos[0]);
    }
  });
  return (events || []).filter(event => allowed.has(event));
}

export { UNKNOWN_STATION as TIMT_UNKNOWN_STATION };
