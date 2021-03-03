// Working with the top ten only
let data10 = data.slice(0, 10)
const numItems = 10;

// Set up parameters
const margin = ({top: 20, right: 30, bottom: 30, left: 20})

const padding = 2;
const barHeight = 15;
const width = 500;
let height = numItems * (barHeight + padding)+ margin.bottom;

// Spectrum color palette
const color = d3.scaleOrdinal()
  .domain(data10, (d) => d.country)
  .range(["#9e0142","#d53e4f","#f46d43","#fdae61","#fee08b","#e6f598","#abdda4","#66c2a5","#3288bd","#5e4fa2"])

// TODO: add other tooltip with sorted rank per category when hover over category axis (probably add table with all data that highlights on hover too)


// Create tooltip (outside svg)
const tooltip = d3.select('.main')
  .append("div")
    .attr("class", "tooltip")
      // NB: min styling needed for tooltips
      // moved to style.css
      // .style("position", "absolute")
      // .style("display", "none")

function onMouseMove(event, d) {
  // Style tooltip
  tooltip.style("left", event.pageX + 18 + "px")
    .style("top", event.pageY + 18 + "px")
    .style("display", "block")
    .html(`
      <strong>#${d.rank}: ${d.country} </strong><br />
      Score: ${d.score}<br />
      GDP: ${d.gdp} <br />
      Support: ${d.support} <br />
      Health: ${d.health} <br />
      Freedom: ${d.freedom} <br />
      Generosity: ${d.generosity} <br />
      Corruption: ${d.corruption} <br />
      `)

  // Cursor changes on target
  d3.select(event.target)
    .style("cursor", "crosshair")

  // Match country across SVGs
  function matchIds(d) {
    // currentTarget refers to elem the listener is attached to
    return (event.currentTarget.id === `bar-${d.country}` || event.currentTarget.id === `${d.country}`);
  }

  // Hover effects
  d3.selectAll(`#parallelPlot > #paths > g > path`)
    .data(data10)
    .attr("stroke", d => matchIds(d) ? color(d.country) : "lightgrey")
    .attr("opacity", d => matchIds(d) ? 1 : 0.35)
    .attr('stroke-width', d => matchIds(d) ? 3 : 2 )
  }

function onMouseOut(event){

  // Hide tooltip
  tooltip.style("display", "none");

  // Set cursor back to default
  d3.select(event.target)
    .style("cursor", "default")

  // Reset styles to default
  d3.selectAll(`#parallelPlot > #paths > g > path`)
    .data(data10)
    .transition()
      .duration(250)
      // .delay(1000)
      // .ease(d3.easeSinOut)
    .attr("stroke", (d) => color(d.country))
    .attr("opacity", .85)
    .attr('stroke-width', 2)
}
