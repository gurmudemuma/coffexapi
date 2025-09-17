import React from 'react';
import { BaseDashboard } from '../BaseDashboard';

export const CoffeeAuthorityDashboard: React.FC = () => {
  return (
    <BaseDashboard 
      organizationType="coffee-authority" 
      userRole="APPROVER"
      userName="Quality Inspector"
    />
  );
};

export default CoffeeAuthorityDashboard;