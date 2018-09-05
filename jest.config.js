require('dotenv').config();

module.exports = {
	projects: [
		{
			runner: 'jest-runner-eslint',
			displayName: 'lint',
			testMatch: ['<rootDir>/src/**/*.js'],
		},
		{
			displayName: 'test',
			modulePaths: ['node_modules', './src'],
			testPathIgnorePatterns: ['node_modules', '/__fixtures__/', 'helpers'],
			testEnvironment: 'node',
		},
	],
};
