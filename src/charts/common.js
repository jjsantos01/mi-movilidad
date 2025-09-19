import { colorPalette } from '../config/constants.js';

export function getColorForOrganismo(label) {
  return colorPalette[label] || '#888';
}

export function mountChart(key, elementId, options, register) {
  const el = document.getElementById(elementId);
  if (!el) return null;
  const chart = new ApexCharts(el, options);
  // Register first to ensure any previous chart is destroyed before rendering new one
  if (register) register(key, chart);
  chart.render();
  return chart;
}
