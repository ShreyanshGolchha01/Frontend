import React, { useState } from 'react';
import { Plus, Stethoscope, Award, Phone, Mail, Edit, Trash2 } from 'lucide-react';
import DataTable from '../components/DataTable';
import ConfirmDialog from '../components/ConfirmDialog';
import { mockDoctors, mockCamps, getCampById } from '../data/mockData';
import type { Doctor, TableColumn } from '../types/interfaces';

const Doctors: React.FC = () => {
  const [doctors, setDoctors] = useState(mockDoctors);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState<Doctor | null>(null);
  const [deletingDoctor, setDeletingDoctor] = useState<Doctor | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    specialty: '',
    phone: '',
    email: '',
    experience: '',
    qualification: '',
    assignedCamps: [] as string[],
  });

  const handleAddDoctor = () => {
    const newDoctor: Doctor = {
      id: Date.now().toString(),
      name: formData.name,
      specialty: formData.specialty,
      phone: formData.phone,
      email: formData.email,
      experience: parseInt(formData.experience),
      qualification: formData.qualification,
      assignedCamps: formData.assignedCamps,
      
    };

    setDoctors([...doctors, newDoctor]);
    setShowAddModal(false);
    resetForm();
  };

  const handleEditDoctor = () => {
    if (!editingDoctor) return;

    const updatedDoctors = doctors.map(doctor =>
      doctor.id === editingDoctor.id
        ? {
            ...doctor,
            name: formData.name,
            specialty: formData.specialty,
            phone: formData.phone,
            email: formData.email,
            experience: parseInt(formData.experience),
            qualification: formData.qualification,
            assignedCamps: formData.assignedCamps,
          }
        : doctor
    );

    setDoctors(updatedDoctors);
    setEditingDoctor(null);
    resetForm();
  };

  const handleDeleteDoctor = () => {
    if (!deletingDoctor) return;
    setDoctors(doctors.filter(doctor => doctor.id !== deletingDoctor.id));
    setDeletingDoctor(null);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      specialty: '',
      phone: '',
      email: '',
      experience: '',
      qualification: '',
      assignedCamps: [],
    });
  };

  const openEditModal = (doctor: Doctor) => {
    setEditingDoctor(doctor);
    setFormData({
      name: doctor.name,
      specialty: doctor.specialty,
      phone: doctor.phone,
      email: doctor.email,
      experience: doctor.experience.toString(),
      qualification: doctor.qualification,
      assignedCamps: doctor.assignedCamps,
    });
    setShowAddModal(true);
  };

  const columns: TableColumn[] = [
    {
      key: 'name',
      label: 'चिकित्सक',
      render: (value, row) => (
        <div className="flex items-center">
          
          <div className="ml-4">
            <p className="font-medium text-gray-900">{value}</p>
            <p className="text-sm text-gray-500">{row.qualification}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'specialty',
      label: 'विशेषज्ञता',
      render: (value) => (
        <div className="flex items-center">
          <Stethoscope className="h-4 w-4 text-gray-400 mr-2" />
          <span className="text-gray-900">{value}</span>
        </div>
      ),
    },
    {
      key: 'experience',
      label: 'अनुभव',
      render: (value) => (
        <div className="flex items-center">
          <Award className="h-4 w-4 text-gray-400 mr-2" />
          <span className="text-gray-900">{value} वर्ष</span>
        </div>
      ),
    },
    {
      key: 'phone',
      label: 'संपर्क',
      render: (value, row) => (
        <div className="space-y-1">
          <div className="flex items-center">
            <Phone className="h-3 w-3 text-gray-400 mr-2" />
            <span className="text-sm text-gray-900">{value}</span>
          </div>
          <div className="flex items-center">
            <Mail className="h-3 w-3 text-gray-400 mr-2" />
            <span className="text-sm text-gray-500">{row.email}</span>
          </div>
        </div>
      ),
    },
    {
      key: 'assignedCamps',
      label: 'नियुक्त शिविर',
      sortable: false,
      render: (value: string[]) => (
        <div className="space-y-1">
          {value.slice(0, 2).map(campId => {
            const camp = getCampById(campId);
            return camp ? (
              <div key={campId} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                {camp.location}
              </div>
            ) : null;
          })}
          {value.length > 2 && (
            <p className="text-xs text-gray-500">+{value.length - 2} और</p>
          )}
          {value.length === 0 && (
            <span className="text-xs text-gray-400">नियुक्त नहीं</span>
          )}
        </div>
      ),
    },
    {
      key: 'actions',
      label: 'कार्य',
      sortable: false,
      render: (_, row) => (
        <div className="flex items-center space-x-2">
          <button
            onClick={() => openEditModal(row)}
            className="p-1 text-gray-400 hover:text-primary-600"
          >
            <Edit className="h-4 w-4" />
          </button>
          <button
            onClick={() => {
              setDeletingDoctor(row);
              setShowConfirmDialog(true);
            }}
            className="p-1 text-gray-400 hover:text-red-600"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ];

  const specialties = [
    'सामान्य चिकित्सा',
    'हृदय रोग विशेषज्ञ',
    'हड्डी रोग विशेषज्ञ',
    'स्त्री रोग विशेषज्ञ',
    'बाल रोग विशेषज्ञ',
    'त्वचा रोग विशेषज्ञ',
    'नेत्र रोग विशेषज्ञ',
    'कान, नाक और गला विशेषज्ञ',
    'तंत्रिका विशेषज्ञ',
    'मनोरोग विशेषज्ञ',
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">चिकित्सक</h1>
          <p className="text-gray-600">चिकित्सा पेशेवरों का प्रबंधन</p>
        </div>
        <button
          onClick={() => {
            setShowAddModal(true);
            setEditingDoctor(null);
            resetForm();
          }}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>नया चिकित्सक जोड़ें</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Stethoscope className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">कुल चिकित्सक</p>
              <p className="text-2xl font-bold text-gray-900">{doctors.length}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <Award className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">औसत अनुभव</p>
              <p className="text-2xl font-bold text-gray-900">
                {Math.round(doctors.reduce((sum, doctor) => sum + doctor.experience, 0) / doctors.length)} वर्ष
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Stethoscope className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">विशेषज्ञताएं</p>
              <p className="text-2xl font-bold text-gray-900">
                {new Set(doctors.map(doctor => doctor.specialty)).size}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Phone className="h-6 w-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">उपलब्ध</p>
              <p className="text-2xl font-bold text-gray-900">
                {doctors.filter(doctor => doctor.assignedCamps.length > 0).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Doctors Table */}
      <DataTable data={doctors} columns={columns} />

      {/* Add/Edit Doctor Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" />
            
            <div className="inline-block w-full max-w-lg p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {editingDoctor ? 'चिकित्सक संपादित करें' : 'नया चिकित्सक जोड़ें'}
              </h3>

              <div className="space-y-4 max-h-96 overflow-y-auto">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    पूरा नाम
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="input-field"
                    placeholder="डॉक्टर का पूरा नाम दर्ज करें"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    विशेषज्ञता
                  </label>
                  <select
                    value={formData.specialty}
                    onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
                    className="input-field"
                  >
                    <option value="">विशेषज्ञता चुनें</option>
                    {specialties.map(specialty => (
                      <option key={specialty} value={specialty}>{specialty}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      फ़ोन नंबर
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="input-field"
                      placeholder="फ़ोन नंबर दर्ज करें"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      अनुभव (वर्षों में)
                    </label>
                    <input
                      type="number"
                      value={formData.experience}
                      onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                      className="input-field"
                      placeholder="कितने वर्षों का अनुभव"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    ईमेल
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="input-field"
                    placeholder="ईमेल पता दर्ज करें"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    योग्यता
                  </label>
                  <input
                    type="text"
                    value={formData.qualification}
                    onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
                    className="input-field"
                    placeholder="जैसे: एमबीबीएस, एमडी"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    शिविर नियुक्ति
                  </label>
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {mockCamps.filter(camp => camp.status === 'scheduled').map(camp => (
                      <label key={camp.id} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={formData.assignedCamps.includes(camp.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFormData({
                                ...formData,
                                assignedCamps: [...formData.assignedCamps, camp.id]
                              });
                            } else {
                              setFormData({
                                ...formData,
                                assignedCamps: formData.assignedCamps.filter(id => id !== camp.id)
                              });
                            }
                          }}
                          className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">
                          {camp.location} - {new Date(camp.date).toLocaleDateString('en-IN')}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingDoctor(null);
                    resetForm();
                  }}
                  className="btn-secondary"
                >
                  रद्द करें
                </button>
                <button
                  onClick={editingDoctor ? handleEditDoctor : handleAddDoctor}
                  className="btn-primary"
                >
                  {editingDoctor ? 'चिकित्सक अपडेट करें' : 'चिकित्सक जोड़ें'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        isOpen={showConfirmDialog}
        onClose={() => setShowConfirmDialog(false)}
        onConfirm={handleDeleteDoctor}
        title="चिकित्सक हटाएं"
        message={`क्या आप वाकई डॉ. ${deletingDoctor?.name} को हटाना चाहते हैं? इस कार्य को वापस नहीं किया जा सकता.`}
        type="danger"
        confirmText="हटाएं"
        cancelText="रद्द करें"
      />
    </div>
  );
};

export default Doctors;
