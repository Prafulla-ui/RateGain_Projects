import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Edit3, Trash2, Check, X, Plus } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Switch } from '../components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Checkbox } from '../components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { useNavigate, useSearchParams } from 'react-router-dom';

interface PropertyConfig {
  id: string;
  propertyName: string;
  brandName: string;
  mid: string;
  secretKey: string;
  isActive: boolean;
  isEditing: boolean;
  isSelected?: boolean;
  gateway: string; // Add gateway association
}

const mockProperties: PropertyConfig[] = [
  // Stripe Properties (10 total)
  {
    id: 'stripe-1',
    propertyName: 'Grand Hotel Downtown',
    brandName: 'Luxury Collection',
    mid: 'MID123456789',
    secretKey: 'sk_test_123456789abcdef',
    isActive: true,
    isEditing: false,
    gateway: 'stripe',
  },
  {
    id: 'stripe-2',
    propertyName: 'Seaside Resort & Spa',
    brandName: 'Luxury Collection',
    mid: 'MID987654321',
    secretKey: 'sk_test_987654321fedcba',
    isActive: false,
    isEditing: false,
    gateway: 'stripe',
  },
  {
    id: 'stripe-3',
    propertyName: 'Business Center Plaza',
    brandName: 'Corporate Hotels',
    mid: 'MID456789123',
    secretKey: 'sk_test_456789123cdefab',
    isActive: true,
    isEditing: false,
    gateway: 'stripe',
  },
  {
    id: 'stripe-4',
    propertyName: 'Airport Transit Hotel',
    brandName: 'Travel Inn',
    mid: 'MID789123456',
    secretKey: 'sk_test_789123456defabc',
    isActive: true,
    isEditing: false,
    gateway: 'stripe',
  },
  {
    id: 'stripe-5',
    propertyName: 'Mountain View Lodge',
    brandName: 'Nature Retreats',
    mid: 'MID321654987',
    secretKey: 'sk_test_321654987efabcd',
    isActive: false,
    isEditing: false,
    gateway: 'stripe',
  },
  {
    id: 'stripe-6',
    propertyName: 'City Center Inn',
    brandName: 'Urban Hotels',
    mid: 'MID654987321',
    secretKey: 'sk_test_654987321fabcd',
    isActive: true,
    isEditing: false,
    gateway: 'stripe',
  },
  {
    id: 'stripe-7',
    propertyName: 'Beachfront Paradise',
    brandName: 'Coastal Resorts',
    mid: 'MID987321654',
    secretKey: 'sk_test_987321654abcde',
    isActive: false,
    isEditing: false,
    gateway: 'stripe',
  },
  {
    id: 'stripe-8',
    propertyName: 'Historic Manor House',
    brandName: 'Heritage Hotels',
    mid: 'MID321987654',
    secretKey: 'sk_test_321987654bcdef',
    isActive: true,
    isEditing: false,
    gateway: 'stripe',
  },
  {
    id: 'stripe-9',
    propertyName: 'Tech Campus Hotel',
    brandName: 'Innovation Lodging',
    mid: 'MID654321987',
    secretKey: 'sk_test_654321987cdefa',
    isActive: true,
    isEditing: false,
    gateway: 'stripe',
  },
  {
    id: 'stripe-10',
    propertyName: 'Garden Oasis Resort',
    brandName: 'Botanical Hotels',
    mid: 'MID987654123',
    secretKey: 'sk_test_987654123defab',
    isActive: false,
    isEditing: false,
    gateway: 'stripe',
  },

  // PayPal Properties (10 total)
  {
    id: 'paypal-1',
    propertyName: 'Riverside Hotel',
    brandName: 'Waterfront Collection',
    mid: 'PAYPAL_MID_001',
    secretKey: 'PAYPAL_SECRET_001',
    isActive: true,
    isEditing: false,
    gateway: 'paypal',
  },
  {
    id: 'paypal-2',
    propertyName: 'Downtown Business Hotel',
    brandName: 'Corporate Collection',
    mid: 'PAYPAL_MID_002',
    secretKey: 'PAYPAL_SECRET_002',
    isActive: true,
    isEditing: false,
    gateway: 'paypal',
  },
  {
    id: 'paypal-3',
    propertyName: 'Ski Resort Lodge',
    brandName: 'Mountain Collection',
    mid: 'PAYPAL_MID_003',
    secretKey: 'PAYPAL_SECRET_003',
    isActive: false,
    isEditing: false,
    gateway: 'paypal',
  },
  {
    id: 'paypal-4',
    propertyName: 'Desert Oasis Hotel',
    brandName: 'Arid Collection',
    mid: 'PAYPAL_MID_004',
    secretKey: 'PAYPAL_SECRET_004',
    isActive: true,
    isEditing: false,
    gateway: 'paypal',
  },
  {
    id: 'paypal-5',
    propertyName: 'Forest Retreat',
    brandName: 'Nature Collection',
    mid: 'PAYPAL_MID_005',
    secretKey: 'PAYPAL_SECRET_005',
    isActive: false,
    isEditing: false,
    gateway: 'paypal',
  },
  {
    id: 'paypal-6',
    propertyName: 'Metropolitan Tower',
    brandName: 'Urban Collection',
    mid: 'PAYPAL_MID_006',
    secretKey: 'PAYPAL_SECRET_006',
    isActive: true,
    isEditing: false,
    gateway: 'paypal',
  },
  {
    id: 'paypal-7',
    propertyName: 'Island Paradise Resort',
    brandName: 'Tropical Collection',
    mid: 'PAYPAL_MID_007',
    secretKey: 'PAYPAL_SECRET_007',
    isActive: true,
    isEditing: false,
    gateway: 'paypal',
  },
  {
    id: 'paypal-8',
    propertyName: 'Heritage Castle Hotel',
    brandName: 'Royal Collection',
    mid: 'PAYPAL_MID_008',
    secretKey: 'PAYPAL_SECRET_008',
    isActive: false,
    isEditing: false,
    gateway: 'paypal',
  },
  {
    id: 'paypal-9',
    propertyName: 'Innovation Hub Hotel',
    brandName: 'Tech Collection',
    mid: 'PAYPAL_MID_009',
    secretKey: 'PAYPAL_SECRET_009',
    isActive: true,
    isEditing: false,
    gateway: 'paypal',
  },
  {
    id: 'paypal-10',
    propertyName: 'Zen Garden Hotel',
    brandName: 'Wellness Collection',
    mid: 'PAYPAL_MID_010',
    secretKey: 'PAYPAL_SECRET_010',
    isActive: false,
    isEditing: false,
    gateway: 'paypal',
  },



  // Adyen Properties (10 total)
  {
    id: 'adyen-1',
    propertyName: 'European Grand Hotel',
    brandName: 'Continental Collection',
    mid: 'ADYEN_MID_001',
    secretKey: 'ADYEN_SECRET_001',
    isActive: true,
    isEditing: false,
    gateway: 'adyen',
  },
  {
    id: 'adyen-2',
    propertyName: 'Nordic Ice Hotel',
    brandName: 'Arctic Collection',
    mid: 'ADYEN_MID_002',
    secretKey: 'ADYEN_SECRET_002',
    isActive: false,
    isEditing: false,
    gateway: 'adyen',
  },
  {
    id: 'adyen-3',
    propertyName: 'Mediterranean Villa',
    brandName: 'Coastal Collection',
    mid: 'ADYEN_MID_003',
    secretKey: 'ADYEN_SECRET_003',
    isActive: true,
    isEditing: false,
    gateway: 'adyen',
  },
  {
    id: 'adyen-4',
    propertyName: 'Alpine Ski Resort',
    brandName: 'Mountain Collection',
    mid: 'ADYEN_MID_004',
    secretKey: 'ADYEN_SECRET_004',
    isActive: true,
    isEditing: false,
    gateway: 'adyen',
  },
  {
    id: 'adyen-5',
    propertyName: 'Baltic Sea Hotel',
    brandName: 'Maritime Collection',
    mid: 'ADYEN_MID_005',
    secretKey: 'ADYEN_SECRET_005',
    isActive: false,
    isEditing: false,
    gateway: 'adyen',
  },
  {
    id: 'adyen-6',
    propertyName: 'Danube River Hotel',
    brandName: 'River Collection',
    mid: 'ADYEN_MID_006',
    secretKey: 'ADYEN_SECRET_006',
    isActive: true,
    isEditing: false,
    gateway: 'adyen',
  },
  {
    id: 'adyen-7',
    propertyName: 'Black Forest Lodge',
    brandName: 'Forest Collection',
    mid: 'ADYEN_MID_007',
    secretKey: 'ADYEN_SECRET_007',
    isActive: false,
    isEditing: false,
    gateway: 'adyen',
  },
  {
    id: 'adyen-8',
    propertyName: 'Tuscany Vineyard Hotel',
    brandName: 'Wine Collection',
    mid: 'ADYEN_MID_008',
    secretKey: 'ADYEN_SECRET_008',
    isActive: true,
    isEditing: false,
    gateway: 'adyen',
  },
  {
    id: 'adyen-9',
    propertyName: 'Swiss Chalet Hotel',
    brandName: 'Alpine Collection',
    mid: 'ADYEN_MID_009',
    secretKey: 'ADYEN_SECRET_009',
    isActive: true,
    isEditing: false,
    gateway: 'adyen',
  },
  {
    id: 'adyen-10',
    propertyName: 'Dutch Windmill Hotel',
    brandName: 'Heritage Collection',
    mid: 'ADYEN_MID_010',
    secretKey: 'ADYEN_SECRET_010',
    isActive: false,
    isEditing: false,
    gateway: 'adyen',
  },

  // Braintree Properties (10 total)
  {
    id: 'braintree-1',
    propertyName: 'Silicon Valley Tech Hotel',
    brandName: 'Innovation Collection',
    mid: 'BT_MID_001',
    secretKey: 'BT_SECRET_001',
    isActive: true,
    isEditing: false,
    gateway: 'braintree',
  },
  {
    id: 'braintree-2',
    propertyName: 'Hollywood Star Hotel',
    brandName: 'Entertainment Collection',
    mid: 'BT_MID_002',
    secretKey: 'BT_SECRET_002',
    isActive: false,
    isEditing: false,
    gateway: 'braintree',
  },
  {
    id: 'braintree-3',
    propertyName: 'Wall Street Financial Hotel',
    brandName: 'Finance Collection',
    mid: 'BT_MID_003',
    secretKey: 'BT_SECRET_003',
    isActive: true,
    isEditing: false,
    gateway: 'braintree',
  },
  {
    id: 'braintree-4',
    propertyName: 'Las Vegas Casino Hotel',
    brandName: 'Gaming Collection',
    mid: 'BT_MID_004',
    secretKey: 'BT_SECRET_004',
    isActive: true,
    isEditing: false,
    gateway: 'braintree',
  },
  {
    id: 'braintree-5',
    propertyName: 'New York Fashion Hotel',
    brandName: 'Style Collection',
    mid: 'BT_MID_005',
    secretKey: 'BT_SECRET_005',
    isActive: false,
    isEditing: false,
    gateway: 'braintree',
  },
  {
    id: 'braintree-6',
    propertyName: 'Boston Academic Hotel',
    brandName: 'Education Collection',
    mid: 'BT_MID_006',
    secretKey: 'BT_SECRET_006',
    isActive: true,
    isEditing: false,
    gateway: 'braintree',
  },
  {
    id: 'braintree-7',
    propertyName: 'Seattle Coffee Hotel',
    brandName: 'Beverage Collection',
    mid: 'BT_MID_007',
    secretKey: 'BT_SECRET_007',
    isActive: false,
    isEditing: false,
    gateway: 'braintree',
  },
  {
    id: 'braintree-8',
    propertyName: 'Austin Music Hotel',
    brandName: 'Sound Collection',
    mid: 'BT_MID_008',
    secretKey: 'BT_SECRET_008',
    isActive: true,
    isEditing: false,
    gateway: 'braintree',
  },
  {
    id: 'braintree-9',
    propertyName: 'Portland Art Hotel',
    brandName: 'Creative Collection',
    mid: 'BT_MID_009',
    secretKey: 'BT_SECRET_009',
    isActive: true,
    isEditing: false,
    gateway: 'braintree',
  },
  {
    id: 'braintree-10',
    propertyName: 'Miami Beach Hotel',
    brandName: 'Tropical Collection',
    mid: 'BT_MID_010',
    secretKey: 'BT_SECRET_010',
    isActive: false,
    isEditing: false,
    gateway: 'braintree',
  },

  // Worldpay Properties (10 total)
  {
    id: 'worldpay-1',
    propertyName: 'London Bridge Hotel',
    brandName: 'British Collection',
    mid: 'WP_MID_001',
    secretKey: 'WP_SECRET_001',
    isActive: true,
    isEditing: false,
    gateway: 'worldpay',
  },
  {
    id: 'worldpay-2',
    propertyName: 'Edinburgh Castle Hotel',
    brandName: 'Scottish Collection',
    mid: 'WP_MID_002',
    secretKey: 'WP_SECRET_002',
    isActive: false,
    isEditing: false,
    gateway: 'worldpay',
  },
  {
    id: 'worldpay-3',
    propertyName: 'Cardiff Bay Hotel',
    brandName: 'Welsh Collection',
    mid: 'WP_MID_003',
    secretKey: 'WP_SECRET_003',
    isActive: true,
    isEditing: false,
    gateway: 'worldpay',
  },
  {
    id: 'worldpay-4',
    propertyName: 'Belfast Harbor Hotel',
    brandName: 'Irish Collection',
    mid: 'WP_MID_004',
    secretKey: 'WP_SECRET_004',
    isActive: true,
    isEditing: false,
    gateway: 'worldpay',
  },
  {
    id: 'worldpay-5',
    propertyName: 'Oxford University Hotel',
    brandName: 'Academic Collection',
    mid: 'WP_MID_005',
    secretKey: 'WP_SECRET_005',
    isActive: false,
    isEditing: false,
    gateway: 'worldpay',
  },
  {
    id: 'worldpay-6',
    propertyName: 'Manchester Industrial Hotel',
    brandName: 'Heritage Collection',
    mid: 'WP_MID_006',
    secretKey: 'WP_SECRET_006',
    isActive: true,
    isEditing: false,
    gateway: 'worldpay',
  },
  {
    id: 'worldpay-7',
    propertyName: 'Liverpool Music Hotel',
    brandName: 'Beatles Collection',
    mid: 'WP_MID_007',
    secretKey: 'WP_SECRET_007',
    isActive: false,
    isEditing: false,
    gateway: 'worldpay',
  },
  {
    id: 'worldpay-8',
    propertyName: 'Birmingham Business Hotel',
    brandName: 'Commerce Collection',
    mid: 'WP_MID_008',
    secretKey: 'WP_SECRET_008',
    isActive: true,
    isEditing: false,
    gateway: 'worldpay',
  },
  {
    id: 'worldpay-9',
    propertyName: 'Glasgow Art Hotel',
    brandName: 'Cultural Collection',
    mid: 'WP_MID_009',
    secretKey: 'WP_SECRET_009',
    isActive: true,
    isEditing: false,
    gateway: 'worldpay',
  },
  {
    id: 'worldpay-10',
    propertyName: 'Newcastle Quay Hotel',
    brandName: 'Maritime Collection',
    mid: 'WP_MID_010',
    secretKey: 'WP_SECRET_010',
    isActive: false,
    isEditing: false,
    gateway: 'worldpay',
  },

  // Authorize.net Properties (10 total)
  {
    id: 'authorize-1',
    propertyName: 'Chicago Loop Hotel',
    brandName: 'Windy City Collection',
    mid: 'AUTH_MID_001',
    secretKey: 'AUTH_SECRET_001',
    isActive: true,
    isEditing: false,
    gateway: 'authorize',
  },
  {
    id: 'authorize-2',
    propertyName: 'Detroit Auto Hotel',
    brandName: 'Motor City Collection',
    mid: 'AUTH_MID_002',
    secretKey: 'AUTH_SECRET_002',
    isActive: false,
    isEditing: false,
    gateway: 'authorize',
  },
  {
    id: 'authorize-3',
    propertyName: 'Cleveland Rock Hotel',
    brandName: 'Music City Collection',
    mid: 'AUTH_MID_003',
    secretKey: 'AUTH_SECRET_003',
    isActive: true,
    isEditing: false,
    gateway: 'authorize',
  },
  {
    id: 'authorize-4',
    propertyName: 'Pittsburgh Steel Hotel',
    brandName: 'Industrial Collection',
    mid: 'AUTH_MID_004',
    secretKey: 'AUTH_SECRET_004',
    isActive: true,
    isEditing: false,
    gateway: 'authorize',
  },
  {
    id: 'authorize-5',
    propertyName: 'Milwaukee Beer Hotel',
    brandName: 'Brewery Collection',
    mid: 'AUTH_MID_005',
    secretKey: 'AUTH_SECRET_005',
    isActive: false,
    isEditing: false,
    gateway: 'authorize',
  },
  {
    id: 'authorize-6',
    propertyName: 'Indianapolis Speed Hotel',
    brandName: 'Racing Collection',
    mid: 'AUTH_MID_006',
    secretKey: 'AUTH_SECRET_006',
    isActive: true,
    isEditing: false,
    gateway: 'authorize',
  },
  {
    id: 'authorize-7',
    propertyName: 'Columbus Discovery Hotel',
    brandName: 'Exploration Collection',
    mid: 'AUTH_MID_007',
    secretKey: 'AUTH_SECRET_007',
    isActive: false,
    isEditing: false,
    gateway: 'authorize',
  },
  {
    id: 'authorize-8',
    propertyName: 'Cincinnati River Hotel',
    brandName: 'Queen City Collection',
    mid: 'AUTH_MID_008',
    secretKey: 'AUTH_SECRET_008',
    isActive: true,
    isEditing: false,
    gateway: 'authorize',
  },
  {
    id: 'authorize-9',
    propertyName: 'Kansas City Jazz Hotel',
    brandName: 'Music Collection',
    mid: 'AUTH_MID_009',
    secretKey: 'AUTH_SECRET_009',
    isActive: true,
    isEditing: false,
    gateway: 'authorize',
  },
  {
    id: 'authorize-10',
    propertyName: 'St. Louis Arch Hotel',
    brandName: 'Gateway Collection',
    mid: 'AUTH_MID_010',
    secretKey: 'AUTH_SECRET_010',
    isActive: false,
    isEditing: false,
    gateway: 'authorize',
  },
];

