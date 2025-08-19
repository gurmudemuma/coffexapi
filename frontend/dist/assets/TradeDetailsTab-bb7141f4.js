import { j as e } from './index-f2b0fd91.js';
const r = ({ tradeDetails: s, handleTradeDetailsChange: n }) =>
  e.jsxs('div', {
    className: 'space-y-6',
    children: [
      e.jsx('h2', {
        className: 'text-xl font-semibold',
        children: 'Trade Details',
      }),
      e.jsx('p', {
        className: 'text-muted-foreground',
        children: 'Provide information about the goods being exported.',
      }),
      e.jsxs('div', {
        className: 'grid grid-cols-1 md:grid-cols-2 gap-6',
        children: [
          e.jsxs('div', {
            className: 'space-y-2',
            children: [
              e.jsxs('label', {
                htmlFor: 'productName',
                className: 'block text-sm font-medium',
                children: [
                  'Product Name ',
                  e.jsx('span', { className: 'text-red-500', children: '*' }),
                ],
              }),
              e.jsx('input', {
                type: 'text',
                id: 'productName',
                name: 'productName',
                value: s.productName,
                onChange: n,
                className: 'w-full px-3 py-2 border rounded-md',
                required: !0,
              }),
            ],
          }),
          e.jsxs('div', {
            className: 'space-y-2 md:col-span-2',
            children: [
              e.jsx('label', {
                htmlFor: 'productDescription',
                className: 'block text-sm font-medium',
                children: 'Product Description',
              }),
              e.jsx('textarea', {
                id: 'productDescription',
                name: 'productDescription',
                value: s.productDescription,
                onChange: n,
                rows: 3,
                className: 'w-full px-3 py-2 border rounded-md',
              }),
            ],
          }),
          e.jsxs('div', {
            className: 'space-y-2',
            children: [
              e.jsxs('label', {
                htmlFor: 'quantity',
                className: 'block text-sm font-medium',
                children: [
                  'Quantity ',
                  e.jsx('span', { className: 'text-red-500', children: '*' }),
                ],
              }),
              e.jsxs('div', {
                className: 'flex',
                children: [
                  e.jsx('input', {
                    type: 'number',
                    id: 'quantity',
                    name: 'quantity',
                    min: '0',
                    step: '0.001',
                    value: s.quantity,
                    onChange: n,
                    className: 'w-3/4 px-3 py-2 border rounded-l-md',
                    required: !0,
                  }),
                  e.jsxs('select', {
                    name: 'unit',
                    value: s.unit,
                    onChange: n,
                    className:
                      'w-1/4 px-2 py-2 border-t border-b border-r rounded-r-md bg-gray-50',
                    children: [
                      e.jsx('option', { value: 'kg', children: 'kg' }),
                      e.jsx('option', { value: 'g', children: 'g' }),
                      e.jsx('option', { value: 'lb', children: 'lb' }),
                      e.jsx('option', { value: 'oz', children: 'oz' }),
                      e.jsx('option', { value: 'l', children: 'l' }),
                      e.jsx('option', { value: 'ml', children: 'ml' }),
                      e.jsx('option', { value: 'piece', children: 'piece' }),
                      e.jsx('option', { value: 'box', children: 'box' }),
                      e.jsx('option', { value: 'carton', children: 'carton' }),
                    ],
                  }),
                ],
              }),
            ],
          }),
          e.jsxs('div', {
            className: 'space-y-2',
            children: [
              e.jsxs('label', {
                htmlFor: 'unitPrice',
                className: 'block text-sm font-medium',
                children: [
                  'Unit Price ',
                  e.jsx('span', { className: 'text-red-500', children: '*' }),
                ],
              }),
              e.jsxs('div', {
                className: 'relative',
                children: [
                  e.jsx('span', {
                    className: 'absolute left-3 top-2.5 text-gray-500',
                    children: '$',
                  }),
                  e.jsx('input', {
                    type: 'number',
                    id: 'unitPrice',
                    name: 'unitPrice',
                    min: '0',
                    step: '0.01',
                    value: s.unitPrice,
                    onChange: n,
                    className: 'w-full pl-8 pr-3 py-2 border rounded-md',
                    required: !0,
                  }),
                ],
              }),
            ],
          }),
          e.jsxs('div', {
            className: 'space-y-2',
            children: [
              e.jsx('label', {
                className: 'block text-sm font-medium',
                children: 'Total Value',
              }),
              e.jsxs('div', {
                className: 'px-3 py-2 border rounded-md bg-gray-50',
                children: ['$', s.totalValue.toFixed(2), ' ', s.currency],
              }),
            ],
          }),
          e.jsxs('div', {
            className: 'space-y-2',
            children: [
              e.jsxs('label', {
                htmlFor: 'currency',
                className: 'block text-sm font-medium',
                children: [
                  'Currency ',
                  e.jsx('span', { className: 'text-red-500', children: '*' }),
                ],
              }),
              e.jsxs('select', {
                id: 'currency',
                name: 'currency',
                value: s.currency,
                onChange: n,
                className: 'w-full px-3 py-2 border rounded-md',
                required: !0,
                children: [
                  e.jsx('option', { value: 'USD', children: 'USD' }),
                  e.jsx('option', { value: 'EUR', children: 'EUR' }),
                  e.jsx('option', { value: 'GBP', children: 'GBP' }),
                  e.jsx('option', { value: 'JPY', children: 'JPY' }),
                  e.jsx('option', { value: 'AUD', children: 'AUD' }),
                  e.jsx('option', { value: 'CAD', children: 'CAD' }),
                  e.jsx('option', { value: 'CHF', children: 'CHF' }),
                  e.jsx('option', { value: 'CNY', children: 'CNY' }),
                ],
              }),
            ],
          }),
          e.jsxs('div', {
            className: 'space-y-2',
            children: [
              e.jsxs('label', {
                htmlFor: 'countryOfOrigin',
                className: 'block text-sm font-medium',
                children: [
                  'Country of Origin ',
                  e.jsx('span', { className: 'text-red-500', children: '*' }),
                ],
              }),
              e.jsx('input', {
                type: 'text',
                id: 'countryOfOrigin',
                name: 'countryOfOrigin',
                value: s.countryOfOrigin,
                onChange: n,
                className: 'w-full px-3 py-2 border rounded-md',
                required: !0,
              }),
            ],
          }),
          e.jsxs('div', {
            className: 'space-y-2',
            children: [
              e.jsxs('label', {
                htmlFor: 'destinationCountry',
                className: 'block text-sm font-medium',
                children: [
                  'Destination Country ',
                  e.jsx('span', { className: 'text-red-500', children: '*' }),
                ],
              }),
              e.jsx('input', {
                type: 'text',
                id: 'destinationCountry',
                name: 'destinationCountry',
                value: s.destinationCountry,
                onChange: n,
                className: 'w-full px-3 py-2 border rounded-md',
                required: !0,
              }),
            ],
          }),
          e.jsxs('div', {
            className: 'space-y-2',
            children: [
              e.jsxs('label', {
                htmlFor: 'incoterms',
                className: 'block text-sm font-medium',
                children: [
                  'Incoterms ',
                  e.jsx('span', { className: 'text-red-500', children: '*' }),
                ],
              }),
              e.jsxs('select', {
                id: 'incoterms',
                name: 'incoterms',
                value: s.incoterms,
                onChange: n,
                className: 'w-full px-3 py-2 border rounded-md',
                required: !0,
                children: [
                  e.jsx('option', { value: 'EXW', children: 'EXW - Ex Works' }),
                  e.jsx('option', {
                    value: 'FOB',
                    children: 'FOB - Free On Board',
                  }),
                  e.jsx('option', {
                    value: 'CIF',
                    children: 'CIF - Cost, Insurance & Freight',
                  }),
                  e.jsx('option', {
                    value: 'CIP',
                    children: 'CIP - Carriage & Insurance Paid To',
                  }),
                  e.jsx('option', {
                    value: 'DAP',
                    children: 'DAP - Delivered At Place',
                  }),
                  e.jsx('option', {
                    value: 'DPU',
                    children: 'DPU - Delivered at Place Unloaded',
                  }),
                  e.jsx('option', {
                    value: 'DDP',
                    children: 'DDP - Delivered Duty Paid',
                  }),
                ],
              }),
            ],
          }),
          e.jsxs('div', {
            className: 'space-y-2',
            children: [
              e.jsxs('label', {
                htmlFor: 'shippingDate',
                className: 'block text-sm font-medium',
                children: [
                  'Shipping Date ',
                  e.jsx('span', { className: 'text-red-500', children: '*' }),
                ],
              }),
              e.jsx('input', {
                type: 'date',
                id: 'shippingDate',
                name: 'shippingDate',
                value: s.shippingDate,
                onChange: n,
                min: new Date().toISOString().split('T')[0],
                className: 'w-full px-3 py-2 border rounded-md',
                required: !0,
              }),
            ],
          }),
          e.jsxs('div', {
            className: 'space-y-2',
            children: [
              e.jsxs('label', {
                htmlFor: 'expectedDeliveryDate',
                className: 'block text-sm font-medium',
                children: [
                  'Expected Delivery Date ',
                  e.jsx('span', { className: 'text-red-500', children: '*' }),
                ],
              }),
              e.jsx('input', {
                type: 'date',
                id: 'expectedDeliveryDate',
                name: 'expectedDeliveryDate',
                value: s.expectedDeliveryDate,
                onChange: n,
                min: s.shippingDate,
                className: 'w-full px-3 py-2 border rounded-md',
                required: !0,
              }),
            ],
          }),
          e.jsxs('div', {
            className: 'space-y-2',
            children: [
              e.jsxs('label', {
                htmlFor: 'paymentTerms',
                className: 'block text-sm font-medium',
                children: [
                  'Payment Terms ',
                  e.jsx('span', { className: 'text-red-500', children: '*' }),
                ],
              }),
              e.jsxs('select', {
                id: 'paymentTerms',
                name: 'paymentTerms',
                value: s.paymentTerms,
                onChange: n,
                className: 'w-full px-3 py-2 border rounded-md',
                required: !0,
                children: [
                  e.jsx('option', {
                    value: '30 days',
                    children: 'Net 30 days',
                  }),
                  e.jsx('option', {
                    value: '60 days',
                    children: 'Net 60 days',
                  }),
                  e.jsx('option', {
                    value: '90 days',
                    children: 'Net 90 days',
                  }),
                  e.jsx('option', {
                    value: 'advance',
                    children: 'Advance payment',
                  }),
                  e.jsx('option', {
                    value: 'on delivery',
                    children: 'On delivery',
                  }),
                  e.jsx('option', {
                    value: 'custom',
                    children: 'Custom terms',
                  }),
                ],
              }),
            ],
          }),
          e.jsxs('div', {
            className: 'space-y-2',
            children: [
              e.jsxs('label', {
                htmlFor: 'paymentMethod',
                className: 'block text-sm font-medium',
                children: [
                  'Payment Method ',
                  e.jsx('span', { className: 'text-red-500', children: '*' }),
                ],
              }),
              e.jsxs('select', {
                id: 'paymentMethod',
                name: 'paymentMethod',
                value: s.paymentMethod,
                onChange: n,
                className: 'w-full px-3 py-2 border rounded-md',
                required: !0,
                children: [
                  e.jsx('option', {
                    value: 'Bank Transfer',
                    children: 'Bank Transfer',
                  }),
                  e.jsx('option', {
                    value: 'Letter of Credit',
                    children: 'Letter of Credit',
                  }),
                  e.jsx('option', {
                    value: 'Documentary Collection',
                    children: 'Documentary Collection',
                  }),
                  e.jsx('option', {
                    value: 'Cash in Advance',
                    children: 'Cash in Advance',
                  }),
                  e.jsx('option', {
                    value: 'Online Payment',
                    children: 'Online Payment',
                  }),
                ],
              }),
            ],
          }),
          e.jsxs('div', {
            className: 'space-y-2 md:col-span-2',
            children: [
              e.jsx('label', {
                htmlFor: 'specialInstructions',
                className: 'block text-sm font-medium',
                children: 'Special Instructions',
              }),
              e.jsx('textarea', {
                id: 'specialInstructions',
                name: 'specialInstructions',
                value: s.specialInstructions || '',
                onChange: n,
                rows: 3,
                className: 'w-full px-3 py-2 border rounded-md',
                placeholder:
                  'Any special instructions or notes regarding this shipment...',
              }),
            ],
          }),
        ],
      }),
    ],
  });
export { r as default };
