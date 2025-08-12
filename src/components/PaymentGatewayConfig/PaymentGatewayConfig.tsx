import React, { useState } from 'react';
import { ArrowLeft, Edit3, Trash2, Check, X } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Switch } from '../ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';

interface PropertyConfig {
  id: string;
  propertyName: string;
  brandName: string;
  mid: string;
  secretKey: string;
  isActive: boolean;
  isEditing: boolean;
}

interface PaymentGatewayConfigProps {
  selectedGateways: string[];
  onBack: () => void;
}

const mockProperties: PropertyConfig[] = [
  {
    id: '1',
    propertyName: 'Grand Hotel Downtown',
    brandName: 'Luxury Collection',
    mid: 'MID123456789',
    secretKey: 'sk_test_123456789abcdef',
    isActive: true,
    isEditing: false,
  },
  {
    id: '2',
    propertyName: 'Seaside Resort & Spa',
    brandName: 'Luxury Collection',
    mid: 'MID987654321',
    secretKey: 'sk_test_987654321fedcba',
    isActive: false,
    isEditing: false,
  },
  {
    id: '3',
    propertyName: 'Business Center Hotel',
    brandName: 'Business Hotels',
    mid: 'MID456789123',
    secretKey: 'sk_test_456789123cba',
    isActive: true,
    isEditing: false,
  },
  {
    id: '4',
    propertyName: 'Airport Express Inn',
    brandName: 'Budget Hotels',
    mid: 'MID789123456',
    secretKey: 'sk_test_789123456abc',
    isActive: false,
    isEditing: false,
  },
  {
    id: '5',
    propertyName: 'Mountain View Lodge',
    brandName: 'Resort Collection',
    mid: 'MID321654987',
    secretKey: 'sk_test_321654987def',
    isActive: true,
    isEditing: false,
  },
];

