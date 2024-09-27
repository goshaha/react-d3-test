/** App.js */
import React from "react";
import styled from "styled-components";
import MultilineChart from "./components/MultilineChart";
import Legend from "./components/Legend";
import schc from "./SCHC.json";
import vcit from "./VCIT.json";
import portfolio from "./portfolio.json";

const StyledWrapper = styled.div`
  body {
    font-family: sans-serif;
    background-color: #595959;
  }
  .App {
    background-color: #595959;
    border: 1px solid white;
    display: inline-block;
  }
  .legendContainer {
    display: flex;
    justify-content: center;
  }
  .checkbox {
    margin: 10px;
  }
`;

const portfolioData = {
  name: "Portfolio",
  color: "#ffffff",
  items: portfolio.map((d) => ({ ...d, date: new Date(d.date) })),
};
const schcData = {
  name: "SCHC",
  color: "#d53e4f",
  items: schc.map((d) => ({ ...d, date: new Date(d.date) })),
};
const vcitData = {
  name: "VCIT",
  color: "#0000ff",
  items: vcit.map((d) => ({ ...d, date: new Date(d.date) })),
};

const dimensions = {
  width: 600,
  height: 300,
  margin: {
    top: 30,
    right: 30,
    bottom: 30,
    left: 60,
  },
};

export default function MultiLineChartAnimated() {
  const [selectedItems, setSelectedItems] = React.useState(["SCHC", "VCIT"]);
  const legendData = [portfolioData, schcData, vcitData];
  const chartData = [
    portfolioData,
    ...[schcData, vcitData].filter((d) => selectedItems.includes(d.name)),
  ];
  const onChangeSelection = (name) => {
    const newSelectedItems = selectedItems.includes(name)
      ? selectedItems.filter((item) => item !== name)
      : [...selectedItems, name];
    setSelectedItems(newSelectedItems);
  };

  return (
    <StyledWrapper>
      <div className="App">
        <Legend
          data={legendData}
          selectedItems={selectedItems}
          onChange={onChangeSelection}
        />
        <MultilineChart data={chartData} dimensions={dimensions} />
      </div>
    </StyledWrapper>
  );
}
