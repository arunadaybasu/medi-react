import React, { Component } from 'react';

import cookie from 'react-cookies';

import { Container, Row, Col } from 'react-grid-system';

import { Link } from 'react-router-dom';
import Button from '@material-ui/core/Button';

export default class Sidebar extends Component {

	constructor(props) {
	    super(props);

	    this.state = {
	    };
	}

	createLeftMenu = () => {
	    var urls = window.location.pathname.split("/");
	    var menu = '';
	    if (urls[1] === "inbox" || urls[2] === "inbox") {
	      menu =  <div>
	                  <Button variant="contained" color="primary" className="menu-left" component={Link} to="/consumer/inbox">
	                      Inbox
	                  </Button>
	                  <Button variant="outlined" className="menu-left" component={Link} to="/consumer/medical-request">
	                      Medical Request
	                  </Button>
	                  <Button variant="outlined" className="menu-left">
	                      Interpreter
	                  </Button>
	                  <Button variant="outlined" className="menu-left">
	                      Travel Agency
	                  </Button>
	                  <Button variant="outlined" className="menu-left">
	                      Insurance
	                  </Button>
	                  <Button variant="outlined" className="menu-left">
	                      Social Networking
	                  </Button>
	                </div>;
	    } else if (urls[1] === "medical-request" || urls[2] === "medical-request") {
	      menu =  <div>
	                  <Button variant="outlined" className="menu-left" component={Link} to="/consumer/inbox">
	                      Inbox
	                  </Button>
	                  <Button variant="contained" color="primary" className="menu-left" component={Link} to="/consumer/medical-request">
	                      Medical Request
	                  </Button>
	                  <Button variant="outlined" className="menu-left">
	                      Interpreter
	                  </Button>
	                  <Button variant="outlined" className="menu-left">
	                      Travel Agency
	                  </Button>
	                  <Button variant="outlined" className="menu-left">
	                      Insurance
	                  </Button>
	                  <Button variant="outlined" className="menu-left">
	                      Social Networking
	                  </Button>
	                </div>;
	    } else {
	      menu =  <div>
	        <Button variant="outlined" className="menu-left" component={Link} to="/consumer/inbox">
	            Inbox
	        </Button>
	        <Button variant="outlined" className="menu-left" component={Link} to="/consumer/medical-request">
	            Medical Request
	        </Button>
	        <Button variant="outlined" className="menu-left">
	            Interpreter
	        </Button>
	        <Button variant="outlined" className="menu-left">
	            Travel Agency
	        </Button>
	        <Button variant="outlined" className="menu-left">
	            Insurance
	        </Button>
	        <Button variant="outlined" className="menu-left">
	            Social Networking
	        </Button>
	      </div>;
	    }


	      // console.log(urls);
	      return menu;
	};

  	render() {
	    return (
	    	<div>
		      	{this.createLeftMenu()}
		    </div>
	    )
  	}
}
