import React from 'react';
import { Col, Image, Panel } from 'react-bootstrap';
import { Link } from 'react-router';

class PhotosGrid extends React.Component {

	constructor(props) {
		super(props);
	}

	regularizeDescription(str) {
		//  for photo.description - to unescape html tags from API
		if (!str) {return ;}
		return new String(str).replace(/<\/?[^>]+(>|$)/g, "")
	}

	renderPhotos(){
		return this.props.photos.map((photo, ind) => {
			if(!photo.name || !photo.image_url || !photo.id || photo.nsfw) {return ;}

			const title = (
			  <h3>{photo.name}</h3>
			);

			return (<Col xs={6} md={4} lg={3} key={ind} className="photo-thumb">
						<Panel header={title}>
							<Link to={`/photos/${photo.id}`}><Image src={photo.image_url} responsive key={ind}/></Link>
			    		</Panel>
					</Col>
			);
		});
	}

	render() {
		let content = this.renderPhotos();
		return (
			<div>
				{content}
			</div>
		)
	}

}

export default PhotosGrid;
