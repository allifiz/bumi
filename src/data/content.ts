/* ============================================================
   MATERI PEMBELAJARAN — dipisahkan dari logika simulasi.
   Angka dibulatkan agar ramah pembaca; sumber di bagian akhir.
   ============================================================ */

export interface HotspotFact {
  id: "atmosfer" | "daratan" | "samudra";
  label: string;
  warna: string;
  teksWarna: string;
  pos: { left: string; top: string };
  judul: string;
  fakta: string;
  detail: string;
}

export const HOTSPOTS: HotspotFact[] = [
  {
    id: "atmosfer",
    label: "atmosfer",
    warna: "#cfe4ff",
    teksWarna: "#183630",
    pos: { left: "73%", top: "12%" },
    judul: "Atmosfer — selimut gas",
    fakta: "Lapisan gas yang menyelimuti Bumi, dari permukaan sampai ±100 km ke atas.",
    detail:
      "Hampir seluruh massa udara berada di 30 km terbawah. Atmosfer menahan panas, membelokkan radiasi berbahaya, dan menjadi panggung cuaca.",
  },
  {
    id: "daratan",
    label: "daratan",
    warna: "#57b876",
    teksWarna: "#183630",
    pos: { left: "26%", top: "44%" },
    judul: "Daratan — kulit yang aktif",
    fakta: "Hanya ±29% permukaan Bumi berupa daratan — dan terus berubah.",
    detail:
      "Lempeng tektonik menggeser benua beberapa sentimeter per tahun: gunung terangkat, palung menukik, dan pulau baru lahir dari gunung api.",
  },
  {
    id: "samudra",
    label: "samudra",
    warna: "#176bdb",
    teksWarna: "#fff8e8",
    pos: { left: "63%", top: "64%" },
    judul: "Samudra — penyimpan panas",
    fakta: "±71% permukaan Bumi tertutup air, dengan kedalaman rata-rata ±3,7 km.",
    detail:
      "Laut menyerap sebagian besar kelebihan panas planet ini dan menggerakkan iklim lewat arus raksasa yang mengalir ribuan kilometer.",
  },
];

export interface LapisanBumi {
  id: "kerak" | "mantel" | "inti-luar" | "inti-dalam";
  nama: string;
  rentang: string;
  suhu: string;
  material: string;
  fakta: string;
  warna: string;
}

export const LAPISAN: LapisanBumi[] = [
  {
    id: "kerak",
    nama: "Kerak",
    rentang: "0 – 70 km",
    suhu: "hingga ±400 °C",
    material:
      "Batuan padat yang rapuh: granit di benua, basalt di dasar samudra. Inilah tanah tempat kita berdiri.",
    fakta:
      "Dibanding keseluruhan Bumi, kerak lebih tipis daripada kulit apel — bagian tertebalnya pun cuma 70 km.",
    warna: "#57b876",
  },
  {
    id: "mantel",
    nama: "Mantel",
    rentang: "70 – 2.900 km",
    suhu: "±500 – 3.700 °C",
    material:
      "Terutama batuan PADAT — bukan lautan cairan. Karena panas dan tekanan, batuan ini dapat mengalir sangat lambat (beberapa sentimeter per tahun) dan menggerakkan lempeng di atasnya.",
    fakta:
      "Arus aliran lambat di mantel adalah mesin di balik gempa, gunung api, dan hanyutnya benua.",
    warna: "#f4795b",
  },
  {
    id: "inti-luar",
    nama: "Inti luar",
    rentang: "2.900 – 5.150 km",
    suhu: "±4.000 – 5.000 °C",
    material:
      "Besi dan nikel CAIR yang terus bergerak. Aliran logam cair ini bekerja seperti dinamo raksasa.",
    fakta:
      "Dinamo inti luar melahirkan medan magnet Bumi — perisai yang membelokkan partikel berbahaya dari Matahari.",
    warna: "#ffb020",
  },
  {
    id: "inti-dalam",
    nama: "Inti dalam",
    rentang: "5.150 – 6.371 km",
    suhu: "±5.400 °C (seperti permukaan Matahari!)",
    material:
      "Bola besi-nikel PADAT meski sangat panas — tekanannya begitu besar hingga atom-atomnya tak bisa meleleh.",
    fakta:
      "Radiusnya ±1.220 km dan masih tumbuh sangat pelan: besi cair di perbatasannya membeku sedikit demi sedikit.",
    warna: "#ffe58a",
  },
];

