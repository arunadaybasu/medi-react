import React, { Component } from 'react';

import cookie from 'react-cookies';

import { Container, Row, Col } from 'react-grid-system';

import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

export default class Subheader extends Component {

	constructor(props) {
	    super(props);

	    this.state = {
	    };
	}

  	render() {
	    return (
	      	<Row>
                  <Col xs={6} md={6}>
                      <img src="../images/ad.png" alt="medipedia demo ad" className="home-ads-1" />
                  </Col>
                  <Col xs={6} md={3}>
                      <Paper elevation={4} className="subheader-block">
                          <Typography variant="headline" component="h3" className="subheader-title">
                            MEP Tokens
                          </Typography>
                          <Typography component="p" className="subheader-title ">
                            100
                          </Typography>
                      </Paper>
                  </Col>
                  <Col xs={6} md={3}>
                      <Paper elevation={4} className="subheader-block">
                          <Typography variant="headline" component="h3" className="subheader-title">
                            Reward Points
                          </Typography>
                          <Typography component="p" className="subheader-title">
                            100
                          </Typography>
                      </Paper>
                  </Col>
                </Row>
	    )
  	}
}
