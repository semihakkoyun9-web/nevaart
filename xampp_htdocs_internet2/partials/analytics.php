<?php
/**
 * NEVAART - 6. Bölüm: Akademik Kürasyon ve Arşiv Envanter Analitiği (PHP Dinamik Raporlama & Grafik)
 * Birebir React AnalyticsSection.tsx karşılığı — Kriter V (Dinamik raporlama veya grafik oluşturma)
 */

// PHP ile canlı telemetri hesaplamaları
$totalArtworksCount = count($artworks);
$uniqueArtists = array_unique(array_map(fn($a) => trim($a['artist']), $artworks));
$uniqueArtistsCount = count($uniqueArtists);
$totalViews = array_sum(array_map(fn($a) => (int)($a['views'] ?? 0), $artworks));
$curatorPicksCount = count(array_filter($artworks, fn($a) => !empty($a['isCuratorPick'])));

// Kategori dağılımı ve yüzdeleri
$categoryStats = [];
foreach ($categories as $cat) {
    $count = count(array_filter($artworks, fn($a) => $a['category'] === $cat['id']));
    $percentage = $totalArtworksCount > 0 ? (int)round(($count / $totalArtworksCount) * 100) : 0;
    $categoryStats[] = [
        'id' => $cat['id'],
        'name' => $currentLang === 'tr' ? $cat['nameTr'] : $cat['nameEn'],
        'count' => $count,
        'percentage' => $percentage
    ];
}

// Sıralama (En yüksek iki kategoriyi rapor özetinde göstermek için)
$sortedCategories = $categoryStats;
usort($sortedCategories, fn($a, $b) => $b['count'] <=> $a['count']);
$topCategory = $sortedCategories[0] ?? ['name' => '', 'percentage' => 0];
$secondCategory = $sortedCategories[1] ?? ['name' => '', 'percentage' => 0];

// Tonal harmonilerin eser renk paletlerinden PHP ile çıkarılması
$colorMap = [];
foreach ($artworks as $art) {
    foreach ($art['colorPalette'] ?? [] as $c) {
        $key = strtolower($c['hex']);
        if (!isset($colorMap[$key])) {
            $colorMap[$key] = [
                'name' => $c['name'],
                'hex' => $c['hex'],
                'totalWeight' => 0
            ];
        }
        $colorMap[$key]['totalWeight'] += (int)($c['percentage'] ?? 10);
    }
}
$sortedColors = array_values($colorMap);
usort($sortedColors, fn($a, $b) => $b['totalWeight'] <=> $a['totalWeight']);
$top5Colors = array_slice($sortedColors, 0, 5);
$sumWeight = array_sum(array_column($top5Colors, 'totalWeight')) ?: 1;

$tonalStats = [];
foreach ($top5Colors as $item) {
    $tonalStats[] = [
        'name' => $item['name'],
        'hex' => $item['hex'],
        'score' => (int)round(($item['totalWeight'] / $sumWeight) * 100)
    ];
}

