export default {
    server: {
      port: 5173,
      proxy: {
        "/api": "http://localhost:7071" // Functions のローカルへ
      }
    },
    build: {
      outDir: "dist"
    }
  };
  