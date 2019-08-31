import { Engine, Scene } from 'babylonjs';
import TWEEN from '@tweenjs/tween.js';
import { Updateables } from './Utils/Updateable';

export default class Game {
  private static instance: Game;
  public static canvas: HTMLCanvasElement;
  public static engine: Engine;
  public static scene: Scene;

  private constructor() {
      // Get the canvas DOM element
    Game.canvas = document.getElementById('renderCanvas') as HTMLCanvasElement;
    Game.engine = new Engine(Game.canvas, true, { preserveDrawingBuffer: true, stencil: true });
    // the canvas/window resize event handler
    console.info("setting window resize handler");
    window.addEventListener('resize', function () {
        Game.engine.resize();
    });
    Game.init();
  }

  private static init() {
    console.info("initing scene");
    // Create a basic BJS Scene object
    Game.scene = new Scene(Game.engine);
    Game.scene.beforeRender = function() {
        const delta = Game.engine.getDeltaTime();
        TWEEN.update();
        Updateables.getInstance().update(delta / 1000);
    }

    // run the render loop
    console.info("setting engine.runRenderLoop");
    Game.engine.runRenderLoop(function () {
        Game.scene.render();
    });
  }

  static getInstance() {
    if(!Game.instance) {
      Game.instance = new Game();
    }
    return Game.instance;
  }
}