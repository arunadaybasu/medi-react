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
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Divider from '@material-ui/core/Divider';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Checkbox from '@material-ui/core/Checkbox';
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import CircularProgress from '@material-ui/core/CircularProgress';

import BackIcon from '@material-ui/icons/KeyboardArrowLeft';
import Icon from '@material-ui/core/Icon';
import CloseIcon from '@material-ui/icons/Close';

import consumerData from './model/ConsumerData';
import providerData from './model/MedicalProviders';
import userData from './model/UserDetails';
import serviceData from './model/ServiceCategories';

import MessageReplyHandler from './service/MessageReplyHandler';

import getWeb3 from './utils/getWeb3'
import ipfs from './utils/ipfs'
import MedipediaContract from '../build/contracts/Medipedia.json'

let id = 0;
var utc = new Date().toJSON().slice(0,10);

const data2 = [
  createData('GHI Clinic', 'Enquiry about Rhinoplasty', '1.30 PM'),
  createData('JFJK  Clinic', 'Enquiry about Rhinoplasty', '1.30 PM'),
  createData('LMN Clinic', 'Enquiry about Rhinoplasty', '1.30 PM')
];

function createData(name, enquiry, apptime) {
  id += 1;
  return { id, name, enquiry, apptime };
}

function TabContainer(props) {
  return (
    <Typography component="div" style={{ padding: 8 * 3 }}>
      {props.children}
    </Typography>
  )
}

TabContainer.propTypes = {
  children: PropTypes.node.isRequired,
};

const styles = theme => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
  },
});

class Consumer extends Component {

  constructor() {
    super();
    this.state = {
      value: 0,
      messageid: '',
      message: '',
      medicalform: '',
      department: "",
      reply_text: '',
      openSnack: false,
      snackMsg: 'Your reply has been sent to receiver.',
      request_hash: "",
      public_address: cookie.load('public_address'),
      consumerAddress: cookie.load('consumerAddress'),
      providerAddress: cookie.load('providerAddress'),
      consumerId: "",
      providerId: "",
      accessRequest: false,
      messages: [],
      sendMessageReply: false,
      web3: null,
      openDialogReply: false,
      consumerdata: [],
      providerdata: providerData,
      messageAddress: '',

    };

    this.whenReplyDone = this.whenReplyDone.bind(this);

    this.handleMedicalUrl();
  }

  async componentDidMount(){
    getWeb3
      .then(results => {
          this.setState({
          web3: results.web3
          })

          // this.updateUserStatus();
          this.getMessageList();
      })
      .catch(() => {
          console.log('Error finding web3.')
      })
    console.log("consumerAddress: " + this.state.consumerAddress + " providerAddress: " + this.state.providerAddress + " public_address: " + this.state.public_address);  
  }

  async updateUserStatus(){
    const contract = require('truffle-contract');
    const medipedia = contract(MedipediaContract);
    medipedia.setProvider(this.state.web3.currentProvider);
    this.state.web3.eth.getAccounts(async(error, accounts) => {

      const medipediaInstance = await medipedia.deployed();

      await medipediaInstance.setUserStatus((this.state.public_address).toString(),1, {from: accounts[0], gas:470000})
      await medipediaInstance.setUserStatus('0xf17f52151EbEF6C7334FAD080c5704D77216b732',1, {from: accounts[0], gas:470000})
      //await medipediaInstance.setUserStatus('0xf17f52151EbEF6C7334FAD080c5704D77216b732',1, {from: accounts[0], gas:470000})
      //await medipediaInstance.setUserStatus('0x2191eF87E392377ec08E7c08Eb105Ef5448eCED5',1, {from: accounts[0], gas:470000})

      let user1 = await medipediaInstance.getUserStatus(this.state.public_address);
      console.log('user 1 is active: ' + user1)
    });

  }

