import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LifeBuoy, AlertTriangle, Phone, Activity, Heart, ArrowLeft, ShieldAlert } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { storageService } from '../services/storageService';

const localHelpTranslations: Record<string, Record<string, string>> = {
  English: {
    subtitle: 'If you need immediate support, tap one of the large buttons below.',
    emergencyTitle: 'Emergency Assistance',
    emergencySub: 'Tap a button below to alert your family or medical team.',
    callCaregiver: 'Call Caregiver (Anu)',
    callAmbulance: 'Call Ambulance (108)',
    doctorTitle: 'Doctor Information',
    callDoctor: 'Call Doctor',
    medicationTitle: 'Medication Help',
    medicationSub: 'Not sure which pill to take? Contact Anu or check your prescription box on the sidebar.',
    viewMeds: 'View Medications',
    dialing: 'Dialing Emergency...',
    cancelCall: 'Cancel Call'
  },
  Assamese: {
    subtitle: 'যদি আপোনাক তাৎক্ষণিক সহায়ৰ প্ৰয়োজন হয়, তলৰ ডাঙৰ বুটামবোৰত টিপক।',
    emergencyTitle: 'জৰুৰীকালীন সহায়',
    emergencySub: 'আপোনাৰ পৰিয়াল বা চিকিৎসা দলক সজাগ কৰিবলৈ তলৰ বুটামত টিপক।',
    callCaregiver: 'তত্ত্বাৱধায়কক কল কৰক (অনু)',
    callAmbulance: 'এম্বুলেন্সক কল কৰক (১০৮)',
    doctorTitle: 'চিকিৎসকৰ তথ্য',
    callDoctor: 'চিকিৎসকক কল কৰক',
    medicationTitle: 'ঔষধৰ সহায়',
    medicationSub: 'কোনটো টেবলেট ল’ব লাগে নিশ্চিত নহয়? অনুৰ সৈতে যোগাযোগ কৰক বা চাইডবাৰত থকা ঔষধৰ বাকচ চাওক।',
    viewMeds: 'ঔষধবোৰ চাওক',
    dialing: 'জৰুৰীকালীন নম্বৰ ডায়েল কৰা হৈছে...',
    cancelCall: 'কল বাতিল কৰক'
  },
  Bengali: {
    subtitle: 'যদি আপনার অবিলম্বে সাহায্যের প্রয়োজন হয়, তবে নিচের বড় বোতামগুলিতে আলতো চাপুন।',
    emergencyTitle: 'জরুরী সহায়তা',
    emergencySub: 'আপনার পরিবার বা মেডিকেল टीमকে সতর্ক করতে নিচের বোতামে চাপুন।',
    callCaregiver: 'কেয়ারগিভারকে কল করুন (অনু)',
    callAmbulance: 'অ্যাম্বুলেন্স কল করুন (১০৮)',
    doctorTitle: 'ডাক্তারের তথ্য',
    callDoctor: 'ডাক্তারকে কল করুন',
    medicationTitle: 'ওষুধের সাহায্য',
    medicationSub: 'কোন ওষুধটি খাবেন তা নিশ্চিত নন? অনুর সাথে যোগাযোগ করুন বা সাইডবারে আপনার প্রেসক্রিপশন বাক্স দেখুন।',
    viewMeds: 'ওষুধগুলি দেখুন',
    dialing: 'জরুরি ডায়াল করা হচ্ছে...',
    cancelCall: 'কল বাতিল করুন'
  },
  Hindi: {
    subtitle: 'यदि आपको तत्काल सहायता की आवश्यकता है, तो नीचे दिए गए बड़े बटनों पर टैप करें।',
    emergencyTitle: 'आपातकालीन सहायता',
    emergencySub: 'अपने परिवार या मेडिकल टीम को सूचित करने के लिए नीचे दिए गए बटन पर टैप करें।',
    callCaregiver: 'केयरगिवर को कॉल करें (अनु)',
    callAmbulance: 'एम्बुलेंस बुलाएं (108)',
    doctorTitle: 'डॉक्टर की जानकारी',
    callDoctor: 'डॉक्टर को कॉल करें',
    medicationTitle: 'दवा सहायता',
    medicationSub: 'पता नहीं कौन सी दवा लेनी है? अनु से संपर्क करें या साइडबार पर दवा सूची देखें।',
    viewMeds: 'दवाएं देखें',
    dialing: 'आपातकालीन डायलिंग...',
    cancelCall: 'कॉल रद्द करें'
  },
  Manipuri: {
    subtitle: 'অফবা মতেং পাম্লগদি মখাগী অফবা বটনশিংদা নম্বীউ।',
    emergencyTitle: 'অচৌবা মতেং',
    emergencySub: 'নহাক্কী ইমুং নত্রগা লাইয়েং টিমদা পাউ পীনবা মখাগী বটনদা নম্বীউ।',
    callCaregiver: 'কেয়ারগিভরদা কৌবীউ (অনু)',
    callAmbulance: 'এম্বুলেন্স কৌবীউ (১০৮)',
    doctorTitle: 'ডাক্তরগী পাউদম',
    callDoctor: 'ডাক্তরদা কৌবীউ',
    medicationTitle: 'হিদাক মতেং',
    medicationSub: 'করম্বা হিদাক লৌশিগদগে খঙদ্রিগদি অনুদা পাউ পিউ নত্রগা হিদাক বক্স য়েংঙু।',
    viewMeds: 'হিদাকশিং য়েংঙু',
    dialing: 'দাইলিং তৌরি...',
    cancelCall: 'কৌবা থিংঙু'
  },
  Khasi: {
    subtitle: 'Lada phi donkam jingiarap kloi, thap ha ki phrah kiba heh harum.',
    emergencyTitle: 'Jingiarap Kyndeh',
    emergencySub: 'Thap ia u phrah harum ban pyntip ia ka longing lane ki nongsumar.',
    callCaregiver: 'Phone ia u Nongsumar (Anu)',
    callAmbulance: 'Phone Ambulance (108)',
    doctorTitle: 'Jingtip Doctor',
    callDoctor: 'Phone Doctor',
    medicationTitle: 'Jingiarap Dawai',
    medicationSub: 'Bym tikna ia u dawai ban dih? Pyniasoh bad u Anu lane peit ia ka synduk dawai.',
    viewMeds: 'Peit ia ki Dawai',
    dialing: 'Kyntiew kyndeh...',
    cancelCall: 'Khang ia ka phone'
  },
  Mizo: {
    subtitle: 'Puihna i mamawh thut chuan, a hnuaia hmehna lian pui pui hi hmet rawh.',
    emergencyTitle: 'Chhiatrupna Puihna',
    emergencySub: 'I chhungte emaw damdawi in lam hriattir turin a hnuaia hmehna hi hmet rawh.',
    callCaregiver: 'Enkoltu call rawh (Anu)',
    callAmbulance: 'Ambulance call rawh (108)',
    doctorTitle: 'Doctor Chanchin',
    callDoctor: 'Doctor call rawh',
    medicationTitle: 'Damdawi Puihna',
    medicationSub: 'Damdawi ei tur i hriat chian loh chuan Anu be pawh la, emaw i damdawi bawm en rawh.',
    viewMeds: 'Damdawi en rawh',
    dialing: 'Call mek a ni...',
    cancelCall: 'Cancel rawh'
  },
  Nagamese: {
    subtitle: 'Mili modot lage koile, nichete thaka dangor button khan te tap koribi.',
    emergencyTitle: 'Emergency Modot',
    emergencySub: 'Apuni poriyal ke alert koribole nichete tap koribi.',
    callCaregiver: 'Caregiver ke call koribi (Anu)',
    callAmbulance: 'Ambulance ke call koribi (108)',
    doctorTitle: 'Doctor information',
    callDoctor: 'Doctor ke call koribi',
    medicationTitle: 'Dawai modot',
    medicationSub: 'Kuntu dawai khabo najani koile Anu ke call koribi nahoile side bar te dawai box chabi.',
    viewMeds: 'Dawai khan chabi',
    dialing: 'Emergency dialing...',
    cancelCall: 'Call cancel koribi'
  },
  Tripuri: {
    subtitle: 'Nini thwmani chubam nangkha hinba, kaitor bojakrokno khamdi.',
    emergencyTitle: 'Apatkalin Chubam',
    emergencySub: 'Nini nokhor nangkha hinba kaitorno khamdi.',
    callCaregiver: 'Caregiverno phone khamdi (Anu)',
    callAmbulance: 'Ambulanceno phone khamdi (108)',
    doctorTitle: 'Doctorni kok',
    callDoctor: 'Doctorno phone khamdi',
    medicationTitle: 'Bwswk chubam',
    medicationSub: 'Bwswk kaino chadi khamdi Anu bai kwlaidi nahoile side barni chadi.',
    viewMeds: 'Bwswk chadi',
    dialing: 'Dialing khamdi...',
    cancelCall: 'Cancel khamdi'
  }
};

