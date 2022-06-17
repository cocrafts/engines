import { render } from 'ink';

import Duel from './Duel';
import { broadcast, game, replay, subscribe } from './state';

const { rerender } = render(<Duel game={game} />);

subscribe((snapshot) => {
	rerender(<Duel game={snapshot} />);
});

replay().then(({ snapshot }) => {
	Object.keys(snapshot).forEach((key) => {
		game[key] = snapshot[key];
	});

	broadcast();
});
