import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "@/components/Layout";
import Dashboard from "@/pages/Dashboard";
import TradeFeedPage from "@/pages/TradeFeed";
import Politicians from "@/pages/Politicians";
import PoliticianPage from "@/pages/PoliticianPage";

import Settings from "@/pages/Settings";

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Layout wraps all child pages */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="trades" element={<TradeFeedPage />} />
          <Route path="politicians" element={<Politicians />} />
          <Route path="politicians/:name" element={<PoliticianPage />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
