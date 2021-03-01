console.log()

const width = 500;
const height = 600;
const padding = 5;
const barHeight = 15;

const yScale = d3
  .scaleLinear()
    // Use d3.extent() to find the min and max
    .range([width, 0]) // The range is the output value
    .domain([
      d3.min(data, (d) => d.score),
      d3.max(data, (d) => d.score)
    ])
      // d3.max(data, (d) => { return d.score })])


const countries = d3.select('.main')
  .append("div")
    .attr("id", "countries")

const svg = countries
  .append("svg")
    .attr("viewBox", [0,0, width, height])

const g = svg.selectAll("g")
    .attr("id", "country")
  .data(data)
  .join("g")

const bar = g.append("rect")
  // .selectAll("rect")
  // .join("rect")
    .attr("fill", "red")
    .attr("x", 0)
    .attr("y", (_, i) => (i * (barHeight + padding)) )
    // .attr("width", (d, i) => d.score * 50)
    .attr("width", (d) => {return width - yScale(d.score)})
    .attr("height", barHeight)


const text = g.append("text")
    .text((d) => `${d.country} - Score: ${d.score}`)
      .attr("x", 5)
      .attr("y", (_, i) => (i * (barHeight + padding) + barHeight/2))
      .attr("dy", "0.35em")
      .attr("fill", 'white')
      .attr('font-size', '15px')
