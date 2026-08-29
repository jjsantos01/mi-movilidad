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

function createIncompleteEntryTrip(entry) {
  const estacionOrigen = normalizeStationName(entry.event.estacion) || UNKNOWN_STATION;
  return {
    estacion: estacionOrigen,
    estacionOrigen,
    estacionDestino: UNKNOWN_STATION,
    fecha: entry.event.fecha,
    fechaFin: entry.event.fecha,
    monto: parseAmount(entry.event.monto),
    duracionMinutos: 0,
    eventos: [entry.event],
  };
}

export function groupTimtTrips(events, windowMinutes = TIMT_WINDOW_MINUTES) {
  const maxMs = windowMinutes * 60 * 1000;
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
  let pendingEntry = null;

  for (const { event, parsedDate } of sorted) {
    const op = String(event.operacion || '').trim().toUpperCase();
    const isExplicitIngreso = op.startsWith('06') || op.includes('INGRESO');
    const isExplicitSalida = op.startsWith('0B') || op.includes('SALIDA');

    if (isExplicitIngreso) {
      if (pendingEntry) {
        trips.push(createIncompleteEntryTrip(pendingEntry));
      }
      pendingEntry = { event, parsedDate, isExplicit: true };
    } else if (isExplicitSalida) {
      if (pendingEntry && (parsedDate - pendingEntry.parsedDate <= maxMs)) {
        const durationMs = parsedDate - pendingEntry.parsedDate;
        const duracionMinutos = durationMs >= 0 ? Math.round(durationMs / 60000) : 0;
        const estacionOrigen = normalizeStationName(pendingEntry.event.estacion) || UNKNOWN_STATION;
        const estacionDestino = normalizeStationName(event.estacion) || UNKNOWN_STATION;
        const monto = Number((parseAmount(pendingEntry.event.monto) + parseAmount(event.monto)).toFixed(2));

        trips.push({
          estacion: estacionOrigen,
          estacionOrigen,
          estacionDestino,
          fecha: pendingEntry.event.fecha,
          fechaFin: event.fecha,
          monto,
          duracionMinutos,
          eventos: [pendingEntry.event, event],
        });
        pendingEntry = null;
      } else {
        if (pendingEntry) {
          trips.push(createIncompleteEntryTrip(pendingEntry));
          pendingEntry = null;
        }
        const estacionDestino = normalizeStationName(event.estacion) || UNKNOWN_STATION;
        trips.push({
          estacion: estacionDestino,
          estacionOrigen: UNKNOWN_STATION,
          estacionDestino,
          fecha: event.fecha,
          fechaFin: event.fecha,
          monto: parseAmount(event.monto),
          duracionMinutos: 0,
          eventos: [event],
        });
      }
    } else {
      // Validación genérica (ej. '03-VALIDACION' de 2025 o tarifa plana)
      const currentStation = normalizeStationName(event.estacion);

      // Si hay una entrada previa '03' de estación distinta en <= maxMs, emparejar como viaje (compatibilidad 2025)
      if (pendingEntry && !pendingEntry.isExplicit && (parsedDate - pendingEntry.parsedDate <= maxMs)) {
        const prevStation = normalizeStationName(pendingEntry.event.estacion);
        if (currentStation && prevStation && currentStation !== prevStation) {
          const durationMs = parsedDate - pendingEntry.parsedDate;
          const duracionMinutos = durationMs >= 0 ? Math.round(durationMs / 60000) : 0;
          const monto = Number((parseAmount(pendingEntry.event.monto) + parseAmount(event.monto)).toFixed(2));
          trips.push({
            estacion: prevStation,
            estacionOrigen: prevStation,
            estacionDestino: currentStation,
            fecha: pendingEntry.event.fecha,
            fechaFin: event.fecha,
            monto,
            duracionMinutos,
            eventos: [pendingEntry.event, event],
          });
          pendingEntry = null;
          continue;
        }
      }

      if (pendingEntry) {
        trips.push(createIncompleteEntryTrip(pendingEntry));
        pendingEntry = null;
      }

      pendingEntry = { event, parsedDate, isExplicit: false };
    }
  }

  if (pendingEntry) {
    trips.push(createIncompleteEntryTrip(pendingEntry));
  }

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
