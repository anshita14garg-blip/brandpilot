export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0B0F1A",
        panel: "#121829",
        line: "#1F2740",
        brand: { DEFAULT: "#5B8CFF", soft: "#8FB0FF" },
        mint: "#3DDC97",
        coral: "#FF6B6B",
        amberx: "#FFC857",
      },
      fontFamily: { display: ["Sora", "system-ui", "sans-serif"], body: ["Inter", "system-ui", "sans-serif"] },
      boxShadow: { glow: "0 0 40px rgba(91,140,255,0.25)" },
    },
  },
  plugins: [],
};
