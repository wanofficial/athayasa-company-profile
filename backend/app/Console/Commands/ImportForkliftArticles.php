<?php

namespace App\Console\Commands;

use App\Models\Article;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use RuntimeException;
use Throwable;

class ImportForkliftArticles extends Command
{
    protected $signature = 'website:import-forklift-articles
        {--dry-run : Preview configured articles without downloading images or writing records}
        {--refresh-existing : Update article copy, images, and attribution for configured existing articles}';

    protected $description = 'Add Indonesian forklift maintenance articles with attributed Wikimedia Commons images';

    private const ARTICLES = [
        [
            'title' => 'Mengapa Perawatan Berkala Forklift Menjaga Produktivitas',
            'category' => 'Perawatan',
            'summary' => 'Perawatan terjadwal membantu mendeteksi keausan lebih awal, menjaga kesiapan unit, dan mengurangi risiko gangguan operasional.',
            'body' => "Forklift bekerja mengangkat dan memindahkan beban berulang kali. Seiring pemakaian, oli, filter, ban, rantai, sistem hidrolik, dan komponen keselamatan mengalami keausan. Pemeriksaan berkala membantu menemukan perubahan kondisi sebelum berkembang menjadi kerusakan yang menghambat pekerjaan.\n\nJadwal perawatan sebaiknya mengikuti rekomendasi pabrikan, jam operasi, lingkungan kerja, dan riwayat unit. Catat tanggal servis, temuan teknisi, komponen yang diganti, serta jam meter. Riwayat yang rapi memudahkan tim merencanakan perawatan berikutnya dan mengevaluasi pola kerusakan.\n\nPerawatan bukan hanya soal mesin. Kondisi garpu, sabuk pengaman, klakson, lampu, rem, dan kebocoran juga perlu diperiksa. Jika ditemukan gejala tidak normal, hentikan penggunaan sesuai prosedur keselamatan dan minta teknisi kompeten melakukan pemeriksaan. Langkah terencana membantu unit lebih siap saat dibutuhkan.",
            'image_url' => 'https://thumb.wikimedia.org/wikipedia/commons/thumb/a/a6/US_Navy_061130-N-2636M-004_Aviation_Support_Equipment_Technician_Airman_William_Quinonez_changes_the_oil_in_a_forklift_during_regular_maintenance_planned_maintenance_system_%28PMS%29_on_board_amphibious_assault_ship_USS_Bataan_%28LHD.jpg/960px-thumbnail.jpg',
            'image_credit' => 'U.S. Navy photo by Mass Communication Specialist 3rd Class Kleynia R. McKnight · Public domain',
            'image_source_url' => 'https://commons.wikimedia.org/wiki/File:US_Navy_061130-N-2636M-004_Aviation_Support_Equipment_Technician_Airman_William_Quinonez_changes_the_oil_in_a_forklift_during_regular_maintenance_planned_maintenance_system_(PMS)_on_board_amphibious_assault_ship_USS_Bataan_(LHD.jpg',
            'seo_title' => 'Perawatan Berkala Forklift untuk Menjaga Produktivitas',
            'meta_description' => 'Pelajari manfaat perawatan berkala forklift, komponen yang perlu diperiksa, dan cara merencanakan servis berdasarkan rekomendasi pabrikan.',
        ],
        [
            'title' => 'Checklist Pemeriksaan Harian Sebelum Forklift Beroperasi',
            'category' => 'Keselamatan Kerja',
            'summary' => 'Pemeriksaan sebelum penggunaan membantu operator mengenali kondisi yang perlu ditangani sebelum unit bekerja.',
            'body' => "Pemeriksaan awal sebelum forklift digunakan merupakan bagian penting dari rutinitas kerja yang aman. Operator dapat memulai dengan melihat kondisi umum unit, memastikan tidak ada kebocoran baru, dan memeriksa ban serta garpu dari kerusakan yang tampak.\n\nSebelum bergerak, periksa fungsi rem, kemudi, klakson, lampu, alarm mundur, sabuk pengaman, dan panel indikator sesuai prosedur perusahaan serta panduan unit. Pada forklift elektrik, lihat indikator baterai dan kondisi kabel yang dapat diakses secara aman. Pada unit bermesin, perhatikan level fluida sesuai petunjuk pabrikan.\n\nCatat hasil pemeriksaan pada checklist harian. Jika ada suara, getaran, indikator, atau fungsi yang tidak normal, laporkan kepada penanggung jawab dan jangan mengoperasikan unit sampai dinyatakan aman. Pemeriksaan operator tidak menggantikan inspeksi dan servis oleh teknisi; keduanya saling melengkapi untuk menjaga keselamatan dan kesiapan alat.",
            'image_url' => 'https://thumb.wikimedia.org/wikipedia/commons/thumb/7/7e/161st_Air_Refueling_Wing_Air_Transportation_Specialists_Train_at_Aviano_Air_Base_%289769044%29.jpg/960px-161st_Air_Refueling_Wing_Air_Transportation_Specialists_Train_at_Aviano_Air_Base_%289769044%29.jpg',
            'image_credit' => 'U.S. Air National Guard photo by Airman 1st Class Jacob Hreshchyshyn · Public domain',
            'image_source_url' => 'https://commons.wikimedia.org/wiki/File:161st_Air_Refueling_Wing_Air_Transportation_Specialists_Train_at_Aviano_Air_Base_(9769044).jpg',
            'seo_title' => 'Checklist Pemeriksaan Harian Forklift Sebelum Operasi',
            'meta_description' => 'Gunakan pemeriksaan harian forklift untuk mengenali kebocoran, kerusakan, dan fungsi keselamatan yang perlu ditindaklanjuti.',
        ],
        [
            'title' => 'Kenali Gejala Gangguan pada Sistem Hidrolik Forklift',
            'category' => 'Perbaikan',
            'summary' => 'Gerakan angkat yang lambat, suara tidak biasa, atau kebocoran dapat menjadi tanda sistem hidrolik perlu diperiksa.',
            'body' => "Sistem hidrolik berperan dalam mengangkat dan memiringkan beban. Perubahan seperti garpu bergerak lebih lambat dari biasanya, gerakan tersendat, kemampuan angkat menurun, atau suara pompa yang tidak biasa perlu dicatat dan diperiksa.\n\nPerhatikan pula kemungkinan rembesan pada selang, sambungan, silinder, dan area sekitar mast. Jangan menyentuh kebocoran bertekanan tinggi karena cairan hidrolik dapat menyebabkan cedera serius. Hindari menambah atau mencampur fluida tanpa merujuk spesifikasi yang disyaratkan pabrikan.\n\nJika gejala muncul, tempatkan unit di area aman, turunkan garpu, ikuti prosedur perusahaan, dan hubungi teknisi yang kompeten. Pemeriksaan profesional dapat menilai kondisi fluida, filter, pompa, katup, selang, dan seal. Penanganan yang tepat membantu mencegah kerusakan lanjutan serta mengembalikan performa unit sesuai standar operasinya.",
            'image_url' => 'https://thumb.wikimedia.org/wikipedia/commons/thumb/f/ff/AFCENT_launches_into_Agile_Combat_Employment_exercise_%288860796%29.jpg/960px-AFCENT_launches_into_Agile_Combat_Employment_exercise_%288860796%29.jpg',
            'image_credit' => 'U.S. Air Force photo by Airman 1st Class Robert Nichols · Public domain',
            'image_source_url' => 'https://commons.wikimedia.org/wiki/File:AFCENT_launches_into_Agile_Combat_Employment_exercise_(8860796).jpg',
            'seo_title' => 'Gejala Kerusakan Sistem Hidrolik Forklift',
            'meta_description' => 'Pelajari tanda gangguan hidrolik forklift dan langkah aman yang perlu dilakukan sebelum unit diperiksa teknisi.',
        ],
        [
            'title' => 'Cara Merawat Baterai Forklift Elektrik dengan Benar',
            'category' => 'Perawatan',
            'summary' => 'Kebiasaan pengisian dan pemeriksaan baterai yang sesuai panduan membantu menjaga kesiapan forklift elektrik.',
            'body' => "Baterai adalah komponen utama forklift elektrik dan membutuhkan prosedur pemakaian yang konsisten. Ikuti petunjuk pengisian dari produsen baterai dan unit, gunakan charger yang sesuai, serta pastikan proses dilakukan di area yang memenuhi ketentuan keselamatan dan ventilasi.\n\nPeriksa kabel, konektor, indikator, serta kondisi fisik baterai sebelum penggunaan. Untuk baterai yang membutuhkan penambahan air, gunakan hanya prosedur dan jenis air yang ditentukan pabrikan; jangan membuka atau menangani baterai bila tidak terlatih. Hindari menunggu baterai benar-benar habis jika panduan unit tidak menganjurkannya.\n\nCatat pola pemakaian dan waktu pengisian agar tim dapat merencanakan pergantian unit atau jadwal kerja. Bila baterai cepat kehilangan daya, memanas tidak wajar, atau indikator menunjukkan masalah, hentikan penggunaan sesuai prosedur dan minta pemeriksaan teknisi. Perawatan spesifik dapat berbeda menurut jenis baterai, jadi manual unit tetap menjadi acuan utama.",
            'image_url' => 'https://thumb.wikimedia.org/wikipedia/commons/thumb/9/99/Defense.gov_News_Photo_110723-N-EE987-125_-_Petty_Officer_2nd_Class_Maria_Arreedondo_uses_a_flow_divider_while_fixing_a_forklift_battery_charging_station_in_the_hangar_bay_of_the_aircraft.jpg/960px-thumbnail.jpg',
            'image_credit' => 'U.S. Navy photo by Petty Officer 3rd Class Shawn J. Stewart · Public domain',
            'image_source_url' => 'https://commons.wikimedia.org/wiki/File:Defense.gov_News_Photo_110723-N-EE987-125_-_Petty_Officer_2nd_Class_Maria_Arreedondo_uses_a_flow_divider_while_fixing_a_forklift_battery_charging_station_in_the_hangar_bay_of_the_aircraft.jpg',
            'seo_title' => 'Panduan Perawatan Baterai Forklift Elektrik',
            'meta_description' => 'Kebiasaan aman untuk pengisian, pemeriksaan, dan perawatan baterai forklift elektrik sesuai petunjuk pabrikan.',
        ],
        [
            'title' => 'Kapan Ban Forklift Perlu Diperiksa atau Diganti?',
            'category' => 'Perawatan',
            'summary' => 'Kondisi ban memengaruhi kestabilan dan kendali forklift; kenali keausan atau kerusakan yang perlu ditangani.',
            'body' => "Ban forklift menanggung beban dan tekanan saat unit bermanuver di area kerja. Pemeriksaan rutin dapat menemukan keausan yang tidak merata, retakan, sobekan, benda asing, atau kerusakan lain yang berpotensi memengaruhi kestabilan.\n\nPerhatikan batas keausan dan kriteria penggantian yang ditetapkan produsen ban atau manual forklift. Jenis ban harus sesuai dengan tipe unit, kapasitas, permukaan lantai, lingkungan, dan pola operasi. Ban yang tidak sesuai dapat mengubah karakter kendali dan ketinggian kerja.\n\nJika ditemukan kerusakan, minta teknisi melakukan penilaian dan penggantian sesuai prosedur. Ban forklift dapat memiliki konstruksi dan metode pemasangan berbeda dari ban kendaraan umum; pekerjaan ini sebaiknya ditangani personel terlatih dengan peralatan yang tepat. Setelah pemasangan, lakukan pemeriksaan lanjutan sebelum unit kembali beroperasi.",
            'image_url' => 'https://thumb.wikimedia.org/wikipedia/commons/thumb/0/00/Community_Forklift_03.jpg/960px-Community_Forklift_03.jpg',
            'image_credit' => 'Dclemens1971 · CC BY 4.0',
            'image_source_url' => 'https://commons.wikimedia.org/wiki/File:Community_Forklift_03.jpg',
            'seo_title' => 'Tanda Ban Forklift Perlu Diperiksa atau Diganti',
            'meta_description' => 'Kenali tanda keausan ban forklift dan faktor yang dipertimbangkan saat menentukan ban pengganti.',
        ],
        [
            'title' => 'Menjaga Sistem Rem Forklift Tetap Responsif',
            'category' => 'Keselamatan Kerja',
            'summary' => 'Pemeriksaan rem merupakan bagian penting dari pemeliharaan karena forklift bekerja di area dengan beban dan aktivitas tinggi.',
            'body' => "Sistem rem yang berfungsi baik membantu operator mengendalikan forklift di area kerja. Perubahan rasa pedal, jarak berhenti, bunyi, atau respons pengereman harus segera dilaporkan dan tidak dianggap sebagai kondisi normal.\n\nPemeriksaan perlu mengikuti jadwal dan metode dalam manual pabrikan. Teknisi dapat menilai komponen rem, sambungan, fluida bila digunakan, serta kondisi lain yang berkaitan. Operator sebaiknya tidak mencoba menyetel atau membongkar sistem tanpa kewenangan dan pelatihan yang sesuai.\n\nJika rem terasa tidak normal, amankan unit sesuai prosedur lokasi kerja dan beri tanda agar tidak digunakan sebelum diperiksa. Hindari mengoperasikan forklift dengan dugaan gangguan rem, termasuk hanya untuk memindahkannya ke tempat lain tanpa arahan yang aman. Tindakan cepat membantu mengurangi risiko bagi operator, rekan kerja, dan peralatan.",
            'image_url' => 'https://thumb.wikimedia.org/wikipedia/commons/thumb/a/a4/US_Navy_100823-N-4135M-009_Aviation_Support_Equipment_Technician_2nd_Class_Andrew_Moore_repairs_the_brakes_on_a_6%2C000-pound_forklift_aboard_the_aircraft_USS_Harry_S._Truman_%28CVN_75%29.jpg/960px-thumbnail.jpg',
            'image_credit' => 'U.S. Navy photo by Mass Communication Specialist 3rd Class Zachary D. Montgomery · Public domain',
            'image_source_url' => 'https://commons.wikimedia.org/wiki/File:US_Navy_100823-N-4135M-009_Aviation_Support_Equipment_Technician_2nd_Class_Andrew_Moore_repairs_the_brakes_on_a_6,000-pound_forklift_aboard_the_aircraft_USS_Harry_S._Truman_(CVN_75).jpg',
            'seo_title' => 'Pemeriksaan Sistem Rem Forklift untuk Operasi Aman',
            'meta_description' => 'Pentingnya mengenali perubahan respons rem forklift dan menindaklanjutinya melalui pemeriksaan teknisi.',
        ],
        [
            'title' => 'Memilih Kapasitas Rental Forklift Sesuai Kebutuhan',
            'category' => 'Rental Forklift',
            'summary' => 'Pemilihan unit sewa perlu mempertimbangkan berat beban, tinggi angkat, kondisi lokasi, dan durasi pekerjaan.',
            'body' => "Kapasitas yang tercantum pada forklift tidak selalu sama dengan kapasitas angkat pada semua kondisi. Pusat beban, attachment, tinggi angkat, jenis mast, dan konfigurasi unit dapat memengaruhi kapasitas aktual. Karena itu, kebutuhan pekerjaan perlu dijelaskan secara lengkap sebelum menentukan unit sewa.\n\nSiapkan informasi mengenai berat dan dimensi beban, tinggi rak atau titik penempatan, lebar lorong, kondisi permukaan, ruang putar, jam kerja, serta lingkungan dalam atau luar ruangan. Jenis sumber tenaga dan kebutuhan operator juga dapat menjadi pertimbangan sesuai aturan tempat kerja.\n\nPastikan kapasitas dan konfigurasi yang dipilih diverifikasi melalui load chart atau informasi pabrikan, bukan perkiraan. Diskusikan jadwal pemakaian, durasi, pengantaran, dan dukungan perawatan dengan penyedia rental. Penilaian kebutuhan yang tepat membantu memilih forklift yang sesuai dan menghindari penggunaan unit di luar batas aman.",
            'image_url' => 'https://thumb.wikimedia.org/wikipedia/commons/thumb/c/c5/Wilson_Warehouse_Forklifts_2016_Baton_Rouge_Louisiana.jpg/960px-Wilson_Warehouse_Forklifts_2016_Baton_Rouge_Louisiana.jpg',
            'image_credit' => 'TLSuda · CC BY-SA 4.0',
            'image_source_url' => 'https://commons.wikimedia.org/wiki/File:Wilson_Warehouse_Forklifts_2016_Baton_Rouge_Louisiana.jpg',
            'seo_title' => 'Tips Memilih Kapasitas Rental Forklift',
            'meta_description' => 'Faktor penting sebelum menyewa forklift: beban, tinggi angkat, area kerja, sumber tenaga, dan durasi pemakaian.',
        ],
        [
            'title' => 'Strategi Mengurangi Downtime Forklift di Area Kerja',
            'category' => 'Operasional',
            'summary' => 'Pencatatan kondisi unit, jadwal servis, dan tindak lanjut temuan membantu tim mengelola waktu henti dengan lebih terencana.',
            'body' => "Downtime forklift dapat mengganggu alur pemindahan material. Perencanaan yang baik dimulai dari daftar unit yang jelas, catatan jam operasi, jadwal perawatan, dan riwayat gangguan. Informasi tersebut membantu tim mengenali kebutuhan servis sebelum jadwal kerja padat.\n\nBuat alur pelaporan sederhana agar operator menyampaikan gejala sedini mungkin. Catat kapan masalah terjadi, kondisi beban dan area, indikator yang menyala, serta perubahan suara atau respons. Informasi yang akurat memudahkan teknisi menilai masalah dan menyiapkan pemeriksaan yang sesuai.\n\nUntuk pekerjaan dengan kebutuhan unit yang berubah-ubah, koordinasikan jadwal penggunaan, ketersediaan unit cadangan, atau opsi rental dengan penyedia. Prioritaskan perbaikan berdasarkan risiko keselamatan dan dampak operasional, bukan hanya kemudahan sementara. Hindari menunda gangguan yang dapat berkembang menjadi kerusakan lebih besar.",
            'image_url' => 'https://thumb.wikimedia.org/wikipedia/commons/thumb/8/81/Alaska_Brewing_Company_Warehouse_Tour.jpg/960px-Alaska_Brewing_Company_Warehouse_Tour.jpg',
            'image_credit' => 'James Brooks · CC BY 2.0',
            'image_source_url' => 'https://commons.wikimedia.org/wiki/File:Alaska_Brewing_Company_Warehouse_Tour.jpg',
            'seo_title' => 'Cara Mengurangi Downtime Forklift',
            'meta_description' => 'Langkah perencanaan perawatan dan pencatatan gangguan untuk membantu mengurangi downtime forklift.',
        ],
        [
            'title' => 'Menjaga Beban Forklift Stabil saat Dipindahkan',
            'replaces_slug' => 'perhatikan-sistem-pendingin-forklift-bermesin',
            'category' => 'Keselamatan Kerja',
            'summary' => 'Penempatan beban yang seimbang, garpu yang masuk penuh, dan perjalanan dengan beban rendah membantu menjaga kestabilan forklift.',
            'body' => "Sebelum mengangkat, pastikan berat dan dimensi muatan diketahui dan berada dalam kapasitas forklift untuk konfigurasi yang digunakan. Baca pelat kapasitas atau load chart unit; posisi pusat beban, tinggi angkat, mast, dan attachment dapat mengubah kapasitas yang diizinkan.\n\nAtur jarak garpu agar menopang muatan secara seimbang dan masukkan garpu sejauh yang diperlukan. Pastikan beban stabil dan tidak ada barang lepas yang dapat jatuh. Angkat hanya setinggi yang diperlukan untuk memindahkan muatan, lalu ikuti prosedur unit dan aturan lokasi kerja saat berjalan.\n\nJangan membawa beban yang menutupi pandangan tanpa mengikuti prosedur perusahaan, dan hindari belok atau berhenti mendadak. Jika muatan bergeser, tidak seimbang, atau melebihi kapasitas, turunkan dengan aman dan minta bantuan untuk menata ulang. Operator harus mengikuti pelatihan dan manual forklift yang digunakan.",
            'image_url' => 'https://thumb.wikimedia.org/wikipedia/commons/thumb/a/a5/Workers_drive_Forklifts_laden_with_USAID_goods_inside_a_large_warehouse_-_20110826-FS-LSC-0138_-_Flickr_-_USDAgov.jpg/960px-Workers_drive_Forklifts_laden_with_USAID_goods_inside_a_large_warehouse_-_20110826-FS-LSC-0138_-_Flickr_-_USDAgov.jpg',
            'image_credit' => 'U.S. Department of Agriculture · Public domain',
            'image_source_url' => 'https://commons.wikimedia.org/wiki/File:Workers_drive_Forklifts_laden_with_USAID_goods_inside_a_large_warehouse_-_20110826-FS-LSC-0138_-_Flickr_-_USDAgov.jpg',
            'seo_title' => 'Cara Menjaga Beban Forklift Tetap Stabil',
            'meta_description' => 'Panduan umum memindahkan muatan dengan memperhatikan kapasitas, pusat beban, garpu, dan prosedur keselamatan.',
        ],
        [
            'title' => 'Mengapa Suku Cadang yang Tepat Penting untuk Forklift',
            'category' => 'Suku Cadang',
            'summary' => 'Kesesuaian komponen dengan model dan spesifikasi unit membantu menjaga fungsi, keselamatan, dan kemudahan perawatan.',
            'body' => "Forklift memiliki komponen yang dirancang untuk bekerja sebagai satu sistem. Suku cadang yang terlihat serupa belum tentu memiliki ukuran, material, kapasitas, atau spesifikasi yang sama. Pemilihan komponen perlu mengacu pada merek, model, nomor seri, dan rekomendasi pabrikan.\n\nSebelum pemesanan, siapkan identitas unit serta informasi komponen lama. Tanyakan spesifikasi, garansi, dan dokumentasi produk kepada penyedia. Untuk bagian yang berkaitan dengan beban, kemudi, rem, hidrolik, atau keselamatan operator, pemasangan perlu dilakukan oleh teknisi yang memahami prosedur unit.\n\nSetelah penggantian, lakukan pemeriksaan fungsi dan dokumentasikan pekerjaan, tanggal, serta komponen yang dipasang. Jangan mengubah spesifikasi atau menggunakan komponen tanpa verifikasi teknis. Konsultasi lebih awal membantu menghindari kesalahan pemesanan dan mendukung keandalan forklift dalam pemakaian sehari-hari.",
            'image_url' => 'https://thumb.wikimedia.org/wikipedia/commons/thumb/1/1e/1st_Signal_Brigade_forklift_operator_moves_spares_at_cable_yard_at_Long_Binh.jpg/960px-1st_Signal_Brigade_forklift_operator_moves_spares_at_cable_yard_at_Long_Binh.jpg',
            'image_credit' => 'SP4 Ensign · Public domain',
            'image_source_url' => 'https://commons.wikimedia.org/wiki/File:1st_Signal_Brigade_forklift_operator_moves_spares_at_cable_yard_at_Long_Binh.jpg',
            'seo_title' => 'Memilih Suku Cadang Forklift yang Sesuai',
            'meta_description' => 'Panduan memilih suku cadang forklift berdasarkan model, spesifikasi pabrikan, dokumentasi, dan kebutuhan teknis.',
        ],
        [
            'title' => 'Periksa Garpu dan Rantai Mast Forklift Secara Berkala',
            'category' => 'Keselamatan Kerja',
            'summary' => 'Garpu dan rantai mast menopang pekerjaan pengangkatan; perubahan bentuk, retak, atau ketegangan yang tidak merata perlu ditindaklanjuti.',
            'body' => "Garpu dan rantai mast bekerja saat forklift mengangkat beban. Sebelum unit digunakan, amati apakah terdapat retakan, perubahan bentuk, kerusakan pengunci, atau keausan yang terlihat. Perhatikan juga apakah garpu terpasang dan terkunci dengan benar pada carriage.\n\nGerakan mast yang tidak seimbang, suara tidak biasa, atau rantai yang tampak kendur perlu dilaporkan untuk pemeriksaan lebih lanjut. Jangan mencoba meluruskan, mengelas, atau menyetel komponen sendiri tanpa kewenangan dan prosedur yang sesuai.\n\nPemeriksaan dan pengukuran keausan sebaiknya dilakukan oleh personel kompeten mengikuti panduan pabrikan. Catat temuan dan tindak lanjutnya. Jika ditemukan kerusakan yang berpotensi memengaruhi kemampuan menahan beban, amankan unit dan jangan digunakan sampai dinyatakan layak.",
            'image_url' => 'https://thumb.wikimedia.org/wikipedia/commons/thumb/d/d5/TCM_FORKLIFT_%282%29.jpg/960px-TCM_FORKLIFT_%282%29.jpg',
            'image_credit' => 'Dinkun Chen · CC BY-SA 4.0',
            'image_source_url' => 'https://commons.wikimedia.org/wiki/File:TCM_FORKLIFT_(2).jpg',
            'seo_title' => 'Pemeriksaan Garpu dan Rantai Mast Forklift',
            'meta_description' => 'Ketahui hal yang perlu diamati pada garpu dan rantai mast forklift serta kapan unit harus diperiksa teknisi.',
        ],
        [
            'title' => 'Mengenali Keausan Ban dan Roda Forklift',
            'category' => 'Perawatan',
            'summary' => 'Keausan tidak merata, retakan, atau perubahan kondisi roda dapat memengaruhi kestabilan forklift dan perlu diperiksa.',
            'body' => "Ban dan roda menopang unit sekaligus memengaruhi kestabilan saat forklift bergerak dan mengangkat beban. Pemeriksaan rutin dapat membantu menemukan keausan tidak merata, retakan, sobekan, benda asing, atau bagian roda yang tampak longgar.\n\nJenis roda forklift beragam, termasuk ban pneumatik dan ban solid. Gunakan kriteria pemeriksaan dan batas keausan sesuai rekomendasi produsen unit serta ban. Kondisi lantai, beban kerja, dan pola manuver juga dapat memengaruhi tingkat keausan.\n\nJika kondisi ban atau roda meragukan, hentikan penggunaan sesuai prosedur dan minta teknisi memeriksa unit. Penggantian perlu menggunakan spesifikasi yang sesuai dan dilakukan dengan peralatan yang tepat. Setelah pemasangan, lakukan pemeriksaan fungsi sebelum forklift kembali bekerja.",
            'image_url' => 'https://thumb.wikimedia.org/wikipedia/commons/thumb/3/35/%D0%97%D0%B0%D0%BC%D0%B5%D0%BD%D0%B0_%D0%BA%D0%BE%D0%BB%D0%B5%D1%81%D0%B0_%D0%BD%D0%B0_%D0%BF%D0%BE%D0%B3%D1%80%D1%83%D0%B7%D1%87%D0%B8%D0%BA%D0%B5.jpg/960px-%D0%97%D0%B0%D0%BC%D0%B5%D0%BD%D0%B0_%D0%BA%D0%BE%D0%BB%D0%B5%D1%81%D0%B0_%D0%BD%D0%B0_%D0%BF%D0%BE%D0%B3%D1%80%D1%83%D0%B7%D1%87%D0%B8%D0%BA%D0%B5.jpg',
            'image_credit' => 'Апатинаити · CC BY-SA 3.0',
            'image_source_url' => 'https://commons.wikimedia.org/wiki/File:%D0%97%D0%B0%D0%BC%D0%B5%D0%BD%D0%B0_%D0%BA%D0%BE%D0%BB%D0%B5%D1%81%D0%B0_%D0%BD%D0%B0_%D0%BF%D0%BE%D0%B3%D1%80%D1%83%D0%B7%D1%87%D0%B8%D0%BA%D0%B5.jpg',
            'seo_title' => 'Cara Mengenali Keausan Ban Forklift',
            'meta_description' => 'Pelajari tanda keausan ban dan roda forklift serta pentingnya penggantian sesuai spesifikasi unit.',
        ],
        [
            'title' => 'Memahami Kapasitas Angkat dan Pusat Beban Forklift',
            'category' => 'Keselamatan Kerja',
            'summary' => 'Kapasitas angkat dipengaruhi konfigurasi unit dan posisi beban; operator perlu merujuk pelat kapasitas dan panduan pabrikan.',
            'body' => "Kapasitas pada pelat forklift berlaku untuk konfigurasi dan kondisi tertentu. Posisi pusat beban, tinggi angkat, mast, dan attachment dapat memengaruhi kapasitas yang diizinkan. Beban yang terlalu berat atau berada terlalu jauh dari tumit garpu dapat mengubah kestabilan unit.\n\nSebelum mengangkat, ketahui berat dan dimensi muatan. Pastikan garpu masuk dengan benar, beban seimbang, dan jalur pergerakan telah diperiksa. Gunakan pelat kapasitas atau load chart unit sebagai acuan; jangan memperkirakan kemampuan angkat hanya dari ukuran forklift.\n\nJika informasi beban atau kapasitas unit tidak jelas, hentikan pekerjaan dan konsultasikan kepada penanggung jawab atau teknisi. Operator harus mengikuti pelatihan, aturan lokasi kerja, dan prosedur keselamatan yang berlaku. Perencanaan ini membantu mengurangi risiko beban bergeser atau forklift kehilangan kestabilan.",
            'image_url' => 'https://thumb.wikimedia.org/wikipedia/commons/thumb/8/81/Toyota_forklift_25_RSA_2003.jpg/960px-Toyota_forklift_25_RSA_2003.jpg',
            'image_credit' => 'Ossewa · CC BY 4.0',
            'image_source_url' => 'https://commons.wikimedia.org/wiki/File:Toyota_forklift_25_RSA_2003.jpg',
            'seo_title' => 'Kapasitas Angkat dan Pusat Beban Forklift',
            'meta_description' => 'Pahami hubungan kapasitas angkat, pusat beban, attachment, dan pelat kapasitas forklift.',
        ],
        [
            'title' => 'Persiapan Area Kerja Sebelum Mengoperasikan Forklift',
            'category' => 'Operasional',
            'summary' => 'Pemeriksaan jalur, permukaan, ruang gerak, dan interaksi dengan pekerja membantu menciptakan area kerja yang lebih aman.',
            'body' => "Sebelum forklift bergerak, pastikan jalur yang akan dilalui sesuai untuk unit dan beban. Perhatikan permukaan lantai, kemiringan, lubang, ambang, ruang bebas di atas, lebar lorong, serta titik belok. Singkirkan hambatan bila memungkinkan dan pastikan area tujuan dapat menerima muatan.\n\nKenali jalur pejalan kaki, persimpangan, pintu, dan area dengan jarak pandang terbatas. Ikuti batas kecepatan dan aturan klakson atau alarm di lokasi kerja. Bila pandangan terhalang muatan, ikuti prosedur perusahaan untuk meminta bantuan atau mengubah arah perjalanan.\n\nSebelum mengangkat atau menurunkan beban, pastikan orang lain berada di luar area bahaya dan muatan diletakkan pada permukaan yang sesuai. Laporkan kondisi area yang tidak aman kepada penanggung jawab. Pengaturan area kerja yang baik mendukung keselamatan operator, pekerja lain, dan peralatan.",
            'image_url' => 'https://thumb.wikimedia.org/wikipedia/commons/thumb/b/b4/Forklift_in_Carlisle_PA.jpg/960px-Forklift_in_Carlisle_PA.jpg',
            'image_credit' => 'J. Passepartout · CC BY-SA 4.0',
            'image_source_url' => 'https://commons.wikimedia.org/wiki/File:Forklift_in_Carlisle_PA.jpg',
            'seo_title' => 'Persiapan Area Kerja untuk Operasi Forklift',
            'meta_description' => 'Checklist area kerja sebelum menggunakan forklift: jalur, permukaan, ruang bebas, pejalan kaki, dan titik buta.',
        ],
        [
            'title' => 'Membuat Jadwal Servis Forklift Berdasarkan Jam Operasi',
            'category' => 'Perawatan',
            'summary' => 'Pencatatan hour meter dan riwayat servis membantu menyusun jadwal perawatan sesuai rekomendasi pabrikan dan pola pemakaian.',
            'body' => "Jam operasi memberikan gambaran tentang seberapa sering forklift digunakan. Catat pembacaan hour meter saat pemeriksaan dan servis, lalu bandingkan dengan interval perawatan yang ditetapkan pabrikan. Jadwal dapat berbeda menurut model, kondisi kerja, dan jenis tugas.\n\nBeban berat, debu, kelembapan, permukaan tidak rata, atau pola kerja yang intensif dapat menjadi pertimbangan saat mengevaluasi kebutuhan inspeksi. Jangan mengganti interval atau jenis pelumas hanya berdasarkan perkiraan; rujuk manual dan konsultasikan kondisi penggunaan kepada teknisi.\n\nSimpan riwayat pekerjaan, komponen yang diganti, temuan pemeriksaan, serta tanggal servis. Informasi tersebut membantu merencanakan waktu unit masuk bengkel, memantau perbaikan berulang, dan mengatur ketersediaan forklift untuk kegiatan operasional.",
            'image_url' => 'https://thumb.wikimedia.org/wikipedia/commons/thumb/4/49/Forklift_standing_in_the_street.jpg/960px-Forklift_standing_in_the_street.jpg',
            'image_credit' => 'Ser Amantio di Nicolao · CC BY-SA 4.0',
            'image_source_url' => 'https://commons.wikimedia.org/wiki/File:Forklift_standing_in_the_street.jpg',
            'seo_title' => 'Menyusun Jadwal Servis Forklift dari Hour Meter',
            'meta_description' => 'Gunakan catatan jam operasi dan rekomendasi pabrikan untuk menyusun jadwal servis forklift yang terencana.',
        ],
    ];

