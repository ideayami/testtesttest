# セットアップ＆デプロイガイド

## 🚀 クイックスタート

### 前提条件

- Node.js 18.x以上
- npm または yarn
- Git

### インストール

```bash
# リポジトリのクローン
git clone https://github.com/YOUR_USERNAME/touhou-shooting-game.git
cd touhou-shooting-game

# 依存関係のインストール
npm install

# 開発サーバー起動
npm run dev
```

ブラウザで `http://localhost:3000` を開いてください。

---

## 📦 プロジェクト構造

```
touhou-shooting-game/
├── .github/
│   └── workflows/          # GitHub Actions CI/CD
│       ├── ci.yml          # 継続的インテグレーション
│       └── deploy.yml      # GitHub Pagesデプロイ
├── docs/                   # ドキュメント
│   ├── DESIGN.md          # ゲームデザイン
│   ├── PATTERNS.md        # 弾幕パターン仕様
│   └── API.md             # APIリファレンス
├── src/
│   ├── scenes/            # ゲームシーン
│   │   ├── BootScene.ts
│   │   ├── TitleScene.ts
│   │   ├── GameScene.ts
│   │   ├── UIScene.ts
│   │   ├── PauseScene.ts
│   │   └── GameOverScene.ts
│   ├── entities/          # ゲームエンティティ
│   │   ├── Player.ts
│   │   └── Enemy.ts
│   ├── systems/           # ゲームシステム
│   │   ├── BulletManager.ts
│   │   ├── EnemyManager.ts
│   │   ├── CollisionSystem.ts
│   │   └── ItemManager.ts
│   ├── patterns/          # 弾幕パターン
│   │   ├── BasicPatterns.ts
│   │   └── SpellPatterns.ts
│   ├── config/            # 設定ファイル
│   │   ├── GameConfig.ts
│   │   └── StageData.json
│   └── main.ts            # エントリーポイント
├── tests/                 # テストファイル
├── index.html             # HTMLエントリー
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

---

## 🛠️ 開発コマンド

### 基本コマンド

```bash
# 開発サーバー起動（ホットリロード有効）
npm run dev

# 本番ビルド
npm run build

# ビルド結果のプレビュー
npm run preview

# テスト実行
npm test

# テスト（watch mode）
npm run test:watch

# リンター実行
npm run lint

# コードフォーマット
npm run format
```

### 環境変数

`.env.local`ファイルを作成（オプション）:

```env
NODE_ENV=development
VITE_API_URL=https://api.example.com
```

---

## 🎮 ゲームの遊び方

### 操作方法

- **移動**: 矢印キー
- **ショット**: Z キー
- **ボム**: X キー
- **低速移動**: Shift キー（精密な移動）
- **ポーズ**: ESC キー

### ゲームのコツ

1. **低速移動を活用**: Shiftで正確な移動が可能
2. **グレイズで稼ぐ**: 弾の近くを通過してボーナス獲得
3. **ボムは温存しない**: 危険な時は迷わず使用
4. **パワーアップ**: 緑のアイテムを集めて火力向上

---

## 🚢 デプロイ

### GitHub Pagesへのデプロイ

#### 自動デプロイ（推奨）

1. GitHubリポジトリの Settings > Pages を開く
2. Source を "GitHub Actions" に設定
3. `main`ブランチにプッシュすると自動デプロイ

```bash
git add .
git commit -m "feat: initial commit"
git push origin main
```

デプロイ完了後、`https://YOUR_USERNAME.github.io/touhou-shooting-game/` でアクセス可能。

#### 手動デプロイ

```bash
# ビルド
npm run build

# gh-pagesブランチにデプロイ
npm install -g gh-pages
gh-pages -d dist
```

### Netlify/Vercelへのデプロイ

#### Netlify

1. [Netlify](https://www.netlify.com/)にログイン
2. "Add new site" > "Import an existing project"
3. GitHubリポジトリを選択
4. Build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
5. "Deploy site"をクリック

#### Vercel

```bash
# Vercel CLIのインストール
npm install -g vercel

# デプロイ
vercel
```

---

## 🧪 テスト

### テストの実行

```bash
# 全テスト実行
npm test

# 特定のファイルをテスト
npm test GameConfig.test.ts

# カバレッジ確認
npm test -- --coverage
```

### 新しいテストの追加

`tests/`ディレクトリにファイルを作成:

```typescript
// tests/BulletManager.test.ts
import { BulletManager } from '../src/systems/BulletManager';

describe('BulletManager', () => {
  it('should create bullets', () => {
    // テストコード
  });
});
```

---

## 🎨 アセットの追加

### 画像アセット

1. `src/assets/sprites/`に画像を配置
2. `BootScene.ts`で読み込み:

```typescript
this.load.image('my-sprite', 'assets/sprites/my-sprite.png');
```

### 音声アセット（今後実装）

```typescript
this.load.audio('bgm-stage1', 'assets/audio/stage1.mp3');
```

---

## 🐛 トラブルシューティング

### 問題: npm installが失敗する

```bash
# キャッシュをクリア
npm cache clean --force

# node_modulesを削除して再インストール
rm -rf node_modules package-lock.json
npm install
```

### 問題: ゲームが起動しない

1. ブラウザのコンソールでエラーを確認
2. `npm run build`でビルドエラーがないか確認
3. Node.jsのバージョンを確認（18.x以上必要）

### 問題: パフォーマンスが悪い

- ブラウザの開発者ツールでFPSを確認
- `GameConfig.BULLET.MAX_BULLETS`を減らす
- 物理デバッグを無効化（本番ビルドでは自動的にオフ）

---

## 📊 パフォーマンス最適化

### ビルド最適化

```typescript
// vite.config.ts
build: {
  minify: 'terser',
  terserOptions: {
    compress: {
      drop_console: true, // console.logを削除
    },
  },
}
```

### コード分割

大きなファイルは動的インポートで分割:

```typescript
// 必要な時にロード
const { SpellPatterns } = await import('./patterns/SpellPatterns');
```

---

## 🔒 セキュリティ

### 依存関係の更新

```bash
# 脆弱性チェック
npm audit

# 自動修正
npm audit fix

# 依存関係の更新
npm update
```

---

## 📝 ドキュメント生成

### TypeDocでAPIドキュメント生成（オプション）

```bash
npm install -D typedoc

# ドキュメント生成
npx typedoc --out docs-api src/
```

---

## 🌐 多言語対応（今後実装予定）

```typescript
// 将来的な実装例
const i18n = {
  ja: {
    title: '東方Project風シューティング',
    start: 'スタート',
  },
  en: {
    title: 'Touhou-style Shooting Game',
    start: 'Start',
  },
};
```

---

## 🤝 コントリビューション

プロジェクトへの貢献方法は [CONTRIBUTING.md](CONTRIBUTING.md) を参照してください。

---

## 📄 ライセンス

MIT License - 詳細は [LICENSE](LICENSE) を参照

---

## 🙏 謝辞

- **Phaser 3**: ゲームエンジン
- **東方Project**: インスピレーション
- **コミュニティ**: サポートとフィードバック

---

## 📮 サポート

質問や問題がある場合:

1. [GitHub Issues](https://github.com/YOUR_USERNAME/touhou-shooting-game/issues)
2. [GitHub Discussions](https://github.com/YOUR_USERNAME/touhou-shooting-game/discussions)

---

Happy Gaming! 🎮✨
