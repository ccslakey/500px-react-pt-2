import React from 'react';
import request from 'superagent';
import { CONSUMER_KEY } from '../secrets';
import { Row, Col, Image } from 'react-bootstrap';
import { Link } from 'react-router';

class PhotosDetail extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			photo: {},
			user: {}
		}
	}

	componentWillMount() {
		this.getPhotoInfo();
	}

	getPhotoInfo() {
		const baseURL = `https://api.500px.com/v1/photos/${this.props.params.id}/?image_size=1080&`;
		request.get(`${baseURL}consumer_key=${CONSUMER_KEY}`)
			.end((error, response) => {
				if (!error && response) {
					console.dir(response.body);
					this.setState({photo:response.body.photo, user: response.body.photo.user})
				} else {
					console.log(`Error fetching 500px`, error);
				}
			}
		);
	}

	regularizeDescription(str = this.state.photo.description) {
		//  for photo.description - to unescape html tags from API
		if (!str) {return ;}
		return new String(str).replace(/<\/?[^>]+(>|$)/g, "")
	}

	render() {
		return (
			<div id="photoDetails">
			<Row>
				<Col className="photo-thumb" xs={12}>
				<h1 className="slight-opacity">
					{this.state.photo.name}
				</h1>
					<br/>
					<Image src={this.state.photo.image_url}/>
					<br/>
				<div className="slight-opacity">
					{this.regularizeDescription()}
				</div>
				<Link to={`/users/${this.state.user.id}`}>{this.state.user.fullname}</Link>
				</Col>
			</Row>
			</div>
		);
	}

}

export default PhotosDetail;