export interface TahapAir {
  id: number;
  nama: string;
  caption: string;
  pos: { left: string; top: string; align: "left" | "right" };
}

export const TAHAP_AIR: TahapAir[] = [
  {
    id: 1,
    nama: "Penguapan",
    caption:
      "Energi Matahari menghangatkan air laut hingga sebagian molekulnya lolos menjadi uap air dan naik ke udara.",
    pos: { left: "18%", top: "46%", align: "left" },
  },
  {
    id: 2,
    nama: "Kondensasi",
    caption:
      "Di ketinggian yang dingin, uap air mengembun menjadi tetes-tetes mungil yang berkumpul membentuk awan.",
    pos: { left: "52%", top: "4%", align: "left" },
  },
  {
    id: 3,
    nama: "Presipitasi",
    caption:
      "Saat tetes di awan cukup berat, gravitasi menariknya jatuh sebagai hujan — sebagian turun di pegunungan dan daratan.",
    pos: { left: "66%", top: "26%", align: "right" },
  },
  {
    id: 4,
    nama: "Aliran & infiltrasi",
    caption:
      "Sebagian air mengalir di permukaan menuju sungai dan kembali ke laut; sebagian lagi meresap ke tanah menjadi air tanah.",
    pos: { left: "30%", top: "66%", align: "left" },
  },
];

export interface SoalKuis {
  pertanyaan: string;
  opsi: string[];
  benar: number;
  penjelasan: string;
}

export const KUIS: SoalKuis[] = [
  {
    pertanyaan: "Kenapa ada siang dan malam?",
    opsi: [
      "Matahari mengelilingi Bumi setiap 24 jam",
      "Bumi berotasi, sehingga sisi yang menghadap Matahari bergantian",
      "Bumi menjauh dan mendekat ke Matahari setiap hari",
    ],
    benar: 1,
    penjelasan:
      "Bumi berputar pada porosnya (rotasi) kira-kira 24 jam per putaran. Sisi yang sedang menghadap Matahari mengalami siang; sisi sebaliknya malam.",
  },
  {
    pertanyaan: "Bagaimana keadaan mantel Bumi?",
    opsi: [
      "Lautan cairan panas seperti lahar",
      "Rongga berisi gas bertekanan tinggi",
      "Terutama batuan padat yang dapat mengalir sangat lambat",
    ],
    benar: 2,
    penjelasan:
      "Mantel sebagian besar berupa batuan padat. Karena panas dan tekanan, batuan ini bisa mengalir amat lambat — beberapa sentimeter per tahun — dan menggerakkan lempeng.",
  },
  {
    pertanyaan: "Apa yang dihasilkan daun saat fotosintesis?",
    opsi: [
      "Gula (makanan tumbuhan) dan oksigen",
      "Karbon dioksida dan air",
      "Hanya oksigen, tanpa zat lain",
    ],
    benar: 0,
    penjelasan:
      "Dengan energi cahaya, daun mengubah karbon dioksida dan air menjadi gula — sumber energi tumbuhan — dan melepaskan oksigen sebagai hasil samping.",
  },
];

export interface SimpulJaringan {
  id: string;
  label: string;
  warna: string;
  pos: { left: string; top: string };
  keterangan: string;
}

