import React from 'react';

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
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-black">Trade Details</h2>
      <p className="text-purple-600">
        Provide information about the goods being exported.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label htmlFor="productName" className="block text-sm font-medium text-black">
            Product Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="productName"
            name="productName"
            value={tradeDetails.productName}
            onChange={handleTradeDetailsChange}
            className="w-full px-3 py-2 border border-purple-200 rounded-md focus:border-purple-400 focus:outline-none"
            required
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <label
            htmlFor="productDescription"
            className="block text-sm font-medium text-black"
          >
            Product Description
          </label>
          <textarea
            id="productDescription"
            name="productDescription"
            value={tradeDetails.productDescription}
            onChange={handleTradeDetailsChange}
            rows={3}
            className="w-full px-3 py-2 border border-purple-200 rounded-md focus:border-purple-400 focus:outline-none"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="quantity" className="block text-sm font-medium text-black">
            Quantity <span className="text-red-500">*</span>
          </label>
          <div className="flex">
            <input
              type="number"
              id="quantity"
              name="quantity"
              min="0"
              step="0.001"
              value={tradeDetails.quantity}
              onChange={handleTradeDetailsChange}
              className="w-3/4 px-3 py-2 border border-purple-200 rounded-l-md focus:border-purple-400 focus:outline-none"
              required
            />
            <select
              name="unit"
              value={tradeDetails.unit}
              onChange={handleTradeDetailsChange}
              className="w-1/4 px-2 py-2 border-t border-b border-r border-purple-200 rounded-r-md bg-purple-50 focus:border-purple-400 focus:outline-none"
            >
              <option value="kg">kg</option>
              <option value="g">g</option>
              <option value="lb">lb</option>
              <option value="oz">oz</option>
              <option value="l">l</option>
              <option value="ml">ml</option>
              <option value="piece">piece</option>
              <option value="box">box</option>
              <option value="carton">carton</option>
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="unitPrice" className="block text-sm font-medium text-black">
            Unit Price <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <span className="absolute left-3 top-2.5 text-purple-600">$</span>
            <input
              type="number"
              id="unitPrice"
              name="unitPrice"
              min="0"
              step="0.01"
              value={tradeDetails.unitPrice}
              onChange={handleTradeDetailsChange}
              className="w-full pl-8 pr-3 py-2 border border-purple-200 rounded-md focus:border-purple-400 focus:outline-none"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-black">Total Value</label>
          <div className="px-3 py-2 border border-purple-200 rounded-md bg-purple-50 text-black">
            ${tradeDetails.totalValue.toFixed(2)} {tradeDetails.currency}
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="currency" className="block text-sm font-medium text-black">
            Currency <span className="text-red-500">*</span>
          </label>
          <select
            id="currency"
            name="currency"
            value={tradeDetails.currency}
            onChange={handleTradeDetailsChange}
            className="w-full px-3 py-2 border border-purple-200 rounded-md focus:border-purple-400 focus:outline-none"
            required
          >
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
            <option value="GBP">GBP</option>
            <option value="JPY">JPY</option>
            <option value="AUD">AUD</option>
            <option value="CAD">CAD</option>
            <option value="CHF">CHF</option>
            <option value="CNY">CNY</option>
          </select>
        </div>

        <div className="space-y-2">
          <label
            htmlFor="countryOfOrigin"
            className="block text-sm font-medium text-black"
          >
            Country of Origin <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="countryOfOrigin"
            name="countryOfOrigin"
            value={tradeDetails.countryOfOrigin}
            onChange={handleTradeDetailsChange}
            className="w-full px-3 py-2 border border-purple-200 rounded-md focus:border-purple-400 focus:outline-none"
            required
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="destinationCountry"
            className="block text-sm font-medium text-black"
          >
            Destination Country <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="destinationCountry"
            name="destinationCountry"
            value={tradeDetails.destinationCountry}
            onChange={handleTradeDetailsChange}
            className="w-full px-3 py-2 border border-purple-200 rounded-md focus:border-purple-400 focus:outline-none"
            required
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="incoterms" className="block text-sm font-medium text-black">
            Incoterms <span className="text-red-500">*</span>
          </label>
          <select
            id="incoterms"
            name="incoterms"
            value={tradeDetails.incoterms}
            onChange={handleTradeDetailsChange}
            className="w-full px-3 py-2 border border-purple-200 rounded-md focus:border-purple-400 focus:outline-none"
            required
          >
            <option value="EXW">EXW - Ex Works</option>
            <option value="FOB">FOB - Free On Board</option>
            <option value="CIF">CIF - Cost, Insurance & Freight</option>
            <option value="CIP">CIP - Carriage & Insurance Paid To</option>
            <option value="DAP">DAP - Delivered At Place</option>
            <option value="DPU">DPU - Delivered at Place Unloaded</option>
            <option value="DDP">DDP - Delivered Duty Paid</option>
          </select>
        </div>

        <div className="space-y-2">
          <label htmlFor="shippingDate" className="block text-sm font-medium text-black">
            Shipping Date <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            id="shippingDate"
            name="shippingDate"
            value={tradeDetails.shippingDate}
            onChange={handleTradeDetailsChange}
            min={new Date().toISOString().split('T')[0]}
            className="w-full px-3 py-2 border border-purple-200 rounded-md focus:border-purple-400 focus:outline-none"
            required
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="expectedDeliveryDate"
            className="block text-sm font-medium text-black"
          >
            Expected Delivery Date <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            id="expectedDeliveryDate"
            name="expectedDeliveryDate"
            value={tradeDetails.expectedDeliveryDate}
            onChange={handleTradeDetailsChange}
            min={tradeDetails.shippingDate}
            className="w-full px-3 py-2 border border-purple-200 rounded-md focus:border-purple-400 focus:outline-none"
            required
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="paymentTerms" className="block text-sm font-medium text-black">
            Payment Terms <span className="text-red-500">*</span>
          </label>
          <select
            id="paymentTerms"
            name="paymentTerms"
            value={tradeDetails.paymentTerms}
            onChange={handleTradeDetailsChange}
            className="w-full px-3 py-2 border border-purple-200 rounded-md focus:border-purple-400 focus:outline-none"
            required
          >
            <option value="30 days">Net 30 days</option>
            <option value="60 days">Net 60 days</option>
            <option value="90 days">Net 90 days</option>
            <option value="advance">Advance payment</option>
            <option value="on delivery">On delivery</option>
            <option value="custom">Custom terms</option>
          </select>
        </div>

        <div className="space-y-2">
          <label htmlFor="paymentMethod" className="block text-sm font-medium text-black">
            Payment Method <span className="text-red-500">*</span>
          </label>
          <select
            id="paymentMethod"
            name="paymentMethod"
            value={tradeDetails.paymentMethod}
            onChange={handleTradeDetailsChange}
            className="w-full px-3 py-2 border border-purple-200 rounded-md focus:border-purple-400 focus:outline-none"
            required
          >
            <option value="Bank Transfer">Bank Transfer</option>
            <option value="Letter of Credit">Letter of Credit</option>
            <option value="Documentary Collection">
              Documentary Collection
            </option>
            <option value="Cash in Advance">Cash in Advance</option>
            <option value="Online Payment">Online Payment</option>
          </select>
        </div>

        <div className="space-y-2 md:col-span-2">
          <label
            htmlFor="specialInstructions"
            className="block text-sm font-medium text-black"
          >
            Special Instructions
          </label>
          <textarea
            id="specialInstructions"
            name="specialInstructions"
            value={tradeDetails.specialInstructions || ''}
            onChange={handleTradeDetailsChange}
            rows={3}
            className="w-full px-3 py-2 border border-purple-200 rounded-md focus:border-purple-400 focus:outline-none"
            placeholder="Any special instructions or notes regarding this shipment..."
          />
        </div>
      </div>
    </div>
  );
};

export default TradeDetailsTab;
