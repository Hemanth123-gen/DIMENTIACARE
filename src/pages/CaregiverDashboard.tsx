import React, { useState, useEffect } from 'react';
import { 
  Gamepad2, 
  CheckSquare, 
  Bell, 
  Smile, 
  AlertTriangle, 
  Plus, 
  Phone, 
  Heart,
  X
} from 'lucide-react';
import { storageService } from '../services/storageService';
import type { Reminder, Activity, CaregiverAlert, GameScore } from '../data/demoData';
import { useLanguage } from '../context/LanguageContext';
import { getISODateString } from '../utils/dateUtils';
import { SVGCaregiverAvatar } from '../components/SVGIcons';

const localCgTranslations: Record<string, Record<string, string>> = {
  English: {
    perfArea: 'Performance by Area',
    perfSub: "Patient's cognitive scores by brain regions.",
    memory: 'Memory',
    attention: 'Attention',
    problemSolving: 'Problem Solving',
    scheduleFeed: "Today's Schedule Feed",
    recentAlerts: 'Recent Alerts',
    clearAlerts: 'Clear Alerts',
    current: 'Current',
    addAlert: 'Add Caregiver Alert',
    createAlert: 'Create Alert',
    triggerCall: 'Trigger Call to Caregiver',
    callCaregiver: 'Call Caregiver',
    clearAll: 'Clear All',
    noAlerts: 'No alerts logged.',
    addCustomRem: 'Add Custom Reminder',
    addReminderBtn: 'Add Reminder',
    remTitle: 'Reminder Title',
    remTime: 'Time',
    activeNow: 'Active Now',
    today: 'Today',
    weeklyLogs: 'Weekly Logs',
    completed: 'Completed',
    upcoming: 'Upcoming',
    cgQuickActions: 'Caregiver Quick Actions',
    callRavi: 'Call Ravi',
    quickAddRem: 'Quick Add Reminder',
    sendAlert: 'Send Alert to Patient Device',
    bannerText: '“Together, we support better days and stronger memories.”',
    activityOverview: 'Activity Overview',
    activitySub: 'Task completion trend over the last 7 days.',
    standard: 'Standard',
    toastPhotoSuccess: 'Profile photo updated successfully!',
    toastCallConnecting: "Connecting to {name}'s Second Brain device speakers...",
    logNewReminder: 'New reminder added: {title}',
    scheduledFromCg: 'Scheduled from Caregiver Panel',
    welcome: 'Welcome,',
    weeklyLogsOverview: 'Weekly Logs / Overview',
    dailyStatus: 'Daily Status',
    weeklyInsights: 'Weekly Insights',
    completedActivitiesTrend: 'Completed Activities Trend',
    memoryPerformanceTrend: 'Memory Performance Trend',
    overall: 'Overall',
    noPerfData: 'No performance data yet',
    noPerfDataDesc: 'Play memory match or other brain games to view scores.',
    placeholderBringWater: 'e.g. Bring water to bedroom',
    viewProfile: 'Caregiver Profile',
    photoUploadHelper: 'Upload new photo',
    selectPatient: 'Select Patient:',
    noWeeklyRecords: 'No activity records for this week.',
    doneStatus: 'Done',
    missedStatus: 'Missed',
    pendingStatus: 'Pending',
    noTasks: 'No tasks',
    noActivity: 'No activity'
  },
  Assamese: {
    perfArea: 'পৰিদৰ্শন ক্ষেত্ৰ',
    perfSub: "মগজুৰ বিভিন্ন অংশৰ স্ক’ৰসমূহ।",
    memory: 'স্মৃতিশক্তি',
    attention: 'মনোযোগ',
    problemSolving: 'সমস্যা সমাধান',
    scheduleFeed: 'আজিৰ কাৰ্যসূচী তালিকা',
    recentAlerts: 'শেহতীয়া সতৰ্কবাণী',
    clearAlerts: 'খালি কৰক',
    current: 'বৰ্তমান',
    addAlert: 'নতুন সতৰ্কতা যোগ কৰক',
    createAlert: 'সতৰ্কতা তৈয়াৰ কৰক',
    triggerCall: 'তত্ত্বাৱধায়কলৈ কল কৰক',
    callCaregiver: 'তত্ত্বাৱধায়কলৈ কল',
    clearAll: 'সকলো আতৰাওক',
    noAlerts: 'কোনো সতৰ্কবাণী নাই।',
    addCustomRem: 'নতুন অনুস্মাৰক যোগ কৰক',
    addReminderBtn: 'অনুস্মাৰক যোগ কৰক',
    remTitle: 'অনুস্মাৰকৰ নাম',
    remTime: 'সময়',
    activeNow: 'এতিয়া সক্ৰিয়',
    today: 'আজি',
    weeklyLogs: 'সপ্তাহিক ল’গ',
    completed: 'সম্পূৰ্ণ হ’ল',
    upcoming: 'অনাগত',
    cgQuickActions: 'তত্ত্বাৱধায়কৰ ক্ষিপ্ৰ কাৰ্য্যসূচী',
    callRavi: 'ৰবীলৈ কল কৰক',
    quickAddRem: 'খৰতকীয়া অনুস্মাৰক',
    sendAlert: 'ৰোগীৰ ডিভাইচলৈ পঠিয়াওক',
    bannerText: '“একেলেগে, আমি উন্নত দিন আৰু শক্তিশালী স্মৃতি সমৰ্থন কৰোঁ।”',
    activityOverview: 'কাৰ্যকলাপৰ বুজাবুজি',
    activitySub: 'যোৱা ৭ দিনৰ কাৰ্য্য সম্পূৰ্ণ কৰাৰ প্ৰৱণতা।',
    standard: 'সাধাৰণ',
    toastPhotoSuccess: 'প্ৰফাইল ফটো সফলতাৰে আপলোড হ’ল!',
    toastCallConnecting: 'ৰোগী {name}ৰ ডিভাইচ স্পীকাৰৰ লগত সংযোগ স্থাপন কৰা হৈছে...',
    logNewReminder: 'নতুন অনুস্মাৰক যোগ কৰা হ’ল: {title}',
    scheduledFromCg: 'তত্ত্বাৱধায়ক পেনেলৰ পৰা যোগ কৰা হৈছে',
    welcome: 'স্বাগতম,',
    weeklyLogsOverview: 'সাপ্তাহিক লগ / বুজাবুজি',
    dailyStatus: 'দৈনিক স্থিতি',
    weeklyInsights: 'সাপ্তাহিক বিশ্লেষণ',
    completedActivitiesTrend: 'সম্পূৰ্ণ হোৱা কাৰ্যকলাপৰ প্ৰৱণতা',
    memoryPerformanceTrend: 'স্মৃতিশক্তি পৰিদৰ্শনৰ প্ৰৱণতা',
    overall: 'সামগ্ৰিক',
    noPerfData: 'কোনো পৰিদৰ্শন তথ্য নাই',
    noPerfDataDesc: 'স্কোৰ চাবলৈ মেমৰি মেচ বা আন মগজুৰ খেল খেলক।',
    placeholderBringWater: 'যেনে: শোৱা কোঠালৈ পানী আনা',
    viewProfile: 'তত্ত্বাৱধায়ক প্ৰফাইল',
    photoUploadHelper: 'নতুন ফটো আপলোড কৰক',
    selectPatient: 'ৰোগী বাছনি কৰক:',
    noWeeklyRecords: 'এই সপ্তাহৰ বাবে কোনো কাৰ্যকলাপৰ অভিলেখ নাই।',
    doneStatus: 'সম্পূৰ্ণ',
    missedStatus: 'বাদ পৰিল',
    pendingStatus: 'বাকী আছে',
    noTasks: 'কোনো কাম নাই',
    noActivity: 'কোনো কাৰ্যকলাপ নাই'
  },
  Bengali: {
    perfArea: 'ক্ষেত্রের কর্মক্ষমতা',
    perfSub: "মস্তিষ্কের অঞ্চল দ্বারা রোগীর জ্ঞানীয় স্কোর।",
    memory: 'স্মৃতিশক্তি',
    attention: 'মনোযোগ',
    problemSolving: 'সমস্যা সমাধান',
    scheduleFeed: 'আজকের সময়সূচী ফিড',
    recentAlerts: 'সাম্প্রতিক সতর্কতা',
    clearAlerts: 'মুছে ফেলুন',
    current: 'বর্তমান',
    addAlert: 'নতুন সতর্কতা যোগ করুন',
    createAlert: 'সতর্কতা তৈরি করুন',
    triggerCall: 'কেয়ারগিভারকে কল করুন',
    callCaregiver: 'কেয়ারগিভার কল',
    clearAll: 'সব মুছুন',
    noAlerts: 'কোন সতর্কতা নেই।',
    addCustomRem: 'নতুন অনুস্মারক যোগ করুন',
    addReminderBtn: 'অনুস্মারক যোগ করুন',
    remTitle: 'অনুস্মারকের নাম',
    remTime: 'সময়',
    activeNow: 'এখন সক্রিয়',
    today: 'আজ',
    weeklyLogs: 'সাপ্তাহিক লগ',
    completed: 'সম্পন্ন',
    upcoming: 'আসন্ন',
    cgQuickActions: 'কেয়ারগিভারের দ্রুত কাজ',
    callRavi: 'রবিকে কল করুন',
    quickAddRem: 'দ্রুত অনুস্মারক যোগ করুন',
    sendAlert: 'রোগীর ডিভাইসে সতর্কতা পাঠান',
    bannerText: '“একত্রে, আমরা আরও ভালো দিন এবং শক্তিশালী স্মৃতি সমর্থন করি।”',
    activityOverview: 'কার্যকলাপের সংক্ষিপ্ত বিবরণ',
    activitySub: 'গত ৭ দিনে কাজ শেষ করার প্রবণতা।',
    standard: 'স্বাভাবিক',
    toastPhotoSuccess: 'প্রোফাইল ছবি সফলভাবে আপডেট করা হয়েছে!',
    toastCallConnecting: 'রোগী {name}-এর ডিভাইস স্পিকারের সাথে সংযোগ করা হচ্ছে...',
    logNewReminder: 'নতুন অনুস্মারক যোগ করা হয়েছে: {title}',
    scheduledFromCg: 'কেয়ারগিভার প্যানেল থেকে নির্ধারিত',
    welcome: 'স্বাগতম,',
    weeklyLogsOverview: 'সাপ্তাহিক লগ / ওভারভিউ',
    dailyStatus: 'দৈনিক স্থিতি',
    weeklyInsights: 'সাপ্তাহিক বিশ্লেষণ',
    completedActivitiesTrend: 'সম্পন্ন কার্যক্রমের প্রবণতা',
    memoryPerformanceTrend: 'স্মৃতিশক্তি কর্মক্ষমতার প্রবণতা',
    overall: 'সামগ্রিক',
    noPerfData: 'এখনও কোনও পারফরম্যান্স ডেটা নেই',
    noPerfDataDesc: 'স্কোর দেখতে মেমরি ম্যাচ বা অন্যান্য ব্রেন গেম খেলুন।',
    placeholderBringWater: 'যেমন: শোবার ঘরে জল আনুন',
    viewProfile: 'কেয়ারগিভার প্রোফাইল',
    photoUploadHelper: 'নতুন ছবি আপলোড করুন',
    selectPatient: 'রোগী নির্বাচন করুন:',
    noWeeklyRecords: 'এই সপ্তাহের জন্য কোনো কাজের রেকর্ড নেই।',
    doneStatus: 'সম্পন্ন',
    missedStatus: 'বাদ পড়েছে',
    pendingStatus: 'বাকি আছে',
    noTasks: 'কোনো কাজ নেই',
    noActivity: 'কোনো কাজ নেই'
  },
  Hindi: {
    perfArea: 'क्षेत्रीय प्रदर्शन',
    perfSub: "मस्तिष्क के क्षेत्रों द्वारा रोगी के संज्ञानात्मक स्कोर।",
    memory: 'स्मरण शक्ति',
    attention: 'ध्यान केंद्रित करना',
    problemSolving: 'समस्या समाधान',
    scheduleFeed: 'आज की समय सारणी',
    recentAlerts: 'हालिया अलर्ट',
    clearAlerts: 'साफ करें',
    current: 'वर्तमान',
    addAlert: 'नया अलर्ट जोड़ें',
    createAlert: 'अलर्ट बनाएं',
    triggerCall: 'केयरगिवर को कॉल करें',
    callCaregiver: 'केयरगिवर कॉल',
    clearAll: 'सभी साफ करें',
    noAlerts: 'कोई अलर्ट नहीं है।',
    addCustomRem: 'अनुस्मारक जोड़ें',
    addReminderBtn: 'अनुस्मारक जोड़ें',
    remTitle: 'अनुस्मारक का नाम',
    remTime: 'समय',
    activeNow: 'अभी सक्रिय',
    today: 'आज',
    weeklyLogs: 'साप्ताहिक लॉग',
    completed: 'पूर्ण',
    upcoming: 'आगामी',
    cgQuickActions: 'केयरगिवर त्वरित कार्रवाई',
    callRavi: 'रवि को कॉल करें',
    quickAddRem: 'त्वरित अनुस्मारक',
    sendAlert: 'रोगी के डिवाइस पर भेजें',
    bannerText: '“साथ मिलकर, हम बेहतर दिनों और मजबूत यादों का समर्थन करते हैं।”',
    activityOverview: 'गतिविधि अवलोकन',
    activitySub: 'पिछले 7 दिनों में कार्य पूरा होने की प्रवृत्ति।',
    standard: 'सामान्य',
    toastPhotoSuccess: 'प्रोफ़ाइल फ़ोटो सफलतापूर्वक अपडेट हो गई!',
    toastCallConnecting: 'रोगी {name} के डिवाइस स्पीकर से जुड़ रहा है...',
    logNewReminder: 'नया अनुस्मारक जोड़ा गया: {title}',
    scheduledFromCg: 'केयरगिवर पैनल से निर्धारित किया गया',
    welcome: 'स्वागत है,',
    weeklyLogsOverview: 'साप्ताहिक लॉग / अवलोकन',
    dailyStatus: 'दैनिक स्थिति',
    weeklyInsights: 'साप्ताहिक अंतर्दृष्टि',
    completedActivitiesTrend: 'पूर्ण गतिविधियों की प्रवृत्ति',
    memoryPerformanceTrend: 'स्मरण शक्ति प्रदर्शन प्रवृत्ति',
    overall: 'कुल मिलाकर',
    noPerfData: 'अभी तक कोई प्रदर्शन डेटा नहीं',
    noPerfDataDesc: 'स्कोर देखने के लिए मेमोरी मैच या अन्य दिमागी खेल खेलें।',
    placeholderBringWater: 'जैसे: बेडरूम में पानी लाओ',
    viewProfile: 'केयरगिवर प्रोफ़ाइल',
    photoUploadHelper: 'नया फोटो अपलोड करें',
    selectPatient: 'रोगी चुनें:',
    noWeeklyRecords: 'इस सप्ताह के लिए कोई गतिविधि रिकॉर्ड नहीं है।',
    doneStatus: 'पूर्ण',
    missedStatus: 'छूटा हुआ',
    pendingStatus: 'लंबित',
    noTasks: 'कोई कार्य नहीं',
    noActivity: 'कोई गतिविधि नहीं'
  },
  Manipuri: {
    perfArea: 'কগ্নিতিপ স্কোর',
    perfSub: "লাইয়েংলিবগী মগজুগী তোঙান তোঙানবা স্কোরশিং।",
    memory: 'মেমোরি',
    attention: 'অটেনশন',
    problemSolving: 'প্রোব্লেম সোলভিং',
    scheduleFeed: 'ঙসিগী রুতিন',
    recentAlerts: 'হৌখিবা পাউ',
    clearAlerts: 'কোকহনবূ',
    current: 'হৌজিক লৈরিবা',
    addAlert: 'অনৌবা পাউ পীবূ',
    createAlert: 'পাউ শেমবূ',
    triggerCall: 'কেয়ারগিভরদা কৌবীউ',
    callCaregiver: 'কেয়ারগিভরদা কৌবা',
    clearAll: 'কোকহন্নবা',
    noAlerts: 'পাউ অমত্তা লৈতে।',
    addCustomRem: 'অনৌবা হিদাক ইবীউ',
    addReminderBtn: 'হিদাক ইবূ',
    remTitle: 'হিদাক miং',
    remTime: 'মতূম',
    activeNow: 'হৌজিক কৌরিবা',
    today: 'ঙসি',
    weeklyLogs: 'চয়োলগী রিকোর্দ',
    completed: 'লোইখ্রে',
    upcoming: 'লাক্কদবা',
    cgQuickActions: 'তুং কোইনা তৌগদবা কাংলোন',
    callRavi: 'রবিদা কৌবীউ',
    quickAddRem: 'হিদাক শেমবূ',
    sendAlert: 'লাইয়েংলিবদা পাউ পিউ',
    bannerText: '“পুনশিন্না ঐখোইনা হেন্না ফবা নুমিৎ অমসুং মেমোরিশিং শৌগৎলি।”',
    activityOverview: 'থবকশিংগী অকুপ্পা য়েংবা',
    activitySub: 'হৌখিবা নুমিৎ ৭কী থবক লোইশিনবগী চাং।',
    standard: 'স্ট্যান্ডার্ড',
    toastPhotoSuccess: 'প্রোফাইল ফটো মায় পাক্না শেমখ্রে!',
    toastCallConnecting: '{name}গী ডিভাইচ স্পীকারগা কানেক্ট তৌরি...',
    logNewReminder: 'অনৌবা হিদাক ইখ্রে: {title}',
    scheduledFromCg: 'কেয়ারগিভর প্যানেলদগী থম্লবা',
    welcome: 'তরাম্না ওকচরি,',
    weeklyLogsOverview: 'চয়োলগী রিকোর্দ / অকুপ্পা য়েংবা',
    dailyStatus: 'ঙসিগী থবকশিং',
    weeklyInsights: 'চয়োলগী অকুপ্পা',
    completedActivitiesTrend: 'লোইশিনখিবা থবকশিংগী চাং',
    memoryPerformanceTrend: 'মেমোরী পারফোরমেন্সকী চাং',
    overall: 'অপুনবা',
    noPerfData: 'পারফোরমেন্স ডাটা অমত্তা লৈতে',
    noPerfDataDesc: 'স্কোরশিং য়েংনবা মেমোরী ম্যাচ খেল্লু।',
    placeholderBringWater: 'খুদম ওইনা: ঈশিং থমবীউ',
    viewProfile: 'লাইয়েংলিবগী প্রোফাইল',
    photoUploadHelper: 'অনৌবা ফটো হাপ্পা',
    selectPatient: 'লাইয়েংলিব খনবীউ:',
    noWeeklyRecords: 'চয়োল অসিগী থবকশিংগী রিকোর্দ অমত্তা লৈতে।',
    doneStatus: 'লোইখ্রে',
    missedStatus: 'মাঙখ্রে',
    pendingStatus: 'লৈহৌরি',
    noTasks: 'থবক অমত্তা লৈতে',
    noActivity: 'থবক অমত্তা লৈতে'
  },
  Khasi: {
    perfArea: 'Jingtrei katkum ki Bynta',
    perfSub: "Ki marks u patient katkum ki bynta ka khlieh.",
    memory: 'Kynmaw',
    attention: 'Shah shkor',
    problemSolving: 'Wad lad pynbeit',
    scheduleFeed: 'Jingtrei mynta ka sngi',
    recentAlerts: 'Ki jingma kiba shna shai',
    clearAlerts: 'Pynkhuid',
    current: 'Mynta',
    addAlert: 'Pyniasoh jingma',
    createAlert: 'Shna jingma',
    triggerCall: 'Phone ia u Nongsumar',
    callCaregiver: 'Phone Nongsumar',
    clearAll: 'Pynkhuid baroh',
    noAlerts: 'Ym don jingma kiba la register.',
    addCustomRem: 'Buh dawai thikna',
    addReminderBtn: 'Buh dawai',
    remTitle: 'Kyrteng dawai',
    remTime: 'Por',
    activeNow: 'Treikam Mynta',
    today: 'Mynta ka sngi',
    weeklyLogs: 'Jingthoh shata',
    completed: 'La Dep',
    upcoming: 'Kiban wan',
    cgQuickActions: 'Jingtrei kloi u Nongsumar',
    callRavi: 'Phone ia u Ravi',
    quickAddRem: 'Buh dawai kloi',
    sendAlert: 'Phah alert sha u patient',
    bannerText: '“Lang rukom, ngi ai jingkyrshan na ka bynta ki sngi kiba kham bha.”',
    activityOverview: 'Rukom khmih jingtrei',
    activitySub: 'Trend dep jingtrei hapoh 7 sngi.',
    standard: 'Kaba lah',
    toastPhotoSuccess: 'La update bha ia ka dur profile!',
    toastCallConnecting: 'Kyndiah phone sha ka speaker u {name}...',
    logNewReminder: 'Buh dawai thymmai: {title}',
    scheduledFromCg: 'Buh na ka Caregiver Panel',
    welcome: 'Khublei,',
    weeklyLogsOverview: 'Weekly Logs / Khmih',
    dailyStatus: 'Ka rukom baroh ka sngi',
    weeklyInsights: 'Weekly Insights',
    completedActivitiesTrend: 'Trend dep jingtrei',
    memoryPerformanceTrend: 'Trend kynmaw',
    overall: 'Baroh',
    noPerfData: 'Ym don jingtrei data',
    noPerfDataDesc: 'Leh ia ki memory game ban khmih ia ki marks.',
    placeholderBringWater: 'kd. Walllam ia ka um sha kamra',
    viewProfile: 'Caregiver Profile',
    photoUploadHelper: 'Upload dur thymmai',
    selectPatient: 'Jied ia u Patient:',
    noWeeklyRecords: 'Ym don jingthoh jingtrei ha kane ka taiew.',
    doneStatus: 'La Dep',
    missedStatus: 'Khlem dep',
    pendingStatus: 'Dang sah',
    noTasks: 'Ym don jingtrei',
    noActivity: 'Ym don activity'
  },
  Mizo: {
    perfArea: 'Hna thawh dan enna',
    perfSub: "Tluangtaka enkolna hmun hrang hranga an point hmuh dan.",
    memory: 'Hriatna',
    attention: 'Ngaihtuahna hmuna dah',
    problemSolving: 'Harsatna chinfel',
    scheduleFeed: 'Vawiin rutil chanchin',
    recentAlerts: 'Hriattirna thar ber berte',
    clearAlerts: 'Tifai rawh',
    current: 'Tun a mi',
    addAlert: 'Hriattirna siam thar rawh',
    createAlert: 'Siam rawh',
    triggerCall: 'Enkoltu call rawh',
    callCaregiver: 'Enkoltu call',
    clearAll: 'Thian fai vek rawh',
    noAlerts: 'Hriattirna a awm lo.',
    addCustomRem: 'Reminder thar siam rawh',
    addReminderBtn: 'Siam rawh',
    remTitle: 'Reminder Hming',
    remTime: 'A hun',
    activeNow: 'Nung mek',
    today: 'Vawiin',
    weeklyLogs: 'Kar khat chanchin',
    completed: 'Zawh tawh',
    upcoming: 'La awm tur',
    cgQuickActions: 'Enkoltu chet zung zungna',
    callRavi: 'Ravi call rawh',
    quickAddRem: 'Reminder siam thutna',
    sendAlert: 'Hriattirna thawn rawh',
    bannerText: '“Kan inkawp tlat hian ni tha zawk leh hriatna tha zawk kan siam thei a ni.”',
    activityOverview: 'Chet dan thlirna',
    activitySub: 'Ni 7 kaltava hna thawh zawh dan.',
    standard: 'A pangngai',
    toastPhotoSuccess: 'Profile thlalak thlak hlawhtlin a ni e!',
    toastCallConnecting: '{name} speaker device nen inthlung mek a ni...',
    logNewReminder: 'Reminder thar dah a ni: {title}',
    scheduledFromCg: 'Enkoltu panel atanga ruahman',
    welcome: 'Lo lawm e,',
    weeklyLogsOverview: 'Weekly Logs / Enna',
    dailyStatus: 'Daily Status',
    weeklyInsights: 'Kar khat chanchin',
    completedActivitiesTrend: 'Hna thawh zawh dan trend',
    memoryPerformanceTrend: 'Memory Performance Trend',
    overall: 'A vaiin',
    noPerfData: 'Point hmuh a la awm lo',
    noPerfDataDesc: 'Scores en turin brain games khel rawh.',
    placeholderBringWater: 'kd. Tui hi khum bulah chhawp rawh',
    viewProfile: 'Enkoltu Profile',
    photoUploadHelper: 'Thlalak thar dahna',
    selectPatient: 'Enkoltu thlang rawh:',
    noWeeklyRecords: 'He kar chhung hian hna thawh chanchin a awm lo.',
    doneStatus: 'Zawh tawহ',
    missedStatus: 'Hmaih',
    pendingStatus: 'La hmabak',
    noTasks: 'Hnathawh tur a awm lo',
    noActivity: 'Activity a awm lo'
  },
  Nagamese: {
    perfArea: 'Area hisap te performance',
    perfSub: "Dhemak laga alag alag part te patient laga point.",
    memory: 'Memory',
    attention: 'Attention',
    problemSolving: 'Problem solving',
    scheduleFeed: 'Aji laga schedule list',
    recentAlerts: 'Naya alert khan',
    clearAlerts: 'Clear koribi',
    current: 'Huni thaka',
    addAlert: 'Naya alert add koribi',
    createAlert: 'Alert banabi',
    triggerCall: 'Caregiver ke call koribi',
    callCaregiver: 'Caregiver call',
    clearAll: 'Sob clear koribi',
    noAlerts: 'Kuntu alert bi nai.',
    addCustomRem: 'Naya reminder add koribi',
    addReminderBtn: 'Add koribi',
    remTitle: 'Reminder Title',
    remTime: 'Time',
    activeNow: 'Active ase',
    today: 'Aji',
    weeklyLogs: 'Hapta laga log',
    completed: 'Khatam hoise',
    upcoming: 'Ahibole thaka',
    cgQuickActions: 'Caregiver quick actions',
    callRavi: 'Ravi ke call koribi',
    quickAddRem: 'Quick add reminder',
    sendAlert: 'Patient device te pathabi',
    bannerText: '“Mili kena hobo, ami khan bhal din aru dhemak bhal koribole modot kore.”',
    activityOverview: 'Activity list chabi',
    activitySub: 'Past 7 days te task completed hoise.',
    standard: 'Standard',
    toastPhotoSuccess: 'Profile photo updated successfully!',
    toastCallConnecting: '{name} laga device speaker logote connect kuriase...',
    logNewReminder: 'Naya reminder add hoise: {title}',
    scheduledFromCg: 'Caregiver panel pora schedule hoise',
    welcome: 'Welcome,',
    weeklyLogsOverview: 'Weekly Logs / Overview',
    dailyStatus: 'Daily Status',
    weeklyInsights: 'Weekly Insights',
    completedActivitiesTrend: 'Completed Activities Trend',
    memoryPerformanceTrend: 'Memory Performance Trend',
    overall: 'Overall',
    noPerfData: 'No performance data yet',
    noPerfDataDesc: 'Brain games khelikena point chabi.',
    placeholderBringWater: 'e.g. Bring water to bedroom',
    viewProfile: 'Caregiver Profile',
    photoUploadHelper: 'Upload new photo',
    selectPatient: 'Patient select kuribi:',
    noWeeklyRecords: 'Etu hapta te kuntu activity list nai.',
    doneStatus: 'Done',
    missedStatus: 'Miss hoise',
    pendingStatus: 'Pending',
    noTasks: 'No tasks',
    noActivity: 'No activity'
  },
  Tripuri: {
    perfArea: 'Kogntiom performance',
    perfSub: "Nini nokhor nangkha hinba performance.",
    memory: 'Memory',
    attention: 'Attention',
    problemSolving: 'Problem solving',
    scheduleFeed: 'Chadi schedule chadi',
    recentAlerts: 'Alert chadi',
    clearAlerts: 'Clear chadi',
    current: 'Kaisa',
    addAlert: 'Add Alert chadi',
    createAlert: 'Alert chadi',
    triggerCall: 'Caregiver phone chadi',
    callCaregiver: 'Caregiver phone',
    clearAll: 'Clear chadi',
    noAlerts: 'Alert chengla.',
    addCustomRem: 'Add Reminder chadi',
    addReminderBtn: 'Add chadi',
    remTitle: 'Reminder name',
    remTime: 'Time',
    activeNow: 'Active',
    today: 'Chadi',
    weeklyLogs: 'Weekly log',
    completed: 'Completed',
    upcoming: 'Upcoming',
    cgQuickActions: 'Caregiver quick actions',
    callRavi: 'Ravino phone khamdi',
    quickAddRem: 'Reminder add khamdi',
    sendAlert: 'Patient device te send khamdi',
    bannerText: '“Saimung tikhidi, chwng kaham kok rok phunglai tongdi.”',
    activityOverview: 'Activity overview chadi',
    activitySub: 'Past 7 days task complete.',
    standard: 'Standard',
    toastPhotoSuccess: 'Profile photo updated successfully!',
    toastCallConnecting: '{name} laga device speaker logote connect kuriase...',
    logNewReminder: 'Naya reminder add hoise: {title}',
    scheduledFromCg: 'Caregiver panel pora schedule hoise',
    welcome: 'Welcome,',
    weeklyLogsOverview: 'Weekly Logs / Overview',
    dailyStatus: 'Daily Status',
    weeklyInsights: 'Weekly Insights',
    completedActivitiesTrend: 'Completed Activities Trend',
    memoryPerformanceTrend: 'Memory Performance Trend',
    overall: 'Overall',
    noPerfData: 'No performance data yet',
    noPerfDataDesc: 'Brain games khalikena point chadi.',
    placeholderBringWater: 'e.g. Bring water to bedroom',
    viewProfile: 'Caregiver Profile',
    photoUploadHelper: 'Upload new photo',
    selectPatient: 'Patient select khamdi:',
    noWeeklyRecords: 'Etu hapta te kuntu activity list chengla.',
    doneStatus: 'Done',
    missedStatus: 'Miss khamkha',
    pendingStatus: 'Pending',
    noTasks: 'No tasks',
    noActivity: 'No activity'
  }
};export const CaregiverDashboard: React.FC = () => {
  const { t, language } = useLanguage();
  const cgt = localCgTranslations[language] || localCgTranslations.English;
  const currentUser = storageService.getCurrentUser();
  const allProfiles = storageService.getProfiles();
  
  // Filter assigned patients
  const assignedIds = currentUser?.assignedPatients || ['ramesh_1', 'ravi-demo'];
  const assignedPatients = allProfiles.filter(p => p.role === 'Patient' && assignedIds.includes(p.id));
  
  // Helper to extract the day of the week (Monday=1, Sunday=7) for current date in Asia/Kolkata timezone
  const getCurrentDayOfWeekIST = (): number => {
    try {
      const now = new Date();
      const formatter = new Intl.DateTimeFormat('en-US', {
        timeZone: 'Asia/Kolkata',
        weekday: 'short'
      });
      const weekdayStr = formatter.format(now); // "Mon", "Tue", etc.
      const weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
      const index = weekdays.indexOf(weekdayStr);
      return index !== -1 ? index + 1 : 7;
    } catch {
      return 7;
    }
  };

  const currentDayLimit = getCurrentDayOfWeekIST();

  const [selectedPatientId, setSelectedPatientId] = useState<string>(() => {
    const saved = localStorage.getItem('sb_caregiver_selected_patient_id');
    if (saved && assignedIds.includes(saved)) return saved;
    return assignedIds[0] || 'ravi-demo';
  });

  const monitoredPatient = allProfiles.find(p => p.id === selectedPatientId) || { name: 'Ravi' };
  const userName = monitoredPatient.name;

  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [schedule, setSchedule] = useState<Activity[]>([]);
  const [alerts, setAlerts] = useState<CaregiverAlert[]>([]);
  const [mood, setMood] = useState('Good');
  const [games, setGames] = useState<GameScore[]>([]);
  const [dashboardView, setDashboardView] = useState<'today' | 'weekly'>('today');
  const [reminderTitle, setReminderTitle] = useState('');
  const [reminderTime, setReminderTime] = useState('14:00');
  const [showAddReminder, setShowAddReminder] = useState(false);

  const [activeUser, setActiveUser] = useState(currentUser);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setPhotoPreview(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleConfirmPhoto = () => {
    if (!photoPreview || !activeUser) return;
    storageService.updateProfilePhoto(activeUser.id, photoPreview);
    const updatedUser = { ...activeUser, photo: photoPreview };
    setActiveUser(updatedUser);
    setPhotoPreview(null);
    triggerToast(cgt.toastPhotoSuccess);
  };

  const handleCancelPhotoPreview = () => {
    setPhotoPreview(null);
  };

  const handlePatientChange = (patientId: string) => {
    setSelectedPatientId(patientId);
    localStorage.setItem('sb_caregiver_selected_patient_id', patientId);
    
    // Reload patient-specific data
    setReminders(storageService.getReminders());
    setSchedule(storageService.getSchedule());
    setAlerts(storageService.getAlerts());
    setMood(storageService.getMood());
    setGames(storageService.getGames());
  };

  useEffect(() => {
    storageService.init();
    
    // Set initial selected patient ID scope in localStorage
    localStorage.setItem('sb_caregiver_selected_patient_id', selectedPatientId);

    const loadData = () => {
      setReminders(storageService.getReminders());
      setSchedule(storageService.getSchedule());
      setAlerts(storageService.getAlerts());
      setMood(storageService.getMood());
      setGames(storageService.getGames());
    };

    loadData();

    // Cross-tab and local storage synchronization
    window.addEventListener('storage', loadData);
    return () => {
      window.removeEventListener('storage', loadData);
    };
  }, []);

  const handleAddReminder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reminderTitle.trim()) return;

    const newRem: Reminder = {
      id: `rem-${Date.now()}`,
      category: 'other',
      title: reminderTitle,
      description: cgt.scheduledFromCg,
      time: reminderTime,
      date: getISODateString(),
      status: 'Scheduled',
      repeat: 'Once',
      enabled: true
    };

    const updatedReminders = [newRem, ...reminders];
    setReminders(updatedReminders);
    storageService.saveReminders(updatedReminders);

    // Add alert
    const updatedAlerts: CaregiverAlert[] = [
      { id: `al-${Date.now()}`, type: 'info', title: cgt.logNewReminder.replace('{title}', reminderTitle), time: 'Just now' },
      ...alerts
    ];
    setAlerts(updatedAlerts);
    storageService.saveAlerts(updatedAlerts);

    setReminderTitle('');
    setShowAddReminder(false);
  };

  const handleClearAlerts = () => {
    storageService.saveAlerts([]);
    setAlerts([]);
  };

  const handleCallRavi = () => {
    alert(cgt.toastCallConnecting.replace('{name}', userName));
  };

  // Calculations for summary stats
  const totalGames = games.length || 6;
  const completedGames = games.filter(g => g.completedToday).length;
  const gamePct = totalGames ? Math.round((completedGames / totalGames) * 100) : 0;

  const totalTasks = schedule.length;
  const completedTasks = schedule.filter(s => s.completed).length;
  const taskPct = totalTasks ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const totalReminders = reminders.length;
  const completedReminders = reminders.filter(r => r.status === 'Completed').length;
  const reminderPct = totalReminders ? Math.round((completedReminders / totalReminders) * 100) : 0;

  // Cognitive Area Calculation
  const mmScore = games.find(g => g.gameId === 'game-1')?.bestScore || 0;
  const soScore = games.find(g => g.gameId === 'game-2')?.bestScore || 0;
  const afScore = games.find(g => g.gameId === 'game-3')?.bestScore || 0;
  const orScore = games.find(g => g.gameId === 'game-4')?.bestScore || 0;
  const drScore = games.find(g => g.gameId === 'game-5')?.bestScore || 0;
  const lmScore = games.find(g => g.gameId === 'game-6')?.bestScore || 0;

  const getAreaScore = (scores: number[], defaultVal: number) => {
    const played = scores.filter(s => s > 0);
    if (played.length === 0) return defaultVal;
    return Math.round(played.reduce((a, b) => a + b, 0) / played.length);
  };

  const memoryScore = getAreaScore([mmScore, soScore, orScore, drScore], 0);
  const attentionScore = getAreaScore([afScore, orScore], 0);
  const problemSolvingScore = getAreaScore([soScore, drScore], 0);
  const languageScore = getAreaScore([lmScore], 0);
  const overallScore = getAreaScore([mmScore, soScore, afScore, orScore, drScore, lmScore], 0);

  // Compute memory/cognitive performance trend over time based on actual game sessions history
  const getMemoryHistoryWeeks = () => {
    const sessions = storageService.getGameSessions();
    const weeksTrend = [];
    
    // Fallback if no game sessions are recorded yet
    if (!sessions || sessions.length === 0) {
      return [
        { label: 'Week 1', score: memoryScore || 70 },
        { label: 'Week 2', score: memoryScore || 75 },
        { label: 'Week 3', score: memoryScore || 78 },
        { label: 'Week 4', score: memoryScore || 82 }
      ];
    }

    // Sort session items chronologically
    const sorted = [...sessions].sort((a, b) => new Date(a.completedAt || 0).getTime() - new Date(b.completedAt || 0).getTime());
    
    // Group game sessions into 4 blocks of items representing sequential weeks/periods
    const blockSize = Math.max(1, Math.ceil(sorted.length / 4));
    for (let i = 0; i < 4; i++) {
      const startIdx = i * blockSize;
      const block = sorted.slice(startIdx, startIdx + blockSize);
      if (block.length > 0) {
        // Average best scores in this block for memory games (game-1, game-2, game-4, game-5)
        const blockScores = block.map(s => s.score || 0).filter(sc => sc > 0);
        const avgScore = blockScores.length > 0 
          ? Math.round((blockScores.reduce((a, b) => a + b, 0) / blockScores.length) * 10) / 10
          : 60 + i * 5; // incremental trend baseline
        weeksTrend.push({
          label: `Week ${i + 1}`,
          score: Math.min(100, Math.max(0, Math.round(avgScore)))
        });
      } else {
        // Fallback default progression curve centered around current memory score
        weeksTrend.push({
          label: `Week ${i + 1}`,
          score: Math.min(100, Math.max(0, Math.round((memoryScore || 75) - (3 - i) * 4)))
        });
      }
    }
    return weeksTrend;
  };

  const memoryHistoryWeeks = getMemoryHistoryWeeks();

  // Helper to parse time in IST and check if it has passed
  const isTimeInPast = (timeStr: string, dateStr: string): boolean => {
    try {
      const now = new Date();
      const formatter = new Intl.DateTimeFormat('en-US', {
        timeZone: 'Asia/Kolkata',
        year: 'numeric', month: 'numeric', day: 'numeric',
        hour: 'numeric', minute: 'numeric', hour12: false
      });
      const parts = formatter.formatToParts(now);
      const getVal = (type: string) => parseInt(parts.find(p => p.type === type)?.value || '0', 10);
      const currentYear = getVal('year');
      const currentMonth = getVal('month');
      const currentDay = getVal('day');
      const currentHour = getVal('hour');
      const currentMinute = getVal('minute');

      const dateParts = dateStr.split('-');
      const targetYear = parseInt(dateParts[0], 10);
      const targetMonth = parseInt(dateParts[1], 10);
      const targetDay = parseInt(dateParts[2], 10);

      // Clean 12-hour or 24-hour time formats
      let hours = 12;
      let minutes = 0;
      const cleanTime = timeStr.trim().toUpperCase();
      const matches12 = cleanTime.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/);
      if (matches12) {
        hours = parseInt(matches12[1], 10);
        minutes = parseInt(matches12[2], 10);
        if (hours === 12) hours = 0;
        if (matches12[3] === 'PM') hours += 12;
      } else {
        const matches24 = cleanTime.match(/^(\d{1,2}):(\d{2})$/);
        if (matches24) {
          hours = parseInt(matches24[1], 10);
          minutes = parseInt(matches24[2], 10);
        }
      }

      if (currentYear > targetYear) return true;
      if (currentYear < targetYear) return false;
      if (currentMonth > targetMonth) return true;
      if (currentMonth < targetMonth) return false;
      if (currentDay > targetDay) return true;
      if (currentDay < targetDay) return false;

      if (currentHour > hours) return true;
      if (currentHour < hours) return false;
      return currentMinute >= minutes;
    } catch {
      return true;
    }
  };

  // Get start of the current week (Monday) in Asia/Kolkata (IST)
  const getStartOfWeekIST = (): Date => {
    const now = new Date();
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: 'Asia/Kolkata',
      year: 'numeric', month: 'numeric', day: 'numeric',
      hour: 'numeric', minute: 'numeric', hour12: false
    });
    const parts = formatter.formatToParts(now);
    const getVal = (type: string) => parseInt(parts.find(p => p.type === type)?.value || '0', 10);
    
    // Construct local date matching the timezone
    const localDate = new Date(getVal('year'), getVal('month') - 1, getVal('day'), getVal('hour'), getVal('minute'));
    
    // Set to Monday of current week
    const day = localDate.getDay(); // 0 is Sunday, 1 is Monday
    const diff = localDate.getDate() - day + (day === 0 ? -6 : 1);
    const monday = new Date(localDate);
    monday.setDate(diff);
    monday.setHours(0, 0, 0, 0);
    return monday;
  };

  const getWeeklyOverviewData = () => {
    const days = [];
    const weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const startOfWeek = getStartOfWeekIST();

    for (let i = 0; i < 7; i++) {
      const d = new Date(startOfWeek);
      d.setDate(startOfWeek.getDate() + i);
      const dateStr = d.toISOString().split('T')[0];
      const label = weekdays[i];

      // Retrieve real schedules and reminders completed/scheduled/missed
      const daySchedule = schedule.filter(s => {
        const itemDate = s.date || new Date().toISOString().split('T')[0];
        return itemDate === dateStr;
      });

      const dayReminders = reminders.filter(r => {
        const itemDate = r.date || new Date().toISOString().split('T')[0];
        return itemDate === dateStr;
      });

       let completed = 0;
       let missed = 0;
       let pending = 0;

       // Verify if the day is in the future relative to local IST (Asia/Kolkata) date.
       // We calculate the current local calendar date components.
       const checkFutureDay = (): boolean => {
         try {
           const now = new Date();
           const formatter = new Intl.DateTimeFormat('en-US', {
             timeZone: 'Asia/Kolkata',
             year: 'numeric', month: 'numeric', day: 'numeric'
           });
           const parts = formatter.formatToParts(now);
           const getVal = (type: string) => parseInt(parts.find(p => p.type === type)?.value || '0', 10);
           const currentYear = getVal('year');
           const currentMonth = getVal('month');
           const currentDay = getVal('day');

           const dateParts = dateStr.split('-');
           const targetYear = parseInt(dateParts[0], 10);
           const targetMonth = parseInt(dateParts[1], 10);
           const targetDay = parseInt(dateParts[2], 10);

           if (targetYear > currentYear) return true;
           if (targetYear < currentYear) return false;
           if (targetMonth > currentMonth) return true;
           if (targetMonth < currentMonth) return false;
           return targetDay > currentDay;
         } catch {
           return false;
         }
       };

       const isFutureDay = checkFutureDay();

       if (isFutureDay) {
         // Future activity is always treated as pending/upcoming. Never completed or missed.
         pending = daySchedule.length + dayReminders.length;
       } else {
         // Classify schedule tasks
         daySchedule.forEach(item => {
           if (item.completed) {
             completed++;
           } else {
             // Check if time has passed
             if (isTimeInPast(item.time, dateStr)) {
               missed++;
             } else {
               pending++;
             }
           }
         });

         // Classify reminders
         dayReminders.forEach(item => {
           if (item.status === 'Completed') {
             completed++;
           } else if (item.status === 'Missed') {
             missed++;
           } else {
             if (isTimeInPast(item.time, dateStr)) {
               missed++;
             } else {
               pending++;
             }
           }
         });
       }

       days.push({
         label,
         dateStr,
         completed,
         missed,
         pending,
         total: completed + missed + pending
       });
     }
     return days;
   };

  const weeklyOverview = getWeeklyOverviewData();

  // Summary tallies
  const totalCompleted = weeklyOverview.reduce((acc, d) => acc + d.completed, 0);
  const totalMissed = weeklyOverview.reduce((acc, d) => acc + d.missed, 0);
  const totalPending = weeklyOverview.reduce((acc, d) => acc + d.pending, 0);
  const hasActivityRecords = weeklyOverview.some(d => d.total > 0);

  // Alerts based on metrics
  const getAlertsForWeek = () => {
    const logsAlerts: string[] = [];
    weeklyOverview.forEach(d => {
      if (d.missed > 0) {
        logsAlerts.push(`⚠️ ${d.missed} activities missed on ${d.label}`);
      }
      if (d.total > 0 && d.completed === d.total) {
        logsAlerts.push(`✓ Excellent — all activities completed on ${d.label}`);
      }
    });
    return logsAlerts.slice(0, 3);
  };
  const weeklyAlerts = getAlertsForWeek();

  const maxCount = Math.max(...weeklyOverview.map(w => w.total), 5);

  const getWeekRangeLabel = () => {
    const start = getStartOfWeekIST();
    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${start.getDate()} ${months[start.getMonth()]} – ${end.getDate()} ${months[end.getMonth()]} ${end.getFullYear()}`;
  };

  const currentDict = localCgTranslations[language] || localCgTranslations.English;

  return (
    <div className="pb-12 space-y-8 max-w-7xl mx-auto">
      
      {/* Dashboard Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-brand-purpleLight shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-extrabold text-brand-navy">{currentDict.welcome} {currentUser?.name || 'Caregiver'}!</h1>
            <span className="flex items-center gap-1.5 bg-brand-greenBg text-brand-green text-xs font-bold px-2.5 py-1 rounded-full">
              <span className="w-2.5 h-2.5 rounded-full bg-brand-green animate-ping" />
              {currentDict.activeNow}
            </span>
          </div>
          <p className="text-brand-grayText font-semibold mt-1">{t('cg.patient').replace('Ravi Kumar', userName)}</p>
          {assignedPatients.length > 1 && (
            <div className="mt-3 flex items-center gap-2">
              <label className="text-xs font-black text-brand-navy uppercase tracking-wider">{currentDict.selectPatient}</label>
              <select
                value={selectedPatientId}
                onChange={(e) => handlePatientChange(e.target.value)}
                className="px-3 py-1.5 rounded-xl border border-brand-purpleLight bg-brand-lavender text-xs font-bold text-brand-navy focus:outline-none focus:border-brand-purple"
              >
                {assignedPatients.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>
          )}
        </div>
        <div className="flex items-center gap-4 flex-shrink-0">
          <div className="flex items-center bg-brand-lavender p-1.5 rounded-2xl gap-1">
            <button 
              onClick={() => setDashboardView('today')}
              className={`px-4 py-2 rounded-xl font-bold text-sm transition-all ${
                dashboardView === 'today' 
                  ? 'bg-brand-purple text-white shadow-sm' 
                  : 'text-brand-grayText hover:bg-brand-purple/10'
              }`}
            >
              {currentDict.today}
            </button>
            <button 
              onClick={() => setDashboardView('weekly')}
              className={`px-4 py-2 rounded-xl font-bold text-sm transition-all ${
                dashboardView === 'weekly' 
                  ? 'bg-brand-purple text-white shadow-sm' 
                  : 'text-brand-grayText hover:bg-brand-purple/10'
              }`}
            >
              {currentDict.weeklyLogs}
            </button>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <span className="block font-bold text-brand-navy text-sm sm:text-base truncate">{currentUser?.name || 'Caregiver'}</span>
              <span className="text-[10px] sm:text-xs text-brand-purple bg-brand-purpleLight px-2 py-0.5 rounded-full font-bold">
                {currentUser?.role || 'Caregiver'}
              </span>
            </div>
            <button 
              onClick={() => {
                setShowProfileModal(true);
                setPhotoPreview(null);
              }}
              className="w-12 h-12 sm:w-14 sm:h-14 rounded-full border-2 border-brand-purple overflow-hidden flex items-center justify-center bg-brand-purpleLight hover:scale-105 active:scale-95 transition-all focus:outline-none"
              title="View Profile Details"
            >
              {activeUser?.photo ? (
                <img src={activeUser.photo} alt={currentUser?.name || 'Caregiver'} className="w-full h-full object-cover" />
              ) : (
                <SVGCaregiverAvatar className="w-full h-full" />
              )}
            </button>
          </div>
        </div>
      </div>

      {dashboardView === 'today' && (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Games Completed */}
            <div className="bg-white p-5 rounded-2xl border border-brand-purpleLight shadow-sm flex flex-col justify-between h-36">
              <div className="flex items-center justify-between text-brand-purple">
                <Gamepad2 className="w-8 h-8" />
                <span className="text-sm font-black bg-brand-purpleLight px-2 py-0.5 rounded-full">{gamePct}%</span>
              </div>
              <div>
                <h3 className="text-brand-grayText font-bold text-xs uppercase tracking-wider">{t('cg.games')}</h3>
                <p className="text-2xl font-extrabold text-brand-navy mt-1">{completedGames} / {totalGames}</p>
              </div>
            </div>

            {/* Tasks Completed */}
            <div className="bg-white p-5 rounded-2xl border border-brand-purpleLight shadow-sm flex flex-col justify-between h-36">
              <div className="flex items-center justify-between text-brand-green">
                <CheckSquare className="w-8 h-8" />
                <span className="text-sm font-black bg-brand-greenBg px-2 py-0.5 rounded-full">{taskPct}%</span>
              </div>
              <div>
                <h3 className="text-brand-grayText font-bold text-xs uppercase tracking-wider">{t('cg.tasks')}</h3>
                <p className="text-2xl font-extrabold text-brand-navy mt-1">{completedTasks} / {totalTasks}</p>
              </div>
            </div>

            {/* Reminders Taken */}
            <div className="bg-white p-5 rounded-2xl border border-brand-purpleLight shadow-sm flex flex-col justify-between h-36">
              <div className="flex items-center justify-between text-brand-orange">
                <Bell className="w-8 h-8" />
                <span className="text-sm font-black bg-brand-orangeBg px-2 py-0.5 rounded-full">{reminderPct}%</span>
              </div>
              <div>
                <h3 className="text-brand-grayText font-bold text-xs uppercase tracking-wider">{t('cg.reminders')}</h3>
                <p className="text-2xl font-extrabold text-brand-navy mt-1">{completedReminders} / {totalReminders}</p>
              </div>
            </div>

            {/* Patient Mood */}
            <div className="bg-white p-5 rounded-2xl border border-brand-purpleLight shadow-sm flex flex-col justify-between h-36">
              <div className="flex items-center justify-between text-brand-blue">
                <Smile className="w-8 h-8" />
                <span className="text-sm font-bold bg-brand-lavender text-brand-purple px-2.5 py-0.5 rounded-full">{currentDict.standard}</span>
              </div>
              <div>
                <h3 className="text-brand-grayText font-bold text-xs uppercase tracking-wider">{t('cg.mood')}</h3>
                <p className="text-2xl font-extrabold text-brand-navy mt-1">{mood}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Performance by area (Donut chart) */}
            <div className="bg-white p-6 rounded-3xl border border-brand-purpleLight shadow-sm space-y-4">
              <h3 className="font-extrabold text-xl text-brand-navy">{currentDict.perfArea}</h3>
              <p className="text-sm text-brand-grayText">{currentDict.perfSub}</p>
              
              <div className="flex justify-center relative items-center py-4">
                <svg viewBox="0 0 160 160" className="w-40 h-40">
                  <circle cx="80" cy="80" r="70" fill="none" stroke="#f1efff" strokeWidth="18" />
                  <circle 
                    cx="80" cy="80" r="70" 
                    fill="none" 
                    stroke="#5B5BD6" 
                    strokeWidth="18" 
                    strokeDasharray={`${Math.round((overallScore / 100) * 440)} 440`} 
                    strokeDashoffset="0" 
                    strokeLinecap="round"
                    transform="rotate(-90 80 80)"
                  />
                </svg>
                <div className="absolute text-center flex flex-col items-center justify-center p-2">
                  {overallScore === 0 ? (
                    <span className="block text-xs font-black text-brand-grayText uppercase leading-tight max-w-[80px]">{currentDict.noPerfData}</span>
                  ) : (
                    <>
                      <span className="block text-2xl font-black text-brand-navy">{overallScore}%</span>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-brand-grayText">{currentDict.overall}</span>
                    </>
                  )}
                </div>
              </div>

              <div className="space-y-3 pt-2 text-xs font-semibold">
                <div className="flex justify-between items-center">
                  <span className="text-brand-grayText">{currentDict.memory}</span>
                  <span className="font-black text-brand-navy">{memoryScore}%</span>
                </div>
                <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-brand-purple h-full" style={{ width: `${memoryScore}%` }} />
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-brand-grayText">{currentDict.attention}</span>
                  <span className="font-black text-brand-navy">{attentionScore}%</span>
                </div>
                <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-brand-purple h-full" style={{ width: `${attentionScore}%` }} />
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-brand-grayText">{currentDict.problemSolving}</span>
                  <span className="font-black text-brand-navy">{problemSolvingScore}%</span>
                </div>
                <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-brand-purple h-full" style={{ width: `${problemSolvingScore}%` }} />
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-brand-grayText">{currentDict.language || 'Language'}</span>
                  <span className="font-black text-brand-navy">{languageScore}%</span>
                </div>
                <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-brand-purple h-full" style={{ width: `${languageScore}%` }} />
                </div>
              </div>
            </div>

            {/* Today's Schedule Card */}
            <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-brand-purpleLight shadow-sm space-y-4">
              <h3 className="font-extrabold text-xl text-brand-navy">{currentDict.scheduleFeed}</h3>
              <div className="space-y-4">
                {schedule.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-3.5 rounded-xl border border-brand-purpleLight">
                    <div className="flex items-center gap-3">
                      <span className={`w-3.5 h-3.5 rounded-full ${
                        item.completed 
                          ? 'bg-brand-green' 
                          : item.isCurrent 
                            ? 'bg-brand-orange animate-pulse' 
                            : 'bg-gray-300'
                      }`} />
                      <span className="font-black text-sm text-brand-purple min-w-[70px]">{item.time}</span>
                      <span className="font-bold text-brand-navy">{item.title}</span>
                    </div>
                    <span className={`text-xs font-black px-2.5 py-1 rounded-full ${
                      item.completed 
                        ? 'bg-brand-greenBg text-brand-green' 
                        : item.isCurrent 
                          ? 'bg-brand-orangeBg text-brand-orange' 
                          : 'bg-gray-100 text-brand-grayText'
                    }`}>
                      {item.completed ? '✓ ' + currentDict.completed : item.isCurrent ? '⚠ ' + currentDict.current : '○ ' + currentDict.upcoming}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Alerts & Caregiver Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-brand-purpleLight shadow-sm space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-extrabold text-xl text-brand-navy">{currentDict.recentAlerts}</h3>
                {alerts.length > 0 && (
                  <button 
                    onClick={handleClearAlerts}
                    className="text-xs text-brand-red hover:underline font-bold"
                  >
                    {currentDict.clearAll}
                  </button>
                )}
              </div>

              {alerts.length === 0 ? (
                <p className="text-center py-6 text-brand-grayText text-sm font-semibold">{currentDict.noAlerts}</p>
              ) : (
                <div className="space-y-3.5">
                  {alerts.map((al) => (
                    <div key={al.id} className={`flex items-start gap-3 p-3 rounded-xl border ${
                      al.type === 'warning' ? 'bg-brand-redBg border-brand-red text-brand-red' : 'bg-brand-greenBg border-brand-green text-brand-green'
                    }`}>
                      <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                      <div>
                        <h4 className="font-bold text-sm text-brand-navy">{al.title}</h4>
                        <span className="text-[10px] text-brand-grayText font-semibold block mt-0.5">{al.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-white p-6 rounded-3xl border border-brand-purpleLight shadow-sm space-y-4">
              <h3 className="font-extrabold text-xl text-brand-navy">{currentDict.cgQuickActions}</h3>
              <div className="grid grid-cols-2 gap-3">
                <button 
                  onClick={() => setShowAddReminder(true)}
                  className="flex flex-col items-center justify-center p-4 rounded-xl bg-brand-purpleLight text-brand-purple hover:bg-brand-purple hover:text-white transition-all font-bold gap-2 text-center"
                >
                  <Plus className="w-6 h-6" />
                  <span className="text-xs">{currentDict.addReminderBtn}</span>
                </button>
                <button 
                  onClick={handleCallRavi}
                  className="flex flex-col items-center justify-center p-4 rounded-xl bg-brand-purpleLight text-brand-purple hover:bg-brand-purple hover:text-white transition-all font-bold gap-2 text-center"
                >
                  <Phone className="w-6 h-6" />
                  <span className="text-xs">{currentDict.callRavi.replace('Ravi', userName).replace('ৰবী', userName).replace('রবি', userName)}</span>
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Weekly Logs View Rendering */}
      {dashboardView === 'weekly' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Weekly Logs Summary Dashboard Section */}
          <div className="lg:col-span-2 bg-white p-6 md:p-8 rounded-3xl border border-brand-purpleLight shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-purpleLight pb-4">
              <div>
                <h3 className="font-extrabold text-xl text-brand-navy">{currentDict.weeklyLogsOverview}</h3>
                <p className="text-sm text-brand-grayText">{getWeekRangeLabel()}</p>
              </div>
              <div className="flex items-center gap-4 text-sm font-bold bg-brand-lavender px-4 py-2.5 rounded-2xl">
                <span className="text-brand-green">✓ {totalCompleted} {currentDict.doneStatus}</span>
                <span className="text-brand-red">! {totalMissed} {currentDict.missedStatus}</span>
                <span className="text-brand-purple">○ {totalPending} {currentDict.pendingStatus}</span>
              </div>
            </div>

            {!hasActivityRecords ? (
              <div className="text-center py-12">
                <p className="text-brand-grayText font-bold text-lg">{currentDict.noWeeklyRecords}</p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Mon-Sun Daily Grid Layout */}
                <div>
                  <h4 className="text-xs font-black text-brand-navy uppercase tracking-wider mb-3">{currentDict.dailyStatus}</h4>
                  
                  {/* Desktop/Tablet 7-column layout */}
                  <div className="hidden sm:grid grid-cols-7 gap-3 text-center">
                    {weeklyOverview.map((day) => {
                      const statusSymbol = day.total === 0 ? '-' : day.missed > 0 ? '!' : '✓';
                      const statusColor = day.total === 0 
                        ? 'bg-gray-100 text-brand-grayText border-gray-200' 
                        : day.missed > 0 
                          ? 'bg-brand-redBg text-brand-red border-brand-red' 
                          : 'bg-brand-greenBg text-brand-green border-brand-green';
                      
                      return (
                        <div key={day.dateStr} className={`p-3.5 rounded-2xl border ${statusColor} flex flex-col justify-between h-28`}>
                          <span className="text-xs font-black uppercase tracking-wider">{day.label}</span>
                          <span className="text-2xl font-black">{statusSymbol}</span>
                          <span className="text-[10px] font-bold">
                            {day.total > 0 ? `${day.completed}/${day.total}` : currentDict.noTasks}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Mobile vertical scrolling representation */}
                  <div className="sm:hidden space-y-2">
                    {weeklyOverview.map((day) => {
                      const statusSymbol = day.total === 0 ? '-' : day.missed > 0 ? '!' : '✓';
                      const statusColor = day.total === 0 
                        ? 'bg-gray-50 text-brand-grayText' 
                        : day.missed > 0 
                          ? 'bg-brand-redBg text-brand-red' 
                          : 'bg-brand-greenBg text-brand-green';

                      return (
                        <div key={day.dateStr} className={`flex items-center justify-between p-3.5 rounded-2xl border border-brand-purpleLight ${statusColor}`}>
                          <div className="flex items-center gap-3">
                            <span className="font-black text-base">{day.label}</span>
                            <span className="text-xs font-semibold">
                              {day.total > 0 ? `(${day.completed}/${day.total} ${currentDict.completed.toLowerCase()})` : currentDict.noActivity}
                            </span>
                          </div>
                          <span className="font-black text-lg">{statusSymbol}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Weekly Alerts Panel */}
                {weeklyAlerts.length > 0 && (
                  <div className="bg-brand-lavender border border-brand-purpleLight p-4 rounded-2xl space-y-2 text-left">
                    <h4 className="text-[10px] font-black text-brand-navy uppercase tracking-wider">{currentDict.weeklyInsights}</h4>
                    <div className="space-y-1 text-sm font-semibold">
                      {weeklyAlerts.map((al, idx) => (
                        <p key={idx} className="text-brand-navy">{al}</p>
                      ))}
                    </div>
                  </div>
                )}

                {/* Compact Completed Trends Visualizer (Line Graph - Dynamic Current Day Range Only) */}
                <div>
                  <h4 className="text-xs font-black text-brand-navy uppercase tracking-wider mb-3">{currentDict.completedActivitiesTrend}</h4>
                  <div className="pt-2 bg-brand-lavender/30 p-4 rounded-2xl border border-brand-purpleLight">
                    {/* SVG Line Graph */}
                    <svg viewBox="0 0 500 180" className="w-full h-44 overflow-visible">
                      {/* Grid / Y-Axis labels */}
                      <g className="text-[10px] fill-brand-grayText font-bold">
                        <text x="10" y="30">{maxCount}</text>
                        <text x="10" y="90">{Math.round(maxCount / 2)}</text>
                        <text x="10" y="150">0</text>
                      </g>
                      
                      {/* Grid Lines */}
                      <line x1="40" y1="25" x2="480" y2="25" stroke="#e6e1ff" strokeWidth="1" />
                      <line x1="40" y1="85" x2="480" y2="85" stroke="#e6e1ff" strokeWidth="1" />
                      <line x1="40" y1="145" x2="480" y2="145" stroke="#e6e1ff" strokeWidth="1" />
                      
                      {/* Line Path - Dynamic Slice */}
                      <path 
                        d={weeklyOverview.slice(0, currentDayLimit).reduce((acc, w, index) => {
                          const x = 45 + index * 65.8;
                          const y = 145 - (w.completed / maxCount) * 120;
                          return acc + (index === 0 ? `M ${x} ${y}` : ` L ${x} ${y}`);
                        }, '')} 
                        fill="none" 
                        stroke="#5B5BD6" 
                        strokeWidth="4" 
                        strokeLinecap="round" 
                      />

                      {/* Area under the line */}
                      {currentDayLimit > 0 && (
                        <path 
                          d={`${weeklyOverview.slice(0, currentDayLimit).reduce((acc, w, index) => {
                            const x = 45 + index * 65.8;
                            const y = 145 - (w.completed / maxCount) * 120;
                            return acc + (index === 0 ? `M ${x} ${y}` : ` L ${x} ${y}`);
                          }, '')} L ${45 + (currentDayLimit - 1) * 65.8} 145 L 45 145 Z`} 
                          fill="url(#trendGrad)" 
                          opacity="0.12" 
                        />
                      )}
                      
                      <defs>
                        <linearGradient id="trendGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#5B5BD6" />
                          <stop offset="100%" stopColor="#5B5BD6" stopOpacity="0" />
                        </linearGradient>
                      </defs>

                      {/* Data Dots & Value Labels */}
                      {weeklyOverview.slice(0, currentDayLimit).map((w, index) => {
                        const x = 45 + index * 65.8;
                        const y = 145 - (w.completed / maxCount) * 120;
                        return (
                          <g key={`point-${index}`}>
                            <circle cx={x} cy={y} r="5" fill="#5B5BD6" stroke="#fff" strokeWidth="2" />
                            <text x={x} y={y - 10} textAnchor="middle" className="text-[9px] fill-brand-purple font-black">{w.completed}</text>
                          </g>
                        );
                      })}

                      {/* X-Axis labels */}
                      <g className="text-[10px] fill-brand-grayText font-bold text-center">
                        {weeklyOverview.slice(0, currentDayLimit).map((w, index) => (
                          <text key={index} x={45 + index * 65.8} y="165" textAnchor="middle">{w.label}</text>
                        ))}
                      </g>
                    </svg>
                  </div>
                </div>

                {/* Subplot: Memory Performance Trend Line Graph */}
                <div className="border-t border-brand-purpleLight pt-6">
                  <h4 className="text-xs font-black text-brand-navy uppercase tracking-wider mb-3">{currentDict.memoryPerformanceTrend}</h4>
                  <div className="pt-2 bg-brand-lavender/30 p-4 rounded-2xl border border-brand-purpleLight">
                    <svg viewBox="0 0 500 180" className="w-full h-44 overflow-visible">
                      {/* Grid / Y-Axis labels (Memory %) */}
                      <g className="text-[10px] fill-brand-grayText font-bold">
                        <text x="10" y="30">100%</text>
                        <text x="10" y="90">50%</text>
                        <text x="10" y="150">0%</text>
                      </g>

                      {/* Grid Lines */}
                      <line x1="40" y1="25" x2="480" y2="25" stroke="#e6e1ff" strokeWidth="1" />
                      <line x1="40" y1="85" x2="480" y2="85" stroke="#e6e1ff" strokeWidth="1" />
                      <line x1="40" y1="145" x2="480" y2="145" stroke="#e6e1ff" strokeWidth="1" />

                      {/* Memory Trend Line Path */}
                      <path 
                        d={memoryHistoryWeeks.reduce((acc, w, index) => {
                          const x = 50 + index * 130;
                          const y = 145 - (w.score / 100) * 120;
                          return acc + (index === 0 ? `M ${x} ${y}` : ` L ${x} ${y}`);
                        }, '')}
                        fill="none"
                        stroke="#0D9488" 
                        strokeWidth="4"
                        strokeLinecap="round"
                      />

                      {/* Area under the line */}
                      <path 
                        d={`${memoryHistoryWeeks.reduce((acc, w, index) => {
                          const x = 50 + index * 130;
                          const y = 145 - (w.score / 100) * 120;
                          return acc + (index === 0 ? `M ${x} ${y}` : ` L ${x} ${y}`);
                        }, '')} L ${50 + 3 * 130} 145 L 50 145 Z`}
                        fill="url(#memGrad)"
                        opacity="0.1"
                      />

                      <defs>
                        <linearGradient id="memGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#0D9488" />
                          <stop offset="100%" stopColor="#0D9488" stopOpacity="0" />
                        </linearGradient>
                      </defs>

                      {/* Dots and Labels */}
                      {memoryHistoryWeeks.map((w, index) => {
                        const x = 50 + index * 130;
                        const y = 145 - (w.score / 100) * 120;
                        return (
                          <g key={`mem-pt-${index}`}>
                            <circle cx={x} cy={y} r="5" fill="#0D9488" stroke="#fff" strokeWidth="2" />
                            <text x={x} y={y - 10} textAnchor="middle" className="text-[9px] fill-teal-700 font-black">{w.score}%</text>
                          </g>
                        );
                      })}

                      {/* X-Axis labels */}
                      <g className="text-[10px] fill-brand-grayText font-bold text-center">
                        {memoryHistoryWeeks.map((w, index) => (
                          <text key={index} x={50 + index * 130} y="165" textAnchor="middle">{w.label}</text>
                        ))}
                      </g>
                    </svg>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Performance by area (Donut chart) */}
          <div className={`bg-white p-6 rounded-3xl border border-brand-purpleLight shadow-sm space-y-4 ${overallScore === 0 ? 'h-auto pb-4' : ''}`}>
            <h3 className="font-extrabold text-xl text-brand-navy">{currentDict.perfArea}</h3>
            <p className="text-sm text-brand-grayText">{currentDict.perfSub}</p>
            
            {overallScore > 0 ? (
              <>
                <div className="flex justify-center relative items-center py-2">
                  <svg viewBox="0 0 160 160" className="w-32 h-32 sm:w-40 sm:h-40">
                    <circle cx="80" cy="80" r="70" fill="none" stroke="#f1efff" strokeWidth="18" />
                    <circle 
                      cx="80" cy="80" r="70" 
                      fill="none" 
                      stroke="#5B5BD6" 
                      strokeWidth="18" 
                      strokeDasharray={`${Math.round((overallScore / 100) * 440)} 440`} 
                      strokeDashoffset="0" 
                      strokeLinecap="round"
                      transform="rotate(-90 80 80)"
                    />
                  </svg>
                  <div className="absolute text-center flex flex-col items-center justify-center p-2">
                    <span className="block text-2xl font-black text-brand-navy">{overallScore}%</span>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-brand-grayText">{currentDict.overall}</span>
                  </div>
                </div>

                <div className="space-y-3 pt-2 text-xs font-semibold">
                  <div className="flex justify-between items-center">
                    <span className="text-brand-grayText">{currentDict.memory}</span>
                    <span className="font-black text-brand-navy">{memoryScore}%</span>
                  </div>
                  <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
                    <div className="bg-brand-purple h-full" style={{ width: `${memoryScore}%` }} />
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-brand-grayText">{currentDict.attention}</span>
                    <span className="font-black text-brand-navy">{attentionScore}%</span>
                  </div>
                  <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
                    <div className="bg-brand-purple h-full" style={{ width: `${attentionScore}%` }} />
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-brand-grayText">{currentDict.problemSolving}</span>
                    <span className="font-black text-brand-navy">{problemSolvingScore}%</span>
                  </div>
                  <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
                    <div className="bg-brand-purple h-full" style={{ width: `${problemSolvingScore}%` }} />
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-brand-grayText">{currentDict.language || 'Language'}</span>
                    <span className="font-black text-brand-navy">{languageScore}%</span>
                  </div>
                </div>
              </>
            ) : (
              <div className="py-6 text-center">
                <span className="block text-sm font-bold text-brand-grayText uppercase leading-tight">No performance data yet</span>
                <p className="text-xs text-brand-grayText mt-1">Play memory match or other brain games to view scores.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Add Reminder Modal */}
      {showAddReminder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-navy bg-opacity-40">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-sm w-full shadow-xl border border-brand-purpleLight">
            <div className="flex justify-between items-center border-b border-brand-purpleLight pb-4 mb-6">
              <h2 className="font-extrabold text-xl text-brand-navy">{currentDict.quickAddRem}</h2>
              <button onClick={() => setShowAddReminder(false)} className="p-1 rounded-lg hover:bg-brand-lavender">
                <X className="w-6 h-6 text-brand-grayText" />
              </button>
            </div>
            
            <form onSubmit={handleAddReminder} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-brand-navy mb-2">{currentDict.remTitle}</label>
                <input
                  type="text"
                  placeholder="e.g. Bring water to bedroom"
                  value={reminderTitle}
                  onChange={(e) => setReminderTitle(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-brand-purpleLight focus:outline-none focus:border-brand-purple text-base"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-brand-navy mb-2">{currentDict.remTime}</label>
                <input
                  type="time"
                  value={reminderTime}
                  onChange={(e) => setReminderTime(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-brand-purpleLight focus:outline-none focus:border-brand-purple text-base"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full mt-6 bg-brand-purple text-white py-3.5 rounded-xl font-bold hover:bg-opacity-95"
              >
                {currentDict.sendAlert}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Footer Caregiver Banner */}
      <div className="bg-brand-purple text-white rounded-3xl p-6 text-center flex flex-col sm:flex-row items-center justify-center gap-3 shadow-md">
        <Heart className="w-6 h-6 fill-white" />
        <p className="font-black text-lg">{currentDict.bannerText}</p>
      </div>

      {toastMessage && (
        <div className="fixed bottom-6 right-6 bg-brand-navy text-white px-6 py-3 rounded-xl shadow-lg flex items-center gap-3 z-50 animate-bounce">
          <span className="font-semibold">{toastMessage}</span>
        </div>
      )}

      {showProfileModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-navy bg-opacity-50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl border border-brand-purpleLight animate-scale-up space-y-6 flex flex-col items-center">
            
            {/* Header / Title */}
            <h3 className="text-2xl font-black text-brand-navy w-full text-center pb-2 border-b border-brand-purpleLight">
              {t('prof.details')}
            </h3>

            {/* Profile Photo / Avatar display with preview */}
            <div className="relative">
              <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full border-4 border-brand-purple overflow-hidden flex items-center justify-center bg-brand-purpleLight shadow-md">
                {photoPreview ? (
                  <img src={photoPreview} alt="Preview" className="w-full h-full object-cover animate-pulse" />
                ) : activeUser?.photo ? (
                  <img src={activeUser.photo} alt={currentUser?.name || 'Caregiver'} className="w-full h-full object-cover" />
                ) : (
                  <SVGCaregiverAvatar className="w-full h-full" />
                )}
              </div>
            </div>

            {/* User Details */}
            <div className="w-full space-y-3 bg-brand-purpleLight p-5 rounded-2xl">
              <div className="flex justify-between items-center text-sm sm:text-base">
                <span className="font-black text-brand-grayText uppercase tracking-wider text-xs">{t('prof.name')}</span>
                <span className="font-extrabold text-brand-navy">{currentUser?.name || 'Caregiver'}</span>
              </div>
              {activeUser?.age && (
                <div className="flex justify-between items-center text-sm sm:text-base">
                  <span className="font-black text-brand-grayText uppercase tracking-wider text-xs">{t('prof.age')}</span>
                  <span className="font-extrabold text-brand-navy">{activeUser.age}</span>
                </div>
              )}
              <div className="flex justify-between items-center text-sm sm:text-base">
                <span className="font-black text-brand-grayText uppercase tracking-wider text-xs">{t('prof.role')}</span>
                <span className="font-extrabold text-brand-navy">{activeUser?.role === 'Caregiver' ? t('prof.roleCaregiver') : t('prof.rolePatient')}</span>
              </div>
              <div className="flex justify-between items-center text-sm sm:text-base">
                <span className="font-black text-brand-grayText uppercase tracking-wider text-xs">{t('prof.language')}</span>
                <span className="font-extrabold text-brand-navy">{t('lang.' + language)}</span>
              </div>
            </div>

            {/* Preview flow vs normal flow buttons */}
            {photoPreview ? (
              <div className="w-full grid grid-cols-2 gap-3">
                <button
                  onClick={handleConfirmPhoto}
                  className="w-full py-3.5 bg-brand-green text-white font-extrabold rounded-xl hover:bg-opacity-95 transition-all text-sm"
                >
                  {t('prof.savePhoto')}
                </button>
                <button
                  onClick={handleCancelPhotoPreview}
                  className="w-full py-3.5 bg-brand-lavender text-brand-navy font-bold rounded-xl hover:bg-brand-purpleLight transition-all text-sm"
                >
                  {t('prof.cancelPreview')}
                </button>
              </div>
            ) : (
              <div className="w-full flex flex-col gap-3">
                <label className="w-full py-3.5 bg-brand-lavender text-brand-purple rounded-xl font-black hover:bg-brand-purpleLight transition-all shadow-sm text-center cursor-pointer flex items-center justify-center gap-2 text-sm sm:text-base">
                  <span>{t('prof.changePhoto')}</span>
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handlePhotoUpload} 
                    className="hidden" 
                  />
                </label>

                <button
                  onClick={() => setShowProfileModal(false)}
                  className="w-full py-3 bg-brand-navy text-white font-extrabold rounded-xl hover:bg-opacity-90 transition-all text-sm sm:text-base"
                >
                  {t('prof.close')}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
