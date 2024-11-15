import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from '../../utils/axiosConfig';
import { AuthContext } from '../../context/AuthContext';
import { FaUserMd, FaUser, FaSearch } from 'react-icons/fa';

const AdminDashboard = () => {
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('Dashboard');
  const { token } = useContext(AuthContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('Admin token:', token);
        
        const [patientsRes, doctorsRes] = await Promise.all([
          axios.get('/api/admin/patients', {
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get('/api/admin/doctors', {
            headers: { Authorization: `Bearer ${token}` }
          })
        ]);

        setPatients(patientsRes.data);
        setDoctors(doctorsRes.data);
        setError('');
      } catch (error) {
        console.error('Dashboard error:', error);
        setError(error.response?.data?.message || 'Failed to fetch data');
        if (error.response?.status === 403) {
          setError('Access denied. Admin privileges required.');
        }
      }
    };

    if (token) {
      fetchData();
    }
  }, [token]);

  const filteredPatients = patients.filter(patient =>
    patient.FullName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredDoctors = doctors.filter(doctor =>
    doctor.FullName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex h-screen">
      <aside className="w-64 bg-indigo-700 text-white p-6 flex flex-col">
        <h2 className="text-2xl font-bold mb-6">Admin Panel</h2>
        <nav className="flex-1">
          <ul>
            <li className={`mb-4 ${activeTab === 'Dashboard' ? 'bg-indigo-600' : ''}`}>
              <Link to="/admin/dashboard" className="hover:text-gray-300" onClick={() => setActiveTab('Dashboard')}>Dashboard</Link>
            </li>
            <li className={`mb-4 ${activeTab === 'Settings' ? 'bg-indigo-600' : ''}`}>
              <Link to="/settings" className="hover:text-gray-300" onClick={() => setActiveTab('Settings')}>Settings</Link>
            </li>
            <li className={`mb-4 ${activeTab === 'Profile' ? 'bg-indigo-600' : ''}`}>
              <a href="#" className="hover:text-gray-300" onClick={() => setActiveTab('Profile')}>Profile</a>
            </li>
          </ul>
        </nav>
      </aside>
      <main className="flex-1 p-6 overflow-y-auto">
        <div className="bg-gradient-to-r from-teal-400 to-blue-500 text-white p-8 rounded-lg shadow-lg mb-8">
          <h1 className="text-4xl font-bold">Admin Dashboard</h1>
          <p className="mt-2">Manage patients and doctors efficiently</p>
        </div>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <div className="mb-6">
          <div className="flex items-center bg-white p-4 rounded-lg shadow">
            <FaSearch className="text-gray-500 mr-2" />
            <input
              type="text"
              placeholder="Search by name"
              className="flex-1 outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold mb-4 flex items-center">
              <FaUser className="mr-2 text-teal-500" /> Patients
            </h2>
            {filteredPatients.length > 0 ? (
              <ul className="space-y-2">
                {filteredPatients.map(patient => (
                  <li key={patient.UserID} className="p-4 bg-gray-50 rounded-lg shadow-sm flex items-center">
                    <div className="flex-1">
                      <p className="font-medium">{patient.FullName}</p>
                      <p className="text-sm text-gray-600">{patient.Email}</p>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No patients found</p>
            )}
          </div>

          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold mb-4 flex items-center">
              <FaUserMd className="mr-2 text-green-500" /> Doctors
            </h2>
            {filteredDoctors.length > 0 ? (
              <ul className="space-y-2">
                {filteredDoctors.map(doctor => (
                  <li key={doctor.UserID} className="p-4 bg-gray-50 rounded-lg shadow-sm flex items-center">
                    <div className="flex-1">
                      <p className="font-medium">{doctor.FullName}</p>
                      <p className="text-sm text-gray-600">{doctor.Specialization}</p>
                      <p className="text-sm text-gray-600">{doctor.Email}</p>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No doctors found</p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;