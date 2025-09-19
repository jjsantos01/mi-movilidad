import { metroLineColors } from '../config/constants.js';
import { mountChart } from './common.js';
import { registerChart } from '../state.js';

function generateRandomColor() {
  return '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
}

export function createTop10MetroLinesChart(viajes, organismo = 'STC') {
  const lineaCounts = viajes.reduce((acc, v) => { if (v.linea) acc[v.linea] = (acc[v.linea] || 0) + 1; return acc; }, {});
  const top10Lines = Object.entries(lineaCounts).sort((a,b) => b[1]-a[1]).slice(0,10);
  const labels = top10Lines.map(([linea]) => linea);
  const data = top10Lines.map(([, count]) => count);
  const colors = labels.map(linea => metroLineColors[linea] || generateRandomColor());
  const formattedData = labels.map((label, idx) => ({ x: label, y: data[idx], fillColor: colors[idx] }));
  const elementId = organismo === 'STC' ? 'top10MetroLinesChart' : 'top10MetrobusLinesChart';

  const options = {
    series: [{ name: 'Viajes', data: formattedData }],
    chart: { type: 'bar', height: 350 },
    plotOptions: { bar: { distributed: true } },
    dataLabels: { enabled: true },
    legend: { show: false },
    title: { text: 'Top 10 líneas por viajes', align: 'center' },
    xaxis: { categories: labels },
  };
  return mountChart(`top10-lines-${organismo}`, elementId, options, registerChart);
}

export function createTop10MetroStationsChart(viajes, organismo = 'STC') {
  const stationCounts = viajes.reduce((acc, v) => { if (v.estacion) acc[v.estacion] = (acc[v.estacion] || 0) + 1; return acc; }, {});
  const top10Stations = Object.entries(stationCounts).sort((a,b) => b[1]-a[1]).slice(0,10);
  const labels = top10Stations.map(([station]) => station);
  const data = top10Stations.map(([, count]) => count);
  const formattedData = labels.map((label, idx) => ({ x: label, y: data[idx] }));
  const elementId = organismo === 'STC' ? 'top10MetroStationsChart' : 'top10MetrobusStationsChart';
  const options = {
    series: [{ name: 'Viajes', data: formattedData }],
    chart: { type: 'bar', height: 350 },
    dataLabels: { enabled: true },
    legend: { show: false },
    title: { text: 'Top 10 estaciones por viajes', align: 'center' },
    xaxis: { categories: labels, labels: { rotate: -45 } },
  };
  return mountChart(`top10-stations-${organismo}`, elementId, options, registerChart);
}

