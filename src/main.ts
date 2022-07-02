import {
  DirectionalLight,
  Engine,
  Light,
  MeshBuilder,
  Scene,
  Vector3,
} from "@babylonjs/core";
import "./style.scss";

const main = () => {
  const renderCanvas = <HTMLCanvasElement>(
    document.getElementById("renderCanvas")
  );

  if (!renderCanvas) {
    return;
  }

  const engine = new Engine(renderCanvas, true);
  const scene = new Scene(engine);

  scene.createDefaultCamera(true, true, true);
  scene.createDefaultEnvironment();

  new DirectionalLight("light", new Vector3(0.4, -1, 0.6), scene);

  const box = MeshBuilder.CreateBox("box", { size: 0.2 }, scene);
  box.position = new Vector3(0, 0.1, 0);

  engine.runRenderLoop(() => {
    scene.render();
  });

  window.addEventListener("resize", () => {
    engine.resize();
  });
};

main();
