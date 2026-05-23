import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        dashboard: resolve(__dirname, 'dashboard.html'),
        learning: resolve(__dirname, 'learning_path_map.html'),
        quiz: resolve(__dirname, 'interactive_quiz.html'),
        achievements: resolve(__dirname, 'achievements_badges_room.html'),
        parent: resolve(__dirname, 'parent_portal_dashboard.html')
      }
    }
  }
});
