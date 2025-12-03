import Phaser from 'phaser';
import { GameConfig } from '@config/GameConfig';
import { GameScene } from '@scenes/GameScene';

/**
 * プレイヤークラス
 */
export class Player extends Phaser.GameObjects.Sprite {
  public scene: GameScene;
  private cursors: Phaser.Types.Input.Keyboard.CursorKeys;
  private shootKey!: Phaser.Input.Keyboard.Key;
  private bombKey!: Phaser.Input.Keyboard.Key;
  private focusKey!: Phaser.Input.Keyboard.Key;
  
  private lastShootTime = 0;
  public isInvincible = false;
  private invincibleTimer?: Phaser.Time.TimerEvent;
  
  // ヒットボックス表示
  private hitbox!: Phaser.GameObjects.Arc;

  constructor(scene: GameScene, x: number, y: number) {
    super(scene, x, y, 'player');
    
    this.scene = scene;
    scene.add.existing(this);
    scene.physics.add.existing(this);

    // 物理ボディ設定
    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setCollideWorldBounds(true);
    body.setSize(24, 32);

    // キー設定
    this.cursors = scene.input.keyboard!.createCursorKeys();
    this.shootKey = scene.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.Z);
    this.bombKey = scene.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.X);
    this.focusKey = scene.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT);

    // ヒットボックス表示（低速移動時に表示）
    this.hitbox = scene.add.circle(x, y, GameConfig.PLAYER.HITBOX_RADIUS, 0xff0000, 0.8);
    this.hitbox.setVisible(false);
  }

  update(time: number, _delta: number): void {
    this.handleMovement();
    this.handleShooting(time);
    this.handleBomb();
    this.updateHitbox();
  }

  private handleMovement(): void {
    const body = this.body as Phaser.Physics.Arcade.Body;
    const isFocused = this.focusKey.isDown;
    const speed = isFocused ? GameConfig.PLAYER.SPEED_FOCUSED : GameConfig.PLAYER.SPEED_NORMAL;

    // 移動速度リセット
    body.setVelocity(0, 0);

    // 8方向移動
    let moveX = 0;
    let moveY = 0;

    if (this.cursors.left?.isDown) moveX = -1;
    if (this.cursors.right?.isDown) moveX = 1;
    if (this.cursors.up?.isDown) moveY = -1;
    if (this.cursors.down?.isDown) moveY = 1;

    // 斜め移動の正規化
    if (moveX !== 0 && moveY !== 0) {
      moveX *= 0.707;
      moveY *= 0.707;
    }

    body.setVelocity(moveX * speed * 60, moveY * speed * 60);

    // ゲームエリア内に制限
    this.x = Phaser.Math.Clamp(this.x, 16, GameConfig.GAME_WIDTH - 16);
    this.y = Phaser.Math.Clamp(this.y, 16, GameConfig.GAME_HEIGHT - 16);

    // ヒットボックス表示切り替え
    this.hitbox.setVisible(isFocused);
  }

  private handleShooting(time: number): void {
    if (!this.shootKey.isDown) return;

    if (time - this.lastShootTime < GameConfig.PLAYER.SHOT_INTERVAL) return;

    this.lastShootTime = time;
    this.shoot();
  }

  private shoot(): void {
    const bulletManager = this.scene.getBulletManager();
    
    // 中央弾
    bulletManager.createPlayerBullet(this.x, this.y - 20, 0, -1);
    
    // サイド弾（パワーレベルに応じて追加）
    const power = (this.scene as any).power || 0;
    
    if (power >= 25) {
      bulletManager.createPlayerBullet(this.x - 15, this.y - 10, -0.2, -1);
      bulletManager.createPlayerBullet(this.x + 15, this.y - 10, 0.2, -1);
    }
    
    if (power >= 50) {
      bulletManager.createPlayerBullet(this.x - 25, this.y, -0.3, -1);
      bulletManager.createPlayerBullet(this.x + 25, this.y, 0.3, -1);
    }
    
    if (power >= 75) {
      bulletManager.createPlayerBullet(this.x - 30, this.y + 10, -0.4, -0.9);
      bulletManager.createPlayerBullet(this.x + 30, this.y + 10, 0.4, -0.9);
    }
  }

  private handleBomb(): void {
    if (Phaser.Input.Keyboard.JustDown(this.bombKey)) {
      this.scene.useBomb();
    }
  }

  private updateHitbox(): void {
    this.hitbox.setPosition(this.x, this.y);
  }

  public makeInvincible(): void {
    this.isInvincible = true;
    this.setAlpha(0.5);

    // 点滅エフェクト
    this.scene.tweens.add({
      targets: this,
      alpha: 0.2,
      duration: 100,
      yoyo: true,
      repeat: 19,
    });

    // 無敵時間終了
    this.invincibleTimer = this.scene.time.delayedCall(
      GameConfig.PLAYER.INVINCIBLE_TIME,
      () => {
        this.isInvincible = false;
        this.setAlpha(1);
      }
    );
  }

  public getHitboxRadius(): number {
    return GameConfig.PLAYER.HITBOX_RADIUS;
  }

  destroy(fromScene?: boolean): void {
    this.hitbox.destroy();
    if (this.invincibleTimer) {
      this.invincibleTimer.destroy();
    }
    super.destroy(fromScene);
  }
}
