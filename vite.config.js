import {defineConfig} from 'vite';
import preact from '@preact/preset-vite';
import {visualizer} from "rollup-plugin-visualizer";


// https://vitejs.dev/config/
export default defineConfig({
    plugins: [preact(),],
    build: {
        rollupOptions: {
            plugins: [
                // visualizer({
                //     filename: 'dist/stats.html', // 输出分析报告
                //     open: true,                 // 构建后自动打开
                //     gzipSize: true,             // 显示gzip大小
                // })
            ]
        }
    },

    server: {
        host: '0.0.0.0',
    }
});
