export interface ProvinceData {
  id: string;
  nameTh: string;
  nameEn: string;
  region: 'ภาคเหนือ' | 'ภาคกลาง' | 'ภาคตะวันออกเฉียงเหนือ' | 'ภาคตะวันออก' | 'ภาคตะวันตก' | 'ภาคใต้';
  x: number; // SVG coordinate (0 - 680)
  y: number; // SVG coordinate (0 - 1050)
  code: string;
}

export type ThailandRegion = 'ภาคเหนือ' | 'ภาคกลาง' | 'ภาคตะวันออกเฉียงเหนือ' | 'ภาคตะวันออก' | 'ภาคตะวันตก' | 'ภาคใต้';

export const THAILAND_REGIONS: {
  id: ThailandRegion;
  label: string;
  shortLabel: string;
  color: string;
  bgColor: string;
  borderColor: string;
  accentColor: string;
}[] = [
  {
    id: 'ภาคเหนือ',
    label: 'ภาคเหนือ (Northern)',
    shortLabel: 'ภาคเหนือ',
    color: 'text-emerald-700',
    bgColor: 'bg-emerald-50',
    borderColor: 'border-emerald-200',
    accentColor: '#059669'
  },
  {
    id: 'ภาคกลาง',
    label: 'ภาคกลาง (Central)',
    shortLabel: 'ภาคกลาง',
    color: 'text-sky-700',
    bgColor: 'bg-sky-50',
    borderColor: 'border-sky-200',
    accentColor: '#0284c7'
  },
  {
    id: 'ภาคตะวันออกเฉียงเหนือ',
    label: 'ภาคตะวันออกเฉียงเหนือ (Isan)',
    shortLabel: 'ภาคอีสาน',
    color: 'text-amber-700',
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-200',
    accentColor: '#d97706'
  },
  {
    id: 'ภาคตะวันออก',
    label: 'ภาคตะวันออก (Eastern)',
    shortLabel: 'ภาคตะวันออก',
    color: 'text-indigo-700',
    bgColor: 'bg-indigo-50',
    borderColor: 'border-indigo-200',
    accentColor: '#4f46e5'
  },
  {
    id: 'ภาคตะวันตก',
    label: 'ภาคตะวันตก (Western)',
    shortLabel: 'ภาคตะวันตก',
    color: 'text-teal-700',
    bgColor: 'bg-teal-50',
    borderColor: 'border-teal-200',
    accentColor: '#0d9488'
  },
  {
    id: 'ภาคใต้',
    label: 'ภาคใต้ (Southern)',
    shortLabel: 'ภาคใต้',
    color: 'text-cyan-700',
    bgColor: 'bg-cyan-50',
    borderColor: 'border-cyan-200',
    accentColor: '#0891b2'
  }
];

