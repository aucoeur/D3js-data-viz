function showTopTen() {
  // Scale the data
  const x = d3.scaleLinear()
    .domain([0, numItems])
    .range([margin.left, width - margin.right])

  const xAxis = (g) => {
    g.attr("transform", `translate(0, ${height-margin.bottom})`)
    .call(d3.axisBottom(x))
  }

  const xAxisLines = d3.axisBottom(x)
    .tickSize(-(height - margin.top))
    .tickFormat('')
    .ticks()

  // Scale for vertical axis lines
  const xScale = d3
    .scaleLinear()
    .range([margin.left, width - margin.right])
    .domain(
      [0,numItems+1] // accounts for starting the axis at 0
    )

  // Insert parent div
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
      .attr("class", 'bar')
      .attr("transform", `translate(${margin.left}, 0)`)


  // Bar
  g.append("rect")
    .attr("id", (d) => `bar-${d.country}`)
    .attr("fill", "rgb(201, 144, 0)")
    .attr("x", 0)
    .attr("y", (_, i) => (i * (barHeight + padding)))
    .attr("width", (d, i) => {
      return xScale(d.score)
    })
    .attr("height", barHeight)
    .on("mousemove", onMouseMove)
    .on("mouseout", onMouseOut)


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

  // Create array to control order of categories
  const categories = ["score", "gdp", "support", "health", "freedom", "generosity", "corruption"]

  // Build linear scale for each dimension, store in y
  const y = {}
  categories.forEach((_, i) => {
    key = categories[i]
    y[key] = d3.scaleLinear()
      .domain( d3.extent(data10, d => d[key]) )
      .range([height-margin.top, margin.bottom])
    })

  // Build x scale
  const x = d3.scalePoint()
    .range([margin.left, width-margin.right])
    .domain(categories)

  const scores = data10.map((d) => d.score)
  const yAxis = d3.scalePoint()
    .domain(d3.extent(scores))
    .range([height-margin.top, margin.bottom])

  const xAxisLines = d3.axisBottom(x)
      .tickSize(-(height - margin.top))
      .tickFormat('')
      .ticks(7)

  // Ordinal scales do not use scale.ticks() because doesn't know which to prioritize for display & relies domain for ticks.. can set with axis.tickValues
  const yAxisLines = d3.axisLeft(yAxis)
    // .ticks()

  // Function to draw lines across dimensions
  function drawPath(d) {
    return d3.line()(
      categories.map(p => {
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

  // Create Axis Group
  d3.select("#parallelPlot")
    .append("g")
      .attr("id", "axes")

  // Categories labels
  svg.select("#axes")
    .selectAll("g")
      .data(categories)
      .join("g")
        .attr("id", (_, i) => categories[i])
        .attr("transform", (_, i) => `translate(${margin.left+i}, 0)`)
        .call(() => d3.axisLeft()) // move left margin
      // Add dimension labels
      .append("text")
        .attr("x", (_, i) => {
          return i * ((width+margin.left) / categories.length)
        })
        .attr("y", margin.top-5)
        .attr('font-size', `${barHeight-2}px`)
        .text(d => d)
          .style("fill", "white")
          .style("text-anchor", "middle")

  // Axis & Axis Lines
  d3.select("#axes")
    .append("g")
      .attr("id", "verticalAxis")
      .attr("class", "axis")
      .attr("stroke-width", ".5")
      .attr("stroke-dasharray", "1,1")
      .attr("transform", `translate(0, ${height})`)
      .call(xAxisLines)

 d3.select("#axes")
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

  // Draw path!
  d3.select('#paths')
    .selectAll("g")
    .data(data10)
    .join("g")
      .attr("class", `line`)
      .attr("transform", `translate(0.5, 0)`)
      .append("path")
        .attr("id", d => `${d.country}`)
        .attr("class", `line`)
        .attr("d", drawPath)
        .attr("fill", "None")
        .attr("stroke", d => color(d.country))
        .attr("stroke-width", 2)
        .on("mousemove", onMouseMove)
        .on("mouseout", onMouseOut)
}

showTopTen()
showParallelPlot()
