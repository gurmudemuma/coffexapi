import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ExporterPortal from './components/ExporterPortal';
import Login from './components/Login';
import NationalBankDashboard from './components/dashboard/NationalBankDashboard';
import CustomsDashboard from './components/dashboard/CustomsDashboard';
import CoffeeAuthorityDashboard from './components/dashboard/CoffeeAuthorityDashboard';
import ExporterBankDashboard from './components/dashboard/ExporterBankDashboard';

// Exporter Interface Component
function ExporterApp() {
  return <ExporterPortal />;
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/exporter" element={<ExporterApp />} />
        <Route path="/export" element={<ExporterApp />} />
        {/* Individual dashboard routes for each authority */}
        <Route path="/dashboard/national-bank" element={<NationalBankDashboard />} />
        <Route path="/dashboard/customs" element={<CustomsDashboard />} />
        <Route path="/dashboard/coffee-authority" element={<CoffeeAuthorityDashboard />} />
        <Route path="/dashboard/exporter-bank" element={<ExporterBankDashboard />} />
        <Route path="/dashboard/exporter" element={<ExporterApp />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;