export const THAILAND_PROVINCES: ProvinceData[] = [
  // === ภาคเหนือ (9 จังหวัด) ===
  { id: 'chiang_rai', nameTh: 'เชียงราย', nameEn: 'Chiang Rai', region: 'ภาคเหนือ', x: 224, y: 66, code: 'CR' },
  { id: 'chiang_mai', nameTh: 'เชียงใหม่', nameEn: 'Chiang Mai', region: 'ภาคเหนือ', x: 159, y: 145, code: 'CM' },
  { id: 'mae_hong_son', nameTh: 'แม่ฮ่องสอน', nameEn: 'Mae Hong Son', region: 'ภาคเหนือ', x: 83, y: 109, code: 'MS' },
  { id: 'phayao', nameTh: 'พะเยา', nameEn: 'Phayao', region: 'ภาคเหนือ', x: 229, y: 118, code: 'PY' },
  { id: 'nan', nameTh: 'น่าน', nameEn: 'Nan', region: 'ภาคเหนือ', x: 295, y: 145, code: 'NN' },
  { id: 'lampang', nameTh: 'ลำปาง', nameEn: 'Lampang', region: 'ภาคเหนือ', x: 198, y: 180, code: 'LP' },
  { id: 'lamphun', nameTh: 'ลำพูน', nameEn: 'Lamphun', region: 'ภาคเหนือ', x: 161, y: 160, code: 'LN' },
  { id: 'phrae', nameTh: 'แพร่', nameEn: 'Phrae', region: 'ภาคเหนือ', x: 247, y: 190, code: 'PR' },
  { id: 'uttaradit', nameTh: 'อุตรดิตถ์', nameEn: 'Uttaradit', region: 'ภาคเหนือ', x: 244, y: 227, code: 'UT' },

  // === ภาคกลาง (22 จังหวัด) ===
  { id: 'bangkok', nameTh: 'กรุงเทพมหานคร', nameEn: 'Bangkok', region: 'ภาคกลาง', x: 274, y: 498, code: 'BKK' },
  { id: 'nonthaburi', nameTh: 'นนทบุรี', nameEn: 'Nonthaburi', region: 'ภาคกลาง', x: 275, y: 490, code: 'NB' },
  { id: 'pathum_thani', nameTh: 'ปทุมธานี', nameEn: 'Pathum Thani', region: 'ภาคกลาง', x: 276, y: 479, code: 'PT' },
  { id: 'samut_prakan', nameTh: 'สมุทรปราการ', nameEn: 'Samut Prakan', region: 'ภาคกลาง', x: 282, y: 508, code: 'SP' },
  { id: 'samut_sakhon', nameTh: 'สมุทรสาคร', nameEn: 'Samut Sakhon', region: 'ภาคกลาง', x: 257, y: 512, code: 'SK' },
  { id: 'samut_songkhram', nameTh: 'สมุทรสงคราม', nameEn: 'Samut Songkhram', region: 'ภาคกลาง', x: 236, y: 522, code: 'SS' },
  { id: 'nakhon_pathom', nameTh: 'นครปฐม', nameEn: 'Nakhon Pathom', region: 'ภาคกลาง', x: 239, y: 493, code: 'NP' },
  { id: 'ayutthaya', nameTh: 'พระนครศรีอยุธยา', nameEn: 'Phra Nakhon Si Ayutthaya', region: 'ภาคกลาง', x: 280, y: 456, code: 'AY' },
  { id: 'ang_thong', nameTh: 'อ่างทอง', nameEn: 'Ang Thong', region: 'ภาคกลาง', x: 270, y: 439, code: 'AT' },
  { id: 'sing_buri', nameTh: 'สิงห์บุรี', nameEn: 'Sing Buri', region: 'ภาคกลาง', x: 267, y: 418, code: 'SB' },
  { id: 'chai_nat', nameTh: 'ชัยนาท', nameEn: 'Chai Nat', region: 'ภาคกลาง', x: 246, y: 398, code: 'CN' },
  { id: 'lopburi', nameTh: 'ลพบุรี', nameEn: 'Lopburi', region: 'ภาคกลาง', x: 285, y: 425, code: 'LB' },
  { id: 'saraburi', nameTh: 'สระบุรี', nameEn: 'Saraburi', region: 'ภาคกลาง', x: 305, y: 443, code: 'SR' },
  { id: 'suphan_buri', nameTh: 'สุพรรณบุรี', nameEn: 'Suphan Buri', region: 'ภาคกลาง', x: 245, y: 448, code: 'SPB' },
  { id: 'nakhon_nayok', nameTh: 'นครนายก', nameEn: 'Nakhon Nayok', region: 'ภาคกลาง', x: 328, y: 466, code: 'NY' },
  { id: 'kamphaeng_phet', nameTh: 'กำแพงเพชร', nameEn: 'Kamphaeng Phet', region: 'ภาคกลาง', x: 200, y: 307, code: 'KP' },
  { id: 'phichit', nameTh: 'พิจิตร', nameEn: 'Phichit', region: 'ภาคกลาง', x: 263, y: 310, code: 'PC' },
  { id: 'phitsanulok', nameTh: 'พิษณุโลก', nameEn: 'Phitsanulok', region: 'ภาคกลาง', x: 257, y: 283, code: 'PL' },
  { id: 'sukhothai', nameTh: 'สุโขทัย', nameEn: 'Sukhothai', region: 'ภาคกลาง', x: 223, y: 270, code: 'ST' },
  { id: 'phetchabun', nameTh: 'เพชรบูรณ์', nameEn: 'Phetchabun', region: 'ภาคกลาง', x: 324, y: 311, code: 'PB' },
  { id: 'nakhon_sawan', nameTh: 'นครสวรรค์', nameEn: 'Nakhon Sawan', region: 'ภาคกลาง', x: 247, y: 362, code: 'NS' },
  { id: 'uthai_thani', nameTh: 'อุทัยธานี', nameEn: 'Uthai Thani', region: 'ภาคกลาง', x: 238, y: 384, code: 'UTI' },

  // === ภาคตะวันออกเฉียงเหนือ (20 จังหวัด) ===
  { id: 'nakhon_ratchasima', nameTh: 'นครราชสีมา', nameEn: 'Nakhon Ratchasima', region: 'ภาคตะวันออกเฉียงเหนือ', x: 395, y: 412, code: 'NM' },
  { id: 'buriram', nameTh: 'บุรีรัมย์', nameEn: 'Buriram', region: 'ภาคตะวันออกเฉียงเหนือ', x: 472, y: 411, code: 'BR' },
  { id: 'surin', nameTh: 'สุรินทร์', nameEn: 'Surin', region: 'ภาคตะวันออกเฉียงเหนือ', x: 501, y: 419, code: 'SRN' },
  { id: 'si_sa_ket', nameTh: 'ศรีสะเกษ', nameEn: 'Si Sa Ket', region: 'ภาคตะวันออกเฉียงเหนือ', x: 564, y: 402, code: 'SSK' },
  { id: 'ubon_ratchathani', nameTh: 'อุบลราชธานี', nameEn: 'Ubon Ratchathani', region: 'ภาคตะวันออกเฉียงเหนือ', x: 604, y: 395, code: 'UB' },
  { id: 'yasothon', nameTh: 'ยโสธร', nameEn: 'Yasothon', region: 'ภาคตะวันออกเฉียงเหนือ', x: 550, y: 355, code: 'YS' },
  { id: 'chaiyaphum', nameTh: 'ชัยภูมิ', nameEn: 'Chaiyaphum', region: 'ภาคตะวันออกเฉียงเหนือ', x: 390, y: 354, code: 'CP' },
  { id: 'amnat_charoen', nameTh: 'อำนาจเจริญ', nameEn: 'Amnat Charoen', region: 'ภาคตะวันออกเฉียงเหนือ', x: 588, y: 350, code: 'AC' },
  { id: 'bueng_kan', nameTh: 'บึงกาฬ', nameEn: 'Bueng Kan', region: 'ภาคตะวันออกเฉียงเหนือ', x: 513, y: 175, code: 'BK' },
  { id: 'nong_bua_lamphu', nameTh: 'หนองบัวลำภู', nameEn: 'Nong Bua Lamphu', region: 'ภาคตะวันออกเฉียงเหนือ', x: 421, y: 256, code: 'NBP' },
  { id: 'khon_kaen', nameTh: 'ขอนแก่น', nameEn: 'Khon Kaen', region: 'ภาคตะวันออกเฉียงเหนือ', x: 451, y: 311, code: 'KK' },
  { id: 'udon_thani', nameTh: 'อุดรธานี', nameEn: 'Udon Thani', region: 'ภาคตะวันออกเฉียงเหนือ', x: 447, y: 242, code: 'UD' },
  { id: 'loei', nameTh: 'เลย', nameEn: 'Loei', region: 'ภาคตะวันออกเฉียงเหนือ', x: 366, y: 236, code: 'LE' },
  { id: 'sakon_nakhon', nameTh: 'สกลนคร', nameEn: 'Sakon Nakhon', region: 'ภาคตะวันออกเฉียงเหนือ', x: 551, y: 260, code: 'SN' },
  { id: 'nakhon_phanom', nameTh: 'นครพนม', nameEn: 'Nakhon Phanom', region: 'ภาคตะวันออกเฉียงเหนือ', x: 599, y: 242, code: 'NP' },
  { id: 'mukdahan', nameTh: 'มุกดาหาร', nameEn: 'Mukdahan', region: 'ภาคตะวันออกเฉียงเหนือ', x: 594, y: 303, code: 'MD' },
  { id: 'roi_et', nameTh: 'ร้อยเอ็ด', nameEn: 'Roi Et', region: 'ภาคตะวันออกเฉียงเหนือ', x: 513, y: 337, code: 'RE' },
  { id: 'kalasin', nameTh: 'กาฬสินธุ์', nameEn: 'Kalasin', region: 'ภาคตะวันออกเฉียงเหนือ', x: 503, y: 311, code: 'KS' },
  { id: 'maha_sarakham', nameTh: 'มหาสารคาม', nameEn: 'Maha Sarakham', region: 'ภาคตะวันออกเฉียงเหนือ', x: 487, y: 328, code: 'MK' },
  { id: 'nong_khai', nameTh: 'หนองคาย', nameEn: 'Nong Khai', region: 'ภาคตะวันออกเฉียงเหนือ', x: 444, y: 209, code: 'NK' },

  // === ภาคตะวันออก (7 จังหวัด) ===
  { id: 'sa_kaeo', nameTh: 'สระแก้ว', nameEn: 'Sa Kaeo', region: 'ภาคตะวันออก', x: 392, y: 494, code: 'SKO' },
  { id: 'prachinburi', nameTh: 'ปราจีนบุรี', nameEn: 'Prachinburi', region: 'ภาคตะวันออก', x: 340, y: 477, code: 'PRI' },
  { id: 'chachoengsao', nameTh: 'ฉะเชิงเทรา', nameEn: 'Chachoengsao', region: 'ภาคตะวันออก', x: 317, y: 502, code: 'CCO' },
  { id: 'chonburi', nameTh: 'ชลบุรี', nameEn: 'Chonburi', region: 'ภาคตะวันออก', x: 311, y: 525, code: 'CBI' },
  { id: 'rayong', nameTh: 'ระยอง', nameEn: 'Rayong', region: 'ภาคตะวันออก', x: 333, y: 573, code: 'RYG' },
  { id: 'chanthaburi', nameTh: 'จันทบุรี', nameEn: 'Chanthaburi', region: 'ภาคตะวันออก', x: 395, y: 578, code: 'CTI' },
  { id: 'trat', nameTh: 'ตราด', nameEn: 'Trat', region: 'ภาคตะวันออก', x: 426, y: 604, code: 'TRT' },

  // === ภาคตะวันตก (5 จังหวัด) ===
  { id: 'tak', nameTh: 'ตาก', nameEn: 'Tak', region: 'ภาคตะวันตก', x: 171, y: 279, code: 'TAK' },
  { id: 'kanchanaburi', nameTh: 'กาญจนบุรี', nameEn: 'Kanchanaburi', region: 'ภาคตะวันตก', x: 201, y: 479, code: 'KRI' },
  { id: 'ratchaburi', nameTh: 'ราชบุรี', nameEn: 'Ratchaburi', region: 'ภาคตะวันตก', x: 223, y: 513, code: 'RBR' },
  { id: 'phetchaburi', nameTh: 'เพชรบุรี', nameEn: 'Phetchaburi', region: 'ภาคตะวันตก', x: 232, y: 543, code: 'PBI' },
  { id: 'prachuap_khiri_khan', nameTh: 'ประจวบคีรีขันธ์', nameEn: 'Prachuap Khiri Khan', region: 'ภาคตะวันตก', x: 221, y: 634, code: 'PKN' },

  // === ภาคใต้ (14 จังหวัด) ===
  { id: 'chumphon', nameTh: 'ชุมพร', nameEn: 'Chumphon', region: 'ภาคใต้', x: 175, y: 727, code: 'CPN' },
  { id: 'ranong', nameTh: 'ระนอง', nameEn: 'Ranong', region: 'ภาคใต้', x: 133, y: 763, code: 'RNG' },
  { id: 'surat_thani', nameTh: 'สุราษฎร์ธานี', nameEn: 'Surat Thani', region: 'ภาคใต้', x: 186, y: 821, code: 'SNI' },
  { id: 'phang_nga', nameTh: 'พังงา', nameEn: 'Phang Nga', region: 'ภาคใต้', x: 126, y: 869, code: 'PNA' },
  { id: 'phuket', nameTh: 'ภูเก็ต', nameEn: 'Phuket', region: 'ภาคใต้', x: 116, y: 909, code: 'PKT' },
  { id: 'krabi', nameTh: 'กระบี่', nameEn: 'Krabi', region: 'ภาคใต้', x: 154, y: 896, code: 'KBI' },
  { id: 'nakhon_si_thammarat', nameTh: 'นครศรีธรรมราช', nameEn: 'Nakhon Si Thammarat', region: 'ภาคใต้', x: 234, y: 871, code: 'NSI' },
  { id: 'trang', nameTh: 'ตรัง', nameEn: 'Trang', region: 'ภาคใต้', x: 207, y: 932, code: 'TRG' },
  { id: 'phatthalung', nameTh: 'พัทลุง', nameEn: 'Phatthalung', region: 'ภาคใต้', x: 243, y: 928, code: 'PLG' },
  { id: 'satun', nameTh: 'สตูล', nameEn: 'Satun', region: 'ภาคใต้', x: 242, y: 998, code: 'STN' },
  { id: 'songkhla', nameTh: 'สงขลา', nameEn: 'Songkhla', region: 'ภาคใต้', x: 282, y: 958, code: 'SKA' },
  { id: 'pattani', nameTh: 'ปัตตานี', nameEn: 'Pattani', region: 'ภาคใต้', x: 331, y: 980, code: 'PTN' },
  { id: 'yala', nameTh: 'ยะลา', nameEn: 'Yala', region: 'ภาคใต้', x: 334, y: 1003, code: 'YLA' },
  { id: 'narathiwat', nameTh: 'นราธิวาส', nameEn: 'Narathiwat', region: 'ภาคใต้', x: 374, y: 1011, code: 'NWT' }
];

