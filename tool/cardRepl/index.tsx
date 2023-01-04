import { render } from 'ink';

import Duel from './Duel';
import { duel, generateDuel, measureExecutionTime, replayGame } from './util';

const { rerender } = render(<Duel state={duel} />);

replayGame().then(({ duel: snapshot, history }) => {
	const slicedHistory = history.slice(0, 10);

	Object.keys(snapshot).forEach((key) => {
		duel[key] = snapshot[key];
	});

	measureExecutionTime('re-render', 'time to render terminal');
	rerender(<Duel state={duel} history={slicedHistory} />);
	measureExecutionTime('re-render');
});

// const duel = generateDuel();
// // // const command
// require('fs').writeFileSync('./0001.json', JSON.stringify(duel));
