import Phaser from 'phaser';
import { GameConfig } from '@config/GameConfig';
import { GameScene } from '@scenes/GameScene';

/**
 * 弾幕管理システム
 */
export class BulletManager {
  private scene: GameScene;
  
  // 弾丸グループ
  private playerBullets: Phaser.GameObjects.Group;
  private enemyBullets: Phaser.GameObjects.Group;
  
  // オブジェクトプール
  private playerBulletPool: Phaser.GameObjects.Sprite[] = [];
  private enemyBulletPool: Phaser.GameObjects.Sprite[] = [];

  constructor(scene: GameScene) {
    this.scene = scene;

    // グループ作成
    this.playerBullets = scene.add.group({
      classType: Phaser.GameObjects.Sprite,
      maxSize: 100,
      runChildUpdate: true,
    });

    this.enemyBullets = scene.add.group({
      classType: Phaser.GameObjects.Sprite,
      maxSize: GameConfig.BULLET.MAX_BULLETS,
      runChildUpdate: true,
    });
  }

  update(_time: number, _delta: number): void {
    // プレイヤー弾の更新と画面外チェック
    this.playerBullets.children.each((bullet) => {
      const b = bullet as Phaser.GameObjects.Sprite;
      if (b.active && (b.y < -10 || b.x < -10 || b.x > GameConfig.GAME_WIDTH + 10)) {
        this.returnPlayerBullet(b);
      }
      return true;
    });

    // 敵弾の更新と画面外チェック
    this.enemyBullets.children.each((bullet) => {
      const b = bullet as Phaser.GameObjects.Sprite;
      if (b.active && (b.y > GameConfig.GAME_HEIGHT + 10 || b.x < -10 || b.x > GameConfig.GAME_WIDTH + 10)) {
        this.returnEnemyBullet(b);
      }
      return true;
    });
  }

  // プレイヤー弾生成
  public createPlayerBullet(x: number, y: number, dirX: number, dirY: number): void {
    const bullet = this.getPlayerBullet();
    
    bullet.setPosition(x, y);
    bullet.setActive(true);
    bullet.setVisible(true);
    bullet.setTexture('player-bullet');

    const body = bullet.body as Phaser.Physics.Arcade.Body;
    body.setVelocity(
      dirX * GameConfig.BULLET.PLAYER_SPEED * 60,
      dirY * GameConfig.BULLET.PLAYER_SPEED * 60
    );
  }

  // 敵弾生成
  public createEnemyBullet(
    x: number,
    y: number,
    dirX: number,
    dirY: number,
    speed: number = GameConfig.BULLET.ENEMY_SPEED_NORMAL
  ): void {
    // 弾数制限チェック
    if (this.getActiveEnemyBulletCount() >= GameConfig.BULLET.MAX_BULLETS) {
      return;
    }

    const bullet = this.getEnemyBullet();
    
    bullet.setPosition(x, y);
    bullet.setActive(true);
    bullet.setVisible(true);
    bullet.setTexture('enemy-bullet');
    bullet.setTint(GameConfig.COLORS.ENEMY_BULLET);

    const body = bullet.body as Phaser.Physics.Arcade.Body;
    body.setVelocity(dirX * speed * 60, dirY * speed * 60);
  }

  // 敵弾の全削除（ボム使用時など）
  public clearEnemyBullets(): void {
    this.enemyBullets.children.each((bullet) => {
      const b = bullet as Phaser.GameObjects.Sprite;
      if (b.active) {
        // 削除エフェクト
        const effect = this.scene.add.circle(b.x, b.y, 5, 0xffff00, 0.8);
        this.scene.tweens.add({
          targets: effect,
          radius: 15,
          alpha: 0,
          duration: 200,
          onComplete: () => effect.destroy(),
        });
        
        this.returnEnemyBullet(b);
      }
      return true;
    });
  }

  // プレイヤー弾グループ取得
  public getPlayerBullets(): Phaser.GameObjects.Group {
    return this.playerBullets;
  }

  // 敵弾グループ取得
  public getEnemyBullets(): Phaser.GameObjects.Group {
    return this.enemyBullets;
  }

  // アクティブな敵弾数取得
  private getActiveEnemyBulletCount(): number {
    let count = 0;
    this.enemyBullets.children.each((bullet) => {
      if ((bullet as Phaser.GameObjects.Sprite).active) count++;
      return true;
    });
    return count;
  }

  // オブジェクトプール管理
  private getPlayerBullet(): Phaser.GameObjects.Sprite {
    let bullet = this.playerBulletPool.find((b) => !b.active);
    
    if (!bullet) {
      bullet = this.scene.add.sprite(0, 0, 'player-bullet');
      this.scene.physics.add.existing(bullet);
      this.playerBullets.add(bullet);
      this.playerBulletPool.push(bullet);
      
      const body = bullet.body as Phaser.Physics.Arcade.Body;
      body.setSize(6, 12);
    }
    
    return bullet;
  }

  private getEnemyBullet(): Phaser.GameObjects.Sprite {
    let bullet = this.enemyBulletPool.find((b) => !b.active);
    
    if (!bullet) {
      bullet = this.scene.add.sprite(0, 0, 'enemy-bullet');
      this.scene.physics.add.existing(bullet);
      this.enemyBullets.add(bullet);
      this.enemyBulletPool.push(bullet);
      
      const body = bullet.body as Phaser.Physics.Arcade.Body;
      body.setCircle(4);
    }
    
    return bullet;
  }

  private returnPlayerBullet(bullet: Phaser.GameObjects.Sprite): void {
    bullet.setActive(false);
    bullet.setVisible(false);
    const body = bullet.body as Phaser.Physics.Arcade.Body;
    body.setVelocity(0, 0);
  }

  private returnEnemyBullet(bullet: Phaser.GameObjects.Sprite): void {
    bullet.setActive(false);
    bullet.setVisible(false);
    const body = bullet.body as Phaser.Physics.Arcade.Body;
    body.setVelocity(0, 0);
  }
}
