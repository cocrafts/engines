import { render } from 'ink';

import Duel from './Duel';
import { game, replay } from './state';

const { rerender } = render(<Duel game={game} />);

replay().then(({ snapshot, history }) => {
	const slicedHistory = history.slice(10);

	Object.keys(snapshot).forEach((key) => {
		game[key] = snapshot[key];
	});

	rerender(<Duel game={snapshot} history={slicedHistory} />);
});
