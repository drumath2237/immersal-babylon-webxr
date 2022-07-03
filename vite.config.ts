import { defineConfig } from 'vite';
import * as fs from 'fs';

export default defineConfig(({ mode }) => {
  if (mode === 'development') {
    return {
      server: {
        https: {
          key: fs.readFileSync('./key.pem'),
          cert: fs.readFileSync('./cert.pem'),
        },
      },
    };
  } else {
    return {};
  }
});
