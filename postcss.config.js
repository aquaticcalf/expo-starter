module.exports = {
  plugins: [
    require("react-strict-dom/postcss-plugin")({
      include: ["config/app.tsx", "index.ts", "src/**/*.{js,jsx,ts,tsx}"],
    }),
    require("autoprefixer"),
  ],
}
