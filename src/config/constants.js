export const prod = window.location.hostname === 'localhost' ? 0 : 1;

export const colorPalette = {
  STC: 'rgba(254, 80, 0, 0.8)',
  ECOBICI: 'rgba(0, 154, 68, 0.8)',
  'METROBÚS': 'rgba(200, 16, 46, 0.8)',
  RUTA: 'rgba(155, 38, 182, 0.8)',
  CABLEBUS: 'rgba(78, 195, 224, 0.8)',
  CETRAM: 'rgba(240, 78, 152, 0.8)',
  STE: 'rgba(0, 87, 184, 0.8)',
  RTP: 'rgba(120, 190, 32, 0.8)',
  Mañana: 'rgba(75, 192, 192, 0.8)',
  Tarde: 'rgba(153, 102, 255, 0.8)',
  Noche: 'rgba(22, 192, 67, 0.8)'
};

export const metroLineColors = {
  '1': '#F04E98',
  '2': '#005EB8',
  '3': '#AF9800',
  '4': '#6BBBAE',
  '5': '#FFD100',
  '6': '#DA291C',
  '7': '#E87722',
  '8': '#009A44',
  '9': '#512F2E',
  A: '#981D97',
  B: '#B1B3B3',
  '12': '#B0A32A'
};

export const sistemas = {
  STC: 'Metro',
  'METROBÚS': 'Metrobús',
  ECOBICI: 'Ecobici',
  RUTA: 'Ruta',
  CABLEBUS: 'Cablebús',
  CETRAM: 'Cetram',
  STE: 'STE',
  RTP: 'RTP'
};

export const selectors = {
  dropZone: '#dropZone',
  fileInput: '#fileInput',
  loadingMessage: '#loadingMessage',
  warningContainer: '#warningContainer',
  resultsTable: '#resultsTable',
  showInconsistentCheckbox: '#showInconsistentCheckbox'
};

export const TIMT_WINDOW_MINUTES = 120;
