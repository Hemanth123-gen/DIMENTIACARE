const fullWeekdaysMap: Record<string, string[]> = {
  English: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  Hindi: ['रविवार', 'सोमवार', 'मंगलवार', 'बुधवार', 'गुरुवार', 'शुक्रवार', 'शनिवार'],
  Bengali: ['রবিবার', 'সোমবার', 'মঙ্গলবার', 'বুধবার', 'বৃহস্পতিবার', 'শুক্রবার', 'শনিবার'],
  Assamese: ['দেওবাৰ', 'সোমবাৰ', 'মঙলবাৰ', 'বুধবাৰ', 'বৃহস্পতিবাৰ', 'শুক্ৰবাৰ', 'শনিবাৰ'],
  Manipuri: ['নোংমাইজিং', 'নিংথৌকাবা', 'লৈপাকপোকপা', 'য়ুমশাকৈশা', 'শাগোলশেন', 'ইরাই', 'থাংজা'],
  Khasi: ['Sngi U Blei', 'Sngi Nyngkong', 'Sngi Ba-ar', 'Sngi Balang', 'Sngi Pale', 'Sngi Thohdieng', 'Sngi Saitjain'],
  Mizo: ['Pathianni', 'Thawhtanni', 'Thawhlehni', 'Nilaini', 'Ningani', 'Zirtawpni', 'Inrinni'],
  Nagamese: ['Deobar', 'Sombar', 'Mongolbar', 'Budhbar', 'Brihospotibar', 'Sukrobar', 'Sonibar'],
  Tripuri: ['Salbar', 'Sombar', 'Mongolbar', 'Budhbar', 'Brihospotibar', 'Sukrobar', 'Sonibar']
};

const fullMonthsMap: Record<string, string[]> = {
  English: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  Hindi: ['जनवरी', 'फरवरी', 'मार्च', 'अप्रैल', 'मई', 'जून', 'जुलाई', 'अगस्त', 'सितंबर', 'अक्टूबर', 'नवंबर', 'दिसंबर'],
  Bengali: ['জানুয়ারী', 'ফেব্রুয়ারী', 'মার্চ', 'এপ্রিল', 'মে', 'জুন', 'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর'],
  Assamese: ['জানুৱাৰী', 'ফেব্ৰুৱাৰী', 'মাৰ্চ', 'এপ্ৰিল', 'মে’', 'জুন', 'জুলাই', 'আগষ্ট', 'ছেপ্টেম্বৰ', 'অক্টোবৰ', 'নৱেম্বৰ', 'ডিচেম্বৰ'],
  Manipuri: ['জানুয়ারী', 'ফেব্রুয়ারী', 'মার্চ', 'এপ্রিল', 'মে', 'জুন', 'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'দিসেম্বর'],
  Khasi: ['Kyllalyngkot', 'Rymphang', 'Lber', 'Iaiong', 'Jymmang', 'Jylliew', 'Naitung', 'August', 'September', 'Risaw', 'Naiwieng', 'Nohprah'],
  Mizo: ['Pawltlak', 'Ramting', 'Vau', 'Tau', 'Lamtial', 'Nikong', 'Vawkpui', 'August', 'September', 'October', 'November', 'Disember'],
  Nagamese: ['Januari', 'Februari', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  Tripuri: ['Januari', 'Februari', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
};

const shortWeekdaysMap: Record<string, string[]> = {
  English: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  Hindi: ['रवि', 'सोम', 'मंगल', 'बुध', 'गुरु', 'शुक्र', 'शनि'],
  Bengali: ['রবি', 'সোম', 'মঙ্গল', 'বুধ', 'বৃহ', 'শুক্র', 'শনি'],
  Assamese: ['দেও', 'সোম', 'মঙল', 'বুধ', 'বৃহ', 'শুক্র', 'শনি'],
  Manipuri: ['নোং', 'নিং', 'লৈ', 'য়ুম', 'শাগোল', 'ইরাই', 'থাং'],
  Khasi: ['Blei', 'Nyng', 'Ar', 'Lang', 'Pale', 'Thoh', 'Sait'],
  Mizo: ['Pathian', 'Thawh', 'Leh', 'Nila', 'Ning', 'Zir', 'Inrin'],
  Nagamese: ['Deo', 'Som', 'Mongol', 'Budh', 'Brihos', 'Sukro', 'Soni'],
  Tripuri: ['Sal', 'Som', 'Mongol', 'Budh', 'Brihos', 'Sukro', 'Soni']
};

const shortMonthsMap: Record<string, string[]> = {
  English: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  Hindi: ['जन', 'फर', 'मार्च', 'अपरै', 'मई', 'जून', 'जुला', 'अग', 'सित', 'अक्टू', 'नव', 'दिस'],
  Bengali: ['জানু', 'ফেব্রু', 'মার্চ', 'এপ্রিল', 'মে', 'জুন', 'জুলাই', 'আগ', 'সেপ্টে', 'অক্টো', 'নভে', 'ডিসে'],
  Assamese: ['জানু', 'ফেব্ৰু', 'মাৰ্চ', 'এপ্ৰিল', 'মে’', 'জুন', 'জুলাই', 'আগ', 'ছেপ্টে', 'অক্টো', 'নৱে', 'ডিচে'],
  Manipuri: ['জানু', 'ফেব্ৰু', 'মার্চ', 'এপ্রিল', 'মে', 'জুন', 'জুলাই', 'আগ', 'সেপ্টে', 'অক্টো', 'নভে', 'ডিসে'],
  Khasi: ['Kyl', 'Rym', 'Lbe', 'Iai', 'Jym', 'Jyl', 'Nai', 'Aug', 'Sep', 'Ris', 'Naiw', 'Noh'],
  Mizo: ['Pawl', 'Ram', 'Vau', 'Tau', 'Lam', 'Nik', 'Vawk', 'Aug', 'Sep', 'Oct', 'Nov', 'Dis'],
  Nagamese: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  Tripuri: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
};

export const getFormattedDate = (date: Date = new Date(), language: string = 'English'): string => {
  const days = fullWeekdaysMap[language] || fullWeekdaysMap.English;
  const months = fullMonthsMap[language] || fullMonthsMap.English;
  
  const dayName = days[date.getDay()];
  const monthName = months[date.getMonth()];
  const dayNum = date.getDate();
  const year = date.getFullYear();
  
  return `${dayName}, ${dayNum} ${monthName} ${year}`;
};

export const getLocalizedShortDay = (jsDayIndex: number, language: string = 'English'): string => {
  const days = shortWeekdaysMap[language] || shortWeekdaysMap.English;
  return days[jsDayIndex];
};

export const getLocalizedShortMonth = (monthIndex: number, language: string = 'English'): string => {
  const months = shortMonthsMap[language] || shortMonthsMap.English;
  return months[monthIndex];
};

export const getISODateString = (date: Date = new Date()): string => {
  const offset = date.getTimezoneOffset();
  const localDate = new Date(date.getTime() - (offset * 60 * 1000));
  return localDate.toISOString().split('T')[0];
};
