import React from 'react';
import request from 'superagent';
import { CONSUMER_KEY } from '../secrets';
import { Row, Col, Image } from 'react-bootstrap';
import PhotosGrid from './PhotosGrid';
import { Link } from 'react-router';

class UserDetails extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			user: {},
			userPhotos: [],
			galleries: []
		}
	}

	componentWillMount() {
		this.getUserDetails();
		this.getUserPhotos();
		this.getGalleries();
	}

	getUserDetails() {
		const baseURL = `https://api.500px.com/v1/users/show/?`;
		request.get(`${baseURL}consumer_key=${CONSUMER_KEY}&id=${this.props.params.id}`)
			.end((error, response) => {
				if (!error && response) {
					console.log('user object from 500px: {}');
					console.dir(response.body);
					this.setState({user:response.body.user})
				} else {
					console.log(`Error fetching 500px`, error);
				}
			}
		);
	}

	getUserPhotos(page = 1) {
		const baseURL = `https://api.500px.com/v1/photos?feature=user&rpp=52&image_size=600,1080,1600,2048&`;
		request.get(`${baseURL}consumer_key=${CONSUMER_KEY}&page=${page}&user_id=${this.props.params.id}`)
			.end((error, response) => {
				if (!error && response) {
					console.log(`userPhotos response from 500px: []`);
					console.dir(response);
					this.setState({userPhotos:response.body.photos})
				} else {
					console.log(`Error fetching 500px`, error);
				}
			}
		);
	}


	getGalleries() {
		const baseURL = `https://api.500px.com/v1/users/${this.props.params.id}/galleries?`;
		request.get(`${baseURL}consumer_key=${CONSUMER_KEY}`)
			.end((error, response) => {
				if (!error && response) {
					console.log('galleries response from 500px: []');
					console.dir(response.body);
					this.setState({galleries:response.body.galleries})
				} else {
					console.log(`Error fetching 500px`, error);
				}
			}
		);
	}


	createLocaleString(user) {
		let locale;
		if (user.city) {
			locale = `${user.city},  ${user.state} - ${user.country}`
		} else if (user.state && user.country) {
			locale = `${user.state} - ${user.country}`
		} else {
			return undefined;
		}
		return <p>{locale}</p>;
	}

	mapGalleries() {
		return this.state.galleries.map((gallery, index) => {

			return (<li key={index}>
						<Link to={`/users/${this.props.params.id}/galleries/${gallery.id}`}>{gallery.name}</Link>
					</li>
			);
		});
	}

	render() {
		let user = this.state.user
		let location = this.createLocaleString(user);
		let galleries = this.mapGalleries();
		return (
			<div>
				<h1>{user.fullname}</h1>
				<br/>
				From {location}
				<br/>
				<Image src={user.userpic_url} thumbnail />
				<br/>
				Has {user.friends_count} friends
				<h4>About</h4>
				{user.about}
				<h4>Galleries</h4>
				<ul>
					{galleries}
				</ul>
				<h4>Photos</h4>

				<PhotosGrid photos={this.state.userPhotos} />

			</div>
		);
	}

}

export default UserDetails;
