import { j as e } from './index-f2b0fd91.js';
const l = ({ exporterDetails: s, handleExporterDetailsChange: a }) =>
  e.jsxs('div', {
    className: 'space-y-6',
    children: [
      e.jsx('h2', {
        className: 'text-xl font-semibold',
        children: 'Exporter Information',
      }),
      e.jsx('p', {
        className: 'text-muted-foreground',
        children:
          'Please provide your company information. All fields are required.',
      }),
      e.jsxs('div', {
        className: 'grid grid-cols-1 md:grid-cols-2 gap-6',
        children: [
          e.jsxs('div', {
            className: 'space-y-2',
            children: [
              e.jsxs('label', {
                htmlFor: 'companyName',
                className: 'block text-sm font-medium',
                children: [
                  'Company Name ',
                  e.jsx('span', { className: 'text-red-500', children: '*' }),
                ],
              }),
              e.jsx('input', {
                type: 'text',
                id: 'companyName',
                name: 'companyName',
                value: s.companyName,
                onChange: a,
                className: 'w-full px-3 py-2 border rounded-md',
                required: !0,
              }),
            ],
          }),
          e.jsxs('div', {
            className: 'space-y-2',
            children: [
              e.jsxs('label', {
                htmlFor: 'registrationNumber',
                className: 'block text-sm font-medium',
                children: [
                  'Registration Number ',
                  e.jsx('span', { className: 'text-red-500', children: '*' }),
                ],
              }),
              e.jsx('input', {
                type: 'text',
                id: 'registrationNumber',
                name: 'registrationNumber',
                value: s.registrationNumber,
                onChange: a,
                className: 'w-full px-3 py-2 border rounded-md',
                required: !0,
              }),
            ],
          }),
          e.jsxs('div', {
            className: 'space-y-2',
            children: [
              e.jsxs('label', {
                htmlFor: 'taxId',
                className: 'block text-sm font-medium',
                children: [
                  'Tax ID ',
                  e.jsx('span', { className: 'text-red-500', children: '*' }),
                ],
              }),
              e.jsx('input', {
                type: 'text',
                id: 'taxId',
                name: 'taxId',
                value: s.taxId,
                onChange: a,
                className: 'w-full px-3 py-2 border rounded-md',
                required: !0,
              }),
            ],
          }),
          e.jsxs('div', {
            className: 'space-y-2',
            children: [
              e.jsxs('label', {
                htmlFor: 'contactPerson',
                className: 'block text-sm font-medium',
                children: [
                  'Contact Person ',
                  e.jsx('span', { className: 'text-red-500', children: '*' }),
                ],
              }),
              e.jsx('input', {
                type: 'text',
                id: 'contactPerson',
                name: 'contactPerson',
                value: s.contactPerson,
                onChange: a,
                className: 'w-full px-3 py-2 border rounded-md',
                required: !0,
              }),
            ],
          }),
          e.jsxs('div', {
            className: 'space-y-2',
            children: [
              e.jsxs('label', {
                htmlFor: 'email',
                className: 'block text-sm font-medium',
                children: [
                  'Email ',
                  e.jsx('span', { className: 'text-red-500', children: '*' }),
                ],
              }),
              e.jsx('input', {
                type: 'email',
                id: 'email',
                name: 'email',
                value: s.email,
                onChange: a,
                className: 'w-full px-3 py-2 border rounded-md',
                required: !0,
              }),
            ],
          }),
          e.jsxs('div', {
            className: 'space-y-2',
            children: [
              e.jsxs('label', {
                htmlFor: 'phone',
                className: 'block text-sm font-medium',
                children: [
                  'Phone ',
                  e.jsx('span', { className: 'text-red-500', children: '*' }),
                ],
              }),
              e.jsx('input', {
                type: 'tel',
                id: 'phone',
                name: 'phone',
                value: s.phone,
                onChange: a,
                className: 'w-full px-3 py-2 border rounded-md',
                required: !0,
              }),
            ],
          }),
          e.jsxs('div', {
            className: 'space-y-2 md:col-span-2',
            children: [
              e.jsxs('label', {
                htmlFor: 'address',
                className: 'block text-sm font-medium',
                children: [
                  'Street Address ',
                  e.jsx('span', { className: 'text-red-500', children: '*' }),
                ],
              }),
              e.jsx('input', {
                type: 'text',
                id: 'address',
                name: 'address',
                value: s.address,
                onChange: a,
                className: 'w-full px-3 py-2 border rounded-md',
                required: !0,
              }),
            ],
          }),
          e.jsxs('div', {
            className: 'space-y-2',
            children: [
              e.jsxs('label', {
                htmlFor: 'city',
                className: 'block text-sm font-medium',
                children: [
                  'City ',
                  e.jsx('span', { className: 'text-red-500', children: '*' }),
                ],
              }),
              e.jsx('input', {
                type: 'text',
                id: 'city',
                name: 'city',
                value: s.city,
                onChange: a,
                className: 'w-full px-3 py-2 border rounded-md',
                required: !0,
              }),
            ],
          }),
          e.jsxs('div', {
            className: 'space-y-2',
            children: [
              e.jsxs('label', {
                htmlFor: 'country',
                className: 'block text-sm font-medium',
                children: [
                  'Country ',
                  e.jsx('span', { className: 'text-red-500', children: '*' }),
                ],
              }),
              e.jsx('input', {
                type: 'text',
                id: 'country',
                name: 'country',
                value: s.country,
                onChange: a,
                className: 'w-full px-3 py-2 border rounded-md',
                required: !0,
              }),
            ],
          }),
          e.jsxs('div', {
            className: 'space-y-2',
            children: [
              e.jsxs('label', {
                htmlFor: 'postalCode',
                className: 'block text-sm font-medium',
                children: [
                  'Postal Code ',
                  e.jsx('span', { className: 'text-red-500', children: '*' }),
                ],
              }),
              e.jsx('input', {
                type: 'text',
                id: 'postalCode',
                name: 'postalCode',
                value: s.postalCode,
                onChange: a,
                className: 'w-full px-3 py-2 border rounded-md',
                required: !0,
              }),
            ],
          }),
        ],
      }),
    ],
  });
export { l as default };
