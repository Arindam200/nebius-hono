import pages from '@hono/vite-cloudflare-pages'
import devServer from '@hono/vite-dev-server'
import { defineConfig } from 'vite'
import { viteStaticCopy } from 'vite-plugin-static-copy'

export default defineConfig(({ mode }) => {
  if (mode === 'client') {
    return {
      build: {
        rollupOptions: {
          input: './src/client.tsx',
          output: {
            entryFileNames: 'static/client.js'
          }
        }
      },
      plugins: [
        viteStaticCopy({
          targets: [
            { src: 'src/styles.css', dest: 'static' }
          ]
        })
      ]
    }
  } else {
    return {
      ssr: {
        external: ['openai', 'react', 'react-dom']
      },
      plugins: [
        pages(),
        devServer({
          entry: 'src/index.tsx'
        })
      ]
    }
  }
})