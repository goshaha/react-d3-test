import * as d3 from "d3";
import { useEffect, useRef, useState } from "react";
import styled from "styled-components";

const StyledWrapper = styled.div`
  path {
    stroke: steelblue;
    stroke-width: 2;
    fill: none;
  }

  .axis path,
  .axis line {
    fill: none;
    stroke: grey;
    stroke-width: 1;
    shape-rendering: crispEdges;
  }

  .legend {
    font-size: 16px;
    font-weight: bold;
    text-anchor: middle;
  }
`;

const MultiLineChart2 = () => {
  const ref = useRef();
  const [current, setCurrent] = useState(0);

  const drawChart = () => {
    const margin = { top: 30, right: 20, bottom: 70, left: 50 },
      width = 1000 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom;

    // Parse the date / time
    const parseDate = d3.timeParse("%b %Y");

    // Set the ranges
    const x = d3.scaleTime().range([0, width]);
    const y = d3.scaleLinear().range([height, 0]);

    const priceline = d3
      .line()
      .x((d) => x(d.date))
      .y((d) => y(d.price));

    // Adds the svg canvas
    const svg = d3
      .select("#barchart")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Get the data
    d3.csv("./stocks.csv").then(function (data) {
      data.forEach((d) => {
        d.date = parseDate(d.date);
        d.price = +d.price;
      });

      // Scale the range of the data
      x.domain(d3.extent(data, (d) => d.date));
      y.domain([0, d3.max(data, (d) => d.price)]);

      // Group the entries by symbol
      const dataNest = Array.from(
        d3.group(data, (d) => d.symbol),
        ([key, value]) => ({ key, value })
      );

      // set the colour scale
      const color = d3.scaleOrdinal(d3.schemeCategory10);

      const legendSpace = width / dataNest.length; // spacing for the legend

      // Loop through each symbol / key
      dataNest.forEach(function (d, i) {
        svg
          .append("path")
          .attr("class", "line")
          .style("stroke", function () {
            // Add the colours dynamically
            return (d.color =
              i === current ? color(d.key) : `${color(d.key)}50`);
          })
          .attr("d", priceline(d.value));

        // Add the Legend
        svg
          .append("text")
          .attr("x", legendSpace / 2 + i * legendSpace) // space legend
          .attr("y", height + margin.bottom / 2 + 5)
          .attr("class", "legend") // style the legend
          .style("fill", function () {
            // Add the colours dynamically
            return (d.color =
              i === current ? color(d.key) : `${color(d.key)}80`);
          })
          .style("cursor", "pointer")
          .on("click", () => {
            setCurrent(i);
          })
          .text(d.key);
      });

      // Add the X Axis
      svg
        .append("g")
        .attr("class", "axis")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

      // Add the Y Axis
      svg.append("g").attr("class", "axis").call(d3.axisLeft(y));
    });
  };

  useEffect(() => {
    d3.select("g").remove();
    drawChart();
  }, [current]);

  return (
    <StyledWrapper>
      <svg width={"100%"} height={500} id="barchart" ref={ref} />
    </StyledWrapper>
  );
};

export default MultiLineChart2;
