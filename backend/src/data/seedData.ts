import { Reminder, Activity, Memory, Contact, GameScore, CaregiverAlert } from '../models/types';

export const patientProfile = {
  id: 'patient-ravi',
  name: 'Ravi',
  role: 'patient',
  status: 'active',
  age: 78,
  region: 'Guwahati, Assam'
};

export const caregiverProfile = {
  name: 'Anu',
  relationship: 'Daughter'
};

export const initialReminders: Reminder[] = [
  {
    id: 'rem-1',
    patientId: 'patient-ravi',
    category: 'medicine',
    title: 'Medicine',
    description: 'Take your hypertension medicine',
    time: '14:00',
    date: '2026-08-28',
    status: 'Upcoming',
    repeat: 'Daily',
    enabled: true
  },
  {
    id: 'rem-2',
    patientId: 'patient-ravi',
    category: 'family',
    title: 'Call Anu',
    description: 'Talk to your daughter',
    time: '17:00',
    date: '2026-08-28',
    status: 'Scheduled',
    repeat: 'Daily',
    enabled: true
  },
  {
    id: 'rem-3',
    patientId: 'patient-ravi',
    category: 'exercise',
    title: 'Evening Walk',
    description: 'Time for a little walk in the garden',
    time: '18:00',
    date: '2026-08-28',
    status: 'Scheduled',
    repeat: 'Daily',
    enabled: true
  }
];

export const initialSchedule: Activity[] = [
  { id: 'sch-1', time: '08:00 AM', title: 'Breakfast', completed: true },
  { id: 'sch-2', time: '09:00 AM', title: 'Brain Game', completed: true },
  { id: 'sch-3', time: '01:00 PM', title: 'Lunch', completed: true },
  { id: 'sch-4', time: '02:00 PM', title: 'Medicine', completed: false, isCurrent: true },
  { id: 'sch-5', time: '04:00 PM', title: 'Rest Time', completed: false },
  { id: 'sch-6', time: '05:00 PM', title: 'Call Anu', completed: false },
  { id: 'sch-7', time: '06:00 PM', title: 'Evening Walk', completed: false },
  { id: 'sch-8', time: '08:00 PM', title: 'Dinner', completed: false }
];

export const initialMemories: Memory[] = [
  {
    id: 'mem-1',
    patientId: 'patient-ravi',
    title: 'Family Picnic in Shillong',
    date: '2025-05-15',
    people: 'Anu, Ramesh, Grandchildren',
    description: 'A beautiful sunny day at Elephant Falls, Shillong. We had delicious home-cooked food.',
    category: 'events',
    image: 'picnic'
  },
  {
    id: 'mem-2',
    patientId: 'patient-ravi',
    title: 'Old House in Tezpur',
    date: '1988-10-10',
    people: 'Meena, Self',
    description: 'Our first home with the beautiful garden of orchids. Anu took her first steps here.',
    category: 'places',
    image: 'old_house'
  },
  {
    id: 'mem-3',
    patientId: 'patient-ravi',
    title: 'Bihu Festival Celebration',
    date: '2026-04-14',
    people: 'Family and Friends',
    description: 'Celebrating Rongali Bihu. Playing the dhol and eating pitha. Happy moments.',
    category: 'events',
    image: 'festival'
  }
];

export const initialContacts: Contact[] = [
  { id: 'con-1', name: 'Anu', relationship: 'Daughter', phone: '+91 98765 43210', avatarSeed: 'anu' },
  { id: 'con-2', name: 'Ramesh', relationship: 'Son', phone: '+91 98765 01234', avatarSeed: 'ramesh' },
  { id: 'con-3', name: 'Meena', relationship: 'Wife', phone: '+91 98765 56789', avatarSeed: 'meena' },
  { id: 'con-4', name: 'Dr. Barua', relationship: 'Caregiver / Doctor', phone: '+91 94350 11223', avatarSeed: 'doctor' }
];

export const initialGames: GameScore[] = [
  { gameId: 'game-1', gameName: 'Memory Match', difficulty: 'Easy', progress: 100, bestScore: 92, completedToday: true },
  { gameId: 'game-2', gameName: 'Sequence & Order', difficulty: 'Easy', progress: 80, bestScore: 85, completedToday: true },
  { gameId: 'game-3', gameName: 'Attention Focus', difficulty: 'Easy', progress: 100, bestScore: 90, completedToday: true },
  { gameId: 'game-4', gameName: 'Object Recognition', difficulty: 'Medium', progress: 50, bestScore: 78, completedToday: false },
  { gameId: 'game-5', gameName: 'Daily Routine Recall', difficulty: 'Easy', progress: 100, bestScore: 95, completedToday: true },
  { gameId: 'game-6', gameName: 'Language & Word Memory', difficulty: 'Medium', progress: 0, bestScore: 0, completedToday: false }
];

export const initialAlerts: CaregiverAlert[] = [
  { id: 'al-1', type: 'warning', title: 'Medicine reminder missed', createdAt: 'Today, 2:15 PM' },
  { id: 'al-2', type: 'success', title: 'Brain game completed', createdAt: 'Today, 9:20 AM' },
  { id: 'al-3', type: 'success', title: 'Walk completed', createdAt: 'Yesterday, 6:05 PM' }
];
