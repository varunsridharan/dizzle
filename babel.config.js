module.exports = {
	presets: [
		[
			"@babel/env",
			{
				loose: true,
				useBuiltIns: false
			}
		]
	],
	include: [ /src/, /node_modules/ ],
	exclude: [],
};
