export interface CognitiveItem {
  id: string;
  name: string;
  category: 'landmark' | 'food' | 'animal' | 'clothing' | 'instrument' | 'flora' | 'culture' | 'object' | 'person' | 'town';
  emoji: string;
  stateOrRegion: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

export const northeastCognitiveDataset: CognitiveItem[] = [
  { id: 'kaziranga', name: 'Kaziranga National Park', category: 'landmark', emoji: '🦏', stateOrRegion: 'Assam', difficulty: 'Easy' },
  { id: 'loktak', name: 'Loktak Lake', category: 'landmark', emoji: '🏞️', stateOrRegion: 'Manipur', difficulty: 'Easy' },
  { id: 'tawang', name: 'Tawang Monastery', category: 'landmark', emoji: '🛕', stateOrRegion: 'Arunachal Pradesh', difficulty: 'Medium' },
  { id: 'umiam', name: 'Umiam Lake', category: 'landmark', emoji: '💧', stateOrRegion: 'Meghalaya', difficulty: 'Medium' },
  { id: 'majuli', name: 'Majuli Island', category: 'landmark', emoji: '🏝️', stateOrRegion: 'Assam', difficulty: 'Easy' },
  { id: 'kamakhya', name: 'Kamakhya Temple', category: 'landmark', emoji: '🕌', stateOrRegion: 'Assam', difficulty: 'Easy' },
  { id: 'dzukou', name: 'Dzukou Valley', category: 'landmark', emoji: '⛰️', stateOrRegion: 'Nagaland', difficulty: 'Medium' },
  { id: 'cherrapunji', name: 'Cherrapunji Sohra', category: 'landmark', emoji: '🌧️', stateOrRegion: 'Meghalaya', difficulty: 'Easy' },
  { id: 'guwahati', name: 'Guwahati City', category: 'town', emoji: '🏙️', stateOrRegion: 'Assam', difficulty: 'Easy' },
  { id: 'shillong', name: 'Shillong Hill Station', category: 'town', emoji: '⛰️', stateOrRegion: 'Meghalaya', difficulty: 'Easy' },
  { id: 'imphal', name: 'Imphal City', category: 'town', emoji: '🏘️', stateOrRegion: 'Manipur', difficulty: 'Medium' },
  { id: 'aizawl', name: 'Aizawl City', category: 'town', emoji: '🏘️', stateOrRegion: 'Mizoram', difficulty: 'Medium' },
  { id: 'kohima', name: 'Kohima City', category: 'town', emoji: '🏘️', stateOrRegion: 'Nagaland', difficulty: 'Medium' },
  { id: 'agartala', name: 'Agartala City', category: 'town', emoji: '🏘️', stateOrRegion: 'Tripura', difficulty: 'Medium' },
  { id: 'gangtok', name: 'Gangtok City', category: 'town', emoji: '🏘️', stateOrRegion: 'Sikkim', difficulty: 'Medium' },
  { id: 'itanagar', name: 'Itanagar City', category: 'town', emoji: '🏘️', stateOrRegion: 'Arunachal Pradesh', difficulty: 'Hard' },
  { id: 'dimapur', name: 'Dimapur Town', category: 'town', emoji: '🏣', stateOrRegion: 'Nagaland', difficulty: 'Medium' },
  { id: 'silchar', name: 'Silchar Town', category: 'town', emoji: '🏣', stateOrRegion: 'Assam', difficulty: 'Medium' },
  { id: 'haflong', name: 'Haflong Hill Station', category: 'town', emoji: '⛰️', stateOrRegion: 'Assam', difficulty: 'Hard' },
  { id: 'sivasagar', name: 'Sivasagar Rang Ghar', category: 'landmark', emoji: '🏛️', stateOrRegion: 'Assam', difficulty: 'Hard' },
  { id: 'rhino', name: 'One-horned Rhinoceros', category: 'animal', emoji: '🦏', stateOrRegion: 'Assam', difficulty: 'Easy' },
  { id: 'mithun', name: 'Mithun Gayal', category: 'animal', emoji: '🐃', stateOrRegion: 'Nagaland/Arunachal', difficulty: 'Medium' },
  { id: 'leopard', name: 'Clouded Leopard', category: 'animal', emoji: '🐆', stateOrRegion: 'Meghalaya', difficulty: 'Medium' },
  { id: 'gibbon', name: 'Hoolock Gibbon', category: 'animal', emoji: '🐒', stateOrRegion: 'Assam', difficulty: 'Hard' },
  { id: 'langur', name: 'Golden Langur', category: 'animal', emoji: '🐒', stateOrRegion: 'Assam/Bhutan', difficulty: 'Hard' },
  { id: 'hornbill', name: 'Great Indian Hornbill', category: 'animal', emoji: '🐦', stateOrRegion: 'Nagaland', difficulty: 'Easy' },
  { id: 'sangai', name: 'Sangai Brow-antlered Deer', category: 'animal', emoji: '🦌', stateOrRegion: 'Manipur', difficulty: 'Hard' },
  { id: 'redpanda', name: 'Red Panda', category: 'animal', emoji: '🐼', stateOrRegion: 'Sikkim', difficulty: 'Easy' },
  { id: 'kingfisher', name: 'Kingfisher Bird', category: 'animal', emoji: '🐦', stateOrRegion: 'NER', difficulty: 'Easy' },
  { id: 'bamboo', name: 'Bamboo Shoots', category: 'flora', emoji: '🎋', stateOrRegion: 'NER', difficulty: 'Easy' },
  { id: 'orchid', name: 'Foxtail Orchid', category: 'flora', emoji: '🌸', stateOrRegion: 'Assam', difficulty: 'Easy' },
  { id: 'tea_plant', name: 'Assam Tea Plant', category: 'flora', emoji: '🌿', stateOrRegion: 'Assam', difficulty: 'Easy' },
  { id: 'bhot_jolokia', name: 'King Chilli Bhut Jolokia', category: 'flora', emoji: '🌶️', stateOrRegion: 'Assam/Nagaland', difficulty: 'Medium' },
  { id: 'jackfruit', name: 'Jackfruit Wood Tree', category: 'flora', emoji: '🍈', stateOrRegion: 'NER', difficulty: 'Easy' },
  { id: 'litchi', name: 'Tezpur Litchi Fruit', category: 'flora', emoji: '🍒', stateOrRegion: 'Assam', difficulty: 'Easy' },
  { id: 'starfruit', name: 'Carambola Starfruit', category: 'flora', emoji: '⭐', stateOrRegion: 'NER', difficulty: 'Medium' },
  { id: 'elephant_apple', name: 'Elephant Apple Ou Tenga', category: 'flora', emoji: '🍏', stateOrRegion: 'Assam', difficulty: 'Hard' },
  { id: 'assam_lemon', name: 'Kaji Nemu Lemon', category: 'flora', emoji: '🍋', stateOrRegion: 'Assam', difficulty: 'Easy' },
  { id: 'betel_nut', name: 'Betel Nut Areca', category: 'flora', emoji: '🌰', stateOrRegion: 'NER', difficulty: 'Easy' },
  { id: 'peacock', name: 'Peacock Pheasant', category: 'animal', emoji: '🦚', stateOrRegion: 'NER', difficulty: 'Medium' },
  { id: 'pitha', name: 'Til Pitha Rice Roll', category: 'food', emoji: '🥞', stateOrRegion: 'Assam', difficulty: 'Easy' },
  { id: 'momo', name: 'Steamed Momo dumpling', category: 'food', emoji: '🥟', stateOrRegion: 'Sikkim/Arunachal', difficulty: 'Easy' },
  { id: 'thukpa', name: 'Thukpa Noodle Soup', category: 'food', emoji: '🍜', stateOrRegion: 'Sikkim/Arunachal', difficulty: 'Easy' },
  { id: 'khar', name: 'Assamese Khar Appetizer', category: 'food', emoji: '🥣', stateOrRegion: 'Assam', difficulty: 'Medium' },
  { id: 'masor_tenga', name: 'Sour Fish Curry Masor Tenga', category: 'food', emoji: '🐟', stateOrRegion: 'Assam', difficulty: 'Easy' },
  { id: 'bamboo_shoot_pork', name: 'Pork with Bamboo Shoot', category: 'food', emoji: '🍲', stateOrRegion: 'Nagaland', difficulty: 'Medium' },
  { id: 'black_rice_kheer', name: 'Chak-Hao Black Rice Kheer', category: 'food', emoji: '🍚', stateOrRegion: 'Manipur', difficulty: 'Medium' },
  { id: 'churpi', name: 'Yak Cheese Churpi', category: 'food', emoji: '🧀', stateOrRegion: 'Sikkim/Arunachal', difficulty: 'Hard' },
  { id: 'axone', name: 'Fermented Soybean Axone', category: 'food', emoji: '🍲', stateOrRegion: 'Nagaland', difficulty: 'Hard' },
  { id: 'apong', name: 'Apong Rice Beer Ferment', category: 'food', emoji: '🍺', stateOrRegion: 'Assam/Arunachal', difficulty: 'Hard' },
  { id: 'johachau', name: 'Aromatic Joha Rice', category: 'food', emoji: '🌾', stateOrRegion: 'Assam', difficulty: 'Medium' },
  { id: 'doi_chira', name: 'Doi Chira Gur breakfast', category: 'food', emoji: '🥣', stateOrRegion: 'Assam', difficulty: 'Easy' },
  { id: 'sunga_saul', name: 'Bamboo Sticky Rice Sunga', category: 'food', emoji: '🎋', stateOrRegion: 'Assam', difficulty: 'Medium' },
  { id: 'eromba', name: 'Eromba Chutney Paste', category: 'food', emoji: '🥣', stateOrRegion: 'Manipur', difficulty: 'Hard' },
  { id: 'singju', name: 'Singju Manipuri Salad', category: 'food', emoji: '🥗', stateOrRegion: 'Manipur', difficulty: 'Medium' },
  { id: 'smilax_tea', name: 'Local Herbal Green Tea', category: 'food', emoji: '🍵', stateOrRegion: 'NER', difficulty: 'Easy' },
  { id: 'dried_fish', name: 'Sukuti Dried Smoked Meat', category: 'food', emoji: '🍖', stateOrRegion: 'Sikkim', difficulty: 'Hard' },
  { id: 'bora_saul', name: 'Sticky Bora Rice cake', category: 'food', emoji: '🍚', stateOrRegion: 'Assam', difficulty: 'Medium' },
  { id: 'pork_stew', name: 'Traditional Pork Broth', category: 'food', emoji: '🍲', stateOrRegion: 'NER', difficulty: 'Easy' },
  { id: 'khorika', name: 'Khorika Meat Skewers', category: 'food', emoji: '🍢', stateOrRegion: 'Assam', difficulty: 'Medium' },
  { id: 'gamosa', name: 'Assamese Gamusa Shawl', category: 'clothing', emoji: '🧣', stateOrRegion: 'Assam', difficulty: 'Easy' },
  { id: 'mekhela', name: 'Mekhela Chador Dress', category: 'clothing', emoji: '👗', stateOrRegion: 'Assam', difficulty: 'Easy' },
  { id: 'muga_silk', name: 'Golden Muga Silk Garment', category: 'clothing', emoji: '👘', stateOrRegion: 'Assam', difficulty: 'Medium' },
  { id: 'eri_silk', name: 'Ahimsa Eri Silk Stole', category: 'clothing', emoji: '🧣', stateOrRegion: 'Assam', difficulty: 'Medium' },
  { id: 'naga_shawl', name: 'Traditional Naga Shawl pattern', category: 'clothing', emoji: '🧣', stateOrRegion: 'Nagaland', difficulty: 'Easy' },
  { id: 'phanek', name: 'Manipuri Phanek Skirt', category: 'clothing', emoji: '👗', stateOrRegion: 'Manipur', difficulty: 'Medium' },
  { id: 'inaphi', name: 'Inaphi Handloom Wrap', category: 'clothing', emoji: '👘', stateOrRegion: 'Manipur', difficulty: 'Hard' },
  { id: 'khasi_shawl', name: 'Khasi Tapmohkhlieh Shawl', category: 'clothing', emoji: '🧣', stateOrRegion: 'Meghalaya', difficulty: 'Medium' },
  { id: 'dakmanda', name: 'Garo Dakmanda Skirt Dress', category: 'clothing', emoji: '👗', stateOrRegion: 'Meghalaya', difficulty: 'Hard' },
  { id: 'puan', name: 'Mizo Puan Shawl Loom', category: 'clothing', emoji: '🧣', stateOrRegion: 'Mizoram', difficulty: 'Hard' },
  { id: 'japi', name: 'Assamese Japi Bamboo Hat', category: 'clothing', emoji: '👒', stateOrRegion: 'Assam', difficulty: 'Easy' },
  { id: 'cane_basket', name: 'Cane Bamboo Hand Basket', category: 'object', emoji: '🧺', stateOrRegion: 'NER', difficulty: 'Easy' },
  { id: 'handloom_shuttle', name: 'Wooden Handloom Tat Shuttle', category: 'object', emoji: '🪵', stateOrRegion: 'NER', difficulty: 'Medium' },
  { id: 'bamboo_fan', name: 'Bamboo Hand Fan cooler', category: 'object', emoji: '🪭', stateOrRegion: 'NER', difficulty: 'Easy' },
  { id: 'dao_knife', name: 'Traditional Dao Iron Knife', category: 'object', emoji: '🔪', stateOrRegion: 'NER', difficulty: 'Medium' },
  { id: 'brass_plate', name: 'Ban Bahi Brass Plate', category: 'object', emoji: '🍽️', stateOrRegion: 'Assam', difficulty: 'Easy' },
  { id: 'bamboo_cup', name: 'Bamboo Tea Mug Cup', category: 'object', emoji: '☕', stateOrRegion: 'NER', difficulty: 'Easy' },
  { id: 'clay_pot', name: 'Handmade Pot Clay Pot', category: 'object', emoji: '🏺', stateOrRegion: 'Tripura', difficulty: 'Easy' },
  { id: 'mizo_hat', name: 'Mizo Khumbeu Straw Hat', category: 'clothing', emoji: '👒', stateOrRegion: 'Mizoram', difficulty: 'Hard' },
  { id: 'miri_shawl', name: 'Mising Galuk Coat Jacket', category: 'clothing', emoji: '🧥', stateOrRegion: 'Assam', difficulty: 'Hard' },
  { id: 'bihu_dhol', name: 'Bihu Dhol Wood Drum', category: 'instrument', emoji: '🥁', stateOrRegion: 'Assam', difficulty: 'Easy' },
  { id: 'pepa', name: 'Buffalo Horn Pepa Flute', category: 'instrument', emoji: '🎺', stateOrRegion: 'Assam', difficulty: 'Medium' },
  { id: 'gogona', name: 'Bamboo Jaw Gogona Instrument', category: 'instrument', emoji: '🎼', stateOrRegion: 'Assam', difficulty: 'Hard' },
  { id: 'pena', name: 'Monostring Pena Fiddle bow', category: 'instrument', emoji: '🎻', stateOrRegion: 'Manipur', difficulty: 'Hard' },
  { id: 'khol', name: 'Clay Drum Khol Percussion', category: 'instrument', emoji: '🥁', stateOrRegion: 'Assam', difficulty: 'Medium' },
  { id: 'bamboo_flute', name: 'Traditional Bamboo Flute', category: 'instrument', emoji: '🪈', stateOrRegion: 'NER', difficulty: 'Easy' },
  { id: 'hornbill_fest', name: 'Hornbill Cultural Festival', category: 'culture', emoji: '🎉', stateOrRegion: 'Nagaland', difficulty: 'Easy' },
  { id: 'bihu_dance', name: 'Bihu Dance Folk Festival', category: 'culture', emoji: '💃', stateOrRegion: 'Assam', difficulty: 'Easy' },
  { id: 'wangala', name: 'Wangala Hundred Drums Dance', category: 'culture', emoji: '🥁', stateOrRegion: 'Meghalaya', difficulty: 'Medium' },
  { id: 'sangai_fest', name: 'Sangai Tourism Festival', category: 'culture', emoji: '🎭', stateOrRegion: 'Manipur', difficulty: 'Medium' },
  { id: 'chapchar_kut', name: 'Chapchar Kut Bamboo Dance', category: 'culture', emoji: '🎋', stateOrRegion: 'Mizoram', difficulty: 'Medium' },
  { id: 'losar', name: 'Monpa Losar New Year', category: 'culture', emoji: '🏮', stateOrRegion: 'Arunachal Pradesh', difficulty: 'Hard' },
  { id: 'ningol', name: 'Ningol Chakouba Feast day', category: 'culture', emoji: '🍽️', stateOrRegion: 'Manipur', difficulty: 'Hard' },
  { id: 'tea_picking', name: 'Tea Garden Leaf Picking', category: 'culture', emoji: '🧺', stateOrRegion: 'Assam', difficulty: 'Easy' },
  { id: 'pottery', name: 'Asharikandi Hand Terracotta Craft', category: 'culture', emoji: '🏺', stateOrRegion: 'Assam', difficulty: 'Hard' },
  { id: 'fishing_jhapi', name: 'Jakoi Bamboo Fishing Basket', category: 'object', emoji: '🕸️', stateOrRegion: 'Assam', difficulty: 'Hard' },
  { id: 'river_boat', name: 'Lakhimi Brahmaputra Wood Boat', category: 'object', emoji: '🛶', stateOrRegion: 'Assam', difficulty: 'Easy' },
  { id: 'bamboo_house', name: 'Traditional Chang Bamboo House', category: 'landmark', emoji: '🛖', stateOrRegion: 'NER', difficulty: 'Easy' },
  { id: 'naga_spear', name: 'Ornamental Naga Spear staff', category: 'object', emoji: '🔱', stateOrRegion: 'Nagaland', difficulty: 'Hard' },
  { id: 'lebi_flute', name: 'Kurku Lebi reed instrument', category: 'instrument', emoji: '🎷', stateOrRegion: 'Tripura', difficulty: 'Hard' },
  { id: 'ravi', name: 'Uncle Ravi Kaka', category: 'person', emoji: '👨', stateOrRegion: 'Assam', difficulty: 'Easy' },
  { id: 'meena', name: 'Aunt Meena Khura', category: 'person', emoji: '👩', stateOrRegion: 'Assam', difficulty: 'Easy' },
  { id: 'anu', name: 'Daughter Anu Aideo', category: 'person', emoji: '👧', stateOrRegion: 'Assam', difficulty: 'Easy' },
  { id: 'dr_barua', name: 'Dr. Barua Family Physician', category: 'person', emoji: '👨‍⚕️', stateOrRegion: 'Assam', difficulty: 'Easy' },
  { id: 'ramesh', name: 'Grandson Ramesh Bapu', category: 'person', emoji: '👦', stateOrRegion: 'Assam', difficulty: 'Easy' },
  { id: 'lakhimi', name: 'Lakhimi weaver helper', category: 'person', emoji: '👩', stateOrRegion: 'Assam', difficulty: 'Medium' },
  { id: 'bubu', name: 'Bubu village postman', category: 'person', emoji: '👨', stateOrRegion: 'Assam', difficulty: 'Medium' },
  { id: 'umbrella', name: 'Big Black Monsoon Umbrella', category: 'object', emoji: '☂️', stateOrRegion: 'NER', difficulty: 'Easy' },
  { id: 'torch', name: 'Handheld Battery Torchlight', category: 'object', emoji: '🔦', stateOrRegion: 'NER', difficulty: 'Easy' },
  { id: 'radio', name: 'All India Radio Receiver', category: 'object', emoji: '📻', stateOrRegion: 'NER', difficulty: 'Easy' },
  { id: 'clock', name: 'Mechanical Pendulum Wall Clock', category: 'object', emoji: '⏰', stateOrRegion: 'NER', difficulty: 'Easy' },
  { id: 'school_bag', name: 'School Canvas Backpack bag', category: 'object', emoji: '🎒', stateOrRegion: 'NER', difficulty: 'Easy' },
  { id: 'water_bottle', name: 'Refillable Metal Water Bottle', category: 'object', emoji: '🍼', stateOrRegion: 'NER', difficulty: 'Easy' },
  { id: 'chair', name: 'Woven Wicker Rattan Chair', category: 'object', emoji: '🪑', stateOrRegion: 'NER', difficulty: 'Easy' },
  { id: 'table', name: 'Sturdy Teak Wood Dining Table', category: 'object', emoji: '🪵', stateOrRegion: 'NER', difficulty: 'Easy' },
  { id: 'spectacles', name: 'Reading Spectacles Eye Glasses', category: 'object', emoji: '👓', stateOrRegion: 'NER', difficulty: 'Easy' },
  { id: 'keys', name: 'Brass Cabinet Cupboard Keys', category: 'object', emoji: '🔑', stateOrRegion: 'NER', difficulty: 'Easy' },
  { id: 'comb', name: 'Carved Wooden Hair Comb brush', category: 'object', emoji: '🪮', stateOrRegion: 'NER', difficulty: 'Easy' },
  { id: 'pill_box', name: 'Weekly Medicine Pill Box tray', category: 'object', emoji: '💊', stateOrRegion: 'NER', difficulty: 'Easy' },
  { id: 'diary', name: 'Memoirs Journal Leather Diary', category: 'object', emoji: '📓', stateOrRegion: 'NER', difficulty: 'Easy' }
];

export function getDailyCognitiveSelection(seedOffset: number, count: number, difficultyFilter?: 'Easy' | 'Medium' | 'Hard'): CognitiveItem[] {
  const today = new Date();
  const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate() + seedOffset;
  let pool = [...northeastCognitiveDataset];
  if (difficultyFilter) {
    pool = pool.filter(item => item.difficulty === difficultyFilter);
  }
  const result: CognitiveItem[] = [];
  let currentSeed = seed;
  const tempPool = [...pool];
  while (result.length < count && tempPool.length > 0) {
    currentSeed = (currentSeed * 9301 + 49297) % 233280;
    const index = Math.floor((currentSeed / 233280) * tempPool.length);
    result.push(tempPool.splice(index, 1)[0]);
  }
  return result;
}