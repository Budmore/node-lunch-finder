var config = {
	environment: 'DEVELOPMENT', // PRODUCTION, DEVELOPMENT
	siteUrl: 'http://lunch-finder.budmore.pl',
	port: 4000,
	version: '/api/v1',
	secret: '#7D0vqas#!@#p[{+DF2^%$yq1w5Qusok#@B1312=)*(&asd%QAd312BrvuGMKbIf_',
	db: {
		production: 'mongodb://user:pass@domain.pl:1234/lunch-finder-v1-prod',
		development: 'mongodb://localhost/lunch-finder-dev',
		spec: 'mongodb://localhost/lunch-finder-specs'
	},
	emails: {
		contact: 'contact@budmore.pl'
	}
};

module.exports = config;
