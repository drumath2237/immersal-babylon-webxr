import { BabylonApp } from "./BabylonApp";
import "./style.scss";

const main = () => {
  const renderCanvas = <HTMLCanvasElement>(
    document.getElementById("renderCanvas")
  );

  if (!renderCanvas) {
    return;
  }

  const babylonApp = new BabylonApp(renderCanvas);
};

main();
