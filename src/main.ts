import Phaser from 'phaser';
import { BootScene } from '@scenes/BootScene';
import { TitleScene } from '@scenes/TitleScene';
import { GameScene } from '@scenes/GameScene';
import { UIScene } from '@scenes/UIScene';
import { PauseScene } from '@scenes/PauseScene';
import { GameOverScene } from '@scenes/GameOverScene';
import { GameConfig } from '@config/GameConfig';

console.log('🎮 ゲーム初期化開始...');
console.log('Phaser version:', Phaser.VERSION);
console.log('Game config:', GameConfig);

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: GameConfig.WIDTH,
  height: GameConfig.HEIGHT,
  parent: 'game-container',
  backgroundColor: '#000000',
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { x: 0, y: 0 },
      debug: false,
    },
  },
  scene: [BootScene, TitleScene, GameScene, UIScene, PauseScene, GameOverScene],
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  render: {
    pixelArt: false,
    antialias: true,
  },
};

console.log('Phaser config:', config);

window.addEventListener('load', () => {
  console.log('✅ Window loaded, creating Phaser game...');
  try {
    const game = new Phaser.Game(config);
    console.log('✅ Phaser game created successfully!', game);
  } catch (error) {
    console.error('❌ Failed to create Phaser game:', error);
  }
});
