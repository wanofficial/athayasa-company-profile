<?php

namespace App\Console\Commands;

use App\Models\Customer;
use App\Models\Project;
use App\Models\Service;
use DOMDocument;
use DOMElement;
use DOMXPath;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use RuntimeException;

class ImportLegacyWebsiteContent extends Command
{
    protected $signature = 'website:import-legacy {--dry-run : Preview items without saving records or images}';

    protected $description = 'Import missing public content and media from the legacy Athayasa website';

    private const SOURCE_URL = 'https://www.athayasamandiri.com/';

    private const CUSTOMER_NAMES_BY_LOGO = [
        'latrade.png' => 'PT. Latrade Batam Indonesia',
        'Apollo.png' => 'PT Apollo Solar Indonesia',
        'Ecogreen.png' => 'Ecogreen Oleochemicals',
        'jplogo.png' => 'PT JP Technology',
        'Champions.png' => 'PT Champion Mattress Indonesia Manufacturing',
        'nsp.jpg' => 'NSP Tech Pte. Ltd.',
        'satria-piranti.png' => 'PT. Satria Piranti Perkasa',
        'logo-rainbow.png' => 'PT. Rainbow Tubulars Manufacture',
        'gaoyi.jpg' => 'Gaoyi',
        'dunia-solar.png' => 'PT Dunia Solar Indonesia',
        'bsstec.png' => 'PT Batam Slop and Sludge Treatment Centre (PT BSSTEC)',
        'yi-sheng.jpg' => 'Yisheng Investment Group Co., Ltd.',
        'Wilmax-Logo.png' => 'Wilmax Control Systems',
        'logo-satnusa.png' => 'PT SAT NUSAPERSADA TBK',
        'logo-indokaya.png' => 'PT Indo Kaya Energi (IKE)',
        'batam-teknologi.png' => 'Batam Teknologi Gas',
        'tomoe.jpg' => 'TOMOE',
        'Satria-selaras.png' => 'PT. SATRIA SELARAS NUSA',
        'wings.png' => 'WINGS Group',
    ];

    private const CUSTOMER_SORT_ORDER = [
        'latrade.png' => 0,
        'Apollo.png' => 1,
        'Ecogreen.png' => 2,
        'jplogo.png' => 3,
        'Champions.png' => 4,
        'nsp.jpg' => 5,
        'satria-piranti.png' => 6,
        'logo-rainbow.png' => 7,
        'gaoyi.jpg' => 8,
        'dunia-solar.png' => 9,
        'bsstec.png' => 10,
        'yi-sheng.jpg' => 11,
        'Wilmax-Logo.png' => 12,
        'logo-satnusa.png' => 13,
        'logo-indokaya.png' => 15,
        'batam-teknologi.png' => 16,
        'tomoe.jpg' => 17,
        'Satria-selaras.png' => 18,
        'wings.png' => 19,
    ];

    private const PROJECTS = [
        [
            'title' => 'Perbaikan Mesin Forklift',
            'description' => 'Perbaikan mesin forklift',
            'image' => '1.jpg',
        ],
        [
            'title' => 'Pergantian Sparepart Forklift',
            'description' => 'Pergantian sparepart forklift',
            'image' => '17.jpg',
        ],
        [
            'title' => 'Perbaikan Shield Forklift',
            'description' => 'Perbaikan pergantian shield forklift',
            'image' => '8.jpg',
        ],
        [
            'title' => 'Perbaikan Forklift',
            'description' => 'Perbaikan forklift',
            'image' => '26.jpg',
        ],
        [
            'title' => 'Perbaikan Handjack',
            'description' => 'Perbaikan handjack',
            'image' => '30.jpg',
        ],
        [
            'title' => 'Pergantian Roda Forklift',
            'description' => 'Perbaikan pergantian roda forklift',
            'image' => '33.jpg',
        ],
    ];

