# 🤖 Yapay Zeka Kullanım Günlüğü

Bu dosya, proje süresince kullanılan yapay zeka araçlarının kayıtlarını içerir.  
Üniversite ödev kuralları gereği, her AI etkileşimi aşağıdaki tabloya eklenmelidir.

## Kullanım Tablosu

<details>
<summary>📅 02-05-2026 — Claude (Refaktör / Mimari)</summary>

<details>
<summary>🧠 Prompt</summary>

selamlar, bu web projemiz için yaptığımız oyun. oyunun genel şeması bu şekilde olacak sadece şu an asset ekleme müzik ekleme gibi cilalama işlemleri kaldı. bu monolitik yapıdan çıkıp esnek bir yapı kurmalıyım. githuba da yükleyeceğim için standartlara uygun olmalı. bu proje iki kişi tarafından yapılacak ona göre bir iş bölümü de olmalı. bunun için antigravity agentıma prompt verir misin? bize kod vermesin sadece iskelet ve yapılacaklar listesi çıkartsın, klasör sistemini ayarlasın yeterli. sana attığım kod aşağıdaki kural setine uyuyor. senin verdiğin prompt da bu kural listesine uygun olmalı:

Seçtiğiniz oyunun temel mekaniklerini HTML5 ve JS ile "canvas" kullanarak kodlamalısınız. "Jam" yarışmaları, kısıtlı süre içerisinde özgün oyun mekaniklerinin kodlandığı etkinliklerdir. Yarışma sonunda oyunlar özgünlüğüne ve sunduğu deneyime göre puanlanmaktadır. Bu proje kapsamında, seçilen oyunu aynen klonlamanız beklenmemektedir. Hedeflediğiniz oyunun benzersiz olan temel mekaniğini kodlamanız ve kendi projenize uyarlamanız beklenmektedir. Seçtiğiniz oyun 2 veya 3 boyutlu olabilir fakat geliştirdiğiniz oyun 2 boyutlu olmalıdır. Sadece oynanış mekanizmasının temelini kodlamanız gerekmektedir. Oyununuz için gerekli varlıkları (asset) kendiniz hazırlayabilirsiniz veya internetten edinebilirsiniz. Kendinize ait olmayan tüm assetlerin kaynaklarını Github reponuzun Readme.md dosyasının en altında belirtmelisiniz. Seçtiğiniz oyunun ismini ve bağlantısını Readme.md dosyasına koymalısınız. Aşağıdaki maddeler oyununuzun puanlanmasında etkilidir:

- Oyun sahnesinin zenginliği  
- Oyun mekaniklerinin karmaşıklığı  
- Oyunda kullanılacak nesnelerin sayısı  
- Kontrol etme biçimleri (klavye, fare) düzgün çalışması  
- Oyunun Chrome ve Firefox tarayıcılarında düzgün çalışması  

Projenizi geliştirirken yapay zeka araçlarına sorularınızı yöneltebilirsiniz. Yararlandığınız yapay zeka araçlarını ve kullanım biçiminizi bildirmelisiniz. Kullandığınız "prompt"ların ve aldığınız cevapların tümünü, reponuzda "AI.md" isminde bir markdown dosyası oluşturup içerisine yerleştirmelisiniz. Tamamen yapay zekaya yaptırılmış projeler (koda hakim olduğunuzu düşünseniz dahi) geçersiz sayılacaktır. Oyun kodları hiçbir projede birbirinin aynısı olmayacaktır. Kodlarınızın hepsi "kod intihal tespit" yazılımı ile kontrol edilecektir. İntihal tespit sürecinde önceki senelere ait gönderimlerden oluşan veri seti de dahil edilmektedir. Bu yazılım internetten birebir alıntıları da tespit edebilmektedir. Projenizde hiçbir şekilde hazır bir JS oyun kütüphanesi kullanılmayacaktır. Projeniz sadece 1 tane HTML sayfada olacaktır. Fakat gerekiyorsa kendi JS kütüphanelerinizi birden fazla oluşturabilirsiniz.

</details>

<details>
<summary>🤖 Cevap</summary>

