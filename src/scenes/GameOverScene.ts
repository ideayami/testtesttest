import Phaser from 'phaser';

export interface GameOverData {
  score: number;
  stage: number;
}

/**
 * ゲームオーバーシーン
 */
export class GameOverScene extends Phaser.Scene {
  private finalScore = 0;
  private finalStage = 1;

  constructor() {
    super({ key: 'GameOverScene' });
  }

  init(data: GameOverData): void {
    this.finalScore = data.score || 0;
    this.finalStage = data.stage || 1;
  }

  create(): void {
    const { width, height } = this.cameras.main;

    // 背景
    this.cameras.main.setBackgroundColor('#1a1a2e');

    // Game Over テキスト
    const gameOverText = this.add.text(width / 2, height / 3, 'GAME OVER', {
      fontSize: '64px',
      color: '#e74c3c',
      fontStyle: 'bold',
    });
    gameOverText.setOrigin(0.5);

    // スコア表示
    this.add.text(width / 2, height / 2, `Final Score: ${this.finalScore}`, {
      fontSize: '32px',
      color: '#ffffff',
    }).setOrigin(0.5);

    this.add.text(width / 2, height / 2 + 50, `Stage: ${this.finalStage}`, {
      fontSize: '24px',
      color: '#cccccc',
    }).setOrigin(0.5);

    // 操作説明
    const instructionText = this.add.text(
      width / 2,
      height - 100,
      'Press SPACE or Z to continue',
      {
        fontSize: '20px',
        color: '#95a5a6',
      }
    );
    instructionText.setOrigin(0.5);

    // 点滅エフェクト
    this.tweens.add({
      targets: instructionText,
      alpha: 0.3,
      duration: 800,
      yoyo: true,
      repeat: -1,
    });

    // キー入力
    this.input.keyboard?.on('keydown-SPACE', () => this.returnToTitle());
    this.input.keyboard?.on('keydown-Z', () => this.returnToTitle());
  }

  private returnToTitle(): void {
    this.scene.start('TitleScene');
  }
}
