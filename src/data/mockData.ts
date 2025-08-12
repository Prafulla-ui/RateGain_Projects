import { Chain, Brand, Property, PaymentGateway, UserPermissions } from '../types/paymentGateway';

export const mockPaymentGateways: PaymentGateway[] = [
  {
    id: 'pg-1',
    name: 'Stripe',
    type: 'stripe',
    logo: 'https://cdn.worldvectorlogo.com/logos/stripe-4.svg',
    isActive: true,
    integrationLevel: 'chain',
    canEdit: true,
    canDelete: true,
  },
  {
    id: 'pg-2',
    name: 'PayPal',
    type: 'paypal',
    logo: 'https://cdn.worldvectorlogo.com/logos/paypal-3.svg',
    isActive: true,
    integrationLevel: 'brand',
    canEdit: true,
    canDelete: true,
  },
  {
    id: 'pg-3',
    name: 'Razorpay',
    type: 'razorpay',
    logo: 'https://razorpay.com/favicon.png',
    isActive: true,
    integrationLevel: 'property',
    canEdit: true,
    canDelete: true,
  },
];

export const mockChains: Chain[] = [
  {
    id: 'chain-1',
    name: 'Luxury Hotels Group',
    paymentGateways: [], // Empty for testing empty state
    brands: [
      {
        id: 'brand-1',
        name: 'Premium Suites',
        chainId: 'chain-1',
        chainName: 'Luxury Hotels Group',
        paymentGateways: [], // Empty for testing empty state
        properties: [
          {
            id: 'prop-1',
            name: 'Premium Suites Downtown',
            brandId: 'brand-1',
            brandName: 'Premium Suites',
            chainId: 'chain-1',
            chainName: 'Luxury Hotels Group',
            location: 'New York, NY',
            status: 'active',
            paymentGateways: [], // Empty for testing empty state
          },
          {
            id: 'prop-2',
            name: 'Premium Suites Midtown',
            brandId: 'brand-1',
            brandName: 'Premium Suites',
            chainId: 'chain-1',
            chainName: 'Luxury Hotels Group',
            location: 'New York, NY',
            status: 'active',
            paymentGateways: [], // Empty for testing empty state
          },
          {
            id: 'prop-3',
            name: 'Premium Suites Uptown',
            brandId: 'brand-1',
            brandName: 'Premium Suites',
            chainId: 'chain-1',
            chainName: 'Luxury Hotels Group',
            location: 'New York, NY',
            status: 'active',
            paymentGateways: [], // Empty for testing empty state
          },
        ],
      },
      {
        id: 'brand-2',
        name: 'Business Hotels',
        chainId: 'chain-1',
        chainName: 'Luxury Hotels Group',
        paymentGateways: [],
        properties: [
          {
            id: 'prop-4',
            name: 'Business Hotel Central',
            brandId: 'brand-2',
            brandName: 'Business Hotels',
            chainId: 'chain-1',
            chainName: 'Luxury Hotels Group',
            location: 'Chicago, IL',
            status: 'active',
            paymentGateways: [],
          },
          {
            id: 'prop-5',
            name: 'Business Hotel North',
            brandId: 'brand-2',
            brandName: 'Business Hotels',
            chainId: 'chain-1',
            chainName: 'Luxury Hotels Group',
            location: 'Chicago, IL',
            status: 'active',
            paymentGateways: [],
          },
        ],
      },
    ],
  },
];

export const availablePaymentGateways = [
  { id: 'stripe', name: 'Stripe', logo: 'https://cdn.worldvectorlogo.com/logos/stripe-4.svg' },
  { id: 'paypal', name: 'PayPal', logo: 'https://cdn.worldvectorlogo.com/logos/paypal-3.svg' },
  { id: 'razorpay', name: 'Razorpay', logo: 'https://razorpay.com/favicon.png' },
  { id: 'airpay', name: 'Air Pay', logo: 'https://loyalty.airpay.co.in/img/airpaylogo.png' },
  { id: 'reddotpayment', name: 'Red Dot Payment', logo: 'https://upload.wikimedia.org/wikipedia/commons/f/fd/Red_Dot_Payment_logo.png' },
  { id: 'hyperpay', name: 'HyperPay', logo: 'https://image.pitchbook.com/sZCjcMOqDUPLq7EoqSM3vsOQNXT1744795249004_200x200' },
  { id: 'iolpay', name: 'IOL Pay', logo: 'https://via.placeholder.com/150x60/059669/FFFFFF?text=IOL+Pay' },
  { id: 'adyen', name: 'Adyen', logo: 'https://www.adyen.com/static/images/adyen-logo.svg' },
];

export const mockUserPermissions: UserPermissions = {
  canEditBrand: true,
  canEditProperty: true,
  canDeleteBrand: true,
  canDeleteProperty: true,
  canAddGateway: true,
};