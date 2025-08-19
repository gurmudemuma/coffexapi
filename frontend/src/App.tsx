import React from 'react';
import ExportForm from './components/ExportForm';

function App() {
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

export default App;
