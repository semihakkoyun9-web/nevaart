<?php
/**
 * NEVAART - Çift Katmanlı Veritabanı ve Veri Yöneticisi (PDO MySQL + JSON Senkronizasyonu)
 * Kriter H (Veritabanı bağlantısı), Kriter N (JSON veri formatı), Kriter S (SQL Injection koruması - PDO Prepare)
 */

require_once __DIR__ . '/../data/mock_artworks.php';

class NevaArtDatabase {
    private ?PDO $pdo = null;
    private string $storageFile;
    private array $state = [];

    public function __construct() {
        $this->storageFile = __DIR__ . '/../database/storage.json';
        $this->connectPdo();
        $this->loadState();
    }

    /**
     * XAMPP MySQL / MariaDB (Port 3306) PDO Bağlantısı
     * 'nevaart' veya 'nevaart_db' veritabanlarını otomatik tespit eder
     */
    private function connectPdo(): void {
        $host = '127.0.0.1';
        $user = 'root';
        $pass = '';
        $possibleDbs = ['nevaart', 'nevaart_db'];

        foreach ($possibleDbs as $db) {
            try {
                $dsn = "mysql:host={$host};dbname={$db};charset=utf8mb4";
                $pdo = new PDO($dsn, $user, $pass, [
                    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
                    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                    PDO::ATTR_EMULATE_PREPARES   => false,
                    PDO::ATTR_TIMEOUT            => 1,
                ]);
                $this->pdo = $pdo;
                return;
            } catch (Throwable $e) {
                // Sonraki veritabanı adını dene
            }
        }
        $this->pdo = null;
    }

    private function loadState(): void {
        global $initialArtworks, $initialCategories, $initialReviews, $exhibitionVenues;

        if (file_exists($this->storageFile)) {
            $raw = file_get_contents($this->storageFile);
            $decoded = json_decode($raw ?: '', true);
            if (is_array($decoded) && !empty($decoded['artworks'])) {
                $this->state = $decoded;
                return;
            }
        }

        $this->state = [
            'artworks' => $initialArtworks,
            'categories' => $initialCategories,
            'reviews' => $initialReviews,
            'venues' => $exhibitionVenues,
            'inquiries' => [],
            'subscribers' => []
        ];
        $this->saveState();
    }

    private function saveState(): void {
        $dir = dirname($this->storageFile);
        if (!is_dir($dir)) {
            mkdir($dir, 0775, true);
        }
        file_put_contents(
            $this->storageFile,
            json_encode($this->state, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES)
        );
    }

    public function isPdoConnected(): bool {
        return $this->pdo !== null;
    }

    public function getArtworks(): array {
        return $this->state['artworks'];
    }

    public function getCategories(): array {
        return $this->state['categories'];
    }

    public function getReviews(): array {
        return $this->state['reviews'];
    }

    public function getVenues(): array {
        return $this->state['venues'];
    }

    public function likeArtwork(int $id): ?array {
        if ($this->pdo) {
            try {
                $stmt = $this->pdo->prepare('UPDATE artworks SET likes = likes + 1 WHERE id = :id');
                $stmt->execute([':id' => $id]);
            } catch (Throwable $e) {}
        }

        foreach ($this->state['artworks'] as &$art) {
            if ((int)$art['id'] === $id) {
                $art['likes'] = ((int)$art['likes']) + 1;
                $this->saveState();
                return $art;
            }
        }
        return null;
    }

