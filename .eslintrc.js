module.exports = {
  "env": {
      "browser": true,
      "es2021": true,
      "node": true
  },
  "extends": [
      "eslint:recommended",
      "plugin:@typescript-eslint/recommended",
      "prettier"
  ],
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
      "ecmaVersion": "latest",
      "sourceType": "module"
  },
  "plugins": [
      "@typescript-eslint",
      "prettier"
  ],
  "ignorePatterns": ["src/tests/helpers/*.ts"],
  "rules": {
      "no-console": 0,
      "prettier/prettier": 1,
      // "@typescript-eslint/ban-types": "off"
      "@typescript-eslint/ban-types": ["error",
          {
              "types": {
                  "String": false,
                  "Boolean": false,
                  "Number": false,
                  "Symbol": false,
                  "{}": false,
                  "Object": false,
                  "object": false,
                  "Function": false,
              },
              "extendDefaults": true
          }
      ],
      "@typescript-eslint/ban-ts-comment": "off"
  }
}
