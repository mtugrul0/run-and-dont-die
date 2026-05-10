# 📋 Görev Dağılımı — Run and Don't Die

Bu dosya, iki öğrenci arasındaki görev dağılımını GitHub Issue tarzı checklist formatında tanımlar.

> **Kural:** Bir görev "Depends on" ile bağımlılık belirtiyorsa, o bağımlılık tamamlanmadan başlanmamalıdır.

---

## ☀️ Soleil — Core Systems & Gameplay

### A1. Config ve Input Modüllerini Migre Et
**Assignee:** Soleil  
**Depends on:** —

- [x] `js/config.js` — game.js'den tüm sabitleri (MAP_WIDTH, MAP_HEIGHT, CLASS_STATS, XP_COLLECT_RADIUS) ES module export olarak taşı
- [x] `js/config.js` — UPGRADE_POOL dizisini buraya taşı (apply fonksiyonları sonra bağlanacak)
- [x] `js/config.js` — WEAPON_TYPES dizisini oluştur (`['pompali', 'taramali', 'sniper']`)
- [x] `js/input.js` — InputManager sınıfı/objesi oluştur: keys state, mouse state, event listener'ları kaydet
- [x] `js/input.js` — Drone mod değiştirme (Q tuşu) için callback mekanizması ekle
- [x] `js/input.js` — Scroll wheel handler'ı taşı (slot değiştirme callback'i ile)
- [x] Her iki dosyayı test et: console.log ile sabitlerin doğru export edildiğini doğrula

---

### A2. Entity Sınıflarını Migre Et
**Assignee:** Soleil  
**Depends on:** A1

- [x] `js/entities/Player.js` — Player class'ını game.js:53-208'den taşı, ES module export ekle
- [x] Player.js — ctx/camera/enemies/projectiles bağımlılıklarını constructor parametre veya GameState injection ile çöz
- [x] Player.js — gainXp() içindeki triggerUpgradeCards() çağrısını callback olarak al
- [x] Player.js — takeDamage() içindeki isPaused doğrudan atamasını callback ile değiştir
- [x] `js/entities/Drone.js` — Drone class'ını game.js:211-266'dan taşı
- [x] Drone.js — orbs[], enemies[] referanslarını GameState injection ile çöz
- [x] `js/entities/Enemy.js` — Enemy class'ını game.js:361-406'dan taşı
- [x] Enemy.js — player referansını injection ile çöz
- [x] `js/entities/Projectile.js` — Projectile class'ını game.js:269-286'dan taşı
- [x] `js/entities/ExperienceOrb.js` — ExperienceOrb class'ını game.js:408-434'ten taşı
- [x] `js/entities/Zone.js` — Zone class'ını game.js:288-319'dan taşı
- [x] `js/entities/WeaponDrop.js` — WeaponDrop class'ını game.js:322-358'den taşı
- [x] Tüm entity'lerin bağımsız olarak import edilebildiğini test et

---

### A3. CollisionSystem'ı Migre Et
**Assignee:** Soleil  
**Depends on:** A2

- [ ] `js/systems/CollisionSystem.js` — handleEnemyDeath() helper'ını taşı (game.js:636-639)
- [ ] Projectile ↔ Enemy çarpışma kontrolünü taşı (game.js:722-740)
- [ ] Player ↔ ExperienceOrb toplama kontrolünü taşı (game.js:742-758)
- [ ] Drone ↔ ExperienceOrb toplama kontrolünü taşı (game.js:747-752)
- [ ] Player ↔ WeaponDrop toplama kontrolünü taşı (game.js:702-716)
- [ ] Player ↔ Zone (mad buff) kontrolünü taşı (game.js:688-700)
- [ ] Enemy ↔ Zone (safe repel) kontrolünü taşı (game.js:761-774)
- [ ] `update(gameState)` fonksiyonu olarak dışa aktar
- [ ] Tüm çarpışma senaryolarını oyun içinde test et

---

### A4. SpawnSystem'ı Migre Et
**Assignee:** Soleil  
**Depends on:** A2

- [ ] `js/systems/SpawnSystem.js` — Düşman spawn logic'ini taşı (game.js:641-656, setInterval 1000ms)
- [ ] Item spawn logic'ini taşı (game.js:658-675, rAF loop, luck-scaled cooldown)
- [ ] isPaused kontrolünü GameState'den al
- [ ] Spawn edilen nesneleri doğru dizilere push ettiğini doğrula
- [ ] start() / stop() metodları ekle

---

