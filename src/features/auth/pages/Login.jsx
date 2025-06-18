import React, { useState } from 'react';
import { login } from '../services/loginService'; // pastikan path sesuai
import toast from 'react-hot-toast';
import Logo from '../../../assets/logo-iotcampus-transparent.png'

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleEmailChange = (e) => setEmail(e.target.value);
  const handlePasswordChange = (e) => setPassword(e.target.value);

  const handleLogin = async () => {
    setIsLoading(true);
    setErrors({});
    try {
      const response = await login({ email, password });
      localStorage.setItem('authToken', response.token);
      toast.success('Login berhasil!');
    } catch (error) {
      if (error.type === 'validation') {
        setErrors(error.errors);
      } else {
        toast.error(error.message || 'Terjadi kesalahan.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-orange-50 relative overflow-hidden flex items-center justify-center p-4">
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-orange-300 via-orange-200 to-transparent rounded-full blur-3xl transform translate-x-32 -translate-y-32"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-orange-300 via-orange-200 to-transparent rounded-full blur-3xl transform -translate-x-24 translate-y-24"></div>

      <div className="w-full max-w-xs relative z-10">
        <div className="bg-gray-100 rounded-lg p-6 shadow-sm">
          <div className="flex justify-center mb-4">
            <img src={Logo} alt="IOTCampus Logo" className="w-24 h-auto" />
          </div>
          <h2 className="text-lg font-medium text-gray-900 text-center mb-6">
            Login to your account
          </h2>

          <div className="mb-3">
            <label className="block text-sm text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={handleEmailChange}
              placeholder='Enter your email address'
              className={`w-full px-3 py-2 bg-white border rounded text-sm text-gray-900 focus:outline-none focus:border-gray-400 ${
                errors.email ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email}</p>
            )}
          </div>

          <div className="mb-4">
            <div className="flex justify-between items-center mb-1">
              <label className="block text-sm text-gray-700">Password</label>
            </div>
            <input
              type="password"
              value={password}
              onChange={handlePasswordChange}
              placeholder="Enter your password"
              className={`w-full px-3 py-2 bg-white border rounded text-sm text-gray-500 focus:outline-none focus:border-gray-400 ${
                errors.password ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">{errors.password}</p>
            )}
          </div>

          <button
            onClick={handleLogin}
            disabled={isLoading}
            className={`w-full text-white font-medium py-2.5 px-4 rounded text-sm transition-colors duration-200 ${
              isLoading ? 'bg-orange-300 cursor-not-allowed' : 'bg-orange-400 hover:bg-orange-500'
            }`}
          >
            {isLoading ? 'Logging in...' : 'Login now'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
