export interface PaymentGateway {
  id: string;
  name: string;
  type: 'stripe' | 'paypal' | 'razorpay' | 'square' | 'hyperpay' | 'adyen';
  logo: string;
  isActive: boolean;
  integrationLevel: 'chain' | 'brand' | 'property';
  inheritedFrom?: string; // ID of parent level if inherited
  config?: Record<string, any>;
  appliedTo?: string[]; // Array of property IDs when applied to multiple properties
  createdAt?: string;
  updatedAt?: string;
  canEdit?: boolean; // Based on user permissions
  canDelete?: boolean; // Based on user permissions
}

export interface Property {
  id: string;
  name: string;
  brandId: string;
  brandName: string;
  chainId: string;
  chainName: string;
  paymentGateways: PaymentGateway[];
  location: string;
  status: 'active' | 'inactive';
  isSelected?: boolean; // For multi-selection
}

export interface Brand {
  id: string;
  name: string;
  chainId: string;
  chainName: string;
  properties: Property[];
  paymentGateways: PaymentGateway[];
  isSelected?: boolean; // For multi-selection
}

export interface Chain {
  id: string;
  name: string;
  brands: Brand[];
  paymentGateways: PaymentGateway[];
  isSelected?: boolean; // For multi-selection
}

export interface PaymentGatewayConfig {
  stripe: {
    publishableKey: string;
    secretKey: string;
    webhookSecret: string;
  };
  paypal: {
    clientId: string;
    clientSecret: string;
    environment: 'sandbox' | 'production';
  };
  razorpay: {
    keyId: string;
    keySecret: string;
    webhookSecret: string;
  };
  square: {
    applicationId: string;
    accessToken: string;
    environment: 'sandbox' | 'production';
  };
  hyperpay: {
    merchantId: string;
    secretKey: string;
    environment: 'test' | 'live';
  };
  adyen: {
    merchantAccount: string;
    apiKey: string;
    environment: 'test' | 'live';
  };
}

export interface UserPermissions {
  canEditBrand: boolean;
  canEditProperty: boolean;
  canDeleteBrand: boolean;
  canDeleteProperty: boolean;
  canAddGateway: boolean;
}