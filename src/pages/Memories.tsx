import React, { useState, useEffect } from 'react';
import { Search, Plus, Trash2, Calendar, Users, X, Image as ImageIcon, MapPin } from 'lucide-react';
import { storageService } from '../services/storageService';
import type { Memory } from '../data/demoData';
import { SVGPicnic, SVGOldHouse, SVGFestival, SVGHornbill, SVGDiwali } from '../components/SVGIcons';
import { useLanguage } from '../context/LanguageContext';
import { getLocalizedMemory } from '../services/translationService';

const getFestivalLocation = (imageKey: string, language: string = 'English') => {
  const mt = memTranslations[language] || memTranslations.English;
  if (imageKey === 'festival') return mt.locationAssam;
  if (imageKey === 'hornbill') return mt.locationNagaland;
  if (imageKey === 'diwali') return mt.locationIndia;
  return null;
};

const renderFestivalIcon = (imageKey: string) => {
  if (imageKey === 'festival') {
    return (
      <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7 flex-shrink-0">
        <ellipse cx="12" cy="14" rx="8" ry="5" fill="#b45309" stroke="#78350f" strokeWidth="1.5" />
        <path d="M4 14 L20 14" stroke="#ffffff" strokeWidth="1" />
        <path d="M8 10 L8 18 M16 10 L16 18" stroke="#f59e0b" strokeWidth="1" />
      </svg>
    );
  }
  if (imageKey === 'hornbill') {
    return (
      <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7 flex-shrink-0">
        {/* Head */}
        <path d="M14 14 C14 18, 8 18, 6 15 C5 13, 6 10, 9 9" stroke="#1e293b" strokeWidth="2" strokeLinecap="round" />
        {/* Beak/Bill */}
        <path d="M9 9 C11 5, 20 6, 22 10 C16 11, 12 11, 9 9 Z" fill="#f59e0b" stroke="#1e293b" strokeWidth="1.5" />
        <path d="M13 8 C15 7, 19 7, 21 9" stroke="#ef4444" strokeWidth="1.5" fill="none" />
        {/* Eye */}
        <circle cx="11" cy="12" r="1.2" fill="#1e293b" />
      </svg>
    );
  }
  if (imageKey === 'diwali') {
    return (
      <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7 flex-shrink-0">
        <path d="M4 14 C4 10, 20 10, 20 14 C20 18, 4 18, 4 14 Z" fill="#d97706" stroke="#b45309" strokeWidth="1.5" />
        <path d="M12 11 C10 9, 10 5, 12 2 C14 5, 14 9, 12 11 Z" fill="#ef4444" stroke="#f59e0b" strokeWidth="1.5" />
      </svg>
    );
  }
  return null;
};

