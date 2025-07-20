import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  Search, 
  Plus, 
  Heart,
  Calendar,
  Phone,
  MapPin,
  UserPlus,
  ArrowLeft,
  Edit,
  Eye
} from 'lucide-react';

interface Patient {
  id: string;
  name: string;
  age: number;
  gender: 'male' | 'female';
  phone: string;
  address: string;
  lastVisit: string;
  healthStatus: 'good' | 'fair' | 'poor';
  familyMembers: number;
}

const PatientsManagement: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddPatient, setShowAddPatient] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [newPatient, setNewPatient] = useState({
    name: '',
    age: '',
    gender: 'male' as 'male' | 'female',
    phone: '',
    address: '',
    familyMembers: ''
  });

  // Empty patients data - Connect to your backend
  const [patients, setPatients] = useState<Patient[]>([]);

  const filteredPatients = patients.filter(patient => {
    const matchesSearch = patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         patient.phone.includes(searchTerm) ||
                         patient.address.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = selectedFilter === 'all' || 
                         (selectedFilter === 'good' && patient.healthStatus === 'good') ||
                         (selectedFilter === 'fair' && patient.healthStatus === 'fair') ||
                         (selectedFilter === 'poor' && patient.healthStatus === 'poor') ||
                         (selectedFilter === 'male' && patient.gender === 'male') ||
                         (selectedFilter === 'female' && patient.gender === 'female') ||
                         (selectedFilter === 'recent' && (() => {
                           const lastVisit = new Date(patient.lastVisit);
                           const today = new Date();
                           const diffTime = Math.abs(today.getTime() - lastVisit.getTime());
                           const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                           return diffDays <= 7;
                         })());
    
    return matchesSearch && matchesFilter;
  });

  const getHealthStatusColor = (status: string) => {
    switch (status) {
      case 'good':
        return 'bg-green-100 text-green-800';
      case 'fair':
        return 'bg-yellow-100 text-yellow-800';
      case 'poor':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getHealthStatusText = (status: string) => {
    switch (status) {
      case 'good':
        return 'अच्छी';
      case 'fair':
        return 'सामान्य';
      case 'poor':
        return 'खराब';
      default:
        return 'अज्ञात';
    }
  };

  const handleAddPatient = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!newPatient.name || !newPatient.age || !newPatient.phone || !newPatient.address) {
      alert('कृपया सभी आवश्यक फ़ील्ड भरें');
      return;
    }

    // Create new patient object
    const patient: Patient = {
      id: (patients.length + 1).toString(),
      name: newPatient.name,
      age: parseInt(newPatient.age),
      gender: newPatient.gender,
      phone: newPatient.phone,
      address: newPatient.address,
      lastVisit: new Date().toISOString().split('T')[0],
      healthStatus: 'fair',
      familyMembers: parseInt(newPatient.familyMembers) || 0
    };

    // Add patient to list
    setPatients([...patients, patient]);
    
    // Reset form
    setNewPatient({
      name: '',
      age: '',
      gender: 'male',
      phone: '',
      address: '',
      familyMembers: ''
    });
    
    // Close modal
    setShowAddPatient(false);
    
    alert('मरीज़ सफलतापूर्वक जोड़ा गया!');
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
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Users className="h-8 w-8" />
            <div>
              <h1 className="text-2xl font-bold">मरीज़ प्रबंधन</h1>
              <p className="text-green-100 mt-1">
                सभी मरीजों की जानकारी और स्वास्थ्य रिकॉर्ड देखें
              </p>
            </div>
          </div>
          {/* <div className="text-right">
            <p className="text-2xl font-bold">{patients.length}</p>
            <p className="text-green-100 text-sm">कुल मरीज़</p>
          </div> */}
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card border border-gray-400 text-center">
          <div className="p-6">
            <Users className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-green-600">{patients.length}</div>
            <div className="text-sm text-gray-600">कुल मरीज़</div>
          </div>
        </div>
        
        <div className="card border border-gray-400 text-center">
          <div className="p-6">
            <Heart className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-green-600">
              {patients.filter(p => p.healthStatus === 'good').length}
            </div>
            <div className="text-sm text-gray-600">स्वस्थ मरीज़</div>
          </div>
        </div>
        
        <div className="card border border-gray-400 text-center">
          <div className="p-6">
            <Calendar className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-green-600">
              {patients.filter(p => {
                const lastVisit = new Date(p.lastVisit);
                const today = new Date();
                const diffTime = Math.abs(today.getTime() - lastVisit.getTime());
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                return diffDays <= 7;
              }).length}
            </div>
            <div className="text-sm text-gray-600">इस सप्ताह मिले</div>
          </div>
        </div>
        
        <div className="card border border-gray-400 text-center">
          <div className="p-6">
            <UserPlus className="h-8 w-8 text-purple-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-purple-600">
              {patients.reduce((sum, p) => sum + p.familyMembers, 0)}
            </div>
            <div className="text-sm text-gray-600">कुल पारिवारिक सदस्य</div>
          </div>
        </div>
      </div>

      {/* Search and Add Patient */}
      <div className="card border border-gray-400">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          {/* Search */}
          <div className="relative flex-1 md:max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="मरीज़ खोजें..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          {/* Filter Dropdown */}
          <div className="flex items-center space-x-4">
            <select
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white"
            >
              <option value="all">सभी मरीज़ ({patients.length})</option>
              <option value="good">स्वस्थ मरीज़ ({patients.filter(p => p.healthStatus === 'good').length})</option>
              <option value="fair">सामान्य स्वास्थ्य ({patients.filter(p => p.healthStatus === 'fair').length})</option>
              <option value="poor">खराब स्वास्थ्य ({patients.filter(p => p.healthStatus === 'poor').length})</option>
              <option value="male">पुरुष मरीज़ ({patients.filter(p => p.gender === 'male').length})</option>
              <option value="female">महिला मरीज़ ({patients.filter(p => p.gender === 'female').length})</option>
              <option value="recent">हाल के मरीज़ ({patients.filter(p => {
                const lastVisit = new Date(p.lastVisit);
                const today = new Date();
                const diffTime = Math.abs(today.getTime() - lastVisit.getTime());
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                return diffDays <= 7;
              }).length})</option>
            </select>

            {/* Clear Filters */}
            {(searchTerm || selectedFilter !== 'all') && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedFilter('all');
                }}
                className="px-3 py-2 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                साफ़ करें
              </button>
            )}

            {/* Add Patient Button */}
            <button
              onClick={() => setShowAddPatient(true)}
              className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <Plus className="h-4 w-4" />
              <span>नया मरीज़ जोड़ें</span>
            </button>
          </div>
        </div>
      </div>

      {/* Patients List */}
      <div className="card border border-gray-400">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">
            मरीजों की सूची ({filteredPatients.length} परिणाम)
          </h3>
        </div>

        <div className="space-y-4">
          {filteredPatients.map((patient) => (
            <div
              key={patient.id}
              className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-4 mb-3">
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900">{patient.name}</h4>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <span>{patient.age} वर्ष • {patient.gender === 'male' ? 'पुरुष' : 'महिला'}</span>
                        <div className="flex items-center space-x-1">
                          <Phone className="h-3 w-3" />
                          <span>{patient.phone}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <MapPin className="h-3 w-3" />
                          <span>{patient.address}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-6 text-sm">
                    <div className="flex items-center space-x-2">
                      <span className="text-gray-600">अंतिम जांच:</span>
                      <span className="font-medium">
                        {new Date(patient.lastVisit).toLocaleDateString('hi-IN')}
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <span className="text-gray-600">स्वास्थ्य स्थिति:</span>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getHealthStatusColor(patient.healthStatus)}`}>
                        {getHealthStatusText(patient.healthStatus)}
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <UserPlus className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-600">{patient.familyMembers} पारिवारिक सदस्य</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => navigate(`/doctor/health-records?patient=${patient.id}`)}
                    className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                    title="स्वास्थ्य रिकॉर्ड देखें"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => navigate(`/doctor/family-health?patient=${patient.id}`)}
                    className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                    title="पारिवारिक स्वास्थ्य"
                  >
                    <UserPlus className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => alert('संपादन सुविधा जल्द आ रही है')}
                    className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                    title="संपादित करें"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}

          {filteredPatients.length === 0 && (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">कोई मरीज़ नहीं मिला</h3>
              <p className="text-gray-600">
                आपके खोज मापदंड के अनुसार कोई मरीज़ नहीं मिला।
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Add Patient Modal */}
      {showAddPatient && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">नया मरीज़ जोड़ें</h3>
              <button
                onClick={() => setShowAddPatient(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddPatient} className="space-y-4">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  मरीज़ का नाम *
                </label>
                <input
                  type="text"
                  value={newPatient.name}
                  onChange={(e) => setNewPatient({...newPatient, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="पूरा नाम दर्ज करें"
                  required
                />
              </div>

              {/* Age */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  उम्र *
                </label>
                <input
                  type="number"
                  value={newPatient.age}
                  onChange={(e) => setNewPatient({...newPatient, age: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="उम्र दर्ज करें"
                  min="1"
                  max="120"
                  required
                />
              </div>

              {/* Gender */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  लिंग *
                </label>
                <select
                  value={newPatient.gender}
                  onChange={(e) => setNewPatient({...newPatient, gender: e.target.value as 'male' | 'female'})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                >
                  <option value="male">पुरुष</option>
                  <option value="female">महिला</option>
                </select>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  फोन नंबर *
                </label>
                <input
                  type="tel"
                  value={newPatient.phone}
                  onChange={(e) => setNewPatient({...newPatient, phone: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="10 अंकों का मोबाइल नंबर"
                  pattern="[0-9]{10}"
                  maxLength={10}
                  required
                />
              </div>

              {/* Address */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  पता *
                </label>
                <textarea
                  value={newPatient.address}
                  onChange={(e) => setNewPatient({...newPatient, address: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="पूरा पता दर्ज करें"
                  rows={2}
                  required
                />
              </div>

              {/* Family Members */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  पारिवारिक सदस्यों की संख्या
                </label>
                <input
                  type="number"
                  value={newPatient.familyMembers}
                  onChange={(e) => setNewPatient({...newPatient, familyMembers: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="कुल पारिवारिक सदस्य"
                  min="0"
                  max="20"
                />
              </div>

              {/* Buttons */}
              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddPatient(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  रद्द करें
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  मरीज़ जोड़ें
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientsManagement;
