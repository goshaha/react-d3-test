import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import LineChart from "./pages/LineChart";
import MultiLineChart from "./pages/MultiLineChart";
import MultiLineChart2 from "./pages/MultilineChart2";
import DonutChart from "./pages/DonutChart";
import LineChartTooltip from "./pages/LineChartTooltip";
import Barchart from "./pages/Barchart";
import NoPage from "./pages/NoPage";
import LineChartAnimated from "./pages/LineChartAnimated";
import MultiLineChartAnimated from "./pages/MultiLineChartAnimated";
import HorizontalBars from "./pages/HorizontalBars";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="straight" element={<Barchart />} />
          <Route path="linechart" element={<LineChart />} />
          <Route path="linechartanimated" element={<LineChartAnimated />} />
          <Route path="donutchart" element={<DonutChart />} />
          <Route path="multilinechart" element={<MultiLineChart />} />
          <Route
            path="multilinechartanimated"
            element={<MultiLineChartAnimated />}
          />
          <Route path="multilinechart2" element={<MultiLineChart2 />} />
          <Route path="lineChartTooltip" element={<LineChartTooltip />} />
          <Route path="horizontalbars" element={<HorizontalBars />} />
          <Route path="*" element={<NoPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
