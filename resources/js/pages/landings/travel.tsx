// Landing page JELAJAH NUSA TRAVEL, biro perjalanan wisata domestik.
// Self-contained: tidak memakai AuthenticatedLayout, tidak menerima props.
// Header/nav + footer inline.
import { useMemo, useState, type FormEvent } from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { StickyMobileCta } from '@/components/sticky-mobile-cta';
import { StatCounter } from '@/components/stat-counter';
import {
    Backpack,
    Bus,
    CalendarCheck,
    Camera,
    CheckCircle2,
    Clock,
    Compass,
    Hotel,
    MapPin,
    Menu,
    Mountain,
    Palmtree,
    Phone,
    ShieldCheck,
    Star,
    Sun,
    UtensilsCrossed,
    X,
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Format rupiah gaya Indonesia.
const rupiah = (n: number) => `Rp${n.toLocaleString('id-ID')}`;

interface Paket {
    nama: string;
    durasi: string;
    harga: number;
    art: string;
    icon: typeof Palmtree;
    tagline: string;
    itinerary: { hari: string; kegiatan: string }[];
    termasuk: string[];
    tidakTermasuk: string[];
    unggulan?: boolean;
}

const PAKET: Paket[] = [
    {
        nama: 'Bali 3D2N',
        durasi: '3 hari 2 malam',
        harga: 1850000,
        art: 'from-cyan-500 via-sky-600 to-blue-700',
        icon: Palmtree,
        tagline: 'Pantai, pura, dan sunset terbaik Pulau Dewata.',
        itinerary: [
            { hari: 'Hari 1', kegiatan: 'Tiba di Denpasar, Pantai Pandawa, makan malam seafood Jimbaran.' },
            { hari: 'Hari 2', kegiatan: 'Pura Uluwatu & Tari Kecak, Pantai Nusa Dua, belanja oleh-oleh Krisna.' },
            { hari: 'Hari 3', kegiatan: 'Tanah Lot, transfer bandara, tour selesai.' },
        ],
        termasuk: ['Hotel bintang 3 (2 malam)', 'Transport + driver', 'Tiket wisata sesuai itinerary', 'Makan 5x'],
        tidakTermasuk: ['Tiket pesawat PP', 'Pengeluaran pribadi', 'Asuransi perjalanan'],
    },
    {
        nama: 'Bromo Open Trip',
        durasi: '2 hari 1 malam',
        harga: 350000,
        unggulan: true,
        art: 'from-slate-500 via-stone-600 to-orange-800',
        icon: Mountain,
        tagline: 'Sunrise di Penanjakan, lautan pasir, dan Kawah Bromo.',
        itinerary: [
            { hari: 'Hari 1', kegiatan: 'Meeting point Malang malam hari, briefing & istirahat.' },
            { hari: 'Hari 2', kegiatan: 'Sunrise Penanjakan, Kawah Bromo, Savana & Teletubbies Hill, kembali.' },
        ],
        termasuk: ['Jeep Bromo 4x4', 'Tiket kawasan + retribusi', 'Dokumentasi + sarapan', 'Tour leader'],
        tidakTermasuk: ['Transport ke meeting point', 'Sewa jaket & kuda', 'Pengeluaran pribadi'],
    },
    {
        nama: 'Lombok 4D3N',
        durasi: '4 hari 3 malam',
        harga: 2400000,
        art: 'from-teal-500 via-emerald-600 to-green-700',
        icon: Sun,
        tagline: 'Gili Trawangan, snorkeling, dan Bukit Merese.',
        itinerary: [
            { hari: 'Hari 1', kegiatan: 'Tiba di Lombok, Pantai Senggigi, makan malam.' },
            { hari: 'Hari 2', kegiatan: 'Snorkeling 3 Gili (Trawangan, Meno, Air) seharian.' },
            { hari: 'Hari 3', kegiatan: 'Bukit Merese & Pantai Tanjung Aan, sunset.' },
            { hari: 'Hari 4', kegiatan: 'Desa Sade & belanja mutiara, transfer bandara.' },
        ],
        termasuk: ['Hotel bintang 3 (3 malam)', 'Private boat snorkeling', 'Transport + driver', 'Makan 8x'],
        tidakTermasuk: ['Tiket pesawat PP', 'Sewa alat snorkeling pribadi', 'Pengeluaran pribadi'],
    },
];

const GALERI = [
    { judul: 'Sunrise Penanjakan, Bromo', foto: '/images/landing-travel/galeri-bromo.jpg' },
    { judul: 'Pantai Pandawa, Bali', foto: '/images/landing-travel/galeri-pandawa.jpg' },
    { judul: 'Gili Trawangan, Lombok', foto: '/images/landing-travel/galeri-gili.jpg' },
    { judul: 'Pura Uluwatu saat senja', foto: '/images/landing-travel/galeri-uluwatu.jpg' },
    { judul: 'Savana Bromo', foto: '/images/landing-travel/galeri-savana.jpg' },
];

const KEUNGGULAN = [
    { icon: ShieldCheck, judul: 'Berizin Resmi', deskripsi: 'Terdaftar di Kemenparekraf, armada & akomodasi terverifikasi.' },
    { icon: Camera, judul: 'Dokumentasi Gratis', deskripsi: 'Fotografer trip + semua foto dibagikan via Google Drive.' },
    { icon: Bus, judul: 'Transport Nyaman', deskripsi: 'Bus pariwisata & jeep terawat dengan driver berpengalaman.' },
    { icon: Hotel, judul: 'Hotel Terkurasi', deskripsi: 'Akomodasi bintang 3+ yang kami survei langsung.' },
    { icon: UtensilsCrossed, judul: 'Kuliner Lokal', deskripsi: 'Makan di tempat makan favorit lokal, bukan jebakan turis.' },
    { icon: Clock, judul: 'Jadwal Fleksibel', deskripsi: 'Private trip bisa atur tanggal & itinerary sendiri.' },
];

const FAQ = [
    { q: 'Apakah harga sudah termasuk tiket pesawat?', a: 'Belum. Harga paket mencakup akomodasi, transport lokal, tiket wisata, makan sesuai itinerary, dan tour leader. Tiket pesawat/kereta PP bisa kami bantu carikan dengan harga terbaik.' },
    { q: 'Bagaimana sistem pembayarannya?', a: 'DP 30% untuk mengamankan seat, pelunasan maksimal H-14 sebelum keberangkatan. Bisa transfer bank, QRIS, atau kartu kredit.' },
    { q: 'Apakah ada refund jika batal?', a: 'Pembatalan H-30: refund 100%. H-14: refund 50%. Di bawah H-14: hangus, tapi seat bisa dialihkan ke orang lain tanpa biaya.' },
    { q: 'Apakah cocok untuk pemula / solo traveler?', a: 'Sangat cocok. Open trip kami selalu ada tour leader, dan 40% peserta adalah solo traveler. Grup dibatasi maksimal 20 orang agar tetap akrab.' },
    { q: 'Bagaimana jika cuaca buruk?', a: 'Keselamatan prioritas. Jika destinasi tidak memungkinkan (misal penyeberangan Gili ditutup BMKG), itinerary diganti destinasi setara atau trip dijadwal ulang tanpa biaya.' },
];

const STATS = [
    { label: 'Traveler berangkat', value: 10500, suffix: '+' },
    { label: 'Destinasi aktif', value: 25, suffix: '' },
    { label: 'Tahun beroperasi', value: 9, suffix: '' },
    { label: 'Tingkat kepuasan', value: 98, suffix: '%' },
];

export default function TravelLanding() {
    const [menuBuka, setMenuBuka] = useState(false);
    const [paketTerbuka, setPaketTerbuka] = useState<string | null>('Bali 3D2N');

    // Form booking.
    const [nama, setNama] = useState('');
    const [paket, setPaket] = useState('');
    const [tanggal, setTanggal] = useState('');
    const [jumlahOrang, setJumlahOrang] = useState('2');
    const [bookingOk, setBookingOk] = useState(false);

    const hariIni = useMemo(() => {
        const d = new Date();
        const bln = String(d.getMonth() + 1).padStart(2, '0');
        const tgl = String(d.getDate()).padStart(2, '0');
        return `${d.getFullYear()}-${bln}-${tgl}`;
    }, []);

    const paketDipilih = PAKET.find((p) => p.nama === paket);
    const estimasiTotal = useMemo(() => {
        if (!paketDipilih) return null;
        return parseInt(jumlahOrang, 10) * paketDipilih.harga;
    }, [paketDipilih, jumlahOrang]);

    function kirimBooking(e: FormEvent) {
        e.preventDefault();
        if (!nama.trim() || !paket || !tanggal) return;
        setBookingOk(true);
    }

    const navLinks = [
        { href: '#beranda', label: 'Beranda' },
        { href: '#paket', label: 'Paket Tour' },
        { href: '#galeri', label: 'Galeri' },
        { href: '#faq', label: 'FAQ' },
        { href: '#kontak', label: 'Kontak' },
    ];

    return (
        <div className="min-h-screen bg-sky-50/60 pb-24 text-stone-900 md:pb-0">
            {/* Navbar */}
            <header className="sticky top-0 z-40 border-b border-sky-900/10 bg-white/95 backdrop-blur">
                <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3">
                    <a href="#beranda" className="flex items-center gap-2.5">
                        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-sky-500 to-blue-700">
                            <Compass className="h-5 w-5 text-white" />
                        </span>
                        <span className="text-lg font-extrabold tracking-tight sm:text-xl">
                            JELAJAH <span className="text-sky-700">NUSA</span>
                        </span>
                    </a>
                    <nav className="ml-8 hidden items-center gap-1 lg:flex">
                        {navLinks.map((l) => (
                            <a key={l.href} href={l.href} className="rounded-md px-3 py-2 text-sm font-medium text-stone-600 transition-colors hover:bg-sky-900/5 hover:text-stone-900">
                                {l.label}
                            </a>
                        ))}
                    </nav>
                    <Button className="ml-auto hidden bg-sky-700 hover:bg-sky-800 sm:inline-flex" asChild>
                        <a href="#paket">Pesan Tour</a>
                    </Button>
                    <Button variant="ghost" size="icon" className="ml-auto sm:hidden" onClick={() => setMenuBuka((v) => !v)} aria-label="Menu">
                        {menuBuka ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                    </Button>
                </div>
                {menuBuka && (
                    <nav className="border-t border-sky-900/10 px-4 py-2 lg:hidden">
                        {navLinks.map((l) => (
                            <a key={l.href} href={l.href} onClick={() => setMenuBuka(false)} className="block rounded-md px-3 py-2 text-sm font-medium text-stone-700 hover:bg-sky-900/5">
                                {l.label}
                            </a>
                        ))}
                    </nav>
                )}
            </header>

            {/* Hero */}
            <section id="beranda" className="relative overflow-hidden bg-gradient-to-br from-sky-600 via-blue-700 to-indigo-900 text-white">
                <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 80% 15%, rgba(255,255,255,.12) 0, transparent 40%)' }} aria-hidden />
                <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-4 py-14 sm:py-20 lg:grid-cols-2">
                    <div>
                        <Badge className="mb-4 bg-white/15 text-white hover:bg-white/20">Travel Domestik • Berizin Kemenparekraf</Badge>
                        <h1 className="font-display text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
                            Open Trip Bromo <span className="text-sky-300">Rp350.000.</span>
                        </h1>
                        <p className="mt-4 max-w-md text-sky-100/90">
                            Berangkat tiap Jumat malam, kuota 12 orang, sunrise Penanjakan, Kawah Bromo,
                            dan savana dalam 2 hari 1 malam. Jeep, tiket, dan dokumentasi sudah termasuk.
                        </p>
                        <div className="mt-6 flex flex-wrap items-center gap-4">
                            <Button size="lg" className="bg-white text-sky-800 hover:bg-sky-50" asChild>
                                <a href="#paket">Lihat Paket Tour</a>
                            </Button>
                            <a href="#booking" className="text-sm font-semibold text-sky-100 underline-offset-4 hover:underline">
                                atau langsung booking kursi →
                            </a>
                        </div>
                        <div className="mt-8 flex flex-wrap gap-6 text-sm text-sky-100/90">
                            <span className="flex items-center gap-1.5"><Star className="h-4 w-4 fill-yellow-300 text-yellow-300" /> 4.9 (4.200+ ulasan)</span>
                            <span className="flex items-center gap-1.5"><ShieldCheck className="h-4 w-4" /> Berizin resmi</span>
                            <span className="flex items-center gap-1.5"><Backpack className="h-4 w-4" /> 10.500+ traveler</span>
                        </div>
                    </div>
                    <div className="relative mx-auto hidden w-full max-w-md sm:block" aria-hidden>
                        <img src="/images/landing-travel/hero.jpg" alt="" className="h-72 w-full rounded-3xl object-cover shadow-2xl lg:h-96" />
                        <div className="absolute inset-0 rounded-3xl bg-gradient-to-t from-sky-950/40 to-transparent" />
                        <div className="absolute top-4 right-4 rounded-2xl bg-white px-4 py-2 text-xs font-bold text-sky-800 shadow-lg">Berangkat Tiap Minggu</div>
                        <div className="absolute bottom-4 left-4 rounded-2xl bg-indigo-950 px-4 py-2 text-xs font-semibold text-sky-100 shadow-lg">25 Destinasi</div>
                    </div>
                </div>
            </section>

            {/* Statistik */}
            <section className="mx-auto max-w-6xl px-4 py-12">
                <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                    {STATS.map((s) => (
                        <Card key={s.label} className="text-center">
                            <CardContent className="p-5">
                                <StatCounter value={s.value} suffix={s.suffix} className="text-3xl font-extrabold text-sky-700" />
                                <p className="mt-1 text-sm text-stone-600">{s.label}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </section>

            {/* Paket tour */}
            <section id="paket" className="mx-auto max-w-6xl px-4 py-10">
                <div className="text-center">
                    <Badge variant="outline" className="border-sky-700/30 text-sky-700">Paket Tour</Badge>
                    <h2 className="mt-3 text-3xl font-extrabold tracking-tight">Pilih Petualanganmu</h2>
                    <p className="mx-auto mt-2 max-w-lg text-stone-600">Klik paket untuk melihat itinerary lengkap. Harga per orang.</p>
                </div>
                <div className="mt-8 space-y-4">
                    {PAKET.map((p) => {
                        const terbuka = paketTerbuka === p.nama;
                        return (
                            <Card key={p.nama} className={cn('overflow-hidden', terbuka && 'border-sky-600/40 shadow-md', p.unggulan && !terbuka && 'border-2 border-sky-600')}>
                                <button
                                    type="button"
                                    onClick={() => setPaketTerbuka(terbuka ? null : p.nama)}
                                    className="flex w-full items-center gap-4 p-4 text-left sm:p-5"
                                >
                                    <span className={cn('flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br text-white', p.art)}>
                                        <p.icon className="h-7 w-7" strokeWidth={1.5} />
                                    </span>
                                    <span className="min-w-0 flex-1">
                                        <span className="flex flex-wrap items-center gap-2 font-extrabold">
                                            {p.nama}
                                            {p.unggulan && <Badge className="bg-sky-600 hover:bg-sky-600">Paling laris</Badge>}
                                        </span>
                                        <span className="block truncate text-sm text-stone-600">{p.durasi} • {p.tagline}</span>
                                    </span>
                                    <span className="shrink-0 text-right">
                                        <span className="block text-lg font-extrabold text-sky-700">{rupiah(p.harga)}</span>
                                        <span className="block text-xs text-stone-500">/orang</span>
                                    </span>
                                </button>
                                {terbuka && (
                                    <div className="border-t px-4 py-5 sm:px-5">
                                        <p className="text-sm font-bold">Itinerary singkat</p>
                                        <ol className="mt-2 space-y-2">
                                            {p.itinerary.map((it) => (
                                                <li key={it.hari} className="flex gap-3 text-sm">
                                                    <Badge className="h-fit shrink-0 bg-sky-700 hover:bg-sky-700">{it.hari}</Badge>
                                                    <span className="text-stone-700">{it.kegiatan}</span>
                                                </li>
                                            ))}
                                        </ol>
                                        <div className="mt-4 grid gap-4 sm:grid-cols-2">
                                            <div className="rounded-xl bg-green-50 p-4">
                                                <p className="text-sm font-bold text-green-800">Termasuk</p>
                                                <ul className="mt-2 space-y-1 text-sm text-green-700">
                                                    {p.termasuk.map((t) => (
                                                        <li key={t} className="flex items-start gap-1.5"><CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0" /> {t}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                            <div className="rounded-xl bg-stone-100 p-4">
                                                <p className="text-sm font-bold text-stone-700">Tidak termasuk</p>
                                                <ul className="mt-2 space-y-1 text-sm text-stone-600">
                                                    {p.tidakTermasuk.map((t) => (
                                                        <li key={t}>• {t}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>
                                        <Button className="mt-4 bg-sky-700 hover:bg-sky-800" onClick={() => { setPaket(p.nama); document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' }); }}>
                                            Booking {p.nama}
                                        </Button>
                                    </div>
                                )}
                            </Card>
                        );
                    })}
                </div>
            </section>

            {/* Keunggulan */}
            <section className="bg-white py-14">
                <div className="mx-auto max-w-6xl px-4">
                    <div className="text-center">
                        <Badge variant="outline" className="border-sky-700/30 text-sky-700">Kenapa Kami</Badge>
                        <h2 className="mt-3 text-3xl font-extrabold tracking-tight">Travel yang Bikin Tenang</h2>
                    </div>
                    <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {KEUNGGULAN.map((k) => (
                            <Card key={k.judul}>
                                <CardContent className="flex gap-4 p-5">
                                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-sky-700/10">
                                        <k.icon className="h-5 w-5 text-sky-700" />
                                    </span>
                                    <div>
                                        <p className="font-bold">{k.judul}</p>
                                        <p className="mt-1 text-sm text-stone-600">{k.deskripsi}</p>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Galeri destinasi */}
            <section id="galeri" className="bg-stone-950 py-14 text-white">
                <div className="mx-auto max-w-6xl px-4">
                    <h2 className="text-2xl font-extrabold tracking-tight sm:text-3xl">Galeri Destinasi</h2>
                    <p className="mt-1 text-sm text-stone-400">Foto asli dari trip-trip kami, tanpa filter berlebihan.</p>
                    <div className="mt-6 flex gap-4 overflow-x-auto pb-2">
                        {GALERI.map((g) => (
                            <div key={g.judul} className="w-60 shrink-0 overflow-hidden rounded-xl sm:w-72">
                                <img src={g.foto} alt={g.judul} className="h-40 w-full object-cover sm:h-48" loading="lazy" />
                                <p className="bg-stone-900 px-3 py-2.5 text-sm font-medium text-stone-200">{g.judul}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Form booking */}
            <section id="booking" className="mx-auto max-w-6xl px-4 py-14">
                <div className="grid items-start gap-8 lg:grid-cols-2">
                    <div>
                        <Badge variant="outline" className="border-sky-700/30 text-sky-700">Booking Tour</Badge>
                        <h2 className="mt-3 text-3xl font-extrabold tracking-tight">Amankan Seat-mu</h2>
                        <p className="mt-2 text-stone-600">
                            DP 30% untuk mengamankan seat, pelunasan maksimal H-14. Grup dibatasi 20 orang,
                            yang cepat, yang dapat.
                        </p>
                        <ul className="mt-5 space-y-3 text-sm text-stone-700">
                            {['Refund 100% untuk pembatalan H-30', 'Seat bisa dialihkan ke orang lain', 'Grup WhatsApp peserta dibuat H-7'].map((x) => (
                                <li key={x} className="flex items-start gap-2">
                                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-700" /> {x}
                                </li>
                            ))}
                        </ul>
                        <figure className="mt-6 rounded-2xl border-l-4 border-sky-600 bg-white p-4 shadow-sm">
                            <blockquote className="text-sm italic text-stone-700">
                                “Pertama kali naik gunung, sempat deg-degan. Tour leader-nya sabar banget,
                                sunrise-nya worth it, fotonya bagus semua.”
                            </blockquote>
                            <figcaption className="mt-2 text-xs font-semibold text-stone-500">
                                Sarah Amelia, peserta Bromo Open Trip, 14–15 Nov 2025
                            </figcaption>
                        </figure>
                    </div>
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2"><CalendarCheck className="h-5 w-5 text-sky-700" /> Form Booking</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {bookingOk && paketDipilih ? (
                                <div className="rounded-xl bg-green-50 p-6 text-center">
                                    <CheckCircle2 className="mx-auto h-12 w-12 text-green-600" />
                                    <p className="mt-3 text-lg font-bold text-green-800">Booking diterima!</p>
                                    <p className="mt-1 text-sm text-green-700">
                                        Terima kasih, <span className="font-semibold">{nama}</span>. {paketDipilih.nama} untuk {jumlahOrang} orang
                                        pada {tanggal} sudah kami catat.
                                        {estimasiTotal !== null && <> Estimasi total: <span className="font-bold">{rupiah(estimasiTotal)}</span> (DP 30%: {rupiah(Math.round(estimasiTotal * 0.3))}).</>}
                                        Instruksi pembayaran dikirim via WhatsApp.
                                    </p>
                                    <Button variant="outline" className="mt-4" onClick={() => { setBookingOk(false); setNama(''); setPaket(''); setTanggal(''); setJumlahOrang('2'); }}>
                                        Booking paket lain
                                    </Button>
                                </div>
                            ) : (
                                <form onSubmit={kirimBooking} className="space-y-4">
                                    <div className="space-y-1.5">
                                        <Label htmlFor="bk-nama">Nama</Label>
                                        <Input id="bk-nama" placeholder="cth: Fajar Ramadhan" value={nama} onChange={(e) => setNama(e.target.value)} required />
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label htmlFor="bk-paket">Paket tour</Label>
                                        <Select value={paket} onValueChange={setPaket} required>
                                            <SelectTrigger id="bk-paket"><SelectValue placeholder="Pilih paket tour" /></SelectTrigger>
                                            <SelectContent>
                                                {PAKET.map((p) => (
                                                    <SelectItem key={p.nama} value={p.nama}>{p.nama}, {rupiah(p.harga)}/orang</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1.5">
                                            <Label htmlFor="bk-tanggal">Tanggal berangkat</Label>
                                            <Input id="bk-tanggal" type="date" min={hariIni} value={tanggal} onChange={(e) => setTanggal(e.target.value)} required />
                                        </div>
                                        <div className="space-y-1.5">
                                            <Label htmlFor="bk-orang">Jumlah orang</Label>
                                            <Select value={jumlahOrang} onValueChange={setJumlahOrang}>
                                                <SelectTrigger id="bk-orang"><SelectValue /></SelectTrigger>
                                                <SelectContent>
                                                    {['1', '2', '3', '4', '5', '6+'].map((n) => (
                                                        <SelectItem key={n} value={n}>{n} orang</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                    {estimasiTotal !== null && (
                                        <div className="rounded-xl bg-sky-50 p-4 text-sm">
                                            <div className="flex justify-between"><span className="text-stone-600">{jumlahOrang} orang x {rupiah(paketDipilih?.harga ?? 0)}</span></div>
                                            <div className="mt-1 flex justify-between"><span className="font-semibold">Estimasi total</span><span className="text-lg font-extrabold text-sky-700">{rupiah(estimasiTotal)}</span></div>
                                            <p className="mt-1 text-xs text-stone-500">DP 30%: {rupiah(Math.round(estimasiTotal * 0.3))}</p>
                                        </div>
                                    )}
                                    <Button type="submit" className="w-full bg-sky-700 hover:bg-sky-800">Kirim Booking</Button>
                                </form>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </section>

            {/* FAQ */}
            <section id="faq" className="mx-auto max-w-3xl px-4 pb-14">
                <div className="text-center">
                    <Badge variant="outline" className="border-sky-700/30 text-sky-700">FAQ</Badge>
                    <h2 className="mt-3 text-3xl font-extrabold tracking-tight">Pertanyaan Umum</h2>
                </div>
                <Accordion type="single" collapsible className="mt-8">
                    {FAQ.map((f, i) => (
                        <AccordionItem key={f.q} value={`item-${i}`}>
                            <AccordionTrigger className="text-left font-semibold">{f.q}</AccordionTrigger>
                            <AccordionContent className="text-stone-600">{f.a}</AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </section>

            {/* Kontak */}
            <section id="kontak" className="mx-auto max-w-6xl px-4 pb-16">
                <Card className="overflow-hidden">
                    <div className="grid md:grid-cols-2">
                        <div className="relative min-h-64 bg-gradient-to-br from-sky-100 via-blue-50 to-indigo-100" aria-hidden>
                            <div className="absolute inset-0" style={{ backgroundImage: 'repeating-linear-gradient(0deg, rgba(30,100,180,.08) 0 2px, transparent 2px 40px), repeating-linear-gradient(90deg, rgba(30,100,180,.08) 0 2px, transparent 2px 40px)' }} />
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
                                <span className="relative mx-auto flex h-14 w-14 items-center justify-center">
                                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sky-600 opacity-40" />
                                    <span className="relative flex h-14 w-14 items-center justify-center rounded-full bg-sky-700 shadow-lg">
                                        <MapPin className="h-7 w-7 text-white" />
                                    </span>
                                </span>
                                <p className="mt-2 rounded-full bg-white px-3 py-1 text-xs font-bold shadow">JELAJAH NUSA TRAVEL</p>
                            </div>
                        </div>
                        <CardContent className="p-6 sm:p-8">
                            <h2 className="text-2xl font-extrabold tracking-tight">Kantor & Kontak</h2>
                            <div className="mt-4 space-y-3 text-sm text-stone-700">
                                <p className="flex items-start gap-2"><MapPin className="mt-0.5 h-4 w-4 shrink-0 text-sky-700" /> Jl. Merdeka No. 55, Bandung 40115</p>
                                <p className="flex items-center gap-2"><Phone className="h-4 w-4 shrink-0 text-sky-700" /> (022) 423-8899 • WA: 0812-9900-1122</p>
                                <p className="flex items-center gap-2"><Clock className="h-4 w-4 shrink-0 text-sky-700" /> Senin, Sabtu, 09.00, 18.00</p>
                            </div>
                            <Button size="lg" className="mt-6 w-full bg-green-600 hover:bg-green-700 sm:w-auto" asChild>
                                <a href="https://wa.me/6281299001122?text=Halo%20Jelajah%20Nusa%20Travel!%20Saya%20ingin%20tanya%20paket%20tour." target="_blank" rel="noreferrer">
                                    Chat WhatsApp
                                </a>
                            </Button>
                        </CardContent>
                    </div>
                </Card>
            </section>

            {/* Footer */}
            <footer className="bg-indigo-950 text-indigo-200/80">
                <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:grid-cols-3">
                    <div>
                        <div className="flex items-center gap-2.5">
                            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-sky-500 to-blue-700">
                                <Compass className="h-4 w-4 text-white" />
                            </span>
                            <span className="text-lg font-extrabold text-white">JELAJAH <span className="text-sky-400">NUSA</span></span>
                        </div>
                        <p className="mt-3 text-sm">Biro perjalanan wisata domestik berizin resmi. Menjelajah Indonesia sejak 2017.</p>
                    </div>
                    <div>
                        <p className="font-semibold text-white">Paket Populer</p>
                        <ul className="mt-3 space-y-1.5 text-sm">
                            <li>Bali 3D2N, Rp1,85jt/orang</li>
                            <li>Bromo Open Trip, Rp350rb/orang</li>
                            <li>Lombok 4D3N, Rp2,4jt/orang</li>
                        </ul>
                    </div>
                    <div>
                        <p className="font-semibold text-white">Kontak</p>
                        <ul className="mt-3 space-y-1.5 text-sm">
                            <li>Jl. Merdeka No. 55, Bandung</li>
                            <li>(022) 423-8899</li>
                            <li>WA: 0812-9900-1122</li>
                        </ul>
                    </div>
                </div>
                <div className="border-t border-indigo-900 py-4 text-center text-xs">© 2026 Jelajah Nusa Travel, Bandung. PT Jelajah Nusa Wisata.</div>
            </footer>

            <StickyMobileCta
                variant="whatsapp"
                title="Jelajah Nusa Travel"
                subtitle="Berangkat tiap minggu • DP 30%"
                actionLabel="Tanya Paket"
            />
        </div>
    );
}
