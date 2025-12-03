import Phaser from 'phaser';
import { GameConfig } from '@config/GameConfig';
import { GameScene } from '@scenes/GameScene';

export type EnemyType = 'basic' | 'elite' | 'boss';

export interface EnemyConfig {
  type: EnemyType;
  hp: number;
  score: number;
  texture: string;
}

/**
 * 敵キャラクタークラス
 */
export class Enemy extends Phaser.GameObjects.Sprite {
  private gameScene: GameScene;
  private enemyType: EnemyType;
  private maxHp: number;
  public hp: number;
  private scoreValue: number;
  
  // 移動パターン
  private movePattern: 'straight' | 'wave' | 'circle' | 'zigzag' = 'straight';
  private moveSpeed = 2;
  private moveTime = 0;
  
  // 弾幕パターン
  private shootInterval = 1000;
  private lastShootTime = 0;
  private bulletPattern: string = 'none';
  
  // HPバー
  private hpBar?: Phaser.GameObjects.Graphics;
  private hpBarBg?: Phaser.GameObjects.Graphics;

  constructor(scene: GameScene, x: number, y: number, config: EnemyConfig) {
    super(scene, x, y, config.texture);
    
    this.gameScene = scene;
    this.enemyType = config.type;
    this.maxHp = config.hp;
    this.hp = config.hp;
    this.scoreValue = config.score;

    scene.add.existing(this);
    scene.physics.add.existing(this);

    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setCollideWorldBounds(false);

    // HPバー作成（Elite以上）
    if (this.enemyType !== 'basic') {
      this.createHpBar();
    }
  }

  update(time: number, delta: number): void {
    this.moveTime += delta;
    
    // 移動パターン実行
    this.executeMovement(time, delta);
    
    // 弾幕発射
    if (time - this.lastShootTime > this.shootInterval) {
      this.shoot();
      this.lastShootTime = time;
    }

    // HPバー更新
    this.updateHpBar();

    // 画面外に出たら削除
    if (this.y > GameConfig.GAME_HEIGHT + 50 || this.y < -50) {
      this.destroy();
    }
  }

  private executeMovement(_time: number, _delta: number): void {
    const body = this.body as Phaser.Physics.Arcade.Body;

    switch (this.movePattern) {
      case 'straight':
        body.setVelocityY(this.moveSpeed * 60);
        break;

      case 'wave':
        body.setVelocityY(this.moveSpeed * 60);
        body.setVelocityX(Math.sin(this.moveTime * 0.002) * 100);
        break;

      case 'circle': {
        const angle = this.moveTime * 0.002;
        const radius = 100;
        const centerX = GameConfig.GAME_WIDTH / 2;
        const centerY = 100;
        this.x = centerX + Math.cos(angle) * radius;
        this.y = centerY + Math.sin(angle) * radius;
        break;
      }

      case 'zigzag': {
        body.setVelocityY(this.moveSpeed * 60);
        const zigzag = Math.floor(this.moveTime / 500) % 2;
        body.setVelocityX(zigzag === 0 ? 100 : -100);
        break;
      }
    }
  }

  private shoot(): void {
    if (this.bulletPattern === 'none') return;

    const bulletManager = this.gameScene.getBulletManager();
    const player = this.gameScene.getPlayer();

    switch (this.bulletPattern) {
      case 'aimed': {
        // プレイヤーに向けて発射
        const angle = Phaser.Math.Angle.Between(this.x, this.y, player.x, player.y);
        bulletManager.createEnemyBullet(
          this.x,
          this.y,
          Math.cos(angle),
          Math.sin(angle),
          GameConfig.BULLET.ENEMY_SPEED_NORMAL
        );
        break;
      }

      case 'spread':
        // 扇状に発射
        for (let i = -2; i <= 2; i++) {
          const spreadAngle = (Math.PI / 2) + (i * Math.PI / 12);
          bulletManager.createEnemyBullet(
            this.x,
            this.y,
            Math.cos(spreadAngle),
            Math.sin(spreadAngle),
            GameConfig.BULLET.ENEMY_SPEED_NORMAL
          );
        }
        break;

      case 'circle': {
        // 円形弾幕
        const bulletCount = 12;
        for (let i = 0; i < bulletCount; i++) {
          const circleAngle = (Math.PI * 2 * i) / bulletCount;
          bulletManager.createEnemyBullet(
            this.x,
            this.y,
            Math.cos(circleAngle),
            Math.sin(circleAngle),
            GameConfig.BULLET.ENEMY_SPEED_SLOW
          );
        }
        break;
      }
    }
  }

  public takeDamage(damage: number): void {
    this.hp -= damage;

    // ダメージエフェクト
    this.setTint(0xff0000);
    this.gameScene.time.delayedCall(100, () => {
      this.clearTint();
    });

    if (this.hp <= 0) {
      this.die();
    }
  }

  private die(): void {
    // スコア加算
    this.gameScene.addScore(this.scoreValue);

    // 爆発エフェクト
    const explosion = this.gameScene.add.circle(this.x, this.y, 10, 0xffaa00, 1);
    this.gameScene.tweens.add({
      targets: explosion,
      radius: 50,
      alpha: 0,
      duration: 300,
      onComplete: () => explosion.destroy(),
    });

    // アイテムドロップ（確率）
    if (Math.random() < 0.3) {
      // ItemManagerでアイテム生成
      // this.gameScene.itemManager.createItem(this.x, this.y, 'power');
    }

    this.destroy();
  }

  private createHpBar(): void {
    const barWidth = 40;
    const barHeight = 4;

    this.hpBarBg = this.gameScene.add.graphics();
    this.hpBarBg.fillStyle(0x000000, 0.5);
    this.hpBarBg.fillRect(0, 0, barWidth, barHeight);

    this.hpBar = this.gameScene.add.graphics();
  }

  private updateHpBar(): void {
    if (!this.hpBar || !this.hpBarBg) return;

    const barWidth = 40;
    const barHeight = 4;
    const barX = this.x - barWidth / 2;
    const barY = this.y - this.height / 2 - 10;

    this.hpBarBg.setPosition(barX, barY);

    this.hpBar.clear();
    const hpPercent = this.hp / this.maxHp;
    const color = hpPercent > 0.5 ? 0x2ecc71 : hpPercent > 0.25 ? 0xf39c12 : 0xe74c3c;
    this.hpBar.fillStyle(color, 1);
    this.hpBar.fillRect(barX, barY, barWidth * hpPercent, barHeight);
  }

  public setMovePattern(pattern: 'straight' | 'wave' | 'circle' | 'zigzag'): void {
    this.movePattern = pattern;
  }

  public setBulletPattern(pattern: string): void {
    this.bulletPattern = pattern;
  }

  public setShootInterval(interval: number): void {
    this.shootInterval = interval;
  }

  destroy(fromScene?: boolean): void {
    if (this.hpBar) this.hpBar.destroy();
    if (this.hpBarBg) this.hpBarBg.destroy();
    super.destroy(fromScene);
  }
}
