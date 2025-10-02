import React, { useState } from 'react';
import { Calendar, MapPin, Phone, User, Check, Lock, Eye, EyeOff, Trash2, LogOut, Share2, Copy } from 'lucide-react';

export default function MassageAppointmentApp() {
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    location: '',
    date: '',
    time: ''
  });
  const [appointments, setAppointments] = useState([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [adminStoredPassword, setAdminStoredPassword] = useState('admin123');
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [showShareLink, setShowShareLink] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);

  const customerBookingLink = window.location.origin + window.location.pathname + '?booking=true';

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = () => {
    if (formData.name && formData.mobile && formData.location) {
      const newAppointment = {
        ...formData,
        id: Date.now(),
        bookedAt: new Date().toLocaleString('hi-IN'),
        status: 'नया'
      };
      
      setAppointments(prev => [...prev, newAppointment]);
      setShowSuccess(true);
      
      setFormData({
        name: '',
        mobile: '',
        location: '',
        date: '',
        time: ''
      });

      setTimeout(() => setShowSuccess(false), 3000);
    }
  };

  const handleAdminLogin = () => {
    if (adminPassword === adminStoredPassword) {
      setIsAdmin(true);
      setLoginError('');
      setAdminPassword('');
    } else {
      setLoginError('गलत पासवर्ड!');
    }
  };

  const handleChangePassword = () => {
    setPasswordError('');
    setPasswordSuccess(false);

    if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
      setPasswordError('सभी फील्ड भरना जरूरी है!');
      return;
    }

    if (passwordForm.currentPassword !== adminStoredPassword) {
      setPasswordError('पुराना पासवर्ड गलत है!');
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      setPasswordError('नया पासवर्ड कम से कम 6 अक्षर का होना चाहिए!');
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError('नया पासवर्ड और कन्फर्म पासवर्ड मेल नहीं खाते!');
      return;
    }

    setAdminStoredPassword(passwordForm.newPassword);
    setPasswordSuccess(true);
    setPasswordForm({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });

    setTimeout(() => {
      setShowChangePassword(false);
      setPasswordSuccess(false);
    }, 2000);
  };

  const copyLinkToClipboard = () => {
    navigator.clipboard.writeText(customerBookingLink).then(() => {
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2000);
    });
  };

  const shareViaWhatsApp = () => {
    const message = encodeURIComponent(`🌟 *Fulfil Your Needs - Massage Service* 🌟\n\nअपना अपॉइंटमेंट बुक करने के लिए इस लिंक पर क्लिक करें:\n${customerBookingLink}\n\n✅ सिंपल बुकिंग\n✅ घर पर सर्विस\n✅ प्रोफेशनल थेरेपिस्ट`);
    window.open(`https://wa.me/?text=${message}`, '_blank');
  };

  const handleAdminLogout = () => {
    setIsAdmin(false);
    setAdminPassword('');
    setShowChangePassword(false);
    setPasswordForm({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
  };

  const deleteAppointment = (id) => {
    if (window.confirm('क्या आप इस अपॉइंटमेंट को डिलीट करना चाहते हैं?')) {
      setAppointments(prev => prev.filter(apt => apt.id !== id));
    }
  };

  const updateStatus = (id, newStatus) => {
    setAppointments(prev => prev.map(apt => 
      apt.id === id ? { ...apt, status: newStatus } : apt
    ));
  };

  if (isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
        <div className="max-w-6xl mx-auto p-6">
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
                <Lock className="w-8 h-8 text-blue-600" />
                एडमिन पैनल
              </h1>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowShareLink(!showShareLink)}
                  className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
                >
                  <Share2 className="w-4 h-4" />
                  शेयर लिंक
                </button>
                <button
                  onClick={() => setShowChangePassword(!showChangePassword)}
                  className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
                >
                  <Lock className="w-4 h-4" />
                  पासवर्ड बदलें
                </button>
                <button
                  onClick={handleAdminLogout}
                  className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
                >
                  <LogOut className="w-4 h-4" />
                  लॉगआउट
                </button>
              </div>
            </div>

            {showShareLink && (
              <div className="bg-green-50 border-2 border-green-200 rounded-lg p-6 mb-6">
                <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <Share2 className="w-6 h-6 text-green-600" />
                  कस्टमर बुकिंग लिंक
                </h3>
                
                <p className="text-gray-700 mb-4">
                  यह लिंक अपने कस्टमर को भेजें जिससे वे अपॉइंटमेंट बुक कर सकें:
                </p>

                <div className="bg-white border-2 border-green-300 rounded-lg p-4 mb-4 flex items-center justify-between gap-3">
                  <code className="text-sm text-blue-600 break-all flex-1">
                    {customerBookingLink}
                  </code>
                  <button
                    onClick={copyLinkToClipboard}
                    className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition whitespace-nowrap"
                  >
                    <Copy className="w-4 h-4" />
                    {linkCopied ? 'कॉपी हो गया!' : 'कॉपी करें'}
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <button
                    onClick={shareViaWhatsApp}
                    className="flex items-center justify-center gap-2 bg-green-600 text-white font-bold py-3 rounded-lg hover:bg-green-700 transition"
                  >
                    <Share2 className="w-5 h-5" />
                    WhatsApp पर शेयर करें
                  </button>
                  <button
                    onClick={() => setShowShareLink(false)}
                    className="bg-gray-300 text-gray-700 font-bold py-3 rounded-lg hover:bg-gray-400 transition"
                  >
                    बंद करें
                  </button>
                </div>

                {linkCopied && (
                  <div className="mt-4 bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded-lg flex items-center gap-2">
                    <Check className="w-5 h-5" />
                    <span className="font-semibold">लिंक क्लिपबोर्ड में कॉपी हो गया!</span>
                  </div>
                )}
              </div>
            )}

            {showChangePassword && (
              <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6 mb-6">
                <h3 className="text-xl font-bold text-slate-900 mb-4">पासवर्ड बदलें</h3>
                
                {passwordSuccess && (
                  <div className="mb-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg flex items-center gap-2">
                    <Check className="w-5 h-5" />
                    <span className="font-semibold">पासवर्ड सफलतापूर्वक बदल गया!</span>
                  </div>
                )}

                {passwordError && (
                  <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
                    {passwordError}
                  </div>
                )}

                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">
                      पुराना पासवर्ड
                    </label>
                    <input
                      type="password"
                      value={passwordForm.currentPassword}
                      onChange={(e) => setPasswordForm({...passwordForm, currentPassword: e.target.value})}
                      placeholder="पुराना पासवर्ड डालें"
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">
                      नया पासवर्ड (कम से कम 6 अक्षर)
                    </label>
                    <input
                      type="password"
                      value={passwordForm.newPassword}
                      onChange={(e) => setPasswordForm({...passwordForm, newPassword: e.target.value})}
                      placeholder="नया पासवर्ड डालें"
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">
                      नया पासवर्ड कन्फर्म करें
                    </label>
                    <input
                      type="password"
                      value={passwordForm.confirmPassword}
                      onChange={(e) => setPasswordForm({...passwordForm, confirmPassword: e.target.value})}
                      placeholder="नया पासवर्ड दोबारा डालें"
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition"
                    />
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={handleChangePassword}
                      className="flex-1 bg-green-600 text-white font-bold py-3 rounded-lg hover:bg-green-700 transition"
                    >
                      पासवर्ड बदलें
                    </button>
                    <button
                      onClick={() => {
                        setShowChangePassword(false);
                        setPasswordForm({currentPassword: '', newPassword: '', confirmPassword: ''});
                        setPasswordError('');
                      }}
                      className="flex-1 bg-gray-300 text-gray-700 font-bold py-3 rounded-lg hover:bg-gray-400 transition"
                    >
                      कैंसल
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
              <p className="text-blue-900 font-semibold">
                कुल बुकिंग: {appointments.length}
              </p>
            </div>

            {appointments.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <Calendar className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p className="text-xl">अभी तक कोई बुकिंग नहीं है</p>
              </div>
            ) : (
              <div className="space-y-4">
                {appointments.map((apt, index) => (
                  <div
                    key={apt.id}
                    className="border-2 border-slate-200 rounded-lg p-6 hover:border-blue-400 transition bg-slate-50"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <span className="text-sm font-bold text-blue-600 bg-blue-100 px-3 py-1 rounded-full">
                          #{index + 1}
                        </span>
                        <h3 className="text-2xl font-bold text-slate-900 mt-2">{apt.name}</h3>
                      </div>
                      <div className="flex items-center gap-2">
                        <select
                          value={apt.status}
                          onChange={(e) => updateStatus(apt.id, e.target.value)}
                          className="px-3 py-2 border-2 border-slate-300 rounded-lg focus:outline-none focus:border-blue-500"
                        >
                          <option value="नया">नया</option>
                          <option value="कन्फर्म">कन्फर्म</option>
                          <option value="पूरा हुआ">पूरा हुआ</option>
                          <option value="कैंसल">कैंसल</option>
                        </select>
                        <button
                          onClick={() => deleteAppointment(apt.id)}
                          className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-slate-700">
                      <div className="space-y-3">
                        <p className="flex items-center gap-2">
                          <Phone className="w-5 h-5 text-blue-600" />
                          <span className="font-semibold">मोबाइल:</span>
                          <a href={`tel:${apt.mobile}`} className="text-blue-600 hover:underline">
                            {apt.mobile}
                          </a>
                        </p>
                        <p className="flex items-start gap-2">
                          <MapPin className="w-5 h-5 text-blue-600 mt-1" />
                          <span>
                            <span className="font-semibold">पता:</span> {apt.location}
                          </span>
                        </p>
                      </div>
                      <div className="space-y-3">
                        {apt.date && (
                          <p className="flex items-center gap-2">
                            <Calendar className="w-5 h-5 text-blue-600" />
                            <span className="font-semibold">तारीख:</span> {apt.date}
                            {apt.time && ` - ${apt.time}`}
                          </p>
                        )}
                        <p className="text-sm text-slate-600">
                          <span className="font-semibold">बुक किया गया:</span> {apt.bookedAt}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center mb-8 pt-6">
          <h1 className="text-4xl font-bold text-purple-900 mb-2">
            Fulfil Your Needs
          </h1>
          <p className="text-gray-600 text-lg">आपकी सेवा में हमेशा तत्पर</p>
          <button
            onClick={() => setIsAdmin(null)}
            className="mt-4 text-sm text-blue-600 hover:text-blue-800 underline"
          >
            एडमिन लॉगिन
          </button>
        </div>

        {isAdmin === null && (
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 max-w-md mx-auto">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <Lock className="w-6 h-6 text-blue-600" />
              एडमिन लॉगिन
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  पासवर्ड
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAdminLogin()}
                    placeholder="एडमिन पासवर्ड डालें"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition pr-12"
                  />
                  <button
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {loginError && (
                  <p className="text-red-600 text-sm mt-2">{loginError}</p>
                )}
                <p className="text-xs text-gray-500 mt-2">
                  डिफ़ॉल्ट पासवर्ड: admin123 (लॉगिन के बाद बदल सकते हैं)
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleAdminLogin}
                  className="flex-1 bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition"
                >
                  लॉगिन करें
                </button>
                <button
                  onClick={() => setIsAdmin(false)}
                  className="flex-1 bg-gray-300 text-gray-700 font-bold py-3 rounded-lg hover:bg-gray-400 transition"
                >
                  कैंसल
                </button>
              </div>
            </div>
          </div>
        )}

        {showSuccess && (
          <div className="mb-6 bg-green-100 border border-green-400 text-green-700 px-6 py-4 rounded-lg flex items-center gap-3 animate-pulse">
            <Check className="w-6 h-6" />
            <span className="font-semibold">अपॉइंटमेंट सफलतापूर्वक बुक हो गया है!</span>
          </div>
        )}

        {isAdmin === false && (
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <Calendar className="w-6 h-6 text-purple-600" />
              अपॉइंटमेंट बुक करें
            </h2>

            <div className="space-y-6">
              <div>
                <label className="block text-gray-700 font-semibold mb-2 flex items-center gap-2">
                  <User className="w-5 h-5 text-purple-600" />
                  नाम
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="अपना नाम लिखें"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-purple-500 transition"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2 flex items-center gap-2">
                  <Phone className="w-5 h-5 text-purple-600" />
                  मोबाइल नंबर
                </label>
                <input
                  type="tel"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleInputChange}
                  placeholder="10 अंकों का मोबाइल नंबर"
                  pattern="[0-9]{10}"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-purple-500 transition"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-purple-600" />
                  सर्विस का पता
                </label>
                <textarea
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="वह पता लिखें जहां सर्विस चाहिए"
                  rows="3"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-purple-500 transition"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    तारीख (वैकल्पिक)
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-purple-500 transition"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    समय (वैकल्पिक)
                  </label>
                  <input
                    type="time"
                    name="time"
                    value={formData.time}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-purple-500 transition"
                  />
                </div>
              </div>

              <button
                onClick={handleSubmit}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold py-4 rounded-lg hover:from-purple-700 hover:to-blue-700 transition transform hover:scale-105 shadow-lg"
              >
                अपॉइंटमेंट बुक करें
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
