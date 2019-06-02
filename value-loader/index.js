let NodeTemplatePlugin = require('webpack/lib/node/NodeTemplatePlugin');
let NodeTargetPlugin = require('webpack/lib/node/NodeTargetPlugin');
let LibraryTemplatePlugin = require('webpack/lib/LibraryTemplatePlugin');
let SingleEntryPlugin = require('webpack/lib/SingleEntryPlugin');
let LimitChunkCountPlugin = require('webpack/lib/optimize/LimitChunkCountPlugin');
let loaderUtils = require('loader-utils');

module.exports = function(source) {
  this.cacheable(true);
  return source;
};

module.exports.pitch = function(request, prevRequest) {
  this.cacheable(true);
  let callback = this.async();
  produce(this, request, callback);
};

function produce(loader, request, callback) {
  let loaderKey = `${__dirname}--here`;
  if (loader[loaderKey]) {
    return callback(null, `module.exports = null;`);
  }
  let childFilename = 'value-output-filename';
  let outputOptions = { filename: childFilename };
  let childCompiler = getRootCompilation(loader).createChildCompiler(
    'value-compiler',
    outputOptions,
  );
  childCompiler.apply(new NodeTemplatePlugin(outputOptions));
  childCompiler.apply(new LibraryTemplatePlugin(null, 'commonjs2'));
  childCompiler.apply(new NodeTargetPlugin());
  childCompiler.apply(new SingleEntryPlugin(loader.context, `!!${request}`));
  childCompiler.apply(new LimitChunkCountPlugin({ maxChunks: 1 }));
  let cacheKey = `subcache ${__dirname} ${request}`;
  childCompiler.plugin('compilation', compilation => {
    if (compilation.cache) {
      if (!compilation.cache[cacheKey]) {
        compilation.cache[cacheKey] = {};
      }
      compilation.cache = compilation.cache[cacheKey];
    }
  });
  childCompiler.plugin('this-compilation', compilation => {
    compilation.plugin('normal-module-loader', loaderContext => {
      loaderContext[loaderKey] = true;
    });
  });
  let source;
  childCompiler.plugin('after-compile', (compilation, callback) => {
    source =
      compilation.assets[childFilename] &&
      compilation.assets[childFilename].source();

    // Remove all chunk assets
    compilation.chunks.forEach(chunk => {
      chunk.files.forEach(file => {
        delete compilation.assets[file];
      });
    });

    callback();
  });

  childCompiler.runAsChild((err, entries, compilation) => {
    compilation.fileDependencies.forEach(dep => {
      loader.addDependency(dep);
    });
    compilation.contextDependencies.forEach(dep => {
      loader.addContextDependency(dep);
    });

    if (err) {
      loader.emitError(err);
      return callback(null);
    }

    if (compilation.errors.length > 0) {
      for (let err of compilation.errors) {
        loader.emitError(err);
      }
      return callback(null);
    }

    if (!source) {
      loader.emitError(new Error("Didn't get a result from child compiler"));
      return callback(null);
    }

    let exports;
    try {
      exports = loader.exec(source, request);
    } catch (err) {
      loader.emitError(err);
      return callback(null);
    }
    if (exports) {
      callback(null, `module.exports = ${JSON.stringify(exports)}`);
    } else {
      callback(null, 'module.exports = {};');
    }
  });
}

function getRootCompilation(loader) {
  let compiler = loader._compiler;
  let compilation = loader._compilation;
  while (compiler.parentCompilation) {
    compilation = compiler.parentCompilation;
    compiler = compilation.compiler;
  }
  return compilation;
}
