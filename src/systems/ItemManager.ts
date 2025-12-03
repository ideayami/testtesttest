import Phaser from 'phaser';
import { GameConfig } from '@config/GameConfig';
import { GameScene } from '@scenes/GameScene';

export type ItemType = 'power' | 'point' | 'life' | 'bomb';

/**
 * アイテム管理システム
 */
export class ItemManager {
  private scene: GameScene;
  private items: Phaser.GameObjects.Group;

  constructor(scene: GameScene) {
    this.scene = scene;

    this.items = scene.add.group({
      classType: Phaser.GameObjects.Sprite,
      runChildUpdate: false,
    });
  }

  update(_time: number, _delta: number): void {
    const player = this.scene.getPlayer();

    this.items.children.each((item) => {
      const itemSprite = item as Phaser.GameObjects.Sprite;
      if (!itemSprite.active) return true;

      const body = itemSprite.body as Phaser.Physics.Arcade.Body;

      // プレイヤーに向かって移動（吸引範囲内）
      const distance = Phaser.Math.Distance.Between(
        itemSprite.x,
        itemSprite.y,
        player.x,
        player.y
      );

      if (distance < 60) {
        const angle = Phaser.Math.Angle.Between(
          itemSprite.x,
          itemSprite.y,
          player.x,
          player.y
        );
        body.setVelocity(Math.cos(angle) * 200, Math.sin(angle) * 200);
      } else {
        // 通常は下に落ちる
        body.setVelocityY(100);
        body.setVelocityX(0);
      }

      // アイテム取得判定
      if (distance < 20) {
        this.collectItem(itemSprite);
      }

      // 画面外で削除
      if (itemSprite.y > GameConfig.GAME_HEIGHT + 20) {
        itemSprite.setActive(false);
        itemSprite.setVisible(false);
      }

      return true;
    });
  }

  public createItem(x: number, y: number, type: ItemType): void {
    const item = this.items.get(x, y);
    
    if (!item) {
      const newItem = this.scene.add.sprite(x, y, this.getTextureForType(type));
      this.scene.physics.add.existing(newItem);
      newItem.setData('itemType', type);
      this.items.add(newItem);
      return;
    }

    const itemSprite = item as Phaser.GameObjects.Sprite;
    itemSprite.setTexture(this.getTextureForType(type));
    itemSprite.setData('itemType', type);
    itemSprite.setActive(true);
    itemSprite.setVisible(true);

    const body = itemSprite.body as Phaser.Physics.Arcade.Body;
    body.setVelocity(0, 50);

    // 出現エフェクト
    itemSprite.setScale(0);
    this.scene.tweens.add({
      targets: itemSprite,
      scale: 1,
      duration: 200,
      ease: 'Back.easeOut',
    });
  }

  private collectItem(item: Phaser.GameObjects.Sprite): void {
    const type = item.getData('itemType') as ItemType;

    switch (type) {
      case 'power':
        this.scene.power = Math.min(100, this.scene.power + 1);
        this.scene.addScore(100);
        break;

      case 'point':
        this.scene.addScore(500);
        break;

      case 'life':
        this.scene.lives = Math.min(8, this.scene.lives + 1) as any;
        break;

      case 'bomb':
        this.scene.bombs = Math.min(8, this.scene.bombs + 1) as any;
        break;
    }

    // 取得エフェクト
    const collectEffect = this.scene.add.circle(item.x, item.y, 10, 0xffff00, 0.8);
    this.scene.tweens.add({
      targets: collectEffect,
      radius: 30,
      alpha: 0,
      duration: 300,
      onComplete: () => collectEffect.destroy(),
    });

    // アイテムを非アクティブに
    item.setActive(false);
    item.setVisible(false);
  }

  private getTextureForType(type: ItemType): string {
    switch (type) {
      case 'power':
        return 'power-item';
      case 'point':
        return 'point-item';
      case 'life':
        return 'power-item'; // 同じテクスチャを使用
      case 'bomb':
        return 'power-item'; // 同じテクスチャを使用
      default:
        return 'power-item';
    }
  }

  public getItems(): Phaser.GameObjects.Group {
    return this.items;
  }
}
