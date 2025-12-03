import Phaser from 'phaser';

/**
 * ブートシーン - アセットの読み込みと初期化
 */
export class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BootScene' });
    console.log('🚀 BootScene constructor called');
  }

  preload(): void {
    console.log('📦 BootScene preload started');
    // ローディングバー表示
    const progressBar = this.add.graphics();
    const progressBox = this.add.graphics();
    progressBox.fillStyle(0x222222, 0.8);
    progressBox.fillRect(240, 270, 320, 50);

    const width = this.cameras.main.width;
    const height = this.cameras.main.height;
    const loadingText = this.make.text({
      x: width / 2,
      y: height / 2 - 50,
      text: 'Loading...',
      style: {
        font: '20px monospace',
        color: '#ffffff',
      },
    });
    loadingText.setOrigin(0.5, 0.5);

    const percentText = this.make.text({
      x: width / 2,
      y: height / 2 + 15,
      text: '0%',
      style: {
        font: '18px monospace',
        color: '#ffffff',
      },
    });
    percentText.setOrigin(0.5, 0.5);

    // プログレスバー更新
    this.load.on('progress', (value: number) => {
      percentText.setText(Math.floor(value * 100) + '%');
      progressBar.clear();
      progressBar.fillStyle(0xffffff, 1);
      progressBar.fillRect(250, 280, 300 * value, 30);
    });

    this.load.on('complete', () => {
      progressBar.destroy();
      progressBox.destroy();
      loadingText.destroy();
      percentText.destroy();
    });

    // アセット読み込み（プレースホルダー）
    // 実際のゲームでは画像・音声ファイルをここで読み込む
    this.loadPlaceholderAssets();
  }

  create(): void {
    console.log('✅ BootScene create - transitioning to TitleScene');
    // タイトルシーンへ遷移
    this.scene.start('TitleScene');
  }

  private loadPlaceholderAssets(): void {
    // プレースホルダー画像を生成（実際の開発では実際の画像を使用）
    this.createPlaceholderTexture('player', 32, 48, 0x4a90e2);
    this.createPlaceholderTexture('player-bullet', 8, 16, 0x00ffff);
    this.createPlaceholderTexture('enemy-basic', 32, 32, 0xe74c3c);
    this.createPlaceholderTexture('enemy-elite', 48, 48, 0xf39c12);
    this.createPlaceholderTexture('boss', 96, 96, 0x9b59b6);
    this.createPlaceholderTexture('enemy-bullet', 8, 8, 0xff6b6b);
    this.createPlaceholderTexture('power-item', 16, 16, 0x2ecc71);
    this.createPlaceholderTexture('point-item', 12, 12, 0xf1c40f);
  }

  private createPlaceholderTexture(
    key: string,
    width: number,
    height: number,
    color: number
  ): void {
    const graphics = this.add.graphics();
    graphics.fillStyle(color, 1);
    graphics.fillRect(0, 0, width, height);
    graphics.generateTexture(key, width, height);
    graphics.destroy();
  }
}
