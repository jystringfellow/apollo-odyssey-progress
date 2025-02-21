import * as esbuild from 'esbuild';
import * as fs from 'fs';

async function build() {
  const result = await esbuild.build({
    entryPoints: ['src/widget.ts'],
    bundle: true,
    minify: true,
    format: 'iife',
    write: false
  });
  
  const code = result.outputFiles[0].text;
  const bookmarklet = `javascript:(function(){${encodeURIComponent(code)}})();`;
  
  fs.writeFileSync('dist/bookmarklet.txt', bookmarklet);
}

build(); 