  async getMessageList(){
    const contract = require('truffle-contract');
    const medipedia = contract(MedipediaContract);
    medipedia.setProvider(this.state.web3.currentProvider);
        
    this.state.web3.eth.getAccounts(async(error, accounts) => {

      console.log('first account : ' + accounts[0])
      const medipediaInstance = await medipedia.deployed();
      const noOfRequests = await medipediaInstance.getNoOfMsgs((this.state.providerAddress).toString());
      let user1 = await medipediaInstance.getUserStatus(this.state.providerAddress);
      console.log('provider is active: ' + user1)

      console.log('noOfRequests is : ' + noOfRequests)
      let index;
      var messages = new Array(noOfRequests);
      for (index = 0; index < noOfRequests; index++) {
        let messageReplyHash = await medipediaInstance.getMessageCommunicationHash(this.state.providerAddress, index+1);
        
        let messageRequestHash = await medipediaInstance.getMessageRequestHash(this.state.providerAddress, index+1);
        
        let ipfsMsgRequestOutput = await ipfs.cat(messageRequestHash);

        var output = JSON.parse(ipfsMsgRequestOutput);
        output['primary_request_hash']=messageRequestHash;
        console.log('primary_request_hash = ' + output['primary_request_hash'])

        let ipfsMsgOutput;
        if(messageReplyHash.length > 0){
          ipfsMsgOutput = await ipfs.cat(messageReplyHash);
          output['replies'] = JSON.parse(ipfsMsgOutput)
        }
        messages[index] = output;
        //console.log(output)
        console.log("messages::: "+JSON.stringify(messages))
      }
      this.setState({consumerdata: messages})
    });
  }

  handleMedicalUrl = () => {
    var urls = window.location.pathname.split("/");
    if (urls[1] === "medical-request" || urls[2] === "medical-request") {
      this.state = { medicalform: (
          <div>
            <Paper elevation={4} id="medical-form-block" className="medical-form-block">
                <Row>
                  <Col xs={12} md={12}>
                    <Typography variant="title" gutterBottom>
                      Medical Service Consultation Form
                    </Typography>
                  </Col>
                </Row>
                <Row>
                  <Col xs={12} md={6}>
                    <FormControl className="medicalform-text-field">
                      <InputLabel htmlFor="medical-dept">Medical Department</InputLabel>
                      <Select
                        value={this.state.department}
                        onChange={this.handleChangeMedicalDept}
                        inputProps={{
                          name: 'medical-dept',
                          id: 'medical-dept'
                        }}
                      >
                        <MenuItem value="">
                          <em>None</em>
                        </MenuItem>
                        <MenuItem value={1}>Ten</MenuItem>
                        <MenuItem value={2}>Twenty</MenuItem>
                        <MenuItem value={3}>Thirty</MenuItem>
                      </Select>
                    </FormControl>
                  </Col>
                  <Col xs={12} md={6}>
                    <TextField
                      id=""
                      label="Treatment"
                      defaultValue=""
                      className="medicalform-text-field"
                    />
                  </Col>
                </Row>
                <Row>
                  <Col xs={12} md={6}>
                    <TextField
                      id=""
                      label="Desired From Date"
                      defaultValue="2018-09-10"
                      className="medicalform-text-field"
                      type="date"
                    />
                  </Col>
                  <Col xs={12} md={6}>
                    <TextField
                      id=""
                      label="Desired To Date"
                      defaultValue="2018-09-10"
                      className="medicalform-text-field"
                      type="date"
                    />
                  </Col>
                </Row>
                <Row>
                  <Col xs={12} md={6}>
                    <TextField
                      id=""
                      label="Estimated Budget"
                      defaultValue=""
                      className="medicalform-text-field"
                    />
                  </Col>
                  <Col xs={12} md={6}>
                    <TextField
                      id=""
                      label="Currency"
                      defaultValue=""
                      className="medicalform-text-field"
                    />
                  </Col>
                </Row>
                <Row>
                  <Col xs={12} md={12}>
                    <TextField
                      id=""
                      label="Subject"
                      defaultValue=""
                      className="medicalform-text-field"
                    />
                  </Col>
                </Row>
                <Row>
                  <Col xs={12} md={12}>
                    <TextField
                      id=""
                      label="Description"
                      multiline
                      rowsMax="4"
                      defaultValue=""
                      className="medicalform-text-field"
                    />
                  </Col>
                </Row>
            </Paper>
          </div>
          
        ) };
    }
  }