Kodu tam olarak gördüm. Şimdi Antigravity agent'ın için kapsamlı bir prompt yazıyorum.

Antigravity Agent Prompt
------------------------

```
You are a senior software architect. Your task is NOT to write game logic code. Your ONLY tasks are:
1. Create the folder/file skeleton for the project
2. Add a TODO comment at the top of each file describing what belongs there
3. Create a detailed README.md and a task breakdown document

---

 PROJECT CONTEXT

This is a 2D top-down browser game called "Wizard of Chaos", built with vanilla HTML5 Canvas and JavaScript (no game libraries allowed). The current codebase is a single monolithic game.js (780 lines) and an index.html. It works correctly — do NOT rewrite any logic.

The project will be submitted as a university game-jam assignment. Two students will collaborate on GitHub.

---

 CURRENT ARCHITECTURE (what exists in the monolith)

The single game.js contains these logical sections in order:

1. CONFIG — MAPWIDTH, MAPHEIGHT, camera, isPaused, XPCOLLECTRADIUS, CLASSSTATS constants
2. INPUT — keyboard (WASD), mouse (click, move, wheel), contextmenu suppression
3. CLASSES
   - Player — movement, attack (melee fan + ranged projectile), XP gain, level-up trigger, takeDamage
   - Drone — 3 modes: heal / collect-XP / attack; follows owner with lerp
   - Projectile — velocity-based movement, drawn as cyan circle
   - Zone — safe (repels enemies) and mad (buffs player); timer-based lifetime
   - WeaponDrop — timed pickup; 3 ranged weapon types (pompali, taramali, sniper)
   - Enemy — tracks player, melee damage on contact, health bar
   - ExperienceOrb — magnetic pull toward player within XPCOLLECTRADIUS
4. UPGRADE CARD SYSTEM — UPGRADEPOOL array, triggerUpgradeCards(), drawCards(), handleCardClick()
5. MAP RENDERER — drawMap(): dark background, grid lines, red border walls with warning overlay
6. UI RENDERER — drawUI(): health bar, XP bar, level text, drone mode label, inventory slots, enemy count, mad-buff indicator
7. GAME OBJECTS — instantiation of player, drone, enemies[], orbs[], zones[], weaponDrops[], projectiles[]
8. SPAWN SYSTEMS — setInterval enemy spawner (1000ms), requestAnimationFrame item spawner
9. MAIN LOOP — animate(): map → zones → weaponDrops → player → drone → projectiles → orbs → enemies → UI

---

 TARGET FOLDER STRUCTURE

Create exactly this structure with empty files (or files containing only a top-of-file TODO comment):

run-and-dont-die/
├── index.html                  ← already exists, keep as-is
├── README.md                   ← you will write this
├── AI.md                       ← you will scaffold this
├── TASKS.md                    ← you will write this (see below)
│
├── js/
│   ├── main.js                 ← entry point: instantiate objects, start loops
│   ├── config.js               ← all constants (MAP_WIDTH, CLASS_STATS, UPGRADE_POOL, etc.)
│   ├── input.js                ← InputManager: keyboard + mouse + wheel state
│   │
│   ├── entities/
│   │   ├── Player.js
│   │   ├── Drone.js
│   │   ├── Enemy.js
│   │   ├── Projectile.js
│   │   ├── ExperienceOrb.js
│   │   ├── Zone.js
│   │   └── WeaponDrop.js
│   │
│   ├── systems/
│   │   ├── SpawnSystem.js      ← enemy + item spawners
│   │   ├── UpgradeSystem.js    ← card pool, triggerUpgradeCards, handleCardClick
│   │   └── CollisionSystem.js  ← projectile-enemy, player-orb, player-weapon pickup, enemy-player contact
│   │
│   ├── renderer/
│   │   ├── Camera.js           ← camera object + follow logic
│   │   ├── MapRenderer.js      ← drawMap()
│   │   └── UIRenderer.js       ← drawUI(), drawCards()
│   │
│   └── assets/
│       ├── AssetLoader.js      ← image/audio loading promises, export loaded assets
│       └── AudioManager.js     ← play/stop/loop sounds, volume control
│
└── assets/
    ├── images/
    │   ├── player/             ← player sprites per class (ninja, yeniceri, kovboy)
    │   ├── enemies/
    │   ├── items/              ← weapon drop icons, zone overlays
    │   └── ui/                 ← health/xp bar decorations, card frame
    └── audio/
        ├── bgm/                ← background music loops
        └── sfx/                ← attack, hit, pickup, level-up sound effects

Each JS file must start with a multi-line comment like:

/**
 * TODO: [FileName]
 * Responsibility: <one sentence>
 * Imports from: <list which other modules it will need>
 * Exports: <list class or function names>
 */
```

