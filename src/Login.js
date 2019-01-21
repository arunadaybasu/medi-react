import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom';

import cookie from 'react-cookies';

import Header from './layout/Header';
import { Container, Row, Col } from 'react-grid-system';

import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import Divider from '@material-ui/core/Divider';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';

import ReactMaterialSelect from 'react-material-select';
import 'react-material-select/lib/css/reactMaterialSelect.css';

import BackIcon from '@material-ui/icons/KeyboardArrowLeft';
import Icon from '@material-ui/core/Icon';
import CloseIcon from '@material-ui/icons/Close';

import consumerData from './model/ConsumerData';
import providerData from './model/MedicalProviders';
import userData from './model/UserDetails';
import serviceData from './model/ServiceCategories';

let id = 0;
var utc = new Date().toJSON().slice(0,10);
var utc1 = new Date().toJSON();
console.log(utc);

const styles = theme => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
  },
});

class Login extends Component {

  constructor(props) {
    super(props);

    this.state = {
      openSnack: false,
      snackMsg: 'Wrong Username/Password. Try again.',
      consumerdata: consumerData,
      providerdata: providerData,
      userdata: userData,
      username: '',
      password: '',
      showPassword: false,
      public_address: "",
      consumerAddress: "",
      providerAddress: "",
    };

  }

  async componentDidMount(){
    
  }

  handleOpenSnack = () => {
    this.setState({ openSnack: true });
  };

  handleCloseSnack = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    this.setState({ openSnack: false });
  };

  handleChange = name => event => {
    console.log(event.target.value);
    this.setState({
      [name]: event.target.value,
    });
  };

  handleMouseDownPassword = event => {
    event.preventDefault();
  };

  handleClickShowPassword = () => {
    this.setState({ showPassword: !this.state.showPassword });
  };

  handleLoginButton = event => {
    console.log("submitted");
    var flag = 0;
    var obj = '';
    for(var i = 0; i < userData.length; i++) {
      obj = userData[i];
      console.log(obj);
      if (obj.username == this.state.username) {
        if (obj.password == this.state.password) {
          if (obj.usertype == "consumer") {

            flag = 1;

            cookie.remove('public_address', { path: '/' });
            cookie.remove('consumerAddress', { path: '/' });
            cookie.remove('providerAddress', { path: '/' });

            cookie.save('public_address', obj.address, { path: '/' });
            cookie.save('consumerAddress', obj.address, { path: '/' });

            this.setState({ 
              public_address: obj.address,
              consumerAddress: obj.address
            });
            setTimeout(function(){ window.location = '/consumer/inbox'; }, 1000);
          } else {

            flag = 1;

            cookie.remove('public_address', { path: '/' });
            cookie.remove('consumerAddress', { path: '/' });
            cookie.remove('providerAddress', { path: '/' });

            cookie.save('public_address', obj.address, { path: '/' });
            cookie.save('providerAddress', obj.address, { path: '/' });
            
            this.setState({ 
              public_address: obj.address,
              providerAddress: obj.address
            });
            setTimeout(function(){ window.location = '/clinic/inbox'; }, 1000);
          }
        }
      }
    }
    if (flag == 0) {
      // console.log("wrong");
      this.handleOpenSnack();
    }
  };

    
  render() {

      var urls = window.location.pathname.split("/");

      return (
          <div>
              <Container fluid style={{ lineHeight: '32px' }} className="login-container">
                <Row>
                  <Col xs={12} md={4} offset={{ md: 4 }}>
                    <img src="../images/logo.png" alt="medipedia logo"/>
                  </Col>
                </Row>
                <Row>
                  <Col xs={12} md={4} offset={{ md: 4 }}>
                    <TextField
                      id=""
                      label="Username"
                      defaultValue=""
                      className="medicalform-text-field"
                      onChange={this.handleChange('username')}
                    />
                  </Col>
                </Row>
                <Row>
                  <Col xs={12} md={4} offset={{ md: 4 }}>
                    <FormControl className="medicalform-text-field">
                      <InputLabel htmlFor="adornment-password">Password</InputLabel>
                      <Input
                        id="adornment-password"
                        type={this.state.showPassword ? 'text' : 'password'}
                        defaultValue=""
                        onChange={this.handleChange('password')}
                        endAdornment={
                          <InputAdornment position="end">
                            <IconButton
                              aria-label="Toggle password visibility"
                              onClick={this.handleClickShowPassword}
                              onMouseDown={this.handleMouseDownPassword}
                            >
                              {this.state.showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        }
                      />
                    </FormControl>
                    <br/><br/>
                    <Button variant="contained" color="primary" className="login-btn" onClick={this.handleLoginButton.bind(this)}>
                      Login
                      <Icon className="send-btn-icon">send</Icon>
                    </Button>
                  </Col>
                </Row>
              </Container>
              <Snackbar
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'left',
                }}
                open={this.state.openSnack}
                autoHideDuration={4000}
                onClose={this.handleCloseSnack}
                ContentProps={{
                  'aria-describedby': 'message-id-snack',
                }}
                message={<span id="message-id-snack">{this.state.snackMsg}</span>}
                action={[
                  <IconButton
                    key="close"
                    aria-label="Close"
                    color="primary"
                    className="snack-close-btn"
                    onClick={this.handleCloseSnack}
                  >
                    <CloseIcon />
                  </IconButton>,
                ]}
              />
          </div>
      )
  }
}

Login.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Login);
