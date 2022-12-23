import { render } from 'ink';

import Duel from './Duel';
import { replayGame, state } from './util';

const { rerender } = render(<Duel state={state} />);

replayGame().then(({ state: snapshot, history }) => {
	const slicedHistory = history.slice(0, 10);

	Object.keys(snapshot).forEach((key) => {
		state[key] = snapshot[key];
	});

	rerender(<Duel state={state} history={slicedHistory} />);
});

// const duel = generateDuel();
// require('fs').writeFileSync('./0001.json', JSON.stringify(duel));