export const ConfigurePaymentGateways: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const selectedGatewaysParam = searchParams.get('gateways');
  const initialGateways = selectedGatewaysParam ? selectedGatewaysParam.split(',') : ['stripe'];
  
  console.log('Component initialization - selectedGatewaysParam:', selectedGatewaysParam);
  console.log('Component initialization - initialGateways:', initialGateways);
  
  const [selectedGateways, setSelectedGateways] = useState<string[]>(initialGateways);
  const [activeTab, setActiveTab] = useState(initialGateways[0]);
  const [properties, setProperties] = useState<PropertyConfig[]>(mockProperties);
  const [editingProperty, setEditingProperty] = useState<string | null>(null);
  const [selectedProperties, setSelectedProperties] = useState<Set<string>>(new Set());
  const [showOverflowMenu, setShowOverflowMenu] = useState<string | null>(null);
  const [showAddGatewayDrawer, setShowAddGatewayDrawer] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGatewaysToAdd, setSelectedGatewaysToAdd] = useState<Set<string>>(new Set());
  const [isUpdatingFromLocal, setIsUpdatingFromLocal] = useState(false);
  const isUpdatingRef = useRef(false);
  const [showBulkEditPopup, setShowBulkEditPopup] = useState(false);
  const [bulkEditData, setBulkEditData] = useState({ mid: '', secretKey: '' });
  const [propertySearchQuery, setPropertySearchQuery] = useState('');
  const [showActivationPopup, setShowActivationPopup] = useState(false);
  const [activatingPropertyId, setActivatingPropertyId] = useState<string | null>(null);
  const [showDeactivationPopup, setShowDeactivationPopup] = useState(false);
  const [deactivatingPropertyId, setDeactivatingPropertyId] = useState<string | null>(null);
  const [isBulkDeactivation, setIsBulkDeactivation] = useState(false);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [deletingPropertyId, setDeletingPropertyId] = useState<string | null>(null);
  const [isBulkDelete, setIsBulkDelete] = useState(false);
  const [showRemoveGatewayPopup, setShowRemoveGatewayPopup] = useState(false);
  const [gatewayToRemove, setGatewayToRemove] = useState<string | null>(null);
  const [visibleSecretKeys, setVisibleSecretKeys] = useState<Set<string>>(new Set());
  const [verificationStatus, setVerificationStatus] = useState<Record<string, 'pending' | 'verified' | 'failed' | undefined>>({});
  const [verificationErrors, setVerificationErrors] = useState<Record<string, { mid?: string; secretKey?: string }>>({});
  const [selectedBrand, setSelectedBrand] = useState<string>('all');



  // Sync local state with URL parameters
  useEffect(() => {
    if (isUpdatingRef.current) {
      // Skip URL sync if we're updating from local state
      isUpdatingRef.current = false;
      return;
    }

    const selectedGatewaysParam = searchParams.get('gateways');
    const gatewaysFromUrl = selectedGatewaysParam ? selectedGatewaysParam.split(',') : ['stripe'];
    
    console.log('URL sync effect - gatewaysFromUrl:', gatewaysFromUrl);
    console.log('URL sync effect - current selectedGateways:', selectedGateways);
    
    if (JSON.stringify(gatewaysFromUrl) !== JSON.stringify(selectedGateways)) {
      console.log('Updating selectedGateways from URL');
      setSelectedGateways(gatewaysFromUrl);
      setActiveTab(gatewaysFromUrl[0]);
    }
  }, [searchParams]); // Removed isUpdatingFromLocal from dependencies to prevent infinite loops

  // Monitor selectedGateways state changes
  useEffect(() => {
    console.log('selectedGateways state changed to:', selectedGateways);
  }, [selectedGateways]);

  // Monitor selectedGatewaysToAdd state changes
  useEffect(() => {
    console.log('selectedGatewaysToAdd state changed to:', Array.from(selectedGatewaysToAdd));
  }, [selectedGatewaysToAdd]);

  // Reset brand filter when active tab changes
  useEffect(() => {
    setSelectedBrand('all');
  }, [activeTab]);

  // Close overflow menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      // Check if the click is outside the overflow menu
      // Look for the overflow menu button or dropdown within the same tab container
      const tabContainer = target.closest('[data-gateway-tab]');
      if (showOverflowMenu && tabContainer) {
        const overflowButton = tabContainer.querySelector('[data-overflow-button]');
        const overflowDropdown = tabContainer.querySelector('[data-overflow-dropdown]');
        
        // If click is not on the overflow button or dropdown, close the menu
        if (!overflowButton?.contains(target) && !overflowDropdown?.contains(target)) {
          setShowOverflowMenu(null);
        }
      } else if (showOverflowMenu) {
        // If click is outside any tab container, close the menu
        setShowOverflowMenu(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showOverflowMenu]);

  const handleEdit = (propertyId: string) => {
    setProperties(prev => 
      prev.map(prop => 
        prop.id === propertyId ? { ...prop, isEditing: true } : prop
      )
    );
    // Clear verification status when starting to edit
    setVerificationStatus(prev => ({ ...prev, [propertyId]: undefined }));
    setVerificationErrors(prev => ({ ...prev, [propertyId]: {} }));
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
    setProperties(prev => 
      prev.map(prop => 
        prop.id === propertyId ? { ...prop, isEditing: false } : prop
      )
    );
    // Clear verification status when canceling edit
    setVerificationStatus(prev => ({ ...prev, [propertyId]: undefined }));
    setVerificationErrors(prev => ({ ...prev, [propertyId]: {} }));
  };

  const handleDelete = (propertyId: string) => {
    setDeletingPropertyId(propertyId);
    setShowDeletePopup(true);
  };

  const handleToggleActive = (propertyId: string) => {
    setActivatingPropertyId(propertyId);
    setShowActivationPopup(true);
  };

  const handleToggleChange = (propertyId: string, isActive: boolean) => {
    const property = properties.find(p => p.id === propertyId);
    
    if (property?.isEditing) {
      // In edit mode, just update the state (will be saved when check button is clicked)
      setProperties(prev => 
        prev.map(prop => 
          prop.id === propertyId ? { ...prop, isActive } : prop
        )
      );
    } else {
      // In read-only mode, directly update the status
      if (isActive) {
        // If turning on, show activation popup
        setActivatingPropertyId(propertyId);
        setShowActivationPopup(true);
      } else {
        // If turning off, show deactivation confirmation popup
        setDeactivatingPropertyId(propertyId);
        setIsBulkDeactivation(false);
        setShowDeactivationPopup(true);
      }
    }


  };

  const handleInputChange = (propertyId: string, field: keyof PropertyConfig, value: string) => {
    setProperties(prev => 
      prev.map(prop => 
        prop.id === propertyId ? { ...prop, [field]: value } : prop
      )
    );
    
    // Clear verification status when MID or Secret Key changes
    if (field === 'mid' || field === 'secretKey') {
      setVerificationStatus(prev => ({ ...prev, [propertyId]: undefined }));
      setVerificationErrors(prev => ({ ...prev, [propertyId]: {} }));
    }
  };

  const handleToggleSecretKey = (propertyId: string) => {
    setVisibleSecretKeys(prev => {
      const newSet = new Set(prev);
      if (newSet.has(propertyId)) {
        newSet.delete(propertyId);
      } else {
        newSet.add(propertyId);
      }
      return newSet;
    });
  };

  const handleVerifyCredentials = async (propertyId: string) => {
    const property = properties.find(p => p.id === propertyId);
    if (!property) return;

    // Set verification status to pending
    setVerificationStatus(prev => ({ ...prev, [propertyId]: 'pending' }));
    setVerificationErrors(prev => ({ ...prev, [propertyId]: {} }));

    // Simulate API call for verification
    try {
      // Mock validation logic - replace with actual API call
      const errors: { mid?: string; secretKey?: string } = {};
      
      // Validate MID (example: should not be empty and should be alphanumeric)
      if (!property.mid.trim()) {
        errors.mid = 'MID is required';
      } else if (!/^[a-zA-Z0-9]+$/.test(property.mid.trim())) {
        errors.mid = 'MID should contain only letters and numbers';
      }

      // Validate Secret Key (example: should not be empty and should be at least 8 characters)
      if (!property.secretKey.trim()) {
        errors.secretKey = 'Secret Key is required';
      } else if (property.secretKey.trim().length < 8) {
        errors.secretKey = 'Secret Key should be at least 8 characters';
      }

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      if (Object.keys(errors).length > 0) {
        // Verification failed
        setVerificationStatus(prev => ({ ...prev, [propertyId]: 'failed' }));
        setVerificationErrors(prev => ({ ...prev, [propertyId]: errors }));
      } else {
        // Verification successful
        setVerificationStatus(prev => ({ ...prev, [propertyId]: 'verified' }));
        setVerificationErrors(prev => ({ ...prev, [propertyId]: {} }));
      }
    } catch (error) {
      // Handle API error
      setVerificationStatus(prev => ({ ...prev, [propertyId]: 'failed' }));
      setVerificationErrors(prev => ({ 
        ...prev, 
        [propertyId]: { 
          mid: 'Verification failed. Please try again.' 
        } 
      }));
    }
  };

  const handleSelectProperty = (propertyId: string) => {
    setSelectedProperties(prev => {
      const newSet = new Set(prev);
      if (newSet.has(propertyId)) {
        newSet.delete(propertyId);
      } else {
        newSet.add(propertyId);
      }
      return newSet;
    });
  };

  const handleSelectAll = () => {
    if (selectedProperties.size === filteredProperties.length) {
      setSelectedProperties(new Set());
    } else {
      setSelectedProperties(new Set(filteredProperties.map(p => p.id)));
    }
  };

  const handleBulkEdit = () => {
    setShowBulkEditPopup(true);
  };

  const handleBulkDelete = () => {
    setIsBulkDelete(true);
    setShowDeletePopup(true);
  };

  const handleBulkActivate = () => {
    setShowActivationPopup(true);
  };

  const handleBulkDeactivate = () => {
    setDeactivatingPropertyId(null);
    setIsBulkDeactivation(true);
    setShowDeactivationPopup(true);
  };

  const handleBulkEditSave = () => {
    // No bulk edit functionality since MID and Secret Key columns are removed
    setShowBulkEditPopup(false);
    setBulkEditData({ mid: '', secretKey: '' });
    setSelectedProperties(new Set());
  };

  const handleBulkEditCancel = () => {
    setShowBulkEditPopup(false);
    setBulkEditData({ mid: '', secretKey: '' });
    setSelectedProperties(new Set());
  };

  const handleRemoveGateway = (gateway: string) => {
    console.log('=== handleRemoveGateway called ===');
    console.log('Removing gateway:', gateway);
    
    // Set the gateway to remove and show confirmation popup
    setGatewayToRemove(gateway);
    setShowRemoveGatewayPopup(true);
    
    // Close overflow menu
    setShowOverflowMenu(null);
    console.log('=== handleRemoveGateway confirmation popup shown ===');
  };

  const confirmRemoveGateway = () => {
    if (!gatewayToRemove) return;
    
    console.log('=== confirmRemoveGateway called ===');
    console.log('Removing gateway:', gatewayToRemove);
    console.log('Current selectedGateways:', selectedGateways);
    
    const updatedGateways = selectedGateways.filter(g => g !== gatewayToRemove);
    console.log('Updated gateways after removal:', updatedGateways);
    
    if (updatedGateways.length === 0) {
      console.log('No gateways left, navigating to home');
      navigate('/');
      return;
    }
    
    // Set flag to prevent URL sync from overriding local state
    isUpdatingRef.current = true;
    console.log('isUpdatingRef set to true');
    
    // Update local state immediately
    setSelectedGateways(updatedGateways);
    console.log('setSelectedGateways called with:', updatedGateways);
    
    // Update URL with remaining gateways
    const params = new URLSearchParams();
    updatedGateways.forEach(g => params.append('gateways', g));
    const newUrl = `/configure?${params.toString()}`;
    console.log('Navigating to:', newUrl);
    navigate(newUrl, { replace: true });
    
    // Update active tab if current one is removed
    if (activeTab === gatewayToRemove) {
      console.log('Active tab is being removed, switching to:', updatedGateways[0]);
      setActiveTab(updatedGateways[0]);
    }
    
    // Close popup and reset state
    setShowRemoveGatewayPopup(false);
    setGatewayToRemove(null);
    console.log('=== confirmRemoveGateway completed ===');
  };

  const cancelRemoveGateway = () => {
    console.log('=== cancelRemoveGateway called ===');
    setShowRemoveGatewayPopup(false);
    setGatewayToRemove(null);
  };

  const availableGateways = [
    { id: 'stripe', name: 'Stripe', logo: 'https://cdn.worldvectorlogo.com/logos/stripe-4.svg', description: 'Global payment processing platform' },
    { id: 'paypal', name: 'PayPal', logo: 'https://cdn.worldvectorlogo.com/logos/paypal-3.svg', description: 'Digital payment service' },
    { id: 'razorpay', name: 'Razorpay', logo: 'https://razorpay.com/favicon.png', description: 'Payment gateway for India' },
    { id: 'reddotpayment', name: 'Red Dot Payment', logo: 'https://upload.wikimedia.org/wikipedia/commons/f/fd/Red_Dot_Payment_logo.png', description: 'Singapore-based payment gateway for Asia Pacific region' },
    { id: 'hyperpay', name: 'HyperPay', logo: 'https://image.pitchbook.com/sZCjcMOqDUPLq7EoqSM3vsOQNXT1744795249004_200x200', description: 'Middle East focused payment gateway with support for local payment methods' },
    { id: 'adyen', name: 'Adyen', logo: 'https://www.adyen.com/static/images/adyen-logo.svg', description: 'Global payment platform' },
    { id: 'iolpay', name: 'IOL Pay', logo: 'https://via.placeholder.com/150x60/059669/FFFFFF?text=IOL+Pay', description: 'Digital payment solutions for modern businesses' },
    { id: 'worldpay', name: 'Worldpay', logo: 'https://cdn.worldvectorlogo.com/logos/worldpay-1.svg', description: 'Payment processing services' },
    { id: 'braintree', name: 'Braintree', logo: 'https://uploads.sitepoint.com/wp-content/uploads/2014/08/1409502454Braintree-Logo.jpg', description: 'Mobile and web payment systems' },
    { id: 'klarna', name: 'Klarna', logo: 'https://cdn.worldvectorlogo.com/logos/klarna-1.svg', description: 'Buy now, pay later service' },
  ];

  const filteredGateways = availableGateways.filter(gateway =>
    gateway.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    gateway.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectGatewayToAdd = (gatewayId: string, checked?: boolean) => {
    console.log('handleSelectGatewayToAdd called with:', { gatewayId, checked });
    setSelectedGatewaysToAdd(prev => {
      const newSet = new Set(prev);
      if (checked === undefined) {
        // Toggle behavior when no checked value provided
        if (newSet.has(gatewayId)) {
          newSet.delete(gatewayId);
          console.log('Removed gatewayId from selection:', gatewayId);
        } else {
          newSet.add(gatewayId);
          console.log('Added gatewayId to selection:', gatewayId);
        }
      } else {
        // Use the provided checked value
        if (checked) {
          newSet.add(gatewayId);
          console.log('Added gatewayId to selection (checked):', gatewayId);
        } else {
          newSet.delete(gatewayId);
          console.log('Removed gatewayId from selection (unchecked):', gatewayId);
        }
      }
      console.log('New selection set:', Array.from(newSet));
      return newSet;
    });
  };

  const handleAddSelectedGateways = () => {
    console.log('=== handleAddSelectedGateways called ===');
    console.log('selectedGatewaysToAdd:', selectedGatewaysToAdd);
    console.log('Current selectedGateways before update:', selectedGateways);
    
    const newGateways = Array.from(selectedGatewaysToAdd).filter(
      gatewayId => !selectedGateways.includes(gatewayId)
    );
    
    console.log('New gateways to add:', newGateways);
    
    if (newGateways.length > 0) {
      const updatedGateways = [...selectedGateways, ...newGateways];
      
      console.log('Final updated gateways:', updatedGateways);
      
      // Set flag to prevent URL sync from overriding local state
      isUpdatingRef.current = true;
      console.log('isUpdatingRef set to true');
      
      // Update local state immediately
      setSelectedGateways(updatedGateways);
      console.log('setSelectedGateways called with:', updatedGateways);
      
      // Update URL parameters
      const params = new URLSearchParams();
      updatedGateways.forEach(g => params.append('gateways', g));
      const newUrl = `/configure?${params.toString()}`;
      console.log('Navigating to:', newUrl);
      navigate(newUrl, { replace: true });
      
      // Set the first newly added gateway as the active tab
      if (newGateways.length > 0) {
        setActiveTab(newGateways[0]);
        console.log('setActiveTab called with:', newGateways[0]);
      }
    } else {
      console.log('No new gateways to add');
    }
    
    setShowAddGatewayDrawer(false);
    setSearchQuery('');
    setSelectedGatewaysToAdd(new Set());
    console.log('=== handleAddSelectedGateways completed ===');
  };

  const handleSelectAllAvailable = () => {
    const availableToSelect = availableGateways
      .filter(gateway => !selectedGateways.includes(gateway.id))
      .map(gateway => gateway.id);
    setSelectedGatewaysToAdd(new Set(availableToSelect));
  };

  const handleClearSelection = () => {
    setSelectedGatewaysToAdd(new Set());
  };

  const getGatewayLogo = (gateway: string) => {
    const gatewayData = availableGateways.find(g => g.id === gateway);
    return gatewayData ? gatewayData.logo : "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=100&h=60&fit=crop";
  };

  const getGatewayName = (gateway: string) => {
    const gatewayData = availableGateways.find(g => g.id === gateway);
    return gatewayData ? gatewayData.name : 'Unknown Gateway';
  };

  const getGatewayLoginUrl = (gateway: string) => {
    switch (gateway.toLowerCase()) {
      case 'paypal':
        return 'https://www.paypal.com/signin';
      case 'razorpay':
        return 'https://dashboard.razorpay.com/signin';
      case 'stripe':
        return 'https://dashboard.stripe.com/login';
      case 'reddotpayment':
        return 'https://reddotpayment.com/login';
      case 'hyperpay':
        return 'https://hyperpay.com/login';
      case 'adyen':
        return 'https://ca-test.adyen.com/ca/ca/login.shtml';
      case 'iolpay':
        return 'https://iolpay.com/login';
      default:
        return 'https://www.paypal.com/signin';
    }
  };

  // Get unique brands for the active gateway
  const getUniqueBrands = () => {
    const activeGatewayProperties = properties.filter(property => property.gateway === activeTab);
    const brands = [...new Set(activeGatewayProperties.map(property => property.brandName))];
    return brands.sort();
  };

  // Filter properties based on search query, active gateway, and selected brand
  const filteredProperties = properties.filter(property => {
    // First filter by active gateway
    if (property.gateway !== activeTab) return false;
    
    // Filter by selected brand
    if (selectedBrand !== 'all' && property.brandName !== selectedBrand) return false;
    
    const searchTerm = propertySearchQuery.toLowerCase().trim();
    
    // If search is empty, return all properties for this gateway and brand
    if (!searchTerm) return true;
    
    const propertyNameMatch = property.propertyName.toLowerCase().includes(searchTerm);
    const brandNameMatch = property.brandName.toLowerCase().includes(searchTerm);
    const midMatch = property.mid.toLowerCase().includes(searchTerm);
    const secretKeyMatch = property.secretKey.toLowerCase().includes(searchTerm);
    const statusMatch = (property.isActive ? 'enable' : 'disable').includes(searchTerm);
    
    return propertyNameMatch || brandNameMatch || midMatch || secretKeyMatch || statusMatch;
  });
  
  // Get properties for the active gateway
  const activeGatewayProperties = properties.filter(property => property.gateway === activeTab);
  
  // Debug logging
  console.log('Active gateway:', activeTab);
  console.log('Search query:', propertySearchQuery);
  console.log('Total properties for active gateway:', activeGatewayProperties.length);
  console.log('Filtered properties count:', filteredProperties.length);
  console.log('Filtered properties:', filteredProperties.map(p => ({ name: p.propertyName, isActive: p.isActive })));
  
  const handleBack = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with Back Button */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBack}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
          <div className="h-6 w-px bg-gray-300" />
          <div className="flex-1">
            <h1 className="text-xl font-semibold text-gray-900">
              Configure Payment Gateways
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              {selectedGateways.length} Payment Gateway{selectedGateways.length !== 1 ? 's' : ''} Selected
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Selected Payment Gateways Tabs */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium text-gray-900">Selected Payment Gateways</h2>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAddGatewayDrawer(true)}
              className="flex items-center gap-2 text-blue-600 hover:text-blue-700 border-blue-200 hover:border-blue-300"
            >
              <span className="text-lg">+</span>
              Add Payment Gateway
            </Button>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
            {(() => { console.log('Rendering tabs with selectedGateways:', selectedGateways); return null; })()}
            {selectedGateways.map((gateway) => (
              <div
                key={gateway}
                data-gateway-tab={gateway}
                className={`flex flex-col items-center gap-2 px-10 py-4 rounded-lg border-2 transition-all relative min-w-[160px] ${
                  activeTab === gateway
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                }`}
              >
                {/* Overflow Menu - Positioned at top right */}
                <button
                  data-overflow-button
                  onClick={(e) => {
                    e.stopPropagation();
                    console.log('=== Overflow menu button clicked ===');
                    console.log('Gateway:', gateway);
                    console.log('Current showOverflowMenu:', showOverflowMenu);
                    const newMenuState = showOverflowMenu === gateway ? null : gateway;
                    console.log('Setting showOverflowMenu to:', newMenuState);
                    setShowOverflowMenu(newMenuState);
                  }}
                  className="absolute top-2 right-2 p-1 hover:bg-gray-100 rounded transition-colors z-10"
                >
                  <div className="flex flex-col gap-0.5">
                    <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                    <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                    <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                  </div>
                </button>
                
                {showOverflowMenu === gateway && (
                  <div data-overflow-dropdown className="absolute top-8 right-2 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 min-w-32">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveGateway(gateway);
                        setShowOverflowMenu(null);
                      }}
                      className="w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      Remove Gateway
                    </button>
                  </div>
                )}
                
                <button
                  onClick={() => setActiveTab(gateway)}
                  className="flex flex-col items-center gap-2"
                >
                  <img
                    src={getGatewayLogo(gateway)}
                    alt={getGatewayName(gateway)}
                    className="w-16 h-12 object-contain rounded"
                  />
                  <div className="text-center">
                    <div className="text-xs font-medium capitalize text-gray-700">{getGatewayName(gateway)}</div>
                  </div>
                </button>
              </div>
            ))}
          </div>
          
          {/* KPI Cards */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Enable Properties</p>
                  <p className="text-2xl font-bold text-green-600">
                    {activeGatewayProperties.filter(p => p.isActive).length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>
            
            <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Disable Properties</p>
                  <p className="text-2xl font-bold text-red-600">
                    {activeGatewayProperties.filter(p => !p.isActive).length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>
            
            <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Properties</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {activeGatewayProperties.length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Configuration Table */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between mb-4">
              <CardTitle className="flex items-center gap-3">
                <img
                  src={getGatewayLogo(activeTab)}
                  alt={getGatewayName(activeTab)}
                  className="w-8 h-6 object-contain rounded"
                />
                {getGatewayName(activeTab)} Configuration
              </CardTitle>
              
              {/* Search and Brand Filter */}
              <div className="flex items-center gap-4">
                {/* Brand Filter Dropdown */}
                <div className="flex items-center gap-2">
                  <label htmlFor="brand-filter" className="text-sm font-medium text-gray-700">
                    Filter by Brand:
                  </label>
                  <Select value={selectedBrand} onValueChange={setSelectedBrand}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Select a brand" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Brands</SelectItem>
                      {getUniqueBrands().map((brand) => (
                        <SelectItem key={brand} value={brand}>
                          {brand}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {selectedBrand !== 'all' && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setSelectedBrand('all')}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      Clear Filter
                    </Button>
                  )}
                </div>
                {/* Search Input */}
                <div className="relative w-80">
                  <input
                    type="text"
                    placeholder="Search properties..."
                    value={propertySearchQuery}
                    onChange={(e) => setPropertySearchQuery(e.target.value)}
                    className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  {propertySearchQuery && (
                    <button
                      onClick={() => setPropertySearchQuery('')}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
                {/* Debug info */}
                {propertySearchQuery && (
                  <div className="text-sm text-gray-500 whitespace-nowrap">
                    Found {filteredProperties.length} properties
                  </div>
                )}
              </div>
            </div>
            {selectedProperties.size > 0 && (
              <div className="flex items-center justify-between mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-blue-900">
                    {selectedProperties.size} property{selectedProperties.size > 1 ? 'ies' : 'y'} selected
                  </span>
                  <div className="flex items-center gap-2">
                    {activeTab !== 'airpay' && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={handleBulkActivate}
                        className="text-green-600 hover:text-green-700"
                      >
                        Activate
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleBulkDeactivate}
                      className="text-orange-600 hover:text-orange-700"
                    >
                      Deactivate
                    </Button>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setSelectedProperties(new Set())}
                  className="text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            )}
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
                              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-1 font-medium text-gray-900 w-8">
                      <Checkbox
                        checked={selectedProperties.size === filteredProperties.length && filteredProperties.length > 0}
                        onCheckedChange={handleSelectAll}
                      />
                    </th>
                                          <th className="text-left py-3 px-4 font-medium text-gray-900">Property Name</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Brand Name</th>
                    {!filteredProperties.some(p => p.isEditing) && (
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                    )}
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody key={propertySearchQuery}>
                  {filteredProperties.length === 0 ? (
                    <tr>
                      <td colSpan={filteredProperties.some(p => p.isEditing) ? 4 : 5} className="py-8 text-center text-gray-500">
                        {propertySearchQuery ? (
                          <div>
                            <p>No properties found matching "{propertySearchQuery}"</p>
                            <button
                              onClick={() => setPropertySearchQuery('')}
                              className="mt-2 text-blue-600 hover:text-blue-700 underline"
                            >
                              Clear search
                            </button>
                          </div>
                        ) : (
                          <p>No properties available</p>
                        )}
                      </td>
                    </tr>
                  ) : (
                    filteredProperties.map((property) => (
                      <tr key={property.id} className={`border-b border-gray-100 hover:bg-gray-50 ${
                        !property.isActive ? 'bg-gray-25 opacity-75' : ''
                      }`}>
                        <td className="py-4 px-1 w-8">
                          <Checkbox
                            checked={selectedProperties.has(property.id)}
                            onCheckedChange={() => handleSelectProperty(property.id)}
                          />
                        </td>
                        <td className="py-4 px-4">
                          <div className="font-medium text-gray-900">{property.propertyName}</div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="text-gray-600">{property.brandName}</div>
                        </td>
                        {!filteredProperties.some(p => p.isEditing) && (
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-2">
                              {property.isActive ? (
                                <span className="text-green-600 font-medium">Enable</span>
                              ) : (
                                <span className="text-red-600 font-medium">Disable</span>
                              )}
                            </div>
                          </td>
                        )}
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
                                  onClick={() => handleToggleChange(property.id, true)}
                                  className="text-blue-600 hover:text-blue-700"
                                >
                                  <Edit3 className="w-4 h-4" />
                                </Button>
                                {property.isActive ? (
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleToggleChange(property.id, false)}
                                    className="text-orange-600 hover:text-orange-700"
                                  >
                                    Deactivate
                                  </Button>
                                ) : (
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleToggleChange(property.id, true)}
                                    className="text-green-600 hover:text-green-700"
                                  >
                                    Activate
                                  </Button>
                                )}
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Add Payment Gateway Side Drawer */}
      {showAddGatewayDrawer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-end">
          <div className="bg-white w-[500px] h-full shadow-xl flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Add Payment Gateways</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setShowAddGatewayDrawer(false);
                  setSearchQuery('');
                  setSelectedGatewaysToAdd(new Set());
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Search and Selection Controls */}
            <div className="p-6 border-b border-gray-200 space-y-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search payment gateways..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleSelectAllAvailable}
                    className="text-blue-600 hover:text-blue-700 border-blue-200 hover:border-blue-300"
                  >
                    Select All Available
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleClearSelection}
                    className="text-gray-600 hover:text-gray-700 border-gray-200 hover:border-gray-300"
                  >
                    Clear Selection
                  </Button>
                </div>
                {selectedGatewaysToAdd.size > 0 && (
                  <span className="text-sm text-blue-600 font-medium">
                    {selectedGatewaysToAdd.size} selected
                  </span>
                )}
              </div>
            </div>

            {/* Gateway List */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-3">
                {filteredGateways.map((gateway) => (
                  <div
                    key={gateway.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-all ${
                      selectedGateways.includes(gateway.id)
                        ? 'border-gray-300 bg-gray-50 opacity-60'
                        : selectedGatewaysToAdd.has(gateway.id)
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                    onClick={() => !selectedGateways.includes(gateway.id) && handleSelectGatewayToAdd(gateway.id)}
                  >
                    <div className="flex items-center gap-3">
                      <div onClick={(e) => e.stopPropagation()}>
                        <Checkbox
                          checked={selectedGatewaysToAdd.has(gateway.id)}
                          onCheckedChange={(checked) => {
                            if (!selectedGateways.includes(gateway.id)) {
                              handleSelectGatewayToAdd(gateway.id, checked as boolean);
                            }
                          }}
                          disabled={selectedGateways.includes(gateway.id)}
                          className="flex-shrink-0"
                        />
                      </div>
                      <img
                        src={gateway.logo}
                        alt={gateway.name}
                        className="w-10 h-6 object-contain rounded"
                      />
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{gateway.name}</h3>
                        <p className="text-sm text-gray-600">{gateway.description}</p>
                      </div>
                      {selectedGateways.includes(gateway.id) && (
                        <div className="flex items-center gap-1 text-gray-500">
                          <Check className="w-4 h-4" />
                          <span className="text-sm font-medium">Already Added</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                {filteredGateways.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No payment gateways found</p>
                  </div>
                )}
              </div>
            </div>

            {/* Add Selected Button */}
            {selectedGatewaysToAdd.size > 0 && (
              <div className="p-6 border-t border-gray-200">
                <Button
                  onClick={handleAddSelectedGateways}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Add {selectedGatewaysToAdd.size} Payment Gateway{selectedGatewaysToAdd.size > 1 ? 's' : ''}
                </Button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Bulk Edit Popup */}
      {showBulkEditPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Bulk Edit Properties</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBulkEditCancel}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-4">
              <div className="text-sm text-gray-600 mb-4">
                No bulk edit options available for the selected properties.
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200">
              <Button
                variant="outline"
                onClick={handleBulkEditCancel}
                className="text-gray-600 hover:text-gray-700"
              >
                Cancel
              </Button>
              <Button
                onClick={handleBulkEditSave}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Activation Popup */}
      {showActivationPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl mx-4 h-[80vh] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <img
                  src={getGatewayLogo(activeTab)}
                  alt={getGatewayName(activeTab)}
                  className="w-8 h-6 object-contain rounded"
                />
                <h2 className="text-xl font-semibold text-gray-900">
                  Activate {getGatewayName(activeTab)} - Login Required
                </h2>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setShowActivationPopup(false);
                  setActivatingPropertyId(null);
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Content */}
            <div className="flex-1 p-6">
              <div className="text-sm text-gray-600 mb-4">
                {activatingPropertyId ? (
                  <>
                    Please log in to your {getGatewayName(activeTab)} account to activate the property: <strong>{properties.find(p => p.id === activatingPropertyId)?.propertyName}</strong>
                  </>
                ) : (
                  <>
                    Please log in to your {getGatewayName(activeTab)} account to activate {selectedProperties.size} selected propert{selectedProperties.size > 1 ? 'ies' : 'y'}.
                  </>
                )}
              </div>
              
              {/* Iframe Container */}
              <div className="w-full h-full border border-gray-200 rounded-lg overflow-hidden">
                <iframe
                  src={getGatewayLoginUrl(activeTab)}
                  className="w-full h-full"
                  title={`${getGatewayName(activeTab)} Login`}
                  sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox"
                />
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200">
              <Button
                variant="outline"
                onClick={() => {
                  setShowActivationPopup(false);
                  setActivatingPropertyId(null);
                }}
                className="text-gray-600 hover:text-gray-700"
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  if (activatingPropertyId) {
                    // Activate individual property
                    setProperties(prev => 
                      prev.map(prop => 
                        prop.id === activatingPropertyId 
                          ? { 
                              ...prop, 
                              isActive: true,
                              isEditing: prop.isEditing
                            } 
                          : prop
                      )
                    );
                  } else {
                    // Activate bulk properties
                    setProperties(prev => 
                      prev.map(prop => 
                        selectedProperties.has(prop.id) 
                          ? { 
                              ...prop, 
                              isActive: true,
                              isEditing: prop.isEditing
                            } 
                          : prop
                      )
                    );
                  }
                  setShowActivationPopup(false);
                  setActivatingPropertyId(null);
                }}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                {activatingPropertyId ? (
                  'Activate Property'
                ) : (
                  `Activate ${selectedProperties.size} Propert${selectedProperties.size > 1 ? 'ies' : 'y'}`
                )}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Deactivation Confirmation Popup */}
      {showDeactivationPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Confirm Deactivation
                </h2>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setShowDeactivationPopup(false);
                  setDeactivatingPropertyId(null);
                  setIsBulkDeactivation(false);
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Content */}
            <div className="p-6">
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-3">
                  {isBulkDeactivation ? (
                    `Deactivate ${selectedProperties.size} Propert${selectedProperties.size > 1 ? 'ies' : 'y'}?`
                  ) : (
                    `Deactivate "${getGatewayName(activeTab)}" for "${properties.find(p => p.id === deactivatingPropertyId)?.propertyName}"?`
                  )}
                </h3>
                
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                    <div>
                      <h4 className="font-medium text-red-800 mb-2">What happens when you deactivate a payment gateway?</h4>
                      <ul className="text-sm text-red-700 space-y-1">
                        <li>• All payment processing will be immediately stopped</li>
                        <li>• Customers will not be able to make payments through this gateway</li>
                        <li>• Any pending transactions may be affected</li>
                        <li>• You'll need to reactivate and re-authenticate to resume payments</li>
                        <li>• Historical transaction data will be preserved</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <h4 className="font-medium text-blue-800 mb-2">Important Notes:</h4>
                      <ul className="text-sm text-blue-700 space-y-1">
                        <li>• This action can be undone by reactivating the gateway</li>
                        <li>• No data will be lost during deactivation</li>
                        <li>• Consider the impact on your business operations</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200">
              <Button
                variant="outline"
                onClick={() => {
                  setShowDeactivationPopup(false);
                  setDeactivatingPropertyId(null);
                  setIsBulkDeactivation(false);
                }}
                className="text-gray-600 hover:text-gray-700"
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  if (isBulkDeactivation) {
                    // Deactivate bulk properties
                    setProperties(prev => 
                      prev.map(prop => 
                        selectedProperties.has(prop.id) 
                          ? { 
                              ...prop, 
                              isActive: false,
                              isEditing: prop.isEditing
                            } 
                          : prop
                      )
                    );
                  } else {
                    // Deactivate individual property
                    setProperties(prev => 
                      prev.map(prop => 
                        prop.id === deactivatingPropertyId 
                          ? { 
                              ...prop, 
                              isActive: false,
                              isEditing: prop.isEditing
                            } 
                          : prop
                      )
                    );
                  }
                  setShowDeactivationPopup(false);
                  setDeactivatingPropertyId(null);
                  setIsBulkDeactivation(false);
                }}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                {isBulkDeactivation ? (
                  `Deactivate ${selectedProperties.size} Propert${selectedProperties.size > 1 ? 'ies' : 'y'}`
                ) : (
                  'Deactivate Property'
                )}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Popup */}
      {showDeletePopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">
                Remove Property
              </h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setShowDeletePopup(false);
                  setDeletingPropertyId(null);
                  setIsBulkDelete(false);
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Content */}
            <div className="p-6">
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-3">
                  {isBulkDelete ? (
                    `Are you sure you want to remove ${selectedProperties.size} propert${selectedProperties.size > 1 ? 'ies' : 'y'} from ${getGatewayName(activeTab)}?`
                  ) : (
                    `Are you sure you want to remove "${properties.find(p => p.id === deletingPropertyId)?.propertyName}" from ${getGatewayName(activeTab)}?`
                  )}
                </h3>
                
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                    <div>
                      <h4 className="font-medium text-red-800 mb-2">What happens when you delete a property?</h4>
                      <ul className="text-sm text-red-700 space-y-1">
                        <li>• All payment processing will be immediately stopped for this property</li>
                        <li>• Customers will not be able to make payments through this gateway</li>
                        <li>• Any pending transactions for this property will be cancelled</li>
                        <li>• Historical transaction data for this property will be deleted</li>
                        <li>• This action cannot be undone</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <h4 className="font-medium text-blue-800 mb-2">Important Notes:</h4>
                      <ul className="text-sm text-blue-700 space-y-1">
                        <li>• This action is irreversible</li>
                        <li>• All data related to this property will be permanently deleted</li>
                        <li>• Consider the impact on your business operations</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200">
              <Button
                variant="outline"
                onClick={() => {
                  setShowDeletePopup(false);
                  setDeletingPropertyId(null);
                  setIsBulkDelete(false);
                }}
                className="text-gray-600 hover:text-gray-700"
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  if (isBulkDelete) {
                    // Delete bulk properties
                    setProperties(prev => 
                      prev.filter(prop => !selectedProperties.has(prop.id))
                    );
                  } else {
                    // Delete individual property
                    setProperties(prev => 
                      prev.filter(prop => prop.id !== deletingPropertyId)
                    );
                  }
                  setShowDeletePopup(false);
                  setDeletingPropertyId(null);
                  setIsBulkDelete(false);
                }}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                {isBulkDelete ? (
                  `Delete ${selectedProperties.size} Propert${selectedProperties.size > 1 ? 'ies' : 'y'}`
                ) : (
                  'Delete Property'
                )}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Remove Gateway Confirmation Popup */}
      {showRemoveGatewayPopup && gatewayToRemove && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <img
                  src={getGatewayLogo(gatewayToRemove)}
                  alt={getGatewayName(gatewayToRemove)}
                  className="w-8 h-6 object-contain rounded"
                />
                <h2 className="text-xl font-semibold text-gray-900">
                  Remove {getGatewayName(gatewayToRemove)}
                </h2>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={cancelRemoveGateway}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Content */}
            <div className="p-6">
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-3">
                  Are you sure you want to remove {getGatewayName(gatewayToRemove)} from your payment gateways?
                </h3>
                
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                    <div>
                      <h4 className="font-medium text-red-800 mb-2">What happens when you remove a payment gateway?</h4>
                      <ul className="text-sm text-red-700 space-y-1">
                        <li>• All properties configured for {getGatewayName(gatewayToRemove)} will be removed</li>
                        <li>• Payment processing through {getGatewayName(gatewayToRemove)} will be immediately stopped</li>
                        <li>• Customers will not be able to make payments using this gateway</li>
                        <li>• All configuration data for {getGatewayName(gatewayToRemove)} will be deleted</li>
                        <li>• Historical transaction data will be preserved but inaccessible</li>
                        <li>• This action cannot be undone</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <h4 className="font-medium text-blue-800 mb-2">Important Notes:</h4>
                      <ul className="text-sm text-blue-700 space-y-1">
                        <li>• This action is irreversible</li>
                        <li>• You can always add {getGatewayName(gatewayToRemove)} back later if needed</li>
                        <li>• Consider the impact on your business operations</li>
                        <li>• Make sure you have alternative payment methods configured</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Show affected properties count */}
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                    <div>
                      <h4 className="font-medium text-yellow-800 mb-2">Affected Properties:</h4>
                      <p className="text-sm text-yellow-700">
                        {properties.filter(p => p.gateway === gatewayToRemove).length} propert{properties.filter(p => p.gateway === gatewayToRemove).length === 1 ? 'y' : 'ies'} will be removed from {getGatewayName(gatewayToRemove)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200">
              <Button
                variant="outline"
                onClick={cancelRemoveGateway}
                className="text-gray-600 hover:text-gray-700"
              >
                Cancel
              </Button>
              <Button
                onClick={confirmRemoveGateway}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                Remove {getGatewayName(gatewayToRemove)}
              </Button>
            </div>
          </div>
        </div>
      )}



    </div>
  );
}; 