# コントリビューションガイド

このプロジェクトへの貢献を歓迎します!

## 始め方

### 1. リポジトリをフォーク

GitHubでこのリポジトリをフォークしてください。

### 2. クローン

```bash
git clone https://github.com/YOUR_USERNAME/touhou-shooting-game.git
cd touhou-shooting-game
```

### 3. 依存関係のインストール

```bash
npm install
```

### 4. 開発サーバーの起動

```bash
npm run dev
```

ブラウザで `http://localhost:3000` を開いてください。

## ブランチ戦略

- `main`: 安定版・本番用
- `develop`: 開発のメインブランチ
- `feature/*`: 新機能開発
- `bugfix/*`: バグ修正
- `hotfix/*`: 緊急修正

### ブランチの作成

```bash
git checkout develop
git checkout -b feature/your-feature-name
```

## コミットメッセージ

わかりやすいコミットメッセージを心がけてください。

### フォーマット

```
<type>: <subject>

<body>

<footer>
```

### Type
- `feat`: 新機能
- `fix`: バグ修正
- `docs`: ドキュメント
- `style`: コードスタイル
- `refactor`: リファクタリング
- `test`: テスト追加・修正
- `chore`: その他

### 例

```
feat: add spiral bullet pattern

新しいスパイラル弾幕パターンをBasicPatternsに追加
- 腕の数を指定可能
- 回転速度を調整可能

Closes #123
```

## プルリクエスト

### チェックリスト

- [ ] コードが動作することを確認
- [ ] テストを追加/更新
- [ ] ドキュメントを更新
- [ ] リンターエラーがない
- [ ] コンフリクトを解消

### 手順

1. 自分のブランチに変更をコミット
2. `develop`ブランチにプッシュ
3. GitHubでプルリクエストを作成
4. レビューを待つ

```bash
git add .
git commit -m "feat: add new feature"
git push origin feature/your-feature-name
```

## コーディング規約

### TypeScript

- **型を明示的に宣言**
  ```typescript
  // Good
  const speed: number = 4.5;
  
  // Avoid
  const speed = 4.5;
  ```

- **インターフェースを活用**
  ```typescript
  interface BulletConfig {
    speed: number;
    damage: number;
  }
  ```

### 命名規則

- **クラス**: PascalCase (`Player`, `BulletManager`)
- **メソッド・変数**: camelCase (`createBullet`, `playerSpeed`)
- **定数**: UPPER_SNAKE_CASE (`MAX_BULLETS`, `PLAYER_SPEED`)
- **プライベートメソッド**: 先頭にアンダースコア (`_privateMethod`)

### コメント

```typescript
/**
 * プレイヤー弾を生成する
 * @param x X座標
 * @param y Y座標
 * @param dirX X方向の速度
 * @param dirY Y方向の速度
 */
public createPlayerBullet(x: number, y: number, dirX: number, dirY: number): void {
  // 実装
}
```

## テスト

### テストの実行

```bash
npm test
```

### テストの作成

```typescript
describe('BulletManager', () => {
  it('should create player bullet', () => {
    const bulletManager = new BulletManager(scene);
    bulletManager.createPlayerBullet(100, 100, 0, -1);
    
    const bullets = bulletManager.getPlayerBullets();
    expect(bullets.getLength()).toBeGreaterThan(0);
  });
});
```

## 新機能の追加

### 弾幕パターンの追加

1. `src/patterns/BasicPatterns.ts`または新ファイルに追加
2. パターンをテスト
3. ドキュメント（`docs/PATTERNS.md`）に記載

```typescript
static myNewPattern(
  bulletManager: BulletManager,
  x: number,
  y: number,
  ...params
): void {
  // パターンの実装
}
```

### 新しい敵の追加

1. `src/entities/Enemy.ts`を拡張またはサブクラス化
2. `src/config/StageData.json`に敵データ追加
3. テクスチャを`src/assets/`に配置

### 新しいシーンの追加

1. `src/scenes/`に新シーンファイル作成
2. `src/main.ts`の`scene`配列に追加
3. シーン遷移ロジックを実装

## バグ報告

### Issueの作成

1. 既存のIssueを確認
2. 新しいIssueを作成
3. 以下の情報を含める:

```markdown
## バグの説明
簡潔な説明

## 再現手順
1. xxx を実行
2. xxx をクリック
3. エラーが発生

## 期待される動作
本来どうあるべきか

## スクリーンショット
（可能であれば）

## 環境
- OS: Windows 10
- ブラウザ: Chrome 120
- バージョン: v0.1.0
```

## 質問・提案

- **質問**: GitHubのDiscussionsを使用
- **機能提案**: Issueで`enhancement`ラベルを付けて作成

## ライセンス

このプロジェクトへの貢献は、MIT Licenseの下で公開されます。

## 行動規範

### 尊重

- 他の貢献者を尊重する
- 建設的なフィードバックを提供
- 多様性を受け入れる

### コミュニケーション

- 明確で丁寧なコミュニケーション
- 日本語または英語でOK
- レスポンスには時間がかかる場合があります

## リソース

- [Phaser 3 ドキュメント](https://photonstorm.github.io/phaser3-docs/)
- [TypeScript ドキュメント](https://www.typescriptlang.org/docs/)
- [東方Project 公式](https://www16.big.or.jp/~zun/)

## 謝辞

このプロジェクトに貢献してくれた全ての方に感謝します!

---

質問やフィードバックがあれば、お気軽にIssueを作成してください。

Happy coding! 🎮
