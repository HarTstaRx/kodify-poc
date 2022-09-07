import esbuild from 'esbuild';

const bundle = async () => {
  console.log('process.env.NODE_ENV', process.env.NODE_ENV);
  esbuild.build({
    entryPoints: ['src/index.js'],
    bundle: true,
    color: true,
    outfile: 'www/index.js',
    platform: 'node',
    minify: false,
    target: 'es2019',
    /*
      TODO: Find out how to achieve esbuild bundles everything and use watch, it seems that right now watch
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
  }).catch(() => process.exit(1));
};

bundle();

export default bundle;