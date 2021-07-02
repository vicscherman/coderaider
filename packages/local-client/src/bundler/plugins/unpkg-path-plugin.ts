import * as esbuild from 'esbuild-wasm';


export const unpkgPathPlugin = () => {
  // plugin
  return {
    // for debuggin purposes(find plugin source for errors etc)
    name: 'unpkg-path-plugin',
    // called by ESBUILD. Build is the bundling process
    setup(build: esbuild.PluginBuild) {
      //if code is run from index.js with no dependencies
      build.onResolve({ filter: /(^index\.js$)/ }, () => {
        return { path: 'index.js', namespace: 'a' };
      });
      //if filter is relative file path
      build.onResolve({ filter: /^\.+\// }, (args: any) => {
        return {
          namespace: 'a',
          path: new URL(args.path, 'https://unpkg.com' + args.resolveDir + '/')
            .href,
        };
      });
      //filter for root packages of a module
      build.onResolve({ filter: /.*/ }, async (args: any) => {
        return {
          namespace: 'a',
          path: `https://unpkg.com/${args.path}`,
        };
      });
      // loads file off file system. Overriding the behaviour when file isn't local
      //name space lets you declare different namespaces to different files for example

    },
  };
};
