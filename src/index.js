import React from 'react';
import ReactDOM from 'react-dom';
// import App from './App';
import Consumer from './Consumer';
import Clinic from './Clinic';
import Login from './Login';
import {BrowserRouter, Route} from 'react-router-dom';

var injectTapEventPlugin = require("react-tap-event-plugin");
injectTapEventPlugin();

ReactDOM.render((
 //    <BrowserRouter>
	// 	<App />
	// </BrowserRouter>
	<BrowserRouter>
        <div>
            <Route exact path="/" component={Consumer}/>
            <Route exact path="/dashboard" component={Consumer}/>
            <Route exact path="/consumer" component={Consumer}/>
            <Route exact path="/consumer/inbox" component={Consumer}/>
            <Route exact path="/consumer/medical-request" component={Consumer}/>
            <Route exact path="/clinic" component={Clinic}/>
            <Route exact path="/clinic/inbox" component={Clinic}/>
            <Route exact path="/clinic/other-services" component={Clinic}/>
            <Route exact path="/login" component={Login}/>
        </div>
    </BrowserRouter>
	), document.getElementById('root'));