### A5. Camera'yı Migre Et
**Assignee:** Soleil  
**Depends on:** A1

- [ ] `js/renderer/Camera.js` — camera objesini (game.js:13) class olarak oluştur
- [ ] follow(target, canvasWidth, canvasHeight) metodu ekle (game.js:121-122 logic)
- [ ] Player.update()'ten camera mutation'ı kaldır, Camera.follow() kullan

---

### A6. main.js — Her Şeyi Birleştir
**Assignee:** Soleil  
**Depends on:** A1, A2, A3, A4, A5, B1, B2

- [ ] `js/main.js` — Canvas/ctx oluştur + resize listener ekle (game.js:1-8)
- [ ] GameState objesi oluştur: player, drone, enemies[], orbs[], zones[], weaponDrops[], projectiles[], isPaused
- [ ] Tüm modülleri import et
- [ ] Player, Drone nesnelerini oluştur
- [ ] InputManager'ı başlat ve callback'leri bağla
- [ ] SpawnSystem'ı başlat
- [ ] animate() ana döngüsünü yaz (game.js:677-780 sırasıyla):
  1. drawMap()
  2. CollisionSystem.update() — zone + weapon + projectile + orb + enemy interactions
  3. player.update()
  4. drone.update()
  5. drawUI()
- [ ] isPaused durumunda drawCards() çağır
- [ ] Oyunu başlat: animate() ve spawnItems() çağır
- [ ] Oyunun monolith ile aynı davrandığını uçtan uca test et

---

### A7. Karakter Seçim Ekranı (Yeni Özellik)
**Assignee:** Soleil  
**Depends on:** A6

- [ ] Oyun başlamadan önce bir seçim ekranı göster
- [ ] 3 buton: Ninja / Yeniçeri / Kovboy — her birinin statlarını göster
- [ ] Seçime göre `SELECTED_CLASS` belirle ve Player'ı o class ile oluştur
- [ ] Seçim ekranını Canvas üzerine çiz (DOM elementi değil)
- [ ] Seçim yapılmadan oyun döngüsü başlamamalı

---

### A8. Game Over Ekranı (Yeni Özellik)
**Assignee:** Soleil  
**Depends on:** A6

- [ ] Mevcut "ÖLDÜN!" mesajını geliştir
- [ ] Skor göster: hayatta kalınan süre (saniye) + öldürülen düşman sayısı
- [ ] "Tekrar Oyna" butonu ekle (sayfa yenilemeden yeniden başlat)
- [ ] Skoru hesaplamak için gameStartTime ve killCount sayaçları ekle
- [ ] Game Over ekranını Canvas üzerine çiz

---

## 🔵 Froid — Rendering, Assets & Polish

### B1. MapRenderer'ı Migre Et
**Assignee:** Froid  
**Depends on:** A1 (config.js gerekli)

- [x] `js/renderer/MapRenderer.js` — drawMap() fonksiyonunu taşı (game.js:502-549)
- [x] Fonksiyon parametreleri: `(ctx, camera, canvas, MAP_WIDTH, MAP_HEIGHT)`
- [x] ES module export olarak dışa aktar
- [x] Grid çizgileri, sınır duvarları, uyarı overlay doğru çalışıyor mu test et

---

### B2. UIRenderer'ı Migre Et
**Assignee:** Froid  
**Depends on:** A1 (config.js gerekli)

- [x] `js/renderer/UIRenderer.js` — drawUI() fonksiyonunu taşı (game.js:551-625)
- [x] Fonksiyon parametreleri: `(ctx, canvas, player, drone, enemies)`
- [x] Can barı, XP barı, seviye, drone modu, envanter, düşman sayısı, mad buff — tümünü test et
- [x] ES module export olarak dışa aktar

---