export const Help: React.FC = () => {
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const [activeCall, setActiveCall] = useState<string | null>(null);
  const currentUser = storageService.getCurrentUser();
  const cgName = currentUser?.caregiverName || '';

  const currentDict = localHelpTranslations[language] || localHelpTranslations.English;

  const getCgLabel = (label: string) => {
    if (cgName) {
      return label.replace('Anu', cgName).replace('অনু', cgName).replace('अनु', cgName);
    }
    return label.replace(' (Anu)', '').replace(' (অনু)', '').replace(' (Anu)', '').replace(' (अनु)', '');
  };

  const getMedSubLabel = (label: string) => {
    if (cgName) {
      return label.replace('Anu', cgName).replace('অনু', cgName).replace('अनु', cgName);
    }
    return label.replace('Anu', 'your caregiver').replace('অনু', 'আপনার কেয়ারগিভার').replace('अनु', 'अपने केयरगिवर');
  };

  const triggerMockCall = (contact: string) => {
    setActiveCall(contact);
    setTimeout(() => {
      setActiveCall(null);
      alert(`Call completed to: ${contact}`);
    }, 3000);
  };

  return (
    <div className="max-w-3xl mx-auto pb-12 space-y-8">
      {/* Header */}
      <div className="flex items-center gap-2 border-b border-brand-purpleLight pb-4">
        <button onClick={() => navigate(-1)} className="p-2 rounded-xl hover:bg-white text-brand-purple transition-all">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div>
          <h1 className="text-3xl font-extrabold text-brand-navy flex items-center gap-2">
            {t('nav.help')} <LifeBuoy className="w-8 h-8 text-brand-purple" />
          </h1>
          <p className="text-brand-grayText font-medium mt-1">{currentDict.subtitle}</p>
        </div>
      </div>

      {/* Emergency Red Card */}
      <div className="bg-brand-redBg border border-brand-red rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
        <div className="flex items-center gap-4 text-brand-red">
          <ShieldAlert className="w-12 h-12 stroke-[2.5] animate-pulse" />
          <div>
            <h2 className="text-2xl font-extrabold">{currentDict.emergencyTitle}</h2>
            <p className="font-semibold text-brand-grayText mt-1">{currentDict.emergencySub}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button
            onClick={() => triggerMockCall(cgName || 'Caregiver')}
            className="flex items-center justify-center gap-3 bg-brand-red text-white py-5 px-6 rounded-2xl font-black text-xl hover:bg-opacity-90 active:scale-95 transition-all shadow-md"
          >
            <Phone className="w-6 h-6 stroke-[3]" />
            <span>{getCgLabel(currentDict.callCaregiver)}</span>
          </button>
          
          <button
            onClick={() => triggerMockCall('Emergency Services (108)')}
            className="flex items-center justify-center gap-3 bg-brand-navy text-white py-5 px-6 rounded-2xl font-black text-xl hover:bg-opacity-95 active:scale-95 transition-all shadow-md"
          >
            <AlertTriangle className="w-6 h-6 stroke-[3]" />
            <span>{currentDict.callAmbulance}</span>
          </button>
        </div>
      </div>

      {/* Help Topics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        
        {/* Card 1: Doctor Information */}
        <div className="bg-white p-6 rounded-2xl border border-brand-purpleLight shadow-sm space-y-4">
          <h3 className="font-extrabold text-xl text-brand-navy flex items-center gap-2">
            <Activity className="w-6 h-6 text-brand-blue" />
            <span>{currentDict.doctorTitle}</span>
          </h3>
          <div className="text-base text-brand-navy font-semibold space-y-1">
            <p>Dr. Barua (Neurologist)</p>
            <p className="text-brand-grayText">Guwahati Neurological Institute</p>
            <p className="text-brand-purple font-bold text-sm">+91 94350 11223</p>
          </div>
          <button 
            onClick={() => triggerMockCall('Dr. Barua')}
            className="w-full bg-brand-purpleLight text-brand-purple py-3 rounded-xl font-bold hover:bg-brand-purple hover:text-white transition-all"
          >
            {currentDict.callDoctor}
          </button>
        </div>

        {/* Card 2: Medication Help */}
        <div className="bg-white p-6 rounded-2xl border border-brand-purpleLight shadow-sm space-y-4">
          <h3 className="font-extrabold text-xl text-brand-navy flex items-center gap-2">
            <Heart className="w-6 h-6 text-brand-green" />
            <span>{currentDict.medicationTitle}</span>
          </h3>
          <p className="text-brand-grayText text-base">
            {getMedSubLabel(currentDict.medicationSub)}
          </p>
          <button 
            onClick={() => navigate('/reminders')}
            className="w-full bg-brand-purpleLight text-brand-purple py-3 rounded-xl font-bold hover:bg-brand-purple hover:text-white transition-all"
          >
            {currentDict.viewMeds}
          </button>
        </div>

      </div>

      {/* Mock Call Panel Overlay */}
      {activeCall && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-navy bg-opacity-65">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-xl border border-brand-purpleLight space-y-6">
            <h3 className="text-2xl font-bold text-brand-navy animate-pulse">{currentDict.dialing}</h3>
            <div className="w-20 h-20 rounded-full bg-brand-red bg-opacity-20 text-brand-red flex items-center justify-center mx-auto">
              <Phone className="w-10 h-10 animate-bounce" />
            </div>
            <p className="font-extrabold text-xl text-brand-navy">{activeCall}</p>
            <button
              onClick={() => setActiveCall(null)}
              className="w-full bg-brand-navy text-white py-3.5 rounded-xl font-bold hover:bg-opacity-95"
            >
              {currentDict.cancelCall}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
