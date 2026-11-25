<?php
/**
 * NEVAART - Dinamik PDF Künye Dönüştürücü (PHP)
 * Kriter AA: PDF'e metin dönüştürme
 */

require_once __DIR__ . '/config/session.php';
require_once __DIR__ . '/config/db.php';
require_once __DIR__ . '/includes/helpers.php';

$reportType = $_GET['report'] ?? '';
$artworks = $db->getArtworks();

// Özellik 2: Koleksiyon Envanter ve Analitik Raporu PDF Çıktısı (Kriter AA)
if ($reportType === 'catalog') {
    ?>
    <!DOCTYPE html>
    <html lang="tr">
    <head>
      <meta charset="UTF-8">
      <title>NEVAART - Koleksiyon ve Kürasyon Envanter Raporu (PDF)</title>
      <style>
        body { font-family: 'Georgia', serif; padding: 40px; color: #1C1917; background: #FFF; line-height: 1.5; }
        .header { border-bottom: 2px solid #1C1917; padding-bottom: 12px; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: flex-end; }
        h1 { font-size: 26px; margin: 0; font-weight: bold; }
        .date { font-family: monospace; font-size: 12px; color: #666; }
        table { width: 100%; border-collapse: collapse; margin-top: 15px; font-size: 12px; }
        th, td { border: 1px solid #D6D3D1; padding: 8px 10px; text-align: left; }
        th { background: #F5F5F4; font-family: sans-serif; font-weight: 600; text-transform: uppercase; font-size: 10px; letter-spacing: 0.05em; }
        .mono { font-family: monospace; }
        .badge { background: #FEF3C7; color: #92400E; padding: 2px 6px; border-radius: 4px; font-size: 10px; font-weight: bold; }
        .summary { margin-top: 25px; padding: 15px; background: #FAFAF9; border: 1px solid #E7E5E4; font-size: 12px; display: flex; gap: 30px; }
      </style>
    </head>
    <body onload="window.print()">
      <div class="header">
        <div>
          <h1>NEVAART KÜRATÖRYEL ARŞİV ENVANTER RAPORU</h1>
          <div class="date">Belge No: DOC-2026-CAT · Rapor Tarihi: <?= date('d.m.Y H:i') ?> · Sistem: PHP 8.2 / XAMPP</div>
        </div>
      </div>

      <table>
        <thead>
          <tr>
            <th>No</th>
            <th>Envanter Kodu</th>
            <th>Eser Adı</th>
            <th>Sanatçı</th>
            <th>Kategori</th>
            <th>Yıl</th>
            <th>Beğeni</th>
            <th>Durum</th>
          </tr>
        </thead>
        <tbody>
          <?php foreach ($artworks as $i => $art): ?>
            <tr>
              <td class="mono"><?= $i + 1 ?></td>
              <td class="mono"><?= e($art['accessionNumber']) ?></td>
              <td><strong><?= e($art['title']) ?></strong></td>
              <td><?= e($art['artist']) ?></td>
              <td><?= e(ucfirst($art['category'])) ?></td>
              <td class="mono"><?= (int)$art['year'] ?></td>
              <td class="mono"><?= number_format((int)$art['likes']) ?></td>
              <td><?= !empty($art['isCuratorPick']) ? '<span class="badge">Küratör Seçkisi</span>' : 'Arşiv' ?></td>
            </tr>
          <?php endforeach; ?>
        </tbody>
      </table>

      <div class="summary">
        <div><strong>Toplam Kayıtlı Eser:</strong> <?= count($artworks) ?> adet</div>
        <div><strong>Toplam Görüntülenme:</strong> <?= number_format(array_sum(array_column($artworks, 'views'))) ?></div>
        <div><strong>Küratör Onaylı Başyapıt:</strong> <?= count(array_filter($artworks, fn($a) => !empty($a['isCuratorPick']))) ?> adet</div>
        <div><strong>Doğrulama:</strong> NevaArt Baş Küratörlüğü</div>
      </div>
    </body>
    </html>
    <?php
    exit;
}

// Özellik 1: Tekil Eser Müze Künyesi PDF Çıktısı (Kriter AA)
$id = isset($_GET['id']) ? (int)$_GET['id'] : 1;
$artwork = $artworks[0] ?? null;

foreach ($artworks as $art) {
    if ((int)$art['id'] === $id) {
        $artwork = $art;
        break;
    }
}

if (!$artwork) {
    http_response_code(404);
    exit('Eser bulunamadı.');
}
?>
<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="UTF-8">
  <title>NEVAART - <?= e($artwork['accessionNumber']) ?> - <?= e($artwork['title']) ?></title>
  <style>
    body { font-family: 'Georgia', serif; padding: 40px; color: #1C1917; background: #FAF8F5; line-height: 1.6; }
    .header { border-bottom: 2px solid #1C1917; padding-bottom: 16px; margin-bottom: 24px; }
    .title { font-size: 32px; font-weight: bold; margin: 0; }
    .meta { font-family: monospace; font-size: 13px; color: #666; margin-top: 6px; }
    .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin: 20px 0; }
    .row { border-bottom: 1px solid #E8E2D9; padding: 8px 0; font-size: 13px; }
    .story { margin-top: 24px; font-size: 14px; }
    .palette { display: flex; gap: 10px; margin: 16px 0; }
    .color-box { width: 65px; height: 60px; border: 1px solid #ccc; text-align: center; font-size: 10px; font-family: monospace; padding-top: 65px; }
  </style>
</head>
<body onload="window.print()">
  <div class="header">
    <h1 class="title">NEVAART KÜRATÖRYEL ARŞİV KÜNYESİ</h1>
    <div class="meta">Envanter No: <?= e($artwork['accessionNumber']) ?> · Sanatçı: <?= e($artwork['artist']) ?> (<?= (int)$artwork['year'] ?>)</div>
  </div>
  <h2><?= e($artwork['title']) ?></h2>
  <div class="grid">
    <div class="row"><strong>Teknik & Materyal:</strong> <?= e($artwork['mediumTr']) ?></div>
    <div class="row"><strong>Ebatlar:</strong> <?= e($artwork['dimensions']) ?></div>
    <div class="row"><strong>Çözünürlük Standardı:</strong> <?= e($artwork['resolution']) ?></div>
    <div class="row"><strong>Sergi Konumu:</strong> <?= e($artwork['exhibitionLocation']['venue']) ?> (<?= e($artwork['exhibitionLocation']['city']) ?>)</div>
  </div>
  <div class="story">
    <h3>Yaratım Hikayesi & Küratör Değerlendirmesi:</h3>
    <p><?= e($artwork['storyTr']) ?></p>
  </div>
  <div class="story">
    <h3>Teknik Parametreler & Teori:</h3>
    <p><?= e($artwork['technicalDetailsTr']) ?></p>
  </div>
  <h3>Yapay Zeka Gerçek Piksel Renk Paleti:</h3>
  <div class="palette">
    <?php foreach ($artwork['colorPalette'] as $c): ?>
      <div class="color-box" style="background-color: <?= e($c['hex']) ?>;">
        <?= e($c['hex']) ?><br><?= (int)$c['percentage'] ?>%<br><?= e($c['name']) ?>
      </div>
    <?php endforeach; ?>
  </div>
</body>
</html>