  whenReplyDone (e) {
    this.setState({
      openDialogReply: false,
      snackMsg: 'Your reply has been sent to receiver.',
      openSnack: true
    });
    var element = document.getElementById("loader-main");
    element.classList.add("hide");
    //setTimeout(function(){ location.reload(); }, 2000);
  }

  sendReply (e){
    e.preventDefault();
    //console.log('Send Message Data::: '+ JSON.stringify(this.state.consumerdata));
    // console.log('this.state.messageAddress::: '+ this.state.messageAddress);

    var element = document.getElementById("loader-main");
    element.classList.remove("hide");
    
    for(var i = 0; i < this.state.consumerdata.length; i++) {
      // console.log('this.state.consumerdata[i].primary_request_hash::: '+ this.state.consumerdata[i].primary_request_hash);
      // console.log('this.state.consumerdata[i].public_address::: '+ this.state.consumerdata[i].public_address);
      // console.log( (1947+i) + " == " + this.state.messageAddress );
        if ( ( typeof this.state.consumerdata[i].replies !== 'undefined') 
          && ((1947+i) == this.state.messageAddress) ) {
          this.setState({request_hash: this.state.consumerdata[i].primary_request_hash})
          var obj = this.state.consumerdata[i].replies.message[this.state.consumerdata[i].replies.message.length-1];
          this.state.consumerdata[i].replies.message.push(
            {
              id: String(parseInt(obj.id)+1),
              to: this.state.providerId,
              parent_msg_id: obj.id,
              sentDate: utc,
              msg_body: this.state.reply_text
            }
          );
          this.setState({
            messages: this.state.consumerdata[i].replies.message
          });
          console.log('after Send Message Data in if::: '+ JSON.stringify(this.state.consumerdata));
          break;
        } else if ((1947+i) == this.state.messageAddress) {
        // else{
          this.setState({request_hash: this.state.consumerdata[i].primary_request_hash})
          this.state.consumerdata[i].replies = {
          "request_hash" : this.state.consumerdata[i].primary_request_hash,
          "consumerAddress" : this.state.consumerdata[i].public_address,
          "providerAddress" : this.state.providerAddress,
          "accessRequest" : this.state.accessRequest,
          "message" : Array(
            {
              id: 1,
              to: this.state.providerId,
              parent_msg_id: 0,
              sentDate: utc,
              msg_body: this.state.reply_text
            }
          )
          };
          this.setState({
            messages: this.state.consumerdata[i].replies.message
          });
          console.log('after Send Message Data in else ::: '+ JSON.stringify(this.state.consumerdata));
          break;
        }
    }

    
    // this.setState({
    //   openDialogReply: false,
    //   snackMsg: 'Your reply has been sent to receiver.',
    //   openSnack: true
    // });
    this.setState({
      sendMessageReply: true
    });
    // console.log(this.state.sendMessageReply);
    //setTimeout(function(){ location.reload(); }, 3000);
  }

