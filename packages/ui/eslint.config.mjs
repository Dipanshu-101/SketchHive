import { config } from "@repo/eslint-config/react-internal";
import { noRawHex } from "@repo/eslint-config/no-raw-hex";

/** @type {import("eslint").Linter.Config} */
export default [...config, ...noRawHex];
