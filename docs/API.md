# API リファレンス

## コアクラス

### GameScene

メインゲームロジックを管理するシーン

#### プロパティ
```typescript
score: number;           // 現在のスコア
lives: number;           // 残機
bombs: number;           // ボム残数
power: number;           // パワーレベル (0-100)
graze: number;           // グレイズカウント
isPaused: boolean;       // ポーズ状態
```

#### メソッド
```typescript
addScore(points: number): void
// スコアを加算

addGraze(count: number = 1): void
// グレイズカウントを加算し、ボーナススコアを付与

playerHit(): void
// プレイヤーが被弾した時の処理

useBomb(): void
// ボムを使用

getBulletManager(): BulletManager
// BulletManagerインスタンスを取得

getPlayer(): Player
// Playerインスタンスを取得
```

---

## エンティティクラス

### Player

プレイヤーキャラクター

#### プロパティ
```typescript
isInvincible: boolean;   // 無敵状態フラグ
```

#### メソッド
```typescript
update(time: number, delta: number): void
// フレーム毎の更新処理

makeInvincible(): void
// 無敵状態にする（被弾後など）

getHitboxRadius(): number
// ヒットボックスの半径を取得
```

#### 使用例
```typescript
const player = new Player(scene, x, y);
player.makeInvincible(); // 無敵化
```

---

### Enemy

敵キャラクター

#### コンストラクタ
```typescript
constructor(
  scene: GameScene,
  x: number,
  y: number,
  config: EnemyConfig
)
```

#### EnemyConfig
```typescript
interface EnemyConfig {
  type: 'basic' | 'elite' | 'boss';
  hp: number;
  score: number;
  texture: string;
}
```

#### メソッド
```typescript
update(time: number, delta: number): void
// 移動・攻撃の更新

takeDamage(damage: number): void
// ダメージ処理

setMovePattern(pattern: 'straight' | 'wave' | 'circle' | 'zigzag'): void
// 移動パターン設定

setBulletPattern(pattern: string): void
// 弾幕パターン設定

setShootInterval(interval: number): void
// 射撃間隔設定（ミリ秒）
```

#### 使用例
```typescript
const enemy = new Enemy(scene, x, y, {
  type: 'basic',
  hp: 10,
  score: 100,
  texture: 'enemy-basic'
});
enemy.setMovePattern('wave');
enemy.setBulletPattern('aimed');
```

---

## システムクラス

### BulletManager

弾丸の生成・管理システム

#### メソッド
```typescript
update(time: number, delta: number): void
// 全弾丸の更新

createPlayerBullet(
  x: number,
  y: number,
  dirX: number,
  dirY: number
): void
// プレイヤー弾生成

createEnemyBullet(
  x: number,
  y: number,
  dirX: number,
  dirY: number,
  speed?: number
): void
// 敵弾生成

clearEnemyBullets(): void
// 敵弾を全て削除（ボム使用時など）

getPlayerBullets(): Phaser.GameObjects.Group
// プレイヤー弾グループを取得

getEnemyBullets(): Phaser.GameObjects.Group
// 敵弾グループを取得
```

#### 使用例
```typescript
const bulletManager = new BulletManager(scene);

// プレイヤー弾発射（上方向）
bulletManager.createPlayerBullet(playerX, playerY, 0, -1);

// 敵弾発射（速度指定）
bulletManager.createEnemyBullet(enemyX, enemyY, 0, 1, 3.0);
```

---

### EnemyManager

敵の出現・管理システム

#### メソッド
```typescript
update(time: number, delta: number): void
// 敵の更新・出現管理

startStage(stage: StageData): void
// ステージ開始

getEnemies(): Phaser.GameObjects.Group
// 敵グループを取得
```

#### 使用例
```typescript
const enemyManager = new EnemyManager(scene, difficulty);
enemyManager.startStage(stageData);
```

---

### CollisionSystem

衝突判定システム

#### メソッド
```typescript
update(): void
// 各種衝突判定の実行
// - プレイヤー弾 vs 敵
// - 敵弾 vs プレイヤー
// - 敵 vs プレイヤー
// - グレイズ判定
```

#### 使用例
```typescript
const collisionSystem = new CollisionSystem(scene);
// update()内で自動的に判定実行
```

---

### ItemManager

アイテム管理システム

#### メソッド
```typescript
update(time: number, delta: number): void
// アイテムの更新・吸引処理

createItem(x: number, y: number, type: ItemType): void
// アイテム生成

getItems(): Phaser.GameObjects.Group
// アイテムグループを取得
```

#### ItemType
```typescript
type ItemType = 'power' | 'point' | 'life' | 'bomb';
```

#### 使用例
```typescript
const itemManager = new ItemManager(scene);
itemManager.createItem(x, y, 'power');
```

---

## パターンクラス

### BasicPatterns

基本弾幕パターン集

#### メソッド

```typescript
static circle(
  bulletManager: BulletManager,
  x: number,
  y: number,
  bulletCount: number,
  speed: number,
  offset?: number
): void
// 円形弾幕

static spiral(
  bulletManager: BulletManager,
  x: number,
  y: number,
  arms: number,
  speed: number,
  rotation: number
): void
// スパイラル弾幕

static fan(
  bulletManager: BulletManager,
  x: number,
  y: number,
  bulletCount: number,
  startAngle: number,
  endAngle: number,
  speed: number
): void
// 扇状弾幕

static wave(
  bulletManager: BulletManager,
  x: number,
  y: number,
  bulletCount: number,
  amplitude: number,
  frequency: number,
  speed: number,
  baseAngle?: number
): void
// 波状弾幕

static laser(
  bulletManager: BulletManager,
  x: number,
  y: number,
  angle: number,
  length: number,
  speed: number
): void
// レーザー弾幕

static cross(
  bulletManager: BulletManager,
  x: number,
  y: number,
  speed: number,
  thickness?: number
): void
// 十字弾幕

static flower(
  bulletManager: BulletManager,
  x: number,
  y: number,
  petals: number,
  speed: number,
  rotation?: number
): void
// 花びら弾幕

static ring(
  bulletManager: BulletManager,
  x: number,
  y: number,
  rings: number,
  bulletsPerRing: number,
  baseSpeed: number
): void
// リング弾幕
```

