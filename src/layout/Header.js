import React, { Component } from 'react';

import cookie from 'react-cookies';

import { Container, Row, Col } from 'react-grid-system';

export default class Header extends Component {

	constructor(props) {
	    super(props);

	    this.state = {
	    };

	    this.handleLogout = this.handleLogout.bind(this);
	}

	async componentDidMount(){
    	if (cookie.load('consumerAddress') || cookie.load('providerAddress')) {
    		console.log("Logged in");
    	} else {
    		console.log("Not Logged in");
    		setTimeout(function(){ window.location = "/login"; }, 500);
    	}
  	}

	handleLogout = (e) => {
		e.preventDefault();

	    cookie.remove('public_address', { path: '/' });
        cookie.remove('consumerAddress', { path: '/' });
        cookie.remove('providerAddress', { path: '/' });

        setTimeout(function(){ window.location = "/login"; }, 2000);
	};

  	render() {
	    return (
	      	<Container fluid style={{ lineHeight: '32px' }}>
				<Row align="center">
					<Col xs={12} md={6}>
					    <a href="/">
					        <img src="../images/logo.png" alt="medipedia logo" />
					    </a>
					</Col>
					<Col xs={12} md={6}>
					    <div className="header-menu">
					        <a className="menulinks" href="/dashboard">Dashboard</a>
					        <a className="menulinks" href="#">MEP Tokens</a>
					        <a className="menulinks" href="#">Reward Points</a>
					        <a className="menulinks" href="#">Account</a>
					        <a className="menulinks" onClick={this.handleLogout} href="#" >Log out</a>
					    </div>
					</Col>
				</Row>
		    </Container>
	    )
  	}
}
