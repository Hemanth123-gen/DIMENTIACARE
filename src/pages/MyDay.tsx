import React, { useState, useEffect } from 'react';
import { Circle, Plus, Trash2, Edit2, Check, X } from 'lucide-react';
import { storageService } from '../services/storageService';
import type { Activity } from '../data/demoData';
import { useLanguage } from '../context/LanguageContext';
import { getFormattedDate } from '../utils/dateUtils';
import { getLocalizedActivity, generateTranslations } from '../services/translationService';

// Helper to determine if an activity time has been reached based on IST (Asia/Kolkata)
const isActivityActive = (timeStr: string, dateStr?: string): boolean => {
  try {
    // 1. Get current date/time in Asia/Kolkata
    const now = new Date();
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: 'Asia/Kolkata',
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      hour12: false
    });
    const parts = formatter.formatToParts(now);
    const getVal = (type: string) => parseInt(parts.find(p => p.type === type)?.value || '0', 10);
    
    const currentYear = getVal('year');
    const currentMonth = getVal('month'); // 1-12
    const currentDay = getVal('day');
    const currentHour = getVal('hour');
    const currentMinute = getVal('minute');

    // 2. Parse the activity scheduled time (e.g. "08:00 AM" or "06:30 PM")
    const cleanTime = timeStr.trim().toUpperCase();
    const matches = cleanTime.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/);
    if (!matches) return true; // Safe fallback for invalid formats
    
    let hours = parseInt(matches[1], 10);
    const minutes = parseInt(matches[2], 10);
    const modifier = matches[3];
    
    if (hours === 12) hours = 0;
    if (modifier === 'PM') hours += 12;

    // 3. Resolve target date (default to today if not provided)
    let targetYear = currentYear;
    let targetMonth = currentMonth;
    let targetDay = currentDay;

    if (dateStr) {
      const dateParts = dateStr.split('-');
      if (dateParts.length === 3) {
        targetYear = parseInt(dateParts[0], 10);
        targetMonth = parseInt(dateParts[1], 10);
        targetDay = parseInt(dateParts[2], 10);
      }
    }

    // Compare Date first
    if (currentYear > targetYear) return true;
    if (currentYear < targetYear) return false;
    
    if (currentMonth > targetMonth) return true;
    if (currentMonth < targetMonth) return false;
    
    if (currentDay > targetDay) return true;
    if (currentDay < targetDay) return false;

    // Same day, compare hours/minutes
    if (currentHour > hours) return true;
    if (currentHour < hours) return false;
    return currentMinute >= minutes;
  } catch (e) {
    return true; // Safe fallback on error
  }
};

