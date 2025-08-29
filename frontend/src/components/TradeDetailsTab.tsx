import React from 'react';
import { Input, Textarea, Select } from './ui/FormComponents';

// Define types for props
interface TradeDetails {
  productName: string;
  productDescription: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  totalValue: number;
  currency: string;
  countryOfOrigin: string;
  destinationCountry: string;
  incoterms: string;
  shippingDate: string;
  expectedDeliveryDate: string;
  paymentTerms: string;
  paymentMethod: string;
  specialInstructions?: string;
}

interface TradeDetailsTabProps {
  tradeDetails: TradeDetails;
  handleTradeDetailsChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => void;
}

const TradeDetailsTab: React.FC<TradeDetailsTabProps> = ({
  tradeDetails,
  handleTradeDetailsChange,
}) => {
  const unitOptions = [
    { value: 'kg', label: 'kg' },
    { value: 'g', label: 'g' },
    { value: 'lb', label: 'lb' },
    { value: 'oz', label: 'oz' },
    { value: 'l', label: 'l' },
    { value: 'ml', label: 'ml' },
    { value: 'piece', label: 'piece' },
    { value: 'box', label: 'box' },
    { value: 'carton', label: 'carton' }
  ];

  const currencyOptions = [
    { value: 'USD', label: 'USD' },
    { value: 'EUR', label: 'EUR' },
    { value: 'GBP', label: 'GBP' },
    { value: 'JPY', label: 'JPY' },
    { value: 'AUD', label: 'AUD' },
    { value: 'CAD', label: 'CAD' },
    { value: 'CHF', label: 'CHF' },
    { value: 'CNY', label: 'CNY' }
  ];

  const incotermsOptions = [
    { value: 'EXW', label: 'EXW - Ex Works' },
    { value: 'FOB', label: 'FOB - Free On Board' },
    { value: 'CIF', label: 'CIF - Cost, Insurance & Freight' },
    { value: 'CIP', label: 'CIP - Carriage & Insurance Paid To' },
    { value: 'DAP', label: 'DAP - Delivered At Place' },
    { value: 'DPU', label: 'DPU - Delivered at Place Unloaded' },
    { value: 'DDP', label: 'DDP - Delivered Duty Paid' }
  ];

  const paymentTermsOptions = [
    { value: '30 days', label: 'Net 30 days' },
    { value: '60 days', label: 'Net 60 days' },
    { value: '90 days', label: 'Net 90 days' },
    { value: 'advance', label: 'Advance payment' },
    { value: 'on delivery', label: 'On delivery' },
    { value: 'custom', label: 'Custom terms' }
  ];

  const paymentMethodOptions = [
    { value: 'Bank Transfer', label: 'Bank Transfer' },
    { value: 'Letter of Credit', label: 'Letter of Credit' },
    { value: 'Documentary Collection', label: 'Documentary Collection' },
    { value: 'Cash in Advance', label: 'Cash in Advance' },
    { value: 'Online Payment', label: 'Online Payment' }
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Trade Details</h2>
      <p className="text-muted-foreground">
        Provide information about the goods being exported.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Product Name"
          name="productName"
          value={tradeDetails.productName}
          onChange={handleTradeDetailsChange}
          required
          placeholder="Enter product name"
        />

        <div className="md:col-span-2">
          <Textarea
            label="Product Description"
            name="productDescription"
            value={tradeDetails.productDescription}
            onChange={handleTradeDetailsChange}
            rows={3}
            placeholder="Describe the product details..."
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium">
            Quantity <span className="text-red-500">*</span>
          </label>
          <div className="flex space-x-2">
            <div className="flex-1">
              <Input
                type="number"
                name="quantity"
                min="0"
                step="0.001"
                value={tradeDetails.quantity.toString()}
                onChange={handleTradeDetailsChange}
                required
                placeholder="0"
              />
            </div>
            <div className="w-24">
              <Select
                name="unit"
                value={tradeDetails.unit}
                onChange={handleTradeDetailsChange}
                options={unitOptions}
              />
            </div>
          </div>
        </div>

        <Input
          label="Unit Price"
          name="unitPrice"
          type="number"
          min="0"
          step="0.01"
          value={tradeDetails.unitPrice.toString()}
          onChange={handleTradeDetailsChange}
          required
          leftIcon={<span className="text-muted-foreground">$</span>}
          placeholder="0.00"
        />

        <div className="space-y-2">
          <label className="block text-sm font-medium text-foreground">Total Value</label>
          <div className="flex h-10 w-full rounded-md border border-input bg-muted px-3 py-2 text-sm text-muted-foreground">
            ${tradeDetails.totalValue.toFixed(2)} {tradeDetails.currency}
          </div>
        </div>

        <Select
          label="Currency"
          name="currency"
          value={tradeDetails.currency}
          onChange={handleTradeDetailsChange}
          options={currencyOptions}
          required
        />

        <Input
          label="Country of Origin"
          name="countryOfOrigin"
          value={tradeDetails.countryOfOrigin}
          onChange={handleTradeDetailsChange}
          required
          placeholder="Enter country of origin"
        />

        <Input
          label="Destination Country"
          name="destinationCountry"
          value={tradeDetails.destinationCountry}
          onChange={handleTradeDetailsChange}
          required
          placeholder="Enter destination country"
        />

        <Select
          label="Incoterms"
          name="incoterms"
          value={tradeDetails.incoterms}
          onChange={handleTradeDetailsChange}
          options={incotermsOptions}
          required
        />

        <Input
          label="Shipping Date"
          name="shippingDate"
          type="date"
          value={tradeDetails.shippingDate}
          onChange={handleTradeDetailsChange}
          min={new Date().toISOString().split('T')[0]}
          required
        />

        <Input
          label="Expected Delivery Date"
          name="expectedDeliveryDate"
          type="date"
          value={tradeDetails.expectedDeliveryDate}
          onChange={handleTradeDetailsChange}
          min={tradeDetails.shippingDate}
          required
        />

        <Select
          label="Payment Terms"
          name="paymentTerms"
          value={tradeDetails.paymentTerms}
          onChange={handleTradeDetailsChange}
          options={paymentTermsOptions}
          required
        />

        <Select
          label="Payment Method"
          name="paymentMethod"
          value={tradeDetails.paymentMethod}
          onChange={handleTradeDetailsChange}
          options={paymentMethodOptions}
          required
        />

        <div className="md:col-span-2">
          <Textarea
            label="Special Instructions"
            name="specialInstructions"
            value={tradeDetails.specialInstructions || ''}
            onChange={handleTradeDetailsChange}
            rows={3}
            placeholder="Any special instructions or notes regarding this shipment..."
          />
        </div>
      </div>
    </div>
  );
};

export default TradeDetailsTab;