const memTranslations: Record<string, Record<string, string>> = {
  English: {
    deleteConfirm: 'Are you sure you want to delete this memory from your Memory Garden?',
    beautifulMemory: 'Beautiful Memory',
    categoryAll: 'All',
    categoryFamily: 'Family',
    categoryPlaces: 'Places',
    categoryEvents: 'Events',
    categoryOther: 'Other',
    noMemories: 'No memories found',
    noMemoriesDesc: 'Add a special moment to your Memory Garden to keep it close.',
    with: 'With',
    delete: 'Delete',
    addNewMemory: 'Add New Memory',
    memoryTitle: 'Memory Title',
    date: 'Date',
    category: 'Category',
    peoplePresent: 'People Present',
    memoryDesc: 'Memory Description',
    uploadPhoto: 'Upload Photo (Optional)',
    plantMemory: 'Plant Memory',
    placeholderTitle: "e.g. Grandma's 80th Birthday",
    placeholderPeople: 'e.g. Ramesh, Anu, grandchildren',
    placeholderDesc: 'What makes this memory special?',
    locationAssam: 'Assam, North-East India',
    locationNagaland: 'Nagaland, North-East India',
    locationIndia: 'India'
  },
  Hindi: {
    deleteConfirm: 'क्या आप वाकई इस याद को अपने मेमोरी गार्डन से हटाना चाहते हैं?',
    beautifulMemory: 'सुंदर याद',
    categoryAll: 'सभी',
    categoryFamily: 'परिवार',
    categoryPlaces: 'स्थान',
    categoryEvents: 'कार्यक्रम',
    categoryOther: 'अन्य',
    noMemories: 'कोई यादें नहीं मिलीं',
    noMemoriesDesc: 'अपने मेमोरी गार्डन में एक विशेष क्षण जोड़ें ताकि वह करीब रहे।',
    with: 'साथ में',
    delete: 'हटाएं',
    addNewMemory: 'नई याद जोड़ें',
    memoryTitle: 'याद का शीर्षक',
    date: 'तारीख',
    category: 'श्रेणी',
    peoplePresent: 'उपस्थित लोग',
    memoryDesc: 'याद का विवरण',
    uploadPhoto: 'फ़ोटो अपलोड करें (वैकल्पिक)',
    plantMemory: 'याद सहेजें',
    placeholderTitle: 'जैसे- दादी का 80वां जन्मदिन',
    placeholderPeople: 'जैसे- रमेश, अनु, नाती-पोते',
    placeholderDesc: 'इस याद को क्या खास बनाता है?',
    locationAssam: 'असम, उत्तर-पूर्व भारत',
    locationNagaland: 'नागालैंड, उत्तर-पूर्व भारत',
    locationIndia: 'भारत'
  },
  Bengali: {
    deleteConfirm: 'আপনি কি নিশ্চিত যে আপনি আপনার মেমরি গার্ডেন থেকে এই স্মৃতিটি মুছে ফেলতে চান?',
    beautifulMemory: 'সুন্দর স্মৃতি',
    categoryAll: 'সব',
    categoryFamily: 'পরিবার',
    categoryPlaces: 'স্থান',
    categoryEvents: 'অনুষ্ঠান',
    categoryOther: 'অন্যান্য',
    noMemories: 'কোনো স্মৃতি পাওয়া যায়নি',
    noMemoriesDesc: 'কাছে রাখার জন্য আপনার মেমরি গার্ডেনে একটি বিশেষ মুহূর্ত যোগ করুন।',
    with: 'সাথে',
    delete: 'মুছে ফেলুন',
    addNewMemory: 'নতুন স্মৃতি যোগ করুন',
    memoryTitle: 'স্মৃতির শিরোনাম',
    date: 'তারিখ',
    category: 'বিভাগ',
    peoplePresent: 'উপস্থিত ব্যক্তিরা',
    memoryDesc: 'স্মৃতির বিবরণ',
    uploadPhoto: 'ছবি আপলোড (ঐচ্ছিক)',
    plantMemory: 'স্মৃতি রোপণ করুন',
    placeholderTitle: 'উদাঃ দিদিমার ৮০তম জন্মদিন',
    placeholderPeople: 'উদাঃ রমেশ, অনু, নাতি-নাতনিরা',
    placeholderDesc: 'এই স্মৃতিটি কী কারণে বিশেষ?',
    locationAssam: 'আসাম, উত্তর-পূর্ব ভারত',
    locationNagaland: 'নাগাল্যান্ড, উত্তর-পূর্ব ভারত',
    locationIndia: 'ভারত'
  },
  Assamese: {
    deleteConfirm: 'আপুনি নিশ্চিতনে যে আপুনি আপোনাৰ স্মৃতি উদ্যানৰ পৰা এই স্মৃতিটো মচিব খোজে?',
    beautifulMemory: 'ধুনীয়া স্মৃতি',
    categoryAll: 'সকলো',
    categoryFamily: 'পৰিয়াল',
    categoryPlaces: 'ঠাই',
    categoryEvents: 'অনুষ্ঠান',
    categoryOther: 'অন্যান্য',
    noMemories: 'কোনো স্মৃতি পোৱা নগ’ল',
    noMemoriesDesc: 'আপোনাৰ স্মৃতি উদ্যানত এটি বিশেষ মুহূৰ্ত যোগ কৰক।',
    with: 'লগত',
    delete: 'মচি পেলাওক',
    addNewMemory: 'নতুন স্মৃতি যোগ কৰক',
    memoryTitle: 'স্মৃতিৰ নাম',
    date: 'তাৰিখ',
    category: 'শ্ৰেণী',
    peoplePresent: 'উপস্থিত লোকসকল',
    memoryDesc: 'স্মৃতিৰ বৰ্ণনা',
    uploadPhoto: 'ফটো আপলোড কৰক (ঐচ্ছিক)',
    plantMemory: 'স্মৃতি সংৰক্ষণ কৰক',
    placeholderTitle: 'যেনে- আইতাৰ ৮০তম জন্মদিন',
    placeholderPeople: 'যেনে- ৰমেশ, অনু, নাতি-নাতিনীসকল',
    placeholderDesc: 'এই স্মৃতিটো কিয় বিশেষ?',
    locationAssam: 'অসম, উত্তৰ-পূব ভাৰত',
    locationNagaland: 'নাগালেণ্ড, উত্তৰ-পূব ভাৰত',
    locationIndia: 'ভাৰত'
  },
  Manipuri: {
    deleteConfirm: 'নহakna মেমোরী গার্ডেনদগী অসি মুত্থতপা পাম্ব্রা?',
    beautifulMemory: 'ফজবা মেমোরী',
    categoryAll: 'খুদোং',
    categoryFamily: 'ইমুং',
    categoryPlaces: 'মফম',
    categoryEvents: 'থৌরম',
    categoryOther: 'অতোপ্পা',
    noMemories: 'মেমোরী ফংদ্রে',
    noMemoriesDesc: 'মেমোরী গার্ডেন্দা ফজবা মফম অমুক্তা হাপ্পীয়ূ।',
    with: 'লোয়ননা',
    delete: 'মুত্থতপা',
    addNewMemory: 'অনৌবা মেমোরী হাপ্পা',
    memoryTitle: 'মেमোরী টাইটেল',
    date: 'তারিখ',
    category: 'ক্যাটাগোরী',
    peoplePresent: 'য়াওরিবা মীশিং',
    memoryDesc: 'মেমোরী ডেস্ক্রিপশন',
    uploadPhoto: 'ফটো হাপ্পা (অপ্সনেল)',
    plantMemory: 'মেমোরী থম্বা',
    placeholderTitle: 'উদাঃ ইবেলগী ৮০শুবা মपোক নুমিৎ',
    placeholderPeople: 'উদাঃ রমেশ, অনু, শুলীশিং',
    placeholderDesc: 'অসি করम্না ফজবগে?',
    locationAssam: 'অসাম, অৱাং-নোংপোক ভারত',
    locationNagaland: 'नागालैंड, অৱাং-নোংপোক ভারত',
    locationIndia: 'भारत'
  },
  Khasi: {
    deleteConfirm: 'Phi thikna ba phi kwah ban pyndam ia kane ka jingkynmaw?',
    beautifulMemory: 'Jingkynmaw ba itynnad',
    categoryAll: 'Baroh',
    categoryFamily: 'Iing-sem',
    categoryPlaces: 'Ki jaka',
    categoryEvents: 'Ki kam',
    categoryOther: 'Kiwei',
    noMemories: 'Khlem shem jingkynmaw',
    noMemoriesDesc: 'Buh ia ka khyllipmat ba kyrpang ha ka kper jingkynmaw.',
    with: 'Bad',
    delete: 'Pyndam',
    addNewMemory: 'Buh Jingkynmaw Kaba Thymmai',
    memoryTitle: 'Kyrteng ka Jingkynmaw',
    date: 'Tarikh',
    category: 'Jait',
    peoplePresent: 'Kiba don ryngkat',
    memoryDesc: 'Batai ia ka Jingkynmaw',
    uploadPhoto: 'Buh Dur (Lada kwah)',
    plantMemory: 'Pynsah Jingkynmaw',
    placeholderTitle: 'kd. Ka sngi kha ba 80 i Mei-rad',
    placeholderPeople: 'kd. Ramesh, Anu, khun rynjup',
    placeholderDesc: 'Kiei kiba pynlong kyrpang ia kane?',
    locationAssam: 'Assam, Shatei-Lam-Mihngi India',
    locationNagaland: 'Nagaland, Shatei-Lam-Mihngi India',
    locationIndia: 'India'
  },
  Mizo: {
    deleteConfirm: 'He hriatna hi i Memory Garden atanga nuaibo i duh tak zet em?',
    beautifulMemory: 'Hriatna nuam',
    categoryAll: 'A vaiin',
    categoryFamily: 'Chhungkua',
    categoryPlaces: 'Hmun te',
    categoryEvents: 'Thil thleng te',
    categoryOther: 'Thil dang',
    noMemories: 'Hriatna engmah a awm lo',
    noMemoriesDesc: 'I Memory Garden-ah hriatna thar dah rawh.',
    with: 'Hnenah',
    delete: 'Nuaibo',
    addNewMemory: 'Hriatna Thar Siamna',
    memoryTitle: 'Hriatna Hming',
    date: 'Ni',
    category: 'Category',
    peoplePresent: 'A hmuna awm te',
    memoryDesc: 'Hriatna Bena',
    uploadPhoto: 'Thlalak Dahna (Duh thlan tur)',
    plantMemory: 'Hriatna Dahna',
    placeholderTitle: 'kd. Pi kum 80 piancham',
    placeholderPeople: 'kd. Ramesh, Anu, tute',
    placeholderDesc: 'Engin nge he hriatna hi pakhai?',
    locationAssam: 'Assam, Hmarchan India',
    locationNagaland: 'Nagaland, Hmarchan India',
    locationIndia: 'India'
  },
  Nagamese: {
    deleteConfirm: 'Apuni bhal pora mon ase na aji laga memory delete kuribole?',
    beautifulMemory: 'Bhal mon thaka yaad',
    categoryAll: 'Sob',
    categoryFamily: 'Mith-bhaat',
    categoryPlaces: 'Jagah khan',
    categoryEvents: 'Utsav khan',
    categoryOther: 'Aro khan',
    noMemories: 'Kunuba yaad bacha nai',
    noMemoriesDesc: 'Apuni laga Memory Garden te naya yaad bachabi.',
    with: 'Logote',
    delete: 'Delete',
    addNewMemory: 'Naya Yaad Bachabi',
    memoryTitle: 'Yaad Title',
    date: 'Tarikh',
    category: 'Category',
    peoplePresent: 'Kun-kun thakise',
    memoryDesc: 'Yaad Bivaran',
    uploadPhoto: 'Photo Upload (Kilebi)',
    plantMemory: 'Yaad Bachabi',
    placeholderTitle: 'kd. Aji Bubu laga 80th Birthday',
    placeholderPeople: 'kd. Ramesh, Anu, bacha khan',
    placeholderDesc: 'Aji ki bisi bhal thakise?',
    locationAssam: 'Assam, North-East India',
    locationNagaland: 'Nagaland, North-East India',
    locationIndia: 'India'
  },
  Tripuri: {
    deleteConfirm: 'Neng chichi chokhichang yaadno delete khailani?',
    beautifulMemory: 'Chokhichang yaad',
    categoryAll: 'Jotoni',
    categoryFamily: 'Nokhor',
    categoryPlaces: 'Jagarok',
    categoryEvents: 'Haparnok',
    categoryOther: 'Chichirok',
    noMemories: 'Yaad kwrwi',
    noMemoriesDesc: 'Nini Memory Garden te naya yaad hiladi.',
    with: 'Logote',
    delete: 'Muthudi',
    addNewMemory: 'Naya yaad hiladi',
    memoryTitle: 'Yaadni Title',
    date: 'Tarikh',
    category: 'Category',
    peoplePresent: 'Borokrok',
    memoryDesc: 'Yaad Details',
    uploadPhoto: 'Photo Upload (Chadi)',
    plantMemory: 'Yaad hapa',
    placeholderTitle: 'kd. Buri 80 Birthday',
    placeholderPeople: 'kd. Ramesh, Anu, surok',
    placeholderDesc: 'Ki kahm thakise chichi?',
    locationAssam: 'Assam, North-East India',
    locationNagaland: 'Nagaland, North-East India',
    locationIndia: 'India'
  }
};

