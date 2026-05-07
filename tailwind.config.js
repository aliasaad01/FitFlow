/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // الألوان المستوحاة من صور المشروع
        bloom: {
          dark: "#0f1115", // الخلفية الداكنة الأساسية
          card: "#16191d", // لون الكروت[cite: 1]
          pink: "#e91e63", // اللون الزهري للأزرار والتحفيز[cite: 1]
          purple: "#8a2be2", // التدرجات البنفسجية[cite: 1]
          gray: "#9ca3af", // النصوص الفرعية
        },
      },
      fontFamily: {
        cairo: ["Cairo", "sans-serif"],
      },
      direction: {
        rtl: "rtl",
      },
    },
  },
  plugins: [],
};
