import { render } from 'ink';
import { subscribe } from 'valtio';

import Duel from './Duel';
import { game } from './state';

render(<Duel game={game} />);

subscribe(game, () => {
	render(<Duel game={game} />);
});
