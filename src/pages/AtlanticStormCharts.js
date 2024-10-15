import * as d3 from "d3";
import { useEffect, useRef } from "react";

const AtlanticStormCharts = () => {
  const ref = useRef();

  const drawChart = () => {
    let totalWidth = 900,
      totalHeight = 600;
    let margin = { top: 20, right: 100, bottom: 25, left: 200 },
      width = totalWidth - margin.right,
      height = totalHeight - margin.top - margin.bottom;

    // <!-- SVG Element -->
    let svg = d3
      .select("#barchart")
      .append("g")
      .attr("width", width)
      .attr("height", totalHeight)
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    svg.append("g").attr("width", width).attr("height", height);

    let colors = ["orange", "deepskyblue", "green"];

    // <!-- Row Converter Function -->
    function parseRow(d) {
      let newRow = {};
      newRow.name = d.name;
      newRow.frequency = +d.frequency;
      newRow.year = d.year;
      return newRow;
    }

    // <!-- Retrieve data from CSV -->
    d3.csv("./atlanticstorms.csv", parseRow).then(function (data) {
      // <!-- Setup Scales -->
      let xScale = d3
        .scaleLinear()
        .domain(
          d3.extent(data, function (d) {
            return d.year;
          })
        )
        .range([0, width]);

      let yScale = d3.scaleLinear().domain([0, 16]).range([height, 0]);

      // <!-- Setup Axis -->
      let xAxis = svg
        .append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(xScale).tickFormat(d3.format(".0f")));

      let yAxis = svg.append("g").call(d3.axisLeft(yScale));

      // <!-- Line Generator -->
      let lineGenerator = d3
        .line()
        .x(function (d) {
          return xScale(d.year);
        })
        .y(function (d) {
          return yScale(d.frequency);
        })
        .curve(d3.curveMonotoneX);

      // Group the entries by symbol
      const nestedData = Array.from(
        d3.group(data, (d) => d.name),
        ([key, values]) => ({ key, values })
      );

      //   console.log(nestedData);

      let lines = svg.append("g");

      lines
        .selectAll(".line")
        .data(nestedData)
        .enter()
        .append("g")
        .append("path")
        .attr("class", "line")
        .attr("d", function (d, i) {
          return lineGenerator(d.values);
        })
        .style("fill", "none")
        .style("stroke", function (d, i) {
          return colors[i];
        })
        .style("opacity", 0.9)
        .style("stroke-width", 4)
        .on("mouseover", function (d, i) {
          d3.select(this).style("stroke-width", 6);
        })
        .on("mouseout", function (d, i) {
          d3.select(this).style("stroke-width", 4);
        });

      lines
        .selectAll(".labels")
        .data(nestedData)
        .enter()
        .append("g")
        .append("text")
        .attr("x", function (d, i) {
          let hori = d.values[d.values.length - 1]["year"];
          return xScale(hori) + 5;
        })
        .attr("y", function (d, i) {
          let vert = d.values[d.values.length - 1]["frequency"];
          return yScale(vert) + 5;
        })
        .attr("font-size", "25px")
        .text(function (d, i) {
          console.log(d);
          return d.key;
        })
        .style("fill", function (d, i) {
          return colors[i];
        })
        .attr("opacity", 1);
    });
  };

  useEffect(() => {
    drawChart();
  }, []);

  return <svg width="1500" height="600" id="barchart" />;
};

export default AtlanticStormCharts;
