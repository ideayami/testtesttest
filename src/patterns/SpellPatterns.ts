import { BulletManager } from '@systems/BulletManager';
import { BasicPatterns } from './BasicPatterns';

/**
 * スペルカード専用の複雑な弾幕パターン
 */
export class SpellPatterns {
  /**
   * 氷符「アイシクルフォール」
   * つららが降り注ぐパターン
   */
  static icicleFall(
    bulletManager: BulletManager,
    _x: number,
    _y: number,
    time: number
  ): void {
    // 上部から氷柱が降ってくる
    const icicleCount = 8;
    for (let i = 0; i < icicleCount; i++) {
      const spawnX = (i + 1) * (400 / (icicleCount + 1));
      const phase = Math.sin(time * 0.001 + i) * 0.5 + 0.5;
      
      if (Math.random() < 0.1 * phase) {
        // 垂直に落ちる
        bulletManager.createEnemyBullet(spawnX, 0, 0, 1, 3);
        
        // 少し散らばる
        bulletManager.createEnemyBullet(spawnX, 0, 0.1, 1, 2.5);
        bulletManager.createEnemyBullet(spawnX, 0, -0.1, 1, 2.5);
      }
    }
  }

  /**
   * 凍符「パーフェクトフリーズ」
   * 全方位凍結弾幕
   */
  static perfectFreeze(
    bulletManager: BulletManager,
    x: number,
    y: number,
    time: number
  ): void {
    const phase = Math.floor(time / 1000) % 3;
    
    if (time % 500 < 50) {
      switch (phase) {
        case 0:
          // 円形弾幕
          BasicPatterns.circle(bulletManager, x, y, 16, 2, time * 0.001);
          break;
        case 1:
          // ダブル円形
          BasicPatterns.circle(bulletManager, x, y, 12, 2.5, time * 0.001);
          BasicPatterns.circle(bulletManager, x, y, 12, 1.5, time * 0.001 + Math.PI / 12);
          break;
        case 2:
          // 花びら型
          BasicPatterns.flower(bulletManager, x, y, 6, 2, time * 0.001);
          break;
      }
    }
  }

  /**
   * 華符「彩光蓮華掌」
   * 虹色の蓮の花弾幕
   */
  static rainbowLotus(
    bulletManager: BulletManager,
    x: number,
    y: number,
    time: number
  ): void {
    if (time % 800 < 50) {
      // 中心から広がる花びら
      const petals = 8;
      for (let i = 0; i < petals; i++) {
        const angle = (Math.PI * 2 * i) / petals + time * 0.001;
        
        // 各花びらに複数段階の弾
        for (let layer = 0; layer < 3; layer++) {
          const speed = 1.5 + layer * 0.5;
          const spread = 0.2;
          
          bulletManager.createEnemyBullet(
            x,
            y,
            Math.cos(angle - spread),
            Math.sin(angle - spread),
            speed
          );
          bulletManager.createEnemyBullet(
            x,
            y,
            Math.cos(angle),
            Math.sin(angle),
            speed
          );
          bulletManager.createEnemyBullet(
            x,
            y,
            Math.cos(angle + spread),
            Math.sin(angle + spread),
            speed
          );
        }
      }
    }
  }

  /**
   * 気符「猛虎餓龍」
   * 龍のような軌道の弾幕
   */
  static tigerDragon(
    bulletManager: BulletManager,
    x: number,
    y: number,
    time: number
  ): void {
    if (time % 200 < 50) {
      // 螺旋状に広がる
      const arms = 4;
      const rotation = time * 0.002;
      
      for (let i = 0; i < arms; i++) {
        const angle = (Math.PI * 2 * i) / arms + rotation;
        
        // 曲線を描くように複数の弾を連続発射
        for (let j = 0; j < 5; j++) {
          const distance = j * 10;
          const spawnX = x + Math.cos(angle) * distance;
          const spawnY = y + Math.sin(angle) * distance;
          
          const bulletAngle = angle + Math.PI / 4;
          bulletManager.createEnemyBullet(
            spawnX,
            spawnY,
            Math.cos(bulletAngle),
            Math.sin(bulletAngle),
            2.5
          );
        }
      }
    }
  }

  /**
   * 火水木金土符「賢者の石」
   * 五行を表す複雑な弾幕
   */
  static fiveElements(
    bulletManager: BulletManager,
    x: number,
    y: number,
    time: number
  ): void {
    const element = Math.floor(time / 2000) % 5;
    
    if (time % 600 < 50) {
      switch (element) {
        case 0: // 火
          BasicPatterns.spiral(bulletManager, x, y, 5, 3, time * 0.003);
          break;
        case 1: // 水
          BasicPatterns.wave(bulletManager, x, y, 10, 0.3, 0.5, 2, Math.PI / 2);
          break;
        case 2: // 木
          BasicPatterns.flower(bulletManager, x, y, 5, 2.5, time * 0.002);
          break;
        case 3: // 金
          BasicPatterns.cross(bulletManager, x, y, 3, 3);
          break;
        case 4: // 土
          BasicPatterns.ring(bulletManager, x, y, 3, 12, 1.5);
          break;
      }
    }
  }

  /**
   * 日符「ロイヤルフレア」
   * 太陽の炎のような全方位弾幕
   */
  static royalFlare(
    bulletManager: BulletManager,
    x: number,
    y: number,
    time: number
  ): void {
    if (time % 400 < 50) {
      // 内側と外側の二重リング
      const innerRings = 16;
      const outerRings = 24;
      const rotation = time * 0.002;
      
      // 内側リング - 速い
      BasicPatterns.circle(bulletManager, x, y, innerRings, 3.5, rotation);
      
      // 外側リング - 遅い
      BasicPatterns.circle(bulletManager, x, y, outerRings, 1.5, rotation + Math.PI / outerRings);
      
      // 追加の十字レーザー
      if (time % 1200 < 50) {
        BasicPatterns.cross(bulletManager, x, y, 4, 5);
      }
    }
  }

  /**
   * カスタムスペルカード実行
   */
  static executeSpellCard(
    bulletManager: BulletManager,
    spellName: string,
    x: number,
    y: number,
    time: number
  ): void {
    switch (spellName) {
      case 'icicle_fall':
        this.icicleFall(bulletManager, x, y, time);
        break;
      case 'perfect_freeze':
        this.perfectFreeze(bulletManager, x, y, time);
        break;
      case 'rainbow_lotus':
        this.rainbowLotus(bulletManager, x, y, time);
        break;
      case 'tiger_dragon':
        this.tigerDragon(bulletManager, x, y, time);
        break;
      case 'five_elements':
        this.fiveElements(bulletManager, x, y, time);
        break;
      case 'royal_flare':
        this.royalFlare(bulletManager, x, y, time);
        break;
      default:
        // デフォルトパターン
        BasicPatterns.circle(bulletManager, x, y, 12, 2, time * 0.001);
        break;
    }
  }
}
