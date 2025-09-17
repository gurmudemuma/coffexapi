import React from 'react';
import { BaseDashboard } from '../BaseDashboard';

export const ExporterBankDashboard: React.FC = () => {
  return (
    <BaseDashboard 
      organizationType="exporter-bank" 
      userRole="APPROVER"
      userName="Bank Officer"
    />
  );
};

export default ExporterBankDashboard;