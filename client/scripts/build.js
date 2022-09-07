import dotenv from 'dotenv';
import esbuild from 'esbuild';
import { sassPlugin } from 'esbuild-sass-plugin';

dotenv.config({});

const build = async () => {
  esbuild.build({
    entryPoints: ['src/index.tsx'],
    bundle: true,
    color: true,
    outfile: 'www/bundle.js',
    sourcemap: process.env.REACT_APP_ENV === 'DEV',
    minify: process.env.REACT_APP_ENV !== 'DEV',
    target: 'es2019', // >> config/tsconfig.json
    /*
      TODOENG: Find out how to achieve esbuild bundles everything and use watch, it seems that right now watch
       stays observing the folder but esbuild doesn't emit any output nor says anything; other script processes stall...
       In the meantime we will use chokidar in order to watch the src folfer and we will use two consoles,
       one for bundling and start the local server, the other to watch with chokidar...
    */ 
    // watch: {
    //   onRebuild(error, result) {
    //     if (error) console.error('watch build failed:', error);
    //     else console.log('watch build succeeded:', result);
    //   },
    // },
    plugins:[sassPlugin()],
  }).catch(() => process.exit(1));
};

build();

export default build;