# 🚀 クイックスタートガイド

このガイドに従って、5分でゲーム開発を開始できます!

## ステップ1: リポジトリのセットアップ

### GitHub上でリポジトリを作成

1. GitHubで新しいリポジトリを作成
2. リポジトリ名: `touhou-shooting-game`
3. Public/Private を選択
4. 「Create repository」をクリック

### ローカルでプロジェクトを初期化

```bash
# プロジェクトディレクトリに移動
cd touhou-shooting-game

# Gitリポジトリを初期化
git init

# 全てのファイルを追加
git add .

# 初回コミット
git commit -m "feat: initial project setup with complete game structure"

# リモートリポジトリを追加（YOUR_USERNAMEを自分のユーザー名に変更）
git remote add origin https://github.com/YOUR_USERNAME/touhou-shooting-game.git

# プッシュ
git branch -M main
git push -u origin main
```

## ステップ2: 依存関係のインストール

```bash
npm install
```

## ステップ3: 開発サーバーを起動

```bash
npm run dev
```

ブラウザが自動で開き、`http://localhost:3000` でゲームが起動します!

## ステップ4: ゲームをプレイしてみる

### 操作方法
- **移動**: ↑↓←→ 矢印キー
- **ショット**: Z キー
- **ボム**: X キー
- **低速移動**: Shift キー
- **ポーズ**: ESC キー

### 試してみること
1. タイトル画面で難易度を選択
2. ゲームを開始
3. 敵を倒してスコアを稼ぐ
4. 弾幕を避けてグレイズボーナスを獲得

## ステップ5: 初めての変更を加える

### 弾幕パターンをカスタマイズ

`src/patterns/BasicPatterns.ts` を開いて、円形弾幕の弾数を変更:

```typescript
// 変更前
BasicPatterns.circle(bulletManager, x, y, 12, 2.0);

// 変更後（弾数を16に増加）
BasicPatterns.circle(bulletManager, x, y, 16, 2.0);
```

保存すると自動でリロードされます!

### スコアを変更

`src/config/GameConfig.ts` でスコア設定を変更:

```typescript
SCORE: {
  ENEMY_BASIC: 100,    // 100 → 200 に変更してみる
  ENEMY_ELITE: 500,
  BOSS: 10000,
  // ...
}
```

## ステップ6: GitHub Pagesで公開

### 自動デプロイの設定

1. GitHubリポジトリの **Settings** タブを開く
2. 左メニューから **Pages** を選択
3. **Source** を "GitHub Actions" に変更
4. 完了!

### デプロイ

```bash
# 変更をコミット
git add .
git commit -m "feat: customize bullet patterns"

# プッシュ（自動デプロイが開始されます）
git push origin main
```

数分後、`https://YOUR_USERNAME.github.io/touhou-shooting-game/` でゲームが公開されます!

## 次のステップ

### 📚 ドキュメントを読む

- [ゲームデザイン](docs/DESIGN.md) - ゲームの仕様
- [弾幕パターン](docs/PATTERNS.md) - 弾幕の作り方
- [API リファレンス](docs/API.md) - コードの使い方

### 🎨 カスタマイズのアイデア

1. **新しい弾幕パターンを作成**
   ```typescript
   // src/patterns/BasicPatterns.ts
   static myPattern(bulletManager, x, y) {
     // あなたのパターン!
   }
   ```

2. **難易度を調整**
   ```typescript
   // src/config/GameConfig.ts
   DIFFICULTY: {
     EASY: { ... },
     // カスタム難易度を追加
   }
   ```

3. **新しいステージを追加**
   ```json
   // src/config/StageData.json
   {
     "id": 4,
     "name": "あなたのステージ",
     ...
   }
   ```

4. **プレイヤーの速度を変更**
   ```typescript
   // src/config/GameConfig.ts
   PLAYER: {
     SPEED_NORMAL: 4.5,  // 変更してみる
     SPEED_FOCUSED: 2.0,
   }
   ```

### 🐛 問題が発生したら

```bash
# 開発サーバーを再起動
Ctrl+C でサーバーを停止
npm run dev で再起動

# キャッシュをクリア
rm -rf node_modules package-lock.json
npm install

# ビルドエラーをチェック
npm run build
```

### 💡 ヒント

- **コードの変更は自動リロード**: ファイルを保存するだけで反映
- **ブラウザのコンソール**: F12でデバッグ情報を確認
- **FPS表示**: 画面右下でパフォーマンスを確認

## よくある質問

### Q: 敵が出現しない
A: `src/config/StageData.json` の `spawnTime` を確認してください

### Q: 弾幕が表示されない  
A: `BulletManager` の `MAX_BULLETS` 制限に達していないか確認

### Q: ゲームが重い
A: `GameConfig.BULLET.MAX_BULLETS` を 1000 程度に減らしてみてください

## コミュニティ

- 🐛 バグ報告: [GitHub Issues](https://github.com/YOUR_USERNAME/touhou-shooting-game/issues)
- 💬 質問・相談: [GitHub Discussions](https://github.com/YOUR_USERNAME/touhou-shooting-game/discussions)
- 🤝 貢献: [CONTRIBUTING.md](CONTRIBUTING.md)

---

**Happy Coding! 🎮✨**

困ったことがあれば、遠慮なくIssueで質問してください!
