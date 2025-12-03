import Phaser from 'phaser';
import { Difficulty } from '@config/GameConfig';

/**
 * タイトルシーン
 */
export class TitleScene extends Phaser.Scene {
  private selectedDifficulty: Difficulty = 'NORMAL';
  private menuItems: Phaser.GameObjects.Text[] = [];
  private currentSelection = 0;

  constructor() {
    super({ key: 'TitleScene' });
  }

  create(): void {
    const { width, height } = this.cameras.main;

    // タイトル
    const title = this.add.text(width / 2, height / 4, '東方Project風\nシューティングゲーム', {
      fontSize: '32px',
      color: '#ffffff',
      align: 'center',
      fontStyle: 'bold',
    });
    title.setOrigin(0.5);

    // サブタイトル
    this.add.text(width / 2, height / 4 + 80, '～ 弾幕は芸術だ ～', {
      fontSize: '18px',
      color: '#cccccc',
      align: 'center',
    }).setOrigin(0.5);

    // 難易度選択メニュー（4段階）
    const difficulties: Difficulty[] = ['EASY', 'NORMAL', 'HARD', 'LUNATIC'];
    const startY = height / 2;
    const spacing = 50;

    this.add.text(width / 2, startY - 50, '難易度を選択してください', {
      fontSize: '22px',
      color: '#ffffff',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    difficulties.forEach((difficulty, index) => {
      const difficultyNames = {
        EASY: '😊 Easy - 初心者向け',
        NORMAL: '⚔️ Normal - 標準',
        HARD: '🔥 Hard - 上級者向け',
        LUNATIC: '💀 Lunatic - 狂気',
      };

      const menuItem = this.add.text(
        width / 2,
        startY + index * spacing,
        difficultyNames[difficulty],
        {
          fontSize: '24px',
          color: '#ffffff',
        }
      );
      menuItem.setOrigin(0.5);
      this.menuItems.push(menuItem);
    });

    this.updateMenuSelection();

    // 操作説明
    this.add.text(width / 2, height - 80, '↑↓: 選択  Z or Enter: 決定', {
      fontSize: '16px',
      color: '#aaaaaa',
      align: 'center',
    }).setOrigin(0.5);

    // キーボード入力
    this.input.keyboard?.on('keydown-UP', () => this.moveSelection(-1));
    this.input.keyboard?.on('keydown-DOWN', () => this.moveSelection(1));
    this.input.keyboard?.on('keydown-Z', () => this.startGame());
    this.input.keyboard?.on('keydown-ENTER', () => this.startGame());
  }

  private moveSelection(direction: number): void {
    this.currentSelection += direction;
    if (this.currentSelection < 0) this.currentSelection = this.menuItems.length - 1;
    if (this.currentSelection >= this.menuItems.length) this.currentSelection = 0;
    this.updateMenuSelection();
  }

  private updateMenuSelection(): void {
    const difficulties: Difficulty[] = ['EASY', 'NORMAL', 'HARD', 'LUNATIC'];
    
    this.menuItems.forEach((item, index) => {
      if (index === this.currentSelection) {
        item.setColor('#ffff00');
        item.setScale(1.2);
        this.selectedDifficulty = difficulties[index];
      } else {
        item.setColor('#ffffff');
        item.setScale(1);
      }
    });
  }

  private startGame(): void {
    // ゲームシーンへ遷移
    this.scene.start('GameScene', { 
      difficulty: this.selectedDifficulty,
      stage: 1,
    });
    
    // UIシーンを並行起動
    this.scene.launch('UIScene');
  }
}
