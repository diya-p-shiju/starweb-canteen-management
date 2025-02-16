import React, { useState } from 'react';
import axios from 'axios';
import { X } from 'lucide-react';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  vendorId: string;
  onOrderSuccess: () => void;
}

interface CartItem {
  _id: string;
  name: string;
  price: number;
  quantity: number;
  calories: string;  // Add this
}

const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  cartItems,
  vendorId,
  onOrderSuccess
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const totalAmount = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  
  // Get user details from localStorage
  const userId = localStorage.getItem('_id') || '';
  const name = localStorage.getItem('name') || '';
  const email = localStorage.getItem('email') || '';
  const mobileNumber = localStorage.getItem('mobileNumber') || '';
  const credits = parseFloat(localStorage.getItem('credits') || '0');

  const updateUserCredits = async (newCredits: number) => {
    try {
      const response = await axios.put(`http://localhost:3000/user/${userId}`, {
        credits: newCredits
      });

      if (response.data.status === 'success') {
        // Update credits in localStorage
        localStorage.setItem('credits', newCredits.toString());
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error updating user credits:', error);
      return false;
    }
  };

  const handleCheckout = async () => {
    if (credits < totalAmount) {
      setError('Insufficient credits. Please recharge your account.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // First, try to update user credits
      const newCredits = credits - totalAmount;
      const creditUpdateSuccess = await updateUserCredits(newCredits);

      if (!creditUpdateSuccess) {
        throw new Error('Failed to update credits. Please try again.');
      }

      // Updated menuItems structure to match the schema
      const menuItems = cartItems.map(item => ({
        menuItemId: item._id,  // Changed from itemId to menuItemId
        calories: item.calories || "N/A",  // Add this to CartItem interface if not present
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        totalPrice: item.price * item.quantity  // Added totalPrice calculation
      }));

      const orderData = {
        userId,
        vendorId,
        menuItems,
        totalAmount,
        deliveryTime: new Date(Date.now() + 30 * 60000),
        name,
        email,
        mobileNumber
      };

      console.log('Sending order data:', orderData); // Add this for debugging

      const response = await axios.post('http://localhost:3000/order', orderData);

      if (response.data.status === 'success') {
        onOrderSuccess();
        onClose();
      } else {
        // If order creation fails, revert the credit deduction
        await updateUserCredits(credits);
        throw new Error('Failed to create order');
      }
    } catch (err: any) {
      console.error('Order error:', err); // Add this for debugging
      // Revert credits if they were deducted but order failed
      if (err.message !== 'Failed to update credits. Please try again.') {
        await updateUserCredits(credits);
      }
      setError(err.message || 'Failed to place order. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRechargeClick = () => {
    // You can replace this with navigation to recharge page
    alert('Please navigate to the recharge page to add more credits.');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose} />
      
      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold">Confirm Order</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-4 max-h-[70vh] overflow-y-auto">
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium mb-2">Order Summary</h3>
              {cartItems.map((item) => (
                <div key={item._id} className="flex justify-between items-center py-2">
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                  </div>
                  <p className="font-medium">₹{(item.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>

            <div className="border-t pt-4">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium">Your Credits:</span>
                <span className={`font-medium ${credits < totalAmount ? 'text-red-600' : 'text-green-600'}`}>
                  ₹{credits.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between items-center text-lg font-semibold">
                <span>Total Amount:</span>
                <span>₹{totalAmount.toFixed(2)}</span>
              </div>
              {credits < totalAmount && (
                <div className="mt-2">
                    <button
                    onClick={handleRechargeClick}
                    className="w-full py-2 bg-teal-600 text-white rounded-lg font-medium hover:bg-teal-700 transition-colors"
                    >
                    Recharge Credits
                    </button>
                </div>
              )}
            </div>

            {error && (
              <div className="p-3 bg-red-50 text-red-700 rounded-lg">
                {error}
              </div>
            )}
          </div>
        </div>

        <div className="p-4 border-t">
            <button
            onClick={handleCheckout}
            disabled={isLoading || credits < totalAmount}
            className={`w-full py-3 text-white rounded-lg font-medium transition-colors 
              ${isLoading || credits < totalAmount 
              ? 'bg-gray-300 cursor-not-allowed'
              : 'bg-teal-600 hover:bg-teal-700'}`}
            >
            {isLoading ? 'Processing...' : 'Confirm Order'}
            </button>
        </div>
      </div>
    </div>
  );
};

export default CheckoutModal;