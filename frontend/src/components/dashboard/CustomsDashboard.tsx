import React from 'react';
import { ApproverLayout } from '../ApproverLayout';

export const CustomsDashboard: React.FC = () => {
  return (
    <ApproverLayout 
      organizationType="customs" 
      userRole="APPROVER"
      userName="Customs Officer"
    />
  );
};

export default CustomsDashboard;