const dayTranslations: Record<string, Record<string, string>> = {
  English: {
    deleteConfirm: 'Delete this scheduled item?',
    upcoming: 'Upcoming',
    addActivity: 'Add Daily Activity',
    editActivity: 'Edit Activity',
    activityName: 'Activity Name',
    scheduledTime: 'Scheduled Time',
    scheduleBtn: 'Schedule Activity',
    saveBtn: 'Save Changes',
    placeholderName: 'e.g. Evening Walk',
    placeholderTime: 'e.g. 06:00 PM'
  },
  Hindi: {
    deleteConfirm: 'क्या आप इस निर्धारित गतिविधि को हटाना चाहते हैं?',
    upcoming: 'आने वाला',
    addActivity: 'दैनिक गतिविधि जोड़ें',
    editActivity: 'गतिविधि संपादित करें',
    activityName: 'गतिविधि का नाम',
    scheduledTime: 'निर्धारित समय',
    scheduleBtn: 'गतिविधि निर्धारित करें',
    saveBtn: 'बदलाव सहेजें',
    placeholderName: 'जैसे- शाम की सैर',
    placeholderTime: 'जैसे- 06:00 PM'
  },
  Bengali: {
    deleteConfirm: 'আপনি কি এই নির্ধারিত কাজটি মুছে ফেলতে চান?',
    upcoming: 'আসন্ন',
    addActivity: 'দৈনিক কাজ যোগ করুন',
    editActivity: 'কাজ সম্পাদন করুন',
    activityName: 'কাজের নাম',
    scheduledTime: 'নির্ধারিত সময়',
    scheduleBtn: 'কাজ নির্ধারণ করুন',
    saveBtn: 'পরিবর্তন সংরক্ষণ করুন',
    placeholderName: 'উদাঃ বিকেলে হাঁটা',
    placeholderTime: 'উদাঃ ০৬:০০ PM'
  },
  Assamese: {
    deleteConfirm: 'আপুনি এই কাৰ্যসূচীটো মচিব খোজে নেকি?',
    upcoming: 'অনাগত',
    addActivity: 'দৈনিক কাৰ্যসূচী যোগ কৰক',
    editActivity: 'কাৰ্যসূচী সম্পাদনা কৰক',
    activityName: 'কাৰ্যসূচীৰ নাম',
    scheduledTime: 'নিৰ্ধাৰিত সময়',
    scheduleBtn: 'কাৰ্যসূচী প্ৰস্তুত কৰক',
    saveBtn: 'সংৰক্ষণ কৰক',
    placeholderName: 'যেনে- সন্ধিয়া ফুৰিবলৈ যোৱা',
    placeholderTime: 'যেনে- ০৬:০০ PM'
  },
  Manipuri: {
    deleteConfirm: 'অসি মफম অসিদগী মুত্থতপরা?',
    upcoming: 'লাক্কদ্রিবা',
    addActivity: 'নুমিৎসিগী থবক হাপ্পা',
    editActivity: 'খবক শেমদোকপা',
    activityName: 'থবককী টাইটেল',
    scheduledTime: 'শেম্লবা পুংফম',
    scheduleBtn: 'থবক থম্বা',
    saveBtn: 'শেমদোকপা থম্বা',
    placeholderName: 'উদাঃ নুমিদাংগী খোঙ চৎপা',
    placeholderTime: 'উদাঃ ০৬:০০ PM'
  },
  Khasi: {
    deleteConfirm: 'Pyndam ia kane ka kam ba la buh?',
    upcoming: 'Ban dang wan',
    addActivity: 'Buh Kam Kaba Man La Ka Sngi',
    editActivity: 'Pynkylla ia ka Kam',
    activityName: 'Kyrteng ka Kam',
    scheduledTime: 'Por ba la buh',
    scheduleBtn: 'Buh ia ka Kam',
    saveBtn: 'Pynsah ia ki Jingkylla',
    placeholderName: 'kd. Ka jingleit iad',
    placeholderTime: 'kd. 06:00 PM'
  },
  Mizo: {
    deleteConfirm: 'He thil ruahman hi nuaibo i duh em?',
    upcoming: 'La thleng lo',
    addActivity: 'Nitin Hna Dahna',
    editActivity: 'Hna Siamṭhatna',
    activityName: 'Hna Hming',
    scheduledTime: 'Hun Ruahman',
    scheduleBtn: 'Hna Ruahman Dahna',
    saveBtn: 'Siamṭhatna Dahna',
    placeholderName: 'kd. Tlai chheih kal',
    placeholderTime: 'kd. 06:00 PM'
  },
  Nagamese: {
    deleteConfirm: 'Etu schedule delete kuribole mon ase na?',
    upcoming: 'Ahibole thaka',
    addActivity: 'Daily Schedule Bachabi',
    editActivity: 'Schedule Edit Kuribi',
    activityName: 'Schedule Hming',
    scheduledTime: 'Time scheduled',
    scheduleBtn: 'Schedule Kuribi',
    saveBtn: 'Bhal pora thakibi',
    placeholderName: 'kd. Tlai berabo',
    placeholderTime: 'kd. 06:00 PM'
  },
  Tripuri: {
    deleteConfirm: 'Etu activity delete khailani?',
    upcoming: 'Phai tongma',
    addActivity: 'Dinni kam hapa',
    editActivity: 'Kam chopha khailadi',
    activityName: 'Kam Title',
    scheduledTime: 'Time hiladi',
    scheduleBtn: 'Kam hiladi',
    saveBtn: 'Hilama khamdi',
    placeholderName: 'kd. Aphi chhor',
    placeholderTime: 'kd. 06:00 PM'
  }
};

