import React, { useState } from 'react';
import { Users as UsersIcon, Building, Calendar, ChevronDown, ChevronRight, Download } from 'lucide-react';
import type { User, TableColumn } from '../types/interfaces';

const Users: React.FC = () => {
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  
  // Empty data arrays - Connect to your backend
  const mockUsers: User[] = [];
  const mockHealthRecords: any[] = [];

  const getUserHealthRecords = (userId: string) => {
    return [];
  };

  const toggleRowExpansion = (userId: string) => {
    const newExpandedRows = new Set(expandedRows);
    if (newExpandedRows.has(userId)) {
      newExpandedRows.delete(userId);
    } else {
      newExpandedRows.add(userId);
    }
    setExpandedRows(newExpandedRows);
  };

  const generatePDF = (user: User) => {
    // Mock PDF generation
    console.log(`Generating PDF for ${user.name}`);
    alert(`PDF report for ${user.name} will be downloaded (Demo)`);
  };

  const HealthTimeline: React.FC<{ userId: string }> = ({ userId }) => {
    const healthRecords = getUserHealthRecords(userId);
    
    return (
      <div className="mt-4 p-4 bg-gray-50 rounded-lg">
        <h4 className="text-sm font-medium text-gray-900 mb-3">स्वास्थ्य रिकॉर्ड समयरेखा</h4>
        <p className="text-sm text-gray-500">कोई स्वास्थ्य रिकॉर्ड उपलब्ध नहीं है</p>
      </div>
    );
  };

  const columns: TableColumn[] = [
    {
      key: 'expand',
      label: '',
      sortable: false,
      render: (_, row) => (
        <button
          onClick={() => toggleRowExpansion(row.id)}
          className="p-1 text-gray-400 hover:text-gray-600"
        >
          {expandedRows.has(row.id) ? (
            <ChevronDown className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </button>
      ),
    },
    {
      key: 'name',
      label: 'कर्मचारी',
      render: (value, row) => (
        <div className="flex items-center">
          <div className="ml-4">
            <p className="font-medium text-gray-900">{value}</p>
            <p className="text-sm text-gray-500">{row.employeeId}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'department',
      label: 'विभाग',
      render: (value) => (
        <div className="flex items-center">
          <Building className="h-4 w-4 text-gray-400 mr-2" />
          <span className="text-gray-900">{value}</span>
        </div>
      ),
    },
    {
      key: 'joiningDate',
      label: 'कार्यग्रहण तिथि',
      render: (value) => (
        <div className="flex items-center">
          <Calendar className="h-4 w-4 text-gray-400 mr-2" />
          <span className="text-gray-900">
            {value ? new Date(value).toLocaleDateString('en-IN') : 'लागू नहीं'}
          </span>
        </div>
      ),
    },
    {
      key: 'phone',
      label: 'संपर्क',
      render: (value, row) => (
        <div className="space-y-1">
          <p className="text-sm text-gray-900">{value}</p>
          <p className="text-sm text-gray-500">{row.email}</p>
        </div>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      sortable: false,
      render: (_, row) => (
        <button
          onClick={() => generatePDF(row)}
          className="flex items-center space-x-1 px-2 py-1 text-xs bg-primary-100 text-primary-700 rounded hover:bg-primary-200"
        >
          <Download className="h-3 w-3" />
          <span>PDF</span>
        </button>
      ),
    },
  ];

  // Enhanced data table that supports expandable rows
  const EnhancedDataTable: React.FC = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [showRegistrationForm, setShowRegistrationForm] = useState(false);
    const [formData, setFormData] = useState({
      name: '',
      employeeId: '',
      email: '',
      phone: '',
      department: '',
      joiningDate: '',
    });
    const itemsPerPage = 10;

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      console.log('Form submitted:', formData);
      // Here you would typically make an API call to save the user
      setFormData({
        name: '',
        employeeId: '',
        email: '',
        phone: '',
        department: '',
        joiningDate: '',
      });
      setShowRegistrationForm(false);
    };

    const filteredData = mockUsers.filter((user) =>
      Object.values(user).some((value) =>
        String(value).toLowerCase().includes(searchTerm.toLowerCase())
      )
    );

    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentData = filteredData.slice(startIndex, endIndex);

    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
        {/* User Registration Section */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => setShowRegistrationForm(!showRegistrationForm)}
              className="btn-primary"
            >
              {showRegistrationForm ? 'फॉर्म बंद करें' : 'नया कर्मचारी जोड़ें'}
            </button>
            <input
              type="text"
              placeholder="कर्मचारी खोजें..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full max-w-md input-field ml-4"
            />
          </div>

          {/* Collapsible Registration Form */}
          {showRegistrationForm && (
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4 p-4 bg-gray-50 rounded-lg">
              <input
                type="text"
                placeholder="नाम"
                className="input-field"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
              <input
                type="text"
                placeholder="कर्मचारी आईडी"
                className="input-field"
                name="employeeId"
                value={formData.employeeId}
                onChange={handleInputChange}
                required
              />
              <input
                type="email"
                placeholder="ईमेल"
                className="input-field"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
              <input
                type="tel"
                placeholder="फोन नंबर"
                className="input-field"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                required
              />
              <select
                className="input-field"
                name="department"
                value={formData.department}
                onChange={handleInputChange}
                required
              >
                <option value="">विभाग चुनें</option>
              </select>
              <input
                type="date"
                placeholder="कार्यग्रहण तिथि"
                className="input-field"
                name="joiningDate"
                value={formData.joiningDate}
                onChange={handleInputChange}
                required
              />
              <div className="col-span-full flex justify-end">
                <button type="submit" className="btn-primary">
                  कर्मचारी जोड़ें
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {columns.map((column) => (
                  <th
                    key={column.key}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {column.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentData.map((row) => (
                <React.Fragment key={row.id}>
                  <tr className="hover:bg-gray-50">
                    {columns.map((column) => (
                      <td key={column.key} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {column.render ? column.render((row as any)[column.key], row) : (row as any)[column.key]}
                      </td>
                    ))}
                  </tr>
                  {expandedRows.has(row.id) && (
                    <tr>
                      <td colSpan={columns.length} className="px-6 py-0">
                        <HealthTimeline userId={row.id} />
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>

        {/* Simple Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-3 bg-white border-t border-gray-200">
            <span className="text-sm text-gray-700">
              {filteredData.length} परिणामों में से {startIndex + 1} से {Math.min(endIndex, filteredData.length)} दिखा रहे हैं
            </span>
            <div className="flex space-x-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 text-sm border rounded disabled:opacity-50"
              >
                पिछला
              </button>
              <span className="px-3 py-1 text-sm">
                पृष्ठ {currentPage} कुल {totalPages} का
              </span>
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 text-sm border rounded disabled:opacity-50"
              >
                अगला
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">उपयोगकर्ता और स्वास्थ्य रिकॉर्ड</h1>
          <p className="text-gray-600">कर्मचारी स्वास्थ्य रिकॉर्ड और परिवार का डेटा देखें</p>
        </div>
        <button className="btn-primary flex items-center space-x-2">
          <Download className="h-4 w-4" />
          <span>Export All Data</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <UsersIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">कुल कर्मचारी</p>
              <p className="text-2xl font-bold text-gray-900">0</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <Building className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Departments</p>
              <p className="text-2xl font-bold text-gray-900">0</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Calendar className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">स्वास्थ्य रिकार्ड</p>
              <p className="text-2xl font-bold text-gray-900">0</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 rounded-lg">
              <UsersIcon className="h-6 w-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">व्यवस्थापक</p>
              <p className="text-2xl font-bold text-gray-900">0</p>
            </div>
          </div>
        </div>
      </div>

      {/* Users Table with Expandable Rows */}
      <EnhancedDataTable />

      {/* Health Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">स्वास्थ्य स्थिति अवलोकन</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">सामान्य बी.पी</span>
              <span className="text-sm font-medium text-gray-400">0%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">हाई बी.पी</span>
              <span className="text-sm font-medium text-gray-400">0%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">बहुत हाई बीपी</span>
              <span className="text-sm font-medium text-gray-400">0%</span>
            </div>
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">शुगर लेवल की स्थिति</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">सामान्य</span>
              <span className="text-sm font-medium text-gray-400">0%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">पूर्व मधुमेह</span>
              <span className="text-sm font-medium text-gray-400">0%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">मधुमेह</span>
              <span className="text-sm font-medium text-gray-400">0%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Users;
