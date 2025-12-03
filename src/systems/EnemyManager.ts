import Phaser from 'phaser';
import { GameConfig, Difficulty } from '@config/GameConfig';
import { GameScene } from '@scenes/GameScene';
import { Enemy, EnemyConfig } from '@entities/Enemy';

interface StageData {
  id: number;
  name: string;
  duration: number;
  enemies: Array<{
    type: string;
    spawnTime: number;
    count: number;
    pattern: string;
  }>;
  boss: {
    name: string;
    hp: number;
    spellCards: Array<{
      name: string;
      duration: number;
      pattern: string;
    }>;
  };
}

/**
 * 敵管理システム
 */
export class EnemyManager {
  private scene: GameScene;
  private difficulty: Difficulty;
  private enemies: Phaser.GameObjects.Group;
  private stageStartTime = 0;
  private currentStage?: StageData;
  private spawnedWaves: Set<number> = new Set();

  constructor(scene: GameScene, difficulty: Difficulty) {
    this.scene = scene;
    this.difficulty = difficulty;

    this.enemies = scene.add.group({
      classType: Enemy,
      runChildUpdate: true,
    });
  }

  update(time: number, _delta: number): void {
    if (!this.currentStage) return;

    const elapsedTime = time - this.stageStartTime;

    // 敵の出現スケジュール
    this.currentStage.enemies.forEach((wave, index) => {
      if (elapsedTime >= wave.spawnTime && !this.spawnedWaves.has(index)) {
        this.spawnWave(wave);
        this.spawnedWaves.add(index);
      }
    });

    // ボス出現チェック
    if (elapsedTime >= this.currentStage.duration && this.getActiveEnemyCount() === 0) {
      this.spawnBoss();
    }
  }

  public startStage(stage: StageData): void {
    this.currentStage = stage;
    this.stageStartTime = this.scene.time.now;
    this.spawnedWaves.clear();
  }

  private spawnWave(wave: { type: string; count: number; pattern: string }): void {
    const config = this.getEnemyConfig(wave.type);
    
    switch (wave.pattern) {
      case 'wave':
        // 横一列に出現
        for (let i = 0; i < wave.count; i++) {
          const x = (GameConfig.GAME_WIDTH / (wave.count + 1)) * (i + 1);
          this.createEnemy(x, -30, config, 'straight', 'aimed');
        }
        break;

      case 'circle': {
        // 円形に出現
        const radius = 80;
        const centerX = GameConfig.GAME_WIDTH / 2;
        const centerY = 50;
        for (let i = 0; i < wave.count; i++) {
          const angle = (Math.PI * 2 * i) / wave.count;
          const x = centerX + Math.cos(angle) * radius;
          const y = centerY + Math.sin(angle) * radius;
          this.createEnemy(x, y, config, 'circle', 'spread');
        }
        break;
      }

      case 'spiral': {
        // スパイラル出現
        for (let i = 0; i < wave.count; i++) {
          this.scene.time.delayedCall(i * 300, () => {
            const angle = (i / wave.count) * Math.PI * 4;
            const radius = 50 + i * 10;
            const x = GameConfig.GAME_WIDTH / 2 + Math.cos(angle) * radius;
            const y = -30;
            this.createEnemy(x, y, config, 'wave', 'aimed');
          });
        }
        break;
      }

      case 'random': {
        // ランダム出現
        for (let i = 0; i < wave.count; i++) {
          this.scene.time.delayedCall(i * 500, () => {
            const x = Phaser.Math.Between(50, GameConfig.GAME_WIDTH - 50);
            this.createEnemy(x, -30, config, 'zigzag', 'spread');
          });
        }
        break;
      }
    }
  }

  private createEnemy(
    x: number,
    y: number,
    config: EnemyConfig,
    movePattern: 'straight' | 'wave' | 'circle' | 'zigzag',
    bulletPattern: string
  ): Enemy {
    const enemy = new Enemy(this.scene, x, y, config);
    enemy.setMovePattern(movePattern);
    enemy.setBulletPattern(bulletPattern);
    
    // 難易度補正
    const difficultyConfig = GameConfig.DIFFICULTY[this.difficulty];
    enemy.hp *= difficultyConfig.ENEMY_HP_MULTIPLIER;
    
    this.enemies.add(enemy);
    return enemy;
  }

  private spawnBoss(): void {
    if (!this.currentStage) return;

    const boss = this.currentStage.boss;
    const config: EnemyConfig = {
      type: 'boss',
      hp: boss.hp,
      score: GameConfig.SCORE.BOSS,
      texture: 'boss',
    };

    const bossEnemy = this.createEnemy(
      GameConfig.GAME_WIDTH / 2,
      -50,
      config,
      'circle',
      'circle'
    );

    // ボス専用設定
    bossEnemy.setShootInterval(2000);

    // ボス登場演出
    this.scene.tweens.add({
      targets: bossEnemy,
      y: 100,
      duration: 2000,
      ease: 'Power2',
    });

    // ボス名表示
    const bossNameText = this.scene.add.text(
      GameConfig.GAME_WIDTH / 2,
      150,
      boss.name,
      {
        fontSize: '32px',
        color: '#ff0000',
        fontStyle: 'bold',
      }
    );
    bossNameText.setOrigin(0.5);

    this.scene.tweens.add({
      targets: bossNameText,
      alpha: 0,
      duration: 2000,
      delay: 2000,
      onComplete: () => bossNameText.destroy(),
    });
  }

  private getEnemyConfig(type: string): EnemyConfig {
    switch (type) {
      case 'fairy_blue':
      case 'fairy_red':
      case 'fairy_green':
        return {
          type: 'basic',
          hp: GameConfig.ENEMY.BASIC_HP,
          score: GameConfig.SCORE.ENEMY_BASIC,
          texture: 'enemy-basic',
        };

      case 'book_spirit':
        return {
          type: 'elite',
          hp: GameConfig.ENEMY.ELITE_HP,
          score: GameConfig.SCORE.ENEMY_ELITE,
          texture: 'enemy-elite',
        };

      default:
        return {
          type: 'basic',
          hp: GameConfig.ENEMY.BASIC_HP,
          score: GameConfig.SCORE.ENEMY_BASIC,
          texture: 'enemy-basic',
        };
    }
  }

  public getEnemies(): Phaser.GameObjects.Group {
    return this.enemies;
  }

  private getActiveEnemyCount(): number {
    return this.enemies.getLength();
  }
}
