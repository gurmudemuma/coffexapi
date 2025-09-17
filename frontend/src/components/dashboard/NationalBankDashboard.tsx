import React from 'react';
import { BaseDashboard } from '../BaseDashboard';

export const NationalBankDashboard: React.FC = () => {
  return (
    <BaseDashboard 
      organizationType="national-bank" 
      userRole="APPROVER"
      userName="National Bank Officer"
    />
  );
};

export default NationalBankDashboard;