export const SIMPUL: SimpulJaringan[] = [
  {
    id: "matahari",
    label: "Matahari",
    warna: "#ffd447",
    pos: { left: "12%", top: "10%" },
    keterangan:
      "Sumber energi utama: menguapkan air laut, menggerakkan cuaca, dan menyalakan fotosintesis di setiap daun.",
  },
  {
    id: "udara",
    label: "Udara",
    warna: "#cfe4ff",
    pos: { left: "48%", top: "2%" },
    keterangan:
      "Atmosfer menampung uap air dan gas penting: CO₂ untuk tumbuhan, oksigen untuk hewan — terus bertukar lewat kehidupan.",
  },
  {
    id: "air",
    label: "Air",
    warna: "#176bdb",
    pos: { left: "84%", top: "12%" },
    keterangan:
      "Bersirkulasi tanpa henti: laut → awan → hujan → sungai → laut. Air juga melarutkan mineral tanah untuk tumbuhan.",
  },
  {
    id: "tumbuhan",
    label: "Tumbuhan",
    warna: "#57b876",
    pos: { left: "22%", top: "58%" },
    keterangan:
      "Jembatan energi: menangkap cahaya Matahari, menyerap air dan mineral, lalu membagikan makanan dan oksigen ke seluruh jaring kehidupan.",
  },
  {
    id: "tanah",
    label: "Batuan & tanah",
    warna: "#c98d5f",
    pos: { left: "54%", top: "70%" },
    keterangan:
      "Batuan yang lapuk menjadi tanah: menyimpan air tanah, menyuplai mineral, dan menjadi rumah bagi akar serta miliaran organisme.",
  },
  {
    id: "hewan",
    label: "Hewan & manusia",
    warna: "#f4795b",
    pos: { left: "84%", top: "56%" },
    keterangan:
      "Menghirup oksigen dan memakan tumbuhan (atau pemakan tumbuhan) — lalu mengembalikan CO₂ dan hara ke lingkungan.",
  },
];

export interface SisiJaringan {
  a: string;
  b: string;
  label: string;
}

export const SISI: SisiJaringan[] = [
  { a: "matahari", b: "air", label: "menguapkan air" },
  { a: "matahari", b: "tumbuhan", label: "energi fotosintesis" },
  { a: "air", b: "udara", label: "uap & hujan" },
  { a: "air", b: "tumbuhan", label: "diserap akar" },
  { a: "udara", b: "tumbuhan", label: "CO₂ ↔ O₂" },
  { a: "tumbuhan", b: "tanah", label: "akar & seresah" },
  { a: "tanah", b: "air", label: "menyimpan air tanah" },
  { a: "tumbuhan", b: "hewan", label: "makanan & O₂" },
  { a: "hewan", b: "udara", label: "napas: O₂ → CO₂" },
  { a: "tanah", b: "tumbuhan", label: "mineral" },
];

export interface Sumber {
  label: string;
  url: string;
  ket: string;
}

export const SUMBER: Sumber[] = [
  {
    label: "NASA Earth",
    url: "https://earth.nasa.gov/",
    ket: "Data & visualisasi sistem Bumi",
  },
  {
    label: "NASA Climate Kids",
    url: "https://climatekids.nasa.gov/",
    ket: "Penjelasan iklim untuk pelajar",
  },
  {
    label: "USGS Water Science School",
    url: "https://www.usgs.gov/special-topics/water-science-school",
    ket: "Siklus air & ilmu air",
  },
  {
    label: "NOAA Education",
    url: "https://www.noaa.gov/education",
    ket: "Samudra & atmosfer",
  },
  {
    label: "BMKG",
    url: "https://www.bmkg.go.id/",
    ket: "Cuaca, iklim & geofisika Indonesia",
  },
];

export const NAV_ITEMS = [
  { id: "sampul", huruf: "A", label: "Sampul" },
  { id: "belah", huruf: "B", label: "Belah Bumi" },
  { id: "rotasi", huruf: "C", label: "Siang–Malam" },
  { id: "air", huruf: "D", label: "Siklus Air" },
  { id: "daun", huruf: "E", label: "Fotosintesis" },
  { id: "jaringan", huruf: "F", label: "Jaringan" },
];