    private const SERVICES = [
        [
            'title' => 'Perbaikan',
            'slug' => 'perbaikan',
            'short_description' => 'Layanan perbaikan forklift dan alat berat, dari kerusakan ringan hingga perbaikan besar.',
            'description' => 'Kami menyediakan layanan perbaikan forklift dan alat berat dengan standar profesional, mulai dari kerusakan ringan hingga perbaikan besar. Setiap pekerjaan dilakukan oleh teknisi berpengalaman dengan dukungan suku cadang asli sehingga hasil perbaikan lebih optimal dan tahan lama.',
        ],
        [
            'title' => 'Pergantian Sparepart',
            'slug' => 'pergantian-sparepart',
            'short_description' => 'Pergantian sparepart asli dan bergaransi oleh teknisi berpengalaman.',
            'description' => 'Kami menyediakan layanan pergantian sparepart forklift dan alat berat dengan jaminan suku cadang asli dan bergaransi. Setiap penggantian dilakukan oleh teknisi berpengalaman agar performa mesin tetap optimal dan tahan lama.',
        ],
        [
            'title' => 'Rental Forklift',
            'slug' => 'rental-forklift',
            'short_description' => 'Rental forklift dengan berbagai kapasitas dan unit yang terawat rutin.',
            'description' => 'Selain jasa perawatan dan perbaikan, kami juga menyediakan layanan rental forklift dengan berbagai kapasitas sesuai kebutuhan. Unit forklift yang kami sewakan selalu dalam kondisi prima karena mendapatkan perawatan rutin dari teknisi berpengalaman.',
        ],
    ];

    public function handle(): int
    {
        $response = Http::timeout(30)->get(self::SOURCE_URL)->throw();
        $document = new DOMDocument();
        $previousErrorSetting = libxml_use_internal_errors(true);
        $loaded = $document->loadHTML($response->body());
        libxml_clear_errors();
        libxml_use_internal_errors($previousErrorSetting);

        if (!$loaded) {
            throw new RuntimeException('Unable to parse the legacy website homepage.');
        }

        $xpath = new DOMXPath($document);
        $customerItems = $this->customerItems($xpath);

        if (count($customerItems) !== 20) {
            throw new RuntimeException(sprintf(
                'Expected 20 customer entries from the source website; found %d. No records were imported.',
                count($customerItems)
            ));
        }

        if ($this->option('dry-run')) {
            $this->info(sprintf(
                'Source parsed successfully: %d services, %d gallery projects, %d customers.',
                count(self::SERVICES),
                count(self::PROJECTS),
                count($customerItems)
            ));
            foreach ($customerItems as $item) {
                $this->line(sprintf(
                    '%s <- %s',
                    $item['name'],
                    basename((string) parse_url($item['image'], PHP_URL_PATH))
                ));
            }
            $this->line('No database records or image files were changed.');

            return self::SUCCESS;
        }

        $serviceCount = $this->importServices();
        $projectCount = $this->importProjects();
        $customerCount = $this->importCustomers($customerItems);

        $this->info(sprintf(
            'Legacy content import complete. Added %d services, %d projects, and %d customers. Existing records were preserved.',
            $serviceCount,
            $projectCount,
            $customerCount
        ));

        return self::SUCCESS;
    }

    /**
     * @return list<array{name: string, description: string, image: string}>
     */
    private function customerItems(DOMXPath $xpath): array
    {
        $nodes = $xpath->query(
            '//*[@id="testimonials"]//*[contains(concat(" ", normalize-space(@class), " "), " testimonial-item ")]'
        );

        if ($nodes === false) {
            throw new RuntimeException('Unable to locate customer entries on the source website.');
        }

        $items = [];
        foreach ($nodes as $node) {
            if (!$node instanceof DOMElement) {
                continue;
            }

            $images = $xpath->query('.//img[@src]', $node);
            $imageSource = $images && $images->length > 0
                ? $images->item(0)?->attributes?->getNamedItem('src')?->nodeValue
                : null;
            $imageUrl = $imageSource
                ? $this->sourceAssetUrl($imageSource)
                : null;
            $imageName = $imageUrl
                ? basename((string) parse_url($imageUrl, PHP_URL_PATH))
                : '';

            $paragraphs = $xpath->query('.//p', $node);
            $descriptionParts = [];
            if ($paragraphs !== false) {
                foreach ($paragraphs as $paragraph) {
                    $text = $this->cleanText($paragraph->textContent);
                    if ($text !== '') {
                        $descriptionParts[] = $text;
                    }
                }
            }

            if (
                !$imageUrl
                || !isset(self::CUSTOMER_NAMES_BY_LOGO[$imageName])
                || $descriptionParts === []
            ) {
                continue;
            }

            $items[] = [
                'name' => self::CUSTOMER_NAMES_BY_LOGO[$imageName],
                'description' => implode("\n\n", $descriptionParts),
                'image' => $imageUrl,
            ];
        }

        if (count($items) !== 20) {
            throw new RuntimeException(sprintf(
                'Expected 20 customer entries with recognized logos and descriptions; found %d. No records were imported.',
                count($items)
            ));
        }

        return $items;
    }

