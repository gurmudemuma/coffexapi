import { ORGANIZATION_BRANDING, getOrganizationClasses, getOrganizationStyles } from './organizationBranding';

describe('Organization Branding Configuration', () => {
  test('should have branding for all organizations', () => {
    const organizations = ['national-bank', 'customs', 'quality-authority', 'exporter-bank', 'coffee-exporters'];
    
    organizations.forEach(org => {
      expect(ORGANIZATION_BRANDING[org]).toBeDefined();
      expect(ORGANIZATION_BRANDING[org].name).toBeDefined();
      expect(ORGANIZATION_BRANDING[org].primaryColor).toBeDefined();
      expect(ORGANIZATION_BRANDING[org].secondaryColor).toBeDefined();
      expect(ORGANIZATION_BRANDING[org].accentColor).toBeDefined();
      expect(ORGANIZATION_BRANDING[org].backgroundColor).toBeDefined();
      expect(ORGANIZATION_BRANDING[org].chartColors).toBeDefined();
    });
  });

  test('should return correct CSS variables for organization', () => {
    const nbeStyles = getOrganizationStyles('national-bank');
    expect(nbeStyles).toContain('--org-primary: #1565c0');
    expect(nbeStyles).toContain('--org-secondary: #0d47a1');
  });

  test('should return correct CSS classes for organization elements', () => {
    const nbeHeaderClass = getOrganizationClasses('national-bank', 'header');
    expect(nbeHeaderClass).toContain('bg-[#1565c0]');
    expect(nbeHeaderClass).toContain('text-white');
    
    const customsCardClass = getOrganizationClasses('customs', 'card');
    expect(customsCardClass).toContain('border-[#2e7d32]');
  });

  test('should fallback to default branding for unknown organizations', () => {
    const unknownOrgStyles = getOrganizationStyles('unknown-org');
    // Should fallback to national-bank branding
    expect(unknownOrgStyles).toContain('--org-primary: #1565c0');
  });
});