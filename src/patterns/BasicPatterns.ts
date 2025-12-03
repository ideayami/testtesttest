import { BulletManager } from '@systems/BulletManager';

/**
 * 基本的な弾幕パターン集
 */
export class BasicPatterns {
  /**
   * 円形弾幕
   */
  static circle(
    bulletManager: BulletManager,
    x: number,
    y: number,
    bulletCount: number,
    speed: number,
    offset: number = 0
  ): void {
    for (let i = 0; i < bulletCount; i++) {
      const angle = (Math.PI * 2 * i) / bulletCount + offset;
      const dirX = Math.cos(angle);
      const dirY = Math.sin(angle);
      bulletManager.createEnemyBullet(x, y, dirX, dirY, speed);
    }
  }

  /**
   * スパイラル弾幕
   */
  static spiral(
    bulletManager: BulletManager,
    x: number,
    y: number,
    arms: number,
    speed: number,
    rotation: number
  ): void {
    for (let i = 0; i < arms; i++) {
      const angle = (Math.PI * 2 * i) / arms + rotation;
      const dirX = Math.cos(angle);
      const dirY = Math.sin(angle);
      bulletManager.createEnemyBullet(x, y, dirX, dirY, speed);
    }
  }

  /**
   * 扇状弾幕
   */
  static fan(
    bulletManager: BulletManager,
    x: number,
    y: number,
    bulletCount: number,
    startAngle: number,
    endAngle: number,
    speed: number
  ): void {
    const angleStep = (endAngle - startAngle) / (bulletCount - 1);
    
    for (let i = 0; i < bulletCount; i++) {
      const angle = startAngle + angleStep * i;
      const dirX = Math.cos(angle);
      const dirY = Math.sin(angle);
      bulletManager.createEnemyBullet(x, y, dirX, dirY, speed);
    }
  }

  /**
   * ランダム弾幕
   */
  static random(
    bulletManager: BulletManager,
    x: number,
    y: number,
    bulletCount: number,
    minSpeed: number,
    maxSpeed: number
  ): void {
    for (let i = 0; i < bulletCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = minSpeed + Math.random() * (maxSpeed - minSpeed);
      const dirX = Math.cos(angle);
      const dirY = Math.sin(angle);
      bulletManager.createEnemyBullet(x, y, dirX, dirY, speed);
    }
  }

  /**
   * 波状弾幕
   */
  static wave(
    bulletManager: BulletManager,
    x: number,
    y: number,
    bulletCount: number,
    amplitude: number,
    frequency: number,
    speed: number,
    baseAngle: number = Math.PI / 2
  ): void {
    for (let i = 0; i < bulletCount; i++) {
      const offset = Math.sin(i * frequency) * amplitude;
      const angle = baseAngle + offset;
      const dirX = Math.cos(angle);
      const dirY = Math.sin(angle);
      
      // 横方向の位置をずらす
      const offsetX = (i - bulletCount / 2) * 15;
      
      bulletManager.createEnemyBullet(x + offsetX, y, dirX, dirY, speed);
    }
  }

  /**
   * レーザー状弾幕（密集した直線）
   */
  static laser(
    bulletManager: BulletManager,
    x: number,
    y: number,
    angle: number,
    length: number,
    speed: number
  ): void {
    const dirX = Math.cos(angle);
    const dirY = Math.sin(angle);
    
    const bulletCount = Math.floor(length / 5);
    
    for (let i = 0; i < bulletCount; i++) {
      const offsetX = dirX * i * 5;
      const offsetY = dirY * i * 5;
      bulletManager.createEnemyBullet(x + offsetX, y + offsetY, dirX, dirY, speed);
    }
  }

  /**
   * 十字弾幕
   */
  static cross(
    bulletManager: BulletManager,
    x: number,
    y: number,
    speed: number,
    thickness: number = 1
  ): void {
    const directions = [
      { x: 1, y: 0 },   // 右
      { x: -1, y: 0 },  // 左
      { x: 0, y: 1 },   // 下
      { x: 0, y: -1 },  // 上
    ];

    directions.forEach((dir) => {
      for (let i = 0; i < thickness; i++) {
        const offset = (i - thickness / 2) * 10;
        const perpX = -dir.y;
        const perpY = dir.x;
        
        bulletManager.createEnemyBullet(
          x + perpX * offset,
          y + perpY * offset,
          dir.x,
          dir.y,
          speed
        );
      }
    });
  }

  /**
   * 花びら状弾幕
   */
  static flower(
    bulletManager: BulletManager,
    x: number,
    y: number,
    petals: number,
    speed: number,
    rotation: number = 0
  ): void {
    for (let i = 0; i < petals; i++) {
      const baseAngle = (Math.PI * 2 * i) / petals + rotation;
      
      // 各花びらに複数の弾
      for (let j = 0; j < 5; j++) {
        const angle = baseAngle + (j - 2) * 0.1;
        const dirX = Math.cos(angle);
        const dirY = Math.sin(angle);
        const bulletSpeed = speed * (1 + j * 0.1);
        bulletManager.createEnemyBullet(x, y, dirX, dirY, bulletSpeed);
      }
    }
  }

  /**
   * リング弾幕（複数の円形を重ねる）
   */
  static ring(
    bulletManager: BulletManager,
    x: number,
    y: number,
    rings: number,
    bulletsPerRing: number,
    baseSpeed: number
  ): void {
    for (let ring = 0; ring < rings; ring++) {
      const speed = baseSpeed + ring * 0.5;
      const offset = (Math.PI * 2 * ring) / rings;
      
      this.circle(bulletManager, x, y, bulletsPerRing, speed, offset);
    }
  }

  /**
   * 渦巻き弾幕
   */
  static vortex(
    bulletManager: BulletManager,
    x: number,
    y: number,
    bulletCount: number,
    rotationSpeed: number,
    speed: number
  ): void {
    for (let i = 0; i < bulletCount; i++) {
      const angle = i * rotationSpeed;
      const distance = i * 2;
      const spawnX = x + Math.cos(angle) * distance;
      const spawnY = y + Math.sin(angle) * distance;
      
      const dirAngle = angle + Math.PI / 2;
      const dirX = Math.cos(dirAngle);
      const dirY = Math.sin(dirAngle);
      
      bulletManager.createEnemyBullet(spawnX, spawnY, dirX, dirY, speed);
    }
  }
}
