import { storageService } from './storageService';

function parseDeterministicCommand(
  clean: string,
  currentLang: string,
  contextData: any = {},
  voiceContext: any = null
): any | null {
  const profile = contextData.profile || {};
  const userName = profile.name || 'Ravi';
  const userAge = profile.age || 78;
  const caregiverName = profile.caregiverName || 'Anu';
  const language = currentLang || 'English';

  const reminders = contextData.reminders || [];
  const schedule = contextData.schedule || [];
  const memories = contextData.memories || [];

  // 1. Clean and normalize punctuation, duplicated whitespace
  let norm = clean.toLowerCase().trim();
  norm = norm.replace(/\s+/g, ' ');

  // 2. Duplicated word normalization
  const words = norm.split(' ');
  const dedupedWords = [];
  for (let i = 0; i < words.length; i++) {
    if (i === 0 || words[i] !== words[i - 1]) {
      dedupedWords.push(words[i]);
    }
  }
  norm = dedupedWords.join(' ');

  // 3. CONFIRMATION HANDLERS
  if (voiceContext) {
    if (voiceContext.intent === 'CONFIRM_DELETE') {
      const positiveWords = ['yes', 'confirm', 'haan', 'sure', 'delete', 'do it', 'thik hai', 'joma', 'okay', 'ok', 'yep', 'yeah', 'confirm delete'];
      const negativeWords = ['no', 'cancel', 'dont', 'keep', 'na', 'never', 'stop'];
      
      const isPositive = positiveWords.some(w => norm.includes(w));
      const isNegative = negativeWords.some(w => norm.includes(w));

      if (isPositive) {
        return {
          intent: voiceContext.deleteIntent,
          parameters: { entityId: voiceContext.entityId, confirmed: true },
          response: language === 'Hindi' ? 'इसे हटा दिया गया है।' : language === 'Bengali' ? 'এটি মুছে ফেলা হয়েছে।' : 'It has been deleted.'
        };
      } else if (isNegative) {
        return {
          intent: 'CONVERSATION',
          response: language === 'Hindi' ? 'ठीक है, मैंने इसे नहीं हटाया।' : language === 'Bengali' ? 'ঠিক আছে, मैं इसे नहीं हटाया।' : 'Okay, I kept it.'
        };
      }
    }
  }

  // --- STT / FILLER WORDS REMOVAL FOR CORE SEMANTIC EXTRACTION ---
  const fillers = [
    'please', 'can you', 'could you', 'would you', 'i want to', 'i need to',
    'i would like to', 'tell me', 'show me', 'take me', 'help me',
    'actually', 'basically', 'just', 'for me', 'if you can', 'i want',
    'id like', 'mere', 'meri', 'mera', 'aaj ka', 'aaj ki', 'aaj ke', 'mujhe',
    'kripya', 'k', 'to the', 'the', 'go to', 'open', 'start', 'play', 'kholo',
    'dikhao', 'dekhao', 'dikhaye', 'chalao', 'shuru', 'karo', 'joma'
  ];
  let semanticCore = norm;
  fillers.forEach(f => {
    semanticCore = semanticCore.replace(new RegExp('\\b' + f + '\\b', 'g'), '');
  });
  semanticCore = semanticCore.replace(/\s+/g, ' ').trim();

  // --- SYNONYM RESOLUTION HELPER ---
  const matchesAny = (str: string, keywords: string[]): boolean => {
    return keywords.some((k: string) => str.includes(k));
  };

  // --- ENTITY KEYWORDS ---
  const memoriesKeys = ['memories', 'memory', 'photo', 'photos', 'yaad', 'yaaden', 'yaadein', 'yaado', 'smriti', 'মেমরি', 'স্মৃতি', 'ছবি', 'यादें', 'याद', 'फोटो'];
  const remindersKeys = ['reminder', 'reminders', 'alarm', 'med', 'meds', 'medicine', 'medicines', 'pill', 'pills', 'tablet', 'tablets', 'dawa', 'dawaein', 'goli', 'alaram', 'ওষুধ', 'অনুস্মারক', 'रिमाइंडर', 'दवा', 'अलार्म'];
  const scheduleKeys = ['activities', 'activity', 'schedule', 'my day', 'dincharya', 'din charya', 'aaj ka plan', 'রুটিন', 'সময়সূচী', 'আজ কি বার', 'কয়টা বাজে', 'दिनचर्या', 'शेड्यूल', 'गतिविधि', 'काम', 'kya karna hai', 'aaj ke kaam', 'aaj ka task'];
  const gamesKeys = ['brain games', 'brain game', 'games', 'game', 'khel', 'গেম', 'গ্যাম', 'गेम', 'खेल', 'गेम्स', 'ब्रेन गेम', 'ब्रेन गेम्स', 'খেলা'];
  const settingsKeys = ['settings', 'setting', 'profile', 'account', 'सेटिंग', 'प्रोफाइल', 'सेटिंग्स', 'अकाउंट', 'সেটিংস', 'প্রোফাইল'];
  const caregiverKeys = ['caregiver', 'dashboard', 'panel', 'anu', 'केयरगिवर', 'केयरगिवर डैशबोर्ड', 'কেয়ারগিভার', 'অনু'];
  const homeKeys = ['home', 'होम', 'घर'];
  const helpKeys = ['help', 'emergency', 'sos', 'मदद', 'सहायता', 'সাহায্য'];
  const backKeys = ['back', 'pichej', 'piche', 'peeche', 'phire', 'back jao'];

  // --- ACTION KEYWORDS ---
  const deleteKeys = ['delete', 'remove', 'cancel', 'clear', 'hatao', 'mitao', 'cancel', 'हटाओ', 'मिटाओ', 'মুছে', 'বাতিল'];
  const completeKeys = ['complete', 'done', 'finished', 'mark', 'pura', 'ho gaya', 'sesh', 'somponno', 'पूरा', 'हो गया', 'সম্পন্ন'];
  const createKeys = ['add', 'create', 'save', 'remember', 'new', 'set', 'jodo', 'likho', 'banao', 'joma', 'save memory', 'remind', 'schedule', 'जोड़ो', 'बनाओ', 'তৈरी', 'যুক্ত'];
  const searchKeys = ['find', 'search', 'khojo', 'dhoondo', 'look up', 'खोजो', 'ढूँढो', 'খুঁজুন'];

  // --- 1. PERSONAL INFORMATION & GENERAL CONVERSATION QUERIES ---
  if (matchesAny(norm, ['my name', 'who am i', 'mera naam', 'আমার নাম', 'मेरा नाम'])) {
    return {
      intent: 'CONVERSATION',
      response: language === 'Hindi' ? `आपका नाम ${userName} है।` : language === 'Bengali' ? `আপনার নাম ${userName}।` : `Your name is ${userName}.`
    };
  }

  if (matchesAny(norm, ['how old am i', 'my age', 'मेरी उम्र', 'मेरे उम्र', 'আমার বয়স'])) {
    return {
      intent: 'CONVERSATION',
      response: language === 'Hindi' ? `आप ${userAge} साल के हैं।` : language === 'Bengali' ? `আপনার বয়স ${userAge} বছর।` : `You are ${userAge} years old.`
    };
  }

  if (matchesAny(norm, ['date of birth', 'my birthday', 'जन्म तिथि', 'जन्मदिन', 'জন্ম তারিখ'])) {
    return {
      intent: 'CONVERSATION',
      response: language === 'Hindi' ? 'मेरे पास आपकी प्रोफ़ाइल में वह जानकारी नहीं है।' : language === 'Bengali' ? 'আপনার প্রোফাইলে আমার কাছে সেই তথ্য নেই।' : "I don't have that information in your profile."
    };
  }

  if (matchesAny(norm, ['profile information', 'profile details', 'प्रोफाइल जानकारी', 'প্রোফাইল তথ্য'])) {
    return {
      intent: 'CONVERSATION',
      response: language === 'Hindi' 
        ? `आपका नाम ${userName} है। आप ${userAge} साल के हैं, और आपकी केयरगिवर ${caregiverName} हैं।` 
        : language === 'Bengali' 
        ? `আপনার নাম ${userName}। আপনার বয়স ${userAge} বছর, এবং আপনার কেয়ারগিভার ${caregiverName}।` 
        : `Your name is ${userName}. You are ${userAge} years old, and your caregiver is ${caregiverName}.`
    };
  }

  if (matchesAny(norm, ['what language am i using', 'what language is this', 'कौन सी भाषा', 'কোন ভাষা'])) {
    return {
      intent: 'CONVERSATION',
      response: language === 'Hindi' ? `आप वर्तमान में हिंदी का उपयोग कर रहे हैं।` : language === 'Bengali' ? `আপনি বর্তমানে বাংলা ব্যবহার করছেন।` : `You are currently using ${language}.`
    };
  }

  if (matchesAny(norm, ['who is my caregiver', 'caregiver name', 'केयरगिवर कौन', 'কেয়ারগিভার কে'])) {
    return {
      intent: 'CONVERSATION',
      response: language === 'Hindi' ? `आपकी केयरगिवर ${caregiverName} हैं।` : language === 'Bengali' ? `আপনার কেয়ারগিভার ${caregiverName}।` : `Your caregiver is ${caregiverName}.`
    };
  }

  // --- 2. DATE AND TIME QUERIES ---
  if (matchesAny(norm, ['today\'s date', 'date today', 'आज की तारीख', 'আজকের তারিখ'])) {
    const formattedDate = new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    return {
      intent: 'CONVERSATION',
      response: language === 'Hindi' ? `आज की तारीख ${formattedDate} है।` : language === 'Bengali' ? `আজকের তারিখ ${formattedDate}।` : `Today's date is ${formattedDate}.`
    };
  }

  if (matchesAny(norm, ['what day is it', 'day today', 'आज कौन सा दिन', 'আজ কি বার'])) {
    const dayName = new Date().toLocaleDateString(undefined, { weekday: 'long' });
    return {
      intent: 'CONVERSATION',
      response: language === 'Hindi' ? `आज ${dayName} है।` : language === 'Bengali' ? `আজ ${dayName}।` : `Today is ${dayName}.`
    };
  }

  if (matchesAny(norm, ['what time is it', 'time now', 'क्या समय हुआ', 'কয়টা বাজে'])) {
    const timeVal = new Date().toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
    return {
      intent: 'CONVERSATION',
      response: language === 'Hindi' ? `अभी ${timeVal} बजे हैं।` : language === 'Bengali' ? `এখন সময় ${timeVal}।` : `The current time is ${timeVal}.`
    };
  }

  // --- 3. BACK NAVIGATION ---
  if (matchesAny(norm, backKeys) || norm === 'back') {
    return {
      intent: 'NAVIGATION',
      path: '-1',
      response: language === 'Hindi' ? 'पीछे जा रहे हैं।' : language === 'Bengali' ? 'পিছনে ফিরে যাওয়া হচ্ছে।' : 'Going back.'
    };
  }

  // --- 4. DATA-DEPENDENT SUMMARIES ---
  if (matchesAny(norm, ['completed today', 'tasks done', 'what did i complete', 'क्या पूरा किया', 'আজকে কি সম্পন্ন'])) {
    const completedRems = reminders.filter((r: any) => r.status === 'Completed').map((r: any) => r.title);
    const completedActs = schedule.filter((s: any) => s.completed).map((s: any) => s.title);
    const allCompleted = [...completedRems, ...completedActs];
    if (allCompleted.length === 0) {
      return {
        intent: 'CONVERSATION',
        response: language === 'Hindi' ? 'आपने आज अभी तक कोई कार्य पूरा नहीं किया है।' : language === 'Bengali' ? 'আপনি আজ এখনও পর্যন্ত কোনো কাজ সম্পন্ন করেননি।' : 'You haven\'t completed any tasks yet today.'
      };
    }
    return {
      intent: 'CONVERSATION',
      response: language === 'Hindi' 
        ? `आज आपने ये कार्य पूरे किए हैं: ${allCompleted.join(', ')}।` 
        : language === 'Bengali' 
        ? `আজকে আপনি এই কাজগুলি সম্পন্ন করেছেন: ${allCompleted.join(', ')}।` 
        : `Today you have completed: ${allCompleted.join(', ')}.`
    };
  }

  if (matchesAny(norm, ['pending', 'tasks remaining', 'what is left', 'बाकी कार्य', 'বাকি কাজ'])) {
    const pendingRems = reminders.filter((r: any) => r.status === 'Upcoming' || r.status === 'Scheduled').map((r: any) => r.title);
    const pendingActs = schedule.filter((s: any) => !s.completed).map((s: any) => s.title);
    const allPending = [...pendingRems, ...pendingActs];
    if (allPending.length === 0) {
      return {
        intent: 'CONVERSATION',
        response: language === 'Hindi' ? 'आज आपके लिए कोई लंबित कार्य नहीं हैं।' : language === 'Bengali' ? 'আজ আপনার কোনো কাজ বাকি নেই।' : 'You have no pending tasks today.'
      };
    }
    return {
      intent: 'CONVERSATION',
      response: language === 'Hindi' 
        ? `आपके लंबित कार्य हैं: ${allPending.join(', ')}।` 
        : language === 'Bengali' 
        ? `আপনার বাকি কাজগুলি হলো: ${allPending.join(', ')}।` 
        : `Your pending tasks are: ${allPending.join(', ')}.`
    };
  }

  if (matchesAny(norm, ['planned today', 'schedule today', 'do today', 'activities today', 'reminders today', 'daily summary', 'आज क्या', 'आज क्या करना है', 'আজকের সময়সূচী', 'what do i have to do', 'what do i do', 'aaj mujhe kya karna hai', 'aaj kya karna hai', 'mujhe aaj kya karna hai', 'today what do i', 'what should i do today'])) {
    const todayRems = reminders.map((r: any) => `${r.title} (&r.time)`).map((s: string) => s.replace('&', '$'));
    const todayActs = schedule.map((s: any) => `${s.title} (&s.time)`).map((s: string) => s.replace('&', '$'));
    const allItems = [...todayRems, ...todayActs];
    if (allItems.length === 0) {
      return {
        intent: 'CONVERSATION',
        response: language === 'Hindi' ? 'आज आपके शेड्यूल में कुछ भी नहीं है।' : language === 'Bengali' ? 'আজ আপনার সময়সূচীতে কিছু নেই।' : 'You have nothing scheduled for today.'
      };
    }
    return {
      intent: 'CONVERSATION',
      response: language === 'Hindi' 
        ? `आज आपके पास ये गतिविधियाँ हैं: ${allItems.join(', ')}।` 
        : language === 'Bengali' 
        ? `আজ আপনার এই কাজগুলি রয়েছে: ${allItems.join(', ')}।` 
        : `Today you have: ${allItems.join(', ')}.`
    };
  }

  if (matchesAny(norm, ['need to remember today', 'daily plan', 'आज का प्लान', 'আজকের পরিকল্পনা'])) {
    const todayRems = reminders.map((r: any) => `${r.title} (&r.time)`).map((s: string) => s.replace('&', '$'));
    if (todayRems.length === 0) {
      return {
        intent: 'CONVERSATION',
        response: language === 'Hindi' ? 'आज आपको याद रखने के लिए कोई रिमाइंडर नहीं हैं।' : language === 'Bengali' ? 'আজ আপনার মনে রাখার মতো কোনো অনুস্মারক নেই।' : 'You have no reminders to remember today.'
      };
    }
    return {
      intent: 'CONVERSATION',
      response: language === 'Hindi' 
        ? `आज आपको ये बातें याद रखनी हैं: ${todayRems.join(', ')}।` 
        : language === 'Bengali' 
        ? `আজ আপনাকে এই বিষয়গুলি মনে রাখতে হবে: ${todayRems.join(', ')}।` 
        : `Today you need to remember: ${todayRems.join(', ')}.`
    };
  }

  if (matchesAny(norm, ['next reminder', 'current reminder', 'coming up next', 'what should i do next', 'अगला रिमाइंडर', 'এরপর কি'])) {
    const upcoming = reminders.filter((r: any) => r.status === 'Upcoming' || r.status === 'Scheduled');
    if (upcoming.length === 0) {
      return {
        intent: 'CONVERSATION',
        response: language === 'Hindi' ? 'आपके पास कोई आगामी रिमाइंडर नहीं है।' : language === 'Bengali' ? 'আপনার কোনো অনুস্মারক নেই।' : 'You have no upcoming reminders today.'
      };
    }
    upcoming.sort((a: any, b: any) => a.time.localeCompare(b.time));
    const nextRem = upcoming[0];
    return {
      intent: 'CONVERSATION',
      response: language === 'Hindi' 
        ? `आपका अगला रिमाइंडर है: ${nextRem.title} ${nextRem.time} बजे।` 
        : language === 'Bengali' 
        ? `আপনার পরবর্তী অনুস্মারক হলো: ${nextRem.title} ${nextRem.time} টায়।` 
        : `Your next reminder is: ${nextRem.title} at ${nextRem.time}.`
    };
  }

  // --- 5. ENTITY-BASED ROUTING ---

  // Helper to resolve entity IDs for updates/deletes/completions
  const resolveEntityId = (type: 'memory' | 'reminder' | 'activity'): string | null => {
    const list = type === 'memory' ? memories : type === 'reminder' ? reminders : schedule;
    let topic = norm
      .replace(/delete|remove|cancel|clear|complete|done|finished|mark|hatao|mitao|pura|khatam|sesh/g, '')
      .replace(/memory|memories|reminder|reminders|activity|activities|schedule|alarm/g, '')
      .replace(/about|my|meri|mere|mera|apna|apni|the/g, '')
      .trim();
    if (!topic) return list.length > 0 ? list[0].id : null;
    const found = list.find((item: any) => {
      const title = (item.title || '').toLowerCase();
      const desc = (item.description || '').toLowerCase();
      return title.includes(topic) || topic.includes(title) || desc.includes(topic);
    });
    return found ? found.id : (list.length > 0 ? list[0].id : null);
  };

  // Category: HELP
  if (matchesAny(norm, helpKeys) || semanticCore === 'help' || semanticCore === 'sos') {
    return { intent: 'OPEN_HELP', path: '/help', response: language === 'Hindi' ? 'आपातकालीन संपर्क खोले जा रहे हैं।' : language === 'Bengali' ? 'জরুরী যোগাযোগ খোলা হচ্ছে।' : 'Opening emergency contacts.' };
  }

  // Category: HOME
  if (matchesAny(norm, homeKeys) || semanticCore === 'home') {
    return { intent: 'OPEN_HOME', path: '/', response: language === 'Hindi' ? 'होम स्क्रीन पर जा रहे हैं।' : language === 'Bengali' ? 'হোম স্ক্রিনে ফিরে যাওয়া হচ্ছে।' : 'Going home.' };
  }

  // Category: CAREGIVER
  if (matchesAny(norm, caregiverKeys) || semanticCore === 'caregiver' || semanticCore === 'caregiver dashboard') {
    return { intent: 'OPEN_CAREGIVER', path: '/caregiver', response: language === 'Hindi' ? 'केयरगिवर डैशबोर्ड खोला जा रहा है।' : language === 'Bengali' ? 'কেয়ারগিভার ড্যাশবোর্ড খোলা হচ্ছে।' : 'Opening caregiver dashboard.' };
  }

  // Category: SETTINGS / PROFILE
  if (matchesAny(norm, settingsKeys) || semanticCore === 'settings' || semanticCore === 'profile') {
    return { intent: 'OPEN_SETTINGS', path: '/settings', response: language === 'Hindi' ? 'सेटिंग्स खोली जा रही हैं।' : language === 'Bengali' ? 'সেটিংস খোলা হচ্ছে।' : 'Opening settings.' };
  }

  // Category: BRAIN GAMES
  if (matchesAny(norm, gamesKeys)) {
    if (matchesAny(norm, ['why', 'how do', 'about games'])) return null;

    // Check specific games
    if (matchesAny(norm, ['memory match', 'match game', 'match memory', 'memory matching', 'matching game'])) {
      return { intent: 'OPEN_MEMORY_MATCH', gameId: 'game-1', path: '/games', response: language === 'Hindi' ? 'मेमोरी मैच शुरू किया जा रहा है।' : language === 'Bengali' ? 'মেমরি ম্যাচ শুরু করা হচ্ছে।' : 'Starting Memory Match.' };
    }
    if (matchesAny(norm, ['sequence', 'order', 'sequence order', 'sequence game'])) {
      return { intent: 'PLAY_GAME', gameId: 'game-2', path: '/games', response: language === 'Hindi' ? 'सीक्वेंस और ऑर्डर शुरू किया जा रहा है।' : language === 'Bengali' ? 'সিকোয়েন্স অ্যান্ড অর্ডার শুরু করা হচ্ছে।' : 'Starting Sequence & Order.' };
    }
    if (matchesAny(norm, ['attention', 'focus', 'attention focus', 'attention game'])) {
      return { intent: 'OPEN_ATTENTION_FOCUS', gameId: 'game-3', path: '/games', response: language === 'Hindi' ? 'अटेंशन फोकस शुरू किया जा रहा है।' : language === 'Bengali' ? 'অ্যাটেনশন ফোকাস শুরু করা হচ্ছে।' : 'Starting Attention Focus.' };
    }
    if (matchesAny(norm, ['object', 'recognize', 'recognition', 'object game'])) {
      return { intent: 'OPEN_OBJECT_RECOGNITION', gameId: 'game-4', path: '/games', response: language === 'Hindi' ? 'ऑब्जेक्ट रिकग्निशन शुरू किया जा रहा है।' : language === 'Bengali' ? 'অবজেক্ট রিকগনিশন শুরু করা হচ্ছে।' : 'Starting Object Recognition.' };
    }
    if (matchesAny(norm, ['routine', 'recall', 'routine recall', 'routine game'])) {
      return { intent: 'OPEN_DAILY_ROUTINE', gameId: 'game-5', path: '/games', response: language === 'Hindi' ? 'डेली रूटीन रिकॉल शुरू किया जा रहा है।' : language === 'Bengali' ? 'ডেইলি রুটিন রিকল শুরু করা হচ্ছে।' : 'Starting Daily Routine Recall.' };
    }
    if (matchesAny(norm, ['language', 'word', 'vocabulary', 'word memory'])) {
      return { intent: 'OPEN_LANGUAGE_MEMORY', gameId: 'game-6', path: '/games', response: language === 'Hindi' ? 'लैंग्वेज वर्ड मेमोरी शुरू किया जा रहा है।' : language === 'Bengali' ? 'ল্যাঙ্গুয়েজ ওয়ার্ড মেমোরি শুরু করা হচ্ছে।' : 'Starting Language Word Memory.' };
    }
    return { intent: 'OPEN_BRAIN_GAMES', path: '/games', response: language === 'Hindi' ? 'दिमागी खेल खोले जा रहे हैं।' : language === 'Bengali' ? 'দিমাগি খেলা খোলা হচ্ছে।' : 'Opening brain games.' };
  }

  // Category: MEMORIES
  if (matchesAny(norm, memoriesKeys)) {
    if (matchesAny(norm, ['why', 'how do', 'about memories'])) return null;

    if (matchesAny(norm, deleteKeys)) {
      return {
        intent: 'DELETE_MEMORY',
        parameters: { entityId: resolveEntityId('memory'), confirmed: false },
        response: language === 'Hindi' ? 'क्या आप वाकई इस याद को हटाना चाहते हैं?' : language === 'Bengali' ? 'আপনি কি সত্যিই এই স্মৃতিটি মুছে ফেলতে চান?' : 'Are you sure you want to delete this memory?'
      };
    }
    if (matchesAny(norm, createKeys)) {
      return {
        intent: 'CREATE_MEMORY',
        response: language === 'Hindi' ? 'ज़रूर। आप क्या याद रखना चाहेंगे?' : language === 'Bengali' ? 'নিশ্চয়ই। আপনি কী মনে রাখতে চান?' : 'Sure. What would you like me to remember?'
      };
    }
    if (matchesAny(norm, searchKeys)) {
      const topic = norm.replace(/find|search|khojo|dhoondo|look up|memory|memories|about|my/g, '').trim();
      if (topic) {
        const found = memories.find((m: any) => m.title.toLowerCase().includes(topic) || m.description.toLowerCase().includes(topic));
        if (found) {
          return {
            intent: 'CONVERSATION',
            response: language === 'Hindi' 
              ? `मुझे आपकी याद मिली: "${found.title}"। विवरण: "${found.description}"।` 
              : language === 'Bengali' 
              ? `আমি স্মৃতিটি পেয়েছি: "${found.title}"। বিবরণ: "${found.description}"।` 
              : `I found a memory: "${found.title}". Description: "${found.description}".`
          };
        }
      }
      return {
        intent: 'CONVERSATION',
        response: language === 'Hindi' ? 'मुझे उस विषय के बारे में कोई याद नहीं मिली।' : language === 'Bengali' ? 'আমি সেই বিষয়ে কোনো স্মৃতি খুঁজে পাইনি।' : 'I couldn\'t find any memory about that topic.'
      };
    }
    return { intent: 'OPEN_MEMORIES', path: '/memories', response: language === 'Hindi' ? 'आपकी यादें खोली जा रही हैं।' : language === 'Bengali' ? 'আপনার স্মৃতিগুলি খোলা হচ্ছে।' : 'Opening your memories.' };
  }

  // Category: REMINDERS
  if (matchesAny(norm, remindersKeys)) {
    if (matchesAny(norm, ['why', 'how do', 'about reminders'])) return null;
    if (matchesAny(norm, createKeys)) return null;

    if (matchesAny(norm, deleteKeys)) {
      return {
        intent: 'DELETE_REMINDER',
        parameters: { entityId: resolveEntityId('reminder'), confirmed: false },
        response: language === 'Hindi' ? 'क्या आप वाकई इस रिमाइंडर को हटाना चाहते हैं?' : language === 'Bengali' ? 'আপনি কি সত্যিই এই অনুস্মারকটি মুছে ফেলতে চান?' : 'Are you sure you want to delete this reminder?'
      };
    }
    if (matchesAny(norm, completeKeys)) {
      return {
        intent: 'COMPLETE_REMINDER',
        parameters: { entityId: resolveEntityId('reminder') },
        response: language === 'Hindi' ? 'रिमाइंडर पूरा हो गया है।' : language === 'Bengali' ? 'অনুস্মারক সম্পন্ন হয়েছে।' : 'Reminder completed.'
      };
    }
    return { intent: 'OPEN_REMINDERS', path: '/reminders', response: language === 'Hindi' ? 'रिमाइंडर खोले जा रहे हैं।' : language === 'Bengali' ? 'অনুস্মারক খোলা হচ্ছে।' : 'Opening reminders.' };
  }

  // Category: ACTIVITIES / SCHEDULE
  if (matchesAny(norm, scheduleKeys)) {
    if (matchesAny(norm, ['why', 'how do', 'about activities', 'about schedule'])) return null;
    if (matchesAny(norm, createKeys)) return null;

    if (matchesAny(norm, deleteKeys)) {
      return {
        intent: 'DELETE_ACTIVITY',
        parameters: { entityId: resolveEntityId('activity'), confirmed: false },
        response: language === 'Hindi' ? 'क्या आप वाकई इस गतिविधि को हटाना चाहते हैं?' : language === 'Bengali' ? 'আপনি কি সত্যিই এই কাজটি মুছে ফেলতে চান?' : 'Are you sure you want to delete this activity?'
      };
    }
    if (matchesAny(norm, completeKeys)) {
      return {
        intent: 'COMPLETE_ACTIVITY',
        parameters: { entityId: resolveEntityId('activity') },
        response: language === 'Hindi' ? 'गतिविधि पूरी हो गई है।' : language === 'Bengali' ? 'কাজটি সম্পন্ন হয়েছে।' : 'Activity completed.'
      };
    }
    return { intent: 'OPEN_MY_DAY', path: '/day', response: language === 'Hindi' ? 'आज की दिनचर्या खोली जा रही है।' : language === 'Bengali' ? 'দৈনিক সময়সূচী খোলা হচ্ছে।' : 'Opening daily schedule.' };
  }

  // --- 6. HELP COMMANDS ---
  if (matchesAny(norm, ['help me', 'what can you do', 'available features', 'how do i use', 'what commands', 'কী করতে পারো'])) {
    return {
      intent: 'CONVERSATION',
      response: language === 'Hindi' 
        ? 'मैं आपकी मदद कर सकता हूँ: नेविगेट करने में, यादें सहेजने में, दवा या भोजन के रिमाइंडर जोड़ने में, और दिमागी खेल खेलने में।' 
        : language === 'Bengali' 
        ? 'আমি আপনাকে সাহায্য করতে পারি: নেভিগেট করতে, স্মৃতি সংরক্ষণ করতে, অনুস্মারক যোগ করতে এবং ব্রেন গেম খেলতে।' 
        : 'I can help you navigate the app, add memories, set reminders for medicine or meals, view your schedule, and play brain games.'
    };
  }

  if (matchesAny(norm, ['what are the brain games', 'tell me about the games', 'दिमागी खेल क्या', 'ব্রেন গেম কি কি'])) {
    return {
      intent: 'CONVERSATION',
      response: language === 'Hindi' 
        ? 'उपलब्ध दिमागी खेल हैं: मेमोरी मैच, सीक्वेंस और ऑर्डर, अटेंशन फोकस, ऑब्जेक्ट रिकग्निशन, और डेली रूटीन रीकॉल।' 
        : language === 'Bengali' 
        ? 'ব্রেন গেমগুলি হলো: মেমরি ম্যাচ, সিকোয়েন্স অ্যান্ড অর্ডার, অ্যাটেনশন ফোকাস, অবজেক্ট রিকগনিশন এবং ডেইলি रूटिन रिकल।' 
        : 'The available brain games are: Memory Match, Sequence & Order, Attention Focus, Object Recognition, and Daily Routine Recall.'
    };
  }

  // --- 7. VOICE ASSISTANT CONTROL & LOGS ---
  if (matchesAny(norm, ['repeat that', 'say that again', 'दोहराएं', 'আবার বলুন'])) {
    return {
      intent: 'REPEAT',
      response: ''
    };
  }

  if (matchesAny(norm, ['what did i just say', 'what did i say', 'मैंने क्या कहा', 'আমি কি বললাম'])) {
    return {
      intent: 'LAST_SPOKEN',
      response: ''
    };
  }

  return null;
}


