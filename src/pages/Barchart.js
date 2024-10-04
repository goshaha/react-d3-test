import * as d3 from "d3";
import { useEffect, useRef } from "react";
import styled from "styled-components";

const StyledWrapper = styled.div`
  .tooltip {
    position: absolute;
    padding: 10px;
    background-color: steelblue;
    color: white;
    border: 1px solid white;
    border-radius: 10px;
    display: none;
    opacity: 0.75;
  }
`;

function inverseProportion(n) {
  return 30 - (n * 10) / 2;
}

const Barchart = () => {
  const ref = useRef();

  useEffect(() => {
    // set the dimensions and margins of the graph
    const margin = { top: 30, right: 30, bottom: 70, left: 60 },
      width = 700 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom;

    // append the svg object to the body of the page
    const svg = d3
      .select("#barchart")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const tooltip = d3.select("#mbody").append("div").attr("class", "tooltip");

    // Parse the Data
    d3.csv("./onecatonenum.csv").then(function (data) {
      const maxValue = d3.max(data, (d) => +d.Value);
      const minValue = d3.min(data, (d) => +d.Value);
      // X axis
      const x = d3
        .scaleBand()
        .range([0, width])
        .domain(data.map((d) => d.Country))
        .padding(0.2);
      svg
        .append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(d3.axisBottom(x))
        .selectAll("text")
        .attr("transform", "translate(-10,0)rotate(-45)")
        .style("text-anchor", "end");

      // Add Y axis
      const y = d3.scaleLinear().domain([0, maxValue]).range([height, 0]);
      svg.append("g").call(d3.axisLeft(y));

      // Bars
      const listeningRect = svg
        .selectAll("mybar")
        .data(data)
        .join("rect")
        .attr("x", (d) => x(d.Country))
        .attr("y", (d) => y(d.Value))
        .attr("width", x.bandwidth())
        .attr("height", (d) => height - y(d.Value))
        .attr("fill", "#5f0f40");

      // add text to each bar
      Object.values(data).forEach((element, index) => {
        const num = element?.Value?.length;
        const marginglef = inverseProportion(num || 1);
        svg
          .append("text")
          .text(() => element.Value)
          .attr("x", () => x(element.Country) + marginglef)
          .attr("y", () => y(element.Value - minValue + 100))
          .style("fill", () => "white")
          .style("font-family", "sans-serif")
          .style("font-size", 12);
      });

      // Add a circle element
      const circle = svg
        .append("circle")
        .attr("r", 0)
        .attr("fill", "red")
        .style("stroke", "white")
        .attr("opacity", 0.7)
        .style("pointer-events", "none");

      // one more x scale to be able get invert()
      const xScale = d3.scaleLinear().range([0, width]);

      listeningRect.on("mousemove", function (event) {
        const [xCoord] = d3.pointer(event, this);
        const x0 = xScale.invert(xCoord) * 10;
        const bar = x0 < 1 ? 1 : Math.trunc(x0) + 1;

        const xPos = x(data[bar - 1].Country) + x.bandwidth() / 2;
        const yPos = y(data[bar - 1].Value);

        // Update the circle position
        circle.attr("cx", xPos).attr("cy", yPos);

        // Add transition for the circle radius
        circle.transition().duration(10).attr("r", 5);

        // add in  our tooltip
        tooltip
          .style("display", "block")
          .style("left", `${xPos + 100}px`)
          .style("top", `${yPos + 120}px`)
          .html(
            `<strong>key1:</strong> ${
              data[bar - 1].Value
            }<br><strong>key2:</strong> ${"value2"}`
          );
      });

      listeningRect.on("mouseleave", function () {
        circle.transition().duration(10).attr("r", 0);
        tooltip.style("display", "none");
      });
    });
  }, []);

  return (
    <StyledWrapper>
      <div id="mbody">
        <svg width={900} height={500} id="barchart" ref={ref} />
      </div>
    </StyledWrapper>
  );
};

export default Barchart;
