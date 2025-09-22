import React from 'react';
import { ApproverLayout } from '../ApproverLayout';

export const NationalBankDashboard: React.FC = () => {
  return (
    <ApproverLayout 
      organizationType="national-bank" 
      userRole="APPROVER"
      userName="National Bank Officer"
    />
  );
};

export default NationalBankDashboard;