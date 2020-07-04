// select the svg container forst
const svg = d3
  .select(".canvas")
  .append("svg")
  .attr("width", 600)
  .attr("height", 600);

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
const graph = svg
  .append("g")
  .attr("width", graphWidth)
  .attr("height", graphHeight)
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// axis groupping
const xAxisGroup = graph
  .append("g")
  .attr("transform", `translate(0, ${graphHeight})`);

const yAxisGroup = graph.append("g");

// scales
const y = d3.scaleLinear().range([graphHeight, 0]);
const x = d3.scaleBand().range([0, 500]).paddingInner(0.2).paddingOuter(0.2);

// create the axies
const xAxis = d3.axisBottom(x);
const yAxis = d3
  .axisLeft(y)
  .ticks(3)
  .tickFormat((d) => d + " orders");

// update x-axis text
xAxisGroup
  .selectAll("text")
  .attr("transform", "rotate(-40)")
  .attr("text-anchor", "end")
  .attr("fill", "orange");

//update function
const update = (data) => {
  // 1. update scales (domains) if they rely on our data
  y.domain([0, d3.max(data, (d) => d.order)]);
  x.domain(data.map((item) => item.name));

  // 2. join undated data to elements
  const rects = graph.selectAll("rect").data(data);

  // 3. remove unwanted (if any) shapes using the exit selection
  rects.exit().remove();

  // 4. update the enter selection to the DOM
  rects
    .attr("width", x.bandwidth)
    .attr("height", (d) => graphHeight - y(d.order))
    .attr("fill", "orange")
    .attr("x", (d, i) => x(d.name))
    .attr("y", (d) => y(d.order));

  // 5. append the enter selection to the DOM
  rects
    .enter()
    .append("rect")
    .attr("width", x.bandwidth)
    .attr("height", (d) => graphHeight - y(d.order))
    .attr("fill", "orange")
    .attr("x", (d, i) => x(d.name))
    .attr("y", (d) => y(d.order));

  // call axes
  xAxisGroup.call(xAxis);
  yAxisGroup.call(yAxis);
};

//storing data into this data array
var data = [];

// fetching data from the Firestore and displaying it
db.collection("dishes").onSnapshot((res) => {
  res.docChanges().forEach((change) => {
    const doc = { ...change.doc.data(), id: change.doc.id };

    switch (change.type) {
      case "added":
        data.push(doc);
        break;
      case "modified":
        const index = data.findIndex((item) => item.id == doc.id);
        data[index] = doc;
        break;
      case "removed":
        data = data.filter((item) => item.id !== doc.id);
        break;
      default:
        break;
    }
  });

  update(data);
});
