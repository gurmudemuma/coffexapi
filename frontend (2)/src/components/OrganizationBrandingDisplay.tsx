import React from 'react';
import { ORGANIZATION_BRANDING } from '../config/organizationBranding';

const OrganizationBrandingDisplay: React.FC = () => {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Organization Branding Display</h1>
      <p>This component displays the branding configuration for all organizations.</p>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
        {Object.entries(ORGANIZATION_BRANDING).map(([key, branding]) => (
          <div 
            key={key} 
            style={{ 
              border: `2px solid ${branding.primaryColor}`, 
              borderRadius: '8px', 
              padding: '15px',
              backgroundColor: branding.backgroundColor
            }}
          >
            <h2 style={{ color: branding.primaryColor, marginBottom: '10px' }}>
              {branding.name}
            </h2>
            
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
              <span style={{ fontWeight: 'bold', marginRight: '10px' }}>Primary:</span>
              <div 
                style={{ 
                  width: '30px', 
                  height: '30px', 
                  backgroundColor: branding.primaryColor,
                  border: '1px solid #ccc'
                }} 
              />
              <span style={{ marginLeft: '10px', fontFamily: 'monospace' }}>
                {branding.primaryColor}
              </span>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
              <span style={{ fontWeight: 'bold', marginRight: '10px' }}>Secondary:</span>
              <div 
                style={{ 
                  width: '30px', 
                  height: '30px', 
                  backgroundColor: branding.secondaryColor,
                  border: '1px solid #ccc'
                }} 
              />
              <span style={{ marginLeft: '10px', fontFamily: 'monospace' }}>
                {branding.secondaryColor}
              </span>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
              <span style={{ fontWeight: 'bold', marginRight: '10px' }}>Accent:</span>
              <div 
                style={{ 
                  width: '30px', 
                  height: '30px', 
                  backgroundColor: branding.accentColor,
                  border: '1px solid #ccc'
                }} 
              />
              <span style={{ marginLeft: '10px', fontFamily: 'monospace' }}>
                {branding.accentColor}
              </span>
            </div>
            
            <div>
              <span style={{ fontWeight: 'bold' }}>Chart Colors:</span>
              <div style={{ display: 'flex', marginTop: '5px' }}>
                {branding.chartColors.map((color, index) => (
                  <div 
                    key={index}
                    style={{ 
                      width: '20px', 
                      height: '20px', 
                      backgroundColor: color,
                      border: '1px solid #ccc',
                      marginRight: '5px'
                    }} 
                  />
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrganizationBrandingDisplay;