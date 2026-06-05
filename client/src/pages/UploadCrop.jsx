import React, { useState, useCallback, useContext } from 'react';
import { useDropzone } from 'react-dropzone';
import { AuthContext } from '../context/AuthContext.jsx';
import { LanguageContext } from '../context/LanguageContext.jsx';
import API from '../services/api.js';
import { 
  Upload, Camera, RefreshCw, AlertCircle, 
  CheckCircle2, XCircle, Info, ShieldAlert, Droplets, FlaskConical, CloudRain, Lightbulb 
} from 'lucide-react';

const UploadCrop = () => {
  const { user } = useContext(AuthContext);
  const { t } = useContext(LanguageContext);
  const [image, setImage] = useState(null);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);

  const onDrop = useCallback((acceptedFiles) => {
    setError('');
    const selectedFile = acceptedFiles[0];
    if (selectedFile) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onload = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(selectedFile);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpeg', '.jpg', '.png', '.webp'] },
    multiple: false
  });

  const handleUploadSubmit = async () => {
    if (!file) {
      setError('Please select or capture a crop leaf image first.');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    const formData = new FormData();
    formData.append('image', file);

    try {
      const res = await API.post('/analysis/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setResult(res.data);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Error occurred while detecting disease.');
    } finally {
      setLoading(false);
    }
  };

  const resetUpload = () => {
    setImage(null);
    setFile(null);
    setResult(null);
    setError('');
  };



  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 bg-slate-50 dark:bg-slate-950 transition-colors duration-200">
      
      {/* Title */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <h1 className="text-3xl font-extrabold text-slate-950 dark:text-white sm:text-4xl">
          {t('navUpload')}
        </h1>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          Upload or capture a leaf photo. AgriVision AI will identify the crop disease and generate smart fertilizer/irrigation checklists.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Upload panel (1/3 width or 3/3 on mobile) */}
        <div className="space-y-6 lg:col-span-1">
          <div className="rounded-2xl bg-white p-6 shadow-md border border-slate-100 dark:bg-slate-900 dark:border-slate-800">
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4">Crop Photo Intake</h3>
            
            {/* Dropzone area */}
            {!image ? (
              <div 
                {...getRootProps()} 
                className={`flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
                  isDragActive 
                    ? 'border-forest bg-forest/5 dark:border-leaf dark:bg-leaf/5' 
                    : 'border-slate-200 bg-slate-50 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-950/20 dark:hover:bg-slate-950/40'
                }`}
              >
                <input {...getInputProps()} />
                <Upload className="h-10 w-10 text-slate-400 mb-4 animate-bounce" />
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  {t('dragDropText')}
                </p>
                <p className="text-xs text-slate-400 mt-2">
                  {t('supportedFormats')}
                </p>
              </div>
            ) : (
              <div className="relative rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
                <img 
                  src={image} 
                  alt="Crop Preview" 
                  className="w-full h-56 object-cover" 
                />
                <button 
                  onClick={resetUpload}
                  disabled={loading}
                  className="absolute top-2 right-2 rounded-full bg-slate-900/60 p-1.5 text-white hover:bg-slate-900 transition"
                  title="Remove image"
                >
                  <XCircle className="h-5 w-5" />
                </button>
              </div>
            )}

            {/* Mobile native Camera input capture shortcut */}
            <div className="mt-4 flex items-center justify-between text-xs text-slate-400">
              <span>Or record directly on phone:</span>
              <label className="flex items-center space-x-1 cursor-pointer font-bold text-forest hover:text-leaf dark:text-leaf">
                <Camera className="h-4 w-4" />
                <span>Snap Camera</span>
                <input 
                  type="file" 
                  accept="image/*" 
                  capture="environment" 
                  onChange={(e) => {
                    const selectedFile = e.target.files[0];
                    if (selectedFile) {
                      setFile(selectedFile);
                      const reader = new FileReader();
                      reader.onload = () => setImage(reader.result);
                      reader.readAsDataURL(selectedFile);
                    }
                  }} 
                  className="hidden" 
                />
              </label>
            </div>

            {error && (
              <div className="flex items-start space-x-2 rounded-lg bg-red-50 p-3 text-xs text-red-700 dark:bg-red-950/20 dark:text-red-400 mt-4">
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {/* Upload Button */}
            {image && !result && (
              <button
                onClick={handleUploadSubmit}
                disabled={loading}
                className="w-full mt-6 flex items-center justify-center space-x-2 rounded-xl bg-forest py-3 px-4 text-sm font-semibold text-white shadow hover:bg-forest-dark transition disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    <span>Analyzing Leaf...</span>
                  </>
                ) : (
                  <span>Submit Diagnostic Scan</span>
                )}
              </button>
            )}

            {result && (
              <button
                onClick={resetUpload}
                className="w-full mt-6 rounded-xl border border-slate-200 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800 transition"
              >
                Scan Another Crop
              </button>
            )}

          </div>
        </div>

        {/* Results / Skeleton section (2/3 width) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Diagnostic Loading Skeleton state */}
          {loading && (
            <div className="rounded-2xl bg-white p-6 shadow-md border border-slate-100 dark:bg-slate-900 dark:border-slate-800 space-y-6 animate-pulse">
              <div className="flex justify-between items-center pb-4 border-b border-slate-100 dark:border-slate-800">
                <div className="h-6 w-32 bg-slate-200 dark:bg-slate-800 rounded"></div>
                <div className="h-6 w-20 bg-slate-200 dark:bg-slate-800 rounded"></div>
              </div>
              <div className="space-y-3">
                <div className="h-4 w-full bg-slate-200 dark:bg-slate-800 rounded"></div>
                <div className="h-4 w-5/6 bg-slate-200 dark:bg-slate-800 rounded"></div>
                <div className="h-4 w-4/6 bg-slate-200 dark:bg-slate-800 rounded"></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="h-32 bg-slate-200 dark:bg-slate-800 rounded-xl"></div>
                <div className="h-32 bg-slate-200 dark:bg-slate-800 rounded-xl"></div>
              </div>
            </div>
          )}

          {/* Idle/Empty State */}
          {!loading && !result && (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-white/50 p-12 text-center shadow-inner dark:border-slate-800 dark:bg-slate-900/30 flex flex-col items-center justify-center min-h-[350px]">
              <Info className="h-10 w-10 text-slate-300 dark:text-slate-700 mb-4" />
              <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">Awaiting Crop Upload</h3>
              <p className="text-xs text-slate-400 max-w-sm mt-2">
                Select your crop leaf photo from the left sidebar and trigger a scan to load your pathology results.
              </p>
            </div>
          )}

          {/* Diagnosis results success display */}
          {!loading && result && (
            <div className="space-y-6">
              
              {/* Highlight Banner */}
              <div className="rounded-2xl bg-white p-6 shadow-md border border-slate-100 dark:bg-slate-900 dark:border-slate-800">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
                  <div>
                    <h2 className="text-xl font-extrabold text-slate-950 dark:text-white capitalize">
                      {result.cropName} Diagnostics
                    </h2>
                    <p className="text-xs text-slate-400 mt-1">Confirmed pathological analysis</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                  {/* Diagnosis Column */}
                  <div className="md:col-span-2 space-y-4">
                    <div>
                      <span className="text-xs font-semibold text-slate-400 block uppercase tracking-wider">Detected Condition</span>
                      <span className="text-lg font-bold text-red-600 dark:text-red-500">{result.disease}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-xs font-semibold text-slate-400 block uppercase tracking-wider">{t('severity')}</span>
                        <span className={`inline-block rounded px-2.5 py-0.5 text-xs font-bold mt-1 ${
                          result.severity === 'High' ? 'bg-red-100 text-red-700 dark:bg-red-950/30' : result.severity === 'Medium' ? 'bg-orange-100 text-orange-700 dark:bg-orange-950/30' : 'bg-green-100 text-green-700 dark:bg-green-950/30'
                        }`}>
                          {result.severity}
                        </span>
                      </div>
                      <div>
                        <span className="text-xs font-semibold text-slate-400 block uppercase tracking-wider">{t('confidence')}</span>
                        <span className="text-sm font-bold text-slate-800 dark:text-slate-200 block mt-1">{result.confidence}</span>
                      </div>
                    </div>
                  </div>

                  {/* Sidebar stats or image snippet */}
                  <div className="rounded-xl overflow-hidden border border-slate-100 dark:border-slate-800">
                    <img src={result.imageUrl} alt="diagnosed-leaf" className="w-full h-32 object-cover" />
                  </div>
                </div>
              </div>

              {/* Technical Pathology breakdown: Symptoms, causes, treatment */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Symptoms & Causes */}
                <div className="rounded-2xl bg-white p-6 shadow-md border border-slate-100 dark:bg-slate-900 dark:border-slate-800 space-y-4">
                  <h3 className="text-sm font-bold text-forest uppercase tracking-wider dark:text-leaf flex items-center">
                    <ShieldAlert className="h-4.5 w-4.5 mr-1.5" />
                    Pathology Analysis
                  </h3>
                  <div>
                    <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300">Observed Symptoms:</h4>
                    <ul className="list-disc pl-4 mt-2 text-xs space-y-1.5 text-slate-600 dark:text-slate-400">
                      {result.symptoms.map((s, i) => <li key={i}>{s}</li>)}
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300">Probable Causes:</h4>
                    <ul className="list-disc pl-4 mt-2 text-xs space-y-1.5 text-slate-600 dark:text-slate-400">
                      {result.causes.map((c, i) => <li key={i}>{c}</li>)}
                    </ul>
                  </div>
                </div>

                {/* Treatment & Prevention */}
                <div className="rounded-2xl bg-white p-6 shadow-md border border-slate-100 dark:bg-slate-900 dark:border-slate-800 space-y-4">
                  <h3 className="text-sm font-bold text-forest uppercase tracking-wider dark:text-leaf flex items-center">
                    <FlaskConical className="h-4.5 w-4.5 mr-1.5" />
                    Corrective Care
                  </h3>
                  <div>
                    <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300">{t('treatment')}:</h4>
                    <ul className="list-disc pl-4 mt-2 text-xs space-y-1.5 text-slate-600 dark:text-slate-400 font-semibold text-emerald-700 dark:text-leaf">
                      {result.treatment.map((t, i) => <li key={i}>{t}</li>)}
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300">{t('prevention')}:</h4>
                    <ul className="list-disc pl-4 mt-2 text-xs space-y-1.5 text-slate-600 dark:text-slate-400">
                      {result.prevention.map((p, i) => <li key={i}>{p}</li>)}
                    </ul>
                  </div>
                </div>

              </div>

              {/* Recommendations segment: Fertilizers, Irrigation, Pest Control */}
              <div className="rounded-2xl bg-white p-6 shadow-md border border-slate-100 dark:bg-slate-900 dark:border-slate-800">
                <h3 className="text-sm font-bold text-forest uppercase tracking-wider dark:text-leaf mb-6">
                  Gemini Smart Recommendation Engine
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  
                  {/* Fertilizers */}
                  <div className="space-y-4">
                    <div className="flex items-center space-x-1.5">
                      <FlaskConical className="h-5 w-5 text-forest dark:text-leaf" />
                      <h4 className="text-sm font-bold text-slate-950 dark:text-white">Fertilization</h4>
                    </div>
                    <div className="text-xs space-y-2 text-slate-600 dark:text-slate-400">
                      <p><strong>Organic:</strong> {(result.recommendations?.fertilizers?.organic || []).join(', ') || 'Compost'}</p>
                      <p><strong>Chemical:</strong> {(result.recommendations?.fertilizers?.chemical || []).join(', ') || 'Balanced NPK'}</p>
                      <p><strong>Dosage:</strong> {result.recommendations?.fertilizers?.dosage || 'Basal application'}</p>
                    </div>
                  </div>

                  {/* Irrigation */}
                  <div className="space-y-4">
                    <div className="flex items-center space-x-1.5">
                      <Droplets className="h-5 w-5 text-forest dark:text-leaf" />
                      <h4 className="text-sm font-bold text-slate-950 dark:text-white">Irrigation</h4>
                    </div>
                    <div className="text-xs space-y-2 text-slate-600 dark:text-slate-400">
                      <p><strong>Water Quantity:</strong> {result.recommendations?.irrigation?.waterQuantity || 'Saturation'}</p>
                      <p><strong>Frequency:</strong> {result.recommendations?.irrigation?.waterFrequency || 'As needed'}</p>
                    </div>
                  </div>

                  {/* Pest Control & Yield */}
                  <div className="space-y-4">
                    <div className="flex items-center space-x-1.5">
                      <Lightbulb className="h-5 w-5 text-forest dark:text-leaf" />
                      <h4 className="text-sm font-bold text-slate-950 dark:text-white">Pests & Yield Tips</h4>
                    </div>
                    <div className="text-xs space-y-2 text-slate-600 dark:text-slate-400">
                      <p><strong>Pesticide alternative:</strong> {(result.recommendations?.pestControl?.organicAlternatives || []).join(', ') || 'Neem oil'}</p>
                      <p><strong>Soil Tip:</strong> {result.recommendations?.yieldTips?.soilManagement || 'Maintain pH'}</p>
                      <p><strong>Rotation:</strong> {result.recommendations?.yieldTips?.cropRotation || 'Rotate crops'}</p>
                    </div>
                  </div>

                </div>

                {/* Weather alerts precaution */}
                {result.recommendations?.weatherPrecautions && (
                  <div className="mt-6 border-t border-slate-100 pt-4 dark:border-slate-800 space-y-2">
                    <span className="text-xs font-bold text-forest dark:text-leaf uppercase tracking-wider flex items-center">
                      <CloudRain className="h-4 w-4 mr-1.5" />
                      Pathologist Weather Precautions
                    </span>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-950/20 p-3 rounded-lg">
                      <p><strong>Rain Risk:</strong> {result.recommendations.weatherPrecautions.rainfallAlerts}</p>
                      <p><strong>Temp Risk:</strong> {result.recommendations.weatherPrecautions.temperatureRisks}</p>
                      <p><strong>Humidity Risk:</strong> {result.recommendations.weatherPrecautions.humidityRisks}</p>
                    </div>
                  </div>
                )}
              </div>



            </div>
          )}

        </div>

      </div>

    </div>
  );
};

export default UploadCrop;
