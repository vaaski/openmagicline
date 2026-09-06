import antfu from "@antfu/eslint-config"
import vaaski from "eslint-plugin-vaaski"

export default antfu(
	{
		type: "lib",

		typescript: true,

		stylistic: {
			quotes: "double",
			indent: "tab",
		},

		/// keep-sorted
		rules: {
			"@stylistic/brace-style": ["error", "1tbs"],
			"@typescript-eslint/consistent-type-definitions": ["error", "type"],
			"antfu/if-newline": "off",
			"antfu/no-top-level-await": "off",
			"antfu/top-level-function": "off",
			"n/prefer-global/process": ["error", "always"],
			"no-console": "off",
			"ts/explicit-function-return-type": "off",
		},

		/// keep-sorted
		ignores: ["./dist", "./output"],
	},
	{
		files: ["**/*.ts", "**/*.vue"],
		plugins: { vaaski },
		rules: {
			"vaaski/if-newline": "error",
		},
	},
)
