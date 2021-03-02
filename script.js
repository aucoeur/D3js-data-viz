// Working with the top ten only
let data10 = data.slice(0, 10)
const numItems = 10;

const margin = ({top: 20, right: 30, bottom: 30, left: 20})
const padding = 2;
const barHeight = 10;
const width = 500;
let height = numItems * (barHeight + padding)+ margin.bottom;

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

  // Janky way for solid stroke x axis bar.. because vertical ticks stroke also janky set to dash lol
  d3.select("#topTen")
    .append("g")
      .call(xAxis)

  // Bar Groups
  d3.select("#topTen")
    .append("g")
      .attr("id", "bars")

  const g = svg.select("#bars")
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

  // Probably should have set Y axis with rank.. T_T
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

  const color = d3.scaleOrdinal()
    .domain(data10, (d) => d.country)
    .range(["#9e0142","#d53e4f","#f46d43","#fdae61","#fee08b","#e6f598","#abdda4","#66c2a5","#3288bd","#5e4fa2"])

  const dimensions = ["score", "gdp", "support", "health", "freedom", "generosity", "corruption"]

  // Build linear scale for each dimension, store in y
  const y = {}
  dimensions.forEach((_, i) => {
    key = dimensions[i]
    // console.log(key)
    y[key] = d3.scaleLinear()
      .domain(
        d3.extent(data10, d => d[key] )
      )
      .range([height-margin.bottom, margin.bottom])
    })

  // Build x scale
  const x = d3.scalePoint()
    .range([margin.left, width-margin.right])
    .domain(dimensions)
    // .padding(2)

  function drawPath(d) {
    return d3.line()(
      dimensions.map(p => {
          return [x(p), y[p](d[p])] })
    )}

  // function focusColor(d) {

  //   // d3.select(`#paths>g:not('#pplot-${selected}')`)
  //   d3.selectAll(`.line ${selected}'`)
  //     .transition()
  //       .duration(200)
  //       .style("stroke", "lightgrey")
  //       .style("opacity", "0.2")

  //   d3.selectAll(`.${d.selected}`)
  //     .transition()
  //       .duration(200)
  //       .style("stroke", (d) => color(d.selected))
  //       .style("opacity", "1")
  // }


  // function resetColor(d) {
  //   d3.selectAll(".line")
  //     .transition()
  //       .duration(200)
  //       .delay(500)
  //     .style("stroke", (d) => {
  //       return color(d.country) })
  //     .style("opacity", "1")
  // }


  const div = d3.select('.main')
    .append("div")
      .attr("id", "parallel")

  const svg = div.append("svg")
    .attr("id", "parallelPlot")
    .attr("viewBox", [0, 0, width, height*2])

  d3.select("#parallelPlot")
    .append("g")
      .attr("id", "paths")

const tooltip = d3.select("#tooltip")
    .append("div")
    .style("opacity", 0)
    .attr("class", "tooltip")
    .style("background-color", "white")
    .style("border", "solid")
    .style("border-width", "1px")
    .style("border-radius", "5px")
    .style("padding", "10px")

  // Draw lines!!
  const plotLines = svg.select("#paths")
    .selectAll("g")
    .data(data10)
    .join("g")
      .attr("id", d => `${d.rank}${d.country}`)
      .append("path")
        .attr("class", d => `line country ${d.country}`)
        .attr("d", drawPath)
        .attr("fill", "None")
        .attr("stroke", (d) => {
          return color(d.country)
          })
        .attr("stroke-width", 2)

        .on("mouseover", (data10) => {
          tooltip
            .style("opacity", 1)
            .text(d => `${d.country}`)
          // return focusColor(data10)
          })
        .on("mouseout", (data10) => {
           tooltip.style("opacity", 0)
          // return resetColor(data10)
          })

 // Axis Groups
  d3.select("#parallelPlot")
    .append("g")
      .attr("id", "labels")

  const g = svg.select("#labels")
    g.selectAll("g")
      .data(dimensions)
      .join("g")
        .attr("id", (_, i) => dimensions[i])
        .attr("transform", (d, i) => {
          return `translate(${margin.left+i}, 0)`
        })
        // move margin
        .call((d) => d3.axisLeft())
      // Add axis title
      .append("text")
        .style("text-anchor", "middle")
        .attr("x", (d, i) => {
          // console.log(width / dimensions.length)
          return i * (width / dimensions.length)
        })
        .attr("y", margin.top)
        .attr('font-size', `${barHeight-2}px`)
        .text(d => d)
          .style("fill", "white")
}

showTopTen()
showParallelPlot()
