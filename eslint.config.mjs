import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

const eslintConfig = [
  // Mods de Claude Code: se validan con `claude plugin validate`, no con la app.
  { ignores: ["mods/**"] },
  ...nextCoreWebVitals,
  ...nextTypescript,
];

export default eslintConfig;
