import BabylonApp from './BabylonApp';
import './style.scss';

const main = () => {
  const renderCanvas = <HTMLCanvasElement>(
    document.getElementById('renderCanvas')
  );

  if (!renderCanvas) {
    return;
  }

  new BabylonApp(renderCanvas);
};

main();
