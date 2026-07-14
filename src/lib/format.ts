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

/** Format nomor WhatsApp jadi tampilan lokal, mis. "6281234567890" → "0812-3456-7890" */
export function formatWa(wa: string): string {
  let n = (wa || '').replace(/\D/g, '');
  if (n.startsWith('62')) n = '0' + n.slice(2);
  // Kelompokkan: 4-4-sisa (mis. 0812-3456-7890)
  const m = n.match(/^(\d{4})(\d{4})(\d+)$/);
  return m ? `${m[1]}-${m[2]}-${m[3]}` : n;
}

/** Link Google Maps untuk pencarian alamat/lokasi */
export function mapsSearchLink(query: string): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

/** Bagian tanggal terpisah untuk komponen "kalender" agenda */
export function dateParts(date: Date) {
  return {
    day: date.getDate(),
    month: BULAN[date.getMonth()].slice(0, 3),
    year: date.getFullYear(),
  };
}
