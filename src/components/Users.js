import React from 'react';
import request from 'superagent';

import { Link } from 'react-router';
import { Row, Col, Image, Button, ButtonGroup, FormGroup, ControlLabel, FormControl } from 'react-bootstrap';

import { CONSUMER_KEY }from '../secrets';

class Users extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			input: '',
			searchQuery: '',
			users: [],
		}
	}


	componentWillMount() {
		this.searchForUsers();
	}

	handleTextInput(event) {
		event.preventDefault();
		this.setState({input: event.target.value});
    }

	handleSubmit(event){
		event.preventDefault();
		var query = this.state.input;
		this.setState({searchQuery: query, input: ''});
		this.searchForUsers(query);
	}

	searchForUsers(query = "Great Photos", page = 1) {
		const baseURL = `https://api.500px.com/v1/users/search?rpp=50&`;
		request.get(`${baseURL}consumer_key=${CONSUMER_KEY}&page=${page}&term=${query}`)
			.end((error, response) => {
				if (!error && response) {
					console.log(`response from 500px after searching for ${query}`);
					console.dir(response);
					this.setState({users:response.body.users})
				} else {
					console.log(`Error fetching 500px`, error);
				}
			}
		);
	}


	renderUsers() {
		return this.state.users.map((user, ind) => {
			if(!user.fullname || !user.id) {return ;}

			return (
				<li key={ind}>
					<Link to={`/users/${user.id}`}>{user.username}</Link>
				</li>
			);
		});
	}

	render() {
		let usersList = this.renderUsers();
		return (<div>
			<form>
			<FormGroup controlId="formControlsText">

				<FormControl
					type="text"
					value={this.state.input}
					onChange={this.handleTextInput.bind(this)}
					placeholder="Search 500px users to view their photos and galleries" />
					<br/>
				<Button block type="submit" onClick={this.handleSubmit.bind(this)} bsStyle="primary">Search</Button>
			</FormGroup>
			</form>
			<br/>
			{this.state.searchQuery || 'Great Photos'}
			<br/>
			<ul>
				{usersList}
			</ul>

		</div>);
	}

}

export default Users;
