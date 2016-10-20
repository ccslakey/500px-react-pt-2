import React from 'react';
import { Grid } from 'react-bootstrap';

import Header from './Header';

class App extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
		}
	}

	render() {
		return (
			<div>
				<Grid fluid={true}>
					<Header />
					{this.props.children}
				</Grid>
			</div>
		);
	}

}

export default App;
