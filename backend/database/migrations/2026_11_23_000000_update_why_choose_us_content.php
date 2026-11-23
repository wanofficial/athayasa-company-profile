<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    private const NEW_CONTENT = [
        'why_title' => 'Dukungan andal untuk operasional forklift',
        'reason_1_icon' => 'wrench',
        'reason_1_title' => 'Teknisi berpengalaman dan tersertifikasi',
        'reason_1_description' => 'Didukung teknisi berpengalaman dan tersertifikasi untuk membantu pemeriksaan, perawatan, serta perbaikan forklift sesuai kebutuhan unit.',
        'reason_2_icon' => 'forklift',
        'reason_2_title' => 'Layanan forklift terintegrasi',
        'reason_2_description' => 'Perawatan berkala, perbaikan, penggantian suku cadang, hingga rental dalam satu rangkaian layanan agar kebutuhan unit lebih praktis dikoordinasikan.',
        'reason_3_icon' => 'clock-3',
        'reason_3_title' => 'Responsif dan mengutamakan ketepatan waktu',
        'reason_3_description' => 'Komunikasi yang jelas dan penanganan tepat waktu membantu pelanggan merencanakan layanan serta menjaga kelancaran operasional.',
    ];

    private const PREVIOUS_CONTENT = [
        'why_title' => 'Alasan memilih Athayasa',
        'reason_1_icon' => 'shield-check',
        'reason_1_title' => 'Berbasis di Batam',
        'reason_1_description' => 'Berada di Batam dan memahami kebutuhan layanan perusahaan di kawasan industri setempat.',
        'reason_2_icon' => 'shield-check',
        'reason_2_title' => 'Dukungan teknis',
        'reason_2_description' => 'Layanan perawatan dan perbaikan forklift ditangani oleh teknisi berpengalaman.',
        'reason_3_icon' => null,
        'reason_3_title' => 'Layanan terpadu',
        'reason_3_description' => 'Mulai dari perawatan berkala dan penggantian suku cadang hingga rental forklift.',
    ];

    public function up(): void
    {
        DB::table('website_settings')->where('id', 1)->update(self::NEW_CONTENT);
    }

    public function down(): void
    {
        DB::table('website_settings')->where('id', 1)->update(self::PREVIOUS_CONTENT);
    }
};
