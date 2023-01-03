module.exports = {
  env: {
    node: true,
    commonjs: true,
    es2021: true,
  },
  extends: ["eslint:recommended"],
  overrides: [],
  parserOptions: {
    ecmaVersion: "latest",
  },
  rules: {
    semi: "warn",
    eqeqeq: ["warn"],
    "no-unused-vars": "warn",
    "no-constant-condition": "none",
  },
};
