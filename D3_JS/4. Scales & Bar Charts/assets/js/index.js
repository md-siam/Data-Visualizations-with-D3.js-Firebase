// select the svg container forst
const svg = d3.select('.canvas')
  .append('svg')
  .attr('width', 600)
  .attr('height', 600);

// create margins and dimentions
const margin = {
  top: 20,
  right: 20,
  bottom: 100,
  left: 100,
};

// graph grouping
const graphWidth = 600 - margin.left - margin.right;
const graphHeight = 600 - margin.top - margin.bottom;

//translate is taking 2 integers, for our case it is left and top
const graph = svg.append('g')
  .attr('width', graphWidth)
  .attr('height', graphHeight)
  .attr('transform', `translate(${margin.left}, ${margin.top})`);

// axis groupping
const xAxisGroup = graph.append('g')
  .attr('transform', `translate(0, ${graphHeight})`);
const yAxisGroup = graph.append('g');


d3.json('assets/json/menu.json').then(data => {

  // scaling down the height of the bar chart
  const y = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.order)])
    .range([graphHeight, 0]);

  // const min = d3.min(data, d => d.order);
  // const max = d3.max(data, d => d.order);
  // const extent = d3.extent(data, d => d.order);
  // console.log(min, max, extent)

  // band scaling
  const x = d3.scaleBand()
    .domain(data.map(item => item.name))
    .range([0, 500])
    .paddingInner(0.2)
    .paddingOuter(0.2);


  // join the data to rects
  const rects = graph.selectAll('rect')
    .data(data)

  rects.attr('width', x.bandwidth)
    .attr('height', d => graphHeight - y(d.order))
    .attr('fill', 'orange')
    .attr('x', (d, i) => x(d.name))
    .attr('y', d => y(d.order));

  // append the enter selection to the DOM
  rects.enter()
    .append('rect')
    .attr('width', x.bandwidth)
    .attr('height', d => graphHeight - y(d.order))
    .attr('fill', 'orange')
    .attr('x', (d, i) => x(d.name))
    .attr('y', d => y(d.order));

  // create and call the axies
  const xAxis = d3.axisBottom(x);
  const yAxis = d3.axisLeft(y)
    .ticks(3)
    .tickFormat(d => d + ' orders');

  xAxisGroup.call(xAxis);
  yAxisGroup.call(yAxis);

  // making all x-axis lebel itallic
  xAxisGroup.selectAll('text')
    .attr('transform', 'rotate(-40)')
    .attr('text-anchor', 'end')
    .attr('fill', 'orange');

})