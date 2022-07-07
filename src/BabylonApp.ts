import { AdvancedDynamicTexture, Button, Control } from '@babylonjs/gui';
import {
  DirectionalLight,
  Engine,
  MeshBuilder,
  Scene,
  Vector3,
  WebXRDefaultExperience,
} from '@babylonjs/core';

export default class BabylonApp {
  private engine: Engine;

  private scene: Scene;

  private xr?: WebXRDefaultExperience;

  public constructor(renderCanvas: HTMLCanvasElement) {
    this.engine = new Engine(renderCanvas, true);
    this.scene = new Scene(this.engine);
  }

  public RunAsync = async () => {
    const webxrTask = this.scene.createDefaultXRExperienceAsync({
      uiOptions: {
        sessionMode: 'immersive-ar',
        referenceSpaceType: 'unbounded',
        optionalFeatures: ['camera-access'],
      },
    });

    this.InitScene();

    this.xr = await webxrTask;

    this.xr.baseExperience.onStateChangedObservable.add(() => {
      this.InitGUI();
    });

    this.engine.runRenderLoop(() => {
      this.scene.render();
    });

    window.addEventListener('resize', () => {
      this.engine.resize();
    });
  };

  private InitScene = () => {
    this.scene.createDefaultCamera(true, true, true);

    new DirectionalLight('light', new Vector3(0.4, -1, 0.6), this.scene);

    const box = MeshBuilder.CreateBox('box', { size: 0.2 }, this.scene);
    box.position = new Vector3(0, 0.1, 0);
  };

  private InitGUI = () => {
    const advancedTexture = AdvancedDynamicTexture.CreateFullscreenUI('UI');

    const button = Button.CreateSimpleButton('button', 'button');
    button.widthInPixels = 800;
    button.heightInPixels = 150;
    button.color = 'white';
    button.cornerRadius = 20;
    button.background = 'green';
    button.fontSizeInPixels = 50;
    button.verticalAlignment = Control.VERTICAL_ALIGNMENT_BOTTOM;
    button.topInPixels = -10;
    advancedTexture.addControl(button);
    return { button };
  };
}
