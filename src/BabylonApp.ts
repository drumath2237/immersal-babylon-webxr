import {
  DirectionalLight,
  Engine,
  MeshBuilder,
  Scene,
  Vector3,
} from "@babylonjs/core";

class BabylonApp {
  private engine: Engine;
  private scene: Scene;

  public constructor(renderCanvas: HTMLCanvasElement) {
    this.engine = new Engine(renderCanvas, true);
    this.scene = new Scene(this.engine);

    this.Init();

    this.engine.runRenderLoop(() => {
      this.scene.render();
    });

    document.addEventListener("resize", () => {
      this.engine.resize();
    });
  }

  private Init = () => {
    this.scene.createDefaultCamera(true, true, true);
    this.scene.createDefaultEnvironment();

    new DirectionalLight("light", new Vector3(0.4, -1, 0.6), this.scene);

    const box = MeshBuilder.CreateBox("box", { size: 0.2 }, this.scene);
    box.position = new Vector3(0, 0.1, 0);

    this.engine.runRenderLoop(() => {
      this.scene.render();
    });
  };
}

export { BabylonApp };
