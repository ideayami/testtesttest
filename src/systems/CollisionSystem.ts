import Phaser from 'phaser';
import { GameConfig } from '@config/GameConfig';
import { GameScene } from '@scenes/GameScene';

/**
 * 衝突判定システム
 */
export class CollisionSystem {
  private scene: GameScene;

  constructor(scene: GameScene) {
    this.scene = scene;
  }

  update(): void {
    const player = this.scene.getPlayer();
    const bulletManager = this.scene.getBulletManager();
    const enemyManager = (this.scene as any).enemyManager;

    if (!player || !bulletManager || !enemyManager) return;

    // プレイヤー弾 vs 敵
    this.checkPlayerBulletsVsEnemies(bulletManager, enemyManager);

    // 敵弾 vs プレイヤー
    this.checkEnemyBulletsVsPlayer(bulletManager, player);

    // 敵 vs プレイヤー（体当たり）
    this.checkEnemiesVsPlayer(enemyManager, player);

    // グレイズ判定
    this.checkGraze(bulletManager, player);
  }

  private checkPlayerBulletsVsEnemies(bulletManager: any, enemyManager: any): void {
    const playerBullets = bulletManager.getPlayerBullets();
    const enemies = enemyManager.getEnemies();

    playerBullets.children.each((bullet: any) => {
      if (!bullet.active) return true;

      enemies.children.each((enemy: any) => {
        if (!enemy.active) return true;

        if (this.checkCollision(bullet, enemy, 16)) {
          // ヒット処理
          enemy.takeDamage(GameConfig.BULLET.PLAYER_DAMAGE);
          bullet.setActive(false);
          bullet.setVisible(false);

          // ヒットエフェクト
          const hitEffect = this.scene.add.circle(bullet.x, bullet.y, 8, 0xffff00, 0.8);
          this.scene.tweens.add({
            targets: hitEffect,
            radius: 16,
            alpha: 0,
            duration: 150,
            onComplete: () => hitEffect.destroy(),
          });
        }
        return true;
      });
      return true;
    });
  }

  private checkEnemyBulletsVsPlayer(bulletManager: any, player: any): void {
    if (player.isInvincible) return;

    const enemyBullets = bulletManager.getEnemyBullets();
    const hitboxRadius = player.getHitboxRadius();

    enemyBullets.children.each((bullet: any) => {
      if (!bullet.active) return true;

      if (this.checkCollision(bullet, player, hitboxRadius + 4)) {
        // プレイヤーヒット
        this.scene.playerHit();

        // 弾を削除
        bullet.setActive(false);
        bullet.setVisible(false);

        // ヒットエフェクト
        const hitEffect = this.scene.add.circle(player.x, player.y, 20, 0xff0000, 0.8);
        this.scene.tweens.add({
          targets: hitEffect,
          radius: 40,
          alpha: 0,
          duration: 300,
          onComplete: () => hitEffect.destroy(),
        });
      }
      return true;
    });
  }

  private checkEnemiesVsPlayer(enemyManager: any, player: any): void {
    if (player.isInvincible) return;

    const enemies = enemyManager.getEnemies();

    enemies.children.each((enemy: any) => {
      if (!enemy.active) return true;

      if (this.checkCollision(enemy, player, 20)) {
        // プレイヤーヒット
        this.scene.playerHit();

        // 敵もダメージ
        enemy.takeDamage(enemy.hp * 0.5);
      }
      return true;
    });
  }

  private checkGraze(bulletManager: any, player: any): void {
    const enemyBullets = bulletManager.getEnemyBullets();
    const grazeRadius = 20; // グレイズ判定半径

    enemyBullets.children.each((bullet: any) => {
      if (!bullet.active) return true;

      // まだグレイズしていない弾のみ
      if (bullet.getData('grazed')) return true;

      const distance = Phaser.Math.Distance.Between(
        bullet.x,
        bullet.y,
        player.x,
        player.y
      );

      if (distance < grazeRadius) {
        // グレイズ成功
        bullet.setData('grazed', true);
        this.scene.addGraze();

        // グレイズエフェクト
        const grazeEffect = this.scene.add.circle(bullet.x, bullet.y, 15, 0x00ffff, 0.5);
        this.scene.tweens.add({
          targets: grazeEffect,
          radius: 25,
          alpha: 0,
          duration: 200,
          onComplete: () => grazeEffect.destroy(),
        });
      }
      return true;
    });
  }

  private checkCollision(
    obj1: Phaser.GameObjects.Sprite,
    obj2: Phaser.GameObjects.Sprite,
    threshold: number
  ): boolean {
    const distance = Phaser.Math.Distance.Between(obj1.x, obj1.y, obj2.x, obj2.y);
    return distance < threshold;
  }
}
