import { render } from 'ink';
import { throttle } from 'lodash';

import { initialState, replay } from './match/first';
import Duel from './Duel';
import { measureExecutionTime } from './util';

const { rerender } = render(<Duel duel={initialState} />);

const runReRender = ({ duel, history }) => {
	const slicedHistory = history.slice(0, 10);

	measureExecutionTime('re-render', 'time to render terminal');
	rerender(<Duel duel={duel} history={slicedHistory} />);
	measureExecutionTime('re-render');
};

replay().then(throttle(runReRender, 100));
