const BULAN = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
];

const HARI = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

/** Format tanggal Indonesia, mis. "1 Juli 2026" */
export function formatDate(date: Date): string {
  return `${date.getDate()} ${BULAN[date.getMonth()]} ${date.getFullYear()}`;
}

/** Format tanggal lengkap dengan hari, mis. "Senin, 1 Juli 2026" */
export function formatDateFull(date: Date): string {
  return `${HARI[date.getDay()]}, ${formatDate(date)}`;
}

/** Bagian tanggal terpisah untuk komponen "kalender" agenda */
export function dateParts(date: Date) {
  return {
    day: date.getDate(),
    month: BULAN[date.getMonth()].slice(0, 3),
    year: date.getFullYear(),
  };
}
