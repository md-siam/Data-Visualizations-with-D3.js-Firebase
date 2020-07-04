// select svg container first 
const svg = d3.select('svg');

d3.json('assets/json/planets.json').then(data => {

    // joining the data
    const circs = svg.selectAll('circle')
        .data(data);

    // add attrs to circs already in DOM
    circs.attr('cy', 200)
        .attr('cx', d => d.distance)
        .attr('r', d => d.radius)
        .attr('fill', d => d.fill);

    // append the enter selection to the DOM
    circs.enter()
        .append('circle')
        .attr('cy', 200)
        .attr('cx', d => d.distance)
        .attr('r', d => d.radius)
        .attr('fill', d => d.fill);

})