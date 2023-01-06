import { render } from 'ink';
import { throttle } from 'lodash';

import Duel from './Duel';
import { duel, generateDuel, measureExecutionTime, replayGame } from './util';

const { rerender } = render(<Duel state={duel} />);

const runReRender = ({ duel: snapshot, history }) => {
	const slicedHistory = history.slice(0, 10);

	Object.keys(snapshot).forEach((key) => {
		duel[key] = snapshot[key];
	});

	measureExecutionTime('re-render', 'time to render terminal');
	rerender(<Duel state={duel} history={slicedHistory} />);
	measureExecutionTime('re-render');
};

replayGame().then(throttle(runReRender, 100));

// const duel = generateDuel();
// // // const command
// require('fs').writeFileSync('./0001.json', JSON.stringify(duel));
