import {
  BaseTexture,
  DirectionalLight,
  Engine,
  MeshBuilder,
  Scene,
  Vector3,
  WebXRDefaultExperience,
} from "@babylonjs/core";
import { CameraIntrinsics } from "./CameraIntrinsics";

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

  private CreateCameraTextureAsync = async (
    frame: XRFrame
  ): Promise<Uint8Array | null> => {
    if (!this.xr) {
      console.error("cannot get xr experience");
      return null;
    }

    const viewerPose = frame.getViewerPose(
      this.xr.baseExperience.sessionManager.referenceSpace
    );

    if (!viewerPose) {
      console.error("viewerPose is null");
      return null;
    }
    const view = viewerPose.views[0];

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
      console.error("cannot read pixels");
      return null;
    }

    return new Uint8Array(arrayView.buffer);
  };

  private static getCameraIntrinsics(
    projectionMatrix: Float32Array,
    viewport: XRViewport
  ): CameraIntrinsics {
    const p = projectionMatrix;

    // Principal point in pixels (typically at or near the center of the viewport)
    const u0 = ((1 - p[8]) * viewport.width) / 2 + viewport.x;
    const v0 = ((1 - p[9]) * viewport.height) / 2 + viewport.y;

    // Focal lengths in pixels (these are equal for square pixels)
    const ax = (viewport.width / 2) * p[0];
    const ay = (viewport.height / 2) * p[5];

    return {
      principalOffset: {
        x: u0,
        y: v0,
      },
      focalLength: {
        x: ax,
        y: ay,
      },
    };
  }
}

export { BabylonApp };
