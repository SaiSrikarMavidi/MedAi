import { useState, useEffect } from 'react';
import { 
  Search, 
  ShoppingCart, 
  Plus, 
  Minus, 
  Star, 
  Filter,
  Upload,
  MapPin,
  Clock,
  Truck,
  CreditCard,
  CheckCircle,
  Package,
  Pill,
  Camera,
  X,
  ArrowRight,
  Shield,
  RefreshCw
} from 'lucide-react';
import ChatLayout from '../components/ChatLayout';
import { medicineAPI } from '../services/api';

// Medicine catalog database
const MEDICINE_CATALOG = [
  {
    id: 1,
    name: 'Aspirin',
    genericName: 'Acetylsalicylic Acid',
    dosage: '81mg',
    type: 'Tablet',
    price: 746,
    originalPrice: 1078,
    rating: 4.5,
    reviews: 127,
    brand: 'Bayer',
    imageUrl: '/api/placeholder/medicine/aspirin.jpg',
    inStock: true,
    prescription: false,
    category: 'Pain Relief',
    description: 'Low-dose aspirin for heart health and pain relief',
    sideEffects: ['Stomach upset', 'Heartburn'],
    benefits: ['Heart protection', 'Blood thinner', 'Pain relief']
  },
  {
    id: 2,
    name: 'Lisinopril',
    genericName: 'Lisinopril',
    dosage: '10mg',
    type: 'Tablet',
    price: 1327,
    originalPrice: 1659,
    rating: 4.3,
    reviews: 98,
    brand: 'Generic',
    imageUrl: '/api/placeholder/medicine/lisinopril.jpg',
    inStock: true,
    prescription: true,
    category: 'Blood Pressure',
    description: 'ACE inhibitor for high blood pressure',
    sideEffects: ['Dry cough', 'Dizziness'],
    benefits: ['Lower blood pressure', 'Heart protection']
  },
  {
    id: 3,
    name: 'Metformin',
    genericName: 'Metformin HCl',
    dosage: '500mg',
    type: 'Extended Release Tablet',
    price: 1867,
    originalPrice: 2406,
    rating: 4.1,
    reviews: 156,
    brand: 'Glucophage',
    imageUrl: '/api/placeholder/medicine/metformin.jpg',
    inStock: true,
    prescription: true,
    category: 'Diabetes',
    description: 'Type 2 diabetes medication to control blood sugar',
    sideEffects: ['Nausea', 'Stomach upset'],
    benefits: ['Blood sugar control', 'Weight management']
  },
  {
    id: 4,
    name: 'Omega-3',
    genericName: 'Fish Oil',
    dosage: '1000mg',
    type: 'Softgel',
    price: 1659,
    originalPrice: 2074,
    rating: 4.7,
    reviews: 203,
    brand: 'Nature Made',
    imageUrl: '/api/placeholder/medicine/omega3.jpg',
    inStock: true,
    prescription: false,
    category: 'Supplements',
    description: 'Essential fatty acids for heart and brain health',
    sideEffects: ['Fish aftertaste', 'Mild nausea'],
    benefits: ['Heart health', 'Brain function', 'Joint health']
  },
  {
    id: 5,
    name: 'Vitamin D3',
    genericName: 'Cholecalciferol',
    dosage: '2000 IU',
    type: 'Tablet',
    price: 1078,
    originalPrice: 1410,
    rating: 4.6,
    reviews: 89,
    brand: 'Nature\'s Bounty',
    imageUrl: '/api/placeholder/medicine/vitamind.jpg',
    inStock: true,
    prescription: false,
    category: 'Supplements',
    description: 'Essential vitamin for bone and immune health',
    sideEffects: ['Rare: excessive calcium'],
    benefits: ['Bone strength', 'Immune support', 'Mood support']
  }
];

const CATEGORIES = [
  'All',
  'Pain Relief',
  'Blood Pressure', 
  'Diabetes',
  'Supplements',
  'Antibiotics',
  'Heart Health'
];

