import { GameConfig } from '../src/config/GameConfig';

describe('GameConfig', () => {
  describe('Player Settings', () => {
    it('should have valid speed values', () => {
      expect(GameConfig.PLAYER.SPEED_NORMAL).toBeGreaterThan(0);
      expect(GameConfig.PLAYER.SPEED_FOCUSED).toBeGreaterThan(0);
      expect(GameConfig.PLAYER.SPEED_FOCUSED).toBeLessThan(
        GameConfig.PLAYER.SPEED_NORMAL
      );
    });

    it('should have valid initial lives and bombs', () => {
      expect(GameConfig.PLAYER.LIVES).toBeGreaterThanOrEqual(1);
      expect(GameConfig.PLAYER.BOMB_COUNT).toBeGreaterThanOrEqual(1);
    });

    it('should have valid hitbox radius', () => {
      expect(GameConfig.PLAYER.HITBOX_RADIUS).toBeGreaterThan(0);
      expect(GameConfig.PLAYER.HITBOX_RADIUS).toBeLessThan(10);
    });
  });

  describe('Bullet Settings', () => {
    it('should have valid bullet speeds', () => {
      expect(GameConfig.BULLET.PLAYER_SPEED).toBeGreaterThan(0);
      expect(GameConfig.BULLET.ENEMY_SPEED_NORMAL).toBeGreaterThan(0);
      expect(GameConfig.BULLET.ENEMY_SPEED_SLOW).toBeLessThan(
        GameConfig.BULLET.ENEMY_SPEED_NORMAL
      );
      expect(GameConfig.BULLET.ENEMY_SPEED_FAST).toBeGreaterThan(
        GameConfig.BULLET.ENEMY_SPEED_NORMAL
      );
    });

    it('should have maximum bullet limit', () => {
      expect(GameConfig.BULLET.MAX_BULLETS).toBeGreaterThan(100);
      expect(GameConfig.BULLET.MAX_BULLETS).toBeLessThanOrEqual(5000);
    });
  });

  describe('Difficulty Settings', () => {
    it('should have all difficulty levels', () => {
      expect(GameConfig.DIFFICULTY.EASY).toBeDefined();
      expect(GameConfig.DIFFICULTY.NORMAL).toBeDefined();
      expect(GameConfig.DIFFICULTY.HARD).toBeDefined();
      expect(GameConfig.DIFFICULTY.LUNATIC).toBeDefined();
    });

    it('should have valid difficulty multipliers', () => {
      const difficulties = ['EASY', 'NORMAL', 'HARD', 'LUNATIC'] as const;

      difficulties.forEach((diff) => {
        const config = GameConfig.DIFFICULTY[diff];
        expect(config.BULLET_SPEED_MULTIPLIER).toBeGreaterThan(0);
        expect(config.ENEMY_HP_MULTIPLIER).toBeGreaterThan(0);
        expect(config.PLAYER_DAMAGE_MULTIPLIER).toBeGreaterThan(0);
      });
    });

    it('should increase difficulty progressively', () => {
      const easy = GameConfig.DIFFICULTY.EASY;
      const normal = GameConfig.DIFFICULTY.NORMAL;
      const hard = GameConfig.DIFFICULTY.HARD;

      expect(easy.BULLET_SPEED_MULTIPLIER).toBeLessThan(
        normal.BULLET_SPEED_MULTIPLIER
      );
      expect(normal.BULLET_SPEED_MULTIPLIER).toBeLessThan(
        hard.BULLET_SPEED_MULTIPLIER
      );

      expect(easy.ENEMY_HP_MULTIPLIER).toBeLessThan(normal.ENEMY_HP_MULTIPLIER);
      expect(normal.ENEMY_HP_MULTIPLIER).toBeLessThan(hard.ENEMY_HP_MULTIPLIER);
    });
  });

  describe('Score Settings', () => {
    it('should have valid score values', () => {
      expect(GameConfig.SCORE.ENEMY_BASIC).toBeGreaterThan(0);
      expect(GameConfig.SCORE.ENEMY_ELITE).toBeGreaterThan(
        GameConfig.SCORE.ENEMY_BASIC
      );
      expect(GameConfig.SCORE.BOSS).toBeGreaterThan(GameConfig.SCORE.ENEMY_ELITE);
    });

    it('should have graze bonus', () => {
      expect(GameConfig.SCORE.GRAZE_POINT).toBeGreaterThan(0);
    });
  });

  describe('Screen Dimensions', () => {
    it('should have valid screen dimensions', () => {
      expect(GameConfig.WIDTH).toBeGreaterThan(0);
      expect(GameConfig.HEIGHT).toBeGreaterThan(0);
      expect(GameConfig.GAME_WIDTH).toBeGreaterThan(0);
      expect(GameConfig.GAME_HEIGHT).toBeGreaterThan(0);
    });

    it('should have game area smaller than total screen', () => {
      expect(GameConfig.GAME_WIDTH).toBeLessThan(GameConfig.WIDTH);
      expect(GameConfig.GAME_HEIGHT).toBeLessThan(GameConfig.HEIGHT);
    });
  });
});
