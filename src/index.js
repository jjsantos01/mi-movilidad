import { state, setRawData, setViajes, setEcobiciViajes, registerChart } from './state.js';
import { setupCollapsibleSections, showAllSections, updateSection } from './ui/sections.js';
import { attachGlobalModalHandlers } from './ui/modal.js';
import { bindDropZone } from './io/excel.js';
import { processViajes, createMetroObject, populateOrganismoSelector } from './data/normalize.js';
import { getTotalRecargas, getTotalViajes } from './data/metrics.js';
import { detectInconsistencias, renderWarning } from './data/inconsistencias.js';
import { createPieChart } from './charts/pie.js';
import { createLineChart } from './charts/line.js';
import { createStackedBarChart } from './charts/stacked-by-day.js';
import { createBarChartByMomentoDia } from './charts/by-momento.js';
import { crearGraficoViajesPorHoraYOrganismo } from './charts/by-hour.js';
import { createHeatmap } from './charts/heatmap.js';
import { createSaldoFinalChart } from './charts/saldo-final.js';
import { createTop10MetroLinesChart, createTop10MetroStationsChart } from './charts/metro-top10.js';
import { createMetroMap } from './maps/metro.js';
import { createEcobiciMap } from './maps/ecobici.js';
import { matchInicioFinViaje, getEcobiciStats } from './data/ecobici.js';
import { displayResults } from './ui/table.js';
import { bindDownloads } from './ui/downloads.js';

function populateOrganismoSelectorDOM(viajes) {
  const selector = document.getElementById('organismoSelector');
  if (!selector) return;
  selector.innerHTML = '';
  for (const opt of populateOrganismoSelector(viajes)) {
    const option = document.createElement('option');
    option.value = opt; option.text = opt;
    selector.add(option);
  }
}

function renderAll() {
  const viajes = state.viajes;
  // Stats
  getTotalViajes(viajes);
  getTotalRecargas(state.rawData);
  // Charts
  createPieChart(viajes);
  createLineChart(viajes);
  createStackedBarChart(viajes);
  crearGraficoViajesPorHoraYOrganismo(viajes);
  createBarChartByMomentoDia(viajes);
  populateOrganismoSelectorDOM(viajes);
  createHeatmap(viajes);
  const selector = document.getElementById('organismoSelector');
  if (selector && !selector._bound) {
    selector.addEventListener('change', function () {
      const selectedOrganismo = this.value;
      createHeatmap(viajes, selectedOrganismo);
    });
    selector._bound = true;
  }
  createSaldoFinalChart(state.rawData);

  // Inconsistencias
  const inconsistencias = detectInconsistencias(state.rawData);
  if (inconsistencias && inconsistencias.length > 0) renderWarning(inconsistencias); else { const wc = document.getElementById('warningContainer'); if (wc) wc.innerHTML = ''; }

  // Sections
  const metro = createMetroObject(viajes, 'STC');
  const metrobus = createMetroObject(viajes, 'METROBÚS');
  const ecobici = state.rawData.filter(d => d.organismo === 'ECOBICI');
  const inicioViaje = ecobici.filter(d => d.operacion === '70-INICIO DE VIAJE');
  const finViaje = ecobici.filter(d => d.operacion === '71-FIN DE VIAJE');
  setEcobiciViajes(matchInicioFinViaje(inicioViaje, finViaje));

  updateSection('metroSection', metro, () => {
    // Stats + charts + map for Metro
    createTop10MetroLinesChart(metro, 'STC');
    createTop10MetroStationsChart(metro, 'STC');
    createMetroMap(metro, 'STC');
  });

  updateSection('metrobusSection', metrobus, () => {
    createTop10MetroLinesChart(metrobus, 'METROBÚS');
    createTop10MetroStationsChart(metrobus, 'METROBÚS');
    createMetroMap(metrobus, 'METROBÚS');
  });

  updateSection('ecobiciSection', ecobici, () => {
    getEcobiciStats(inicioViaje, finViaje);
    import('./charts/ecobici-heatmap.js').then(({ createEcobiciHeatmap }) => {
      createEcobiciHeatmap(inicioViaje, finViaje, 'viajes');
      createEcobiciHeatmap(inicioViaje, finViaje, 'tiempo');
    });
    createEcobiciMap(inicioViaje, finViaje);
    // animation.js uses window.ecobiciViajes, state setter already synced it
  });

  displayResults(state.rawData);
  showAllSections();
}

function onDataLoaded(rows) {
  setRawData(rows);
  const viajes = processViajes(rows);
  setViajes(viajes);
  renderAll();
}

document.addEventListener('DOMContentLoaded', () => {
  window.mapInstances = state.mapInstances; // backwards compatibility for some code paths
  setupCollapsibleSections();
  attachGlobalModalHandlers();
  bindDropZone(onDataLoaded);
  bindDownloads(() => state.rawData);
});

