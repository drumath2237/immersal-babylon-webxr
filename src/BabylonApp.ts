import {
  BaseTexture,
  DirectionalLight,
  Engine,
  MeshBuilder,
  Scene,
  Vector3,
  WebXRDefaultExperience,
} from "@babylonjs/core";

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
          sessionMode: "immersive-ar",
        },
      })
      .then((xr) => {
        this.xr = xr;
      });

    this.engine.runRenderLoop(() => {
      this.scene.render();
    });

    document.addEventListener("resize", () => {
      this.engine.resize();
    });
  }

  private InitScene = () => {
    this.scene.createDefaultCamera(true, true, true);
    this.scene.createDefaultEnvironment();

    new DirectionalLight("light", new Vector3(0.4, -1, 0.6), this.scene);

    const box = MeshBuilder.CreateBox("box", { size: 0.2 }, this.scene);
    box.position = new Vector3(0, 0.1, 0);

    this.engine.runRenderLoop(() => {
      this.scene.render();
    });
  };

  private CreateCameraTexture = async (
    frame: XRFrame
  ): Promise<Uint8Array | null> => {
    if (!this.xr) {
      return null;
    }

    const viewerPose = frame.getViewerPose(
      this.xr.baseExperience.sessionManager.referenceSpace
    );
    const view = viewerPose?.views[0];

    const bindings = new XRWebGLBinding(frame.session, this.engine._gl);
    const cameraWebGLTexture = (bindings as any).getCameraImage(
      (view as any).camera
    ) as WebGLTexture;

    const cameraInternalTexture =
      this.engine.wrapWebGLTexture(cameraWebGLTexture);
    const baseTexture = new BaseTexture(this.engine);
    baseTexture._texture = cameraInternalTexture;

    const arrayView = await baseTexture.readPixels();
    if (arrayView === null) {
      return null;
    }

    return new Uint8Array(arrayView.buffer);
  };
}

export { BabylonApp };
