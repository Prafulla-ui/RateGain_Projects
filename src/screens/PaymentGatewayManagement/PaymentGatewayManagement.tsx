import React, { useState } from 'react';
import { PaymentGatewayList } from '../../components/PaymentGatewayList/PaymentGatewayList';
import { PaymentGatewayForm } from '../../components/PaymentGatewayForm/PaymentGatewayForm';
import { PaymentGateway, Property } from '../../types/paymentGateway';

export const PaymentGatewayManagement: React.FC = () => {
  const [currentView, setCurrentView] = useState<'list' | 'form'>('list');
  const [editingGateway, setEditingGateway] = useState<PaymentGateway | undefined>();
  const [editingProperty, setEditingProperty] = useState<Property | undefined>();
  const [selectedProperties, setSelectedProperties] = useState<Property[]>([]);
  const [isBulkOperation, setIsBulkOperation] = useState(false);

  const handleAddPaymentGateway = () => {
    setEditingGateway(undefined);
    setEditingProperty(undefined);
    setSelectedProperties([]);
    setIsBulkOperation(false);
    setCurrentView('form');
  };

  const handleEditPaymentGateway = (gateway: PaymentGateway, property: Property) => {
    setEditingGateway(gateway);
    setEditingProperty(property);
    setSelectedProperties([]);
    setIsBulkOperation(false);
    setCurrentView('form');
  };

  const handleBulkAddPaymentGateway = (properties: Property[]) => {
    setEditingGateway(undefined);
    setEditingProperty(undefined);
    setSelectedProperties(properties);
    setIsBulkOperation(true);
    setCurrentView('form');
  };

  const handleBulkEditPaymentGateway = (gateway: PaymentGateway, properties: Property[]) => {
    setEditingGateway(gateway);
    setEditingProperty(undefined);
    setSelectedProperties(properties);
    setIsBulkOperation(true);
    setCurrentView('form');
  };

  const handleBackToList = () => {
    setCurrentView('list');
    setEditingGateway(undefined);
    setEditingProperty(undefined);
    setSelectedProperties([]);
    setIsBulkOperation(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        {currentView === 'list' ? (
          <PaymentGatewayList
            onAddPaymentGateway={handleAddPaymentGateway}
            onEditPaymentGateway={handleEditPaymentGateway}
            onBulkAddPaymentGateway={handleBulkAddPaymentGateway}
            onBulkEditPaymentGateway={handleBulkEditPaymentGateway}
          />
        ) : (
          <PaymentGatewayForm
            onBack={handleBackToList}
            editingGateway={editingGateway}
            editingProperty={editingProperty}
            selectedProperties={selectedProperties}
            isBulkOperation={isBulkOperation}
          />
        )}
      </div>
    </div>
  );
};