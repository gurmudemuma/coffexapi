import React from 'react';
import ExporterLayout from './ExporterLayout';

interface ExporterPortalProps {
  exporterName?: string;
}

export const ExporterPortal: React.FC<ExporterPortalProps> = ({ 
  exporterName = "Coffee Exporter Co." 
}) => {
  return <ExporterLayout exporterName={exporterName} />;
};

export default ExporterPortal;