    private function importServices(): int
    {
        $added = 0;
        foreach (self::SERVICES as $service) {
            $record = Service::firstOrCreate(
                ['slug' => $service['slug']],
                [...$service, 'is_active' => true, 'sort_order' => $added]
            );

            if ($record->wasRecentlyCreated) {
                $added++;
            }
        }

        return $added;
    }

    private function importProjects(): int
    {
        $added = 0;
        foreach (self::PROJECTS as $index => $project) {
            $slug = Str::slug($project['title']);
            $imagePath = "legacy-site/projects/{$slug}.jpg";

            if (Project::where('slug', $slug)->exists()) {
                continue;
            }

            $this->storeSourceAsset(
                self::SOURCE_URL . 'assets/img/New/Project/' . $project['image'],
                $imagePath
            );

            Project::create([
                'title' => $project['title'],
                'slug' => $slug,
                'short_description' => $project['description'],
                'description' => $project['description'],
                'image' => $imagePath,
                'sort_order' => $index,
                'is_featured' => true,
                'is_active' => true,
            ]);
            $added++;
        }

        return $added;
    }

    /**
     * @param list<array{name: string, description: string, image: string}> $items
     */
    private function importCustomers(array $items): int
    {
        $existingNames = Customer::query()->pluck('name')
            ->map(fn (string $name) => $this->normalizeName($name))
            ->all();
        $added = 0;

        foreach ($items as $item) {
            $normalizedName = $this->normalizeName($item['name']);
            if (in_array($normalizedName, $existingNames, true)) {
                continue;
            }

            $slug = Str::slug($item['name']);
            if (Customer::where('slug', $slug)->exists()) {
                continue;
            }

            $extension = strtolower(pathinfo((string) parse_url($item['image'], PHP_URL_PATH), PATHINFO_EXTENSION));
            $imagePath = "legacy-site/customers/{$slug}.{$extension}";
            $this->storeSourceAsset($item['image'], $imagePath);

            Customer::create([
                'name' => $item['name'],
                'slug' => $slug,
                'logo' => $imagePath,
                'short_description' => $item['description'],
                'sort_order' => self::CUSTOMER_SORT_ORDER[
                    basename((string) parse_url($item['image'], PHP_URL_PATH))
                ],
                'is_featured' => true,
                'is_active' => true,
            ]);

            $existingNames[] = $normalizedName;
            $added++;
        }

        return $added;
    }

    private function storeSourceAsset(string $url, string $storagePath): void
    {
        $path = (string) parse_url($url, PHP_URL_PATH);
        $host = parse_url($url, PHP_URL_HOST);
        if (
            $host !== 'www.athayasamandiri.com'
            || !str_starts_with($path, '/assets/img/New/')
        ) {
            throw new RuntimeException("Refusing to import an asset outside the legacy website: {$url}");
        }

        $disk = Storage::disk('public');
        if ($disk->exists($storagePath)) {
            return;
        }

        $response = Http::timeout(30)->get($url)->throw();
        $contentType = (string) $response->header('Content-Type');
        $body = $response->body();
        if (!str_starts_with(strtolower($contentType), 'image/') || $body === '') {
            throw new RuntimeException("Legacy asset is not a valid image: {$url}");
        }

        if (!$disk->put($storagePath, $body)) {
            throw new RuntimeException("Unable to save imported image: {$storagePath}");
        }
    }

    private function sourceAssetUrl(string $source): string
    {
        $url = str_starts_with($source, 'http')
            ? $source
            : self::SOURCE_URL . ltrim($source, '/');

        $this->assertLegacyAssetUrl($url);

        return $url;
    }

    private function assertLegacyAssetUrl(string $url): void
    {
        $path = (string) parse_url($url, PHP_URL_PATH);
        if (
            parse_url($url, PHP_URL_HOST) !== 'www.athayasamandiri.com'
            || !str_starts_with($path, '/assets/img/New/')
        ) {
            throw new RuntimeException("Refusing to import an asset outside the legacy website: {$url}");
        }
    }

    private function normalizeName(string $name): string
    {
        return preg_replace('/[^a-z0-9]/', '', Str::lower($name)) ?? '';
    }

    private function cleanText(string $text): string
    {
        return trim(preg_replace('/\s+/u', ' ', $text) ?? '');
    }
}
