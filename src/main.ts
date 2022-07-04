import { IPngEncoder } from './IPngEncoder';
import BabylonApp from './BabylonApp';
import './style.scss';
import CanvasPngEncoder from './CanvasPngEncoder';

const main = async () => {
  const renderCanvas = <HTMLCanvasElement>(
    document.getElementById('renderCanvas')
  );
  const encoderCanvas = <HTMLCanvasElement>(
    document.getElementById('encoderCanvas')
  );

  if (!renderCanvas || !encoderCanvas) {
    return;
  }

  const pngEncoder: IPngEncoder = new CanvasPngEncoder(encoderCanvas);

  const babylonApp = new BabylonApp(renderCanvas);
  await babylonApp.RunAsync();
};

main();
