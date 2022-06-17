import { resolve } from 'path';

import express from 'express';
import { addAliases } from 'module-alias';

addAliases({
	'@cocrafts/card': resolve(__dirname, './package/card'),
});

require('./tool/cardRepl');

export const configure = async () => {
	const app = express();

	app.get('/greeting', (req, res) => {
		return res.json({ message: 'hello ' });
	});

	return app;
};
