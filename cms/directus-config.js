module.exports = function (env) {
	return {
		PORT: 5000,
		CORS_ENABLED: true,
		DB_CLIENT: 'pg',
		DB_CONNECTION_STRING: env.DATABASE_URL,
	}
}
