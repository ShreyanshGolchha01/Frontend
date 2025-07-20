import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Users, ArrowLeft, Save } from 'lucide-react';

const NewCamp: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    campName: '',
    location: '',
    address: '',
    date: '',
    startTime: '',
    endTime: '',
    expectedPatients: '',
    description: '',
    services: [] as string[]
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const availableServices = [
    'सामान्य स्वास्थ्य जांच',
    'रक्तचाप जांच',
    'मधुमेह जांच',
    'आंखों की जांच',
    'दांतों की जांच',
    'टीकाकरण',
    'गर्भवती महिलाओं की जांच',
    'बच्चों की जांच'
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleServiceToggle = (service: string) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.includes(service)
        ? prev.services.filter(s => s !== service)
        : [...prev.services, service]
    }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.campName.trim()) {
      newErrors.campName = 'शिविर का नाम आवश्यक है';
    }
    if (!formData.location.trim()) {
      newErrors.location = 'स्थान आवश्यक है';
    }
    if (!formData.address.trim()) {
      newErrors.address = 'पूरा पता आवश्यक है';
    }
    if (!formData.date) {
      newErrors.date = 'तारीख आवश्यक है';
    }
    if (!formData.startTime) {
      newErrors.startTime = 'शुरुआती समय आवश्यक है';
    }
    if (!formData.endTime) {
      newErrors.endTime = 'समाप्ति समय आवश्यक है';
    }
    if (formData.startTime && formData.endTime && formData.startTime >= formData.endTime) {
      newErrors.endTime = 'समाप्ति समय शुरुआती समय से बाद होना चाहिए';
    }
    if (!formData.expectedPatients || parseInt(formData.expectedPatients) < 1) {
      newErrors.expectedPatients = 'अपेक्षित मरीजों की संख्या आवश्यक है';
    }
    if (formData.services.length === 0) {
      newErrors.services = 'कम से कम एक सेवा चुनें';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      alert('शिविर सफलतापूर्वक बनाया गया!');
      navigate('/doctor/dashboard');
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/doctor/dashboard')}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>वापस डैशबोर्ड पर जाएं</span>
          </button>
        </div>
      </div>

      {/* Page Title */}
      <div className="bg-gradient-to-r from-green-700 to-green-900 rounded-2xl p-6 text-white">
        <div className="flex items-center space-x-3">
          <MapPin className="h-8 w-8" />
          <div>
            <h1 className="text-2xl font-bold">नया स्वास्थ्य शिविर बनाएं</h1>
            <p className="text-green-100 mt-1">
              नए स्वास्थ्य शिविर की जानकारी दर्ज करें
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="card border border-gray-400">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">बुनियादी जानकारी</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="campName" className="block text-sm font-medium text-gray-700 mb-2">
                  शिविर का नाम *
                </label>
                <input
                  type="text"
                  id="campName"
                  name="campName"
                  value={formData.campName}
                  onChange={handleInputChange}
                  className={`input-field ${errors.campName ? 'border-red-500' : ''}`}
                  placeholder="उदाहरण: दुर्ग स्वास्थ्य शिविर"
                />
                {errors.campName && (
                  <p className="mt-1 text-sm text-red-600">{errors.campName}</p>
                )}
              </div>

              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                  स्थान *
                </label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  className={`input-field ${errors.location ? 'border-red-500' : ''}`}
                  placeholder="उदाहरण: दुर्ग सामुदायिक केंद्र"
                />
                {errors.location && (
                  <p className="mt-1 text-sm text-red-600">{errors.location}</p>
                )}
              </div>
            </div>

            <div className="mt-4">
              <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                पूरा पता *
              </label>
              <textarea
                id="address"
                name="address"
                rows={3}
                value={formData.address}
                onChange={handleInputChange}
                className={`input-field resize-none ${errors.address ? 'border-red-500' : ''}`}
                placeholder="शिविर का पूरा पता लिखें..."
              />
              {errors.address && (
                <p className="mt-1 text-sm text-red-600">{errors.address}</p>
              )}
            </div>
          </div>

          {/* Date and Time */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">दिनांक और समय</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div>
                <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
                  तारीख *
                </label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  min={new Date().toISOString().split('T')[0]}
                  className={`input-field ${errors.date ? 'border-red-500' : ''}`}
                />
                {errors.date && (
                  <p className="mt-1 text-sm text-red-600">{errors.date}</p>
                )}
              </div>

              <div>
                <label htmlFor="startTime" className="block text-sm font-medium text-gray-700 mb-2">
                  शुरुआती समय *
                </label>
                <input
                  type="time"
                  id="startTime"
                  name="startTime"
                  value={formData.startTime}
                  onChange={handleInputChange}
                  className={`input-field ${errors.startTime ? 'border-red-500' : ''}`}
                />
                {errors.startTime && (
                  <p className="mt-1 text-sm text-red-600">{errors.startTime}</p>
                )}
              </div>

              <div>
                <label htmlFor="endTime" className="block text-sm font-medium text-gray-700 mb-2">
                  समाप्ति समय *
                </label>
                <input
                  type="time"
                  id="endTime"
                  name="endTime"
                  value={formData.endTime}
                  onChange={handleInputChange}
                  className={`input-field ${errors.endTime ? 'border-red-500' : ''}`}
                />
                {errors.endTime && (
                  <p className="mt-1 text-sm text-red-600">{errors.endTime}</p>
                )}
              </div>

              <div>
                <label htmlFor="expectedPatients" className="block text-sm font-medium text-gray-700 mb-2">
                  अपेक्षित मरीज़ *
                </label>
                <div className="relative">
                  <input
                    type="number"
                    id="expectedPatients"
                    name="expectedPatients"
                    value={formData.expectedPatients}
                    onChange={handleInputChange}
                    min="1"
                    className={`input-field pr-10 ${errors.expectedPatients ? 'border-red-500' : ''}`}
                    placeholder="50"
                  />
                  <Users className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                </div>
                {errors.expectedPatients && (
                  <p className="mt-1 text-sm text-red-600">{errors.expectedPatients}</p>
                )}
              </div>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">उपलब्ध सेवाएं *</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {availableServices.map((service) => (
                <label key={service} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.services.includes(service)}
                    onChange={() => handleServiceToggle(service)}
                    className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                  />
                  <span className="text-sm text-gray-700">{service}</span>
                </label>
              ))}
            </div>
            {errors.services && (
              <p className="mt-2 text-sm text-red-600">{errors.services}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              अतिरिक्त विवरण
            </label>
            <textarea
              id="description"
              name="description"
              rows={4}
              value={formData.description}
              onChange={handleInputChange}
              className="input-field resize-none"
              placeholder="शिविर के बारे में अतिरिक्त जानकारी..."
            />
          </div>

          {/* Submit Button */}
          <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={() => navigate('/doctor/dashboard')}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              रद्द करें
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className={`px-6 py-2 bg-green-700 hover:bg-green-800 text-white rounded-lg transition-colors flex items-center space-x-2 ${
                isLoading ? 'opacity-75 cursor-not-allowed' : ''
              }`}
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                  <span>सहेजा जा रहा है...</span>
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  <span>शिविर बनाएं</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewCamp;