export interface ParsedCommand {
  intent:
    | 'OPEN_MEMORIES'
    | 'OPEN_BRAIN_GAMES'
    | 'OPEN_REMINDERS'
    | 'OPEN_MY_DAY'
    | 'OPEN_HELP'
    | 'OPEN_SETTINGS'
    | 'OPEN_CAREGIVER'
    | 'OPEN_HOME'
    | 'OPEN_PEOPLE'
    | 'CHANGE_LANGUAGE'
    | 'CREATE_ACTIVITY'
    | 'ADD_ACTIVITY'
    | 'ADD_REMINDER'
    | 'PLAY_GAME'
    | 'OPEN_MEMORY_MATCH'
    | 'OPEN_ATTENTION_FOCUS'
    | 'OPEN_OBJECT_RECOGNITION'
    | 'OPEN_DAILY_ROUTINE'
    | 'OPEN_LANGUAGE_MEMORY'
    | 'SHOW_NEXT_ACTIVITY'
    | 'SHOW_TODAYS_SCHEDULE'
    | 'SHOW_REMINDERS'
    | 'CALL_CAREGIVER'
    | 'CANCEL'
    | 'HELP'
    | 'CONVERSATION'
    | 'CHECK_MEMORY_PROGRESS'
    | 'SHOW_FAVORITE_MEMORY'
    | 'PLAN_DAY'
    | 'CALL_CONTACT'
    | 'UNKNOWN';
  path?: string;
  response: string;
  languageValue?: 'English' | 'Hindi' | 'Bengali' | 'Assamese' | 'Manipuri' | 'Khasi' | 'Mizo' | 'Nagamese' | 'Tripuri';
  gameId?: string;
  activityData?: {
    title: string;
    time: string;
    date: string;
    category: 'medicine' | 'hydration' | 'meals' | 'exercise' | 'appointments' | 'family' | 'rest' | 'brain_game' | 'other';
    createReminder: boolean;
    needClarification?: boolean;
    missingField?: 'title' | 'time';
  };
}

