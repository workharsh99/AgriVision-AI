import React, { useState, useEffect, useContext } from 'react';
import { useSearchParams } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext.jsx';
import { LanguageContext } from '../context/LanguageContext.jsx';
import API from '../services/api.js';
import { generatePDFReport } from '../utils/pdfGenerator.js';
import { 
  Search, Calendar, Filter, FileText, FileDown, 
  Trash2, Mail, Phone, AlertCircle, CheckCircle2, ChevronRight, X
} from 'lucide-react';

const Reports = () => {
  const { user } = useContext(AuthContext);
  const { t } = useContext(LanguageContext);
  const [searchParams] = useSearchParams();
  const autoSelectId = searchParams.get('id');

  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState(null);

  // Filter States
  const [searchCrop, setSearchCrop] = useState('');
  const [searchDisease, setSearchDisease] = useState('');
  const [filterSeverity, setFilterSeverity] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Notifications Status inside viewer
  const [emailStatus, setEmailStatus] = useState('');
  const [smsStatus, setSmsStatus] = useState('');

  const fetchReports = async () => {
    setLoading(true);
    try {
      const params = {};
      if (searchCrop) params.crop = searchCrop;
      if (searchDisease) params.disease = searchDisease;
      if (filterSeverity) params.severity = filterSeverity;
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;

      const res = await API.get('/analysis/history', { params });
      setReports(res.data);

      // If redirected with an ID, auto-select it
      if (autoSelectId) {
        const matched = res.data.find(r => r._id === autoSelectId);
        if (matched) {
          setSelectedReport(matched);
        }
      }
    } catch (err) {
      console.error('Error fetching reports:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, [searchCrop, searchDisease, filterSeverity, startDate, endDate, autoSelectId]);

  // Download PDF
  const handleDownloadPDF = (report) => {
    const doc = generatePDFReport(user, report);
    doc.save(`AgriVision_${report.cropName}_Report.pdf`);
  };

  // Print PDF
  const handlePrintPDF = (report) => {
    const doc = generatePDFReport(user, report);
    const url = doc.output('bloburl');
    window.open(url, '_blank');
  };

  // Email Report
  const handleEmailReport = async (reportId) => {
    setEmailStatus('sending');
    try {
      await API.post(`/analysis/${reportId}/email`);
      setEmailStatus('success');
    } catch (err) {
      console.error(err);
      setEmailStatus('error');
    }
  };

  // SMS Report
  const handleSMSReport = async (reportId) => {
    setSmsStatus('sending');
    try {
      await API.post(`/analysis/${reportId}/sms`, { phone: '+1 (555) 019-2834' });
      setSmsStatus('success');
    } catch (err) {
      console.error(err);
      setSmsStatus('error');
    }
  };

  // Reset Filters
  const handleResetFilters = () => {
    setSearchCrop('');
    setSearchDisease('');
    setFilterSeverity('');
    setStartDate('');
    setEndDate('');
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 bg-slate-50 dark:bg-slate-950 transition-colors duration-200">
      
      {/* Title */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-950 dark:text-white">
          {t('navReports')}
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Review, filter, and download your previous crop diagnoses and PDF checklists.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Filters Sidebar (1/4 width) */}
        <div className="lg:col-span-1 space-y-6">
          <div className="rounded-2xl bg-white p-6 shadow-md border border-slate-100 dark:bg-slate-900 dark:border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-slate-950 dark:text-white flex items-center">
              <Filter className="h-4.5 w-4.5 mr-1.5 text-forest" />
              Filter Reports
            </h3>

            {/* Search Crop */}
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Crop Name</label>
              <div className="relative mt-1">
                <Search className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 h-5 w-5 text-slate-400" />
                <input
                  type="text"
                  value={searchCrop}
                  onChange={(e) => setSearchCrop(e.target.value)}
                  className="block w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-xs outline-none focus:border-forest focus:bg-white dark:border-slate-800 dark:bg-slate-850 dark:text-white"
                  placeholder="Tomato, Rice..."
                />
              </div>
            </div>

            {/* Search Disease */}
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Disease</label>
              <div className="relative mt-1">
                <Search className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 h-5 w-5 text-slate-400" />
                <input
                  type="text"
                  value={searchDisease}
                  onChange={(e) => setSearchDisease(e.target.value)}
                  className="block w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-xs outline-none focus:border-forest focus:bg-white dark:border-slate-800 dark:bg-slate-850 dark:text-white"
                  placeholder="Early Blight, Rust..."
                />
              </div>
            </div>

            {/* Severity filter */}
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Severity</label>
              <select
                value={filterSeverity}
                onChange={(e) => setFilterSeverity(e.target.value)}
                className="block w-full mt-1 rounded-xl border border-slate-200 bg-slate-50 py-2 px-3 text-xs outline-none focus:border-forest focus:bg-white dark:border-slate-800 dark:bg-slate-850 dark:text-white"
              >
                <option value="">All Severities</option>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>

            {/* Date Filters */}
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="block w-full mt-1 rounded-xl border border-slate-200 bg-slate-50 py-2 px-3 text-xs outline-none focus:border-forest dark:border-slate-800 dark:bg-slate-850 dark:text-white"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">End Date</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="block w-full mt-1 rounded-xl border border-slate-200 bg-slate-50 py-2 px-3 text-xs outline-none focus:border-forest dark:border-slate-800 dark:bg-slate-850 dark:text-white"
              />
            </div>

            <button
              onClick={handleResetFilters}
              className="w-full mt-4 rounded-xl border border-slate-200 py-2 text-xs font-bold text-slate-500 hover:bg-slate-50 dark:border-slate-850 dark:text-slate-400 dark:hover:bg-slate-850 transition"
            >
              Reset Filters
            </button>
          </div>
        </div>

        {/* History List (3/4 width) */}
        <div className="lg:col-span-3 space-y-4">
          
          {loading ? (
            <div className="space-y-4 animate-pulse">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-20 bg-white rounded-xl dark:bg-slate-900"></div>
              ))}
            </div>
          ) : reports.length === 0 ? (
            <div className="rounded-2xl bg-white p-12 text-center shadow-inner border border-slate-100 dark:bg-slate-900 dark:border-slate-800 flex flex-col items-center justify-center min-h-[300px]">
              <FileText className="h-10 w-10 text-slate-300 mb-4" />
              <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">No matching reports</h3>
              <p className="text-xs text-slate-400 max-w-sm mt-2">
                No analyses found matching your search. Try resetting the filters or submit a new crop scan.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {reports.map((report) => (
                <div 
                  key={report._id}
                  className="rounded-2xl bg-white p-4 shadow-sm border border-slate-100 hover:shadow-md dark:bg-slate-900 dark:border-slate-800 transition flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
                >
                  <div className="flex items-center space-x-4">
                    <img 
                      src={report.imageUrl} 
                      alt={report.cropName} 
                      className="h-16 w-16 rounded-xl object-cover border border-slate-200 dark:border-slate-800 shrink-0" 
                    />
                    <div>
                      <h3 className="text-base font-bold text-slate-900 dark:text-white capitalize">
                        {report.cropName}
                      </h3>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className={`text-xs ${report.disease.toLowerCase().includes('healthy') ? 'text-emerald-600' : 'text-red-500 font-semibold'}`}>
                          {report.disease}
                        </span>
                        <span className="text-[10px] text-slate-400">•</span>
                        <span className="text-[10px] text-slate-400">
                          {new Date(report.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-3 border-t border-slate-50 pt-3 sm:border-0 sm:pt-0">
                    <div className="flex items-center space-x-2">
                      <span className={`rounded px-2.5 py-0.5 text-[10px] font-bold ${
                        report.severity === 'High' ? 'bg-red-100 text-red-700 dark:bg-red-950/30' : report.severity === 'Medium' ? 'bg-orange-100 text-orange-700 dark:bg-orange-950/30' : 'bg-green-100 text-green-700 dark:bg-green-950/30'
                      }`}>
                        {report.severity}
                      </span>
                      <span className="text-xs text-slate-400">Score: {report.confidence}</span>
                    </div>

                    <button
                      onClick={() => {
                        setEmailStatus('');
                        setSmsStatus('');
                        setSelectedReport(report);
                      }}
                      className="flex items-center space-x-1 text-xs font-bold text-forest hover:text-leaf dark:text-leaf px-3 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                    >
                      <span>Details</span>
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>

      </div>

      {/* Expanded Report details Modal View */}
      {selectedReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[85vh] overflow-y-auto shadow-2xl border border-slate-100 dark:bg-slate-900 dark:border-slate-800 flex flex-col">
            
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between sticky top-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur z-10">
              <div>
                <h2 className="text-lg font-bold text-slate-950 dark:text-white capitalize">
                  {selectedReport.cropName} Pathology Log
                </h2>
                <span className="text-xs text-slate-400">Scanned on {new Date(selectedReport.createdAt).toLocaleString()}</span>
              </div>
              <button 
                onClick={() => setSelectedReport(null)}
                className="p-1 rounded-full text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
                <div className="md:col-span-2 space-y-3">
                  <div>
                    <span className="text-xs font-semibold text-slate-400 block uppercase">Detected Condition</span>
                    <span className="text-base font-extrabold text-red-600 dark:text-red-500">{selectedReport.disease}</span>
                  </div>

                  <div className="flex space-x-8">
                    <div>
                      <span className="text-xs font-semibold text-slate-400 block uppercase">Severity</span>
                      <span className={`inline-block rounded px-2.5 py-0.5 text-xs font-bold mt-1 ${
                        selectedReport.severity === 'High' ? 'bg-red-100 text-red-700' : selectedReport.severity === 'Medium' ? 'bg-orange-100 text-orange-700' : 'bg-green-100 text-green-700'
                      }`}>
                        {selectedReport.severity}
                      </span>
                    </div>
                    <div>
                      <span className="text-xs font-semibold text-slate-400 block uppercase">Confidence</span>
                      <span className="text-sm font-bold text-slate-800 dark:text-slate-200 block mt-1">{selectedReport.confidence}</span>
                    </div>
                  </div>
                </div>

                <div className="rounded-xl overflow-hidden border border-slate-100 dark:border-slate-800">
                  <img src={selectedReport.imageUrl} alt="crop-pathology-snapshot" className="w-full h-32 object-cover" />
                </div>
              </div>

              {/* Symptoms / Causes */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100 dark:border-slate-800">
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-forest dark:text-leaf uppercase tracking-wider">Symptoms Detected</h4>
                  <ul className="list-disc pl-4 text-xs space-y-1 text-slate-600 dark:text-slate-400">
                    {selectedReport.symptoms.map((s, i) => <li key={i}>{s}</li>)}
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-forest dark:text-leaf uppercase tracking-wider">Possible Biological Causes</h4>
                  <ul className="list-disc pl-4 text-xs space-y-1 text-slate-600 dark:text-slate-400">
                    {selectedReport.causes.map((c, i) => <li key={i}>{c}</li>)}
                  </ul>
                </div>
              </div>

              {/* Treatments & Prevention */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100 dark:border-slate-800">
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-forest dark:text-leaf uppercase tracking-wider">Immediate Treatment</h4>
                  <ul className="list-disc pl-4 text-xs space-y-1 text-slate-700 dark:text-emerald-400 font-semibold">
                    {selectedReport.treatment.map((t, i) => <li key={i}>{t}</li>)}
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-forest dark:text-leaf uppercase tracking-wider">Prevention Strategy</h4>
                  <ul className="list-disc pl-4 text-xs space-y-1 text-slate-600 dark:text-slate-400">
                    {selectedReport.prevention.map((p, i) => <li key={i}>{p}</li>)}
                  </ul>
                </div>
              </div>

              {/* Smart Recommendations */}
              <div className="p-4 bg-slate-50 dark:bg-slate-950/20 rounded-xl space-y-4 border border-slate-100 dark:border-slate-800">
                <h4 className="text-xs font-bold text-forest dark:text-leaf uppercase tracking-wider">Smart Recommendations Engine</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-slate-600 dark:text-slate-400">
                  <div>
                    <span className="font-bold block text-slate-700 dark:text-slate-300">Fertilizers:</span>
                    <p>Organic: {(selectedReport.recommendations?.fertilizers?.organic || []).join(', ')}</p>
                    <p>Chemical: {(selectedReport.recommendations?.fertilizers?.chemical || []).join(', ')}</p>
                    <p>Dosage: {selectedReport.recommendations?.fertilizers?.dosage}</p>
                  </div>
                  <div>
                    <span className="font-bold block text-slate-700 dark:text-slate-300">Irrigation:</span>
                    <p>Quantity: {selectedReport.recommendations?.irrigation?.waterQuantity}</p>
                    <p>Frequency: {selectedReport.recommendations?.irrigation?.waterFrequency}</p>
                  </div>
                  <div>
                    <span className="font-bold block text-slate-700 dark:text-slate-300">Pest Controls:</span>
                    <p>Pesticides: {(selectedReport.recommendations?.pestControl?.pesticides || []).join(', ')}</p>
                    <p>Biologicals: {(selectedReport.recommendations?.pestControl?.organicAlternatives || []).join(', ')}</p>
                  </div>
                </div>
              </div>

              {/* PDF & Alerts Action Center */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  onClick={() => handleDownloadPDF(selectedReport)}
                  className="flex items-center justify-center space-x-1.5 p-2.5 rounded-xl bg-forest text-white font-semibold text-xs hover:bg-forest-dark transition"
                >
                  <FileDown className="h-4 w-4" />
                  <span>Download PDF</span>
                </button>
                <button
                  onClick={() => handlePrintPDF(selectedReport)}
                  className="p-2.5 rounded-xl border border-slate-200 text-slate-700 font-semibold text-xs hover:bg-slate-50 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800 transition"
                >
                  Print PDF
                </button>
                <button
                  onClick={() => handleEmailReport(selectedReport._id)}
                  disabled={emailStatus === 'sending'}
                  className={`flex items-center justify-center space-x-1 p-2.5 rounded-xl border font-semibold text-xs transition ${
                    emailStatus === 'success' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <Mail className="h-4 w-4 shrink-0" />
                  <span>{emailStatus === 'success' ? 'Sent!' : emailStatus === 'sending' ? 'Sending...' : 'Email Report'}</span>
                </button>
                <button
                  onClick={() => handleSMSReport(selectedReport._id)}
                  disabled={smsStatus === 'sending'}
                  className={`flex items-center justify-center space-x-1 p-2.5 rounded-xl border font-semibold text-xs transition ${
                    smsStatus === 'success' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <Phone className="h-4 w-4 shrink-0" />
                  <span>{smsStatus === 'success' ? 'Sent!' : smsStatus === 'sending' ? 'Sending...' : 'SMS Alert'}</span>
                </button>
              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default Reports;
