import React from 'react';
import { DailyTrendData, formatTrendDate } from '../utils/exportTrends';
import { ORGANIZATION_BRANDING } from '../config/organizationBranding';

interface ExportTrendChartProps {
  data: DailyTrendData[];
  title: string;
  dataType: 'count' | 'value';
  className?: string;
}

const ExportTrendChart: React.FC<ExportTrendChartProps> = ({ 
  data, 
  title, 
  dataType,
  className = '' 
}) => {
  // Get organization branding
  const orgBranding = ORGANIZATION_BRANDING['coffee-exporters'];
  
  // Find max value for scaling
  const maxValue = Math.max(...data.map(d => dataType === 'count' ? d.count : d.totalValue), 1);
  
  // Format value for display
  const formatValue = (value: number): string => {
    if (dataType === 'value') {
      if (value >= 1000000) {
        return `$${(value / 1000000).toFixed(1)}M`;
      } else if (value >= 1000) {
        return `$${(value / 1000).toFixed(1)}K`;
      } else {
        return `$${value}`;
      }
    } else {
      return value.toString();
    }
  };

  return (
    <div className={`bg-white rounded-lg border border-gray-200 p-4 ${className}`}>
      <h3 className="text-lg font-semibold mb-4" style={{ color: orgBranding.primaryColor }}>{title}</h3>
      
      <div className="flex items-end justify-between h-40 gap-2 mt-6">
        {data.map((item, index) => {
          const value = dataType === 'count' ? item.count : item.totalValue;
          const height = maxValue > 0 ? (value / maxValue) * 100 : 0;
          
          return (
            <div key={index} className="flex flex-col items-center flex-1">
              <div className="flex flex-col items-center w-full">
                <div 
                  className="w-full rounded-t transition-colors"
                  style={{ 
                    height: `${height}%`,
                    backgroundColor: dataType === 'value' 
                      ? orgBranding.accentColor 
                      : orgBranding.primaryColor 
                  }}
                />
                <div className="text-xs text-gray-500 mt-2 text-center">
                  {formatTrendDate(item.date, 'day')}
                </div>
              </div>
              
              <div 
                className="text-xs font-medium mt-1"
                style={{ 
                  color: dataType === 'value' 
                    ? orgBranding.accentColor 
                    : orgBranding.primaryColor 
                }}
              >
                {formatValue(value)}
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="mt-4 text-sm text-gray-500 text-center">
        {dataType === 'count' 
          ? 'Number of export requests per day' 
          : 'Total value of exports per day (USD)'}
      </div>
    </div>
  );
};

export default ExportTrendChart;