### B3. UpgradeSystem'ı Migre Et
**Assignee:** Froid  
**Depends on:** A1 (UPGRADE_POOL config'de)

- [x] `js/systems/UpgradeSystem.js` — triggerUpgradeCards() taşı (game.js:448-458)
- [x] drawCards() taşı (game.js:460-488)
- [x] handleCardClick() taşı (game.js:490-500)
- [x] getXpRadius() helper'ını taşı (game.js:446)
- [x] UPGRADE_POOL.apply() içindeki player referanslarını injection ile çöz
- [x] Kart seçme + pause/unpause akışını test et

---

### B4. AssetLoader Implementasyonu (Yeni)
**Assignee:** Froid  
**Depends on:** —

- [ ] `js/assets/AssetLoader.js` — Asset manifest objesi oluştur (tüm resim/ses dosya yolları)
- [ ] loadImage(path) → Promise<HTMLImageElement> yardımcı fonksiyonu yaz
- [ ] loadAudio(path) → Promise<HTMLAudioElement> yardımcı fonksiyonu yaz
- [ ] loadAllAssets() → Promise<AssetMap> ana fonksiyonu yaz
- [ ] Yükleme sırasında loading ekranı göstermek için progress callback desteği ekle
- [ ] Export: loadAllAssets, assets (yüklenmiş referanslar)
- [ ] En az 1 test resmi ile çalıştığını doğrula

---

### B5. AudioManager Implementasyonu (Yeni)
**Assignee:** Froid  
**Depends on:** B4

- [ ] `js/assets/AudioManager.js` — AudioManager sınıfı oluştur
- [ ] playBGM(key) — arka plan müziğini döngüde çal
- [ ] stopBGM() — müziği durdur
- [ ] playSFX(key) — tek seferlik ses efekti çal (örtüşme destekli)
- [ ] setVolume(level) — ana ses seviyesi kontrolü
- [ ] mute() / unmute() — sessiz mod
- [ ] Tarayıcı autoplay policy'sine uyum: ilk kullanıcı etkileşiminde AudioContext resume
- [ ] Ses tetikleyicilerini tanımla: 'attack', 'hit', 'pickup', 'levelup', 'gameover'
- [ ] En az 1 test sesiyle çalıştığını doğrula

---

### B6. Sprite Entegrasyonu (Yeni)
**Assignee:** Froid  
**Depends on:** A6, B4

- [ ] Player sınıfları için sprite'lar hazırla/bul: ninja, yeniceri, kovboy (idle + hareket)
- [ ] Düşman sprite'ları hazırla/bul
- [ ] XP orb, silah drop, zone overlay görselleri hazırla/bul
- [ ] UI öğeleri: can barı çerçevesi, XP barı çerçevesi, kart çerçevesi
- [ ] Tüm dosyaları `assets/images/` alt klasörlerine yerleştir
- [ ] Entity draw() metodlarını güncelle: ctx.arc() yerine ctx.drawImage() kullan
- [ ] Player.js — sınıfa göre farklı sprite göster
- [ ] Her entity'nin hem sprite'lı hem sprite'sız (fallback) çalıştığını test et

---

### B7. Minimap Eklentisi (Yeni)
**Assignee:** Froid  
**Depends on:** B2, A6

- [ ] `js/renderer/UIRenderer.js` — drawMinimap() fonksiyonu ekle
- [ ] Ekranın sağ alt köşesinde küçük dikdörtgen (örn. 200×200px)
- [ ] Haritayı ölçeklendirilmiş olarak göster (MAP_WIDTH/HEIGHT → minimap boyutuna oran)
- [ ] Oyuncu noktası: beyaz veya sınıf renginde
- [ ] Düşman noktaları: kırmızı
- [ ] Zone'lar: yeşil (safe) / mor (mad) daireler
- [ ] Silah drop'ları: turuncu noktalar
- [ ] Minimap çerçevesi ve arka plan şeffaflığı ekle
- [ ] drawUI() içinde drawMinimap() çağır

---

### B8. Asset Kredileri ve README Güncelleme
**Assignee:** Froid  
**Depends on:** B6

- [ ] README.md'deki "Asset Kaynakları" tablosunu doldur
- [ ] Her asset için kaynak link ve lisans bilgisi ekle
- [ ] Kendi çizdiğin/oluşturduğun asset'ler için "Orijinal — Ekip tarafından" yaz
- [ ] AI ile oluşturulan asset varsa AI.md'ye kayıt ekle

---

## 📅 Önerilen Çalışma Sırası

```
1. Adım (İkisi Paralel):
├── Soleil: A1 → A2 → A5
└── Froid: B1 → B2 → B3, B4

2. Adım (Birleşme + Yeni Özellikler):
├── Soleil: A3 → A4 → A6 (birleştirme)
└── Froid: B5 → B6 (asset entegrasyonu)

3. Adım (Polish + Test):
├── Soleil: A7 → A8 (yeni ekranlar)
└── Froid: B7 → B8 (minimap + krediler)

Final: Uçtan uca test, bug fix, son commit
```

---

> 💡 **İpucu:** Her görev tamamlandığında commit atın ve TASKS.md'deki ilgili checkbox'ı `[x]` olarak işaretleyin.