// Shopping Cart Component
function ShoppingCartSidebar({ isOpen, onClose, cart, updateCartQuantity, removeFromCart, onCheckout }) {
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-end z-50">
      <div className="bg-white dark:bg-card-dark w-full max-w-md h-full overflow-y-auto">
        <div className="p-6 border-b border-gray-200 dark:border-sidebar-border flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <ShoppingCart className="w-5 h-5" />
            Shopping Cart ({totalItems})
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-sidebar-hover rounded-lg">
            <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        {cart.length === 0 ? (
          <div className="p-6 text-center">
            <div className="w-16 h-16 bg-gray-100 dark:bg-sidebar-hover rounded-full flex items-center justify-center mx-auto mb-4">
              <ShoppingCart className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-500 dark:text-gray-400">Your cart is empty</p>
          </div>
        ) : (
          <>
            <div className="p-6 space-y-4 flex-1">
              {cart.map((item) => (
                <div key={item.id} className="flex items-center gap-4 p-4 border border-gray-200 dark:border-sidebar-border rounded-lg">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900 dark:to-blue-800 rounded-lg flex items-center justify-center">
                    <Pill className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 dark:text-white text-sm">{item.name}</h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{item.dosage}</p>
                    <p className="text-sm font-medium text-primary">₹{item.price}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => updateCartQuantity(item.id, Math.max(0, item.quantity - 1))}
                      className="w-8 h-8 rounded-full bg-gray-100 dark:bg-sidebar-hover flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-600"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-8 text-center font-medium text-gray-900 dark:text-white">{item.quantity}</span>
                    <button 
                      onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                      className="w-8 h-8 rounded-full bg-gray-100 dark:bg-sidebar-hover flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-600"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <button 
                    onClick={() => removeFromCart(item.id)}
                    className="p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
            
            <div className="p-6 border-t border-gray-200 dark:border-sidebar-border">
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                  <span className="text-gray-900 dark:text-white font-medium">₹{totalPrice.toFixed(0)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Delivery</span>
                  <span className="text-green-600 dark:text-green-400 font-medium">FREE</span>
                </div>
                <div className="flex justify-between text-lg font-bold border-t border-gray-200 dark:border-sidebar-border pt-2">
                  <span className="text-gray-900 dark:text-white">Total</span>
                  <span className="text-gray-900 dark:text-white">₹{totalPrice.toFixed(0)}</span>
                </div>
              </div>
              
              <button 
                onClick={onCheckout}
                className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
              >
                <CreditCard className="w-4 h-4" />
                Checkout
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// Prescription Upload Modal
function PrescriptionUploadModal({ isOpen, onClose, onUpload }) {
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const files = [...e.dataTransfer.files];
    handleFiles(files);
  };

  const handleFileInput = (e) => {
    const files = [...e.target.files];
    handleFiles(files);
  };

  const handleFiles = (files) => {
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    setUploadedFiles(prev => [...prev, ...imageFiles]);
  };

  const removeFile = (index) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    if (uploadedFiles.length > 0) {
      onUpload(uploadedFiles);
      setUploadedFiles([]);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-card-dark rounded-xl shadow-xl max-w-lg w-full">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-sidebar-border">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Upload Prescription</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-sidebar-hover rounded-lg">
            <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div 
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragActive 
                ? 'border-primary bg-blue-50 dark:bg-blue-900/20' 
                : 'border-gray-300 dark:border-sidebar-border hover:border-primary'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-900 dark:text-white font-semibold mb-2">
              Drop your prescription here or click to browse
            </p>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Supports JPG, PNG, PDF files
            </p>
            <input
              type="file"
              multiple
              accept="image/*,.pdf"
              onChange={handleFileInput}
              className="hidden"
              id="prescription-upload"
            />
            <label 
              htmlFor="prescription-upload"
              className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors cursor-pointer"
            >
              <Camera className="w-4 h-4" />
              Choose Files
            </label>
          </div>

          {uploadedFiles.length > 0 && (
            <div className="space-y-2">
              <h3 className="font-semibold text-gray-900 dark:text-white">Uploaded Files:</h3>
              {uploadedFiles.map((file, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-background-dark rounded-lg">
                  <span className="text-sm text-gray-600 dark:text-gray-400">{file.name}</span>
                  <button 
                    onClick={() => removeFile(index)}
                    className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 p-1 rounded"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
              <div>
                <h4 className="font-semibold text-blue-900 dark:text-blue-100 text-sm">Secure & Private</h4>
                <p className="text-blue-700 dark:text-blue-300 text-xs mt-1">
                  Your prescription is encrypted and will be verified by our licensed pharmacists
                </p>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button 
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-sidebar-border text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-sidebar-hover transition-colors"
            >
              Cancel
            </button>
            <button 
              onClick={handleSubmit}
              disabled={uploadedFiles.length === 0}
              className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Upload & Verify
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Main Pharmacy Component
export default function Pharmacy() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showPrescriptionOnly, setShowPrescriptionOnly] = useState(false);
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [showPrescriptionModal, setShowPrescriptionModal] = useState(false);
  const [orderStatus, setOrderStatus] = useState(null); // 'ordering', 'success', 'failed'

  // Filter medicines based on search and category
  const filteredMedicines = MEDICINE_CATALOG.filter(medicine => {
    const matchesSearch = medicine.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         medicine.genericName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         medicine.category.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === 'All' || medicine.category === selectedCategory;
    const matchesPrescription = !showPrescriptionOnly || medicine.prescription;
    
    return matchesSearch && matchesCategory && matchesPrescription;
  });

  // Add to cart function
  const addToCart = (medicine) => {
    setCart(prev => {
      const existingItem = prev.find(item => item.id === medicine.id);
      if (existingItem) {
        return prev.map(item =>
          item.id === medicine.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prev, { ...medicine, quantity: 1 }];
      }
    });
  };

  // Update cart quantity
  const updateCartQuantity = (id, quantity) => {
    if (quantity === 0) {
      removeFromCart(id);
    } else {
      setCart(prev =>
        prev.map(item =>
          item.id === id ? { ...item, quantity } : item
        )
      );
    }
  };

  // Remove from cart
  const removeFromCart = (id) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  // Handle checkout
  const handleCheckout = async () => {
    setOrderStatus('ordering');
    setShowCart(false);
    
    try {
      // Simulate order processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setOrderStatus('success');
      setCart([]);
      
      // Reset status after 3 seconds
      setTimeout(() => setOrderStatus(null), 3000);
    } catch (error) {
      setOrderStatus('failed');
      setTimeout(() => setOrderStatus(null), 3000);
    }
  };

  // Handle prescription upload
  const handlePrescriptionUpload = (files) => {
    // In a real app, this would upload to the server
    alert(`Successfully uploaded ${files.length} prescription file(s). A pharmacist will verify your prescription within 24 hours.`);
  };

  const totalCartItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <ChatLayout>
      <div className="flex-1 overflow-y-auto">
        <main className="flex-1 w-full max-w-7xl mx-auto py-8 px-4 md:px-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <h1 className="text-white text-3xl md:text-4xl font-black leading-tight tracking-tight">
                  MediAI Pharmacy
                </h1>
                <p className="text-muted text-lg font-medium leading-relaxed">
                  Order medicines online with free delivery
                </p>
              </div>
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => setShowPrescriptionModal(true)}
                  className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors shadow-lg flex items-center gap-2"
                >
                  <Upload className="w-4 h-4" />
                  Upload Prescription
                </button>
                <button 
                  onClick={() => setShowCart(true)}
                  className="relative px-6 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors shadow-lg flex items-center gap-2"
                >
                  <ShoppingCart className="w-4 h-4" />
                  Cart
                  {totalCartItems > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
                      {totalCartItems}
                    </span>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="mb-8 space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search medicines, brands, or conditions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-sidebar-border rounded-lg bg-white dark:bg-card-dark text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-primary focus:border-primary"
                />
              </div>
              <div className="flex items-center gap-3">
                <button className="px-4 py-3 border border-gray-300 dark:border-sidebar-border rounded-lg bg-white dark:bg-card-dark text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-sidebar-hover transition-colors flex items-center gap-2">
                  <Filter className="w-4 h-4" />
                  Filters
                </button>
              </div>
            </div>

            {/* Categories */}
            <div className="flex gap-2 overflow-x-auto pb-2">
              {CATEGORIES.map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full whitespace-nowrap font-medium transition-colors ${
                    selectedCategory === category
                      ? 'bg-primary text-white'
                      : 'bg-white dark:bg-card-dark text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-sidebar-hover'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* Prescription Filter */}
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="prescription-only"
                checked={showPrescriptionOnly}
                onChange={(e) => setShowPrescriptionOnly(e.target.checked)}
                className="w-4 h-4 text-primary border-gray-300 dark:border-sidebar-border rounded focus:ring-primary"
              />
              <label htmlFor="prescription-only" className="text-sm text-gray-700 dark:text-gray-300">
                Show prescription medicines only
              </label>
            </div>
          </div>

          {/* Delivery Info Banner */}
          <div className="mb-8 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-xl p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                <Truck className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 dark:text-white">Free Same-Day Delivery</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  Order by 2 PM and get your medicines delivered today • No minimum order
                </p>
              </div>
              <div className="ml-auto flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                <Clock className="w-4 h-4" />
                <span>2-4 hours</span>
              </div>
            </div>
          </div>

          {/* Medicine Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredMedicines.map((medicine) => (
              <div key={medicine.id} className="bg-white dark:bg-card-dark rounded-xl border border-gray-200 dark:border-sidebar-border shadow-sm hover:shadow-md transition-shadow">
                {/* Medicine Image */}
                <div className="relative p-4">
                  <div className="w-full h-32 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900 dark:to-blue-800 rounded-lg flex items-center justify-center mb-3">
                    <Pill className="w-12 h-12 text-blue-600 dark:text-blue-400" />
                  </div>
                  {medicine.prescription && (
                    <div className="absolute top-6 right-6 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 text-xs font-medium px-2 py-1 rounded">
                      Rx
                    </div>
                  )}
                  {medicine.originalPrice > medicine.price && (
                    <div className="absolute top-6 left-6 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-xs font-medium px-2 py-1 rounded">
                      SALE
                    </div>
                  )}
                </div>

                <div className="p-4 pt-0">
                  {/* Medicine Info */}
                  <div className="mb-3">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{medicine.name}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{medicine.genericName} • {medicine.dosage}</p>
                    <p className="text-xs text-gray-400 dark:text-gray-500">{medicine.brand}</p>
                  </div>

                  {/* Rating */}
                  <div className="flex items-center gap-1 mb-3">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`w-3 h-3 ${i < Math.floor(medicine.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300 dark:text-gray-600'}`} 
                        />
                      ))}
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {medicine.rating} ({medicine.reviews})
                    </span>
                  </div>

                  {/* Price */}
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-lg font-bold text-gray-900 dark:text-white">₹{medicine.price}</span>
                    {medicine.originalPrice > medicine.price && (
                      <span className="text-sm text-gray-400 line-through">₹{medicine.originalPrice}</span>
                    )}
                  </div>

                  {/* Add to Cart Button */}
                  <button
                    onClick={() => addToCart(medicine)}
                    disabled={!medicine.inStock}
                    className={`w-full py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 ${
                      medicine.inStock
                        ? 'bg-primary text-white hover:bg-blue-600'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    {medicine.inStock ? (
                      <>
                        <Plus className="w-4 h-4" />
                        Add to Cart
                      </>
                    ) : (
                      'Out of Stock'
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* No Results */}
          {filteredMedicines.length === 0 && (
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-gray-100 dark:bg-sidebar-hover rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No medicines found</h3>
              <p className="text-gray-500 dark:text-gray-400">
                Try adjusting your search or filters
              </p>
            </div>
          )}
        </main>

        {/* Shopping Cart Sidebar */}
        <ShoppingCartSidebar
          isOpen={showCart}
          onClose={() => setShowCart(false)}
          cart={cart}
          updateCartQuantity={updateCartQuantity}
          removeFromCart={removeFromCart}
          onCheckout={handleCheckout}
        />

        {/* Prescription Upload Modal */}
        <PrescriptionUploadModal
          isOpen={showPrescriptionModal}
          onClose={() => setShowPrescriptionModal(false)}
          onUpload={handlePrescriptionUpload}
        />

        {/* Order Status Notifications */}
        {orderStatus && (
          <div className="fixed top-4 right-4 z-50">
            <div className={`p-4 rounded-lg shadow-lg max-w-sm ${
              orderStatus === 'ordering' ? 'bg-blue-500 text-white' :
              orderStatus === 'success' ? 'bg-green-500 text-white' :
              'bg-red-500 text-white'
            }`}>
              <div className="flex items-center gap-3">
                {orderStatus === 'ordering' && <RefreshCw className="w-5 h-5 animate-spin" />}
                {orderStatus === 'success' && <CheckCircle className="w-5 h-5" />}
                {orderStatus === 'failed' && <X className="w-5 h-5" />}
                <div>
                  <h4 className="font-semibold">
                    {orderStatus === 'ordering' ? 'Processing Order...' :
                     orderStatus === 'success' ? 'Order Confirmed!' :
                     'Order Failed'}
                  </h4>
                  <p className="text-sm opacity-90">
                    {orderStatus === 'ordering' ? 'Please wait while we process your order' :
                     orderStatus === 'success' ? 'Your medicines will be delivered in 2-4 hours' :
                     'Please try again or contact support'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </ChatLayout>
  );
}