export const parseCommandTime = (text: string): string | null => {
  const clean = text.toLowerCase();
  const match = clean.match(/(\d{1,2})(?::(\d{2}))?\s*(am|pm|बजे|pm\b|am\b)?/i);
  if (match) {
    let hours = parseInt(match[1], 10);
    const minutes = match[2] ? parseInt(match[2], 10) : 0;
    const ampm = match[3] ? match[3].toLowerCase() : null;

    if (ampm === 'pm' && hours < 12) hours += 12;
    if (ampm === 'am' && hours === 12) hours = 0;

    if (!ampm) {
      if ((clean.includes('evening') || clean.includes('night') || clean.includes('शाम') || clean.includes('रात') || clean.includes('বিকেল')) && hours < 12) {
        hours += 12;
      }
      if ((clean.includes('afternoon') || clean.includes('dopahar') || clean.includes('দুপুর')) && hours < 12 && hours >= 1 && hours <= 5) {
        hours += 12;
      }
    }

    if (hours >= 0 && hours <= 23 && minutes >= 0 && minutes <= 59) {
      return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
    }
  }
  return null;
};

const extractActivityDetails = (text: string): { title: string; category: 'medicine' | 'hydration' | 'meals' | 'exercise' | 'appointments' | 'family' | 'rest' | 'brain_game' | 'other' } => {
  const clean = text.toLowerCase();
  let title = '';
  let category: 'medicine' | 'hydration' | 'meals' | 'exercise' | 'appointments' | 'family' | 'rest' | 'brain_game' | 'other' = 'other';

  if (clean.includes('walk') || clean.includes('exercise') || clean.includes('yoga') || clean.includes('टहलने') || clean.includes('व्यायाम') || clean.includes('হাঁটা')) {
    title = 'Walk';
    category = 'exercise';
  } else if (clean.includes('medicine') || clean.includes('med') || clean.includes('pill') || clean.includes('tablet') || clean.includes('दवा') || clean.includes('औषध') || clean.includes('ওষুধ')) {
    title = 'Take Medicine';
    category = 'medicine';
  } else if (clean.includes('water') || clean.includes('drink') || clean.includes('hydrate') || clean.includes('पानी') || clean.includes('जल')) {
    title = 'Drink Water';
    category = 'hydration';
  } else if (clean.includes('dinner') || clean.includes('lunch') || clean.includes('breakfast') || clean.includes('eat') || clean.includes('meal') || clean.includes('खाना') || clean.includes('খাবার')) {
    if (clean.includes('dinner') || clean.includes('रात का खाना')) title = 'Dinner';
    else if (clean.includes('lunch') || clean.includes('दोपहर का खाना')) title = 'Lunch';
    else if (clean.includes('breakfast') || clean.includes('नाश्ता')) title = 'Breakfast';
    else title = 'Meals';
    category = 'meals';
  } else if (clean.includes('appointment') || clean.includes('doctor') || clean.includes('clinic') || clean.includes('डॉक्टर') || clean.includes('ডাক্তার')) {
    title = 'Doctor Appointment';
    category = 'appointments';
  } else if (clean.includes('call') || clean.includes('talk') || clean.includes('family') || clean.includes('phone') || clean.includes('बात')) {
    title = 'Call Family';
    category = 'family';
  }

  if (!title) {
    const removeKeywords = [
      'add a reminder for',
      'add a reminder to',
      'remind me to',
      'remind me about',
      'set a reminder for',
      'set a reminder to',
      'add a task for',
      'add reminder',
      'remind me',
      'schedule',
      'create',
      'please',
      'add',
      'for',
      'to',
      'at'
    ];
    let candidate = clean;
    removeKeywords.forEach(kw => {
      candidate = candidate.replace(new RegExp('\\b' + kw + '\\b', 'g'), '');
    });
    candidate = candidate.replace(/\b\d+(\s*(pm|am|बजे|hours|minutes))?\b/g, '');
    candidate = candidate.replace(/\b(tomorrow|today|tomorrow's|today's|morning|evening|afternoon|night)\b/g, '');
    candidate = candidate.trim();
    if (candidate) {
      title = candidate.charAt(0).toUpperCase() + candidate.slice(1);
    } else {
      title = '';
    }
  }

  return { title, category };
};