export const PaymentGatewayConfig: React.FC<PaymentGatewayConfigProps> = ({
  selectedGateways,
  onBack,
}) => {
  const [activeTab, setActiveTab] = useState(selectedGateways[0]);
  const [properties, setProperties] = useState<PropertyConfig[]>(mockProperties);
  const [editingProperty, setEditingProperty] = useState<string | null>(null);

  const handleEdit = (propertyId: string) => {
    setEditingProperty(propertyId);
    setProperties(prev => 
      prev.map(prop => 
        prop.id === propertyId ? { ...prop, isEditing: true } : prop
      )
    );
  };

  const handleSave = (propertyId: string) => {
    setEditingProperty(null);
    setProperties(prev => 
      prev.map(prop => 
        prop.id === propertyId ? { ...prop, isEditing: false } : prop
      )
    );
  };

  const handleCancel = (propertyId: string) => {
    setEditingProperty(null);
    setProperties(prev => 
      prev.map(prop => 
        prop.id === propertyId ? { ...prop, isEditing: false } : prop
      )
    );
  };

  const handleDelete = (propertyId: string) => {
    setProperties(prev => prev.filter(prop => prop.id !== propertyId));
  };

  const handleToggleActive = (propertyId: string) => {
    setProperties(prev => 
      prev.map(prop => 
        prop.id === propertyId ? { ...prop, isActive: !prop.isActive } : prop
      )
    );
  };

  const handleInputChange = (propertyId: string, field: 'mid' | 'secretKey', value: string) => {
    setProperties(prev => 
      prev.map(prop => 
        prop.id === propertyId ? { ...prop, [field]: value } : prop
      )
    );
  };

  const getGatewayLogo = (gateway: string) => {
    switch (gateway) {
      case 'stripe':
        return "https://cdn.worldvectorlogo.com/logos/stripe-4.svg";
      case 'paypal':
        return "https://cdn.worldvectorlogo.com/logos/paypal-3.svg";
      case 'razorpay':
        return "https://razorpay.com/favicon.png";
              case 'airpay':
      return "https://loyalty.airpay.co.in/img/airpaylogo.png";
    case 'reddotpayment':
      return "https://upload.wikimedia.org/wikipedia/commons/f/fd/Red_Dot_Payment_logo.png";
    case 'hyperpay':
      return "https://image.pitchbook.com/sZCjcMOqDUPLq7EoqSM3vsOQNXT1744795249004_200x200";
    case 'adyen':
      return "https://www.adyen.com/static/images/adyen-logo.svg";
    case 'iolpay':
      return "https://via.placeholder.com/150x60/059669/FFFFFF?text=IOL+Pay";
      case 'worldpay':
        return "https://cdn.worldvectorlogo.com/logos/worldpay-1.svg";
          case 'braintree':
      return "https://uploads.sitepoint.com/wp-content/uploads/2014/08/1409502454Braintree-Logo.jpg";
      case 'klarna':
        return "https://cdn.worldvectorlogo.com/logos/klarna-1.svg";
      default:
        return "https://cdn.worldvectorlogo.com/logos/stripe-4.svg";
    }
  };

  const getGatewayName = (gateway: string) => {
    switch (gateway) {
      case 'stripe':
        return 'Stripe';
      case 'paypal':
        return 'PayPal';
      default:
        return 'Razorpay';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with Back Button */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
          <div className="h-6 w-px bg-gray-300" />
          <h1 className="text-xl font-semibold text-gray-900">
            Configure Payment Gateways
          </h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Selected Payment Gateways Tabs */}
        <div className="mb-8">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Selected Payment Gateways</h2>
          <div className="flex gap-2">
            {selectedGateways.map((gateway) => (
              <button
                key={gateway}
                onClick={() => setActiveTab(gateway)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg border-2 transition-all ${
                  activeTab === gateway
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                }`}
              >
                <img
                  src={getGatewayLogo(gateway)}
                  alt={getGatewayName(gateway)}
                  className="w-8 h-6 object-contain rounded"
                />
                <span className="font-medium capitalize">{getGatewayName(gateway)}</span>
                <Badge variant="outline" className="ml-2">
                  {properties.filter(p => p.isActive).length} Active
                </Badge>
              </button>
            ))}
          </div>
        </div>

        {/* Configuration Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <img
                src={getGatewayLogo(activeTab)}
                alt={getGatewayName(activeTab)}
                className="w-8 h-6 object-contain rounded"
              />
              {getGatewayName(activeTab)} Configuration
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Property Name</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Brand Name</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">MID</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Secret Key</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Active</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {properties.map((property) => (
                    <tr key={property.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-4 px-4">
                        <div className="font-medium text-gray-900">{property.propertyName}</div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="text-gray-600">{property.brandName}</div>
                      </td>
                      <td className="py-4 px-4">
                        {property.isEditing ? (
                          <Input
                            value={property.mid}
                            onChange={(e) => handleInputChange(property.id, 'mid', e.target.value)}
                            className="w-full"
                            placeholder="Enter MID"
                          />
                        ) : (
                          <div className="text-gray-900">{property.mid}</div>
                        )}
                      </td>
                      <td className="py-4 px-4">
                        {property.isEditing ? (
                          <Input
                            value={property.secretKey}
                            onChange={(e) => handleInputChange(property.id, 'secretKey', e.target.value)}
                            className="w-full"
                            placeholder="Enter Secret Key"
                            type="password"
                          />
                        ) : (
                          <div className="text-gray-900">
                            {property.secretKey.substring(0, 8)}...
                          </div>
                        )}
                      </td>
                      <td className="py-4 px-4">
                        <Switch
                          checked={property.isActive}
                          onCheckedChange={() => handleToggleActive(property.id)}
                          disabled={!property.isEditing}
                        />
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          {property.isEditing ? (
                            <>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleSave(property.id)}
                                className="text-green-600 hover:text-green-700"
                              >
                                <Check className="w-4 h-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleCancel(property.id)}
                                className="text-red-600 hover:text-red-700"
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            </>
                          ) : (
                            <>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleEdit(property.id)}
                                className="text-blue-600 hover:text-blue-700"
                              >
                                <Edit3 className="w-4 h-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleDelete(property.id)}
                                className="text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}; 