README.md REQUIREMENTS
----------------------

Write a complete README.md with these sections:

   Oyun Adı / Proje Başlığı: Wizard of Chaos
   İlham Alınan Oyun: Vampire Survivors — bağlantısıyla birlikte
   Nasıl Oynanır: WASD hareket, sol tık saldırı, scroll silah değiştir, Q drone modu
   Özellikler: karakter sınıfları, drone sistemi, kart yükseltme, zone sistemi, ranged/melee silahlar
   Teknik: vanilla JS, HTML5 Canvas, kütüphane yok
   Kurulum: clone + open index.html in browser
   Asset Kaynakları: empty section with placeholder <!-- eklenecek -->
   Yapay Zeka Kullanımı: AI.md'ye yönlendirme

AI.md REQUIREMENTS
------------------

Scaffold AI.md with:

   A header section explaining the file's purpose (per assignment rules)
   A table template with columns: Tarih | Araç | Prompt Özeti | Alınan Cevap Özeti | Kullanım Biçimi
   One example row filled in (describing the refactoring prompt that created this file structure)

TASKS.md REQUIREMENTS
---------------------

Write a task breakdown for TWO students (Student A and Student B).

Student A — Core Systems & Gameplay

   Migrate Player.js, Drone.js, Enemy.js, Projectile.js, ExperienceOrb.js from monolith
   Migrate CollisionSystem.js and SpawnSystem.js
   Migrate Camera.js and config.js and input.js
   Migrate main.js (wire everything together)
   Add character class selection screen before game starts (3 buttons: ninja / yeniceri / kovboy)
   Add a proper Game Over screen with score (time survived + enemies killed)

Student B — Rendering, Assets & Polish

   Migrate MapRenderer.js and UIRenderer.js from monolith
   Migrate UpgradeSystem.js (drawCards, handleCardClick, UPGRADE\POOL)
   Implement AssetLoader.js: load all images and return a promise
   Implement AudioManager.js: BGM loop + SFX triggers
   Replace all circle-based drawings with sprite images once assets are ready
   Add minimap to UIRenderer (small rectangle in corner showing player + enemy dots)
   Create or source all assets and fill in README asset credits

For each task, write it as a GitHub Issue-style checklist:

     [Task Title]
    Assignee: Student A / Student B
    Depends on: (other tasks if any)
    - [ ] subtask 1
    - [ ] subtask 2

IMPORTANT CONSTRAINTS
---------------------

   Do NOT rewrite any game logic. Only create file skeletons.
   index.html must be updated to load JS modules: change `<script src="game.js">` to `<script type="module" src="js/main.js"></script>`
   All JS files must use ES module syntax (export / import), not global variables.
   The original game.js should be kept as game.js.bak or moved to a legacy/ folder — do not delete it.
   Chrome and Firefox compatibility: do not use features unavailable in those browsers.
   No external JS libraries of any kind.

---

Bu prompt'u Antigravity'e verdiğinde şunları üretecek: klasör iskeleti + her dosyada TODO yorumları, tam README.md, AI.md şablonu ve iki kişilik iş bölümü olan TASKS.md. Kod mantığına hiç dokunmayacak — mevcut game.js'i legacy/ klasörüne koyup referans olarak bırakacak.
Bir not: index.html'deki `<script src="game.js">` satırını `<script type="module" src="js/main.js"></script>` olarak değiştirmesi gerektiğini prompt'a ekledim çünkü ES module sistemi bunu zorunlu kılıyor. Migration aşamasında her entity dosyası monolitten kesilip yapıştırılarak taşınacak, bu yüzden refactor riski minimum.

