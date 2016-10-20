import React from 'react';
import request from 'superagent';
import { CONSUMER_KEY } from '../secrets';
import { Row, Pagination } from 'react-bootstrap';
import PhotosGrid from './PhotosGrid';

class Gallery extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			gallery: {},
			galleryItems: [],
			galleryPages: 0,
			activePage: 1
		}
	}

	componentWillMount() {
		this.getGalleryDetails();
		this.getGalleryItems();
	}

	getGalleryItems(page = 1) {
		const baseURL = `https://api.500px.com/v1/users/${this.props.params.userId}/galleries/${this.props.params.id}/items?`;
		request.get(`${baseURL}consumer_key=${CONSUMER_KEY}&page=${page}&image_size=600,1080,1600,2048`)
			.end((error, response) => {
				if (!error && response) {
					console.log('gallery items response from 500px: []');
					console.dir(response.body);
					this.setState({galleryItems:response.body.photos, galleryPages:response.body.total_pages})
				} else {
					console.log(`Error fetching 500px`, error);
				}
			}
		);
	}

	getGalleryDetails() {
		const baseURL = `https://api.500px.com/v1/users/${this.props.params.userId}/galleries/${this.props.params.id}?`;
		request.get(`${baseURL}consumer_key=${CONSUMER_KEY}`)
			.end((error, response) => {
				if (!error && response) {
					console.log('galleries response from 500px: []');
					console.dir(response.body);
					this.setState({gallery:response.body.gallery})
				} else {
					console.log(`Error fetching 500px`, error);
				}
			}
		);
	}

	// pagination selection
	handleSelect(eventKey) {
	   this.setState({activePage: eventKey});
	   this.getGalleryItems(eventKey)
	 }

	render() {
		return (
			<div>
				<h1>{this.state.gallery.name}</h1>
				<Pagination
				  bsSize="medium"
				  items={this.state.galleryPages}
				  activePage={this.state.activePage}
				  onSelect={this.handleSelect.bind(this)} />
				<br />
				<Row>
					<PhotosGrid photos={this.state.galleryItems} />
				</Row>
			</div>
		);
	}

}

export default Gallery;
