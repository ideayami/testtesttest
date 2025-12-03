import Phaser from 'phaser';
import { GameConfig } from '@config/GameConfig';

/**
 * UIシーン - スコア、ライフなどの情報表示
 */
export class UIScene extends Phaser.Scene {
  private scoreText!: Phaser.GameObjects.Text;
  private livesText!: Phaser.GameObjects.Text;
  private bombsText!: Phaser.GameObjects.Text;
  private powerText!: Phaser.GameObjects.Text;
  private grazeText!: Phaser.GameObjects.Text;
  private fpsText!: Phaser.GameObjects.Text;

  constructor() {
    super({ key: 'UIScene' });
  }

  create(): void {
    const uiX = GameConfig.GAME_WIDTH + 20;
    const startY = 50;
    const spacing = 60;

    // UI背景
    const uiBg = this.add.rectangle(
      GameConfig.GAME_WIDTH + GameConfig.UI_WIDTH / 2,
      GameConfig.HEIGHT / 2,
      GameConfig.UI_WIDTH - 10,
      GameConfig.HEIGHT - 10,
      0x0f0f1e,
      0.8
    );
    uiBg.setStrokeStyle(2, 0x4a90e2);

    // タイトル
    this.add.text(uiX, 20, 'GAME INFO', {
      fontSize: '20px',
      color: '#4a90e2',
      fontStyle: 'bold',
    });

    // スコア
    this.add.text(uiX, startY, 'SCORE', {
      fontSize: '16px',
      color: '#ffffff',
    });
    this.scoreText = this.add.text(uiX, startY + 25, '0000000', {
      fontSize: '24px',
      color: '#ffff00',
      fontStyle: 'bold',
    });

    // ライフ
    this.add.text(uiX, startY + spacing, 'LIVES', {
      fontSize: '16px',
      color: '#ffffff',
    });
    this.livesText = this.add.text(uiX, startY + spacing + 25, '3', {
      fontSize: '24px',
      color: '#2ecc71',
      fontStyle: 'bold',
    });

    // ボム
    this.add.text(uiX, startY + spacing * 2, 'BOMBS', {
      fontSize: '16px',
      color: '#ffffff',
    });
    this.bombsText = this.add.text(uiX, startY + spacing * 2 + 25, '3', {
      fontSize: '24px',
      color: '#e74c3c',
      fontStyle: 'bold',
    });

    // パワー
    this.add.text(uiX, startY + spacing * 3, 'POWER', {
      fontSize: '16px',
      color: '#ffffff',
    });
    this.powerText = this.add.text(uiX, startY + spacing * 3 + 25, '0 / 100', {
      fontSize: '20px',
      color: '#9b59b6',
    });

    // グレイズ
    this.add.text(uiX, startY + spacing * 4, 'GRAZE', {
      fontSize: '16px',
      color: '#ffffff',
    });
    this.grazeText = this.add.text(uiX, startY + spacing * 4 + 25, '0', {
      fontSize: '20px',
      color: '#3498db',
    });

    // FPS表示
    this.fpsText = this.add.text(uiX, GameConfig.HEIGHT - 40, 'FPS: 60', {
      fontSize: '14px',
      color: '#95a5a6',
    });

    // GameSceneからの更新を受信
    const gameScene = this.scene.get('GameScene');
    if (gameScene) {
      gameScene.events.on('update-stats', this.updateStats, this);
    }
  }

  update(): void {
    // FPS更新
    const fps = Math.round(this.game.loop.actualFps);
    this.fpsText.setText(`FPS: ${fps}`);
  }

  private updateStats(data: {
    score: number;
    lives: number;
    bombs: number;
    power: number;
    graze: number;
  }): void {
    this.scoreText.setText(data.score.toString().padStart(7, '0'));
    this.livesText.setText(data.lives.toString());
    this.bombsText.setText(data.bombs.toString());
    this.powerText.setText(`${data.power} / 100`);
    this.grazeText.setText(data.graze.toString());

    // ライフ数に応じて色変更
    if (data.lives <= 1) {
      this.livesText.setColor('#e74c3c');
    } else if (data.lives <= 2) {
      this.livesText.setColor('#f39c12');
    } else {
      this.livesText.setColor('#2ecc71');
    }
  }
}
