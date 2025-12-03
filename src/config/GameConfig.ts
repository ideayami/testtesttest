/**
 * ゲーム全体の設定
 */
export const GameConfig = {
  // 画面設定
  WIDTH: 640,
  HEIGHT: 480,
  GAME_WIDTH: 384,  // プレイエリア幅
  GAME_HEIGHT: 448, // プレイエリア高さ
  UI_WIDTH: 256,    // UI領域幅

  // プレイヤー設定
  PLAYER: {
    SPEED_NORMAL: 4.5,
    SPEED_FOCUSED: 2.0,
    SHOT_INTERVAL: 100,  // ミリ秒
    BOMB_COUNT: 3,
    HITBOX_RADIUS: 2,
    INVINCIBLE_TIME: 2000, // 被弾後の無敵時間
    LIVES: 3,
  },

  // 敵設定
  ENEMY: {
    BASIC_HP: 10,
    ELITE_HP: 50,
    BOSS_HP: 3000,
  },

  // 弾幕設定
  BULLET: {
    PLAYER_DAMAGE: 10,
    PLAYER_SPEED: 8,
    ENEMY_SPEED_SLOW: 1.5,
    ENEMY_SPEED_NORMAL: 3.0,
    ENEMY_SPEED_FAST: 5.0,
    MAX_BULLETS: 2000, // 画面内最大弾数
  },

  // スコア設定
  SCORE: {
    ENEMY_BASIC: 100,
    ENEMY_ELITE: 500,
    BOSS: 10000,
    SPELL_CARD_BONUS: 5000,
    GRAZE_POINT: 10,
  },

  // パワーアップ設定
  POWER: {
    MAX_LEVEL: 4,
    ITEMS_PER_LEVEL: 5,
  },

  // ゲームバランス
  DIFFICULTY: {
    EASY: {
      BULLET_SPEED_MULTIPLIER: 0.8,
      ENEMY_HP_MULTIPLIER: 0.7,
      PLAYER_DAMAGE_MULTIPLIER: 1.3,
    },
    NORMAL: {
      BULLET_SPEED_MULTIPLIER: 1.0,
      ENEMY_HP_MULTIPLIER: 1.0,
      PLAYER_DAMAGE_MULTIPLIER: 1.0,
    },
    HARD: {
      BULLET_SPEED_MULTIPLIER: 1.2,
      ENEMY_HP_MULTIPLIER: 1.5,
      PLAYER_DAMAGE_MULTIPLIER: 0.8,
    },
    LUNATIC: {
      BULLET_SPEED_MULTIPLIER: 1.5,
      ENEMY_HP_MULTIPLIER: 2.0,
      PLAYER_DAMAGE_MULTIPLIER: 0.6,
    },
  },

  // 色定義
  COLORS: {
    PRIMARY: 0x4a90e2,
    DANGER: 0xe74c3c,
    SUCCESS: 0x2ecc71,
    WARNING: 0xf39c12,
    PLAYER_BULLET: 0x00ffff,
    ENEMY_BULLET: 0xff6b6b,
    BOSS_BULLET: 0xff0000,
  },

  // 物理設定
  PHYSICS: {
    GRAVITY: 0,
    BOUNDS_PADDING: 10,
  },
} as const;

export type Difficulty = keyof typeof GameConfig.DIFFICULTY;
