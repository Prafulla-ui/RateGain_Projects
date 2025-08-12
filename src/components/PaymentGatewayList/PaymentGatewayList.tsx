import React, { useState } from 'react';
import { Plus, Settings, Eye, ChevronDown, ChevronRight, Users, Building2, MapPin, Edit, Trash2, CheckSquare, AlertTriangle, Shield, Copy, Edit3, Zap, CreditCard, Table, List } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Checkbox } from '../ui/checkbox';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog';
import { mockChains, mockUserPermissions } from '../../data/mockData';
import { Property, PaymentGateway } from '../../types/paymentGateway';
import { useNavigate } from 'react-router-dom';

interface PaymentGatewayListProps {
  onAddPaymentGateway: () => void;
  onEditPaymentGateway: (gateway: PaymentGateway, property?: Property, level?: 'brand' | 'property') => void;
  onBulkAddPaymentGateway: (selectedProperties: Property[]) => void;
  onBulkEditPaymentGateway: (gateway: PaymentGateway, properties: Property[]) => void;
}

export const PaymentGatewayList: React.FC<PaymentGatewayListProps> = ({
  onAddPaymentGateway,
  onEditPaymentGateway,
  onBulkAddPaymentGateway,
  onBulkEditPaymentGateway,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBrand, setFilterBrand] = useState('all');
  const [expandedBrands, setExpandedBrands] = useState<Set<string>>(new Set());
  const [viewMode, setViewMode] = useState<'tree' | 'table' | 'gateway'>('table');
  const [expandedGateways, setExpandedGateways] = useState<Set<string>>(new Set());
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedProperties, setSelectedProperties] = useState<Set<string>>(new Set());
  const [selectedBrands, setSelectedBrands] = useState<Set<string>>(new Set());
  const [deleteDialog, setDeleteDialog] = useState<{
    isOpen: boolean;
    gateway?: PaymentGateway;
    property?: Property;
    level?: 'brand' | 'property';
    affectedCount?: number;
  }>({ isOpen: false });
  const [bulkEditMode, setBulkEditMode] = useState(false);
  const [selectedForBulkEdit, setSelectedForBulkEdit] = useState<{
    brandId?: string;
    propertyIds: Set<string>;
  }>({ propertyIds: new Set() });

  // State for selected payment gateways in empty state
  const [selectedGateways, setSelectedGateways] = useState<Set<string>>(new Set());
  const [showAllGateways, setShowAllGateways] = useState(false);
  const [gatewaySearchTerm, setGatewaySearchTerm] = useState('');
  
  // New state for gateway view mode (list vs card)
  const [gatewayViewMode, setGatewayViewMode] = useState<'card' | 'list'>('card');
  
  // Navigation hook
  const navigate = useNavigate();

  // Flatten all properties for easier filtering and display
  const allProperties = mockChains.flatMap(chain =>
    chain.brands.flatMap(brand => brand.properties)
  );

  const filteredProperties = allProperties.filter(property => {
    const matchesSearch = property.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         property.brandName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBrand = filterBrand === 'all' || property.brandId === filterBrand;
    return matchesSearch && matchesBrand;
  });

  // Group properties by brand for better organization
  const groupedProperties = filteredProperties.reduce((acc, property) => {
    const brandKey = `${property.brandId}-${property.brandName}`;
    if (!acc[brandKey]) {
      acc[brandKey] = {
        brandId: property.brandId,
        brandName: property.brandName,
        chainName: property.chainName,
        properties: [],
      };
    }
    acc[brandKey].properties.push(property);
    return acc;
  }, {} as Record<string, { brandId: string; brandName: string; chainName: string; properties: Property[] }>);

  const toggleBrandExpansion = (brandId: string) => {
    const newExpanded = new Set(expandedBrands);
    if (newExpanded.has(brandId)) {
      newExpanded.delete(brandId);
    } else {
      newExpanded.add(brandId);
    }
    setExpandedBrands(newExpanded);
  };

  const handleDeleteGateway = (gateway: PaymentGateway, level: 'brand' | 'property', property?: Property) => {
    let affectedCount = 0;
    if (level === 'brand') {
      // Count properties that would be affected
      const brand = mockChains.flatMap(c => c.brands).find(b => 
        b.paymentGateways.some(g => g.id === gateway.id)
      );
      affectedCount = brand?.properties.length || 0;
    } else {
      affectedCount = 1;
    }

    setDeleteDialog({
      isOpen: true,
      gateway,
      property,
      level,
      affectedCount,
    });
  };

  const confirmDelete = () => {
    console.log('Deleting gateway:', deleteDialog.gateway?.name, 'at', deleteDialog.level, 'level');
    // Here you would implement the actual delete logic
    setDeleteDialog({ isOpen: false });
  };

  const handleBulkEditBrand = (brandId: string) => {
    const brand = mockChains.flatMap(c => c.brands).find(b => b.id === brandId);
    if (brand) {
      setBulkEditMode(true);
      setSelectedForBulkEdit({
        brandId,
        propertyIds: new Set(brand.properties.map(p => p.id))
      });
      onBulkEditPaymentGateway(brand.paymentGateways[0] || {} as PaymentGateway, brand.properties);
    }
  };

  const handleBulkAddBrand = (brandId: string) => {
    const brand = mockChains.flatMap(c => c.brands).find(b => b.id === brandId);
    if (brand) {
      setBulkEditMode(true);
      setSelectedForBulkEdit({
        brandId,
        propertyIds: new Set(brand.properties.map(p => p.id))
      });
      onBulkAddPaymentGateway(brand.properties);
    }
  };

  const getGatewayBadgeColor = (gateway: PaymentGateway) => {
    if (gateway.inheritedFrom) {
      return 'bg-blue-100 text-blue-800 border-blue-200';
    }
    return 'bg-green-100 text-green-800 border-green-200';
  };

  const getGatewayBadgeText = (gateway: PaymentGateway) => {
    if (gateway.inheritedFrom) {
      return `Inherited (${gateway.integrationLevel})`;
    }
    return `Direct (${gateway.integrationLevel})`;
  };

  // Check if there are any payment gateways configured
  const hasAnyPaymentGateways = () => {
    return mockChains.some(chain => 
      chain.paymentGateways.length > 0 || 
      chain.brands.some(brand => 
        brand.paymentGateways.length > 0 || 
        brand.properties.some(property => property.paymentGateways.length > 0)
      )
    );
  };

  // All available payment gateways
  const allAvailableGateways = [
    { id: 'stripe', name: 'Stripe', logo: 'https://cdn.worldvectorlogo.com/logos/stripe-4.svg', description: 'The most popular payment processor with excellent developer tools and global reach.', tags: ['Global', 'Developer-friendly', 'Low fees'] },
    { id: 'paypal', name: 'PayPal', logo: 'https://cdn.worldvectorlogo.com/logos/paypal-3.svg', description: 'Trusted by millions worldwide with PayPal Checkout and Express Checkout options.', tags: ['Trusted', 'Easy setup', 'Wide adoption'] },
    { id: 'razorpay', name: 'Razorpay', logo: 'https://razorpay.com/favicon.png', description: 'Leading payment gateway in India with support for UPI, cards, and digital wallets.', tags: ['India focused', 'UPI support', 'Local payments'] },
      { id: 'airpay', name: 'Air Pay', logo: 'https://loyalty.airpay.co.in/img/airpaylogo.png', description: 'Modern payment processing and digital wallet solutions for businesses.', tags: ['Digital payments', 'Mobile wallet', 'Business solutions'] },
  { id: 'reddotpayment', name: 'Red Dot Payment', logo: 'https://upload.wikimedia.org/wikipedia/commons/f/fd/Red_Dot_Payment_logo.png', description: 'Singapore-based payment gateway specializing in Asia Pacific region payments.', tags: ['Asia Pacific', 'Singapore', 'Regional focus'] },
  { id: 'hyperpay', name: 'HyperPay', logo: 'https://image.pitchbook.com/sZCjcMOqDUPLq7EoqSM3vsOQNXT1744795249004_200x200', description: 'Middle East focused payment gateway with support for local payment methods.', tags: ['Middle East', 'Local methods', 'Arabic support'] },
  { id: 'iolpay', name: 'IOL Pay', logo: 'https://via.placeholder.com/150x60/059669/FFFFFF?text=IOL+Pay', description: 'Innovative digital payment solutions for modern businesses and e-commerce.', tags: ['Digital payments', 'E-commerce', 'Innovation'] },
    { id: 'adyen', name: 'Adyen', logo: 'https://www.adyen.com/static/images/adyen-logo.svg', description: 'Global payment platform that enables businesses to accept payments worldwide.', tags: ['Global', 'Enterprise', 'Multi-currency'] },
    { id: 'mollie', name: 'Mollie', logo: 'https://cdn.worldvectorlogo.com/logos/mollie-1.svg', description: 'European payment service provider with simple pricing and excellent support.', tags: ['European', 'Simple pricing', 'Great support'] },
    { id: 'klarna', name: 'Klarna', logo: 'https://cdn.worldvectorlogo.com/logos/klarna-1.svg', description: 'Buy now, pay later solution popular in Europe and North America.', tags: ['BNPL', 'Europe', 'Consumer friendly'] },
  ];

  // Filter gateways based on search term
  const filteredGateways = allAvailableGateways.filter(gateway =>
    gateway.name.toLowerCase().includes(gatewaySearchTerm.toLowerCase()) ||
    gateway.description.toLowerCase().includes(gatewaySearchTerm.toLowerCase()) ||
    gateway.tags.some(tag => tag.toLowerCase().includes(gatewaySearchTerm.toLowerCase()))
  );

  const renderEmptyState = () => (
    <div className="flex flex-col items-center justify-center py-8 px-6">
      <div className="text-center max-w-4xl mx-auto">
        {/* Icon */}
        <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
          <CreditCard className="w-8 h-8 text-blue-600" />
        </div>
        
        {/* Header */}
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Welcome to Payment Gateway Management
        </h2>
        
        {/* Subheader */}
        <p className="text-gray-600 mb-6 leading-relaxed text-base max-w-2xl mx-auto">
          Get started by integrating your first payment gateway. This will allow your properties to accept online payments from guests and streamline your booking process.
        </p>
        
        {/* Payment Gateways Section */}
        <div className="mb-12">
          <div className="text-center mb-6">
            <h3 className="text-xl font-semibold text-gray-900">
              {showAllGateways ? 'All Payment Gateways' : 'Popular Payment Gateways'}
            </h3>
          </div>
          
          <p className="text-gray-600 mb-8 text-center">
            Select one or more payment gateways to get started. You can always add more later.
          </p>

          {/* View Toggle for Popular Gateways */}
          {!showAllGateways && (
            <div className="flex justify-center mb-6">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">View:</span>
                <div className="flex border border-gray-200 rounded-lg overflow-hidden">
                  <Button
                    variant={gatewayViewMode === 'card' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setGatewayViewMode('card')}
                    className="rounded-none border-0 h-8 px-3"
                  >
                    <Table className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={gatewayViewMode === 'list' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setGatewayViewMode('list')}
                    className="rounded-none border-0 h-8 px-3"
                  >
                    <List className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Search Bar and View Toggle for All Gateways */}
          {showAllGateways && (
            <div className="mb-6 max-w-4xl mx-auto">
              <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                <div className="flex-1 max-w-md">
                  <Input
                    placeholder="Search payment gateways..."
                    value={gatewaySearchTerm}
                    onChange={(e) => setGatewaySearchTerm(e.target.value)}
                    className="w-full"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">View:</span>
                  <div className="flex border border-gray-200 rounded-lg overflow-hidden">
                    <Button
                      variant={gatewayViewMode === 'card' ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setGatewayViewMode('card')}
                      className="rounded-none border-0 h-8 px-3"
                    >
                      <Table className="w-4 h-4" />
                    </Button>
                    <Button
                      variant={gatewayViewMode === 'list' ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setGatewayViewMode('list')}
                      className="rounded-none border-0 h-8 px-3"
                    >
                      <List className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Gateway Display */}
          {gatewayViewMode === 'card' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 max-w-6xl mx-auto">
              {(showAllGateways ? filteredGateways : allAvailableGateways.slice(0, 3)).map((gateway) => (
                <div 
                  key={gateway.id}
                  className={`bg-white border-2 rounded-lg p-6 hover:shadow-md transition-all cursor-pointer ${
                    selectedGateways.has(gateway.id) ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => {
                    const newSelected = new Set(selectedGateways);
                    if (newSelected.has(gateway.id)) {
                      newSelected.delete(gateway.id);
                    } else {
                      newSelected.add(gateway.id);
                    }
                    setSelectedGateways(newSelected);
                  }}
                >
                  <div className="flex flex-col items-start mb-4 w-full">
                    <div className="flex items-center gap-3 mb-3 w-full">
                      <Checkbox 
                        checked={selectedGateways.has(gateway.id)}
                        className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                      />
                      <img 
                        src={gateway.logo} 
                        alt={gateway.name} 
                        className="w-12 h-8 object-contain rounded"
                      />
                    </div>
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2.5 text-left">{gateway.name}</h4>
                  <p className="text-sm text-gray-600 mb-2.5 text-left">
                    {gateway.description}
                  </p>
                  <div className="flex flex-wrap gap-1 mb-4 justify-start">
                    {gateway.tags.map((tag, index) => (
                      <span 
                        key={index}
                        className={`px-2 py-1 text-xs rounded-full ${
                          index % 3 === 0 ? 'bg-green-100 text-green-800' :
                          index % 3 === 1 ? 'bg-blue-100 text-blue-800' :
                          'bg-purple-100 text-purple-800'
                        }`}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="max-w-6xl mx-auto space-y-6">
              {/* List view: each gateway as a separate card */}
              <>
                {(showAllGateways ? filteredGateways : allAvailableGateways.slice(0, 3)).map((gateway, index) => (
                  <div
                    key={gateway.id}
                    className={`flex items-center p-4 py-5 bg-white border-2 border-gray-200 rounded-lg hover:shadow-md transition-all cursor-pointer ${
                      selectedGateways.has(gateway.id) ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                    }`}
                    onClick={() => {
                      const newSelected = new Set(selectedGateways);
                      if (newSelected.has(gateway.id)) {
                        newSelected.delete(gateway.id);
                      } else {
                        newSelected.add(gateway.id);
                      }
                      setSelectedGateways(newSelected);
                    }}
                  >
                    <div className="flex items-center gap-4 flex-1 text-left">
                      <Checkbox checked={selectedGateways.has(gateway.id)} className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600" />
                      <img src={gateway.logo} alt={gateway.name} className="w-12 h-8 object-contain rounded" />
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 mb-2.5 text-left">{gateway.name}</h4>
                        <p className="text-sm text-gray-600 mb-2.5 text-left">{gateway.description}</p>
                        <div className="flex flex-wrap gap-1 mb-2.5 justify-start">
                          {gateway.tags.map((tag, tagIndex) => (
                            <span
                              key={tagIndex}
                              className={`px-2 py-1 text-xs rounded-full ${
                                tagIndex % 3 === 0 ? 'bg-green-100 text-green-800' :
                                tagIndex % 3 === 1 ? 'bg-blue-100 text-blue-800' :
                                'bg-purple-100 text-purple-800'
                              }`}
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </>
            </div>
          )}

          {/* View All Button - Only show when not already showing all gateways */}
          {!showAllGateways && (
            <div className="text-center mt-8">
              <Button
                variant="outline"
                onClick={() => setShowAllGateways(true)}
                className="text-blue-600 hover:text-blue-700"
              >
                View All Payment Gateways
              </Button>
            </div>
          )}

          {/* No Results Message */}
          {showAllGateways && filteredGateways.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">No payment gateways found matching your search.</p>
              <Button
                variant="outline"
                onClick={() => setGatewaySearchTerm('')}
                className="mt-2"
              >
                Clear Search
              </Button>
            </div>
          )}
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-8 border border-blue-100">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            Ready to get started?
          </h3>
          <p className="text-gray-600 mb-6">
            Choose from our supported payment gateways and start accepting payments in minutes.
          </p>
          
          {/* Selected Gateways Display */}
          {selectedGateways.size > 0 && (
            <div className="mb-6 p-4 bg-white rounded-lg border border-blue-200">
              <h4 className="font-medium text-gray-900 mb-3">Selected Payment Gateways:</h4>
              <div className="flex flex-wrap gap-2">
                {Array.from(selectedGateways).map((gateway) => (
                  <div key={gateway} className="flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                    <img 
                      src={
                        gateway === 'stripe' 
                          ? "https://cdn.worldvectorlogo.com/logos/stripe-4.svg"
                          : gateway === 'paypal'
                          ? "https://cdn.worldvectorlogo.com/logos/paypal-3.svg"
                          : gateway === 'razorpay'
                          ? "https://razorpay.com/favicon.png"
                          : gateway === 'airpay'
                          ? "https://loyalty.airpay.co.in/img/airpaylogo.png"
                          : gateway === 'reddotpayment'
                          ? "https://upload.wikimedia.org/wikipedia/commons/f/fd/Red_Dot_Payment_logo.png"
                          : gateway === 'hyperpay'
                          ? "https://image.pitchbook.com/sZCjcMOqDUPLq7EoqSM3vsOQNXT1744795249004_200x200"
                          : gateway === 'adyen'
                          ? "https://www.adyen.com/static/images/adyen-logo.svg"
                          : gateway === 'iolpay'
                          ? "https://via.placeholder.com/150x60/059669/FFFFFF?text=IOL+Pay"
                          : gateway === 'worldpay'
                          ? "https://cdn.worldvectorlogo.com/logos/worldpay-1.svg"
                          : gateway === 'braintree'
                          ? "https://uploads.sitepoint.com/wp-content/uploads/2014/08/1409502454Braintree-Logo.jpg"
                          : gateway === 'klarna'
                          ? "https://cdn.worldvectorlogo.com/logos/klarna-1.svg"
                          : "https://cdn.worldvectorlogo.com/logos/stripe-4.svg"
                      }
                      alt={gateway}
                      className="w-4 h-3 object-contain rounded"
                    />
                    <span className="capitalize">{gateway}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          <Button 
            onClick={() => navigate(`/configure?gateways=${Array.from(selectedGateways).join(',')}`)} 
            className={`px-8 py-4 text-lg font-medium shadow-lg hover:shadow-xl transition-all duration-200 ${
              selectedGateways.size > 0 
                ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
            size="lg"
            disabled={selectedGateways.size === 0}
          >
            <Plus className="w-5 h-5 mr-2" />
            {selectedGateways.size > 0 
              ? `Configure ${selectedGateways.size} Payment Gateway${selectedGateways.size > 1 ? 's' : ''}`
              : 'Select Payment Gateway'
            }
          </Button>
          
          {selectedGateways.size === 0 && (
            <p className="text-sm text-gray-500 mt-2">
              Please select at least one payment gateway to continue
            </p>
          )}
        </div>
        
        {/* What you can do section */}
        <div className="mt-8 p-4 bg-gray-50 rounded-lg max-w-3xl mx-auto">
          <h3 className="font-medium text-gray-900 mb-3 text-center">What you can do:</h3>
          <div className="flex flex-wrap gap-3 text-sm text-gray-600 justify-center">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
              <span>Configure payment gateways at chain, brand, or property level</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
              <span>Support multiple payment methods (Stripe, PayPal, Razorpay, etc.)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
              <span>Manage payment settings across your entire hotel portfolio</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
              <span>Monitor payment gateway status and performance</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTreeView = () => (
    <div className="space-y-4">
      {Object.entries(groupedProperties).map(([brandKey, brandGroup]) => (
        <Card key={brandKey} className="overflow-hidden">
          <CardHeader 
            className="cursor-pointer hover:bg-gray-50 transition-colors"
            onClick={() => toggleBrandExpansion(brandGroup.brandId)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {expandedBrands.has(brandGroup.brandId) ? (
                  <ChevronDown className="w-5 h-5 text-gray-500" />
                ) : (
                  <ChevronRight className="w-5 h-5 text-gray-500" />
                )}
                <div>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-blue-600" />
                    {brandGroup.brandName}
                  </CardTitle>
                  <p className="text-sm text-gray-600">{brandGroup.chainName} • {brandGroup.properties.length} properties</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant="outline" className="bg-blue-50 text-blue-700">
                  {brandGroup.properties.reduce((total, prop) => total + prop.paymentGateways.length, 0)} gateways
                </Badge>
                {mockUserPermissions.canAddGateway && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation();
                      onAddPaymentGateway();
                    }}
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add Gateway
                  </Button>
                )}
              </div>
            </div>
          </CardHeader>

          {expandedBrands.has(brandGroup.brandId) && (
            <CardContent className="pt-0">
              {/* Brand Level Gateways */}
              {mockChains.flatMap(c => c.brands).find(b => b.id === brandGroup.brandId)?.paymentGateways.map((gateway) => (
                <div key={`brand-${gateway.id}`} className="mb-4 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Shield className="w-5 h-5 text-blue-600" />
                      <img src={gateway.logo} alt={gateway.name} className="w-8 h-8 rounded-full object-cover border border-gray-200" />
                      <div>
                        <p className="font-medium text-blue-900">{gateway.name} (Brand Level)</p>
                        <p className="text-sm text-blue-700">Applied to all {brandGroup.properties.length} properties</p>
                        <div className="flex items-center gap-2 mt-1">
                          <div className={`w-2 h-2 rounded-full ${gateway.isActive ? 'bg-green-500' : 'bg-gray-400'}`} />
                          <span className="text-xs text-blue-600">{gateway.isActive ? 'Active' : 'Inactive'}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {mockUserPermissions.canEditBrand && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onEditPaymentGateway(gateway, undefined)}
                        >
                          <Edit3 className="w-4 h-4 mr-1" />
                          Edit Brand
                        </Button>
                      )}
                      {mockUserPermissions.canDeleteBrand && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-red-600 hover:text-red-700"
                          onClick={() => handleDeleteGateway(gateway, 'brand')}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {/* Properties */}
              <div className="space-y-3">
                {brandGroup.properties.map((property) => (
                  <div key={property.id} className="border rounded-lg p-4 bg-gray-50">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-gray-500" />
                        <div>
                          <h4 className="font-medium text-gray-900">{property.name}</h4>
                          <p className="text-sm text-gray-600">{property.location}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge 
                          variant={property.status === 'active' ? 'default' : 'secondary'}
                          className={property.status === 'active' ? 'bg-green-100 text-green-800' : ''}
                        >
                          {property.status}
                        </Badge>
                        {mockUserPermissions.canAddGateway && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => onEditPaymentGateway({} as PaymentGateway, property)}
                          >
                            <Plus className="w-3 h-3 mr-1" />
                            Add
                          </Button>
                        )}
                      </div>
                    </div>

                    {/* Payment Gateways */}
                    <div className="space-y-2">
                      <h5 className="text-sm font-medium text-gray-700">Payment Gateways ({property.paymentGateways.length})</h5>
                      {property.paymentGateways.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                          {property.paymentGateways.map((gateway) => (
                            <div key={gateway.id} className="flex items-center justify-between p-3 bg-white rounded-lg border">
                              <div className="flex items-center gap-3">
                                <img 
                                  src={gateway.logo} 
                                  alt={gateway.name}
                                  className="w-8 h-8 rounded object-cover"
                                />
                                <div>
                                  <p className="font-medium text-sm">{gateway.name}</p>
                                  <div className="flex items-center gap-1">
                                    <Badge 
                                      variant="outline" 
                                      className={`text-xs ${getGatewayBadgeColor(gateway)}`}
                                    >
                                      {getGatewayBadgeText(gateway)}
                                    </Badge>
                                    {gateway.inheritedFrom && (
                                      <Copy className="w-3 h-3 text-blue-500" />
                                    )}
                                    <div className={`w-2 h-2 rounded-full ml-1 ${gateway.isActive ? 'bg-green-500' : 'bg-gray-400'}`} />
                                  </div>
                                </div>
                              </div>
                              <div className="flex gap-1">
                                {(mockUserPermissions.canEditProperty || (gateway.inheritedFrom && mockUserPermissions.canEditBrand)) && (
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => onEditPaymentGateway(gateway, property)}
                                  >
                                    <Edit className="w-4 h-4" />
                                  </Button>
                                )}
                                {!gateway.inheritedFrom && mockUserPermissions.canDeleteProperty && (
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    className="text-red-600 hover:text-red-700"
                                    onClick={() => handleDeleteGateway(gateway, 'property', property)}
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8 text-gray-500">
                          <p className="text-sm">No payment gateways configured</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          )}
        </Card>
      ))}
    </div>
  );

  const renderTableView = () => (
    <Card>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left p-4 font-medium text-gray-900">Property</th>
                <th className="text-left p-4 font-medium text-gray-900">Brand</th>
                <th className="text-left p-4 font-medium text-gray-900">Location</th>
                <th className="text-left p-4 font-medium text-gray-900">Payment Gateways</th>
                <th className="text-left p-4 font-medium text-gray-900">Status</th>
                <th className="text-left p-4 font-medium text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody>
              {/* Brand Groups with Properties Nested */}
              {Object.entries(groupedProperties).map(([brandKey, brandGroup]) => {
                const brand = mockChains.flatMap(c => c.brands).find(b => b.id === brandGroup.brandId);
                const brandGateways = brand?.paymentGateways || [];
                
                return (
                  <React.Fragment key={brandKey}>
                    {/* Brand Header Row */}
                    <tr className="bg-blue-50 border-b-2 border-blue-200">
                      <td colSpan={6} className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Building2 className="w-5 h-5 text-blue-600" />
                            <div>
                              <h3 className="font-semibold text-blue-900 text-lg">{brandGroup.brandName}</h3>
                              <p className="text-sm text-blue-700">{brandGroup.chainName} • {brandGroup.properties.length} properties</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <Badge variant="outline" className="bg-blue-100 text-blue-700">
                              {brandGroup.properties.reduce((total, prop) => total + prop.paymentGateways.length, 0) + brandGateways.length} gateways
                            </Badge>
                            {mockUserPermissions.canAddGateway && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleBulkAddBrand(brandGroup.brandId)}
                                className="text-blue-600 hover:text-blue-700"
                              >
                                <Plus className="w-4 h-4 mr-1" />
                                Add Gateway
                              </Button>
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                    
                    {/* Brand Level Gateways Row */}
                    {brandGateways.length > 0 && (
                      <tr className="bg-blue-25 border-b border-blue-100">
                        <td className="p-4 pl-8">
                          <div className="flex items-center gap-2">
                            <Shield className="w-4 h-4 text-blue-600" />
                            <span className="font-medium text-blue-900">Brand Level</span>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className="text-blue-700 font-medium">Applied to all properties</span>
                        </td>
                        <td className="p-4 text-blue-700">All locations</td>
                        <td className="p-4">
                          <div className="flex flex-wrap gap-1">
                            {brandGateways.map((gateway) => (
                              <Badge 
                                key={gateway.id}
                                variant="outline" 
                                className="text-xs bg-blue-100 text-blue-800 border-blue-200"
                              >
                                <img src={gateway.logo} alt={gateway.name} className="w-3 h-3 mr-1" />
                                {gateway.name}
                                <div className={`w-2 h-2 rounded-full ml-1 ${gateway.isActive ? 'bg-green-500' : 'bg-gray-400'}`} />
                              </Badge>
                            ))}
                          </div>
                        </td>
                        <td className="p-4">
                          <Badge className="bg-blue-100 text-blue-800">Brand Level</Badge>
                        </td>
                        <td className="p-4">
                          <div className="flex gap-1">
                            {mockUserPermissions.canEditBrand && (
                              <Button 
                                size="sm" 
                                variant="outline" 
                                onClick={() => handleBulkEditBrand(brandGroup.brandId)}
                                className="text-blue-600 hover:text-blue-700"
                              >
                                <Edit3 className="w-4 h-4 mr-1" />
                                Edit
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                    
                    {/* Property Rows */}
                    {brandGroup.properties.map((property) => (
                      <tr key={property.id} className="border-b hover:bg-gray-50">
                        <td className="p-4 pl-8">
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-gray-500" />
                            <span className="font-medium">{property.name}</span>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className="text-gray-600">Property specific</span>
                        </td>
                        <td className="p-4 text-gray-600">{property.location}</td>
                        <td className="p-4">
                          <div className="flex flex-wrap gap-1">
                            {property.paymentGateways.map((gateway) => (
                              <Badge 
                                key={gateway.id}
                                variant="outline" 
                                className={`text-xs ${getGatewayBadgeColor(gateway)}`}
                              >
                                <img src={gateway.logo} alt={gateway.name} className="w-3 h-3 mr-1" />
                                {gateway.name}
                                {gateway.inheritedFrom && <Copy className="w-3 h-3 ml-1 text-blue-500" />}
                                <div className={`w-2 h-2 rounded-full ml-1 ${gateway.isActive ? 'bg-green-500' : 'bg-gray-400'}`} />
                              </Badge>
                            ))}
                          </div>
                        </td>
                        <td className="p-4">
                          <Badge 
                            variant={property.status === 'active' ? 'default' : 'secondary'}
                            className={property.status === 'active' ? 'bg-green-100 text-green-800' : ''}
                          >
                            {property.status}
                          </Badge>
                        </td>
                        <td className="p-4">
                          <div className="flex gap-1">
                            {mockUserPermissions.canAddGateway && (
                              <Button size="sm" variant="outline" onClick={() => onEditPaymentGateway({} as PaymentGateway, property)}>
                                <Plus className="w-4 h-4" />
                              </Button>
                            )}
                            {property.paymentGateways.length > 0 && (
                              <Button size="sm" variant="outline" onClick={() => onEditPaymentGateway(property.paymentGateways[0], property)}>
                                <Edit className="w-4 h-4" />
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Show empty state if no payment gateways are configured */}
      {!hasAnyPaymentGateways() ? (
        renderEmptyState()
      ) : (
        <>
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Payment Gateway Management</h1>
              <p className="text-gray-600 mt-1">Manage payment gateways across your hotel chain, brands, and properties</p>
            </div>
            <div className="flex gap-2">
              {mockUserPermissions.canAddGateway && (
                <Button onClick={onAddPaymentGateway} className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Payment Gateway
                </Button>
              )}
            </div>
          </div>

          {/* Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex gap-4 items-center">
                <div className="flex-1">
                  <Input
                    placeholder="Search properties or brands..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="max-w-md"
                  />
                </div>
                <Select value={filterBrand} onValueChange={setFilterBrand}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Filter by brand" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Brands</SelectItem>
                    {mockChains.flatMap(chain => 
                      chain.brands.map(brand => (
                        <SelectItem key={brand.id} value={brand.id}>
                          {brand.name}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* View Mode Tabs */}
          <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as 'tree' | 'table' | 'gateway')}>
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="table" className="flex items-center gap-2">
                <Table className="w-4 h-4" />
                Table View
              </TabsTrigger>
              <TabsTrigger value="tree" className="flex items-center gap-2">
                <Building2 className="w-4 h-4" />
                Tree View
              </TabsTrigger>
            </TabsList>

            <TabsContent value="table" className="mt-6">
              {renderTableView()}
            </TabsContent>

            <TabsContent value="tree" className="mt-6">
              {renderTreeView()}
            </TabsContent>
          </Tabs>

          {filteredProperties.length === 0 && (
            <Card>
              <CardContent className="text-center py-12">
                <p className="text-gray-500">No properties found matching your criteria.</p>
              </CardContent>
            </Card>
          )}
        </>
      )}

      {/* CTA Section as Sticky Footer */}
      {selectedGateways.size > 0 && (
        <div className="fixed bottom-0 left-0 w-full z-50 bg-gradient-to-r from-blue-50 to-indigo-50 border-t border-blue-100 shadow-lg">
          <div className="max-w-4xl mx-auto p-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-1">Ready to get started?</h3>
              <p className="text-gray-600 mb-2">Choose from our supported payment gateways and start accepting payments in minutes.</p>
              <div className="flex flex-wrap gap-2">
                {Array.from(selectedGateways).map((gateway) => (
                  <div key={gateway} className="flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                    <img 
                      src={
                        gateway === 'stripe' 
                          ? "https://cdn.worldvectorlogo.com/logos/stripe-4.svg"
                          : gateway === 'paypal'
                          ? "https://cdn.worldvectorlogo.com/logos/paypal-3.svg"
                          : gateway === 'razorpay'
                          ? "https://razorpay.com/favicon.png"
                          : gateway === 'airpay'
                          ? "https://loyalty.airpay.co.in/img/airpaylogo.png"
                          : gateway === 'reddotpayment'
                          ? "https://upload.wikimedia.org/wikipedia/commons/f/fd/Red_Dot_Payment_logo.png"
                          : gateway === 'hyperpay'
                          ? "https://image.pitchbook.com/sZCjcMOqDUPLq7EoqSM3vsOQNXT1744795249004_200x200"
                          : gateway === 'adyen'
                          ? "https://www.adyen.com/static/images/adyen-logo.svg"
                          : gateway === 'iolpay'
                          ? "https://via.placeholder.com/150x60/059669/FFFFFF?text=IOL+Pay"
                          : gateway === 'worldpay'
                          ? "https://cdn.worldvectorlogo.com/logos/worldpay-1.svg"
                          : gateway === 'braintree'
                          ? "https://uploads.sitepoint.com/wp-content/uploads/2014/08/1409502454Braintree-Logo.jpg"
                          : gateway === 'klarna'
                          ? "https://cdn.worldvectorlogo.com/logos/klarna-1.svg"
                          : "https://cdn.worldvectorlogo.com/logos/stripe-4.svg"
                      }
                      alt={gateway}
                      className="w-4 h-3 object-contain rounded"
                    />
                    <span className="capitalize">{gateway}</span>
                  </div>
                ))}
              </div>
            </div>
            <Button 
              onClick={() => navigate(`/configure?gateways=${Array.from(selectedGateways).join(',')}`)} 
              className="px-8 py-4 text-lg font-medium shadow-lg hover:shadow-xl transition-all duration-200 bg-blue-600 hover:bg-blue-700 text-white"
              size="lg"
            >
              <Plus className="w-5 h-5 mr-2" />
              {`Configure ${selectedGateways.size} Payment Gateway${selectedGateways.size > 1 ? 's' : ''}`}
            </Button>
          </div>
        </div>
      )}

      {/* Add bottom padding when sticky footer is visible */}
      <div className={selectedGateways.size > 0 ? 'pb-32' : ''}></div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialog.isOpen} onOpenChange={(open) => setDeleteDialog({ ...deleteDialog, isOpen: open })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-500" />
              Confirm Deletion
            </DialogTitle>
            <DialogDescription>
              {deleteDialog.level === 'brand' ? (
                <div className="space-y-2">
                  <p>You are about to delete the <strong>{deleteDialog.gateway?.name}</strong> payment gateway at the brand level.</p>
                  <p className="text-red-600 font-medium">
                    This will remove the gateway from <strong>{deleteDialog.affectedCount} properties</strong> under this brand.
                  </p>
                  <p className="text-sm text-gray-600">
                    All properties under this brand will lose access to this payment gateway and may need alternative payment methods configured.
                  </p>
                  <p>This action cannot be undone.</p>
                </div>
              ) : (
                <div className="space-y-2">
                  <p>You are about to delete the <strong>{deleteDialog.gateway?.name}</strong> payment gateway from <strong>{deleteDialog.property?.name}</strong>.</p>
                  <p className="text-sm text-gray-600">
                    This property will lose access to this payment gateway. Guests will not be able to use this payment method for bookings.
                  </p>
                  <p>This action cannot be undone.</p>
                </div>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialog({ isOpen: false })}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              {deleteDialog.level === 'brand' ? 'Delete from Brand & All Properties' : 'Delete from Property'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};