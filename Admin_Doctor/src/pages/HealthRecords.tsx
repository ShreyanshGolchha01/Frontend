import React, { useState } from 'react';
import { 
  Search,
  Calendar,
  Heart,
  Activity,
  User,
  Phone,
  FileText,
  Download,
  Eye,
  Plus,
  AlertCircle,
  CheckCircle,
  Clock,
  Stethoscope,
  Thermometer,
  Weight
} from 'lucide-react';

interface HealthRecord {
  id: string;
  patientName: string;
  patientId: string;
  age: number;
  gender: 'male' | 'female';
  phone: string;
  address: string;
  visitDate: string;
  checkupType: 'routine' | 'followup' | 'emergency' | 'screening';
  vitals: {
    bloodPressure: string;
    heartRate: number;
    temperature: number;
    weight: number;
    height: number;
    bmi: number;
  };
  symptoms: string[];
  diagnosis: string;
  medications: string[];
  nextVisit: string;
  status: 'healthy' | 'stable' | 'needs-attention' | 'critical';
  doctorNotes: string;
  followUpRequired: boolean;
}

const HealthRecords: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [checkupTypeFilter, setCheckupTypeFilter] = useState<string>('all');
  const [selectedRecord, setSelectedRecord] = useState<HealthRecord | null>(null);
  const [showAddRecord, setShowAddRecord] = useState(false);
  const [healthRecords, setHealthRecords] = useState<HealthRecord[]>([]);

  // Form state for new record
  const [formData, setFormData] = useState({
    patientName: '',
    patientId: '',
    age: '',
    gender: 'male' as 'male' | 'female',
    phone: '',
    address: '',
    visitDate: '',
    checkupType: 'routine' as 'routine' | 'followup' | 'emergency' | 'screening',
    bloodPressure: '',
    heartRate: '',
    temperature: '',
    weight: '',
    height: '',
    symptoms: '',
    diagnosis: '',
    medications: '',
    nextVisit: '',
    status: 'stable' as 'healthy' | 'stable' | 'needs-attention' | 'critical',
    doctorNotes: '',
    followUpRequired: false
  });

  // Function to handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checkbox = e.target as HTMLInputElement;
      setFormData(prev => ({
        ...prev,
        [name]: checkbox.checked
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  // Function to fetch patient details by ID
  const fetchPatientDetails = (patientId: string) => {
    // Empty patients database - Connect to your backend
    const patientsDatabase: any[] = [];

    const patient = patientsDatabase.find(p => p.id === patientId || p.id === `P${patientId}`);
    
    if (patient) {
      setFormData(prev => ({
        ...prev,
        patientName: patient.name,
        age: patient.age.toString(),
        gender: patient.gender,
        phone: patient.phone,
        address: patient.address
      }));
      return true;
    }
    return false;
  };

  // Function to handle patient ID change
  const handlePatientIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const patientId = e.target.value;
    setFormData(prev => ({
      ...prev,
      patientId: patientId
    }));

    // Auto-fetch patient details if ID is provided
    if (patientId.trim()) {
      const found = fetchPatientDetails(patientId.trim());
      if (!found && patientId.length >= 3) {
        // Try with P prefix if not found
        fetchPatientDetails(`P${patientId.trim()}`);
      }
    } else {
      // Clear patient details if ID is empty
      setFormData(prev => ({
        ...prev,
        patientName: '',
        age: '',
        gender: 'male',
        phone: '',
        address: ''
      }));
    }
  };

  // Function to calculate BMI
  const calculateBMI = (weight: number, height: number): number => {
    const heightInMeters = height / 100;
    return Number((weight / (heightInMeters * heightInMeters)).toFixed(1));
  };

  // Function to generate unique ID
  const generateId = (): string => {
    const lastId = healthRecords.length > 0 
      ? Math.max(...healthRecords.map(r => parseInt(r.id.replace('HR', '')))) 
      : 0;
    return `HR${String(lastId + 1).padStart(3, '0')}`;
  };

  // Function to add new health record
  const handleAddRecord = () => {
    const weight = Number(formData.weight);
    const height = Number(formData.height);
    const bmi = weight && height ? calculateBMI(weight, height) : 0;

    const newRecord: HealthRecord = {
      id: generateId(),
      patientName: formData.patientName,
      patientId: formData.patientId || `P${String(healthRecords.length + 1).padStart(3, '0')}`,
      age: Number(formData.age),
      gender: formData.gender,
      phone: formData.phone,
      address: formData.address,
      visitDate: formData.visitDate,
      checkupType: formData.checkupType,
      vitals: {
        bloodPressure: formData.bloodPressure,
        heartRate: Number(formData.heartRate),
        temperature: Number(formData.temperature),
        weight: weight,
        height: height,
        bmi: bmi
      },
      symptoms: formData.symptoms ? formData.symptoms.split(',').map(s => s.trim()) : [],
      diagnosis: formData.diagnosis,
      medications: formData.medications ? formData.medications.split(',').map(m => m.trim()) : [],
      nextVisit: formData.nextVisit,
      status: formData.status,
      doctorNotes: formData.doctorNotes,
      followUpRequired: formData.followUpRequired
    };

    setHealthRecords(prev => [...prev, newRecord]);
    setShowAddRecord(false);
    
    // Reset form
    setFormData({
      patientName: '',
      patientId: '',
      age: '',
      gender: 'male',
      phone: '',
      address: '',
      visitDate: '',
      checkupType: 'routine',
      bloodPressure: '',
      heartRate: '',
      temperature: '',
      weight: '',
      height: '',
      symptoms: '',
      diagnosis: '',
      medications: '',
      nextVisit: '',
      status: 'stable',
      doctorNotes: '',
      followUpRequired: false
    });
  };

  const filteredRecords = healthRecords.filter(record => {
    const matchesSearch = record.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.patientId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.phone.includes(searchTerm);
    
    const matchesStatus = statusFilter === 'all' || record.status === statusFilter;
    const matchesCheckupType = checkupTypeFilter === 'all' || record.checkupType === checkupTypeFilter;
    
    return matchesSearch && matchesStatus && matchesCheckupType;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'stable':
        return <Clock className="h-4 w-4 text-blue-500" />;
      case 'needs-attention':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case 'critical':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Activity className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'healthy': return 'स्वस्थ';
      case 'stable': return 'स्थिर';
      case 'needs-attention': return 'ध्यान चाहिए';
      case 'critical': return 'गंभीर';
      default: return 'अज्ञात';
    }
  };

  const getCheckupTypeText = (type: string) => {
    switch (type) {
      case 'routine': return 'नियमित';
      case 'followup': return 'फॉलो-अप';
      case 'emergency': return 'आपातकाल';
      case 'screening': return 'स्क्रीनिंग';
      default: return 'अन्य';
    }
  };

  const statistics = {
    totalRecords: healthRecords.length,
    healthyPatients: healthRecords.filter(r => r.status === 'healthy').length,
    needsAttention: healthRecords.filter(r => r.status === 'needs-attention').length,
    criticalCases: healthRecords.filter(r => r.status === 'critical').length,
    followUpsRequired: healthRecords.filter(r => r.followUpRequired).length
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-700 to-green-900 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">स्वास्थ्य रिकॉर्ड प्रबंधन</h1>
            <p className="text-green-100">
              मरीज़ों की संपूर्ण स्वास्थ्य जानकारी और चिकित्सा इतिहास
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowAddRecord(true)}
              className="bg-white text-green-700 px-4 py-2 rounded-lg hover:bg-green-50 transition-colors duration-200 flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>नया रिकॉर्ड</span>
            </button>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="card border border-gray-400 bg-blue-50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600 mb-1">कुल रिकॉर्ड</p>
              <p className="text-2xl font-bold text-blue-900">{statistics.totalRecords}</p>
            </div>
            <FileText className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        
        <div className="card border border-gray-400 bg-green-50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-600 mb-1">स्वस्थ मरीज़</p>
              <p className="text-2xl font-bold text-green-900">{statistics.healthyPatients}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
        </div>
        
        <div className="card border border-gray-400 bg-yellow-50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-yellow-600 mb-1">ध्यान चाहिए</p>
              <p className="text-2xl font-bold text-yellow-900">{statistics.needsAttention}</p>
            </div>
            <AlertCircle className="h-8 w-8 text-yellow-600" />
          </div>
        </div>
        
        <div className="card border border-gray-400 bg-red-50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-red-600 mb-1">गंभीर केस</p>
              <p className="text-2xl font-bold text-red-900">{statistics.criticalCases}</p>
            </div>
            <Heart className="h-8 w-8 text-red-600" />
          </div>
        </div>
        
        <div className="card border border-gray-400 bg-purple-50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-600 mb-1">फॉलो-अप</p>
              <p className="text-2xl font-bold text-purple-900">{statistics.followUpsRequired}</p>
            </div>
            <Calendar className="h-8 w-8 text-purple-600" />
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="card border border-gray-400">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="मरीज़ का नाम, ID या फोन नंबर खोजें..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="all">सभी स्थिति</option>
              <option value="healthy">स्वस्थ</option>
              <option value="stable">स्थिर</option>
              <option value="needs-attention">ध्यान चाहिए</option>
              <option value="critical">गंभीर</option>
            </select>
          </div>
          
          <div>
            <select
              value={checkupTypeFilter}
              onChange={(e) => setCheckupTypeFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="all">सभी चेकअप टाइप</option>
              <option value="routine">नियमित</option>
              <option value="followup">फॉलो-अप</option>
              <option value="emergency">आपातकाल</option>
              <option value="screening">स्क्रीनिंग</option>
            </select>
          </div>
          
          <div className="flex space-x-2">
            <button className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors duration-200 flex items-center justify-center space-x-2">
              <Download className="h-4 w-4" />
              <span>एक्सपोर्ट</span>
            </button>
          </div>
        </div>
      </div>

      {/* Health Records Table */}
      <div className="card border border-gray-400">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  मरीज़ की जानकारी
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  विजिट विवरण
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  महत्वपूर्ण संकेतक
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  निदान
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  स्थिति
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  कार्य
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredRecords.map((record) => (
                <tr key={record.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                          record.gender === 'male' ? 'bg-blue-100 text-blue-600' : 'bg-pink-100 text-pink-600'
                        }`}>
                          <User className="h-5 w-5" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{record.patientName}</div>
                        <div className="text-sm text-gray-500">ID: {record.patientId} • आयु: {record.age}</div>
                        <div className="text-xs text-gray-400 flex items-center mt-1">
                          <Phone className="h-3 w-3 mr-1" />
                          {record.phone}
                        </div>
                      </div>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900 flex items-center">
                        <Calendar className="h-4 w-4 mr-1 text-gray-400" />
                        {new Date(record.visitDate).toLocaleDateString('hi-IN')}
                      </div>
                      <div className="text-sm text-gray-500">
                        {getCheckupTypeText(record.checkupType)}
                      </div>
                      {record.followUpRequired && (
                        <div className="text-xs text-green-600 mt-1 flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          अगली विजिट: {new Date(record.nextVisit).toLocaleDateString('hi-IN')}
                        </div>
                      )}
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="space-y-1 text-xs">
                      <div className="flex items-center">
                        <Stethoscope className="h-3 w-3 mr-1 text-gray-400" />
                        BP: {record.vitals.bloodPressure}
                      </div>
                      <div className="flex items-center">
                        <Heart className="h-3 w-3 mr-1 text-red-400" />
                        HR: {record.vitals.heartRate} bpm
                      </div>
                      <div className="flex items-center">
                        <Thermometer className="h-3 w-3 mr-1 text-yellow-400" />
                        Temp: {record.vitals.temperature}°F
                      </div>
                      <div className="flex items-center">
                        <Weight className="h-3 w-3 mr-1 text-purple-400" />
                        BMI: {record.vitals.bmi}
                      </div>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{record.diagnosis}</div>
                    {record.symptoms.length > 0 && (
                      <div className="text-xs text-gray-500 mt-1">
                        लक्षण: {record.symptoms.join(', ')}
                      </div>
                    )}
                    {record.medications.length > 0 && (
                      <div className="text-xs text-blue-600 mt-1">
                        दवाई: {record.medications.slice(0, 2).join(', ')}
                        {record.medications.length > 2 && '...'}
                      </div>
                    )}
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {getStatusIcon(record.status)}
                      <span className={`ml-2 text-sm font-medium ${
                        record.status === 'healthy' ? 'text-green-600' :
                        record.status === 'stable' ? 'text-blue-600' :
                        record.status === 'needs-attention' ? 'text-yellow-600' :
                        'text-red-600'
                      }`}>
                        {getStatusText(record.status)}
                      </span>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setSelectedRecord(record)}
                        className="text-green-600 hover:text-green-900 p-1 rounded"
                        title="विवरण देखें"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        className="text-blue-600 hover:text-blue-900 p-1 rounded"
                        title="डाउनलोड करें"
                      >
                        <Download className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredRecords.length === 0 && (
          <div className="text-center py-12">
            <FileText className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">कोई रिकॉर्ड नहीं मिला</h3>
            <p className="mt-1 text-sm text-gray-500">आपके खोज मापदंड से मेल खाने वाला कोई स्वास्थ्य रिकॉर्ड नहीं मिला।</p>
          </div>
        )}
      </div>

      {/* Record Detail Modal */}
      {selectedRecord && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">स्वास्थ्य रिकॉर्ड विवरण</h3>
                <button
                  onClick={() => setSelectedRecord(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
              
              <div className="space-y-6">
                {/* Patient Info */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-3">मरीज़ की जानकारी</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">नाम:</span>
                      <span className="ml-2 font-medium">{selectedRecord.patientName}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">आयु:</span>
                      <span className="ml-2 font-medium">{selectedRecord.age} वर्ष</span>
                    </div>
                    <div>
                      <span className="text-gray-500">लिंग:</span>
                      <span className="ml-2 font-medium">{selectedRecord.gender === 'male' ? 'पुरुष' : 'महिला'}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">फोन:</span>
                      <span className="ml-2 font-medium">{selectedRecord.phone}</span>
                    </div>
                    <div className="col-span-2">
                      <span className="text-gray-500">पता:</span>
                      <span className="ml-2 font-medium">{selectedRecord.address}</span>
                    </div>
                  </div>
                </div>

                {/* Vitals */}
                <div className="bg-blue-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-3">महत्वपूर्ण संकेतक</h4>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div className="text-center">
                      <div className="font-bold text-lg text-blue-600">{selectedRecord.vitals.bloodPressure}</div>
                      <div className="text-gray-500">रक्तचाप</div>
                    </div>
                    <div className="text-center">
                      <div className="font-bold text-lg text-red-600">{selectedRecord.vitals.heartRate}</div>
                      <div className="text-gray-500">हृदय गति (bpm)</div>
                    </div>
                    <div className="text-center">
                      <div className="font-bold text-lg text-yellow-600">{selectedRecord.vitals.temperature}°F</div>
                      <div className="text-gray-500">तापमान</div>
                    </div>
                    <div className="text-center">
                      <div className="font-bold text-lg text-purple-600">{selectedRecord.vitals.weight} kg</div>
                      <div className="text-gray-500">वजन</div>
                    </div>
                    <div className="text-center">
                      <div className="font-bold text-lg text-green-600">{selectedRecord.vitals.height} cm</div>
                      <div className="text-gray-500">कद</div>
                    </div>
                    <div className="text-center">
                      <div className="font-bold text-lg text-indigo-600">{selectedRecord.vitals.bmi}</div>
                      <div className="text-gray-500">BMI</div>
                    </div>
                  </div>
                </div>

                {/* Diagnosis & Treatment */}
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">लक्षण</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedRecord.symptoms.map((symptom, index) => (
                        <span key={index} className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">
                          {symptom}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">निदान</h4>
                    <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">{selectedRecord.diagnosis}</p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">निर्धारित दवाइयां</h4>
                    <ul className="list-disc list-inside space-y-1 text-gray-700">
                      {selectedRecord.medications.map((medication, index) => (
                        <li key={index}>{medication}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">डॉक्टर के नोट्स</h4>
                    <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">{selectedRecord.doctorNotes}</p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end space-x-3 pt-4 border-t">
                  <button
                    onClick={() => setSelectedRecord(null)}
                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors duration-200"
                  >
                    बंद करें
                  </button>
                  <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200">
                    प्रिंट करें
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Record Modal */}
      {showAddRecord && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-10 mx-auto p-5 border w-11/12 md:w-4/5 lg:w-3/4 xl:w-2/3 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-medium text-gray-900">नया स्वास्थ्य रिकॉर्ड जोड़ें</h3>
                <button
                  onClick={() => setShowAddRecord(false)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ✕
                </button>
              </div>
              
              <form onSubmit={(e) => { e.preventDefault(); handleAddRecord(); }} className="space-y-6">
                {/* Patient Basic Information */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-medium text-gray-900">मरीज़ की बुनियादी जानकारी</h4>
                    {formData.patientId && formData.patientName && (
                      <button
                        type="button"
                        onClick={() => {
                          setFormData(prev => ({
                            ...prev,
                            patientId: '',
                            patientName: '',
                            age: '',
                            gender: 'male',
                            phone: '',
                            address: ''
                          }));
                        }}
                        className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded hover:bg-red-200 transition-colors"
                      >
                        मैन्युअल एंट्री करें
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        मरीज़ ID
                      </label>
                      <input
                        type="text"
                        name="patientId"
                        value={formData.patientId}
                        onChange={handlePatientIdChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="P001, P002... या 001, 002..."
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        मरीज़ ID डालने पर उनकी जानकारी automatic भर जाएगी
                      </p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        मरीज़ का नाम *
                      </label>
                      <input
                        type="text"
                        name="patientName"
                        value={formData.patientName}
                        onChange={handleInputChange}
                        required
                        className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                          formData.patientId && formData.patientName ? 'bg-green-50' : ''
                        }`}
                        placeholder="पूरा नाम दर्ज करें"
                        readOnly={!!(formData.patientId && formData.patientName)}
                      />
                      {formData.patientId && formData.patientName && (
                        <p className="text-xs text-green-600 mt-1">
                          ✓ मरीज़ की जानकारी स्वचालित रूप से भरी गई
                        </p>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        आयु *
                      </label>
                      <input
                        type="number"
                        name="age"
                        value={formData.age}
                        onChange={handleInputChange}
                        required
                        min="1"
                        max="120"
                        className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                          formData.patientId && formData.age ? 'bg-green-50' : ''
                        }`}
                        placeholder="वर्षों में"
                        readOnly={!!(formData.patientId && formData.age)}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        लिंग *
                      </label>
                      <select
                        name="gender"
                        value={formData.gender}
                        onChange={handleInputChange}
                        required
                        className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                          formData.patientId && formData.patientName ? 'bg-green-50' : ''
                        }`}
                        disabled={!!(formData.patientId && formData.patientName)}
                      >
                        <option value="male">पुरुष</option>
                        <option value="female">महिला</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        फोन नंबर *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                        pattern="[0-9]{10}"
                        className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                          formData.patientId && formData.phone ? 'bg-green-50' : ''
                        }`}
                        placeholder="10 अंकों का नंबर"
                        readOnly={!!(formData.patientId && formData.phone)}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        पता *
                      </label>
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        required
                        className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                          formData.patientId && formData.address ? 'bg-green-50' : ''
                        }`}
                        placeholder="पूरा पता"
                        readOnly={!!(formData.patientId && formData.address)}
                      />
                    </div>
                  </div>
                </div>

                {/* Visit Information */}
                <div className="bg-blue-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-4">विजिट की जानकारी</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        विजिट की तारीख *
                      </label>
                      <input
                        type="date"
                        name="visitDate"
                        value={formData.visitDate}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        चेकअप का प्रकार *
                      </label>
                      <select
                        name="checkupType"
                        value={formData.checkupType}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      >
                        <option value="routine">नियमित चेकअप</option>
                        <option value="followup">फॉलो-अप</option>
                        <option value="emergency">आपातकाल</option>
                        <option value="screening">स्क्रीनिंग</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        अगली विजिट
                      </label>
                      <input
                        type="date"
                        name="nextVisit"
                        value={formData.nextVisit}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>

                {/* Vital Signs */}
                <div className="bg-yellow-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-4">महत्वपूर्ण संकेतक</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        रक्तचाप
                      </label>
                      <input
                        type="text"
                        name="bloodPressure"
                        value={formData.bloodPressure}
                        onChange={handleInputChange}
                        placeholder="120/80"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        हृदय गति (bpm)
                      </label>
                      <input
                        type="number"
                        name="heartRate"
                        value={formData.heartRate}
                        onChange={handleInputChange}
                        min="40"
                        max="200"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        तापमान (°F)
                      </label>
                      <input
                        type="number"
                        name="temperature"
                        value={formData.temperature}
                        onChange={handleInputChange}
                        step="0.1"
                        min="90"
                        max="110"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        वजन (kg)
                      </label>
                      <input
                        type="number"
                        name="weight"
                        value={formData.weight}
                        onChange={handleInputChange}
                        step="0.1"
                        min="1"
                        max="300"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        कद (cm)
                      </label>
                      <input
                        type="number"
                        name="height"
                        value={formData.height}
                        onChange={handleInputChange}
                        min="50"
                        max="250"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  
                  {formData.weight && formData.height && (
                    <div className="mt-3 p-3 bg-white rounded-lg border">
                      <span className="text-sm text-gray-600">
                        BMI: <span className="font-bold text-lg text-green-600">
                          {calculateBMI(Number(formData.weight), Number(formData.height))}
                        </span>
                      </span>
                    </div>
                  )}
                </div>

                {/* Medical Information */}
                <div className="bg-green-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-4">चिकित्सा जानकारी</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        लक्षण
                      </label>
                      <input
                        type="text"
                        name="symptoms"
                        value={formData.symptoms}
                        onChange={handleInputChange}
                        placeholder="कॉमा से अलग करें (जैसे: खांसी, बुखार)"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        निदान *
                      </label>
                      <input
                        type="text"
                        name="diagnosis"
                        value={formData.diagnosis}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="बीमारी का निदान"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        दवाइयां
                      </label>
                      <input
                        type="text"
                        name="medications"
                        value={formData.medications}
                        onChange={handleInputChange}
                        placeholder="कॉमा से अलग करें (जैसे: पैरासिटामोल, एस्प्रिन)"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        स्थिति *
                      </label>
                      <select
                        name="status"
                        value={formData.status}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      >
                        <option value="healthy">स्वस्थ</option>
                        <option value="stable">स्थिर</option>
                        <option value="needs-attention">ध्यान चाहिए</option>
                        <option value="critical">गंभीर</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      डॉक्टर के नोट्स
                    </label>
                    <textarea
                      name="doctorNotes"
                      value={formData.doctorNotes}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="अतिरिक्त टिप्पणियां और सुझाव..."
                    />
                  </div>
                  
                  <div className="mt-4 flex items-center">
                    <input
                      type="checkbox"
                      name="followUpRequired"
                      checked={formData.followUpRequired}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                    />
                    <label className="ml-2 block text-sm text-gray-700">
                      फॉलो-अप की आवश्यकता है
                    </label>
                  </div>
                </div>

                {/* Form Actions */}
                <div className="flex justify-end space-x-3 pt-4 border-t">
                  <button
                    type="button"
                    onClick={() => setShowAddRecord(false)}
                    className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors duration-200"
                  >
                    रद्द करें
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 flex items-center space-x-2"
                  >
                    <Plus className="h-4 w-4" />
                    <span>रिकॉर्ड जोड़ें</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HealthRecords;
