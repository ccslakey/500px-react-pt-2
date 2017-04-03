import React from 'react';
import request from 'superagent';

import { Pagination, Row, Col, Button, ButtonGroup, FormGroup, ControlLabel, FormControl } from 'react-bootstrap';

import { CONSUMER_KEY }from '../secrets';
import PhotosGrid from './PhotosGrid';

class Photos extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			input: '',
			searchQuery: '',
			photos: [],
			featureMode: '',
			activePage: 1
		}
	}

	componentWillMount() {
		this.getPhotos();
	}

	selectMode(featureMode){
		this.setState({activePage: 1});
		this.setState({featureMode});
		this.getPhotos(featureMode, 1);
	}

	// pagination selection
	handleSelect(eventKey) {
       this.setState({activePage: eventKey});
	   this.getPhotos(this.state.featureMode, eventKey)
     }

	getPhotos(mode = `${this.state.featureMode}` || 'popular', page = this.state.activePage) {
		const baseURL = `https://api.500px.com/v1/photos?&rpp=52&exclude=nude&image_size=600,1080,1600,2048&`;
		request.get(`${baseURL}consumer_key=${CONSUMER_KEY}&feature=${mode}&page=${page}`)
			.end((error, response) => {
				if (!error && response) {
					console.log(`response from ${baseURL}consumer_key=${CONSUMER_KEY}&feature=${mode}&page=${page}`);
					console.dir(response);
					this.setState({photos:response.body.photos})
				} else {
					console.log(`Error fetching 500px`, error);
				}
			}
		);
	}

	searchForPhotos(query, page = 1) {
		const baseURL = `https://api.500px.com/v1/photos/search?exclude=nude&rpp=50&image_size=600,1080,1600,2048&`;
		request.get(`${baseURL}consumer_key=${CONSUMER_KEY}&page=${page}&term=${query}`)
			.end((error, response) => {
				if (!error && response) {
					console.log(`response from 500px after searching for ${query}`);
					console.dir(response);
					this.setState({photos:response.body.photos})
				} else {
					console.log(`Error fetching 500px`, error);
				}
			}
		);
	}

    handleTextInput(event) {
		event.preventDefault();
		this.setState({input: event.target.value});
    }

	handleSubmit(event){
		event.preventDefault();
		this.setState({activePage: 1});
		var query = this.state.input;
		this.setState({searchQuery: query, input: ''});
		this.searchForPhotos(query);
	}


	getFeatureHeader() {
		let mode = this.state.featureMode.split("_").join(" ") || 'popular';
		return mode
	}

	render() {
		let header;
		this.state.searchQuery ? header = this.state.searchQuery : header = this.getFeatureHeader()
		return (
			<div>
			<Row>
			<Col sm={6}>
				<Button ref='popular' onClick={this.selectMode.bind(this, 'popular')}>Popular</Button>
				<Button ref='highest_rated' onClick={this.selectMode.bind(this, 'highest_rated')}>Highest Rated</Button>
				<Button ref='upcoming' onClick={this.selectMode.bind(this, 'upcoming')}>Upcoming</Button>
				<Button ref='editors' onClick={this.selectMode.bind(this, 'editors')}>Editors pick</Button>
			</Col>
			<Col sm={6}>
				<Button ref='fresh_today' onClick={this.selectMode.bind(this, 'fresh_today')}>Fresh Today</Button>
				<Button ref='fresh_yesterday' onClick={this.selectMode.bind(this, 'fresh_yesterday')}>Fresh Yesterday</Button>
				<Button ref='fresh_week' onClick={this.selectMode.bind(this, 'fresh_week')}>Fresh this Week</Button>
			</Col>
			</Row>
			<br/>
				<form>
  			  	<FormGroup controlId="formControlsText">

  			  		<FormControl
  						type="text"
  						value={this.state.input}
  		  				onChange={this.handleTextInput.bind(this)}
  						placeholder="Search 500px photos" />
						<br/>
  					<Button block type="submit" onClick={this.handleSubmit.bind(this)} bsStyle="primary">Search</Button>
  			 	</FormGroup>
				</form>
					<h1 className="feature-header">{header}</h1>
					<Pagination
			          bsSize="medium"
			          items={10}
			          activePage={this.state.activePage}
			          onSelect={this.handleSelect.bind(this)} />
			        <br />
					<Row>
						<PhotosGrid photos={this.state.photos} />
					</Row>


			</div>
		);
	}

}

export default Photos;