  handleDeleteAll = () => {
    const contract = require('truffle-contract');
    const medipedia = contract(MedipediaContract);
    medipedia.setProvider(this.state.web3.currentProvider);
    this.state.web3.eth.getAccounts(async(error, accounts) => {
      const medipediaInstance = await medipedia.deployed();
      let deleteRes = await medipediaInstance.deleteAllMessages((this.state.providerAddress).toString(), {from: accounts[0], gas:470000 });
      this.setState({
        snackMsg: 'All messages have been deleted.',
        openSnack: true
      });
    });
  };

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
    // console.log(event.target.value);
    this.setState({
      [name]: event.target.value,
    });
  };

  handleChangeAccessRequest = name => event => {
    
    this.setState({ accessRequest: event.target.checked });
    // console.log(this.state.accessRequest);
  };

  handleChangeMedicalDept = (event) => {
    // console.log(event.target.value);
    this.state = { department: event.target.value };
  };

  handleChangeIndex = index => {
    this.setState({ value: index });
  };

  handleClickBack = (e) => {
    var element = document.getElementById("tabs-block-1");
    element.classList.remove("hide");
    this.setState({ message: [] });
  }

  handleClickDialogOpenReply = () => {
    this.setState({ openDialogReply: true });
  };

  handleCloseDialogReply = () => {
    this.setState({ openDialogReply: false });
  };

  handleClickMessage = (e, id) => {
      var obj = '', obj1 = '', obj2 = '', obj3 = '', obj4 = '';

      // console.log(e.target.parentNode.textContent.includes('Accept Request'));

      this.setState({
        messageAddress: e.target.parentNode.id
      });
      
      if (e.target.parentNode.textContent === 'Accept Request') {
        e.target.parentNode.classList.add("hide");
      } else {

        var element = document.getElementById("tabs-block-1");
        element.classList.add("hide");
        // element = document.getElementById("message-block");
        // element.classList.remove("hide");

        for(var i = 0; i < this.state.consumerdata.length; i++) {
          obj = this.state.consumerdata[i];

          if ((i+1947) == e.target.parentNode.id) {

            for(var j = 0; j < this.state.providerdata.length; j++) {
              obj1 = this.state.providerdata[j];
              if ( ( typeof obj.replies !== 'undefined') && (obj.replies.accessRequest === true) && (obj1.public_address === obj.replies.providerAddress) ) {
                break;
              } else if (obj1.public_address === cookie.load('providerAddress')) {
                break;
              }
            }

            for(var k = 0; k < userData.length; k++) {
              obj2 = userData[k];
              if (obj.public_address == obj2.address) {
                break;
              }
            }

            for(var l = 0; l < serviceData.length; l++) {
              obj3 = serviceData[l];
              for(var m = 0; m < serviceData[l].services.length; m++) {
                obj4 = serviceData[l].services[m];
                // console.log(obj.category_id + " == " + obj4.id);
                if (obj.category_id == obj4.id) {
                  
                  break;
                }
              }
              if (obj.category_id == obj4.id) {
                break;
              }
            }

            break;
          }

        }

        if ( ( typeof obj.replies !== 'undefined') ) {
          console.log('id in if:: '+id)
          this.setState({
            consumerAddress: id,
            providerAddress: cookie.load('providerAddress'),
            consumerId: obj.patient_id,
            providerId: obj1.id
          });
        } else {
          console.log('id in else:: '+id)
          this.setState({
            consumerAddress: id,
            providerAddress: cookie.load('providerAddress'),
            consumerId: obj.patient_id,
            providerId: obj1.id
          });
        }

        // console.log(obj);

        var msgs = [];
        var flag = 0;
        var type = 'consumer';

        if( ( typeof obj.replies !== 'undefined') ) { 

          var obj7 = '';

          for(j = 0; j < obj.replies.message.length; j++) {
            var obj6 = obj.replies.message[j];
            flag = 0;  

            for(k = 0; k < userData.length; k++) {
              obj7 = userData[k];
              // console.log(obj6j7.id + " == " + obj6.to);
              if (obj6.to == obj7.id) {
                flag = 1;
                type = 'consumer';
                
                break;
              }
            }

            if (flag === 0) {
              for(l = 0; l < this.state.providerdata.length; l++) {
                obj7 = this.state.providerdata[l];
                // console.log(obj7.id + " == " + obj6.to);
                if (obj6.to == obj7.id) {
                  flag = 1;
                  type = 'clinic';
                  break;
                }
              }
            }

            console.log(type);
            console.log(obj7);

            if (flag == 1 && type == 'consumer') {

              msgs.push(
                <div key={obj6.id}>
                  <Row>
                    <Col xs={12} md={6}>
                      <Typography variant="body2">
                        {obj7.username}
                      </Typography>
                      <Typography variant="body1" gutterBottom>
                        to {obj1.name}
                      </Typography>
                    </Col>
                    <Col xs={12} md={6}>
                      <Typography variant="body1" gutterBottom align="right">
                        {obj6.sentDate}
                      </Typography>
                    </Col>
                  </Row>
                  <Row>
                    <Col xs={12} md={12}>
                      <Typography variant="body1" gutterBottom className="message-body-margin">
                        {obj6.msg_body}
                      </Typography>
                      <Divider className="divider-full" />
                    </Col>
                  </Row>
                </div>
              );

            } else if ((flag == 1 && type == 'clinic') || flag == 0) {

              msgs.push(
                <div key={obj6.id}>
                  <Row>
                    <Col xs={12} md={6}>
                      <Typography variant="body2">
                        {obj7.name}
                      </Typography>
                      <Typography variant="body1" gutterBottom>
                        to {obj2.username}
                      </Typography>
                    </Col>
                    <Col xs={12} md={6}>
                      <Typography variant="body1" gutterBottom align="right">
                        {obj6.sentDate}
                      </Typography>
                    </Col>
                  </Row>
                  <Row>
                    <Col xs={12} md={12}>
                      <Typography variant="body1" gutterBottom className="message-body-margin">
                        {obj6.msg_body}
                      </Typography>
                      <Divider className="divider-full" />
                    </Col>
                  </Row>
                </div>
              );

            }

          }


        }

        msgs.push(
          <div>
            <Row>
              <Col xs={12} md={12}>
                <TextField
                  id="reply-text"
                  label="Reply"
                  multiline
                  rowsMax="4"
                  helperText="Refer the popover to include key points"
                  className="medicalform-text-field"
                  onChange={this.handleChange('reply_text')}
                />
                <FormGroup row>
                  <FormControlLabel
                    control={
                      <Checkbox
                        onChange={this.handleChangeAccessRequest('accessRequest')}
                        value={this.state.accessRequest}
                        color="primary"
                      />
                    }
                    label="Request Access to Patient's Information"
                  />
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col xs={12} md={12}>
                <Button variant="contained" color="primary" className="send-btn" onClick={this.handleClickDialogOpenReply.bind(this)}>
                  Send
                  <Icon className="send-btn-icon">send</Icon>
                </Button>
              </Col>
            </Row>
          </div>
        );

        // console.log(obj);
        
        this.setState({ message: (
          <div id="message-block-container">
            <Button variant="contained" color="primary" className="back-btn" onClick={event => this.handleClickBack(event)}>
              <BackIcon className="back-btn-icon" />
              Back
            </Button>
            <Paper elevation={4} id="message-block" className="message-block">
                <Row>
                  <Col xs={12} md={12}>
                    <Typography variant="title" gutterBottom>
                      {obj.subject}
                    </Typography>
                  </Col>
                </Row>
                <Row>
                  <Col xs={12} md={6}>
                    <Typography variant="body2">
                      {obj2.username}
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      to {obj1.name}
                    </Typography>
                  </Col>
                  <Col xs={12} md={6}>
                    <Typography variant="body1" gutterBottom align="right">
                      {obj.sentDate.slice(0,10)}
                    </Typography>
                  </Col>
                </Row>
                <Row>
                  <Col xs={12} md={6}>
                    <Typography variant="body1" gutterBottom>
                      <b>Medical Department:</b> {obj3.name}
                    </Typography>
                  </Col>
                  <Col xs={12} md={6}>
                    <Typography variant="body1" gutterBottom>
                      <b>Treatment:</b> {obj4.name}
                    </Typography>
                  </Col>
                </Row>
                <Row>
                  <Col xs={12} md={6}>
                    <Typography variant="body1" gutterBottom>
                      <b>Desired (From) Date:</b> {obj.desired_from_date}
                    </Typography>
                  </Col>
                  <Col xs={12} md={6}>
                    <Typography variant="body1" gutterBottom>
                      <b>Desired (To) Date:</b> {obj.desired_to_date}
                    </Typography>
                  </Col>
                </Row>
                <Row>
                  <Col xs={12} md={12}>
                    <Typography variant="body1" gutterBottom className="message-body-margin">
                      {obj.message_body}
                    </Typography>
                  </Col>
                </Row>
                
                {msgs}

            </Paper>
          </div>
          
        ) });

      }
  };

  handleClickAcceptRequest = (e, messageid) => {
      e.preventDefault();
      // console.log(e.target);
  };

  createInbox = () => {
    console.log(this.state.consumerdata);
    var consumers = [];
      if (this.state.consumerdata.length > 0 && this.state.consumerdata[0].public_address != undefined) {
        // console.log(this.state.consumerdata);
        for(var i = 0; i < this.state.consumerdata.length; i++) {
            var obj = this.state.consumerdata[i];
            
            if( ( typeof obj.replies !== 'undefined') && (obj.replies.accessRequest === true) ) {
              // console.log(obj.public_address);
              for(var j = 0; j < this.state.providerdata.length; j++) {
                  var obj1 = this.state.providerdata[j];
                  
                  if ( obj.replies.providerAddress == obj1.public_address ) {
                    // console.log(obj.replies.providerAddress + " == " + obj1.public_address);
                    for(var k = 0; k < this.state.consumerdata.length; k++) {
                      var obj2 = userData[k];
                      if (obj2.address == obj.public_address ) {
                        break;
                      }
                    }
                    consumers.push(
                      <TableRow key={(i+1947)} id={(i+1947)} hover onClick={event => this.handleClickMessage(event, obj.public_address)} className="message-row">
                        <TableCell component="th" scope="row">
                          {obj2.username}
                        </TableCell>
                        <TableCell numeric>{obj.subject}</TableCell>
                        <TableCell numeric>
                          {obj.sentDate.slice(0,10)}
                        </TableCell>
                      </TableRow>
                    );
                    break;
                  } 
              }

            } else {

              for(var k = 0; k < this.state.consumerdata.length; k++) {
                var obj2 = userData[k];
                if (obj2.address == obj.public_address ) {
                  break;
                }
              }
              // console.log( i + 1947 );
              consumers.push(
                <TableRow key={(i+1947)} id={(i+1947)} hover onClick={event => this.handleClickMessage(event, obj.public_address)} className="message-row">
                  <TableCell component="th" scope="row">
                    {obj2.username}
                  </TableCell>
                  <TableCell numeric>{obj.subject}</TableCell>
                  <TableCell numeric>
                    {obj.sentDate.slice(0,10)}
                  </TableCell>
                </TableRow>
              );

            }
        }
        
      } else {
        consumers.push(
          <Typography key={(2947)} variant="title" gutterBottom className="no-msgs-text">
            Sorry. There are no messages to show.
          </Typography>
        );
      }
      // console.log(consumers);
      return consumers;
  }

  createLeftMenu = () => {
    var urls = window.location.pathname.split("/");
    var menu = '';
    if (urls[1] === "inbox" || urls[2] === "inbox") {
      menu =  <div>
                  <Button variant="contained" color="primary" className="menu-left" component={Link} to="/clinic/inbox">
                      Inbox
                  </Button>
                  <Button variant="outlined" className="menu-left" component={Link} to="/clinic/social">
                      Social Networking
                  </Button>
                </div>;
    } else if (urls[1] === "medical-request" || urls[2] === "medical-request") {
      menu =  <div>
                  <Button variant="outlined" className="menu-left" component={Link} to="/clinic/inbox">
                      Inbox
                  </Button>
                  <Button variant="contained" color="primary" className="menu-left" component={Link} to="/clinic/social">
                      Social Networking
                  </Button>
                </div>;
    } else {
      menu =  <div>
        <Button variant="outlined" className="menu-left" component={Link} to="/clinic/inbox">
            Inbox
        </Button>
        <Button variant="outlined" className="menu-left" component={Link} to="/clinic/medical-request">
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
  }


  
  render() {

      const { value } = this.state;

      return (
          <div>
              <Header/>
              <Container fluid style={{ lineHeight: '32px' }}>
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
                          <Typography component="p" className="subheader-title ">
                            100
                          </Typography>
                      </Paper>
                  </Col>
                </Row>
                <Row >
                  <Col xs={6} md={2}>
                      {this.createLeftMenu()}
                  </Col>
                  <Col xs={6} md={10} className="msgs-tabs-col">
                    {this.state.sendMessageReply ? 
                      <MessageReplyHandler 
                          request_hash={this.state.request_hash}
                          consumerAddress={this.state.consumerAddress}
                          providerAddress={this.state.providerAddress}
                          message={this.state.messages}
                          accessRequest={this.state.accessRequest}
                          web3={this.state.web3}
                          action={this.whenReplyDone}
                      /> 
                      : null}
                    {value === 0 && 
                        <TabContainer>
                          <Paper elevation={4} id="tabs-block-1" className="tabs-block">
                              <Tabs
                                value={this.state.value}
                                indicatorColor="primary"
                                textColor="primary"
                                onChange={this.handleChange}
                              >
                                <Tab label="Enquiries"  value={0}>
                                  Item One
                                </Tab>
                                <Tab label="Promotions" value={1} disabled>
                                  Item One
                                </Tab>
                              </Tabs>
                              <Table className="enquiries-table">
                                  <TableHead>
                                    <TableRow>
                                      <TableCell>From</TableCell>
                                      <TableCell numeric>Subject</TableCell>
                                      <TableCell numeric>Date</TableCell>
                                    </TableRow>
                                  </TableHead>
                                  <TableBody>
                                    {this.createInbox()}
                                  </TableBody>
                              </Table>
                          </Paper>

                          {this.state.message}

                        </TabContainer>
                    }
                    {value === 1 && 
                        <TabContainer>
                            <Paper elevation={2} id="tabs-block-2" className="tabs-block">
                                <Tabs
                                  value={this.state.value}
                                  indicatorColor="primary"
                                  textColor="primary"
                                  onChange={this.handleChange}
                                >
                                  <Tab label="Enquiries"  value={0}>
                                    Item One
                                  </Tab>
                                  <Tab label="Promotions" value={1} disabled>
                                    Item One
                                  </Tab>
                                </Tabs>
                                <Table className="enquiries-table">
                                    <TableHead>
                                      <TableRow>
                                        <TableCell>From</TableCell>
                                        <TableCell numeric>Subject</TableCell>
                                        <TableCell numeric>Appointment Date/Time</TableCell>
                                      </TableRow>
                                    </TableHead>
                                    <TableBody>
                                      {data2.map(n => {
                                        return (
                                          <TableRow key={n.id}>
                                            <TableCell component="th" scope="row">
                                              {n.name}
                                            </TableCell>
                                            <TableCell numeric>{n.enquiry}</TableCell>
                                            <TableCell numeric>{n.apptime}</TableCell>
                                          </TableRow>
                                        );
                                      })}
                                    </TableBody>
                                </Table>
                            </Paper>
                        </TabContainer>
                    }

                    {this.state.medicalform}

                    <Button onClick={this.handleDeleteAll} variant="contained" color="primary" className="delete-all-btn">
                      Delete All
                    </Button>

                  </Col>
                </Row>
              </Container>
              <Dialog
                open={this.state.openDialogReply}
                onClose={this.handleCloseDialogReply}
                aria-labelledby="alert-dialog-title-reply"
                aria-describedby="alert-dialog-description-reply"
              >
                <DialogTitle id="alert-dialog-title-reply">
                  <Typography variant="title" align="center" gutterBottom>
                    Confirm Reply
                  </Typography>
                </DialogTitle>
                <DialogContent>
                  <DialogContentText id="alert-dialog-description-reply">
                    <img src="../images/metamask.png" alt="metamask dialog image" className="metamask-img" />
                    <Typography variant="body1" align="center" gutterBottom className="dialog-body-text">
                      When you click "Continue" we will pop up a Metamask dialog.
                    </Typography>
                    <Typography variant="body1" align="center" gutterBottom className="dialog-body-text">
                      The dialog will ask you to confirm your messaging transaction, including the small ETH cost.
                    </Typography>
                    <Typography variant="body1" align="center" gutterBottom className="dialog-body-text">
                      It will set a default gas limit and price. It's fine to stick with these defaults.
                    </Typography>
                    <div id="loader-main" className="loader-center hide">
                        <CircularProgress className="loader-circular" />
                        <Typography variant="body2" align="center" gutterBottom className="dialog-body-text">
                          Please wait...
                        </Typography>
                    </div>
                  </DialogContentText>
                </DialogContent>
                <DialogActions>
                  <Button onClick={this.handleCloseDialogReply} color="primary">
                    Cancel
                  </Button>
                  <Button onClick={this.sendReply.bind(this)} variant="contained" color="primary" autoFocus>
                    Continue
                  </Button>
                </DialogActions>
              </Dialog>
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

Consumer.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Consumer);
