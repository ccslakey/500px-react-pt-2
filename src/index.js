import React from 'react';
import ReactDOM from 'react-dom';

import routes from './routes.js';

import { Router, browserHistory } from 'react-router';

ReactDOM.render(
	<Router history={browserHistory} onUpdate={() => window.scrollTo(0, 0)}>
		{routes}
	</Router>,
	document.getElementById('root')
);

browserHistory.listen(function (location) {
    window.ga('send', 'pageview', location.pathname);
});
