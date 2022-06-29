import { render } from 'ink';

import { replay } from './state/replayers/match2';
import Duel from './Duel';
import { game } from './state';

const { rerender } = render(<Duel state={game} />);

replay().then(({ snapshot, history }) => {
	const slicedHistory = history.slice(10);

	Object.keys(snapshot).forEach((key) => {
		game[key] = snapshot[key];
	});

	rerender(<Duel state={snapshot} history={slicedHistory} />);
});
