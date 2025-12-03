# 弾幕パターン仕様書

## 基本弾幕パターン

### 1. Circle（円形弾幕）
```typescript
BasicPatterns.circle(bulletManager, x, y, bulletCount, speed, offset)
```

**説明**: 指定座標から等間隔に全方位へ弾を発射

**パラメータ**:
- `bulletCount`: 弾の数（推奨: 8-24）
- `speed`: 弾速（1.0-5.0）
- `offset`: 回転オフセット（ラジアン）

**使用例**:
- 雑魚敵の基本攻撃
- ボスの通常弾幕

**ビジュアル**:
```
       *
    *     *
  *         *
      [O]
  *         *
    *     *
       *
```

---

### 2. Spiral（スパイラル弾幕）
```typescript
BasicPatterns.spiral(bulletManager, x, y, arms, speed, rotation)
```

**説明**: 回転しながら複数の腕を持つ渦巻き状の弾幕

**パラメータ**:
- `arms`: 腕の数（推奨: 2-6）
- `speed`: 弾速
- `rotation`: 現在の回転角度（時間経過で変化）

**使用例**:
- 中ボスの攻撃
- スペルカードの一部

---

### 3. Fan（扇状弾幕）
```typescript
BasicPatterns.fan(bulletManager, x, y, bulletCount, startAngle, endAngle, speed)
```

**説明**: 指定角度範囲に扇状に弾を展開

**パラメータ**:
- `bulletCount`: 弾の数
- `startAngle`: 開始角度（ラジアン）
- `endAngle`: 終了角度（ラジアン）
- `speed`: 弾速

**使用例**:
- プレイヤーを狙う弾幕
- 限定範囲への攻撃

**ビジュアル**:
```
    * * * * *
     \ | | /
      \|O|/
```

---

### 4. Wave（波状弾幕）
```typescript
BasicPatterns.wave(bulletManager, x, y, bulletCount, amplitude, frequency, speed, baseAngle)
```

**説明**: 波打つように配置された弾幕

**パラメータ**:
- `amplitude`: 波の振幅
- `frequency`: 波の周波数
- `baseAngle`: 基本方向

**使用例**:
- 水属性の攻撃
- 美しいビジュアル効果

---

### 5. Laser（レーザー状弾幕）
```typescript
BasicPatterns.laser(bulletManager, x, y, angle, length, speed)
```

**説明**: 密集した直線状の弾でレーザーを模倣

**パラメータ**:
- `angle`: レーザーの角度
- `length`: レーザーの長さ
- `speed`: 弾速

**使用例**:
- 高威力攻撃
- 避けにくいパターン

---

### 6. Cross（十字弾幕）
```typescript
BasicPatterns.cross(bulletManager, x, y, speed, thickness)
```

**説明**: 十字型に弾を発射

**パラメータ**:
- `thickness`: 太さ（弾の層の数）

**使用例**:
- シンプルな攻撃パターン
- 他のパターンとの組み合わせ

---

### 7. Flower（花びら弾幕）
```typescript
BasicPatterns.flower(bulletManager, x, y, petals, speed, rotation)
```

**説明**: 花びらのような複雑な形状の弾幕

**パラメータ**:
- `petals`: 花びらの数
- `rotation`: 回転角度

**使用例**:
- ボスのスペルカード
- 美しいビジュアル

**ビジュアル**:
```
   *   *   *
  * * * * *
   * [O] *
  * * * * *
   *   *   *
```

---

### 8. Ring（リング弾幕）
```typescript
BasicPatterns.ring(bulletManager, x, y, rings, bulletsPerRing, baseSpeed)
```

**説明**: 複数の円形弾幕を重ねたリング

**パラメータ**:
- `rings`: リングの数
- `bulletsPerRing`: 各リングの弾数
- `baseSpeed`: 基本速度（リング毎に増加）

**使用例**:
- 複雑な回避パターン
- スペルカード

---

## スペルカード弾幕

### 氷符「アイシクルフォール」
```typescript
SpellPatterns.icicleFall(bulletManager, x, y, time)
```

**コンセプト**: 上空から氷柱が降り注ぐ

**動作**:
1. 画面上部から複数の縦列で弾が落下
2. 時間経過で密度が変化
3. 少し横方向にも散らばる

**攻略ポイント**: 
- 安全地帯を見つけて移動
- 低速移動で精密回避

---

### 凍符「パーフェクトフリーズ」
```typescript
SpellPatterns.perfectFreeze(bulletManager, x, y, time)
```

