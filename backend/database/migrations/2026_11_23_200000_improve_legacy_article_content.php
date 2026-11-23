<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    private const ARTICLES = [
        'pergantian-oli' => [
            'title' => 'Panduan Pergantian Oli Forklift yang Tepat',
            'summary' => 'Pahami cara menentukan interval penggantian oli forklift berdasarkan panduan pabrikan, jam operasi, dan kondisi kerja unit.',
            'body' => "## Ikuti interval servis unit\n\nInterval penggantian oli tidak selalu sama untuk setiap forklift. Gunakan buku manual dan jadwal servis dari pabrikan sebagai acuan utama, lalu pertimbangkan jam operasi, beban kerja, debu, suhu, serta kondisi lingkungan. Catat jam meter dan tanggal servis agar jadwal berikutnya dapat direncanakan dengan tepat.\n\n## Pastikan jenis oli sesuai\n\nForklift dapat menggunakan jenis oli berbeda untuk mesin, sistem hidrolik, transmisi, dan komponen lain. Jangan menyamakan spesifikasi atau mencampur oli tanpa memastikan rekomendasi pabrikan. Jika label, manual, atau riwayat servis tidak tersedia, minta teknisi memeriksa spesifikasi unit sebelum penggantian.\n\n## Lakukan penggantian dengan aman\n\nParkirkan unit di permukaan rata, turunkan garpu, matikan mesin, aktifkan prosedur pengamanan unit, dan tunggu komponen panas cukup dingin. Penggantian oli sebaiknya dilakukan oleh personel yang memahami titik pengurasan, filter, kapasitas, serta prosedur pengisian dan pemeriksaan level. Hindari bekerja di bawah komponen yang tidak ditopang dengan aman.\n\n## Periksa kondisi dan catat hasilnya\n\nPerubahan warna, bau, adanya partikel, kebocoran, atau level oli yang berulang kali turun perlu dicatat dan diperiksa lebih lanjut; tanda tersebut tidak cukup untuk memastikan penyebab kerusakan. Setelah servis, periksa kebocoran sesuai prosedur, catat jenis oli dan filter yang digunakan, serta kelola oli bekas melalui jalur pembuangan yang sesuai.\n\nJika unit menunjukkan tekanan oli rendah, suhu tidak normal, gerakan hidrolik berubah, atau kebocoran, hentikan penggunaan sesuai prosedur keselamatan dan konsultasikan pemeriksaan kepada teknisi kompeten.",
            'seo_title' => 'Panduan Pergantian Oli Forklift yang Tepat',
            'meta_description' => 'Pelajari interval dan jenis oli forklift, prosedur penggantian yang aman, serta hal yang perlu dicatat berdasarkan panduan pabrikan.',
        ],
        'penanganan-kebocoran-pada-foklift' => [
            'title' => 'Cara Menangani Kebocoran Oli pada Forklift',
            'summary' => 'Kenali langkah aman saat menemukan kebocoran forklift, informasi yang perlu dilaporkan, dan kapan unit harus diperiksa teknisi.',
            'body' => "## Amankan area dan unit\n\nJika terlihat cairan menetes atau genangan di sekitar forklift, hentikan pekerjaan di area tersebut dan beri tahu penanggung jawab. Bila aman dilakukan, parkirkan unit di tempat yang tidak mengganggu jalur kerja, turunkan garpu, matikan mesin, dan ikuti prosedur pengamanan serta pelaporan di tempat kerja.\n\n## Jangan menyentuh kebocoran bertekanan\n\nKebocoran dapat berasal dari oli mesin, hidrolik, transmisi, atau cairan lain. Jangan mencari kebocoran hidrolik dengan tangan: cairan bertekanan tinggi dapat menembus kulit dan menyebabkan cedera serius. Jangan mengencangkan sambungan, melepas selang, atau mengoperasikan sistem untuk menguji kebocoran jika Anda tidak berwenang dan terlatih.\n\n## Catat gejala untuk teknisi\n\nSampaikan lokasi kebocoran, kapan pertama kali terlihat, warna atau jumlah cairan secara umum, indikator yang menyala, suara atau perubahan gerakan unit, serta kondisi kerja saat gejala muncul. Foto dari jarak aman dapat membantu dokumentasi. Jangan menyimpulkan jenis cairan hanya berdasarkan warna dan jangan menambahkan fluida sebelum spesifikasinya dipastikan.\n\n## Minta pemeriksaan sebelum digunakan kembali\n\nTeknisi kompeten dapat memeriksa selang, sambungan, seal, silinder, pompa, dan komponen terkait untuk menentukan penyebab serta tindakan perbaikan. Forklift sebaiknya tidak dioperasikan kembali sampai dinyatakan aman sesuai prosedur perusahaan. Cairan tumpah perlu ditangani dengan perlengkapan dan prosedur lingkungan kerja yang berlaku.\n\nPemeriksaan dan perbaikan yang tepat membantu mencegah kerusakan lanjutan serta mengurangi risiko bagi operator dan orang di sekitar unit.",
            'seo_title' => 'Cara Aman Menangani Kebocoran Oli Forklift',
            'meta_description' => 'Ketahui cara mengamankan forklift yang bocor, bahaya kebocoran hidrolik, dan informasi yang perlu disampaikan kepada teknisi.',
        ],
    ];

    private const PREVIOUS_ARTICLES = [
        'pergantian-oli' => [
            'title' => 'Pergantian oli',
            'summary' => 'Pergantian oli di lakukan sebulan sekali',
            'body' => 'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Consectetur mollitia quidem, dolorum sed itaque aut reprehenderit porro voluptas excepturi aliquam, voluptatum, optio voluptatem autem iusto quis nisi corporis quam facilis.',
            'seo_title' => 'Pergantian oli',
            'meta_description' => 'Service forklift, maintennace foklift',
        ],
        'penanganan-kebocoran-pada-foklift' => [
            'title' => 'Penanganan kebocoran pada foklift',
            'summary' => 'penganan pada forklift kali ini memuat cara untuk pencegahan kedepan nya',
            'body' => 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Modi laborum voluptates, ipsa accusamus aliquam, quidem provident eligendi alias nihil illo, exercitationem perspiciatis quaerat! Facere omnis voluptas deserunt excepturi quam voluptate!',
            'seo_title' => 'Penanganan kebocoran pada foklift',
            'meta_description' => 'Penanganan kebocoran pada foklift, service forklift',
        ],
    ];

    public function up(): void
    {
        foreach (self::ARTICLES as $slug => $content) {
            DB::table('articles')->where('slug', $slug)->update([
                ...$content,
                'updated_at' => now(),
            ]);
        }
    }

    public function down(): void
    {
        foreach (self::PREVIOUS_ARTICLES as $slug => $content) {
            DB::table('articles')->where('slug', $slug)->update([
                ...$content,
                'updated_at' => now(),
            ]);
        }
    }
};
