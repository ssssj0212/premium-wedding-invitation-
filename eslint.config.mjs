import nextVitals from "eslint-config-next/core-web-vitals";

const config = [
  {
    ignores: [
      ".next/**",
      "korean-invitation/**",
      "node_modules/**"
    ]
  },
  ...nextVitals
];

export default config;
