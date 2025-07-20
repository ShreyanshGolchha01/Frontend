import React, { useState } from 'react';
import { Plus, Calendar, MapPin, Users, Edit, Trash2, Eye } from 'lucide-react';
import DataTable from '../components/DataTable';
import ConfirmDialog from '../components/ConfirmDialog';
import { mockCamps, mockDoctors, getDoctorById } from '../data/mockData';
import type { Camp, TableColumn } from '../types/interfaces';

const Camps: React.FC = () => {
  const [camps, setCamps] = useState(mockCamps);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingCamp, setEditingCamp] = useState<Camp | null>(null);
  const [deletingCamp, setDeletingCamp] = useState<Camp | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const [formData, setFormData] = useState({
    location: '',
    date: '',
    timeFrom: '',
    timeTo: '',
    address: '',
    coordinator: '',
    expectedBeneficiaries: '',
    doctors: [] as string[],
  });

  const handleAddCamp = () => {
    const newCamp: Camp = {
      id: Date.now().toString(),
      location: formData.location,
      date: formData.date,
      time: `${formData.timeFrom} - ${formData.timeTo}`,
      address: formData.address,
      coordinator: formData.coordinator,
      expectedBeneficiaries: parseInt(formData.expectedBeneficiaries),
      doctors: formData.doctors,
      status: 'scheduled',
      beneficiaries: 0,
    };

    setCamps([...camps, newCamp]);
    setShowAddModal(false);
    resetForm();
  };

  const handleEditCamp = () => {
    if (!editingCamp) return;

    const updatedCamps = camps.map(camp =>
      camp.id === editingCamp.id
        ? {
            ...camp,
            location: formData.location,
            date: formData.date,
            time: `${formData.timeFrom} - ${formData.timeTo}`,
            address: formData.address,
            coordinator: formData.coordinator,
            expectedBeneficiaries: parseInt(formData.expectedBeneficiaries),
            doctors: formData.doctors,
          }
        : camp
    );

    setCamps(updatedCamps);
    setEditingCamp(null);
    resetForm();
  };

  const handleDeleteCamp = () => {
    if (!deletingCamp) return;
    setCamps(camps.filter(camp => camp.id !== deletingCamp.id));
    setDeletingCamp(null);
  };

  const resetForm = () => {
    setFormData({
      location: '',
      date: '',
      timeFrom: '',
      timeTo: '',
      address: '',
      coordinator: '',
      expectedBeneficiaries: '',
      doctors: [],
    });
  };

  const openEditModal = (camp: Camp) => {
    setEditingCamp(camp);
    setFormData({
      location: camp.location,
      date: camp.date,
      timeFrom: camp.time.split(' - ')[0] || '',
      timeTo: camp.time.split(' - ')[1] || '',
      address: camp.address,
      coordinator: camp.coordinator,
      expectedBeneficiaries: camp.expectedBeneficiaries.toString(),
      doctors: camp.doctors,
    });
    setShowAddModal(true);
  };

  const getStatusBadge = (status: string) => {
    const statusStyles = {
      scheduled: 'bg-blue-100 text-blue-800',
      ongoing: 'bg-yellow-100 text-yellow-800',
      completed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
    };

    const statusLabels = {
      scheduled: 'निर्धारित',
      ongoing: 'चल रहा',
      completed: 'पूर्ण',
      cancelled: 'रद्द',
    };

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusStyles[status as keyof typeof statusStyles]}`}>
        {statusLabels[status as keyof typeof statusLabels] || status}
      </span>
    );
  };

  const columns: TableColumn[] = [
    {
      key: 'location',
      label: 'स्थान',
      render: (value, row) => (
        <div>
          <p className="font-medium text-gray-900">{value}</p>
          <p className="text-sm text-gray-500">{row.address}</p>
        </div>
      ),
    },
    {
      key: 'date',
      label: 'तारीख और समय',
      render: (value, row) => (
        <div>
          <p className="font-medium text-gray-900">{new Date(value).toLocaleDateString('en-IN')}</p>
          <p className="text-sm text-gray-500">{row.time}</p>
        </div>
      ),
    },
    {
      key: 'doctors',
      label: 'डॉक्टर',
      sortable: false,
      render: (value: string[]) => (
        <div className="space-y-1">
          {value.slice(0, 2).map(doctorId => {
            const doctor = getDoctorById(doctorId);
            return doctor ? (
              <p key={doctorId} className="text-sm text-gray-900">{doctor.name}</p>
            ) : null;
          })}
          {value.length > 2 && (
            <p className="text-xs text-gray-500">+{value.length - 2} और</p>
          )}
        </div>
      ),
    },
    {
      key: 'coordinator',
      label: 'समन्वयक',
    },
    {
      key: 'status',
      label: 'स्थिति',
      render: (value) => getStatusBadge(value),
    },
    {
      key: 'beneficiaries',
      label: 'लाभार्थी',
      render: (value, row) => (
        <div>
          <p className="font-medium text-gray-900">{value}/{row.expectedBeneficiaries}</p>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
            <div
              className="bg-primary-500 h-2 rounded-full"
              style={{ width: `${Math.min((value / row.expectedBeneficiaries) * 100, 100)}%` }}
            ></div>
          </div>
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
            onClick={() => console.log('View camp:', row.id)}
            className="p-1 text-gray-400 hover:text-primary-600"
          >
            <Eye className="h-4 w-4" />
          </button>
          <button
            onClick={() => openEditModal(row)}
            className="p-1 text-gray-400 hover:text-primary-600"
          >
            <Edit className="h-4 w-4" />
          </button>
          <button
            onClick={() => {
              setDeletingCamp(row);
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">स्वास्थ्य शिविर</h1>
          <p className="text-gray-600">स्वास्थ्य शिविरों का प्रबंधन और अनुसूची</p>
        </div>
        <button
          onClick={() => {
            setShowAddModal(true);
            setEditingCamp(null);
            resetForm();
          }}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>नया शिविर जोड़ें</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Calendar className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">निर्धारित</p>
              <p className="text-2xl font-bold text-gray-900">
                {camps.filter(camp => camp.status === 'scheduled').length}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <MapPin className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">पूर्ण</p>
              <p className="text-2xl font-bold text-gray-900">
                {camps.filter(camp => camp.status === 'completed').length}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Users className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">कुल लाभार्थी</p>
              <p className="text-2xl font-bold text-gray-900">
                {camps.reduce((sum, camp) => sum + camp.beneficiaries, 0)}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Calendar className="h-6 w-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">इस महीने</p>
              <p className="text-2xl font-bold text-gray-900">
                {camps.filter(camp => 
                  new Date(camp.date).getMonth() === new Date().getMonth() &&
                  new Date(camp.date).getFullYear() === new Date().getFullYear()
                ).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Camps Table */}
      <DataTable data={camps} columns={columns} />

      {/* Add/Edit Camp Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" />
            
            <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {editingCamp ? 'शिविर संपादित करें' : 'नया शिविर जोड़ें'}
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    स्थान
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="input-field"
                    placeholder="शिविर का स्थान लिखें"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      तारीख
                    </label>
                    <input
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      समय
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">से</label>
                        <input
                          type="time"
                          value={formData.timeFrom}
                          onChange={(e) => setFormData({ ...formData, timeFrom: e.target.value })}
                          className="input-field"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">तक</label>
                        <input
                          type="time"
                          value={formData.timeTo}
                          onChange={(e) => setFormData({ ...formData, timeTo: e.target.value })}
                          className="input-field"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    पता
                  </label>
                  <textarea
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="input-field"
                    rows={3}
                    placeholder="पूरा पता लिखें"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    समन्वयक
                  </label>
                  <input
                    type="text"
                    value={formData.coordinator}
                    onChange={(e) => setFormData({ ...formData, coordinator: e.target.value })}
                    className="input-field"
                    placeholder="समन्वयक का नाम लिखें"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    अनुमानित लाभार्थी
                  </label>
                  <input
                    type="number"
                    value={formData.expectedBeneficiaries}
                    onChange={(e) => setFormData({ ...formData, expectedBeneficiaries: e.target.value })}
                    className="input-field"
                    placeholder="अनुमानित संख्या लिखें"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    डॉक्टर नियुक्त करें
                  </label>
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {mockDoctors.map(doctor => (
                      <label key={doctor.id} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={formData.doctors.includes(doctor.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFormData({
                                ...formData,
                                doctors: [...formData.doctors, doctor.id]
                              });
                            } else {
                              setFormData({
                                ...formData,
                                doctors: formData.doctors.filter(id => id !== doctor.id)
                              });
                            }
                          }}
                          className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">{doctor.name}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingCamp(null);
                    resetForm();
                  }}
                  className="btn-secondary"
                >
                  रद्द करें
                </button>
                <button
                  onClick={editingCamp ? handleEditCamp : handleAddCamp}
                  className="btn-primary"
                >
                  {editingCamp ? 'शिविर अपडेट करें' : 'शिविर जोड़ें'}
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
        onConfirm={handleDeleteCamp}
        title="शिविर हटाएं"
        message={`क्या आप वाकई ${deletingCamp?.location} स्थान पर शिविर को हटाना चाहते हैं? यह कार्य वापस नहीं किया जा सकता।`}
        type="danger"
        confirmText="हटाएं"
        cancelText="रद्द करें"
      />
    </div>
  );
};

export default Camps;