    public function handle(): int
    {
        $refreshExisting = $this->option('refresh-existing');
        $pending = collect(self::ARTICLES)
            ->filter(function (array $article) use ($refreshExisting): bool {
                if ($refreshExisting) {
                    return true;
                }

                return ! Article::whereIn('slug', array_filter([
                    Str::slug($article['title']),
                    $article['replaces_slug'] ?? null,
                ]))->exists();
            })
            ->values();

        if ($this->option('dry-run')) {
            if ($refreshExisting) {
                $this->info(sprintf(
                    'Ready to synchronize %d configured articles; %d matching articles will be updated.',
                    count(self::ARTICLES),
                    collect(self::ARTICLES)->filter(fn (array $article) => Article::whereIn(
                        'slug',
                        array_filter([
                            Str::slug($article['title']),
                            $article['replaces_slug'] ?? null,
                        ])
                    )->exists())
                        ->count()
                ));
            } else {
                $this->info(sprintf(
                    'Ready to add %d new articles; %d matching articles will be preserved.',
                    $pending->count(),
                    count(self::ARTICLES) - $pending->count()
                ));
            }

            foreach ($pending as $article) {
                $this->line($article['title']);
            }

            return self::SUCCESS;
        }

        if ($pending->isEmpty()) {
            $this->info('All configured forklift articles already exist. No records or images were changed.');

            return self::SUCCESS;
        }

        $downloads = [];
        foreach ($pending as $index => $article) {
            $response = Http::timeout(30)
                ->retry(2, 500)
                ->withUserAgent('PT Atha Yasa Mandiri website image importer')
                ->get($article['image_url'])
                ->throw();

            $contentType = strtolower((string) $response->header('Content-Type'));
            if (! in_array($contentType, ['image/jpeg', 'image/png', 'image/webp'], true)) {
                throw new RuntimeException(sprintf(
                    'Image download for "%s" returned unsupported content type "%s".',
                    $article['title'],
                    $contentType
                ));
            }

            if (strlen($response->body()) > 5 * 1024 * 1024) {
                throw new RuntimeException(sprintf(
                    'Image download for "%s" exceeds the 5 MB limit.',
                    $article['title']
                ));
            }

            $slug = Str::slug($article['title']);
            $downloads[$slug] = [
                'article' => $article,
                'contents' => $response->body(),
                'path' => 'articles/' . $slug . '.jpg',
                'published_at' => now()->subMinutes($index),
            ];
        }

        $newFiles = [];
        $previousFiles = [];
        try {
            foreach ($downloads as $download) {
                $path = $download['path'];
                $disk = Storage::disk('public');
                $exists = $disk->exists($path);

                if ($exists && ! $refreshExisting) {
                    continue;
                }

                if ($exists) {
                    $previousContent = $disk->get($path);
                    if ($previousContent === false) {
                        throw new RuntimeException(sprintf('Unable to back up article image "%s".', $path));
                    }

                    $previousFiles[$path] = $previousContent;
                }

                if (! $disk->put($path, $download['contents'])) {
                    throw new RuntimeException(sprintf('Unable to store article image "%s".', $path));
                }

                if (! $exists) {
                    $newFiles[] = $path;
                }
            }

            DB::transaction(function () use ($downloads, $refreshExisting): void {
                foreach ($downloads as $slug => $download) {
                    $article = $download['article'];
                    $content = [
                        'title' => $article['title'],
                        'category' => $article['category'],
                        'summary' => $article['summary'],
                        'body' => $article['body'],
                        'cover_image' => $download['path'],
                        'image_credit' => $article['image_credit'],
                        'image_source_url' => $article['image_source_url'],
                        'seo_title' => $article['seo_title'],
                        'meta_description' => $article['meta_description'],
                    ];

                    if ($refreshExisting) {
                        $existing = Article::whereIn('slug', array_filter([
                            $slug,
                            $article['replaces_slug'] ?? null,
                        ]))->first();

                        if ($existing) {
                            $existing->update($content + ['slug' => $slug]);
                        } else {
                            Article::create($content + [
                                'slug' => $slug,
                                'author' => 'PT Atha Yasa Mandiri',
                                'status' => 'published',
                                'published_at' => $download['published_at'],
                            ]);
                        }

                        continue;
                    }

                    Article::firstOrCreate(
                        ['slug' => $slug],
                        $content + [
                            'author' => 'PT Atha Yasa Mandiri',
                            'status' => 'published',
                            'published_at' => $download['published_at'],
                        ]
                    );
                }
            });
        } catch (Throwable $exception) {
            foreach ($previousFiles as $path => $contents) {
                Storage::disk('public')->put($path, $contents);
            }

            foreach ($newFiles as $path) {
                Storage::disk('public')->delete($path);
            }

            throw $exception;
        }

        $this->info(sprintf(
            $refreshExisting
                ? 'Synchronized %d forklift articles with verified cover images and attribution.'
                : 'Added %d forklift articles with credited cover images.',
            $pending->count()
        ));

        return self::SUCCESS;
    }
}
