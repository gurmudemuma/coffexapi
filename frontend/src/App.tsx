import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ExportForm from './components/ExportForm';
import ApproversApp from './ApproversApp';

// Exporter Interface Component
function ExporterApp() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white dark:from-dark-900 dark:to-dark-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-12">
          <div className="inline-block px-6 py-2 bg-gold-100 dark:bg-gold-900/20 rounded-full mb-4">
            <span className="text-sm font-semibold text-gold-800 dark:text-gold-400">
              BLOCKCHAIN SECURED
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-gold-600 mb-4">
            Coffee Export Platform
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Securely submit and validate your coffee export documents on the
            blockchain
          </p>
        </header>

        <div className="bg-white dark:bg-dark-800 rounded-2xl shadow-xl overflow-hidden border border-border">
          <div className="p-6 sm:p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-foreground">
                Document Submission
              </h2>
              <div className="flex space-x-2">
                <span className="h-3 w-3 rounded-full bg-primary-500"></span>
                <span className="h-3 w-3 rounded-full bg-gold-500"></span>
                <span className="h-3 w-3 rounded-full bg-dark-500"></span>
              </div>
            </div>
            <ExportForm />
          </div>
        </div>

        <footer className="mt-12 text-center text-sm text-muted-foreground">
          <p>
            © {new Date().getFullYear()} Coffee Export Platform. All rights
            reserved.
          </p>
          <p className="mt-1">Powered by Hyperledger Fabric</p>
        </footer>
      </div>
    </div>
  );
}

// Landing Page with Navigation
function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white dark:from-dark-900 dark:to-dark-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-12">
          <div className="inline-block px-6 py-2 bg-gold-100 dark:bg-gold-900/20 rounded-full mb-4">
            <span className="text-sm font-semibold text-gold-800 dark:text-gold-400">
              BLOCKCHAIN SECURED
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-gold-600 mb-4">
            Coffee Export Platform
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Secure blockchain-based document validation for coffee export stakeholders
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Exporter Interface */}
          <div className="bg-white dark:bg-dark-800 rounded-2xl shadow-xl overflow-hidden border border-border hover:shadow-2xl transition-shadow">
            <div className="p-6 sm:p-8 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-blue-100 flex items-center justify-center">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4">Export Documents</h3>
              <p className="text-muted-foreground mb-6">
                Submit coffee export documents for blockchain validation
              </p>
              <a 
                href="/export" 
                className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
              >
                Submit Export
              </a>
            </div>
          </div>

          {/* Approver Interface */}
          <div className="bg-white dark:bg-dark-800 rounded-2xl shadow-xl overflow-hidden border border-border hover:shadow-2xl transition-shadow">
            <div className="p-6 sm:p-8 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4">Approve Documents</h3>
              <p className="text-muted-foreground mb-6">
                Validate and approve export documents as authorized organization
              </p>
              <a 
                href="/approvers" 
                className="inline-block bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-semibold"
              >
                Access Dashboard
              </a>
            </div>
          </div>
        </div>

        <footer className="text-center text-sm text-muted-foreground">
          <p>
            © {new Date().getFullYear()} Coffee Export Platform. All rights
            reserved.
          </p>
          <p className="mt-1">Powered by Hyperledger Fabric</p>
        </footer>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/export" element={<ExporterApp />} />
        <Route path="/approvers" element={<ApproversApp />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
