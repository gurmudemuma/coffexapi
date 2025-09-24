import React from 'react';
import { ApproverLayout } from '../ApproverLayout';
import UserManagement from '../UserManagement';

export const NationalBankDashboard: React.FC = () => {
  return (
    <ApproverLayout 
      organizationType="national-bank" 
      userRole="APPROVER"
      userName="National Bank Officer"
    >
      <UserManagement />
    </ApproverLayout>
  );
};

export default NationalBankDashboard;