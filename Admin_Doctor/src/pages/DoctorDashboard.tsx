import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  MapPin,
  Users, 
  Heart, 
  Calendar, 
  Plus,
  Clock,
  UserPlus
} from 'lucide-react';

const DoctorDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [doctorInfo] = useState(() => {
    // Clear any existing localStorage data to remove demo content
    localStorage.removeItem('doctorInfo');
    return {
      name: '',
      specialization: '',
      registrationNo: ''
    };
  });

  // Empty data for doctor dashboard - Connect to your backend
  const todayStats = {
    totalPatients: 0,
    newPatients: 0,
    followUps: 0,
    activeCamps: 0
  };

  // Empty activities data - Connect to your backend
  const recentActivities: any[] = [];

  // Empty camps data - Connect to your backend  
  const upcomingCamps: any[] = [];

  const kpiCards = [
    {
      title: 'आज के मरीज़',
      value: todayStats.totalPatients,
      icon: Users,
      color: 'bg-blue-500',
      change: '0 नए',
      changeType: 'neutral' as const,
    },
    {
      title: 'नए पंजीकरण',
      value: todayStats.newPatients,
      icon: UserPlus,
      color: 'bg-purple-400',
      change: '0 आज',
      changeType: 'neutral' as const,
    },
    {
      title: 'फॉलो-अप',
      value: todayStats.followUps,
      icon: Calendar,
      color: 'bg-yellow-400',
      change: '0 बाकी',
      changeType: 'neutral' as const,
    },
    {
      title: 'सक्रिय शिविर',
      value: todayStats.activeCamps,
      icon: MapPin,
      color: 'bg-purple-500',
      change: '0 आगामी',
      changeType: 'neutral' as const,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-green-700 to-green-900 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">नमस्कार{doctorInfo.name ? `, ${doctorInfo.name}` : ''}!</h1>
            <p className="text-green-100">
              आज के स्वास्थ्य शिविर में आपका स्वागत है।
            </p>
            {(doctorInfo.specialization || doctorInfo.registrationNo) && (
              <p className="text-green-200 text-sm mt-1">
                {doctorInfo.specialization} {doctorInfo.registrationNo ? `• रजिस्ट्रेशन: ${doctorInfo.registrationNo}` : ''}
              </p>
            )}
          </div>
          <div className="hidden md:flex items-center space-x-2">
            <Calendar className="h-5 w-5 text-green-200" />
            <span className="text-green-100">
              {new Date().toLocaleDateString('hi-IN', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </span>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiCards.map((card, index) => {
          const IconComponent = card.icon;
          return (
            <div key={index} className="card border border-gray-400">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">{card.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{card.value}</p>
                  <div className="flex items-center mt-2">
                    <span
                      className={`text-sm font-medium text-gray-600`}
                    >
                      {card.change}
                    </span>
                  </div>
                </div>
                <div className={`p-3 rounded-lg ${card.color}`}>
                  <IconComponent className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="card border border-gray-400">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">त्वरित कार्य</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <button 
            onClick={() => navigate('/doctor/new-camp')}
            className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors duration-200"
          >
            <div className="text-center">
              <Plus className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm font-medium text-gray-700">नया शिविर जोड़ें</p>
            </div>
          </button>
          
          <button 
            onClick={() => navigate('/doctor/patients')}
            className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors duration-200"
          >
            <div className="text-center">
              <Users className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm font-medium text-gray-700">मरीज़ प्रबंधन</p>
            </div>
          </button>
          
          <button 
            onClick={() => navigate('/doctor/health-records')}
            className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors duration-200"
          >
            <div className="text-center">
              <Heart className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm font-medium text-gray-700">स्वास्थ्य रिकॉर्ड</p>
            </div>
          </button>
          
          <button 
            onClick={() => navigate('/doctor/family-health')}
            className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors duration-200"
          >
            <div className="text-center">
              <UserPlus className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm font-medium text-gray-700">पारिवारिक स्वास्थ्य</p>
            </div>
          </button>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activities */}
        <div className="lg:col-span-2 card border border-gray-400">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">आज की गतिविधि</h3>
          </div>
          <div className="space-y-4">
            {recentActivities.length > 0 ? recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className="flex-shrink-0">
                  <div className={`w-3 h-3 rounded-full mt-2 ${
                    activity.type === 'checkup' ? 'bg-blue-500' :
                    activity.type === 'registration' ? 'bg-green-500' :
                    activity.type === 'followup' ? 'bg-green-500' : 'bg-purple-500'
                  }`}></div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                    <span className="text-xs text-gray-500">{activity.time}</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">मरीज़: {activity.patient}</p>
                  <p className="text-xs text-gray-500 mt-1">{activity.details}</p>
                </div>
              </div>
            )) : (
              <div className="text-center py-8">
                <p className="text-gray-500">आज कोई गतिविधि नहीं है</p>
              </div>
            )}
          </div>
          <div className="mt-4 pt-4 border-t border-gray-200">
            <button 
              onClick={() => navigate('/doctor/activities')}
              className="text-sm text-orange-600 hover:text-orange-700 font-medium"
            >
              सभी गतिविधि देखें →
            </button>
          </div>
        </div>

        {/* Upcoming Camps */}
        <div className="card border border-gray-400">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">आगामी शिविर</h3>
          </div>
          <div className="space-y-4">
            {upcomingCamps.length > 0 ? upcomingCamps.map((camp) => (
              <div key={camp.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="text-sm font-semibold text-gray-900 mb-1">
                      {camp.location}
                    </h4>
                    <div className="flex items-center text-xs text-gray-500 mb-2">
                      <Calendar className="h-3 w-3 mr-1" />
                      <span>{new Date(camp.date).toLocaleDateString('hi-IN')}</span>
                    </div>
                    <div className="flex items-center text-xs text-gray-500 mb-2">
                      <Clock className="h-3 w-3 mr-1" />
                      <span>{camp.time}</span>
                    </div>
                    <div className="flex items-center text-xs text-gray-500">
                      <Users className="h-3 w-3 mr-1" />
                      <span>{camp.expectedPatients} अपेक्षित मरीज़</span>
                    </div>
                  </div>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    camp.status === 'confirmed' 
                      ? 'bg-orange-100 text-orange-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {camp.status === 'confirmed' ? 'पुष्ट' : 'निर्धारित'}
                  </span>
                </div>
              </div>
            )) : (
              <div className="text-center py-8">
                <p className="text-gray-500">कोई आगामी शिविर नहीं है</p>
              </div>
            )}
          </div>
          <div className="mt-4 pt-4 border-t border-gray-200">
            <button 
              onClick={() => navigate('/doctor/new-camp')}
              className="w-full text-sm text-orange-600 hover:text-orange-700 font-medium"
            >
              + नया शिविर जोड़ें
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;
