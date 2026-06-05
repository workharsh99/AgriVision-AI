import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext.jsx';
import { LanguageContext } from '../context/LanguageContext.jsx';
import API from '../services/api.js';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
import { 
  FileText, Activity, AlertTriangle, CheckCircle, 
  Calendar, CloudSun, RefreshCw, ArrowRight, TrendingUp, Scale, MapPin
} from 'lucide-react';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const { t } = useContext(LanguageContext);
  const [history, setHistory] = useState([]);
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = async () => {
    try {
      const historyRes = await API.get('/analysis/history');
      setHistory(historyRes.data);

      const weatherRes = await API.get(`/weather?location=${encodeURIComponent(user?.location || '')}`);
      setWeather(weatherRes.data);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);

  const handleRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  // 1. Calculations for Statistics
  const totalScans = history.length;
  const distinctCrops = [...new Set(history.map(item => item.cropName.toLowerCase()))].length;
  const healthyCropsCount = history.filter(item => item.disease.toLowerCase().includes('healthy')).length;
  const diseasedCropsCount = totalScans - healthyCropsCount;

  // Farm Productivity Score: Ratio of healthy crops to total scans, weighted
  // If zero scans, start with a baseline score of 85 (based on location/size)
  const baseScore = totalScans === 0 ? 85 : Math.round((healthyCropsCount / totalScans) * 100);
  const productivityScore = Math.min(100, Math.max(0, baseScore));

  // Determine score color/label
  let scoreColor = 'text-amber-500';
  let scoreBg = 'bg-amber-100 dark:bg-amber-950/20';
  let scoreMessage = 'Fair. Practice crop rotation and monitor leaves weekly.';
  if (productivityScore >= 90) {
    scoreColor = 'text-emerald-600 dark:text-leaf';
    scoreBg = 'bg-emerald-100 dark:bg-emerald-950/20';
    scoreMessage = 'Excellent! Your crops are highly resistant. Keep up organic soil composting.';
  } else if (productivityScore < 60) {
    scoreColor = 'text-rose-600';
    scoreBg = 'bg-rose-100 dark:bg-rose-950/20';
    scoreMessage = 'Alert. High disease occurrence. Schedule immediate bio-pesticide sprays.';
  }

  // 2. Chart Configurations
  const doughnutData = {
    labels: [t('healthyCrops'), t('diseasedCrops')],
    datasets: [
      {
        data: [healthyCropsCount || 1, diseasedCropsCount || 0], // fallback 1, 0 for empty states representation
        backgroundColor: ['#44ac5c', '#ef4444'],
        hoverBackgroundColor: ['#2c8541', '#b91c1c'],
        borderWidth: 1,
      },
    ],
  };

  // Group crop scans for frequency bar chart
  const cropCounts = {};
  history.forEach(item => {
    const crop = item.cropName;
    cropCounts[crop] = (cropCounts[crop] || 0) + 1;
  });

  const barLabels = Object.keys(cropCounts).length > 0 ? Object.keys(cropCounts) : ['Tomato', 'Rice', 'Wheat'];
  const barValues = Object.keys(cropCounts).length > 0 ? Object.values(cropCounts) : [0, 0, 0];

  const barData = {
    labels: barLabels,
    datasets: [
      {
        label: 'Scans',
        data: barValues,
        backgroundColor: '#346856',
        borderRadius: 6,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: 'rgb(100, 116, 139)',
          boxWidth: 12
        }
      }
    }
  };

  // 3. Crop Calendar Suggestions based on user preferred Crops or default crops
  const userCrops = user?.preferredCrops?.length ? user.preferredCrops : ['Tomato', 'Wheat', 'Rice'];
  const calendarDatabase = {
    tomato: { sowing: 'Feb - April', harvest: 'June - Aug', fertilizer: 'NPK 10-10-10 on week 4', watering: 'Moderate base' },
    wheat: { sowing: 'Oct - Dec', harvest: 'March - May', fertilizer: 'Nitrogen Urea top-dress', watering: 'Critical at crown-root initiation' },
    rice: { sowing: 'June - July', harvest: 'Oct - Dec', fertilizer: 'Zinc sulfate basal dose', watering: '2-5cm standing water' },
    potato: { sowing: 'Oct - Nov', harvest: 'Feb - March', fertilizer: 'Potassium-rich side dress', watering: 'Regular furrow' },
    corn: { sowing: 'April - May', harvest: 'Aug - Sept', fertilizer: 'Side-dress urea at knee height', watering: 'Regular during silking' }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 bg-slate-50 dark:bg-slate-950 transition-colors duration-200">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-950 dark:text-white">
            {t('navDashboard')}
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 flex items-center">
            <MapPin className="h-3.5 w-3.5 mr-1 text-forest dark:text-leaf" />
            {user?.location || 'Farming Zone'} • {user?.farmSize || 0} {t('farmSize')}
          </p>
        </div>
        <button
          onClick={handleRefresh}
          className="mt-4 sm:mt-0 flex items-center justify-center space-x-1.5 self-start rounded-xl bg-white px-4 py-2 text-sm font-semibold border border-slate-200 text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 shadow-sm"
        >
          <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
          <span>Sync Farm Data</span>
        </button>
      </div>

      {loading ? (
        /* Skeletons */
        <div className="space-y-8 animate-pulse">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-28 rounded-2xl bg-white dark:bg-slate-900"></div>
            ))}
          </div>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="h-64 rounded-2xl bg-white dark:bg-slate-900 lg:col-span-2"></div>
            <div className="h-64 rounded-2xl bg-white dark:bg-slate-900"></div>
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          {/* 4 Cards Stats */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            
            {/* Total Reports */}
            <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    {t('totalScans')}
                  </p>
                  <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-2">
                    {totalScans}
                  </h3>
                </div>
                <div className="rounded-xl bg-forest/10 p-3 text-forest dark:bg-leaf/10 dark:text-leaf">
                  <FileText className="h-6 w-6" />
                </div>
              </div>
            </div>

            {/* Distinct Crops */}
            <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    {t('cropsAnalyzed')}
                  </p>
                  <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-2">
                    {distinctCrops}
                  </h3>
                </div>
                <div className="rounded-xl bg-forest/10 p-3 text-forest dark:bg-leaf/10 dark:text-leaf">
                  <Activity className="h-6 w-6" />
                </div>
              </div>
            </div>

            {/* Healthy Crops */}
            <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    {t('healthyCrops')}
                  </p>
                  <h3 className="text-2xl font-extrabold text-emerald-600 dark:text-leaf mt-2">
                    {healthyCropsCount}
                  </h3>
                </div>
                <div className="rounded-xl bg-emerald-100/50 p-3 text-emerald-600 dark:bg-emerald-950/40 dark:text-leaf">
                  <CheckCircle className="h-6 w-6" />
                </div>
              </div>
            </div>

            {/* Diseased Crops */}
            <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    {t('diseasedCrops')}
                  </p>
                  <h3 className="text-2xl font-extrabold text-red-600 mt-2">
                    {diseasedCropsCount}
                  </h3>
                </div>
                <div className="rounded-xl bg-red-100 p-3 text-red-600 dark:bg-red-950/40 dark:text-red-400">
                  <AlertTriangle className="h-6 w-6" />
                </div>
              </div>
            </div>

          </div>

          {/* Productivity Gauge & Weather alerts */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            
            {/* Farm Productivity Score */}
            <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 flex flex-col justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center">
                  <TrendingUp className="h-5 w-5 mr-1.5 text-forest dark:text-leaf" />
                  {t('productivityScore')}
                </h3>
                <p className="text-xs text-slate-400 mt-1">Calculated crop pathology health status</p>
              </div>

              <div className="my-6 flex items-center justify-center space-x-6">
                <div className={`flex h-24 w-24 items-center justify-center rounded-full border-8 border-transparent text-2xl font-extrabold shadow-inner ${scoreBg} ${scoreColor}`}>
                  {productivityScore}%
                </div>
                <div className="flex-1">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">Rating</span>
                  <span className={`text-base font-extrabold ${scoreColor}`}>
                    {productivityScore >= 90 ? 'Healthy Farm' : productivityScore >= 60 ? 'Standard/Vulnerable' : 'High Risk Area'}
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-500 dark:text-slate-400 border-t border-slate-100 pt-4 dark:border-slate-800">
                {scoreMessage}
              </p>
            </div>

            {/* Weather alerts */}
            <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 lg:col-span-2 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center">
                    <CloudSun className="h-5 w-5 mr-1.5 text-forest dark:text-leaf" />
                    {t('weatherAlerts')}
                  </h3>
                  <span className="text-xs text-slate-400">Current Forecast</span>
                </div>
                {weather && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4 bg-slate-50/60 p-4 rounded-xl dark:bg-slate-950/20">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase tracking-wider">Temperature</span>
                      <span className="block text-lg font-bold mt-1 text-slate-800 dark:text-white">{weather.temperature}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase tracking-wider">Humidity</span>
                      <span className="block text-lg font-bold mt-1 text-slate-800 dark:text-white">{weather.humidity}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase tracking-wider">Precipitation</span>
                      <span className="block text-lg font-bold mt-1 text-slate-800 dark:text-white">{weather.precipitationChance}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase tracking-wider">Wind Speed</span>
                      <span className="block text-lg font-bold mt-1 text-slate-800 dark:text-white">{weather.windSpeed}</span>
                    </div>
                  </div>
                )}
              </div>

              {weather?.alert && (
                <div className="mt-4 rounded-xl bg-amber-50 p-4 border-l-4 border-amber-500 dark:bg-amber-950/10 text-xs text-amber-800 dark:text-amber-400 leading-relaxed font-semibold">
                  {weather.alert}
                </div>
              )}
            </div>

          </div>

          {/* Charts (Healthy/Diseased doughnut + Frequency chart) */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 lg:col-span-2">
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4">Crop Analysis Frequencies</h3>
              <div className="h-64">
                {totalScans === 0 ? (
                  <div className="flex h-full items-center justify-center text-sm text-slate-400">No crop scan history logged.</div>
                ) : (
                  <Bar data={barData} options={chartOptions} />
                )}
              </div>
            </div>

            <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4">Crop Health Distribution</h3>
              <div className="h-64">
                {totalScans === 0 ? (
                  <div className="flex h-full items-center justify-center text-sm text-slate-400">No scans to chart health distribution.</div>
                ) : (
                  <Doughnut data={doughnutData} options={chartOptions} />
                )}
              </div>
            </div>
          </div>

          {/* Main workspace splits: Recent scans list + Crop Calendar */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            
            {/* Recent Uploads */}
            <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 lg:col-span-2 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2 dark:border-slate-800">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">{t('recentScans')}</h3>
                <Link to="/reports" className="text-xs font-semibold text-forest hover:text-leaf dark:text-leaf flex items-center">
                  View Full History <ArrowRight className="ml-1 h-3 w-3" />
                </Link>
              </div>

              {history.length === 0 ? (
                <div className="py-12 text-center text-sm text-slate-400">
                  You haven't scanned any crops yet. Make your first upload to test AgriVision AI!
                  <div className="mt-4">
                    <Link to="/upload" className="rounded-xl bg-forest px-4 py-2 text-xs font-bold text-white shadow hover:bg-forest-dark">
                      {t('navUpload')}
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {history.slice(0, 3).map((item) => (
                    <div 
                      key={item._id} 
                      className="flex items-center justify-between p-3 rounded-xl bg-slate-50/50 dark:bg-slate-950/20 border border-slate-100 dark:border-slate-800/80"
                    >
                      <div className="flex items-center space-x-3">
                        <img 
                          src={item.imageUrl} 
                          alt={item.cropName} 
                          className="h-12 w-12 rounded-lg object-cover border border-slate-200 dark:border-slate-800" 
                        />
                        <div>
                          <h4 className="text-sm font-bold text-slate-950 dark:text-white">{item.cropName}</h4>
                          <span className={`text-xs ${item.disease.toLowerCase().includes('healthy') ? 'text-emerald-600' : 'text-red-500 font-medium'}`}>
                            {item.disease}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3">
                        <span className={`rounded px-2 py-0.5 text-[10px] font-bold ${
                          item.severity === 'High' ? 'bg-red-100 text-red-700 dark:bg-red-950/30' : item.severity === 'Medium' ? 'bg-orange-100 text-orange-700 dark:bg-orange-950/30' : 'bg-green-100 text-green-700 dark:bg-green-950/30'
                        }`}>
                          {item.severity}
                        </span>
                        <Link 
                          to={`/reports?id=${item._id}`} 
                          className="text-xs font-bold text-forest hover:underline dark:text-leaf"
                        >
                          View Details
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Crop Calendar */}
            <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-4">
              <div className="flex items-center space-x-1.5 border-b border-slate-100 pb-2 dark:border-slate-800">
                <Calendar className="h-5 w-5 text-forest dark:text-leaf" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">{t('cropCalendar')}</h3>
              </div>
              <p className="text-[11px] text-slate-400">Timelines tailored to your farm preferences</p>

              <div className="space-y-4">
                {userCrops.map(crop => {
                  const details = calendarDatabase[crop.toLowerCase()];
                  if (!details) return null;

                  return (
                    <div key={crop} className="p-3 bg-slate-50 dark:bg-slate-950/30 rounded-xl space-y-2 border border-slate-100 dark:border-slate-800/80">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-950 dark:text-white capitalize">{crop}</span>
                        <span className="text-[9px] bg-forest/10 px-2 py-0.5 rounded text-forest font-semibold dark:text-leaf">Active</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-500">
                        <div>
                          <span className="text-slate-400 font-semibold block">{t('plantSowing')}</span>
                          <span className="font-bold text-slate-700 dark:text-slate-300">{details.sowing}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 font-semibold block">{t('plantHarvesting')}</span>
                          <span className="font-bold text-slate-700 dark:text-slate-300">{details.harvest}</span>
                        </div>
                      </div>
                      <div className="border-t border-slate-200/50 pt-2 dark:border-slate-800">
                        <span className="text-[9px] text-slate-400 block font-semibold">Fertilizer Tip</span>
                        <span className="text-[9.5px] font-medium text-slate-600 dark:text-slate-400">{details.fertilizer}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
