module.exports = {
	'env': {
		'node': true,
		'es2021': true
	},
	'extends': 'eslint:recommended',
	'parserOptions': {
		'ecmaVersion': 12,
		'sourceType': 'module'
	},
	'rules': {
		'indent': ['error',	'tab'],
		'max-nested-callbacks': ['error', { 'max': 4 }],
		'max-statements-per-line': ['error', { 'max': 2 }],
		'linebreak-style': ['error', 'unix'],
		'no-trailing-spaces': ['error'],
		'no-var': 'error',
		'quotes': ['error', 'single'],
		'semi': ['error', 'never']
	}
}
