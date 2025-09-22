import React from 'react';
import { ApproverLayout } from '../ApproverLayout';

export const CoffeeAuthorityDashboard: React.FC = () => {
  return (
    <ApproverLayout 
      organizationType="coffee-authority" 
      userRole="APPROVER"
      userName="Quality Inspector"
    />
  );
};

export default CoffeeAuthorityDashboard;