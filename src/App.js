import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./pages/Layout";
import Home from "./pages/Home";
import LineChart from "./pages/LineChart";
import MultiLineChart from "./pages/MultiLineChart";
import DonutChart from "./pages/DonutChart";
import LineChartTooltip from "./pages/LineChartTooltip";
import Barchart from "./pages/Barchart";
import NoPage from "./pages/NoPage";
import LineChartAnimated from "./pages/LineChartAnimated";

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
          <Route path="lineChartTooltip" element={<LineChartTooltip />} />
          <Route path="*" element={<NoPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
