import React from 'react';
import { Input } from './ui/FormComponents';

// Define types for props
interface ExporterDetails {
  companyName: string;
  registrationNumber: string;
  taxId: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  postalCode: string;
}

interface ExporterDetailsTabProps {
  exporterDetails: ExporterDetails;
  handleExporterDetailsChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => void;
}

const ExporterDetailsTab: React.FC<ExporterDetailsTabProps> = ({
  exporterDetails,
  handleExporterDetailsChange,
}) => {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Exporter Information</h2>
      <p className="text-muted-foreground">
        Please provide your company information. All fields are required.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Company Name"
          name="companyName"
          value={exporterDetails.companyName}
          onChange={handleExporterDetailsChange}
          required
          placeholder="Enter your company name"
        />

        <Input
          label="Registration Number"
          name="registrationNumber"
          value={exporterDetails.registrationNumber}
          onChange={handleExporterDetailsChange}
          required
          placeholder="Enter registration number"
        />

        <Input
          label="Tax ID"
          name="taxId"
          value={exporterDetails.taxId}
          onChange={handleExporterDetailsChange}
          required
          placeholder="Enter tax identification number"
        />

        <Input
          label="Contact Person"
          name="contactPerson"
          value={exporterDetails.contactPerson}
          onChange={handleExporterDetailsChange}
          required
          placeholder="Enter contact person name"
        />

        <Input
          label="Email"
          name="email"
          type="email"
          value={exporterDetails.email}
          onChange={handleExporterDetailsChange}
          required
          placeholder="Enter email address"
        />

        <Input
          label="Phone"
          name="phone"
          type="tel"
          value={exporterDetails.phone}
          onChange={handleExporterDetailsChange}
          required
          placeholder="Enter phone number"
        />

        <div className="md:col-span-2">
          <Input
            label="Street Address"
            name="address"
            value={exporterDetails.address}
            onChange={handleExporterDetailsChange}
            required
            placeholder="Enter street address"
          />
        </div>

        <Input
          label="City"
          name="city"
          value={exporterDetails.city}
          onChange={handleExporterDetailsChange}
          required
          placeholder="Enter city"
        />

        <Input
          label="Country"
          name="country"
          value={exporterDetails.country}
          onChange={handleExporterDetailsChange}
          required
          placeholder="Enter country"
        />

        <Input
          label="Postal Code"
          name="postalCode"
          value={exporterDetails.postalCode}
          onChange={handleExporterDetailsChange}
          required
          placeholder="Enter postal code"
        />
      </div>
    </div>
  );
};

export default ExporterDetailsTab;
