module.exports = {
  presets: ["next/babel"],
  plugins: [
    [
      "module-resolver",
      {
        root: ["./"],
        alias: {
          "^react-native$": "react-native-web"
        }
      }
    ],
    "transform-flow-strip-types"
  ]
};
