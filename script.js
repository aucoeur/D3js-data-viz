console.log('boop')

const width = 500;
const height = 200;
const padding = 2;
const barHeight = 10;

// TODO: Add axis label
function showTopTen() {

  const xScale = d3
    .scaleLinear()
    // Use d3.extent() to find the min and max
    .range([width, 0]) // The range is the output value
    .domain([
      d3.min(data, (d) => d.score),
      d3.max(data, (d) => d.score)
    ])

  const div = d3.select('.main')
    .append("div")
      .attr("id", "top10")

  // Header
  div.append("h4")
    .text("Top Ten Ranked Countries")
  const svg = div.append("svg")
    .attr("id", "topTen")
    .attr("viewBox", [0, 0, width, height])

  const g = svg.selectAll("g")
    .data(data.slice(0, 10))
    .join("g")
      .attr("id", (d) => d.country)

  // Bar
  g.append("rect")
    .attr("fill", "rgb(201, 144, 0)")
    .attr("x", 0)
    .attr("y", (_, i) => (i * (barHeight + padding)))
    // .attr("width", (d, i) => d.score * 50)
    .attr("width", (d) => {
      return width*0.8 - xScale(d.score)*1.25
    })
    .attr("height", barHeight)

  g.append("text")
    .text((d) => `${d.rank} - ${d.country} - ${d.score}`)
    .attr("x", 5)
    .attr("y", (_, i) => (i * (barHeight + padding) + barHeight / 2))
    .attr("dy", "0.35em")
    .attr("fill", 'white')
    .attr('font-size', `${barHeight-2}px`)

}

function showParallelPlot() {
  const div = d3.select('.main')
    .append("div")
      .attr("id", "parallel")

}

showTopTen()
