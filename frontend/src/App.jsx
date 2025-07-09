// src/App.jsx
import React from "react";
import { UserProvider } from "@/context/UserContext";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Layout from "@/components/Layout";
import Dashboard from "@/pages/Dashboard";
import TradeFeedPage from "@/pages/TradeFeed";
import Politicians from "@/pages/Politicians";
import PoliticianPage from "@/pages/PoliticianPage";
import FollowingPage from "@/pages/FollowingPage";      // ← imported
import Settings from "@/pages/Settings";
import ProfilePage from "./pages/Profile";

const App = () => {
  return (
    <UserProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="trades" element={<TradeFeedPage />} />
            <Route path="politicians" element={<Politicians />} />
            <Route path="politicians/:name" element={<PoliticianPage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="following" element={<FollowingPage />} />  {/* now defined */}
            <Route path="settings" element={<Settings />} />
          </Route>
        </Routes>
      </Router>
    </UserProvider>
  );
};

export default App;