$chartColors = ['#1C3144', '#777572', '#C59B67', '#0B2545', '#8C8A85'];
?>
<section id="analitik" class="py-16 px-6 max-w-7xl mx-auto border-t border-[#E8E2D9]">
  <div class="text-center max-w-2xl mx-auto mb-12">
    <span class="text-[11px] uppercase tracking-widest text-[#78350F] font-semibold font-mono block">
      <?= e($t['navAnalytics']) ?>
    </span>
    <h2 class="text-3xl lg:text-4xl font-serif text-[#1C1917] mt-1 font-medium">
      <?= e($t['statsTitle']) ?>
    </h2>
    <p class="text-stone-500 text-xs md:text-sm mt-2 font-sans">
      <?= e($t['statsDesc']) ?>
    </p>
  </div>

  <!-- 4 Telemetry Metrics Cards -->
  <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
    <div class="bg-white border border-[#E8E2D9] p-5 rounded-xs shadow-xs">
      <div class="flex items-center justify-between text-stone-400 mb-2">
        <span class="text-xs uppercase font-mono tracking-wider text-stone-500">
          <?= e($t['totalArtworks']) ?>
        </span>
        <?= icon('layers', 'w-4 h-4 text-stone-500') ?>
      </div>
      <div id="metric-total-artworks" class="text-3xl font-serif font-semibold text-stone-900 tabular-nums">
        <?= (int)$totalArtworksCount ?>
      </div>
      <span class="text-[11px] text-stone-400 font-mono mt-1 block">
        <?= count($categories) ?> <?= $currentLang === 'tr' ? 'Küratöryel Disiplin' : 'Disciplines' ?>
      </span>
    </div>

    <div class="bg-white border border-[#E8E2D9] p-5 rounded-xs shadow-xs">
      <div class="flex items-center justify-between text-stone-400 mb-2">
        <span class="text-xs uppercase font-mono tracking-wider text-stone-500">
          <?= e($t['totalArtists']) ?>
        </span>
        <?= icon('award', 'w-4 h-4 text-stone-500') ?>
      </div>
      <div id="metric-total-artists" class="text-3xl font-serif font-semibold text-stone-900 tabular-nums">
        <?= (int)$uniqueArtistsCount ?>
      </div>
      <span class="text-[11px] text-stone-400 font-mono mt-1 block">
        <?= $currentLang === 'tr' ? 'Usta & Bağımsız Sanatçı' : 'Master & Independent Artists' ?>
      </span>
    </div>

    <div class="bg-white border border-[#E8E2D9] p-5 rounded-xs shadow-xs">
      <div class="flex items-center justify-between text-stone-400 mb-2">
        <span class="text-xs uppercase font-mono tracking-wider text-stone-500">
          <?= e($t['totalViews']) ?>
        </span>
        <?= icon('eye', 'w-4 h-4 text-stone-500') ?>
      </div>
      <div class="text-3xl font-serif font-semibold text-stone-900 tabular-nums">
        <?= number_format($totalViews) ?>
      </div>
      <span class="text-[11px] text-stone-400 font-mono mt-1 block">
        <?= $currentLang === 'tr' ? 'Sanatsal İnceleme' : 'Curatorial Views' ?>
      </span>
    </div>

    <div class="bg-white border border-[#E8E2D9] p-5 rounded-xs shadow-xs">
      <div class="flex items-center justify-between text-stone-400 mb-2">
        <span class="text-xs uppercase font-mono tracking-wider text-stone-500">
          <?= $currentLang === 'tr' ? 'Küratör Seçkisi' : 'Curator Picks' ?>
        </span>
        <?= icon('palette', 'w-4 h-4 text-stone-500') ?>
      </div>
      <div class="text-3xl font-serif font-semibold text-stone-900 tabular-nums">
        <?= (int)$curatorPicksCount ?>
      </div>
      <span class="text-[11px] text-stone-400 font-mono mt-1 block">
        <?= $currentLang === 'tr' ? 'Öne Çıkarılan Başyapıt' : 'Highlighted Masterpieces' ?>
      </span>
    </div>
  </div>

  <!-- Graphic Container -->
  <div class="bg-white border border-[#E8E2D9] p-6 lg:p-8 rounded-xs shadow-xs">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-[#F5EFEB]">
      <div>
        <h3 class="font-serif text-xl font-medium text-stone-900">
          <?= $currentLang === 'tr'
            ? 'Kürasyon ve Arşiv Envanter Dağılımı'
            : 'Curatorial & Archival Inventory Breakdown' ?>
        </h3>
        <span class="text-xs text-stone-500 font-sans">
          <?= $currentLang === 'tr'
            ? 'Koleksiyonda yer alan eserlerin disiplinlere göre güncel oranları'
            : 'Current distribution of cataloged artworks across curatorial disciplines' ?>
        </span>
      </div>

      <div class="flex items-center gap-1 p-1 bg-[#F4EFEB] rounded border border-stone-200">
        <button
          type="button"
          id="chart-btn-category"
          onclick="NevaApp.switchAnalyticsTab('category')"
          class="px-3 py-1 text-xs font-medium rounded transition-all cursor-pointer flex items-center gap-1.5 bg-white text-stone-900 shadow-xs"
        >
          <?= icon('pie-chart', 'w-3.5 h-3.5') ?>
          <span><?= $currentLang === 'tr' ? 'Kategori Dağılımı' : 'Category Distribution' ?></span>
        </button>
        <button
          type="button"
          id="chart-btn-colors"
          onclick="NevaApp.switchAnalyticsTab('colors')"
          class="px-3 py-1 text-xs font-medium rounded transition-all cursor-pointer flex items-center gap-1.5 text-stone-600"
        >
          <?= icon('bar-chart-3', 'w-3.5 h-3.5') ?>
          <span><?= $currentLang === 'tr' ? 'Tonal Harmoniler' : 'Tonal Harmonies' ?></span>
        </button>
      </div>
    </div>

    <!-- Visual Chart Bars & Legends -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
      
      <!-- Chart Graphic Area (7 cols) -->
      <div class="lg:col-span-7 flex flex-col justify-center">
        <!-- Category Distribution Bars -->
        <div id="analytics-panel-category" class="space-y-4">
          <?php foreach ($categoryStats as $index => $item): 
            $barColor = $chartColors[$index % count($chartColors)];
          ?>
            <div>
              <div class="flex justify-between text-xs mb-1 font-sans">
                <span class="font-medium text-stone-800 flex items-center gap-2">
                  <span
                    class="w-2.5 h-2.5 rounded-full inline-block"
                    style="background-color: <?= e($barColor) ?>;"
                  ></span>
                  <?= e($item['name']) ?>
                </span>
                <span class="font-mono text-stone-500 tabular-nums">
                  <?= (int)$item['count'] ?> <?= $currentLang === 'tr' ? 'Eser' : 'Works' ?> (%<?= (int)$item['percentage'] ?>)
                </span>
              </div>
              <div class="w-full h-3 bg-[#F4EFEB] rounded-full overflow-hidden">
                <div
                  class="h-full rounded-full transition-all duration-700"
                  style="width: <?= (int)$item['percentage'] ?>%; background-color: <?= e($barColor) ?>;"
                ></div>
              </div>
            </div>
          <?php endforeach; ?>
        </div>

        <!-- Tonal Harmonies Bars -->
        <div id="analytics-panel-colors" class="hidden space-y-4">
          <?php foreach ($tonalStats as $color): 
            $barHex = strtolower($color['hex']) === '#ffffff' ? '#C59B67' : $color['hex'];
          ?>
            <div>
              <div class="flex justify-between text-xs mb-1 font-sans">
                <span class="font-medium text-stone-800 flex items-center gap-2">
                  <span
                    class="w-3 h-3 rounded-xs border border-stone-300 inline-block"
                    style="background-color: <?= e($color['hex']) ?>;"
                  ></span>
                  <?= e($color['name']) ?>
                </span>
                <span class="font-mono text-stone-500 tabular-nums">
                  %<?= (int)$color['score'] ?> <?= $currentLang === 'tr' ? 'Frekans' : 'Frequency' ?>
                </span>
              </div>
              <div class="w-full h-3 bg-[#F4EFEB] rounded-full overflow-hidden">
                <div
                  class="h-full rounded-full transition-all duration-700"
                  style="width: <?= (int)$color['score'] ?>%; background-color: <?= e($barHex) ?>;"
                ></div>
              </div>
            </div>
          <?php endforeach; ?>
        </div>
      </div>

      <!-- Descriptive Information (5 cols) -->
      <div class="lg:col-span-5 bg-[#FAF8F5] p-5 border border-[#E8E2D9] rounded-xs text-xs space-y-3">
        <span class="text-[10px] font-mono uppercase tracking-widest text-[#78350F] font-semibold">
          <?= $currentLang === 'tr' ? 'Kürasyon Raporu Özeti' : 'Curatorial Report Summary' ?>
        </span>
        <h4 class="font-serif text-lg font-semibold text-stone-900">
          <?= $currentLang === 'tr' ? 'Koleksiyon Çeşitliliği ve Sanatsal Denge' : 'Collection Diversity & Curatorial Balance' ?>
        </h4>
        <p class="text-stone-600 leading-relaxed font-sans">
          <?= $currentLang === 'tr'
            ? "NEVAART arşivinde yer alan {$totalArtworksCount} eserin %{$topCategory['percentage']}’i {$topCategory['name']} disiplininde yer alırken; onu %{$secondCategory['percentage']} ile {$secondCategory['name']} alanı izlemektedir."
            : "Across the {$totalArtworksCount} cataloged works in the NEVAART archive, {$topCategory['percentage']}% belong to {$topCategory['name']}, closely accompanied by {$secondCategory['name']} at {$secondCategory['percentage']}%." ?>
        </p>
        <p class="text-stone-600 leading-relaxed font-sans">
          <?= $currentLang === 'tr'
            ? 'Renk ve doku analitiği, arşivdeki eserlerin sanatçıların özgün renk paletleri ve mimari-belgesel ışık dengeleriyle zenginleştiğini teyit etmektedir.'
            : 'Chromatic frequency analytics demonstrate authentic tonal harmony between natural pigments and spatial daylight spectrums across the collection.' ?>
        </p>
      </div>

    </div>
  </div>
</section>

