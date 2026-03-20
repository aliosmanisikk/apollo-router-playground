module.exports = {
  semi: true,
  trailingComma: "all",
  singleQuote: false,
  printWidth: 140,
  tabWidth: 4,
  overrides: [
    {
      files: ["*.json", "*.yml", "*.yaml"],
      options: {
        tabWidth: 2,
      },
    },
  ],
};
