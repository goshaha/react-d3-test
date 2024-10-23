import * as d3 from "d3";
import { useEffect, useRef } from "react";
import styled from "styled-components";

const StyledWrapper = styled.div`
  rect {
    pointer-events: all;
    fill-opacity: 0;
    stroke-opacity: 0;
    z-index: 1;
  }
`;

const MultiLineChart3 = () => {
  const ref = useRef();

  const drawChart = () => {
    const width = 1028;
    const height = 500;
    const marginTop = 20;
    const marginRight = 20;
    const marginBottom = 30;
    const marginLeft = 30;

    const svg = d3
      .select("#barchart")
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", [0, 0, width, height])
      .attr(
        "style",
        "max-width: 100%; height: 600px; overflow: visible; font: 10px sans-serif;"
      );

    // Get the data
    d3.csv("./unemployment.csv").then(function (unemployment) {
      const x = d3
        .scaleTime()
        .domain(d3.extent(unemployment, (d) => new Date(d.date)))
        .range([marginLeft, width - marginRight]);

      const y = d3
        .scaleLinear()
        .domain([0, d3.max(unemployment, (d) => +d.unemployment)])
        .range([height - marginBottom, marginTop])
        .nice();

      // Add the horizontal axis.
      svg
        .append("g")
        .attr("transform", `translate(0,${height - marginBottom})`)
        .call(
          d3
            .axisBottom(x)
            .ticks(width / 80)
            .tickSizeOuter(0)
        );

      // Add the vertical axis.
      svg
        .append("g")
        .attr("transform", `translate(${marginLeft},0)`)
        .call(d3.axisLeft(y))
        .call((g) => g.select(".domain").remove())
        .call((g) =>
          g
            .selectAll(".tick line")
            .clone()
            .attr("x2", width - marginLeft - marginRight)
            .attr("stroke-opacity", 0.1)
        );
      // .call((g) =>
      //   g
      //     .append("text")
      //     .attr("x", -marginLeft)
      //     .attr("y", 10)
      //     .attr("fill", "currentColor")
      //     .attr("text-anchor", "start")
      //     .text("↑ Unemployment (%)")
      // );

      // Compute the points in pixel space as [x, y, z], where z is the name of the series.
      const points = unemployment.map((d) => [
        x(new Date(d.date)),
        y(d.unemployment),
        d.division,
      ]);

      // Group the points by series.
      const groups = d3.rollup(
        points,
        (v) => Object.assign(v, { z: v[0][2] }),
        (d) => d[2]
      );

      // Draw the lines.
      const line = d3.line();
      const path = svg
        .append("g")
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 1.5)
        .attr("stroke-linejoin", "round")
        .attr("stroke-linecap", "round")
        .selectAll("path")
        .data(groups.values())
        .join("path")
        .style("mix-blend-mode", "multiply")
        .attr("d", line);

      // Add an invisible layer for the interactive tip.
      const dot = svg.append("g").attr("display", "none");
      dot.append("circle").attr("r", 2.5);
      dot.append("text").attr("text-anchor", "middle").attr("y", -8);

      const listeningRect = svg
        .append("rect")
        .attr("width", width)
        .attr("height", height);

      listeningRect
        .on("pointerenter", pointerentered)
        .on("pointermove", pointermoved)
        .on("pointerleave", pointerleft)
        .on("touchstart", (event) => event.preventDefault());

      //   return svg.node();

      function pointermoved(event) {
        const [xm, ym] = d3.pointer(event);
        const i = d3.leastIndex(points, ([x, y]) => Math.hypot(x - xm, y - ym));
        const [x, y, k] = points[i];

        path
          .style("stroke", ({ z }) => (z === k ? null : "#ddd"))
          .filter(({ z }) => z === k)
          .raise();
        dot.attr("transform", `translate(${x},${y})`);
        dot.select("text").text(k);
        svg
          .property("value", unemployment[i])
          .dispatch("input", { bubbles: true });
      }

      function pointerentered() {
        path.style("mix-blend-mode", null).style("stroke", "#ddd");
        dot.attr("display", null);
      }

      function pointerleft() {
        path.style("mix-blend-mode", "multiply").style("stroke", null);
        dot.attr("display", "none");
        svg.node().value = null;
        svg.dispatch("input", { bubbles: true });
      }
    });
  };

  useEffect(() => {
    d3.select("g").remove();
    drawChart();
  }, []);

  return (
    <StyledWrapper>
      <svg width={"100%"} height={600} id="barchart" ref={ref} />
    </StyledWrapper>
  );
};

export default MultiLineChart3;
