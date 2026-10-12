import type { Config } from "tailwindcss";

/**
 * Palette — "Obsidian & Acid"
 *  ink      #08080B  page background (near-black with a cool tint)
 *  surface  #101015  cards / panels
 *  line     #23232C  hairlines
 *  bone     #ECEBE4  primary text (warm off-white, easier on the eyes than #fff)
 *  mute     #8A8A97  secondary text
 *  acid     #C8F560  primary accent (electric lime)
 *  iris     #7B61FF  secondary accent (violet) — used sparingly for glow
 *  paper    #F1F0EA  light section background
 */
const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#08080B",
        surface: "#101015",
        line: "#23232C",
        bone: "#ECEBE4",
        mute: "#8A8A97",
        acid: "#C8F560",
        iris: "#7B61FF",
        paper: "#F1F0EA",
      },
      fontFamily: {
        display: ['"Space Grotesk Variable"', "ui-sans-serif", "system-ui", "sans-serif"],
        sans: ['"Inter Variable"', "ui-sans-serif", "system-ui", "sans-serif"],
      },
      keyframes: {
        marquee: { from: { transform: "translateX(0)" }, to: { transform: "translateX(-50%)" } },
        pulseDot: { "0%,100%": { opacity: "1" }, "50%": { opacity: "0.3" } },
      },
      animation: {
        marquee: "marquee 38s linear infinite",
        "marquee-slow": "marquee 60s linear infinite",
        pulseDot: "pulseDot 2s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