export const voiceResponseTranslations: Record<string, Record<string, string>> = {
  English: {
    goingHome: 'Going home.',
    startingMemoryMatch: 'Starting Memory Match.',
    startingSequenceOrder: 'Starting Sequence & Order.',
    startingAttentionFocus: 'Starting Attention Focus.',
    startingObjectRecognition: 'Starting Object Recognition.',
    openingBrainGames: 'Opening brain games.',
    openingMemories: 'Opening your memories.',
    openingSettings: 'Opening settings.',
    openingCaregiver: 'Opening caregiver dashboard.',
    openingSchedule: 'Opening daily schedule.',
    openingReminders: 'Opening reminders.',
    openingHelp: 'Opening emergency contacts.',
    createReminderPrompt: 'Sure. What would you like me to remind you about, and what time?',
    schedulePromptTitle: 'What is the name of the activity you want to schedule?',
    schedulePromptTime: 'What time would you like me to remind you about {title}?',
    scheduleAddedSuccess: "Done. I've added your reminder for {title} at {time}.",
    callingCaregiver: "Calling your caregiver Anu."
  },
  Hindi: {
    goingHome: 'होम स्क्रीन पर जा रहे हैं।',
    startingMemoryMatch: 'मेमोरी मैच शुरू किया जा रहा है।',
    startingSequenceOrder: 'सीक्वेंस और ऑर्डर शुरू किया जा रहा है।',
    startingAttentionFocus: 'अटेंशन फोकस शुरू किया जा रहा है।',
    startingObjectRecognition: 'ऑब्जेक्ट रिकग्निशन शुरू किया जा रहा है।',
    openingBrainGames: 'दिमागी खेल खोले जा रहे हैं।',
    openingMemories: 'आपकी यादें खोली जा रही हैं।',
    openingSettings: 'सेटिंग्स खोली जा रही हैं।',
    openingCaregiver: 'केयरगिवर डैशबोर्ड खोला जा रहा है।',
    openingSchedule: 'आज की दिनचर्या खोली जा रही है।',
    openingReminders: 'रिमाइंडर खोले जा रहे हैं।',
    openingHelp: 'आपातकालीन संपर्क खोले जा रहे हैं।',
    createReminderPrompt: 'ज़रूर। आप किस बारे में और किस समय रिमाइंडर सेट करना चाहते हैं?',
    schedulePromptTitle: 'आप किस गतिविधि को दिनचर्या में जोड़ना चाहते हैं?',
    schedulePromptTime: 'आप {title} के लिए किस समय का रिमाइंडर चाहते हैं?',
    scheduleAddedSuccess: 'हो गया। मैंने {title} के लिए {time} बजे का रिमाइंडर जोड़ दिया है।',
    callingCaregiver: 'आपके केयरगिवर अनु को कॉल किया जा रहा है।'
  },
  Bengali: {
    goingHome: 'হোম স্ক্রিনে ফিরে যাওয়া হচ্ছে।',
    startingMemoryMatch: 'মেমরি ম্যাচ শুরু করা হচ্ছে।',
    startingSequenceOrder: 'সিকোয়েন্স অ্যান্ড অর্ডার শুরু করা হচ্ছে।',
    startingAttentionFocus: 'অ্যাটেনশন ফোকাস শুরু করা হচ্ছে।',
    startingObjectRecognition: 'অবজেক্ট রিকগনিশন শুরু করা হচ্ছে।',
    openingBrainGames: 'দিমাগি খেলা খোলা হচ্ছে।',
    openingMemories: 'আপনার স্মৃতিগুলি খোলা হচ্ছে।',
    openingSettings: 'সেটিংস খোলা হচ্ছে।',
    openingCaregiver: 'কেয়ারগিভার ড্যাশবোর্ড খোলা হচ্ছে।',
    openingSchedule: 'দৈনিক সময়সূচী খোলা হচ্ছে।',
    openingReminders: 'অনুস্মারক খোলা হচ্ছে।',
    openingHelp: 'জরুরী যোগাযোগ খোলা হচ্ছে।',
    createReminderPrompt: 'অবশ্যই। আপনি কীসের জন্য এবং কোন সময়ে অনুস্মারক সেট করতে চান?',
    schedulePromptTitle: 'আপনি কোন কাজটি সময়সূচীতে যুক্ত করতে চান?',
    schedulePromptTime: 'আপনি কখন {title} এর অনুস্মারক চান?',
    scheduleAddedSuccess: 'সম্পন্ন হয়েছে। আমি {time} টায় {title} এর অনুস্মারক যুক্ত করেছি।',
    callingCaregiver: 'আপনার কেয়ারগিভার অনু কে কল করা হচ্ছে।'
  },
  Assamese: {
    goingHome: 'ঘৰলৈ যোৱা হৈছে।',
    startingMemoryMatch: 'স্মৃতি সংযোগ আৰম্ভ কৰা হৈছে।',
    startingSequenceOrder: 'ক্ৰম আৰু ক্ৰমাংকন আৰম্ভ কৰা হৈছে।',
    startingAttentionFocus: 'মনোযোগ কেন্দ্ৰীকৰণ আৰম্ভ কৰা হৈছে।',
    startingObjectRecognition: 'বস্তু চিনাক্তকৰণ আৰম্ভ কৰা হৈছে।',
    openingBrainGames: 'মগজুৰ খেলসমূহ খোলা হৈছে।',
    openingMemories: 'আপোনাৰ স্মৃতিসমূহ খোলা হৈছে।',
    openingSettings: 'ছেটিংছ খোলা হৈছে।',
    openingCaregiver: 'কেয়াৰগিভাৰ ড্যাশবৰ্ড খোলা হৈছে।',
    openingSchedule: 'দৈনিক কাৰ্যসূচী খোলা হৈছে।',
    openingReminders: 'অনুস্মাৰক খোলা হৈছে।',
    openingHelp: 'জৰুৰীকালীন যোগাযোগ খোলা হৈছে।',
    createReminderPrompt: 'নিশ্চয়। আপুনি কিহৰ বাবে আৰু কিমান সময়ত অনুস্মাৰক বিচাৰে?',
    schedulePromptTitle: 'আপুনি কি কাম কাৰ্যসূচীত যোগ কৰিব বিচাৰে?',
    schedulePromptTime: 'আপুনি {title} ৰ বাবে কিমান সময়ত অনুস্মাৰক বিচাৰে?',
    scheduleAddedSuccess: 'সম্পন্ন হ’ল। মই {time} বজাত {title} ৰ বাবে অনুস্মাৰক যোগ কৰিলোঁ।',
    callingCaregiver: 'আপোনাৰ কেয়াৰগিভাৰ অনুকলৈ ফোন কৰা হৈছে।'
  },
  Manipuri: {
    goingHome: 'ময়ুমদা হল্লক্লে।',
    startingMemoryMatch: 'মেমোরী ম্যাচ হৌরে।',
    startingSequenceOrder: 'প্যাটার্ন নীংশিংবা হৌরে।',
    startingAttentionFocus: 'মিৎকুপ কেন্দ্ৰীকৰণ হৌরে।',
    startingObjectRecognition: 'পোৎশক চিনাক্তকরণ হৌরে।',
    openingBrainGames: 'ব্রেন গেমশিং হাঙদোক্লে।',
    openingMemories: 'নহাক্কী মেমোরীশিং হাঙদোক্লে।',
    openingSettings: 'সেটিংস হাঙদোক্লে।',
    openingCaregiver: 'কেয়ারগিবর ড্যাশবোর্ড হাঙদোক্লে।',
    openingSchedule: 'নুমিৎ খুদিংগী রুটিন হাঙদোক্লে।',
    openingReminders: 'রিমাইন্ডারশিং হাঙদোক্লে।',
    openingHelp: 'ইমার্জেন্সী কন্টাক্ট হাঙদোক্লে।',
    createReminderPrompt: 'য়াই। নহাক্না করিসিগীদমক অমসুং করম্বা পুংফমদা রিমাইন্ডার থম্বা পামীবগে?',
    schedulePromptTitle: 'নহাক্না করম্বা থবক রুটिनদা হাপচিনবা পামীবগে?',
    schedulePromptTime: 'নহাক্না {title} গী রিমাইন্ডার করম্বা পুংফমদা থম্বা পামীবগে?',
    scheduleAddedSuccess: 'লোইরে। ঐনা {title} গী রিমাইন্ডার {time} দা হাপচিল্লে।',
    callingCaregiver: 'নহাক্কী কেয়ারগিবর अनुদা ফোন তৌরি।'
  },
  Khasi: {
    goingHome: 'Wn leit sha yung.',
    startingMemoryMatch: 'Sdang ialehkai Memory Match.',
    startingSequenceOrder: 'Sdang ialehkai Sequence & Order.',
    startingAttentionFocus: 'Sdang ialehkai Attention Focus.',
    startingObjectRecognition: 'Sdang ialehkai Object Recognition.',
    openingBrainGames: 'Plie ia ki brain games.',
    openingMemories: 'Plie ia ki jingkynmaw jong phi.',
    openingSettings: 'Plie ia ki settings.',
    openingCaregiver: 'Plie ia ka caregiver dashboard.',
    openingSchedule: 'Plie ia ka rukom sngi.',
    openingReminders: 'Plie ia ki jingkynmaw dawai.',
    openingHelp: 'Plie ia ki emergency contacts.',
    createReminderPrompt: 'Hooid. Kumno phi kwah ba ngan pynkynmaw ia phi bad ha ka por aiu?',
    schedulePromptTitle: 'Kaei ka kyrteng ka kam kaba phi kwah pynbeit?',
    schedulePromptTime: 'Ha ka por aiu phi kwah ba ngan pynkynmaw ia phi ia ka {title}?',
    scheduleAddedSuccess: 'La dep. Nga la buh jingkynmaw ia ka {title} ha ka por {time}.',
    callingCaregiver: 'Wn khot ia ka Anu ka nongsumar jong phi.'
  },
  Mizo: {
    goingHome: 'In lamah kan kal leh dawn e.',
    startingMemoryMatch: 'Memory Match khelh tan a ni dawn e.',
    startingSequenceOrder: 'Sequence & Order khelh tan a ni dawn e.',
    startingAttentionFocus: 'Attention Focus khelh tan a ni dawn e.',
    startingObjectRecognition: 'Object Recognition khelh tan a ni dawn e.',
    openingBrainGames: 'Rilru infiamnate hawn a ni e.',
    openingMemories: 'I hriatrengnate hawn a ni e.',
    openingSettings: 'Settings hawn a ni e.',
    openingCaregiver: 'Caregiver dashboard hawn a ni e.',
    openingSchedule: 'Nitin hunruhman hawn a ni e.',
    openingReminders: 'Hriattirnate hawn a ni e.',
    openingHelp: 'Emergency contact te hawn a ni e.',
    createReminderPrompt: 'Tehreng mai. Eng thil nge i hriattir i duh a, eng tik hunah nge?',
    schedulePromptTitle: 'Eng thiltih nge rem i duh le?',
    schedulePromptTime: 'Eng tikah nge {title} hriattirna hi i duh ang le?',
    scheduleAddedSuccess: 'Zau zo ta. {title} hriattirna chu {time} ah siam a ni ta.',
    callingCaregiver: 'I caregiver Anu kan be dawn e.'
  },
  Nagamese: {
    goingHome: 'Ghor te jaise.',
    startingMemoryMatch: 'Memory Match shuru kurise.',
    startingSequenceOrder: 'Sequence & Order shuru kurise.',
    startingAttentionFocus: 'Attention Focus shuru kurise.',
    startingObjectRecognition: 'Object Recognition shuru kurise.',
    openingBrainGames: 'Brain games khulise.',
    openingMemories: 'Apuni laga memories khulise.',
    openingSettings: 'Settings khulise.',
    openingCaregiver: 'Caregiver dashboard khulise.',
    openingSchedule: 'Daily schedule khulise.',
    openingReminders: 'Reminders khulise.',
    openingHelp: 'Emergency contacts khulise.',
    createReminderPrompt: 'Sahi ase. Apuni ke ki hudhabole ase, aru ki time te?',
    schedulePromptTitle: 'Apuni ki activity schedule kuribole mon ase?',
    schedulePromptTime: 'Apuni {title} laga time ki thakibole mon ase?',
    scheduleAddedSuccess: 'Hoise. Apuni laga {title} reminder toh {time} te logaise.',
    callingCaregiver: 'Apuni laga caregiver Anu te call kurise.'
  },
  Tripuri: {
    goingHome: 'Nok te saise.',
    startingMemoryMatch: 'Memory Match choba khaili.',
    startingSequenceOrder: 'Sequence & Order choba khaili.',
    startingAttentionFocus: 'Attention Focus choba khaili.',
    startingObjectRecognition: 'Object Recognition choba khaili.',
    openingBrainGames: 'Brain games khulidi.',
    openingMemories: 'Nini memories khulidi.',
    openingSettings: 'Settings khulidi.',
    openingCaregiver: 'Caregiver dashboard khulidi.',
    openingSchedule: 'Daily schedule khulidi.',
    openingReminders: 'Reminders khulidi.',
    openingHelp: 'Emergency contacts khulidi.',
    createReminderPrompt: 'Kahm khe. Nini ki yaad phailani tong, aru ki time te?',
    schedulePromptTitle: 'Nini ki activity schedule khailani tong?',
    schedulePromptTime: 'Nini {title} reminder time ki thakilani tong?',
    scheduleAddedSuccess: 'Khotom. Nini {title} reminder toh {time} te logadi.',
    callingCaregiver: 'Nini caregiver Anu no call khamui tong.'
  }
};