export const MyDay: React.FC = () => {
  const { t, language } = useLanguage();
  const [schedule, setSchedule] = useState<Activity[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newTime, setNewTime] = useState('08:00 AM');
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);
  
  // State to force re-render when time tick updates
  const [, setTimeTick] = useState(0);

  useEffect(() => {
    storageService.init();
    setSchedule(storageService.getSchedule());

    // Setup minute timer check to trigger live activation updates
    const timer = setInterval(() => {
      setTimeTick(t => t + 1);
    }, 15000); // Check every 15 seconds for responsive live updates
    return () => clearInterval(timer);
  }, []);

  const handleToggleComplete = (id: string) => {
    const act = schedule.find(a => a.id === id);
    if (!act) return;

    // If task is not completed yet, enforce scheduled time activation validation
    if (!act.completed && !isActivityActive(act.time, act.date)) {
      console.warn(`[My Day] Activity "${act.title}" is locked until ${act.time} IST.`);
      return;
    }

    const updated = schedule.map(a => {
      if (a.id === id) {
        // Create caregiver alert
        if (!a.completed) {
          const alerts = storageService.getAlerts();
          storageService.saveAlerts([
            { id: `al-${Date.now()}`, type: 'success', title: `Task completed: ${a.title}`, time: 'Just now' },
            ...alerts
          ]);
        }
        return { ...a, completed: !a.completed };
      }
      return a;
    });
    setSchedule(updated);
    storageService.saveSchedule(updated);
  };

  const handleAddActivity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const todayStr = new Date().toISOString().split('T')[0];
    const newAct: Activity = {
      id: `act-${Date.now()}`,
      time: newTime,
      title: newTitle,
      completed: false,
      date: todayStr
    };

    const updated = [...schedule, newAct].sort((a, b) => {
      const toMinutes = (timeStr: string) => {
        const [time, modifier] = timeStr.split(' ');
        let [hours, minutes] = time.split(':').map(Number);
        if (hours === 12) hours = 0;
        if (modifier === 'PM') hours += 12;
        return hours * 60 + (minutes || 0);
      };
      return toMinutes(a.time) - toMinutes(b.time);
    });

    setSchedule(updated);
    storageService.saveSchedule(updated);
    setNewTitle('');
    setShowAddModal(false);

    generateTranslations(newTitle, '').then(trans => {
      const currentSch = storageService.getSchedule();
      const updatedWithTrans = currentSch.map(s => s.id === newAct.id ? { ...s, translations: trans } : s);
      storageService.saveSchedule(updatedWithTrans);
      setSchedule(updatedWithTrans);
    }).catch(err => {
      console.warn('[Translation] Failed to generate translations for activity:', err);
    });
  };

  const handleDeleteActivity = (id: string) => {
    const dt = dayTranslations[language] || dayTranslations.English;
    if (window.confirm(dt.deleteConfirm)) {
      const updated = schedule.filter(act => act.id !== id);
      setSchedule(updated);
      storageService.saveSchedule(updated);
    }
  };

  const handleEditActivity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingActivity || !editingActivity.title.trim()) return;

    const updated = schedule.map(act => 
      act.id === editingActivity.id ? editingActivity : act
    );
    setSchedule(updated);
    storageService.saveSchedule(updated);
    setEditingActivity(null);

    generateTranslations(editingActivity.title, '').then(trans => {
      const currentSch = storageService.getSchedule();
      const updatedWithTrans = currentSch.map(s => s.id === editingActivity.id ? { ...s, translations: trans } : s);
      storageService.saveSchedule(updatedWithTrans);
      setSchedule(updatedWithTrans);
    }).catch(err => {
      console.warn('[Translation] Failed to generate translations for edited activity:', err);
    });
  };

  return (
    <div className="pb-12 space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-brand-navy">{t('nav.myDay')}</h1>
          <p className="text-brand-grayText font-medium mt-1">{getFormattedDate(new Date(), language)}</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-brand-purple text-white hover:bg-opacity-95 py-3 px-5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-sm"
        >
          <Plus className="w-5 h-5" />
          <span>{t('day.add')}</span>
        </button>
      </div>

      {/* Timeline Card */}
      <div className="bg-white p-6 md:p-8 rounded-3xl border border-brand-purpleLight shadow-sm">
        <div className="relative border-l-2 border-brand-purpleLight ml-4 md:ml-6 space-y-8 py-2">
          {schedule.map((item) => {
            const isActive = item.completed || isActivityActive(item.time, item.date);
            return (
              <div key={item.id} className="relative pl-8 md:pl-10 group">
                {/* Timeline Marker */}
                <div 
                  onClick={() => handleToggleComplete(item.id)}
                  className={`absolute -left-[17px] top-1.5 w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all ${
                    !isActive 
                      ? 'bg-gray-100 border-gray-300 text-gray-400 cursor-not-allowed opacity-60' 
                      : item.completed 
                        ? 'bg-brand-green border-brand-green text-white scale-110 shadow-sm cursor-pointer' 
                        : item.isCurrent 
                          ? 'bg-white border-brand-orange text-brand-orange scale-110 cursor-pointer'
                          : 'bg-white border-brand-purpleLight text-brand-grayText hover:border-brand-purple cursor-pointer'
                  }`}
                >
                  {item.completed ? (
                    <Check className="w-5 h-5 stroke-[3]" />
                  ) : item.isCurrent && isActive ? (
                    <Circle className="w-5 h-5 stroke-[3] fill-brand-orangeBg" />
                  ) : (
                    <Circle className="w-5 h-5" />
                  )}
                </div>

                {/* Activity Info */}
                <div className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                  !isActive
                    ? 'bg-gray-50 border-gray-200 opacity-60'
                    : item.completed 
                      ? 'bg-brand-greenBg border-brand-greenBg opacity-80' 
                      : item.isCurrent
                        ? 'bg-brand-orangeBg border-brand-orange'
                        : 'bg-brand-lavender border-brand-purpleLight hover:bg-white hover:border-brand-purple'
                }`}>
                  <div>
                    <span className={`text-sm font-bold block ${
                      !isActive
                        ? 'text-gray-400'
                        : item.completed 
                          ? 'text-brand-green' 
                          : item.isCurrent
                            ? 'text-brand-orange'
                            : 'text-brand-purple'
                    }`}>
                      {item.time} {!isActive && `(${(dayTranslations[language] || dayTranslations.English).upcoming})`}
                    </span>
                    <h3 className={`font-bold text-lg mt-1 text-brand-navy ${item.completed ? 'line-through' : ''} flex items-center gap-2`}>
                      <span className="text-xl">
                        {item.title.toLowerCase().includes('med') || item.title.toLowerCase().includes('pill') || item.title.toLowerCase().includes('tablet') ? '💊' :
                         item.title.toLowerCase().includes('water') || item.title.toLowerCase().includes('drink') || item.title.toLowerCase().includes('hydration') ? '💧' :
                         item.title.toLowerCase().includes('walk') || item.title.toLowerCase().includes('exerc') || item.title.toLowerCase().includes('run') ? '🚶' :
                         item.title.toLowerCase().includes('breakfast') || item.title.toLowerCase().includes('lunch') || item.title.toLowerCase().includes('dinner') || item.title.toLowerCase().includes('meal') || item.title.toLowerCase().includes('eat') ? '🍱' :
                         item.title.toLowerCase().includes('bath') || item.title.toLowerCase().includes('wash') || item.title.toLowerCase().includes('shower') ? '🛁' :
                         item.title.toLowerCase().includes('sleep') || item.title.toLowerCase().includes('bed') || item.title.toLowerCase().includes('rest') ? '💤' : '📅'}
                      </span>
                      <span>{getLocalizedActivity(item, language).title}</span>
                    </h3>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center opacity-70 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => setEditingActivity(item)}
                      className="p-2 rounded-xl hover:bg-white text-brand-purple transition-all"
                      title="Edit"
                    >
                      <Edit2 className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDeleteActivity(item.id)}
                      className="p-2 rounded-xl hover:bg-brand-redBg text-brand-red transition-all"
                      title="Delete"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-navy bg-opacity-40">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-md w-full shadow-xl border border-brand-purpleLight">
            <div className="flex justify-between items-center border-b border-brand-purpleLight pb-4 mb-6">
              <h2 className="font-extrabold text-xl text-brand-navy">{(dayTranslations[language] || dayTranslations.English).addActivity}</h2>
              <button onClick={() => setShowAddModal(false)} className="p-1 rounded-lg hover:bg-brand-lavender">
                <X className="w-6 h-6 text-brand-grayText" />
              </button>
            </div>
            <form onSubmit={handleAddActivity} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-brand-navy mb-2">{(dayTranslations[language] || dayTranslations.English).activityName}</label>
                <input
                  type="text"
                  placeholder={(dayTranslations[language] || dayTranslations.English).placeholderName}
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-brand-purpleLight focus:outline-none focus:border-brand-purple text-base"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-brand-navy mb-2">{(dayTranslations[language] || dayTranslations.English).scheduledTime}</label>
                <input
                  type="text"
                  placeholder={(dayTranslations[language] || dayTranslations.English).placeholderTime}
                  value={newTime}
                  onChange={(e) => setNewTime(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-brand-purpleLight focus:outline-none focus:border-brand-purple text-base"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full mt-6 bg-brand-purple text-white py-3.5 rounded-xl font-bold hover:bg-opacity-95"
              >
                {(dayTranslations[language] || dayTranslations.English).scheduleBtn}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editingActivity && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-navy bg-opacity-40">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-md w-full shadow-xl border border-brand-purpleLight">
            <div className="flex justify-between items-center border-b border-brand-purpleLight pb-4 mb-6">
              <h2 className="font-extrabold text-xl text-brand-navy">{(dayTranslations[language] || dayTranslations.English).editActivity}</h2>
              <button onClick={() => setEditingActivity(null)} className="p-1 rounded-lg hover:bg-brand-lavender">
                <X className="w-6 h-6 text-brand-grayText" />
              </button>
            </div>
            <form onSubmit={handleEditActivity} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-brand-navy mb-2">{(dayTranslations[language] || dayTranslations.English).activityName}</label>
                <input
                  type="text"
                  value={editingActivity.title}
                  onChange={(e) => setEditingActivity({ ...editingActivity, title: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-brand-purpleLight focus:outline-none focus:border-brand-purple text-base"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-brand-navy mb-2">{(dayTranslations[language] || dayTranslations.English).scheduledTime}</label>
                <input
                  type="text"
                  value={editingActivity.time}
                  onChange={(e) => setEditingActivity({ ...editingActivity, time: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-brand-purpleLight focus:outline-none focus:border-brand-purple text-base"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full mt-6 bg-brand-purple text-white py-3.5 rounded-xl font-bold hover:bg-opacity-95"
              >
                {(dayTranslations[language] || dayTranslations.English).saveBtn}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
