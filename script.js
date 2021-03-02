// Working with the top ten only
let data10 = data.slice(0, 10)
const numItems = 10;

const margin = ({top: 20, right: 100, bottom: 30, left: 40})
const padding = 2;
const barHeight = 10;
const width = 500;
const height = numItems * (barHeight + padding)+ margin.bottom;

const x = d3.scaleLinear()
  .domain([0, 10])
  .range([margin.left, width - margin.right])


const xAxis = g => g
  .attr("transform", `translate(0, ${height-margin.bottom})`)
  .call(d3.axisBottom(x))

// const y = d3.scaleLinear()
//   .domain([0, 1])
//   .range([height - margin.bottom, margin.top])

// const yAxis = g => g
//   .attr("transform", `translate(${margin.left},0)`)
//   .call(d3.axisLeft(y))

// TODO: Add axis label
function showTopTen() {

  const xScale = d3
    .scaleLinear()
    .range([margin.left, width-margin.right]) // The range is the output value
    .domain(
      [0,numItems+2] // accounts for starting the axis at 0
      // d3.extent(data10, (d) => d.score)
    )

  const xAxisLines = d3.axisBottom(x)
    .tickSize(-(height - margin.top))
    .tickFormat('')
    .ticks()

  const div = d3.select('.main')
    .append("div")
      .attr("id", "top10")

  // Header
  div.append("h4")
    .text("Top Ten Ranked Countries")

  const svg = div.append("svg")
    .attr("id", "topTen")
    .attr("viewBox", [0, 0, width, height])

  // Axis & Axis Lines
  d3.select("#topTen")
    .append("g")
      .attr("class", "axis")
      .attr("stroke-width", ".5")
      .attr("stroke-dasharray", "1,1")
      .attr("transform", `translate(0, ${height-margin.bottom})`)
      .call(xAxisLines)

  d3.select("#topTen")
    .append("g")
      .call(xAxis)

  // Bar Groups
  d3.select("#topTen")
    .append("g")
      .attr("id", "bar")

  const g = svg.select("#bar")
    .selectAll("g")
    .data(data10)
    .join("g")
      .attr("id", (d) => d.country)
      .attr("transform", `translate(${margin.left}, 0)`)

  // Bar
  g.append("rect")
    .attr("fill", "rgb(201, 144, 0)")
    .attr("x", 0)
    .attr("y", (_, i) => (i * (barHeight + padding)))
    // .attr("width", (d, i) => d.score * 50)
    .attr("width", (d, i) => {
      return xScale(d.score)
    })
    .attr("height", barHeight)

  g.append("text")
    .text((d) => `${d.rank} - ${d.country} - ${d.score}`)
    .attr("x", 5)
    .attr("y", (_, i) => {
        return (i * (barHeight + padding) + barHeight / 2)
      })
    .attr("dy", "0.35em")
    .attr("fill", 'white')
    .attr('font-size', `${barHeight-2}px`)

}

function showParallelPlot() {
  const div = d3.select('.main')
    .append("div")
      .attr("id", "parallel")

  const svg = div.append("svg")
    .attr("id", "parallelPlot")
    .attr("viewBox", [0, 0, width, height])

  const g = svg.selectAll("g")
    .data(data10)
}

showTopTen()
