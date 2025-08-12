import React, { useState } from 'react';
import { ArrowLeft, Save, X, Users, Building2, MapPin, ExternalLink, CheckCircle, AlertCircle, Zap } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Switch } from '../ui/switch';
import { Badge } from '../ui/badge';
import { Checkbox } from '../ui/checkbox';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog';
import { mockChains, availablePaymentGateways, mockUserPermissions } from '../../data/mockData';
import { PaymentGateway, Property, PaymentGatewayConfig } from '../../types/paymentGateway';

interface PaymentGatewayFormProps {
  onBack: () => void;
  editingGateway?: PaymentGateway;
  editingProperty?: Property;
  selectedProperties?: Property[];
  isBulkOperation?: boolean;
}

export const PaymentGatewayForm: React.FC<PaymentGatewayFormProps> = ({
  onBack,
  editingGateway,
  editingProperty,
  selectedProperties = [],
  isBulkOperation = false,
}) => {
  const [formData, setFormData] = useState({
    integrationLevel: editingGateway?.integrationLevel || (isBulkOperation ? 'multiple-properties' : 'property'),
    chainId: editingProperty?.chainId || selectedProperties[0]?.chainId || '',
    brandId: editingProperty?.brandId || selectedProperties[0]?.brandId || '',
    propertyId: editingProperty?.id || '',
    selectedPropertyIds: selectedProperties.map(p => p.id),
    gatewayType: editingGateway?.type || '',
    isActive: editingGateway?.isActive ?? true,
    config: editingGateway?.config || {},
    applyToExisting: false,
    applyToSelected: 'all', // 'all' or 'selected'
  });

  const [gatewayConfig, setGatewayConfig] = useState<any>({
    clientId: editingGateway?.config?.clientId || '',
    clientSecret: editingGateway?.config?.clientSecret || '',
    publishableKey: editingGateway?.config?.publishableKey || '',
    secretKey: editingGateway?.config?.secretKey || '',
    environment: editingGateway?.config?.environment || 'sandbox',
  });
  const [customPropertySelection, setCustomPropertySelection] = useState<Set<string>>(
    new Set(selectedProperties.map(p => p.id))
  );
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [testConnectionResult, setTestConnectionResult] = useState<'success' | 'error' | null>(null);

  const selectedChain = mockChains.find(chain => chain.id === formData.chainId);
  const selectedBrand = selectedChain?.brands.find(brand => brand.id === formData.brandId);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleConfigChange = (field: string, value: string) => {
    setGatewayConfig((prev: any) => ({ ...prev, [field]: value }));
  };

  const handleGatewayActivation = (gatewayType: string) => {
    setFormData(prev => ({ ...prev, gatewayType, isActive: true }));
    setShowConfigModal(true);
  };

  const handleConfigSave = () => {
    console.log('Saving gateway configuration:', gatewayConfig);
    setShowConfigModal(false);
  };

  const testConnection = async () => {
    // Simulate API test
    setTestConnectionResult(null);
    setTimeout(() => {
      setTestConnectionResult(Math.random() > 0.3 ? 'success' : 'error');
    }, 1500);
  };

  const handleSave = () => {
    console.log('Saving payment gateway configuration:', {
      ...formData,
      config: gatewayConfig,
      selectedProperties: Array.from(customPropertySelection),
    });
    onBack();
  };

  const getAffectedPropertiesCount = () => {
    if (formData.integrationLevel === 'brand' && selectedBrand) {
      return selectedBrand.properties.length;
    }
    if (formData.integrationLevel === 'multiple-properties') {
      return customPropertySelection.size;
    }
    return 1;
  };

  const renderConfigModal = () => {
    const selectedGateway = availablePaymentGateways.find(gw => gw.id === formData.gatewayType);
    if (!selectedGateway) return null;

    return (
    <Dialog open={showConfigModal} onOpenChange={setShowConfigModal}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <img src={selectedGateway.logo} alt={selectedGateway.name} className="w-8 h-8 rounded" />
            {selectedGateway.name} Configuration
          </DialogTitle>
        </DialogHeader>


        <div className="space-y-6">
          <div className="space-y-4">
            {formData.gatewayType === 'stripe' && (
              <>
                <div>
                  <Label htmlFor="stripe-publishable-key">Publishable Key *</Label>
                  <Input
                    id="stripe-publishable-key"
                    placeholder="pk_test_..."
                    value={gatewayConfig.publishableKey || ''}
                    onChange={(e) => handleConfigChange('publishableKey', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="stripe-secret-key">Secret Key *</Label>
                  <Input
                    id="stripe-secret-key"
                    type="password"
                    placeholder="sk_test_..."
                    value={gatewayConfig.secretKey || ''}
                    onChange={(e) => handleConfigChange('secretKey', e.target.value)}
                  />
                </div>
              </>
            )}

            {formData.gatewayType === 'paypal' && (
              <>
                <div>
                  <Label htmlFor="paypal-client-id">Client ID *</Label>
                  <Input
                    id="paypal-client-id"
                    placeholder="AYSq3RDGsmBLJE-otTkBtM-jBRd1TCQwFf9RGfwddNXWz0uFU9ztymylOhRS"
                    value={gatewayConfig.clientId || ''}
                    onChange={(e) => handleConfigChange('clientId', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="paypal-client-secret">Client Secret *</Label>
                  <Input
                    id="paypal-client-secret"
                    type="password"
                    placeholder="EGnHDxD_qRPdaLdZz8iCr8N7_MzF-YHPTkjs6NKYQvQSBngp4PTTVWkPZRbL"
                    value={gatewayConfig.clientSecret || ''}
                    onChange={(e) => handleConfigChange('clientSecret', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="paypal-environment">Environment *</Label>
                  <Select 
                    value={gatewayConfig.environment || 'sandbox'} 
                    onValueChange={(value) => handleConfigChange('environment', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sandbox">Sandbox</SelectItem>
                      <SelectItem value="production">Production</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}

            {formData.gatewayType === 'razorpay' && (
              <>
                <div>
                  <Label htmlFor="razorpay-key-id">Key ID *</Label>
                  <Input
                    id="razorpay-key-id"
                    placeholder="rzp_test_..."
                    value={gatewayConfig.keyId || ''}
                    onChange={(e) => handleConfigChange('keyId', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="razorpay-key-secret">Key Secret *</Label>
                  <Input
                    id="razorpay-key-secret"
                    type="password"
                    placeholder="Enter your Razorpay Key Secret"
                    value={gatewayConfig.keySecret || ''}
                    onChange={(e) => handleConfigChange('keySecret', e.target.value)}
                  />
                </div>
              </>
            )}
          </div>

          {/* Test Connection */}
          <div className="flex items-center justify-between pt-4 border-t">
            <div>
              <Label>Test Connection</Label>
              <p className="text-sm text-gray-600">Verify your API credentials</p>
            </div>
            <div className="flex items-center gap-2">
              {testConnectionResult === 'success' && (
                <div className="flex items-center gap-1 text-green-600">
                  <CheckCircle className="w-4 h-4" />
                  <span className="text-sm">Connected</span>
                </div>
              )}
              {testConnectionResult === 'error' && (
                <div className="flex items-center gap-1 text-red-600">
                  <AlertCircle className="w-4 h-4" />
                  <span className="text-sm">Failed</span>
                </div>
              )}
              <Button
                size="sm"
                variant="outline"
                onClick={testConnection}
                disabled={!gatewayConfig.clientId && !gatewayConfig.publishableKey}
              >
                Test
              </Button>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setShowConfigModal(false)}>
            Cancel
          </Button>
          <Button onClick={handleConfigSave} className="bg-blue-600 hover:bg-blue-700">
            <Save className="w-4 h-4 mr-2" />
            Save Configuration
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
    );
  };

  const renderGatewaySelection = () => (
    <Card>
      <CardHeader>
        <CardTitle>Payment Gateway</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label>Select Payment Gateway *</Label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-2">
            {availablePaymentGateways.map(gateway => {
              const isSelected = formData.gatewayType === gateway.id;
              const isActive = isSelected && formData.isActive;
              
              return (
                <div
                  key={gateway.id}
                  className={`border rounded-lg p-4 cursor-pointer transition-all ${
                    isSelected 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => handleInputChange('gatewayType', gateway.id)}
                >
                  <div className="flex items-center justify-between mb-3">
                    <img src={gateway.logo} alt={gateway.name} className="w-12 h-8 object-contain" />
                    <div className="flex items-center">
                      <Switch
                        checked={isActive}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            handleInputChange('gatewayType', gateway.id);
                            handleInputChange('isActive', true);
                          } else {
                            handleInputChange('isActive', false);
                          }
                        }}
                      />
                    </div>
                  </div>
                  <h3 className="font-medium text-sm">{gateway.name}</h3>
                  
                  {isActive && (
                    <Button
                      size="sm"
                      className="w-full mt-3 bg-green-600 hover:bg-green-700"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleGatewayActivation(gateway.id);
                      }}
                    >
                      <Zap className="w-4 h-4 mr-1" />
                      Activate
                    </Button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderIntegrationLevel = () => (
    <Card>
      <CardHeader>
        <CardTitle>Integration Level</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="integrationLevel">Extent *</Label>
          <Select 
            value={formData.integrationLevel} 
            onValueChange={(value) => handleInputChange('integrationLevel', value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {mockUserPermissions.canEditBrand && <SelectItem value="brand">Brand Level</SelectItem>}
              {mockUserPermissions.canEditProperty && <SelectItem value="property">Property Level</SelectItem>}
              {mockUserPermissions.canEditProperty && <SelectItem value="multiple-properties">Multiple Properties</SelectItem>}
            </SelectContent>
          </Select>
        </div>

        {/* Brand Selection */}
        {(formData.integrationLevel === 'brand' || formData.integrationLevel === 'property') && (
          <div>
            <Label htmlFor="brandId">Brand *</Label>
            <Select 
              value={formData.brandId} 
              onValueChange={(value) => handleInputChange('brandId', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select brand" />
              </SelectTrigger>
              <SelectContent>
                {mockChains.flatMap(chain => 
                  chain.brands.map(brand => (
                    <SelectItem key={brand.id} value={brand.id}>
                      {brand.name} ({brand.properties.length} properties)
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Property Selection */}
        {formData.integrationLevel === 'property' && selectedBrand && (
          <div>
            <Label htmlFor="propertyId">Property *</Label>
            <Select 
              value={formData.propertyId} 
              onValueChange={(value) => handleInputChange('propertyId', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select property" />
              </SelectTrigger>
              <SelectContent>
                {selectedBrand.properties.map(property => (
                  <SelectItem key={property.id} value={property.id}>
                    {property.name} - {property.location}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Apply to Options for Brand Level */}
        {formData.integrationLevel === 'brand' && selectedBrand && (
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-4">
              <div>
                <h3 className="font-medium text-blue-900">Brand Level Configuration</h3>
                <p className="text-sm text-blue-700">
                  This will apply to all {selectedBrand.properties.length} properties under {selectedBrand.name}
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to List
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {editingGateway ? `Edit ${editingGateway.name}` : 'Add Payment Gateway'}
          </h1>
          <p className="text-gray-600 mt-1">
            {isBulkOperation ? `Configure for ${selectedProperties.length} properties` : 
             editingProperty ? `Configure for ${editingProperty.name}` :
             'Configure payment gateway integration'}
          </p>
        </div>
      </div>

      {/* Integration Level */}
      {renderIntegrationLevel()}

      {/* Gateway Selection */}
      {renderGatewaySelection()}

      {/* Configuration Modal */}
      {renderConfigModal()}

      {/* Action Buttons */}
      <div className="flex justify-end gap-3">
        <Button variant="outline" onClick={onBack}>
          <X className="w-4 h-4 mr-2" />
          Cancel
        </Button>
        <Button 
          onClick={handleSave} 
          className="bg-blue-600 hover:bg-blue-700"
          disabled={!formData.gatewayType}
        >
          <Save className="w-4 h-4 mr-2" />
          {editingGateway ? 'Update Gateway' : `Save for ${getAffectedPropertiesCount()} ${getAffectedPropertiesCount() === 1 ? 'Property' : 'Properties'}`}
        </Button>
      </div>
    </div>
  );
};