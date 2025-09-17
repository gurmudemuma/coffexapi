import React from 'react';
import { BaseDashboard } from '../BaseDashboard';

export const CustomsDashboard: React.FC = () => {
  return (
    <BaseDashboard 
      organizationType="customs" 
      userRole="APPROVER"
      userName="Customs Officer"
    />
  );
};

export default CustomsDashboard;