export const parseVoiceCommand = (text: string, currentLang: string = 'English', voiceContext: any = null): ParsedCommand => {
  let clean = text.trim().toLowerCase();
  const punctuation = [".", ",", "/", "#", "!", "$", "%", "^", "&", "*", ";", ":", "{", "}", "=", "-", "_", "`", "~", "(", ")", "?"];
  punctuation.forEach(p => {
    clean = clean.split(p).join("");
  });
  clean = clean.replace(/\s{2,}/g, " ");

  const dRes = parseDeterministicCommand(clean, currentLang, {
    profile: storageService.getCurrentUser(),
    reminders: storageService.getReminders(),
    schedule: storageService.getSchedule(),
    memories: storageService.getMemories()
  }, voiceContext);
  if (dRes) return dRes;

  const vr = voiceResponseTranslations[currentLang] || voiceResponseTranslations.English;

  // 1. General Conversation check
  const isGreeting = clean.match(/\b(hi|hello|hey|good morning|good afternoon|good evening|good night|namaste|pranam|hello|ஹলো|नमस्कार|नमस्ते|নমস্কার|আসসালামু আলাইকুম)\b/i);
  const isHowAreYou = clean.match(/\b(how are you|how is it going|how do you do|how are you doing|आप कैसे हैं|तुम कैसे हो|केम छ|কেমন আছেন|কেমন আছো)\b/i);
  const isWhoAreYou = clean.match(/\b(who are you|what is this|what is this app|about this app|tell me about yourself|what can you do|help me|explain this app|explain this application|how can you help|what features are available|features of this app|क्या कर सकते हो|तुम कौन हो|तुम्हारी क्या विशेषताएं हैं|तुम मेरी मदद कैसे कर सकते हो|তুমি কে|এই অ্যাপটি কি|তুমি কি করতে পারো|তুমি আমাকে কিভাবে সাহায্য করবে)\b/i);
  const isThankYou = clean.match(/\b(thank you|thanks|thank you so much|dhanyawad|shukriya|धन्यवाद|शुक्रिया|ধন্যবাদ)\b/i);

  const whoAreYouDict: Record<string, string> = {
    English: "I'm ALPINE, your memory companion. I can help you stay on track with daily activities, set reminders for medicine or meals, view your cherished memories, play brain-training games, and stay connected with your caregiver.",
    Hindi: "मैं अल्पाइन हूँ, आपका मेमोरी साथी। मैं आपके दिनचर्या को व्यवस्थित करने, दवा या पानी पीने के रिमाइंडर जोड़ने, आपके पसंदीदा पलों और यादों को सहेजने, और आपके दिमाग की कसरत के लिए मज़ेदार गेम्स खेलने में आपकी मदद कर सकता हूँ।",
    Bengali: "আমি অ্যালপাইন, আপনার স্মৃতি সহচর। আমি আপনাকে অনুস্মারক যোগ করতে, আপনার সুন্দর স্মৃতিগুলি দেখতে, প্রতিদিনের রুটিন পরিচালনা করতে বা ব্রেন গেম খেলতে সাহায্য করতে পারি।",
    Assamese: "মই এলপাইন, আপোনাৰ স্মৃতি সংগী। মই আপোনাক দিনটোৰ কাম কাজ পৰিচালনা কৰাত, ঔষধ বা খোৱা-বোৱাৰ অনুস্মাৰক সংৰক্ষণ কৰাত, পুৰণি স্মৃতিবোৰ চাবলৈ আৰু স্মৃতিশক্তি বৃদ্ধিৰ বাবে বিভিন্ন খেল খেলিবলৈ সহায় কৰিব পাৰোঁ।",
    Manipuri: "ঐনা এল্পাইন নি, नহাক্কী মেমোরী পার্টনার। ঐনা নহাকপু নুমিৎসিগী থবকশিং অমসুং রিমাইন্ডার থম্বা, মেমোরী য়েংবা অমসুং ব্রেন গেম শানবদা মতেং পাংগনি।",
    Khasi: "Nga dei u ALPINE, u nongsynran jingkynmaw jong phi. Nga lah ban iarap ia phi ban pynbeit ia ki kam kiba man la ka sngi, ban buh jingkynmaw ia ki dawai, ban peit ia ki dur bad jingkynmaw ba phi ieit, bad ban ialehkai games ban pynkhlain ia ka bor pyrkhat jong phi.",
    Mizo: "ALPINE ka ni a, i hriatna kawnga i kawppui tur ka ni. I nitin hna te, damdawi eina tur leh thil dang hriatnawn tur te chhinchhiah a, i thlalak leh nuam i tih thil te thlirtir che leh i rilru chakna tur infiamna te khelhpui che ka thei a ni.",
    Nagamese: "Mui ALPINE ase, apuni laga memory companion. Mui apuni ke aji laga schedule banabole, medicine reminders thakibole, apuni laga bhal pora mon thaka yaad khan sabole, aru dimaag laga games khelibole modot kuribole pare.",
    Tripuri: "Ang ALPINE, nini chokhichang companion. Ang nini dinni kamrok porichalona khailani, dawaini yaad phailani, kahm chokhichang yaadrok naini, te solomni khelrok khelphai choba khamdi."
  };

  const greetingDict: Record<string, string> = {
    English: "Hello! It's great to talk to you. How can I help you today?",
    Hindi: "नमस्ते! आपसे बात करके बहुत अच्छा लगा। आज मैं आपकी क्या मदद कर सकता हूँ?",
    Bengali: "নমস্কার! আপনার সাথে কথা বলতে পেরে খুব ভালো লাগছে। আজ আমি আপনাকে কীভাবে সাহায্য করতে পারি?",
    Assamese: "নমস্কাৰ! আপোনাৰ লগত কথা পাতি বৰ ভাল লাগিল। আজি মই আপোনাক কেনেকৈ সহায় কৰিব পাৰোঁ?",
    Manipuri: "খুরুমজরি! নহাক্কা ঙাংবসি ঐঙোন্দা নুংঙাই। ঐনা করম্না মতেং পাংগে?",
    Khasi: "Khublei! Sngewbha ban iakren bad phi. Kumno nga lah ban iarap ia phi ha kane ka sngi?",
    Mizo: "Chibai! I hnen a tawng chu a nuam hle mai. Vawiin hian engtin nge ka tanpui theih ang che?",
    Nagamese: "Hello! Apuni logote kotha kobole bisi bhal lagise. Aji apuni ke ki modot kuribole pare?",
    Tripuri: "Khulumkha! Nini logote kok salani khapang tong. Ang nino chini choba khalai?"
  };

  const howAreYouDict: Record<string, string> = {
    English: "I'm doing great, thank you for asking! How are you doing today?",
    Hindi: "मैं बहुत अच्छा हूँ, पूछने के लिए धन्यवाद! आप आज कैसे महसूस कर रहे हैं?",
    Bengali: "আমি খুব ভালো আছি, জিজ্ঞাসা করার জন্য धन्यवाद! आज আপনি কেমন আছেন?",
    Assamese: "মই ভালে আছোঁ, সোধাৰ বাবে ধন্যবাদ! আজি আপুনি কেনে অনুভৱ কৰিছে?",
    Manipuri: "ঐ নুংঙাইরি, হংবীবগীদমক থাগৎচরি! নহাক করম্না লৈরি?",
    Khasi: "Nga koit khiah bha, khublei ba phi kylli! Phi kumno phi koit phi khiah?",
    Mizo: "Dam tha e, i thil zawh avangin ka lawm e! Vawiin lam i hriselna te a tha em?",
    Nagamese: "Mui toh bisi bhal ase, kotha hudhibole bisi bhal lagise! Apuni aji bhal ase na?",
    Tripuri: "Ang kahm tong, singma chongyal khulumkha! Nini sal chichi kahm tong?"
  };

  const thankYouDict: Record<string, string> = {
    English: "You're very welcome! I'm happy to help.",
    Hindi: "आपका बहुत-बहुत स्वागत है! मुझे आपकी मदद करके खुशी हुई।",
    Bengali: "আপনাকে অনেক স্বাগত! আপনার সাহায্য করতে পেরে খুব ভালো লেগেছে।",
    Assamese: "আপোনাক আদৰণি জনাইছোঁ! আপোনাক সহায় কৰিবলৈ পাই মই সুখী।",
    Manipuri: "নহাকপু তরাম্না ওকচরি! মতেং পাংবা ফংবদা ঐ হরাওই।",
    Khasi: "Khublei sngewbha! Sngewbha ban iarap.",
    Mizo: "I lawmthu sawi avangin ka lawm e! Tanpui che chu nuam ka ti hle mai.",
    Nagamese: "Apuni ke bisi welcome! Apuni ke modot kurikena bisi khushi paise.",
    Tripuri: "Nino khulumkha! Choba khaini khapang tong."
  };

  if (isWhoAreYou) {
    return {
      intent: 'CONVERSATION',
      response: whoAreYouDict[currentLang] || whoAreYouDict.English
    };
  }
  if (isGreeting) {
    return {
      intent: 'CONVERSATION',
      response: greetingDict[currentLang] || greetingDict.English
    };
  }
  if (isHowAreYou) {
    return {
      intent: 'CONVERSATION',
      response: howAreYouDict[currentLang] || howAreYouDict.English
    };
  }
  if (isThankYou) {
    return {
      intent: 'CONVERSATION',
      response: thankYouDict[currentLang] || thankYouDict.English
    };
  }

  // 2. High-priority contextual / data-driven queries (Checked before simple navigation)
  // Check memory progress
  if (clean.includes('improving') || clean.includes('getting better') || clean.includes('performance changed') || clean.includes('doing better') || clean.includes('how have i been performing') || clean.includes('improved recently') || clean.includes('how is my memory') || clean.includes('प्रगति') || clean.includes('उन्नति') || clean.includes('ভালো আছি') || clean.includes('উন্নতি হচ্ছে')) {
    return {
      intent: 'CHECK_MEMORY_PROGRESS',
      response: currentLang === 'Hindi' ? 'आपके मेमोरी प्रदर्शन का विश्लेषण किया जा रहा है...' : currentLang === 'Bengali' ? 'আপনার মেমরি ডেটা বিশ্লেষণ করা হচ্ছে...' : 'Analyzing your memory data...'
    };
  }

  // Favorite memory
  if (clean.includes('favorite memory') || clean.includes('favourite memory') || clean.includes('memory i love') || clean.includes('something important i saved') || clean.includes('पसंदीदा याद') || clean.includes('पसंदीदा स्मृति') || clean.includes('পছন্দের স্মৃতি')) {
    return {
      intent: 'SHOW_FAVORITE_MEMORY',
      response: currentLang === 'Hindi' ? 'आपकी पसंदीदा याद की तलाश की जा रही है...' : currentLang === 'Bengali' ? 'আপনার পছন্দের স্মৃতি খোঁজা হচ্ছে...' : 'Looking up your favorite memory...'
    };
  }

  // Plan day / daily planning
  if (clean.includes('should i do today') || clean.includes('day look') || clean.includes('organize my day') || clean.includes('plan today') || clean.includes('plan my day') || clean.includes('have planned') || clean.includes('दिनचर्या कैसी') || clean.includes('आज क्या करना है') || clean.includes('আজ কি করতে')) {
    return {
      intent: 'PLAN_DAY',
      response: currentLang === 'Hindi' ? 'आपकी आज की दिनचर्या की जांच की जा रही है...' : currentLang === 'Bengali' ? 'আপনার আজকের সময়সূচী দেখা হচ্ছে...' : 'Organizing your schedule...'
    };
  }

  // Call contact
  if (clean.includes('call') || clean.includes('phone') || clean.includes('contact') || clean.includes('फोन') || clean.includes('कॉल') || clean.includes('কল')) {
    if (clean.includes('daughter') || clean.includes('anu') || clean.includes('son') || clean.includes('ramesh') || clean.includes('wife') || clean.includes('meena') || clean.includes('doctor') || clean.includes('barua') || clean.includes('অনু') || clean.includes('রিমেশ') || clean.includes('মীনা') || clean.includes('ডাক্তার') || clean.includes('बेटे') || clean.includes('पत्नी')) {
      let contactName = '';
      if (clean.includes('daughter') || clean.includes('anu') || clean.includes('অনু')) contactName = 'Anu';
      else if (clean.includes('son') || clean.includes('ramesh') || clean.includes('রিমেশ') || clean.includes('बेटে')) contactName = 'Ramesh';
      else if (clean.includes('wife') || clean.includes('meena') || clean.includes('মীনা') || clean.includes('पत्नी')) contactName = 'Meena';
      else if (clean.includes('doctor') || clean.includes('barua') || clean.includes('ডাক্তার')) contactName = 'Dr. Barua';

      return {
        intent: 'CALL_CONTACT',
        response: contactName 
          ? (currentLang === 'Hindi' ? `${contactName} को कॉल किया जा रहा है...` : currentLang === 'Bengali' ? `${contactName} কে কল করা হচ্ছে...` : `Calling ${contactName}...`)
          : (currentLang === 'Hindi' ? 'आप किसे कॉल करना चाहेंगे?' : currentLang === 'Bengali' ? 'আপনি কাকে কল করতে চান?' : 'Who would you like me to call?'),
        activityData: {
          title: contactName || 'family',
          time: '',
          date: '',
          category: 'family',
          createReminder: false
        }
      };
    }
  }

  // Emergency contact caregiver
  if (clean.includes('call anu') || clean.includes('contact caregiver') || clean.includes('अनु को फोन') || clean.includes('केयरगिवर')) {
    return { 
      intent: 'CALL_CAREGIVER', 
      response: vr.callingCaregiver
    };
  }

  // Navigation commands mapping
  if (clean.includes('home') || clean.includes('होम') || clean.includes('ঘর')) {
    return { intent: 'OPEN_HOME', path: '/', response: vr.goingHome };
  }
  if (clean.includes('brain games') || clean.includes('brain game') || clean.includes('play games') || clean.includes('play game') || clean.includes('games') || clean.includes('ब्रेन गेम') || clean.includes('গেম')) {
    if (clean.includes('memory match') || clean.includes('memory game')) {
      return { intent: 'OPEN_MEMORY_MATCH', gameId: 'game-1', path: '/games', response: vr.startingMemoryMatch };
    }
    if (clean.includes('sequence') || clean.includes('order')) {
      return { intent: 'PLAY_GAME', gameId: 'game-2', path: '/games', response: vr.startingSequenceOrder };
    }
    if (clean.includes('attention') || clean.includes('focus')) {
      return { intent: 'OPEN_ATTENTION_FOCUS', gameId: 'game-3', path: '/games', response: vr.startingAttentionFocus };
    }
    if (clean.includes('object') || clean.includes('recognize')) {
      return { intent: 'OPEN_OBJECT_RECOGNITION', gameId: 'game-4', path: '/games', response: vr.startingObjectRecognition };
    }
    if (clean.includes('routine') || clean.includes('recall')) {
      return { intent: 'OPEN_DAILY_ROUTINE', gameId: 'game-5', path: '/games', response: currentLang === 'Hindi' ? 'डेली रूटीन रिकॉल शुरू किया जा रहा है।' : 'Starting Daily Routine Recall.' };
    }
    if (clean.includes('language') || clean.includes('word') || clean.includes('vocabulary')) {
      return { intent: 'OPEN_LANGUAGE_MEMORY', gameId: 'game-6', path: '/games', response: currentLang === 'Hindi' ? 'लैंग्वेज वर्ड मेमोरी शुरू किया जा रहा है।' : 'Starting Language Word Memory.' };
    }
    return { intent: 'OPEN_BRAIN_GAMES', path: '/games', response: vr.openingBrainGames };
  }
  
  if (clean.includes('memory') || clean.includes('memories') || clean.includes('photo') || clean.includes('यादें') || clean.includes('স্মৃতি')) {
    return { intent: 'OPEN_MEMORIES', path: '/memories', response: vr.openingMemories };
  }

  if (clean.includes('settings') || clean.includes('सेटिंग') || clean.includes('profile') || clean.includes('account') || clean.includes('प्रोफाइल')) {
    return { intent: 'OPEN_SETTINGS', path: '/settings', response: vr.openingSettings };
  }
  if (clean.includes('settings') || clean.includes('सेटिंग')) {
    return { intent: 'OPEN_SETTINGS', path: '/settings', response: vr.openingSettings };
  }

  if (clean.includes('caregiver dashboard') || clean.includes('caregiver panel')) {
    return { intent: 'OPEN_CAREGIVER', path: '/caregiver', response: vr.openingCaregiver };
  }

  if (clean.includes('my day') || clean.includes('schedule') || clean.includes('today schedule') || clean.includes('दिनचर्या') || clean.includes('শডিউল')) {
    if (!clean.includes('add') && !clean.includes('create') && !clean.includes('schedule a') && !clean.includes('remind')) {
      return { intent: 'OPEN_MY_DAY', path: '/day', response: vr.openingSchedule };
    }
  }

  if (clean.includes('reminders') || clean.includes('reminder') || clean.includes('alarm')) {
    if (!clean.includes('add') && !clean.includes('create') && !clean.includes('schedule') && !clean.includes('remind')) {
      return { intent: 'OPEN_REMINDERS', path: '/reminders', response: vr.openingReminders };
    }
  }

  if (clean.includes('help') || clean.includes('emergency') || clean.includes('मदद') || clean.includes('সাহায্য')) {
    return { intent: 'OPEN_HELP', path: '/help', response: vr.openingHelp };
  }

  // Create Activity / Add Reminder intents
  const isCreate = clean.includes('add') || clean.includes('create') || clean.includes('schedule') || clean.includes('remind') || clean.includes('जोड़ो') || clean.includes('বজে') || clean.includes('reminder') || clean.includes('task');
  if (isCreate) {
    const time = parseCommandTime(clean);
    const { title, category } = extractActivityDetails(clean);

    let date = new Date().toISOString().split('T')[0];
    if (clean.includes('tomorrow') || clean.includes('कल') || clean.includes('আগামীকাল')) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      date = tomorrow.toISOString().split('T')[0];
    }

    const hasTitle = title.length > 0;
    const hasTime = time !== null;

    if (!hasTitle && !hasTime) {
      return {
        intent: 'CREATE_ACTIVITY',
        response: vr.createReminderPrompt,
        activityData: {
          title: '',
          time: '',
          date,
          category: 'other',
          createReminder: true,
          needClarification: true,
          missingField: 'title'
        }
      };
    }

    if (!hasTitle) {
      return {
        intent: 'CREATE_ACTIVITY',
        response: vr.schedulePromptTitle,
        activityData: {
          title: '',
          time: time || '18:00',
          date,
          category,
          createReminder: true,
          needClarification: true,
          missingField: 'title'
        }
      };
    }

    if (!hasTime) {
      return {
        intent: 'CREATE_ACTIVITY',
        response: vr.schedulePromptTime.replace('{title}', title),
        activityData: {
          title,
          time: '',
          date,
          category,
          createReminder: true,
          needClarification: true,
          missingField: 'time'
        }
      };
    }

    return {
      intent: 'CREATE_ACTIVITY',
      response: vr.scheduleAddedSuccess.replace('{title}', title).replace('{time}', time),
      activityData: {
        title,
        time,
        date,
        category,
        createReminder: true
      }
    };
  }

  // Fallback
  const fallbackDict: Record<string, string> = {
    English: "I didn't quite understand that. Could you tell me a little more?",
    Hindi: "मुझे यह पूरी तरह समझ नहीं आया। क्या आप थोड़ा और बता सकते हैं?",
    Bengali: "আমি এটি ঠিক বুঝতে পারিনি। আপনি কি আর একটু বিস্তারিত বলতে পারেন?",
    Assamese: "মই কথাটো ভালদৰে বুজি নাপালোঁ। অলপ বহলাই ক’ব নেকি?",
    Manipuri: "ঐ খঙবা ঙমদ্রে, অমুক্তা হন্না হায়বীউ?",
    Khasi: "Nga khlem da sngewthuh bha. Lah ban kynthup kham bniah?",
    Mizo: "Ka va hrethiam chiah lo ve. Khawngaihin sawi thar leh ta che?",
    Nagamese: "Mui bhal pora huna nai. Aru ekbar bhal pora kobi na?",
    Tripuri: "Ang bujilakhlai. Aru chichi samphurdi?"
  };

  return {
    intent: 'UNKNOWN',
    response: fallbackDict[currentLang] || fallbackDict.English
  };
};