**コンセプト**: 全方位凍結攻撃

**動作**:
1. 3つのフェーズを繰り返す
2. Phase 0: 単純な円形
3. Phase 1: 二重円形
4. Phase 2: 花びら型

**攻略ポイント**:
- パターンの切り替わりを把握
- グレイズを狙う

---

### 華符「彩光蓮華掌」
```typescript
SpellPatterns.rainbowLotus(bulletManager, x, y, time)
```

**コンセプト**: 虹色の蓮の花

**動作**:
1. 8方向に花びら状の弾幕
2. 各方向に3層の弾
3. 連続で発射

**攻略ポイント**:
- 花びらの隙間を通る
- 中速移動で対応

---

### 気符「猛虎餓龍」
```typescript
SpellPatterns.tigerDragon(bulletManager, x, y, time)
```

**コンセプト**: 龍のような軌道

**動作**:
1. 4方向のスパイラル
2. 各腕が曲線を描く
3. 連続発射で龍の軌跡

**攻略ポイント**:
- 動きの予測が重要
- 中央付近は危険

---

### 火水木金土符「賢者の石」
```typescript
SpellPatterns.fiveElements(bulletManager, x, y, time)
```

**コンセプト**: 五行思想に基づく弾幕

**動作**:
1. 2秒毎に属性が変化
2. 火: スパイラル
3. 水: 波状
4. 木: 花びら
5. 金: 十字
6. 土: リング

**攻略ポイント**:
- 各属性の特徴を理解
- 切り替わり時が隙

---

### 日符「ロイヤルフレア」
```typescript
SpellPatterns.royalFlare(bulletManager, x, y, time)
```

**コンセプト**: 太陽の炎

**動作**:
1. 内側と外側の二重リング
2. 速度差で複雑な軌道
3. 定期的に十字レーザー追加

**攻略ポイント**:
- 内外の速度差を利用
- レーザーのタイミングに注意

---

## カスタムパターンの作成

### 基本構造
```typescript
export class CustomPatterns {
  static myPattern(
    bulletManager: BulletManager,
    x: number,
    y: number,
    time: number
  ): void {
    // 時間ベースの制御
    if (time % 500 < 50) {
      // 基本パターンの組み合わせ
      BasicPatterns.circle(bulletManager, x, y, 12, 2, time * 0.001);
    }
  }
}
```

### ベストプラクティス

1. **時間制御**
   ```typescript
   if (time % interval < threshold) {
     // 弾発射
   }
   ```

2. **位相制御**
   ```typescript
   const phase = Math.floor(time / duration) % phases;
   ```

3. **滑らかな動き**
   ```typescript
   const rotation = time * rotationSpeed;
   const offset = Math.sin(time * frequency) * amplitude;
   ```

4. **パターン組み合わせ**
   ```typescript
   BasicPatterns.circle(...);
   BasicPatterns.cross(...);
   // 複数を同時に実行
   ```

### 難易度調整

```typescript
// 難易度に応じた弾数・速度調整
const difficultyMultiplier = GameConfig.DIFFICULTY[difficulty];
const adjustedSpeed = baseSpeed * difficultyMultiplier.BULLET_SPEED_MULTIPLIER;
const adjustedCount = Math.floor(baseCount * difficultyMultiplier.ENEMY_HP_MULTIPLIER);
```

---

## デバッグとテスト

### パターンテスト用コマンド
開発モードで特定のパターンをテスト:

```typescript
// GameScene.ts内
if (process.env.NODE_ENV === 'development') {
  this.input.keyboard?.on('keydown-ONE', () => {
    SpellPatterns.icicleFall(this.bulletManager, 200, 100, this.time.now);
  });
}
```

### ビジュアルデバッグ
- グリッド表示で位置確認
- FPS表示でパフォーマンス確認
- 弾数カウンター（開発時のみ）

---

## パフォーマンス最適化

### オブジェクトプール
- 弾丸は使い回し
- 生成・破棄を最小化

### 画面外削除
```typescript
if (bullet.y > GameConfig.GAME_HEIGHT + 10) {
  returnBullet(bullet);
}
```

### 弾数制限
```typescript
const MAX_BULLETS = 2000; // 上限設定
```

---

## 今後の追加予定パターン

- [ ] ホーミング弾幕
- [ ] 加速・減速弾
- [ ] 反射弾幕
- [ ] レーザー（実線）
- [ ] 設置型弾幕
- [ ] 時間差発動
