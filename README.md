# ⚔️ Run and Don't Die

> *Hayatta kal... ya da öl. Büyücü, Ninja ya da Kral — seçim senin.*

🧭 **Tür**: 2D Top-Down Hayatta Kalma / Aksiyon  
🎮 **Motor**: HTML5 Canvas + Vanilla JavaScript (harici kütüphane yok)  
🎨 **Tema**: Karakter seçimli, sonsuz dalga tabanlı hayatta kalma  

🔗 **Canlı Oyna**: [https://mtugrul0.github.io/run-and-dont-die/](https://mtugrul0.github.io/run-and-dont-die/)  
📂 **GitHub Repo**: [https://github.com/mtugrul0/run-and-dont-die](https://github.com/mtugrul0/run-and-dont-die)

---

## 📌 Hedeflenen Oyun

Bu proje, [**Wizard of Chaos**](https://cakestorm.itch.io/wizard-of-chaos) adlı oyundan ilham alınarak geliştirilmiştir.

- 🎯 **Oyun Bağlantısı**: [Wizard of Chaos — itch.io](https://cakestorm.itch.io/wizard-of-chaos)
- 🏆 **Jam Bağlantısı**: [Wowie Jam 3.0](https://itch.io/jam/wowie-jam-3) — Tema: *"Failure is Progress"*

**Wizard of Chaos**, oyuncunun büyücü olarak giderek güçlenen düşman dalgalarını savuşturduğu, ölse bile güçlenerek geri döndüğü bir top-down aksiyon oyunudur. Biz bu mekaniklerin temelini — karakter seçimi, drone sistemi, yükseltme kartları ve sonsuz dalga sistemi — kendi projemize uyarladık.

---

## 🔥 Genel Bakış

**Run and Don't Die**, oyuncunun üç farklı sınıftan birini seçerek giderek zorlaşan düşman dalgalarına karşı hayatta kalmaya çalıştığı bir 2D top-down survival oyunudur. Oyun tamamen vanilla JavaScript ve HTML5 Canvas kullanılarak, herhangi bir harici kütüphane olmadan geliştirilmiştir.

### ✨ Temel Özellikler

- 🎭 **3 Oynanabilir Karakter Sınıfı**: Ninja, Wizard ve King — her birinin kendine özgü statları, silahları ve animasyonları
- 🤖 **Drone Sistemi**: 3 farklı modda çalışan drone (İyileştirme / XP Toplama / Saldırı)
- 🃏 **Yükseltme Kartları**: Seviye atladığınızda rastgele yükseltme kartları arasından seçim
- 🗺️ **Dinamik Harita**: Tile tabanlı zemin, kamera takibi ve minimap
- ⚔️ **Yakın & Uzak Menzil Savaş**: Melee saldırılar + yerden toplanabilen 3 farklı silah (Pompalı, Taramalı, Sniper)
- 🟢 **Bölge Sistemi**: Oyun sırasında beliren can yenileme ve güç artırma bölgeleri
- 💎 **XP ve Seviye Sistemi**: Düşmanlardan düşen XP küreleri, manyetik çekim mekaniği
- 👹 **4 Düşman Türü**: Flying Eye, Goblin, Mushroom ve Skeleton — her biri farklı stat ve animasyonlara sahip
- 🎵 **Dinamik Ses Sistemi**: Karaktere göre değişen arka plan müziği + SFX efektleri
- 🖼️ **Sprite Tabanlı Animasyonlar**: Tüm karakterler ve düşmanlar için frame-by-frame sprite animasyonları

---

## 🕹️ Nasıl Oynanır?

| Tuş / Girdi | İşlev |
|---|---|
| `W A S D` | Karakteri hareket ettir |
| `Fare Sol Tık` | Saldırı (basılı tutarak sürekli saldırı) |
| `Q` | Drone modunu değiştir (İyileştirme → Toplama → Saldırı) |
| `Kaydırma Tekerleği` | Envanter slotları arasında geçiş |
| `Fare` | Menüde seçim yap |

> 🎮 Oyuna karakter seçerek başlarsınız. Düşmanlar giderek güçlenen dalgalar halinde gelir. Seviye atladığınızda yükseltme kartlarından birini seçerek güçlenirsiniz. Haritada beliren yeşil bölgeler can yeniler, mor bölgeler güç artırır. Yerden silah toplayarak uzak menzil saldırı yapabilirsiniz.

---

## 🎭 Karakter Sınıfları

| Sınıf | Can | Hız | Hasar | Başlangıç Silahı | Özellik |
|---|---|---|---|---|---|
| 🥷 **Ninja** | 3 | 4.5 | 15 | Katana | Hızlı ama kırılgan, geniş saldırı yelpazesi |
| 🧙 **Wizard** | 4 | 4.0 | 10 | Asa | Dengeli, dar ama uzun menzilli saldırı |
| 👑 **King** | 5 | 3.5 | 25 | Kılıç | Dayanıklı ve güçlü, yavaş ama yıkıcı |

---

## 🏗️ Proje Yapısı

```
run-and-dont-die/
├── index.html                      # Tek sayfa giriş noktası
├── README.md                       # Bu dosya
├── AI.md                           # Yapay zeka kullanım günlüğü
├── TASKS.md                        # Görev dağılımı ve takibi
│
├── js/
│   ├── main.js                     # Giriş noktası — oyun döngüsü ve modül bağlantısı
│   ├── config.js                   # Tüm sabit değerler, sınıf istatistikleri, sprite verileri
│   ├── input.js                    # Klavye + fare + tekerlek girdi yönetimi
│   │
│   ├── entities/                   # Oyun varlıkları
│   │   ├── Player.js               # Oyuncu — hareket, saldırı, XP, seviye, hasar
│   │   ├── Drone.js                # Drone — 3 mod: iyileştirme / XP toplama / saldırı
│   │   ├── Enemy.js                # Düşman — takip, saldırı, can çubuğu, sprite animasyon
│   │   ├── Projectile.js           # Mermi — hız tabanlı hareket
│   │   ├── ExperienceOrb.js        # XP küresi — manyetik çekim
│   │   ├── Zone.js                 # Bölge — iyileştirme ve güçlendirme
│   │   └── WeaponDrop.js           # Silah düşüşü — 3 silah türü
│   │
│   ├── systems/                    # Oyun sistemleri
│   │   ├── SpawnSystem.js          # Düşman ve eşya doğma sistemi
│   │   ├── UpgradeSystem.js        # Yükseltme kartı sistemi
│   │   └── CollisionSystem.js      # Çarpışma algılama ve işleme
│   │
│   ├── renderer/                   # Görüntüleme
│   │   ├── Camera.js               # Kamera takibi
│   │   ├── MapRenderer.js          # Harita çizimi (tile tabanlı zemin)
│   │   └── UIRenderer.js           # HUD — can, XP, minimap, envanter
│   │
│   ├── screens/                    # Ekranlar
│   │   ├── Menu.js                 # Ana menü — karakter seçimi, nasıl oynanır
│   │   ├── CharacterSelectScreen.js
│   │   └── GameOverScreen.js       # Oyun sonu — skor ve süre
│   │
│   └── assets/                     # Varlık yönetimi
│       ├── AssetLoader.js          # Görsel/ses yükleme (Promise tabanlı)
│       └── AudioManager.js         # BGM ve SFX yönetimi
│
├── assets/
│   ├── images/
│   │   ├── player/                 # Karakter sprite'ları (ninja, wizard, king)
│   │   ├── enemies/                # Düşman sprite'ları (flying_eye, goblin, mushroom, skeleton)
│   │   ├── items/                  # Silah ikonları
│   │   └── ui/                     # Zemin texture
│   └── audio/
│       ├── bgm/                    # Arka plan müzikleri (menü, karakter bazlı, ölüm)
│       └── sfx/                    # Ses efektleri (saldırı, ölüm, seviye atla, silah)
│
└── legacy/                         # Eski monolitik kod (referans)
    └── game.js.bak
```

---

## 💡 Teknik Detaylar

- **Saf JavaScript**: Hiçbir harici JS kütüphanesi veya framework kullanılmamıştır
- **ES Module Sistemi**: Tüm dosyalar `import` / `export` ile modüler olarak yapılandırılmıştır
- **HTML5 Canvas**: Tüm görsel render işlemleri `<canvas>` üzerinde yapılmaktadır
- **Sprite Sheet Animasyon**: Karakter ve düşman animasyonları frame-by-frame sprite sheet'lerden çizilmektedir
- **Promise Tabanlı Asset Yükleme**: Tüm görseller ve sesler `AssetLoader` ile asenkron olarak önceden yüklenir
- **Kamera Sistemi**: Oyuncu takipli smooth kamera hareketi ile 3000×3000 piksellik haritada keşif
- **Collision Detection**: Çember tabanlı çarpışma algılama sistemi (projectile-enemy, player-orb, enemy-player)
- **Spawn System**: Zamana bağlı artan zorluk ile düşman dalgaları ve rastgele eşya doğma
- **Tarayıcı Uyumluluğu**: Chrome ve Firefox'ta sorunsuz çalışır

---

## 🚀 Kurulum ve Çalıştırma

1. Repoyu klonlayın:
   ```bash
   git clone https://github.com/mtugrul0/run-and-dont-die.git
   ```

2. Proje dizinine gidin:
   ```bash
   cd run-and-dont-die
   ```

3. `index.html` dosyasını bir tarayıcıda açın:
   - **Önerilen**: VS Code Live Server eklentisi veya herhangi bir local HTTP server kullanın
   - ES Module kullanıldığı için dosyayı doğrudan açmak yerine bir HTTP server üzerinden sunulmalıdır
   ```bash
   # Python ile basit HTTP server
   python -m http.server 8000

   # veya Node.js ile
   npx serve .
   ```

4. Tarayıcıda `http://localhost:8000` adresine gidin

> ⚠️ **Not**: ES Module (`import`/`export`) kullanıldığı için `file://` protokolü ile açılamaz. Mutlaka bir HTTP server üzerinden çalıştırın.

---

## 🎨 Kullanılan Assetler

### 📦 Grafikler (Sprite'lar)

| Asset | Kaynak |
|---|---|
| Ninja Karakter Sprite'ları | [CraftPix — Free Ninja Sprite Sheets](https://craftpix.net/) |
| Wizard Karakter Sprite'ları | [CraftPix — Free Wizard Sprite Sheets](https://craftpix.net/) |
| King Karakter Sprite'ları | [CraftPix — Free King Sprite Sheets](https://craftpix.net/) |
| Flying Eye Düşman Sprite'ları | [CraftPix — Free Monster Sprite Sheets](https://craftpix.net/) |
| Goblin Düşman Sprite'ları | [CraftPix — Free Monster Sprite Sheets](https://craftpix.net/) |
| Mushroom Düşman Sprite'ları | [CraftPix — Free Monster Sprite Sheets](https://craftpix.net/) |
| Skeleton Düşman Sprite'ları | [CraftPix — Free Monster Sprite Sheets](https://craftpix.net/) |
| Silah İkonları (Pompalı, Taramalı, Sniper) | Projeye özel tasarım |
| Zemin Texture (taş zemin) | Google Gemini ile üretildi (prompt: *"top-down dark stone floor texture, pixel art style, seamless, dungeon"*) |

### 🔊 Sesler

| Asset | Kaynak |
|---|---|
| Menü Arka Plan Müziği | Google Gemini ile oluşturulan promptlarla seçildi |
| Ninja Oyun Müziği | Google Gemini ile oluşturulan promptlarla seçildi |
| Wizard Oyun Müziği | Google Gemini ile oluşturulan promptlarla seçildi |
| King Oyun Müziği | Google Gemini ile oluşturulan promptlarla seçildi |
| Ölüm Müziği | Google Gemini ile oluşturulan promptlarla seçildi |
| Saldırı SFX (Ninja, Wizard, King) | [Pixabay Sound Effects](https://pixabay.com/sound-effects/) |
| Ölüm SFX | [Pixabay Sound Effects](https://pixabay.com/sound-effects/) |
| Seviye Atlama SFX | [Pixabay Sound Effects](https://pixabay.com/sound-effects/) |
| Silah SFX | [Pixabay Sound Effects](https://pixabay.com/sound-effects/) |

---

## 🤖 Yapay Zeka Kullanımı

Bu projede yapay zeka araçları mimari planlama, asset üretimi ve teknik danışmanlık amacıyla kullanılmıştır. Tüm prompt ve cevap detayları **[AI.md](AI.md)** dosyasında kayıt altındadır.

Kullanılan araçlar: **Claude (Opus 4.6)**, **Google Gemini**, **ChatGPT**, **Antigravity Agent**

---

## 👥 Grup Üyeleri

| Üye | Öğrenci No | Sorumluluklar |
|---|---|---|
| **Mustafa Tuğrul Aydoğan** | 23360859010 | Çekirdek Sistemler & Oynanış — `Player.js`, `Drone.js`, `Enemy.js`, `Projectile.js`, `ExperienceOrb.js`, `CollisionSystem.js`, `SpawnSystem.js`, `Camera.js`, `config.js`, `input.js`, `main.js`, Karakter seçim ekranı, Game Over ekranı |
| **Muhammed Ali Boz** | 24360859078 | Görüntüleme, Assetler & Cilalama — `MapRenderer.js`, `UIRenderer.js`, `UpgradeSystem.js`, `AssetLoader.js`, `AudioManager.js`, `Menu.js`, Sprite entegrasyonu, Minimap, Asset temin ve kredi belgeleme |

---

## 📊 Sunum

- **Grup Üyeleri**: Mustafa Tuğrul Aydoğan (23360859010), Muhammed Ali Boz (24360859078)
- **Hedeflenen Oyun**: [Wizard of Chaos](https://cakestorm.itch.io/wizard-of-chaos) — Top-down survival aksiyon, büyü atma ve düşman dalgaları
- **Jam Bağlantısı**: [Wowie Jam 3.0](https://itch.io/jam/wowie-jam-3)
- **Canlı Proje**: [https://mtugrul0.github.io/run-and-dont-die/](https://mtugrul0.github.io/run-and-dont-die/)
- **GitHub Repo**: [https://github.com/mtugrul0/run-and-dont-die](https://github.com/mtugrul0/run-and-dont-die)

### Temel Mekanikler
1. **Karakter Seçim Sistemi** — 3 sınıf, her biri farklı stat dağılımı ve başlangıç silahıyla
2. **Sonsuz Dalga Sistemi** — Zamanla güçlenen 4 farklı düşman türü
3. **Drone Sistemi** — Oyuncuyu takip eden, 3 farklı modda çalışan yardımcı
4. **Yükseltme Kart Sistemi** — Seviye atladıkça rastgele gelen güçlendirmeler
5. **Bölge Mekanikleri** — Haritada beliren iyileştirme/güçlendirme bölgeleri
6. **Silah Toplama** — Yerden alınan 3 farklı uzak menzil silah

---

## 📜 Lisans

Bu proje, Kocaeli Üniversitesi Bilgisayar Mühendisliği Bölümü Web Programlama dersi kapsamında geliştirilmiştir.
