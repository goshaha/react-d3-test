import * as d3 from "d3";
import { useEffect, useRef } from "react";
import styled from "styled-components";
import useMediaQuery from "../hooks/useMediaQuery";
import useWindowDimensions from "../hooks/useWindowDimensions";

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

const desktopWidth = 1000;

const MultiLineChart = () => {
  const ref = useRef();
  const firstRender = useRef(true);
  const isDesktop = useMediaQuery('(min-width: 1000px)');
  const { width: windowWidth } = useWindowDimensions();

  const defaultWidth = windowWidth > desktopWidth ? desktopWidth : windowWidth

  const drawChart = () => {
    const margin = { top: 30, right: 50, bottom: 70, left: 50 },
      width = defaultWidth - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom;
    // Parse the date / time
    const parseDate = d3.timeParse("%b %Y");

    // Set the ranges
    const x = d3.scaleTime().range([0, width]);
    const y = d3.scaleLinear().range([height, 0]);

    // Define the line
    const priceline = d3
      .line()
      .x(function (d) {
        return x(d.date);
      })
      .y(function (d) {
        return y(d.price);
      });

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
      data.forEach(function (d) {
        d.date = parseDate(d.date);
        d.price = +d.price;
      });

      // Scale the range of the data
      x.domain(
        d3.extent(data, function (d) {
          return d.date;
        })
      );
      y.domain([
        0,
        d3.max(data, function (d) {
          return d.price;
        }),
      ]);

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
            return (d.color = color(d.key));
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
            return (d.color = color(d.key));
          })
          .text(d.key);

        svg.append("text")
          .text(() => d.key)
          .attr('x', width + 4)
          .attr(
            'y',
            () => y(d.value[d.value.length - 1].price) + (d.key === 'IBM' ? 15 : 0)
          )
          .style('fill', () => color(d.key))
          .style('font-family', 'sans-serif')
          .style('font-size', 12)
      });

      // Add the X Axis
      svg
        .append("g")
        .attr("class", "axis")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

      // add animation
      const lines = svg.selectAll(".line");

      lines.each((d, i, nodes) => {
        const element = nodes[i];
        const length = element.getTotalLength();
        d3.select(element)
          .attr("stroke-dasharray", `${length},${length}`)
          .attr("stroke-dashoffset", length)
          .transition()
          .duration(750)
          .ease(d3.easeLinear)
          .attr("stroke-dashoffset", 0);
      });

      // Add the Y Axis
      svg.append("g").attr("class", "axis").call(d3.axisLeft(y));
    });
  }

  useEffect(() => {
    if(windowWidth > desktopWidth && !firstRender.current) return;

    d3.select("g").remove();
    drawChart();

    if (firstRender.current) {
      firstRender.current = false;
    }
  }, [isDesktop, windowWidth]);

  return (
    <StyledWrapper>
      <svg width={"100%"} height={500} id="barchart" ref={ref} />
    </StyledWrapper>
  );
};

export default MultiLineChart;