    public function addArtwork(array $newArtwork): array {
        if ($this->pdo) {
            try {
                $stmt = $this->pdo->prepare(
                    'INSERT INTO artworks (slug, accession_number, title, artist, category, prod_year, medium_tr, dimensions, story_tr, technical_tr, image_url, color_palette_json, is_curator_pick)
                     VALUES (:slug, :acc, :title, :artist, :cat, :yr, :med, :dim, :story, :tech, :img, :pal, :pick)'
                );
                $stmt->execute([
                    ':slug'  => $newArtwork['slug'],
                    ':acc'   => $newArtwork['accessionNumber'],
                    ':title' => $newArtwork['title'],
                    ':artist'=> $newArtwork['artist'],
                    ':cat'   => $newArtwork['category'],
                    ':yr'    => $newArtwork['year'],
                    ':med'   => $newArtwork['mediumTr'],
                    ':dim'   => $newArtwork['dimensions'],
                    ':story' => $newArtwork['storyTr'],
                    ':tech'  => $newArtwork['technicalDetailsTr'],
                    ':img'   => $newArtwork['imageUrl'],
                    ':pal'   => json_encode($newArtwork['colorPalette'], JSON_UNESCAPED_UNICODE),
                    ':pick'  => $newArtwork['isCuratorPick'] ? 1 : 0
                ]);
            } catch (Throwable $e) {}
        }

        array_unshift($this->state['artworks'], $newArtwork);
        $this->saveState();
        return $newArtwork;
    }

    public function deleteArtwork(int $id): bool {
        if ($this->pdo) {
            try {
                $stmt = $this->pdo->prepare('DELETE FROM artworks WHERE id = :id');
                $stmt->execute([':id' => $id]);
            } catch (Throwable $e) {}
        }

        $initCount = count($this->state['artworks']);
        $this->state['artworks'] = array_values(array_filter($this->state['artworks'], fn($a) => (int)$a['id'] !== $id));
        $this->saveState();
        return count($this->state['artworks']) < $initCount;
    }

    public function addReview(int $artworkId, string $userName, string $userRole, int $rating, string $comment): array {
        $newReview = [
            'id' => (int)(microtime(true) * 1000),
            'artworkId' => $artworkId,
            'userName' => $userName,
            'userRole' => $userRole,
            'rating' => max(1, min(5, $rating)),
            'comment' => $comment,
            'date' => date('Y-m-d')
        ];

        if ($this->pdo) {
            try {
                $stmt = $this->pdo->prepare(
                    'INSERT INTO curator_reviews (artwork_id, user_name, user_role, rating, comment, review_date)
                     VALUES (:aid, :uname, :urole, :rating, :comment, :rdate)'
                );
                $stmt->execute([
                    ':aid'     => $artworkId,
                    ':uname'   => $userName,
                    ':urole'   => $userRole,
                    ':rating'  => $newReview['rating'],
                    ':comment' => $comment,
                    ':rdate'   => $newReview['date']
                ]);
            } catch (Throwable $e) {}
        }

        $this->state['reviews'][] = $newReview;
        $this->saveState();
        return $newReview;
    }

    public function addInquiry(array $inquiry): array {
        $record = array_merge($inquiry, [
            'id' => count($this->state['inquiries']) + 1,
            'createdAt' => date('Y-m-d H:i:s')
        ]);

        if ($this->pdo) {
            try {
                $stmt = $this->pdo->prepare(
                    'INSERT INTO artist_inquiries (artwork_id, inquiry_type, sender_name, sender_email, message, reference_no, created_at)
                     VALUES (:aid, :itype, :sname, :semail, :msg, :ref, :cat)'
                );
                $stmt->execute([
                    ':aid'    => $record['artworkId'],
                    ':itype'  => $record['inquiryType'],
                    ':sname'  => $record['senderName'],
                    ':semail' => $record['senderEmail'],
                    ':msg'    => $record['message'],
                    ':ref'    => $record['referenceNo'],
                    ':cat'    => $record['createdAt']
                ]);
            } catch (Throwable $e) {}
        }

        $this->state['inquiries'][] = $record;
        $this->saveState();
        return $record;
    }

    public function addSubscriber(string $email): bool {
        if ($this->pdo) {
            try {
                $stmt = $this->pdo->prepare('INSERT IGNORE INTO newsletter_subscribers (email, subscribed_at) VALUES (:email, :dt)');
                $stmt->execute([':email' => $email, ':dt' => date('Y-m-d H:i:s')]);
            } catch (Throwable $e) {}
        }

        if (!in_array($email, $this->state['subscribers'], true)) {
            $this->state['subscribers'][] = $email;
            $this->saveState();
        }
        return true;
    }
}

$db = new NevaArtDatabase();

