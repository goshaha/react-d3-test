/** App.js */
import React from "react";
import styled from "styled-components";
import MultilineChart from "./components/MultilineChart";
import Legend from "./components/Legend";
import def from "./data/def.json";
import hig from "./data/hig.json";
import abc from "./data/abc.json";

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

    .checkbox-label {
      font-size: 18px;
    }
  }
`;

const abcData = {
  name: "ABC",
  color: "#ffffff",
  items: abc.map((d) => ({ ...d, date: new Date(d.date) })),
};
const defData = {
  name: "DEF",
  color: "#ff471a",
  items: def.map((d) => ({ ...d, date: new Date(d.date) })),
};
const higData = {
  name: "HIG",
  color: "#47d147",
  items: hig.map((d) => ({ ...d, date: new Date(d.date) })),
};

const dimensions = {
  width: 1000,
  height: 400,
  margin: {
    top: 30,
    right: 30,
    bottom: 30,
    left: 60,
  },
};

export default function MultiLineChartAnimated() {
  const [selectedItems, setSelectedItems] = React.useState(["DEF", "HIG"]);
  const legendData = [abcData, defData, higData];
  const chartData = [
    abcData,
    ...[defData, higData].filter((d) => selectedItems.includes(d.name)),
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