export const Memories: React.FC = () => {
  const { t, language } = useLanguage();
  const [memories, setMemories] = useState<Memory[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);

  // New memory states
  const [newTitle, setNewTitle] = useState('');
  const [newDate, setNewDate] = useState('');
  const [newPeople, setNewPeople] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newCategory, setNewCategory] = useState<'family' | 'places' | 'events' | 'other'>('family');
  const [newImageBase64, setNewImageBase64] = useState<string>('');

  useEffect(() => {
    storageService.init();
    setMemories(storageService.getMemories());
  }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewImageBase64(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddMemory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newMem: Memory = {
      id: `mem-${Date.now()}`,
      title: newTitle,
      date: newDate || new Date().toISOString().split('T')[0],
      people: newPeople,
      description: newDescription,
      category: newCategory,
      image: newImageBase64 || 'default'
    };

    const updated = [newMem, ...memories];
    setMemories(updated);
    storageService.saveMemories(updated);

    // Notify Caregiver
    const alerts = storageService.getAlerts();
    storageService.saveAlerts([
      { id: `al-${Date.now()}`, type: 'success', title: `New memory added: ${newTitle}`, time: 'Just now' },
      ...alerts
    ]);

    // Reset Form
    setNewTitle('');
    setNewDate('');
    setNewPeople('');
    setNewDescription('');
    setNewCategory('family');
    setNewImageBase64('');
    setShowAddModal(false);
  };

  const handleDeleteMemory = (id: string) => {
    const mt = memTranslations[language] || memTranslations.English;
    if (window.confirm(mt.deleteConfirm)) {
      const updated = memories.filter(m => m.id !== id);
      setMemories(updated);
      storageService.saveMemories(updated);
    }
  };

  const filteredMemories = memories.filter(m => {
    const matchesSearch = 
      m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.people.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = filterCategory === 'all' || m.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const renderMemoryIllustration = (imageKey: string) => {
    const mt = memTranslations[language] || memTranslations.English;
    if (imageKey === 'picnic') return <SVGPicnic className="w-full h-44 object-cover" />;
    if (imageKey === 'old_house') return <SVGOldHouse className="w-full h-44 object-cover" />;
    if (imageKey === 'festival') return <SVGFestival className="w-full h-44 object-cover" />;
    if (imageKey === 'hornbill') return <SVGHornbill className="w-full h-44 object-cover" />;
    if (imageKey === 'diwali') return <SVGDiwali className="w-full h-44 object-cover" />;
    if (imageKey.startsWith('data:image')) {
      return <img src={imageKey} alt="Uploaded Memory" className="w-full h-44 object-cover rounded-t-2xl" />;
    }
    return (
      <div className="w-full h-44 bg-brand-purpleLight text-brand-purple flex flex-col items-center justify-center rounded-t-2xl">
        <ImageIcon className="w-12 h-12 stroke-[1.5]" />
        <span className="text-xs font-semibold mt-2">{mt.beautifulMemory}</span>
      </div>
    );
  };

  return (
    <div className="pb-12 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-brand-navy">{t('mem.title')}</h1>
          <p className="text-brand-grayText font-medium mt-1">{t('mem.subtitle')}</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-brand-purple text-white hover:bg-opacity-95 py-3.5 px-6 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-sm self-start sm:self-center"
        >
          <Plus className="w-5 h-5" />
          <span>{t('mem.add')}</span>
        </button>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row gap-4 bg-white p-4 rounded-2xl border border-brand-purpleLight shadow-sm">
        <div className="flex-1 relative">
          <Search className="absolute left-3.5 top-3.5 w-5 h-5 text-brand-grayText" />
          <input
            type="text"
            placeholder={t('mem.search')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-brand-lavender rounded-xl border border-transparent focus:border-brand-purple focus:bg-white focus:outline-none text-base"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1 md:pb-0">
          {(() => {
            const mt = memTranslations[language] || memTranslations.English;
            const categoryLabels: Record<string, string> = {
              all: mt.categoryAll,
              family: mt.categoryFamily,
              places: mt.categoryPlaces,
              events: mt.categoryEvents,
              other: mt.categoryOther
            };
            return ['all', 'family', 'places', 'events', 'other'].map((cat) => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`px-4 py-3 rounded-xl text-sm font-bold uppercase tracking-wider transition-all whitespace-nowrap ${
                  filterCategory === cat
                    ? 'bg-brand-purple text-white'
                    : 'bg-brand-lavender text-brand-grayText hover:bg-brand-purpleLight'
                }`}
              >
                {categoryLabels[cat] || cat}
              </button>
            ));
          })()}
        </div>
      </div>

      {/* Memories Grid */}
      {filteredMemories.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border border-brand-purpleLight shadow-sm text-center">
          <ImageIcon className="w-16 h-16 text-brand-grayText mx-auto mb-4" />
          <h3 className="text-xl font-bold text-brand-navy">
            {(memTranslations[language] || memTranslations.English).noMemories}
          </h3>
          <p className="text-brand-grayText mt-2">
            {(memTranslations[language] || memTranslations.English).noMemoriesDesc}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMemories.map((memory) => (
            <div 
              key={memory.id}
              className="bg-white rounded-2xl border border-brand-purpleLight overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col"
            >
              {/* Illustration / Photo */}
              {renderMemoryIllustration(memory.image)}

              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="font-extrabold text-xl text-brand-navy flex items-center gap-2">
                    {renderFestivalIcon(memory.image)}
                    <span>{getLocalizedMemory(memory, language).title}</span>
                  </h3>
                  {getFestivalLocation(memory.image, language) && (
                    <div className="flex items-center gap-1.5 text-xs font-bold text-brand-grayText mt-1.5">
                      <MapPin className="w-3.5 h-3.5 text-[#3b82f6] flex-shrink-0" />
                      <span>{getFestivalLocation(memory.image, language)}</span>
                    </div>
                  )}
                  <p className="text-brand-grayText text-base mt-2 line-clamp-3">{getLocalizedMemory(memory, language).description}</p>
                </div>

                <div className="space-y-2 pt-4 border-t border-brand-purpleLight text-xs font-bold text-brand-grayText">
                  {memory.people && (
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-brand-purple" />
                      <span>{(memTranslations[language] || memTranslations.English).with}: {memory.people}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-brand-purple" />
                      <span>{memory.date}</span>
                    </div>
                    <button
                      onClick={() => handleDeleteMemory(memory.id)}
                      className="text-brand-red hover:underline flex items-center gap-1"
                    >
                      <Trash2 className="w-4 h-4" /> {(memTranslations[language] || memTranslations.English).delete}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Memory Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-navy bg-opacity-40">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-xl border border-brand-purpleLight">
            <div className="flex justify-between items-center border-b border-brand-purpleLight pb-4 mb-6">
              <h2 className="font-extrabold text-xl text-brand-navy">{(memTranslations[language] || memTranslations.English).addNewMemory}</h2>
              <button onClick={() => setShowAddModal(false)} className="p-1 rounded-lg hover:bg-brand-lavender">
                <X className="w-6 h-6 text-brand-grayText" />
              </button>
            </div>
            
            <form onSubmit={handleAddMemory} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-brand-navy mb-2">{(memTranslations[language] || memTranslations.English).memoryTitle}</label>
                <input
                  type="text"
                  placeholder={(memTranslations[language] || memTranslations.English).placeholderTitle}
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-brand-purpleLight focus:outline-none focus:border-brand-purple text-base"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-brand-navy mb-2">{(memTranslations[language] || memTranslations.English).date}</label>
                  <input
                    type="date"
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-brand-purpleLight focus:outline-none focus:border-brand-purple text-base"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-brand-navy mb-2">{(memTranslations[language] || memTranslations.English).category}</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full px-4 py-3 rounded-xl border border-brand-purpleLight focus:outline-none focus:border-brand-purple text-base"
                  >
                    <option value="family">{(memTranslations[language] || memTranslations.English).categoryFamily}</option>
                    <option value="places">{(memTranslations[language] || memTranslations.English).categoryPlaces}</option>
                    <option value="events">{(memTranslations[language] || memTranslations.English).categoryEvents}</option>
                    <option value="other">{(memTranslations[language] || memTranslations.English).categoryOther}</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-brand-navy mb-2">{(memTranslations[language] || memTranslations.English).peoplePresent}</label>
                <input
                  type="text"
                  placeholder={(memTranslations[language] || memTranslations.English).placeholderPeople}
                  value={newPeople}
                  onChange={(e) => setNewPeople(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-brand-purpleLight focus:outline-none focus:border-brand-purple text-base"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-brand-navy mb-2">{(memTranslations[language] || memTranslations.English).memoryDesc}</label>
                <textarea
                  rows={3}
                  placeholder={(memTranslations[language] || memTranslations.English).placeholderDesc}
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-brand-purpleLight focus:outline-none focus:border-brand-purple text-base resize-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-brand-navy mb-2">{(memTranslations[language] || memTranslations.English).uploadPhoto}</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="w-full text-sm text-brand-grayText file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-bold file:bg-brand-purpleLight file:text-brand-purple hover:file:bg-opacity-90"
                />
              </div>

              <button
                type="submit"
                className="w-full mt-6 bg-brand-purple text-white py-3.5 rounded-xl font-bold hover:bg-opacity-95"
              >
                {(memTranslations[language] || memTranslations.English).plantMemory}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
