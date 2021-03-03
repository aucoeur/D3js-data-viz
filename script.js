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

function sortByProperty(data, property) {
  return data
    .sort((a, b) => {
      if (a[property] > b[property] || b[property] == undefined ) {
        return 1;
      } else if (a[property] < b[property] || a[property] == undefined) {
        return -1;
      }
      return 0;
    })
}

function showTopTen() {
  const xAxisLines = d3.axisBottom(x)
      .tickSize(-(height - margin.top))
      .tickFormat('')
      .ticks()

  const xScale = d3
    .scaleLinear()
    .range([margin.left, width-margin.right]) // The range is the output value
    .domain(
      [0,numItems+2] // accounts for starting the axis at 0
      // d3.extent(data10, (d) => d.score)
    )

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
      .attr("class", (d) => d.country)
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

  // Create array to control order of dimensions
  const dimensions = ["score", "gdp", "support", "health", "freedom", "generosity", "corruption"]

  // Build linear scale for each dimension, store in y
  const y = {}
  dimensions.forEach((_, i) => {
    key = dimensions[i]
    y[key] = d3.scaleLinear()
      .domain( d3.extent(data10, d => d[key]) )
      .range([height-margin.top, margin.bottom])
    })

  // Build x scale
  const x = d3.scalePoint()
    .range([margin.left, width-margin.right])
    .domain(dimensions)

  const xAxisLines = d3.axisBottom(x)
      .tickSize(-(height - margin.top))
      .tickFormat('')
      .ticks(7)

  const scores = data10.map((d) => d.score)

  const yAxis = d3.scalePoint()
    .domain(d3.extent(scores))
    .range([height-margin.top, margin.bottom])

  // Ordinal scales do not use scale.ticks() because doesn't know which to prioritize for display & relies domain for ticks.. can set with axis.tickValues
  const yAxisLines = d3.axisLeft(yAxis)
    // .ticks()

  // Function to draw lines across dimensions
  function drawPath(d) {
    return d3.line()(
      dimensions.map(p => {
          return [x(p), y[p](d[p])] })
    )}

  // append div for this graph to main
  const div = d3.select('.main')
    .append("div")
      .attr("id", "parallel")

  // Add Header & description
  div.append("h4")
    .text("Parallel Plot Across Categories")
  div.append("small")
    .text("Hover over for details")

  // add svg to this div
  const svg = div.append("svg")
    .attr("id", "parallelPlot")
    .attr("viewBox", [0, 0, width, height*2])

  // Axis & Axis Lines
  d3.select("#parallelPlot")
    .append("g")
      .attr("id", "verticalAxis")
      .attr("class", "axis")
      .attr("stroke-width", ".5")
      .attr("stroke-dasharray", "1,1")
      .attr("transform", `translate(0, ${height})`)
      .call(xAxisLines)

 d3.select("#parallelPlot")
    .append("g")
      .attr("id", "horizontalAxis")
      .attr("class", "axis")
      .attr("stroke-width", "0")
      .attr("transform", `translate(${margin.right-4})`)
      .call(yAxisLines)
        .attr("font-size", "6")

  // Group for all paths
  d3.select("#parallelPlot")
    .append("g")
      .attr("id", "paths")

  // Add tooltip (outside svg)
  const tooltip = d3.select('#parallel')
    .append("div")
      .attr("class", "tooltip")
	      .style("position", "absolute")
        .style("display", "none")

  // Draw path!
  d3.select('#paths')
    .selectAll("g")
    .data(data10)
    .join("g")
      .attr("class", d => `${d.country}`)
      .attr("transform", `translate(0.5, 0)`)
      .append("path")
        .attr("id", d => `${d.country}`)
        .attr("class", `line`)
        .attr("d", drawPath)
        .attr("fill", "None")
        .attr("stroke", (d) => {
          return color(d.country)
          })
        .attr("stroke-width", 2)

        .on("mousemove", onMouseOn)
        .on("mouseout", onMouseOut)

  function onMouseOn(event, d) {
    // TODO: add tooltip that sorts rank per dimension when hover over dimension axis

    // Country tooltip
    tooltip.style("left", event.pageX + 18 + "px")
      .style("top", event.pageY + 18 + "px")
      .style("display", "block")
      .html(
        `<strong>#${d.rank}: ${d.country} </strong><br />
        Score: ${d.score}<br />
        GDP: ${d.gdp} <br />
        Support: ${d.support} <br />
        Health: ${d.health} <br />
        Freedom: ${d.freedom} <br />
        Generosity: ${d.generosity} <br />
        Corruption: ${d.corruption} <br />
        `
        );

    // Cursor change on target
    d3.select(event.target)
    .style("cursor", "crosshair")

    d3.selectAll(`#parallelPlot > #paths > g > path`)
      .data(data10)
      .transition().duration(250)
      .attr("stroke", d => event.target.id === d.country ? color(d.country) : "lightgrey")
      .attr("opacity", d => event.target.id === d.country ? 1 : 0.35)
      .attr('stroke-width', d => event.target.id === d.country ? 3 : 2 )
      // .attr("mix-blend-mode", d => event.target.id === d.country ? "normal" : "exclusion")
  }

  function onMouseOut(event){
    // Hide tooltip on mouse out
	  tooltip.style("display", "none"); // Hide toolTip

    // Set cursor back to default
    d3.select(event.target)
      .style("cursor", "default")

    // Reset styles to default
	  d3.selectAll(`#parallelPlot > #paths > g > path`)
      .data(data10)
      .transition().duration(250)
      .attr("stroke", (d) => {
          return color(d.country)
          })
      .attr("opacity", 1)
      .attr('stroke-width', 2)
  }

 // Axis Groups
  d3.select("#parallelPlot")
    .append("g")
      .attr("id", "labels")

  // top labels
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
          return i * ((width+margin.left) / dimensions.length)
        })
        .attr("y", margin.top-5)
        .attr('font-size', `${barHeight-2}px`)
        .text(d => d)
          .style("fill", "white")
}

showTopTen()
showParallelPlot()
