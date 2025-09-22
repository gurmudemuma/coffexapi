import React from 'react';

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
      <h2 className="text-xl font-semibold text-black">Exporter Information</h2>
      <p className="text-purple-600">
        Please provide your company information. All fields are required.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label htmlFor="companyName" className="block text-sm font-medium text-black">
            Company Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="companyName"
            name="companyName"
            value={exporterDetails.companyName}
            onChange={handleExporterDetailsChange}
            className="w-full px-3 py-2 border border-purple-200 rounded-md focus:border-purple-400 focus:outline-none"
            required
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="registrationNumber"
            className="block text-sm font-medium text-black"
          >
            Registration Number <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="registrationNumber"
            name="registrationNumber"
            value={exporterDetails.registrationNumber}
            onChange={handleExporterDetailsChange}
            className="w-full px-3 py-2 border border-purple-200 rounded-md focus:border-purple-400 focus:outline-none"
            required
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="taxId" className="block text-sm font-medium text-black">
            Tax ID <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="taxId"
            name="taxId"
            value={exporterDetails.taxId}
            onChange={handleExporterDetailsChange}
            className="w-full px-3 py-2 border border-purple-200 rounded-md focus:border-purple-400 focus:outline-none"
            required
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="contactPerson" className="block text-sm font-medium text-black">
            Contact Person <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="contactPerson"
            name="contactPerson"
            value={exporterDetails.contactPerson}
            onChange={handleExporterDetailsChange}
            className="w-full px-3 py-2 border border-purple-200 rounded-md focus:border-purple-400 focus:outline-none"
            required
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="email" className="block text-sm font-medium text-black">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={exporterDetails.email}
            onChange={handleExporterDetailsChange}
            className="w-full px-3 py-2 border border-purple-200 rounded-md focus:border-purple-400 focus:outline-none"
            required
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="phone" className="block text-sm font-medium text-black">
            Phone <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={exporterDetails.phone}
            onChange={handleExporterDetailsChange}
            className="w-full px-3 py-2 border border-purple-200 rounded-md focus:border-purple-400 focus:outline-none"
            required
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <label htmlFor="address" className="block text-sm font-medium text-black">
            Street Address <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="address"
            name="address"
            value={exporterDetails.address}
            onChange={handleExporterDetailsChange}
            className="w-full px-3 py-2 border border-purple-200 rounded-md focus:border-purple-400 focus:outline-none"
            required
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="city" className="block text-sm font-medium text-black">
            City <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="city"
            name="city"
            value={exporterDetails.city}
            onChange={handleExporterDetailsChange}
            className="w-full px-3 py-2 border border-purple-200 rounded-md focus:border-purple-400 focus:outline-none"
            required
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="country" className="block text-sm font-medium text-black">
            Country <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="country"
            name="country"
            value={exporterDetails.country}
            onChange={handleExporterDetailsChange}
            className="w-full px-3 py-2 border border-purple-200 rounded-md focus:border-purple-400 focus:outline-none"
            required
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="postalCode" className="block text-sm font-medium text-black">
            Postal Code <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="postalCode"
            name="postalCode"
            value={exporterDetails.postalCode}
            onChange={handleExporterDetailsChange}
            className="w-full px-3 py-2 border border-purple-200 rounded-md focus:border-purple-400 focus:outline-none"
            required
          />
        </div>
      </div>
    </div>
  );
};

export default ExporterDetailsTab;
