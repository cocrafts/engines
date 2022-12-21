import { resolve } from 'path';

import express from 'express';
import { addAliases } from 'module-alias';

addAliases({
	'@metacraft/engines-under-realm': resolve(__dirname, './package/card'),
	'@metacraft/murg-engine': resolve(__dirname, './package/murg'),
});

require('./tool/cardRepl');

export const configure = async () => {
	const app = express();

	app.get('/greeting', (req, res) => {
		return res.json({ message: 'hello ' });
	});

	return app;
};
