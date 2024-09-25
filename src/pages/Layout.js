import { Outlet, Link } from "react-router-dom";

const Layout = () => {
  return (
    <>
      <nav>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/straight">Straight</Link>
          </li>
          <li>
            <Link to="/linechart">LineChart</Link>
          </li>
          <li>
            <Link to="/multilinechart">MultiLineChart</Link>
          </li>
          <li>
            <Link to="/lineChartTooltip">LineChartTooltip</Link>
            <li>
              <Link to="/donutchart">DonutChart</Link>
            </li>
          </li>
        </ul>
      </nav>

      <Outlet />
    </>
  );
};

export default Layout;