/**
 * ปรับชื่อจังหวัดให้เป็นมาตรฐานภาษาไทย
 */
export function normalizeProvinceName(raw: string): string {
  if (!raw) return '';
  const trimmed = raw.trim();
  
  if (trimmed === 'กทม.' || trimmed === 'กทม' || trimmed === 'กรุงเทพฯ' || trimmed.toLowerCase() === 'bangkok') {
    return 'กรุงเทพมหานคร';
  }
  if (trimmed === 'ชม.' || trimmed === 'เชียงใหม่' || trimmed.toLowerCase() === 'chiang mai') {
    return 'เชียงใหม่';
  }
  if (trimmed === 'ชร.' || trimmed === 'เชียงราย' || trimmed.toLowerCase() === 'chiang rai') {
    return 'เชียงราย';
  }
  if (trimmed.startsWith('จ.') || trimmed.startsWith('จังหวัด')) {
    return trimmed.replace(/^(จ\.|จังหวัด)\s*/, '');
  }
  
  // Find exact or partial match in 77 provinces
  const matched = THAILAND_PROVINCES.find(
    p => p.nameTh === trimmed || p.nameTh.includes(trimmed) || trimmed.includes(p.nameTh)
  );
  return matched ? matched.nameTh : trimmed;
}

export function getProvinceMeta(provinceName: string): ProvinceData | undefined {
  const norm = normalizeProvinceName(provinceName);
  return THAILAND_PROVINCES.find(p => p.nameTh === norm);
}
