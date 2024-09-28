import React from "react";
import { NavLink as BaseNavLink } from "react-router-dom";
import styled from "styled-components";

const NavLink = styled(BaseNavLink)`
  background-color: cadetblue;
  color: white;
  padding: 4px 8px;
  text-align: center;
  border-radius: 5px;
  margin: 4px;
  cursor: pointer;
  text-decoration: none;

  &.active {
    background-color: #4d7c80;
  }
`;

const NavigationStyled = styled.div`
  display: grid;
  grid-template-columns: 0.5fr 1fr 0.5fr;
  grid-gap: 10px;
  width: 100%;

  .column1 {
    background-color: rgba(255, 255, 255, 0.8);
    height: 150px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .home-center-content {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    margin-top: 10px;
    padding: 15px 10px 10px;
    width: 95%;
  }
`;

const projectsLinks = [
  {
    path: "/straight",
    name: "Straight",
  },
  {
    path: "/linechart",
    name: "LineChart",
  },
  {
    path: "/linechartanimated",
    name: "LineChartAnimated",
  },
  {
    path: "/multilinechart",
    name: "MultiLineChart",
  },
  {
    path: "/multilinechart2",
    name: "MultiLineChart2",
  },
  {
    path: "/multilinechartanimated",
    name: "MultiLineChartAnimated",
  },
  {
    path: "/lineChartTooltip",
    name: "LineChartTooltip",
  },
  {
    path: "/donutchart",
    name: "DonutChart",
  },
];

const Navigation = () => {
  return (
    <NavigationStyled>
      <div className=""></div>
      <div className="column1">
        <div className="home-center-content">
          {projectsLinks.map((item) => (
            <NavLink key={item?.path} to={item.path}>
              {item?.name}
            </NavLink>
          ))}
        </div>
      </div>
      <div className=""></div>
    </NavigationStyled>
  );
};

export default Navigation;
