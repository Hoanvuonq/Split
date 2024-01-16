const withMT = require("@material-tailwind/react/utils/withMT");

module.exports = withMT({
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      shadow: {
        custom: 'box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 12px;'
      }
    }
  },
  plugins: [],
});
