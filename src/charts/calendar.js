// Mapa de calor diario estilo GitHub (último año)
// Requiere D3 cargado globalmente (via CDN en index.html)

function parseFechaToDate(value) {
  if (!value) return null;
  const [datePart] = String(value).split(' ');
  // Los datos vienen como DD-MM-YYYY
  const parts = datePart.split('-');
  if (parts.length === 3) {
    const [dd, mm, yyyy] = parts;
    return new Date(`${yyyy}-${mm}-${dd}T00:00:00`);
  }
  const d = new Date(datePart);
  return isNaN(d) ? null : d;
}

export function createCalendarHeatmap(viajes) {
  const container = d3.select('#calendarHeatmap');
  if (container.empty()) return;
  container.selectAll('*').remove();

  const data = (viajes || []).map(v => ({ d: parseFechaToDate(v.fecha) }))
    .filter(v => v.d instanceof Date && !isNaN(v.d));
  if (data.length === 0) return;

  // Año objetivo: del último viaje
  const maxDate = d3.max(data, d => d.d);
  const year = maxDate.getFullYear();
  const yearStart = new Date(year, 0, 1);
  const yearEnd = new Date(year, 11, 31);

  // Agregar días de borde para cubrir semanas completas (domingo a sábado)
  const start = new Date(yearStart);
  while (start.getDay() !== 0) start.setDate(start.getDate() - 1); // domingo previo
  const end = new Date(yearEnd);
  while (end.getDay() !== 6) end.setDate(end.getDate() + 1); // sábado siguiente

  // Conteo por día (YYYY-MM-DD)
  const key = d => d.toISOString().slice(0, 10);
  const counts = new Map();
  for (const { d } of data) {
    if (d.getFullYear() !== year) continue;
    const k = key(d);
    counts.set(k, (counts.get(k) || 0) + 1);
  }

  const days = d3.timeDay.range(start, d3.timeDay.offset(end, 1));
  const weeks = d3.timeWeek.count(start, end) + 1;

  // Dimensiones
  const cell = 16; // tamaño celda (más grande)
  const gap = 2;
  const titleSpace = 22; // espacio para el título
  const monthSpace = 18; // espacio para etiquetas de mes (abajo)
  const leftSpace = 28; // espacio para etiquetas de días
  const w = leftSpace + (weeks * (cell + gap) + gap);
  const gridHeight = (7 * (cell + gap)) + gap;
  const h = titleSpace + gridHeight + monthSpace;

  const svg = container.append('svg')
    .attr('viewBox', `0 0 ${w} ${h}`)
    .attr('width', '100%')
    .attr('height', h)
    .style('max-width', `${Math.max(700, w)}px`)
    .style('display', 'block')
    .style('margin', '0 auto');

  // Título
  svg.append('text')
    .attr('x', w / 2)
    .attr('y', 14)
    .attr('text-anchor', 'middle')
    .attr('font-size', '16px')
    .attr('font-weight', '700')
    .attr('fill', '#333')
    .text('Tus viajes en el año');

  const g = svg.append('g').attr('transform', `translate(${leftSpace + gap},${titleSpace + gap})`);

  const maxCount = d3.max(Array.from(counts.values())) || 0;
  const color = d3.scaleSequential()
    .domain([0, Math.max(1, maxCount)])
    .interpolator(d3.interpolateGreens);

  // Tooltip sencillo
  const tooltip = d3.select('body').append('div')
    .attr('class', 'calendar-tooltip')
    .style('position', 'absolute')
    .style('background', 'white')
    .style('border', '1px solid #999')
    .style('padding', '6px 8px')
    .style('font-size', '12px')
    .style('pointer-events', 'none')
    .style('opacity', 0);

  function formatDate(d) {
    const dd = String(d.getDate()).padStart(2, '0');
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const yyyy = d.getFullYear();
    return `${dd}/${mm}/${yyyy}`;
  }
  function formatDayName(d) {
    const dayNames = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
    return dayNames[d.getDay()];
  }

  g.selectAll('rect.day')
    .data(days)
    .enter()
    .append('rect')
    .attr('class', 'day')
    .attr('width', cell)
    .attr('height', cell)
    .attr('rx', 2)
    .attr('ry', 2)
    .attr('x', d => d3.timeWeek.count(start, d) * (cell + gap))
    .attr('y', d => d.getDay() * (cell + gap))
    .attr('fill', d => color(counts.get(key(d)) || 0))
    .on('mouseenter', function (event, d) {
      const c = counts.get(key(d)) || 0;
      tooltip.style('opacity', 0.95)
        .html(`${c} viajes<br>${formatDate(d)} (${formatDayName(d)})`);
    })
    .on('mousemove', function (event) {
      tooltip.style('left', (event.pageX + 12) + 'px')
        .style('top', (event.pageY - 28) + 'px');
    })
    .on('mouseleave', function () {
      tooltip.style('opacity', 0);
    });

  // Etiquetas de meses (encima de la semana donde inicia un mes)
  const monthStarts = d3.timeMonth.range(new Date(year, 0, 1), new Date(year + 1, 0, 1));
  svg.append('g').attr('transform', `translate(${leftSpace + gap},${titleSpace + gridHeight})`)
     .selectAll('text')
     .data(monthStarts)
     .enter()
     .append('text')
     .attr('x', d => d3.timeWeek.count(start, d) * (cell + gap))
     .attr('y', 14)
     .attr('font-size', '12px')
     .attr('fill', '#555')
     .text(d => d.toLocaleDateString('es-MX', { month: 'short' }))
     .attr('text-anchor', 'start');

  // Etiquetas de días (estilo GitHub: Lun, Mié, Vie)
  const dayNames = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
  g.append('g')
    .attr('class', 'weekday-labels')
    .selectAll('text')
    .data(d3.range(7))
    .enter()
    .append('text')
    .attr('x', -6)
    .attr('y', d => d * (cell + gap) + cell - 2)
    .attr('text-anchor', 'end')
    .attr('font-size', '11px')
    .attr('fill', '#666')
    .text(d => dayNames[d]);
}
