import * as SentryNode from '@sentry/node'

if (import.meta.env.PROD) {
	console.log('Running in production...')
	SentryNode.init({
		dsn: 'https://be68446d641f48b5b44a9f9841f56f9b@app.glitchtip.com/2834',
		tracesSampleRate: 1.0,
		// Add the Http integration for tracing
		integrations: [new SentryNode.Integrations.Http()]
	})
}
