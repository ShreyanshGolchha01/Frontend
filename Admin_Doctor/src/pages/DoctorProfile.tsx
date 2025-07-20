import React, { useState } from 'react';
import { 
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Award,
  BookOpen,
  Clock,
  Edit3,
  Save,
  X,
  Camera,
  Stethoscope,
  GraduationCap,
  Building,
  FileText,
  Star,
  Activity,
  Users,
  Heart
} from 'lucide-react';

interface DoctorProfileData {
  personalInfo: {
    name: string;
    email: string;
    phone: string;
    address: string;
    dateOfBirth: string;
    gender: 'male' | 'female' | '';
    bloodGroup: string;
    emergencyContact: string;
  };
  professionalInfo: {
    registrationNo: string;
    specialization: string;
    qualification: string;
    experience: string;
    currentHospital: string;
    department: string;
    joiningDate: string;
    languages: string[];
  };
  statistics: {
    totalPatients: number;
    familiesServed: number;
    campsOrganized: number;
    yearsOfService: number;
  };
}

const DoctorProfile: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('personal');

  const [doctorData, setDoctorData] = useState<DoctorProfileData>({
    personalInfo: {
      name: '',
      email: '',
      phone: '',
      address: '',
      dateOfBirth: '',
      gender: '',
      bloodGroup: '',
      emergencyContact: ''
    },
    professionalInfo: {
      registrationNo: '',
      specialization: '',
      qualification: '',
      experience: '',
      currentHospital: '',
      department: '',
      joiningDate: '',
      languages: []
    },
    statistics: {
      totalPatients: 0,
      familiesServed: 0,
      campsOrganized: 0,
      yearsOfService: 0
    }
  });

  const [tempData, setTempData] = useState<DoctorProfileData>(doctorData);

  // Handle save changes
  const handleSave = () => {
    setDoctorData(tempData);
    setIsEditing(false);
    // Here you would typically save to backend
    alert('प्रोफाइल सफलतापूर्वक अपडेट हो गई!');
  };

  // Handle cancel editing
  const handleCancel = () => {
    setTempData(doctorData);
    setIsEditing(false);
  };

  // Update temp data
  const updatePersonalInfo = (field: keyof DoctorProfileData['personalInfo'], value: string) => {
    setTempData(prev => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo,
        [field]: value
      }
    }));
  };

  const updateProfessionalInfo = (field: keyof DoctorProfileData['professionalInfo'], value: string | string[]) => {
    setTempData(prev => ({
      ...prev,
      professionalInfo: {
        ...prev.professionalInfo,
        [field]: value
      }
    }));
  };

  // Empty achievements array - Connect to your backend
  const achievements: any[] = [];

  // Empty activities array - Connect to your backend  
  const recentActivities: any[] = [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-700 to-green-900 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <div className="relative">
              <div className="w-24 h-24 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <User className="h-12 w-12 text-white" />
              </div>
              <button className="absolute bottom-0 right-0 bg-white text-green-700 p-2 rounded-full hover:bg-green-50 transition-colors">
                <Camera className="h-4 w-4" />
              </button>
            </div>
            <div>
              <h1 className="text-3xl font-bold mb-2">{doctorData.personalInfo.name}</h1>
              <p className="text-green-100 text-lg">{doctorData.professionalInfo.specialization}</p>
              <p className="text-green-200 text-sm">रजिस्ट्रेशन नं: {doctorData.professionalInfo.registrationNo}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="bg-white text-green-700 px-4 py-2 rounded-lg hover:bg-green-50 transition-colors duration-200 flex items-center space-x-2"
              >
                <Edit3 className="h-4 w-4" />
                <span>प्रोफाइल संपादित करें</span>
              </button>
            ) : (
              <div className="flex space-x-2">
                <button
                  onClick={handleSave}
                  className="bg-white text-green-700 px-4 py-2 rounded-lg hover:bg-green-50 transition-colors duration-200 flex items-center space-x-2"
                >
                  <Save className="h-4 w-4" />
                  <span>सेव करें</span>
                </button>
                <button
                  onClick={handleCancel}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors duration-200 flex items-center space-x-2"
                >
                  <X className="h-4 w-4" />
                  <span>रद्द करें</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card border border-gray-400 bg-blue-50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600 mb-1">कुल मरीज़</p>
              <p className="text-2xl font-bold text-blue-900">{doctorData.statistics.totalPatients.toLocaleString()}</p>
            </div>
            <Users className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        
        <div className="card border border-gray-400 bg-purple-50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-600 mb-1">परिवार सेवित</p>
              <p className="text-2xl font-bold text-purple-900">{doctorData.statistics.familiesServed.toLocaleString()}</p>
            </div>
            <Heart className="h-8 w-8 text-purple-600" />
          </div>
        </div>
        
        <div className="card border border-gray-400 bg-green-50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-600 mb-1">शिविर आयोजित</p>
              <p className="text-2xl font-bold text-green-900">{doctorData.statistics.campsOrganized}</p>
            </div>
            <Activity className="h-8 w-8 text-green-600" />
          </div>
        </div>
        
        <div className="card border border-gray-400 bg-orange-50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-orange-600 mb-1">सेवा वर्ष</p>
              <p className="text-2xl font-bold text-orange-900">{doctorData.statistics.yearsOfService}</p>
            </div>
            <Clock className="h-8 w-8 text-orange-600" />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="card border border-gray-400">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('personal')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'personal'
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              व्यक्तिगत जानकारी
            </button>
            <button
              onClick={() => setActiveTab('professional')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'professional'
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              व्यावसायिक जानकारी
            </button>
            <button
              onClick={() => setActiveTab('achievements')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'achievements'
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              उपलब्धियां
            </button>
            <button
              onClick={() => setActiveTab('activity')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'activity'
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              हाल की गतिविधि
            </button>
          </nav>
        </div>

        <div className="p-6">
          {/* Personal Information Tab */}
          {activeTab === 'personal' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">व्यक्तिगत जानकारी</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <User className="h-4 w-4 inline mr-2" />
                    पूरा नाम
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={tempData.personalInfo.name}
                      onChange={(e) => updatePersonalInfo('name', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">{doctorData.personalInfo.name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Mail className="h-4 w-4 inline mr-2" />
                    ईमेल
                  </label>
                  {isEditing ? (
                    <input
                      type="email"
                      value={tempData.personalInfo.email}
                      onChange={(e) => updatePersonalInfo('email', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">{doctorData.personalInfo.email}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Phone className="h-4 w-4 inline mr-2" />
                    फोन नंबर
                  </label>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={tempData.personalInfo.phone}
                      onChange={(e) => updatePersonalInfo('phone', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">{doctorData.personalInfo.phone}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Calendar className="h-4 w-4 inline mr-2" />
                    जन्म तिथि
                  </label>
                  {isEditing ? (
                    <input
                      type="date"
                      value={tempData.personalInfo.dateOfBirth}
                      onChange={(e) => updatePersonalInfo('dateOfBirth', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">
                      {new Date(doctorData.personalInfo.dateOfBirth).toLocaleDateString('hi-IN')}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">लिंग</label>
                  {isEditing ? (
                    <select
                      value={tempData.personalInfo.gender}
                      onChange={(e) => updatePersonalInfo('gender', e.target.value as 'male' | 'female' | '')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      <option value="">चुनें</option>
                      <option value="male">पुरुष</option>
                      <option value="female">महिला</option>
                    </select>
                  ) : (
                    <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">
                      {doctorData.personalInfo.gender === 'male' ? 'पुरुष' : 
                       doctorData.personalInfo.gender === 'female' ? 'महिला' : ''}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">रक्त समूह</label>
                  {isEditing ? (
                    <select
                      value={tempData.personalInfo.bloodGroup}
                      onChange={(e) => updatePersonalInfo('bloodGroup', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      <option value="">चुनें</option>
                      <option value="A+">A+</option>
                      <option value="A-">A-</option>
                      <option value="B+">B+</option>
                      <option value="B-">B-</option>
                      <option value="AB+">AB+</option>
                      <option value="AB-">AB-</option>
                      <option value="O+">O+</option>
                      <option value="O-">O-</option>
                    </select>
                  ) : (
                    <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">{doctorData.personalInfo.bloodGroup}</p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <MapPin className="h-4 w-4 inline mr-2" />
                    पता
                  </label>
                  {isEditing ? (
                    <textarea
                      value={tempData.personalInfo.address}
                      onChange={(e) => updatePersonalInfo('address', e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">{doctorData.personalInfo.address}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Phone className="h-4 w-4 inline mr-2" />
                    आपातकालीन संपर्क
                  </label>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={tempData.personalInfo.emergencyContact}
                      onChange={(e) => updatePersonalInfo('emergencyContact', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">{doctorData.personalInfo.emergencyContact}</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Professional Information Tab */}
          {activeTab === 'professional' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">व्यावसायिक जानकारी</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FileText className="h-4 w-4 inline mr-2" />
                    रजिस्ट्रेशन नंबर
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={tempData.professionalInfo.registrationNo}
                      onChange={(e) => updateProfessionalInfo('registrationNo', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">{doctorData.professionalInfo.registrationNo}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Stethoscope className="h-4 w-4 inline mr-2" />
                    विशेषज्ञता
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={tempData.professionalInfo.specialization}
                      onChange={(e) => updateProfessionalInfo('specialization', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">{doctorData.professionalInfo.specialization}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <GraduationCap className="h-4 w-4 inline mr-2" />
                    योग्यता
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={tempData.professionalInfo.qualification}
                      onChange={(e) => updateProfessionalInfo('qualification', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">{doctorData.professionalInfo.qualification}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Clock className="h-4 w-4 inline mr-2" />
                    अनुभव
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={tempData.professionalInfo.experience}
                      onChange={(e) => updateProfessionalInfo('experience', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">{doctorData.professionalInfo.experience}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Building className="h-4 w-4 inline mr-2" />
                    वर्तमान अस्पताल
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={tempData.professionalInfo.currentHospital}
                      onChange={(e) => updateProfessionalInfo('currentHospital', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">{doctorData.professionalInfo.currentHospital}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">विभाग</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={tempData.professionalInfo.department}
                      onChange={(e) => updateProfessionalInfo('department', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">{doctorData.professionalInfo.department}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Calendar className="h-4 w-4 inline mr-2" />
                    ज्वाइनिंग तारीख
                  </label>
                  {isEditing ? (
                    <input
                      type="date"
                      value={tempData.professionalInfo.joiningDate}
                      onChange={(e) => updateProfessionalInfo('joiningDate', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">
                      {new Date(doctorData.professionalInfo.joiningDate).toLocaleDateString('hi-IN')}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <BookOpen className="h-4 w-4 inline mr-2" />
                    भाषाएं
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={tempData.professionalInfo.languages.join(', ')}
                      onChange={(e) => updateProfessionalInfo('languages', e.target.value.split(', '))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="कॉमा से अलग करें"
                    />
                  ) : (
                    <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">
                      {doctorData.professionalInfo.languages.join(', ')}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Achievements Tab */}
          {activeTab === 'achievements' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">उपलब्धियां और सम्मान</h3>
              
              <div className="space-y-4">
                {achievements.length > 0 ? achievements.map((achievement, index) => {
                  const IconComponent = achievement.icon;
                  return (
                    <div key={index} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-start space-x-4">
                        <div className="bg-yellow-100 p-3 rounded-full">
                          <IconComponent className="h-6 w-6 text-yellow-600" />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-lg font-semibold text-gray-900">{achievement.title}</h4>
                          <p className="text-sm text-gray-600 mt-1">{achievement.organization}</p>
                          <p className="text-xs text-gray-500 mt-2">
                            {new Date(achievement.date).toLocaleDateString('hi-IN')}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                }) : (
                  <p className="text-gray-500 text-center py-8">कोई उपलब्धि उपलब्ध नहीं है</p>
                )}
              </div>
            </div>
          )}

          {/* Activity Tab */}
          {activeTab === 'activity' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">हाल की गतिविधि</h3>
              
              <div className="space-y-4">
                {recentActivities.length > 0 ? recentActivities.map((activity, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className={`w-3 h-3 rounded-full ${
                          activity.type === 'camp' ? 'bg-green-500' :
                          activity.type === 'checkup' ? 'bg-blue-500' : 'bg-purple-500'
                        }`}></div>
                        <div>
                          <h4 className="font-medium text-gray-900">{activity.activity}</h4>
                          <p className="text-sm text-gray-600">{activity.patients} मरीज़ों की सेवा</p>
                        </div>
                      </div>
                      <span className="text-sm text-gray-500">
                        {new Date(activity.date).toLocaleDateString('hi-IN')}
                      </span>
                    </div>
                  </div>
                )) : (
                  <p className="text-gray-500 text-center py-8">कोई हाल की गतिविधि उपलब्ध नहीं है</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DoctorProfile;