#### 使用例
```typescript
// 16方向の円形弾幕、速度2.0
BasicPatterns.circle(bulletManager, x, y, 16, 2.0);

// 5つの花びら、速度2.5
BasicPatterns.flower(bulletManager, x, y, 5, 2.5);
```

---

### SpellPatterns

スペルカード弾幕パターン

#### メソッド

```typescript
static executeSpellCard(
  bulletManager: BulletManager,
  spellName: string,
  x: number,
  y: number,
  time: number
): void
// スペルカード実行

// 個別スペルカード
static icicleFall(bulletManager, x, y, time): void
static perfectFreeze(bulletManager, x, y, time): void
static rainbowLotus(bulletManager, x, y, time): void
static tigerDragon(bulletManager, x, y, time): void
static fiveElements(bulletManager, x, y, time): void
static royalFlare(bulletManager, x, y, time): void
```

#### 使用例
```typescript
// スペルカード実行
SpellPatterns.executeSpellCard(
  bulletManager,
  'icicle_fall',
  bossX,
  bossY,
  scene.time.now
);
```

---

## 設定

### GameConfig

ゲーム全体の設定定数

#### 主要な設定
```typescript
// 画面サイズ
WIDTH: 640
HEIGHT: 480
GAME_WIDTH: 384
GAME_HEIGHT: 448

// プレイヤー
PLAYER.SPEED_NORMAL: 4.5
PLAYER.SPEED_FOCUSED: 2.0
PLAYER.HITBOX_RADIUS: 2
PLAYER.LIVES: 3
PLAYER.BOMB_COUNT: 3

// 弾幕
BULLET.PLAYER_SPEED: 8
BULLET.ENEMY_SPEED_NORMAL: 3.0
BULLET.MAX_BULLETS: 2000

// スコア
SCORE.ENEMY_BASIC: 100
SCORE.BOSS: 10000
SCORE.GRAZE_POINT: 10
```

#### 使用例
```typescript
import { GameConfig } from '@config/GameConfig';

const speed = GameConfig.PLAYER.SPEED_NORMAL;
const maxBullets = GameConfig.BULLET.MAX_BULLETS;
```

---

### StageData

ステージ構成データ（JSON）

#### 構造
```typescript
interface StageData {
  stages: Array<{
    id: number;
    name: string;
    bgm: string;
    background: string;
    duration: number;
    boss: {
      name: string;
      title: string;
      hp: number;
      spellCards: Array<{
        name: string;
        duration: number;
        pattern: string;
        bonus: number;
      }>;
    };
    enemies: Array<{
      type: string;
      spawnTime: number;
      count: number;
      pattern: string;
    }>;
  }>;
}
```

#### 使用例
```typescript
import stageData from '@config/StageData.json';

const stage1 = stageData.stages.find(s => s.id === 1);
console.log(stage1.boss.name); // "チルノ"
```

---

## イベント

### GameScene イベント

```typescript
// UI更新通知
scene.events.emit('update-ui');

// UIシーンから受信
scene.events.on('update-stats', (data) => {
  // data: { score, lives, bombs, power, graze }
});
```

---

## ユーティリティ

### 角度計算
```typescript
// Phaser.Math.Angle を使用
const angle = Phaser.Math.Angle.Between(x1, y1, x2, y2);
```

### 距離計算
```typescript
// Phaser.Math.Distance を使用
const distance = Phaser.Math.Distance.Between(x1, y1, x2, y2);
```

### 範囲制限
```typescript
// Phaser.Math.Clamp を使用
const clamped = Phaser.Math.Clamp(value, min, max);
```

---

## 開発用機能

### デバッグモード

```typescript
if (process.env.NODE_ENV === 'development') {
  // デバッグ用機能
  this.input.keyboard?.on('keydown-R', () => {
    this.scene.restart(); // リスタート
  });
}
```

### 物理デバッグ表示

```typescript
// Phaser設定内
physics: {
  arcade: {
    debug: true, // デバッグ表示ON
  }
}
```

---

## 型定義

### 主要な型

```typescript
type Difficulty = 'EASY' | 'NORMAL' | 'HARD' | 'LUNATIC';
type EnemyType = 'basic' | 'elite' | 'boss';
type ItemType = 'power' | 'point' | 'life' | 'bomb';
type MovePattern = 'straight' | 'wave' | 'circle' | 'zigzag';
```

---

## テスト

### Jest テスト例

```typescript
import { GameConfig } from '@config/GameConfig';

describe('GameConfig', () => {
  it('should have valid player speed', () => {
    expect(GameConfig.PLAYER.SPEED_NORMAL).toBeGreaterThan(0);
  });
});
```

---

## パフォーマンス

### 推奨事項

1. **オブジェクトプール使用**
   - BulletManagerで実装済み

2. **画面外削除**
   - 自動的に非アクティブ化

3. **弾数制限**
   - `MAX_BULLETS = 2000`で制限

4. **更新頻度の最適化**
   - 必要な時のみupdate実行
