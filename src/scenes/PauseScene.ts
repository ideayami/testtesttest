import Phaser from 'phaser';

/**
 * ポーズシーン
 */
export class PauseScene extends Phaser.Scene {
  constructor() {
    super({ key: 'PauseScene' });
  }

  create(): void {
    const { width, height } = this.cameras.main;

    // 半透明背景
    this.add.rectangle(
      width / 2,
      height / 2,
      width,
      height,
      0x000000,
      0.7
    );

    // ポーズテキスト
    this.add.text(width / 2, height / 2 - 50, 'PAUSED', {
      fontSize: '48px',
      color: '#ffffff',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    // 操作説明
    this.add.text(
      width / 2,
      height / 2 + 20,
      'ESC: ゲームに戻る\nR: リスタート\nQ: タイトルに戻る',
      {
        fontSize: '20px',
        color: '#cccccc',
        align: 'center',
      }
    ).setOrigin(0.5);

    // キー入力
    this.input.keyboard?.on('keydown-ESC', () => {
      this.resumeGame();
    });

    this.input.keyboard?.on('keydown-R', () => {
      this.restartGame();
    });

    this.input.keyboard?.on('keydown-Q', () => {
      this.returnToTitle();
    });
  }

  private resumeGame(): void {
    const gameScene = this.scene.get('GameScene');
    if (gameScene) {
      (gameScene as any).isPaused = false;
    }
    this.scene.stop();
    this.scene.resume('GameScene');
  }

  private restartGame(): void {
    this.scene.stop();
    this.scene.stop('GameScene');
    this.scene.stop('UIScene');
    
    const gameScene = this.scene.get('GameScene');
    const data = {
      difficulty: (gameScene as any).difficulty || 'NORMAL',
      stage: (gameScene as any).currentStage || 1,
    };
    
    this.scene.start('GameScene', data);
    this.scene.launch('UIScene');
  }

  private returnToTitle(): void {
    this.scene.stop();
    this.scene.stop('GameScene');
    this.scene.stop('UIScene');
    this.scene.start('TitleScene');
  }
}
