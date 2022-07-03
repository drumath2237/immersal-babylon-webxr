import {
  DirectionalLight,
  Engine,
  MeshBuilder,
  Scene,
  Vector3,
  WebXRDefaultExperience,
} from '@babylonjs/core';

class BabylonApp {
  private engine: Engine;

  private scene: Scene;

  private xr?: WebXRDefaultExperience;

  public constructor(renderCanvas: HTMLCanvasElement) {
    this.engine = new Engine(renderCanvas, true);
    this.scene = new Scene(this.engine);

    this.InitScene();

    this.scene
      .createDefaultXRExperienceAsync({
        uiOptions: {
          sessionMode: 'immersive-ar',
          referenceSpaceType: 'unbounded',
          optionalFeatures: ['camera-access'],
        },
      })
      .then((xr) => {
        this.xr = xr;
      });

    this.engine.runRenderLoop(() => {
      this.scene.render();
    });

    document.addEventListener('resize', () => {
      this.engine.resize();
    });
  }

  private InitScene = () => {
    this.scene.createDefaultCamera(true, true, true);

    new DirectionalLight('light', new Vector3(0.4, -1, 0.6), this.scene);

    const box = MeshBuilder.CreateBox('box', { size: 0.2 }, this.scene);
    box.position = new Vector3(0, 0.1, 0);

    this.engine.runRenderLoop(() => {
      this.scene.render();
    });
  };
}

export { BabylonApp };
