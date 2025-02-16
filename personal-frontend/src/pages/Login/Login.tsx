import React, { useState } from 'react';
import LoginForm from './Loginform';
import SignupForm from './SignupForm';
import { Coffee } from 'lucide-react';

const LoginPage = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="h-screen w-screen overflow-auto bg-gradient-to-br from-teal-50 to-teal-100 flex items-center justify-center">
      <div className="w-full h-full md:h-auto md:max-h-[90vh] md:w-auto max-w-4xl bg-white md:rounded-3xl shadow-xl overflow-auto">
        <div className="p-6 md:p-8">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-6">
          <div className="rounded-lg bg-teal-500 p-1">
            <Coffee className="w-6 h-6 text-white" />
          </div>
            <span className="text-xl font-semibold text-gray-800">CAFETERIA CONNECT</span>
          </div>


          {/* Forms Container */}
          <div className="w-full">
            {isLogin ? <LoginForm /> : <SignupForm />}
          </div>

          {/* Toggle Link */}
          <div className="mt-6 text-center">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-base text-gray-600 hover:text-teal-500 transition-colors"
            >
              {isLogin ? 'Not a user? Sign up' : 'Already have an account? Log in'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;