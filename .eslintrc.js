module.exports = {
	parser: '@typescript-eslint/parser',
	parserOptions: {
		ecmaVersion: 2021,
		sourceType: 'module',
	},
	plugins: ['@typescript-eslint', 'simple-import-sort', 'jest', 'prettier'],
	extends: [
		'eslint:recommended',
		'plugin:import/typescript',
		'plugin:@typescript-eslint/recommended',
		'plugin:jest/style',
		'prettier',
	],
	rules: {
		'@typescript-eslint/no-var-requires': 'off',
		'simple-import-sort/exports': 'error',
		'simple-import-sort/imports': [
			'error',
			{
				groups: [
					[
						'^(assert|buffer|child_process|cluster|console|constants|crypto|dgram|dns|domain|events|fs|http|https|module|net|os|path|punycode|querystring|readline|repl|stream|string_decoder|sys|timers|tls|tty|url|util|vm|zlib|freelist|v8|process|async_hooks|http2|perf_hooks)(/.*|$)',
					], // Node.js builtins
					['^react', '^@?\\w'], //
					['^\\u0000'], // Side effect imports.
					['^\\.\\.(?!/?$)', '^\\.\\./?$'], // Parent imports. Put `..` last.
					['^\\./(?=.*/)(?!/?$)', '^\\.(?!/?$)', '^\\./?$'], // Other relative imports. Put same-folder imports and `.` last.
					['^.+\\.s?css$'], // Style imports.
				],
			},
		],
		'prettier/prettier': [
			'error',
			{
				trailingComma: 'all',
				singleQuote: true,
				useTabs: true,
				tabWidth: 2,
			},
		],
	},
	settings: {
		jest: {
			version: 27,
		},
	},
	ignorePatterns: [
		'dist/',
		'tool/**/*.js',
		'src/shared/types/graphql.ts',
		'node_modules',
	],
	env: {
		node: true,
		'jest/globals': true,
	},
	globals: {
		nodeRequire: true,
		packageJson: true,
	},
};
