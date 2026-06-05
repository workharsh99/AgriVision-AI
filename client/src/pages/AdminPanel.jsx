import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext.jsx';
import { LanguageContext } from '../context/LanguageContext.jsx';
import API from '../services/api.js';
import { 
  Users, AlertTriangle, ShieldCheck, 
  Trash2, Mail, MapPin, Scale, RefreshCw, Trash, UserCheck
} from 'lucide-react';

const AdminPanel = () => {
  const { user } = useContext(AuthContext);
  const { t } = useContext(LanguageContext);
  
  const [users, setUsers] = useState([]);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  
  const [activeTab, setActiveTab] = useState('users'); // users, reports

  const loadAdminData = async () => {
    try {
      const usersRes = await API.get('/admin/users');
      setUsers(usersRes.data);

      const reportsRes = await API.get('/admin/reports');
      setReports(reportsRes.data);
    } catch (err) {
      console.error('Error loading admin panel data:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (user && user.role === 'admin') {
      loadAdminData();
    }
  }, [user]);

  const handleRefresh = () => {
    setRefreshing(true);
    loadAdminData();
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('WARNING: Are you absolutely sure you want to delete this user? This will erase their user credentials, farm details, historic scans, and generated PDF reports permanently.')) {
      try {
        await API.delete(`/admin/users/${userId}`);
        loadAdminData();
      } catch (err) {
        alert(err.response?.data?.message || 'Error occurred while deleting user.');
      }
    }
  };

  const handleDeleteReport = async (reportId) => {
    if (window.confirm('Are you sure you want to delete this crop pathology report?')) {
      try {
        await API.delete(`/admin/reports/${reportId}`);
        loadAdminData();
      } catch (err) {
        alert(err.response?.data?.message || 'Error occurred while deleting report.');
      }
    }
  };



  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 bg-slate-50 dark:bg-slate-950 transition-colors duration-200">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 pb-4 dark:border-slate-800 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-950 dark:text-white flex items-center">
            <UserCheck className="h-8 w-8 mr-2 text-forest dark:text-leaf" />
            System Administration
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Global monitoring of users, historic disease outbreaks, and aggregated report registries.
          </p>
        </div>
        <button
          onClick={handleRefresh}
          className="mt-4 sm:mt-0 flex items-center justify-center space-x-1.5 self-start rounded-xl bg-white px-4 py-2 text-sm font-semibold border border-slate-200 text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 shadow-sm"
        >
          <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
          <span>Refresh Console</span>
        </button>
      </div>

      {/* Tabs selectors */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 gap-4 mb-6">
        <button
          onClick={() => setActiveTab('users')}
          className={`pb-3 text-sm font-bold border-b-2 transition-all ${
            activeTab === 'users' 
              ? 'border-forest text-forest dark:border-leaf dark:text-leaf' 
              : 'border-transparent text-slate-400 hover:text-slate-600'
          }`}
        >
          User Registry ({users.length})
        </button>
        <button
          onClick={() => setActiveTab('reports')}
          className={`pb-3 text-sm font-bold border-b-2 transition-all ${
            activeTab === 'reports' 
              ? 'border-forest text-forest dark:border-leaf dark:text-leaf' 
              : 'border-transparent text-slate-400 hover:text-slate-600'
          }`}
        >
          Scan Registry ({reports.length})
        </button>
      </div>

      {loading ? (
        <div className="space-y-6 animate-pulse">
          <div className="grid grid-cols-3 gap-4 h-24">
            <div className="bg-white rounded-xl dark:bg-slate-900"></div>
            <div className="bg-white rounded-xl dark:bg-slate-900"></div>
            <div className="bg-white rounded-xl dark:bg-slate-900"></div>
          </div>
          <div className="h-96 bg-white rounded-xl dark:bg-slate-900"></div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* TAB 2: USERS REGISTRY */}
          {activeTab === 'users' && (
            <div className="rounded-2xl bg-white shadow-md border border-slate-100 dark:bg-slate-900 dark:border-slate-800 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-slate-950 border-b border-slate-100 dark:border-slate-800 text-slate-400 font-bold">
                      <th className="p-4">Farmer Name</th>
                      <th className="p-4">Email</th>
                      <th className="p-4">Location</th>
                      <th className="p-4">Farm Size</th>
                      <th className="p-4 text-center">Admin Access</th>
                      <th className="p-4 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                    {users.map(u => (
                      <tr key={u._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-950/20">
                        <td className="p-4 font-bold text-slate-900 dark:text-white">{u.name}</td>
                        <td className="p-4">{u.email}</td>
                        <td className="p-4">
                          <span className="flex items-center">
                            <MapPin className="h-3 w-3 mr-1 text-slate-400" /> {u.location}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className="flex items-center">
                            <Scale className="h-3.5 w-3.5 mr-1 text-slate-400" /> {u.farmSize} Acres
                          </span>
                        </td>
                        <td className="p-4 text-center">
                          <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                            u.role === 'admin' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40' : 'bg-slate-100 text-slate-400 dark:bg-slate-800'
                          }`}>
                            {u.role === 'admin' ? 'Authorized' : 'Farmer'}
                          </span>
                        </td>
                        <td className="p-4 text-center">
                          <button
                            onClick={() => handleDeleteUser(u._id)}
                            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition"
                            title="Delete User and associated Scans"
                          >
                            <Trash2 className="h-4.5 w-4.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: REPORTS REGISTRY */}
          {activeTab === 'reports' && (
            <div className="rounded-2xl bg-white shadow-md border border-slate-100 dark:bg-slate-900 dark:border-slate-800 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-slate-950 border-b border-slate-100 dark:border-slate-800 text-slate-400 font-bold">
                      <th className="p-4">Crop Name</th>
                      <th className="p-4">Condition</th>
                      <th className="p-4">Farmer Profile</th>
                      <th className="p-4">Confidence</th>
                      <th className="p-4">Severity</th>
                      <th className="p-4">Scan Date</th>
                      <th className="p-4 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                    {reports.map(r => (
                      <tr key={r._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-950/20">
                        <td className="p-4 font-bold text-slate-900 dark:text-white capitalize">{r.cropName}</td>
                        <td className="p-4 font-semibold text-slate-900 dark:text-white">{r.disease}</td>
                        <td className="p-4">
                          <div className="flex flex-col">
                            <span className="font-semibold text-xs">{r.userId?.name || 'Deleted User'}</span>
                            <span className="text-[10px] text-slate-400">{r.userId?.email || ''}</span>
                          </div>
                        </td>
                        <td className="p-4 text-slate-500">{r.confidence}</td>
                        <td className="p-4">
                          <span className={`inline-block rounded px-2.5 py-0.5 text-[10px] font-bold ${
                            r.severity === 'High' ? 'bg-red-100 text-red-700 dark:bg-red-950/20' : r.severity === 'Medium' ? 'bg-orange-100 text-orange-700 dark:bg-orange-950/20' : 'bg-green-100 text-green-700 dark:bg-green-950/20'
                          }`}>
                            {r.severity}
                          </span>
                        </td>
                        <td className="p-4 text-xs text-slate-400">{new Date(r.createdAt).toLocaleDateString()}</td>
                        <td className="p-4 text-center">
                          <button
                            onClick={() => handleDeleteReport(r._id)}
                            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition"
                            title="Delete Report"
                          >
                            <Trash className="h-4.5 w-4.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>
      )}

    </div>
  );
};

export default AdminPanel;
