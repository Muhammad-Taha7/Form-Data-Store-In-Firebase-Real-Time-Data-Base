import { useState, useEffect } from "react";
import { CheckCircle, XCircle, AlertTriangle, X } from "lucide-react";

const Toast = ({ message, type, onClose }) => {
  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      default:
        return null;
    }
  };

  const getBgColor = () => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200';
      case 'error':
        return 'bg-red-50 border-red-200';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg border shadow-lg min-w-80 max-w-md transition-all duration-300 ${getBgColor()}`}>
      <div className="flex items-start gap-3">
        {getIcon()}
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-900">{message}</p>
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export const Form = () => {
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
    address: "",
  });

  const [toast, setToast] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const showToast = (message, type) => {
    setToast({ message, type });
  };

  const hideToast = () => {
    setToast(null);
  };

  // Auto-hide toast after 5 seconds
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        hideToast();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const handleUserData = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const { name, email, password, address } = user;
    
    if (!name.trim() || !email.trim() || !password.trim() || !address.trim()) {
      showToast("Please fill in all required fields", "warning");
      return false;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showToast("Please enter a valid email address", "warning");
      return false;
    }

    // Password validation
    if (password.length < 6) {
      showToast("Password must be at least 6 characters long", "warning");
      return false;
    }

    return true;
  };

  const postdata = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const { name, email, password, address } = user;
      
      const res = await fetch(
        "https://fir-data-store-543f0-default-rtdb.firebaseio.com/firebasedatastore.json",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: name.trim(),
            email: email.trim(),
            password,
            address: address.trim(),
          }),
        }
      );

      if (res.ok) {
        showToast("Registration completed successfully! Welcome aboard.", "success");
        setUser({ name: "", email: "", password: "", address: "" });
      } else {
        const errorData = await res.json().catch(() => ({}));
        showToast(
          errorData.message || "Registration failed. Please try again later.",
          "error"
        );
      }
    } catch (err) {
      showToast(
        "Network error occurred. Please check your connection and try again.",
        "error"
      );
      console.error("Registration error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex justify-center items-center p-4">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={hideToast}
        />
      )}
      
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-center">
          <h2 className="text-2xl font-bold text-white">Create Account</h2>
          <p className="text-blue-100 mt-2">Join us today and get started</p>
        </div>
        
        <div className="p-6 space-y-6">
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              Full Name *
            </label>
            <input
              type="text"
              name="name"
              value={user.name}
              onChange={handleUserData}
              placeholder="Enter your full name"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              Email Address *
            </label>
            <input
              type="email"
              name="email"
              value={user.email}
              onChange={handleUserData}
              placeholder="Enter your email address"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              Password *
            </label>
            <input
              type="password"
              name="password"
              value={user.password}
              onChange={handleUserData}
              placeholder="Create a secure password"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
            />
            <p className="text-xs text-gray-500">Must be at least 6 characters long</p>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              Address *
            </label>
            <input
              type="text"
              name="address"
              value={user.address}
              onChange={handleUserData}
              placeholder="Enter your address"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
            />
          </div>

          <button
            onClick={postdata}
            disabled={isSubmitting}
            className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition-all duration-200 ${
              isSubmitting
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:ring-4 focus:ring-blue-300'
            }`}
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Creating Account...
              </div>
            ) : (
              'Create Account'
            )}
          </button>
        </div>
        
       
      </div>
    </div>
  );
};