</details>

</details>

<details>
<summary>📅 02-05-2026 — Antigravity • Mimari Kurulumu</summary>

<details>
<summary>🧠 Prompt</summary>

Yukarıda claude'a yazdırdığımız promptu antigravity'de claude opus 4.6'ya verdik

</details>

<details>
<summary>🤖 Cevap</summary>

Let me start by examining the existing codebase to understand the current state before scaffolding.

Listed directory run-and-dont-die Viewed index.html:1-30 Viewed game.js:1-780

Good, I've reviewed the full codebase. Now let me create everything in one go. I'll start by creating the directory structure, all JS skeleton files, the documentation files, and updating index.html.

Ran command: mkdir -Force js\entities, js\systems, js\renderer, js\assets, assets\images\player, assets\images\enemies, assets\images\items, assets\images\ui, assets\audio\bgm, assets\audio\sfx, legacy

Now let me move game.js to legacy/ and create all the files:

Ran command: Copy-Item game.js legacy\game.js.bak

Now I'll create all JS skeleton files and documentation in parallel:

- Created config.js, input.js, main.js
- Created Player.js, Drone.js, Enemy.js, Projectile.js, ExperienceOrb.js, Zone.js, WeaponDrop.js
- Created SpawnSystem.js, UpgradeSystem.js, CollisionSystem.js
- Created Camera.js, MapRenderer.js, UIRenderer.js
- Created AssetLoader.js, AudioManager.js

All JS skeleton files created. Now let me create the documentation files and update index.html:

- Created README.md, AI.md, TASKS.md
- Edited index.html

Now let me add placeholder .gitkeep files to the empty asset directories so Git tracks them:

Ran command: "" | Out-File -Encoding utf8 assets\images\player\.gitkeep; "" | Out-File -Encoding utf8 assets\images\enemies\.gitkeep; "" | Out-File -Encoding utf8 assets\images\items\.gitkeep; "" | Out-File -Encoding utf8 assets\images\ui\.gitkeep; "" | Out-File -Encoding utf8 assets\audio\bgm\.gitkeep; "" | Out-File -Encoding utf8 assets\audio\sfx\.gitkeep

Let me verify the final structure looks correct:

Ran command: Get-ChildItem -Recurse -Name | Where-Object { $ -notlike ".git\" } | Sort-Object

Everything is in place. Let me create the walkthrough artifact:

Created walkthrough.md

#### ✅ Scaffold Complete

Here's what was created:

**📁 15 JS Module Skeletons**

Each file contains a detailed TODO header with: responsibility, imports/exports, and exact line numbers from game.js for migration reference.

**📄 3 Documentation Files**

- README.md — Full Turkish README with gameplay, features, tech stack, install, and asset credit placeholders
- AI.md — AI usage log template with one example row (this scaffolding session)
- TASKS.md — 16 tasks (8 per student) with GitHub Issue-style checklists, dependencies, and a 3-week timeline

**🔧 Key Changes**

- index.html → updated to `<script type="module" src="js/main.js">`
- game.js → copied to legacy/game.js.bak (original kept in place)
- Empty assets/ directories with .gitkeep for Git tracking

No game logic was touched — the original game.js remains fully functional.

</details>

</details>

---

<details>
<summary>📅 GG-AA-YYYY — Araç Adı • Kısa Başlık</summary>

<details>
<summary>🧠 Prompt</summary>

Buraya verilen prompt yazılacak.

</details>

<details>
<summary>🤖 Cevap</summary>

Buraya alınan cevap yazılacak.

</details>

<details>
<summary>📅 11-05-2026 — Google Gemini • Zemin Texture Üretimi</summary>

<details>
<summary>🧠 Prompt</summary>

top-down dark stone floor texture, pixel art style, seamless, dungeon, 1024x1024

</details>

<details>
<summary>🤖 Cevap</summary>

Karanlık taş zemin texture'ı üretildi. assets/images/ui/zemin.png olarak kaydedildi.

</details>

</details>

</details>