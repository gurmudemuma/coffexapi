import React from 'react';
import { ApproverLayout } from '../ApproverLayout';

export const ExporterBankDashboard: React.FC = () => {
  return (
    <ApproverLayout 
      organizationType="exporter-bank" 
      userRole="APPROVER"
      userName="Bank Officer"
    />
  );
};

export default ExporterBankDashboard;