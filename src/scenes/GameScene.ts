import Phaser from 'phaser';
import { GameConfig, Difficulty } from '@config/GameConfig';
import { Player } from '@entities/Player';
import { BulletManager } from '@systems/BulletManager';
import { EnemyManager } from '@systems/EnemyManager';
import { CollisionSystem } from '@systems/CollisionSystem';
import { ItemManager } from '@systems/ItemManager';
import stageData from '@config/StageData.json';

export interface GameSceneData {
  difficulty: Difficulty;
  stage: number;
}

/**
 * メインゲームシーン
 */
export class GameScene extends Phaser.Scene {
  private player!: Player;
  private bulletManager!: BulletManager;
  private enemyManager!: EnemyManager;
  private collisionSystem!: CollisionSystem;
  private itemManager!: ItemManager;
  
  private difficulty!: Difficulty;
  private currentStage!: number;
  private gameArea!: Phaser.GameObjects.Rectangle;
  
  // ゲーム状態
  public score = 0;
  public lives = GameConfig.PLAYER.LIVES;
  public bombs = GameConfig.PLAYER.BOMB_COUNT;
  public power = 0;
  public graze = 0;
  public isPaused = false;

  constructor() {
    super({ key: 'GameScene' });
  }

  init(data: GameSceneData): void {
    this.difficulty = data.difficulty || 'NORMAL';
    this.currentStage = data.stage || 1;
    
    // 状態リセット
    this.score = 0;
    this.lives = GameConfig.PLAYER.LIVES;
    this.bombs = GameConfig.PLAYER.BOMB_COUNT;
    this.power = 0;
    this.graze = 0;
    this.isPaused = false;
  }

  create(): void {
    // 背景
    this.cameras.main.setBackgroundColor('#1a1a2e');

    // ゲームエリア描画
    this.gameArea = this.add.rectangle(
      GameConfig.GAME_WIDTH / 2,
      GameConfig.GAME_HEIGHT / 2,
      GameConfig.GAME_WIDTH,
      GameConfig.GAME_HEIGHT,
      0x000000,
      0.3
    );
    this.gameArea.setStrokeStyle(2, 0x4a90e2);

    // グリッド描画（視覚効果）
    this.drawGrid();

    // システム初期化
    this.bulletManager = new BulletManager(this);
    this.enemyManager = new EnemyManager(this, this.difficulty);
    this.itemManager = new ItemManager(this);
    this.collisionSystem = new CollisionSystem(this);

    // プレイヤー生成
    this.player = new Player(
      this,
      GameConfig.GAME_WIDTH / 2,
      GameConfig.GAME_HEIGHT - 80
    );

    // キーボード入力設定
    this.setupInput();

    // ステージ開始
    this.startStage();

    // UIシーンと通信
    this.events.on('update-ui', this.updateUI, this);
  }

  update(time: number, delta: number): void {
    if (this.isPaused) return;

    // プレイヤー更新
    this.player.update(time, delta);

    // システム更新
    this.bulletManager.update(time, delta);
    this.enemyManager.update(time, delta);
    this.itemManager.update(time, delta);
    this.collisionSystem.update();

    // UI更新通知
    this.updateUI();
  }

  private drawGrid(): void {
    const graphics = this.add.graphics();
    graphics.lineStyle(1, 0x4a90e2, 0.1);

    // 縦線
    for (let x = 0; x <= GameConfig.GAME_WIDTH; x += 32) {
      graphics.lineBetween(x, 0, x, GameConfig.GAME_HEIGHT);
    }

    // 横線
    for (let y = 0; y <= GameConfig.GAME_HEIGHT; y += 32) {
      graphics.lineBetween(0, y, GameConfig.GAME_WIDTH, y);
    }
  }

  private setupInput(): void {
    // ポーズ
    this.input.keyboard?.on('keydown-ESC', () => {
      this.togglePause();
    });

    // デバッグ用
    if (process.env.NODE_ENV === 'development') {
      this.input.keyboard?.on('keydown-R', () => {
        this.scene.restart({ difficulty: this.difficulty, stage: this.currentStage });
      });
    }
  }

  private startStage(): void {
    const stage = stageData.stages.find((s) => s.id === this.currentStage);
    if (!stage) {
      console.error('Stage not found:', this.currentStage);
      return;
    }

    // ステージ名表示
    const stageText = this.add.text(
      GameConfig.GAME_WIDTH / 2,
      GameConfig.GAME_HEIGHT / 2,
      stage.name,
      {
        fontSize: '32px',
        color: '#ffffff',
        fontStyle: 'bold',
      }
    );
    stageText.setOrigin(0.5);

    // フェードアウト
    this.tweens.add({
      targets: stageText,
      alpha: 0,
      duration: 2000,
      delay: 1000,
      onComplete: () => {
        stageText.destroy();
        // 敵出現開始
        this.enemyManager.startStage(stage);
      },
    });
  }

  private togglePause(): void {
    this.isPaused = !this.isPaused;
    
    if (this.isPaused) {
      this.scene.pause();
      this.scene.launch('PauseScene');
    } else {
      this.scene.resume();
      this.scene.stop('PauseScene');
    }
  }

  private updateUI(): void {
    const uiScene = this.scene.get('UIScene');
    if (uiScene) {
      uiScene.events.emit('update-stats', {
        score: this.score,
        lives: this.lives,
        bombs: this.bombs,
        power: this.power,
        graze: this.graze,
      });
    }
  }

  // パブリックメソッド - 他のクラスから呼び出される
  public addScore(points: number): void {
    this.score += points;
  }

  public addGraze(count: number = 1): void {
    this.graze += count;
    this.addScore(GameConfig.SCORE.GRAZE_POINT * count);
  }

  public playerHit(): void {
    if (this.player.isInvincible) return;

    this.lives--;
    
    if (this.lives <= 0) {
      this.gameOver();
    } else {
      this.player.makeInvincible();
      // パワーダウン
      this.power = Math.max(0, this.power - 10);
    }
  }

  public useBomb(): void {
    if (this.bombs <= 0) return;
    
    this.bombs--;
    // 画面内の敵弾を削除
    this.bulletManager.clearEnemyBullets();
    
    // ボムエフェクト
    const bombEffect = this.add.circle(
      this.player.x,
      this.player.y,
      50,
      0xffff00,
      0.8
    );
    
    this.tweens.add({
      targets: bombEffect,
      radius: 400,
      alpha: 0,
      duration: 500,
      onComplete: () => bombEffect.destroy(),
    });
  }

  private gameOver(): void {
    this.scene.start('GameOverScene', {
      score: this.score,
      stage: this.currentStage,
    });
    this.scene.stop('UIScene');
  }

  public getBulletManager(): BulletManager {
    return this.bulletManager;
  }

  public getPlayer(): Player {
    return this.player;
  }
}
