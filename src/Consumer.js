import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom';

import cookie from 'react-cookies';

import Header from './layout/Header';
import Subheader from './layout/Subheader';
import Sidebar from './layout/Sidebar';
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
import CircularProgress from '@material-ui/core/CircularProgress';

import ReactMaterialSelect from 'react-material-select';
import 'react-material-select/lib/css/reactMaterialSelect.css';

import BackIcon from '@material-ui/icons/KeyboardArrowLeft';
import Icon from '@material-ui/core/Icon';
import CloseIcon from '@material-ui/icons/Close';

import consumerData from './model/ConsumerData';
import providerData from './model/MedicalProviders';
import userData from './model/UserDetails';
import serviceData from './model/ServiceCategories';

import MessageRequestHandler from './service/MessageRequestHandler';
import MessageReplyHandler from './service/MessageReplyHandler';

import getWeb3 from './utils/getWeb3'
import ipfs from './utils/ipfs'
import MedipediaContract from '../build/contracts/Medipedia.json'

// console.log(this.state.consumerdata);

let id = 0;
var utc = new Date().toJSON().slice(0,10);
var utc1 = new Date().toJSON();
console.log(utc);

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

const currencies = [
  {
    value: 'USD',
    label: '$',
  },
  {
    value: 'EUR',
    label: '€',
  },
  {
    value: 'BTC',
    label: '฿',
  },
  {
    value: 'JPY',
    label: '¥',
  },
];

class Consumer extends Component {

  constructor(props) {
    super(props);

    this.state = {
      errorTextSubject: 'More than one character at least',
      openSnack: false,
      snackMsg: 'Your reply has been sent to receiver.',
      valueTab: 0,
      messageid: '',
      message: '',
      medicalform: '',
      reply_text: '',
      department: "",
      treatment: '',
      departmentsArr: [],
      treatmentsArr: [],
      patient_id: '',
      public_address: cookie.load('public_address'),
      gender: '',
      age_group: '',
      subject: "",
      desired_from_date: "",
      desired_to_date: "",
      estimated_budget: "",
      currency: "USD",
      sentDate: utc1,
      message_body: "",
      category_id : "",
      sendMessageRequest: false,
      messageAddress: '',
      request_hash: "",
      consumerAddress: cookie.load('consumerAddress'),
      providerAddress: cookie.load('providerAddress'),
      consumerId: "",
      providerId: "",
      accessRequest: false,
      messages: [],
      sendMessageReply: false,
      web3: null,
      openDialog: false,
      openDialogReply: false,
      consumerdata: [],
      providerdata: providerData
    };

    this.handleChangeMedicalDept = this.handleChangeMedicalDept.bind(this);
    this.handleChangeTreatment = this.handleChangeTreatment.bind(this);
    this.whenRequestDone = this.whenRequestDone.bind(this);
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

      this.setState({
        desired_from_date: utc,
        desired_to_date: utc
      });

      console.log("consumerAddress: " + this.state.consumerAddress + " providerAddress: " + this.state.providerAddress + " public_address: " + this.state.public_address);
  }
  /**
   * This method is for testing purpose
   * and it should be removed while in production
   */
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
      const medipediaInstance = await medipedia.deployed();
      //let deleteRes = await medipediaInstance.deleteAllMessages((this.state.public_address).toString(), {from: accounts[0], gas:470000 });
      //console.log('messages deleted: '+ JSON.stringify(deleteRes))
      //get number of medical requests
      const noOfRequests = await medipediaInstance.getNoOfMsgs((this.state.public_address).toString());
      console.log('noOfRequests: '+ noOfRequests)


      let index;
      var messages = new Array(noOfRequests);
      for (index = 0; index < noOfRequests; index++) {
        
        let messageRequestHash = await medipediaInstance.getMessageRequestHash(this.state.public_address, index+1);
        //console.log('messageRequest : ' +messageRequest);
        let ipfsMsgRequestOutput = await ipfs.cat(messageRequestHash);
        //console.log('ipfsMsgRequestOutput : ' +ipfsMsgRequestOutput);
        var ipfsMsgRequestOutputInJson = JSON.parse(ipfsMsgRequestOutput);
        var _categoryId=ipfsMsgRequestOutputInJson.category_id;
        
        const providers = providerData.filter(p => 
          (p.services.find(service => service.id.toString().includes(_categoryId, 0))));
        
        let x = index;
        var i = 0;

        var output = JSON.parse(ipfsMsgRequestOutput);
        // output['primary_request_hash']=messageRequestHash;
        for(i = 0;i < providers.length; i++){
          console.log("x: " + x + " i: " + i + " index: " + index);
          let messageRequestHashUsingProviderAddress = await medipediaInstance.getMessageRequestHashUsingProviderAddress(this.state.public_address, x+1,providers[i].public_address);
          // console.log('Provider Address --- '+ providers[i].public_address);

          ipfsMsgRequestOutput = await ipfs.cat(messageRequestHashUsingProviderAddress);
          // console.log("ipfsMsgRequestOutput: " + ipfsMsgRequestOutput);

          output = JSON.parse(ipfsMsgRequestOutput);

          output['primary_request_hash']=messageRequestHashUsingProviderAddress;

          output['provider_address'] = providers[i].public_address;

          let message = await medipediaInstance.getMessageCommunicationHash(this.state.public_address, x+1);
          let ipfsMsgOutput;
          if(message.length > 0){
            ipfsMsgOutput = await ipfs.cat(message);
            output['replies'] = JSON.parse(ipfsMsgOutput)
          }
          messages[x] = output;
          console.log('output '+ JSON.stringify(output))
          x++;
        }
        
        index = x-1;
      
        
        //console.log('primary_request_hash = ' + output['primary_request_hash']);

        
      }
      this.setState({consumerdata: messages});
      console.log("Final consumer data: " + JSON.stringify(this.state.consumerdata));
    });
  }

  handleDeleteAll = () => {
    const contract = require('truffle-contract');
    const medipedia = contract(MedipediaContract);
    medipedia.setProvider(this.state.web3.currentProvider);
    this.state.web3.eth.getAccounts(async(error, accounts) => {
      const medipediaInstance = await medipedia.deployed();
      let deleteRes = await medipediaInstance.deleteAllMessages((this.state.public_address).toString(), {from: accounts[0], gas:470000 });
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

  handleClickDialogOpen = () => {
    this.setState({ openDialog: true });
  };

  handleCloseDialog = () => {
    this.setState({ openDialog: false });
  };

  handleClickDialogOpenReply = () => {
    this.setState({ openDialogReply: true });
  };

  handleCloseDialogReply = () => {
    this.setState({ openDialogReply: false });
  };

  handleChange = name => event => {
    console.log(event.target.value);
    this.setState({
      [name]: event.target.value,
    });
  };

  handleChangeCurrency = values => {
    console.log(values);
    this.setState({
      currency: values.value,
    });
  };

  handleChangeMedicalDept = (val) => {

    var obj = '', obj1 = '';
    var treatments = [];

    this.setState({ department: val.label }, function() {
      console.log(val);
      // this.forceUpdate();
    });

    // document.getElementById("medical-dept").value = e.target.value;

    for(var i = 0; i < serviceData.length; i++) {
      obj = serviceData[i];

      if (obj.name === val.label) {

        for(var j = 0; j < obj.services.length; j++) {

          obj1 = obj.services[j];
          console.log(obj1.id + " == " + obj1.name);
          treatments.push(
            <option dataValue={obj1.id}>{obj1.name}</option>
          );
        }
      }
    }
    // this.state.treatmentsArr = treatments;
    // this.setState({ treatmentsArr: treatments }, function() {
    //   console.log(treatments);
    // });
    // this.forceUpdate();

    console.log(treatments);

  };

  getDepartment = () => {
    return this.state.department;
  };

  submitRequest (e){
    e.preventDefault();

    var element = document.getElementById("loader-main");
    element.classList.remove("hide");

    this.setState({
      sendMessageRequest: true
    });
    // console.log(this.state.sendMessageRequest);
    // setTimeout(function(){ location.reload(); }, 3000);
  }

  whenRequestDone (e) {
    this.setState({
      openDialog: false,
      snackMsg: 'Message has been sent to all Required Medical Providers.',
      openSnack: true
    });
    var element = document.getElementById("loader-main");
    element.classList.add("hide");
    // setTimeout(function(){ location.reload(); }, 2000);
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

    var element = document.getElementById("loader-main");
    element.classList.remove("hide");

    for(var i = 0; i < this.state.consumerdata.length; i++) {
        if ( ( typeof this.state.consumerdata[i].replies !== 'undefined')
          && ((1947+i) == this.state.messageAddress)) {
          this.setState({request_hash: this.state.consumerdata[i].primary_request_hash});
          var obj = this.state.consumerdata[i].replies.message[this.state.consumerdata[i].replies.message.length-1];
          this.state.consumerdata[i].replies.message.push(
            {
              id: String(parseInt(obj.id)+1),
              to: this.state.consumerId,
              parent_msg_id: obj.id,
              sentDate: utc,
              msg_body: this.state.reply_text
            }
          );
          this.setState({
            messages: this.state.consumerdata[i].replies.message
          })
          break;
        } else if ((1947+i) == this.state.messageAddress) {
          // else {
            console.log(this.state.consumerdata[i]);
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
          console.log(this.state.consumerdata[i]);
          break;
        }
    }

    console.log(this.state.consumerdata[i].replies.message);

    this.setState({
      sendMessageReply: true
    });
    // console.log(this.state.sendMessageReply);\
  }

  handleChangeTreatment = values => {
    console.log(values);
    this.setState({
      treatment: values.value,
      category_id : values.value
    });
  };

  handleMedicalUrl = () => {
    // this.state.department = 'Opthalmology' ;
    // console.log(document.getElementById("tabs-block-1").contains("div"));
    // var element = document.getElementById("tabs-block-1");
    // element.classList.add("hide");


    var departments = [], treatments = [];
    var obj = '', obj1 = '';
    for(var i = 0; i < serviceData.length; i++) {
      obj = serviceData[i];
      departments.push(
        <option key={obj.id} dataValue={obj.id}>{obj.name}</option>
      );
      for(var j = 0; j < obj.services.length; j++) {
        obj1 = obj.services[j];
        treatments.push(
          <option key={obj1.id} dataValue={obj1.id}>{obj1.name}</option>
        );
      }
    }
    this.state.departmentsArr = departments;
    this.state.treatmentsArr = treatments;
    // this.setState({
    //                 departmentsArr: departments,
    //                 treatmentsArr: treatments
    //              });

    var urls = window.location.pathname.split("/");
    if (urls[1] === "medical-request" || urls[2] === "medical-request") {
      this.state.medicalform = (
          <div>
            <Paper elevation={4} id="medical-form-block" className="medical-form-block">
              <form className="medical-form" autoComplete="off">
                <Row>
                  <Col xs={12} md={12}>
                    <Typography variant="title" gutterBottom>
                      Medical Service Consultation Form
                    </Typography>
                  </Col>
                </Row>
                <Row>
                  <Col xs={12} md={6} className="select-wrapper">
                    <ReactMaterialSelect label="Medical Department" resetLabel="None" onChange={this.handleChangeMedicalDept}>
                        {serviceData.map(obj => {
                          return (
                            <option key={obj.id} dataValue={obj.id}>{obj.name}</option>
                          );
                        })}
                    </ReactMaterialSelect>
                  </Col>
                  <Col xs={12} md={6} className="select-wrapper">
                    <ReactMaterialSelect label="Treatment" resetLabel="None" onChange={this.handleChangeTreatment}>
                        {this.state.treatmentsArr}
                    </ReactMaterialSelect>
                  </Col>
                </Row>
                <Row>
                  <Col xs={12} md={6}>
                    <TextField
                      id=""
                      label="Desired From Date"
                      className="medicalform-text-field"
                      type="date"
                      onChange={this.handleChange('desired_from_date')}
                      defaultValue={utc}
                    />
                  </Col>
                  <Col xs={12} md={6}>
                    <TextField
                      id=""
                      label="Desired To Date"
                      className="medicalform-text-field"
                      type="date"
                      onChange={this.handleChange('desired_to_date')}
                      defaultValue={utc}
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
                      onChange={this.handleChange('estimated_budget')}
                    />
                  </Col>
                  <Col xs={12} md={6} className="select-wrapper">
                    <ReactMaterialSelect label="Select Currency" resetLabel="None" onChange={this.handleChangeCurrency}>
                        {currencies.map(option => {
                          return (
                            <option key={option.value} dataValue={option.value}>{option.label}</option>
                          );
                        })}
                    </ReactMaterialSelect>
                  </Col>
                </Row>
                <Row>
                  <Col xs={12} md={12}>
                    <TextField
                      id=""
                      label="Subject"
                      defaultValue=""
                      className="medicalform-text-field"
                      onChange={this.handleChange('subject')}
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
                      onChange={this.handleChange('message_body')}
                    />
                  </Col>
                </Row>
                <Row>
                  <Col xs={12} md={8}>
                    <Paper elevation={1} className="medical-form-block">
                      <Typography variant="body1">
                        Medical provider might request the access of the patient's personal and medical information for better medical service treatment consultation
                      </Typography>
                    </Paper>
                  </Col>
                  <Col xs={12} md={4}>
                    <Button variant="contained" color="primary" className="send-btn" onClick={this.handleClickDialogOpen.bind(this)}>
                      Send
                      <Icon className="send-btn-icon">send</Icon>
                    </Button>
                  </Col>
                </Row>
              </form>
            </Paper>
          </div>
      );
    }
  }



  handleChangeIndex = index => {
    this.setState({ value: index });
  };

  handleClickBack = (e) => {
    var element = document.getElementById("tabs-block-1");
    element.classList.remove("hide");
    this.setState({ message: [] });
  }

  handleClickMessage = (e, id) => {
      var obj = '', obj1 = '', obj2 = '', obj3 = '', obj4 = '';

      console.log(this.state.consumerdata);

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
          console.log(this.state.providerdata);

          if ((i+1947) == e.target.parentNode.id) {

            for(var j = 0; j < this.state.providerdata.length; j++) {
              obj1 = this.state.providerdata[j];

              if ( (obj1.public_address == obj.provider_address) ) {
                console.log(obj1);
                break;
              }
            }

            for(var k = 0; k < userData.length; k++) {
              obj2 = userData[k];
              if (obj.public_address === obj2.address) {
                console.log(obj2);
                break;
              }
            }

            for(var l = 0; l < serviceData.length; l++) {
              obj3 = serviceData[l];
              for(var m = 0; m < serviceData[l].services.length; m++) {
                obj4 = serviceData[l].services[m];

                if (obj.category_id === obj4.id) {
                  // console.log(obj.category_id + " == " + obj4.id);
                  break;
                }
              }
              if (obj.category_id === obj4.id) {
                break;
              }
            }

            break;
          }

        }

        console.log("consumerId" + obj2.id);

        if ( ( typeof obj.replies !== 'undefined') ) {
          this.setState({
            consumerAddress: cookie.load('consumerAddress'),
            providerAddress: id,
            consumerId: obj2.id,
            providerId: obj1.id
          });
        } else {
          this.setState({
            consumerAddress: cookie.load('consumerAddress'),
            providerAddress: id,
            consumerId: obj2.id,
            providerId: obj1.id
          });
        }


        // console.log(obj);

        var msgs = [];
        var flag = 0;
        var type = 'consumer';

        if( ( typeof obj.replies !== 'undefined') ) {
          // console.log(typeof obj.replies);
          var obj7 = '';
          console.log(obj.replies.message.length);
          for(j = 0; j < obj.replies.message.length; j++) {
            var obj6 = obj.replies.message[j];
            flag = 0;

            for(k = 0; k < userData.length; k++) {
              obj7 = userData[k];
              // console.log(obj6j7.id + " == " + obj6.to);
              if (obj7.id == obj6.to) {
                flag = 1;
                type = 'consumer';

                break;
              }
            }

            if (flag === 0) {
              for(l = 0; l < this.state.providerdata.length; l++) {
                obj7 = this.state.providerdata[l];
                // console.log(obj7.id + " == " + obj6.to);
                if (obj.replies.providerAddress == obj7.public_address) {
                  flag = 1;
                  type = 'clinic';
                  break;
                }
              }
            }

            console.log(type);
            console.log(obj6);

            console.log(flag + " -- " + type);

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

          msgs.push(
            <div key={2947}>
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
        }

        console.log(obj);

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
      console.log(e.target);
  };

  createInbox = () => {
    var consumers = [];
    if (this.state.consumerdata.length > 0 && this.state.consumerdata[0].public_address != undefined) {

      for(var i = 0; i < this.state.consumerdata.length; i++) {
          var obj = this.state.consumerdata[i];
          console.log(obj);

          var acceptRequest = '';

          if( ( typeof obj.replies !== 'undefined') ) {

            if(obj.replies.accessRequest == true) {
              for(var j = 0; j < this.state.providerdata.length; j++) {
                var obj1 = this.state.providerdata[j];

                if ( obj.replies.providerAddress == obj1.public_address ) {
                  console.log(obj.replies.providerAddress + " == " + obj1.public_address);
                  // consumers.push(createData(obj1.name, obj.subject, obj.sentDate));
                  consumers.push(
                    <TableRow key={(i+1947)} id={(i+1947)} hover onClick={event => this.handleClickMessage(event, obj1.public_address)} className="message-row">
                      <TableCell component="th" scope="row">
                        {obj1.name}
                      </TableCell>
                      <TableCell numeric>{obj.subject}</TableCell>
                      <TableCell numeric>
                        <Button variant="contained" color="primary" className="accept-btn" onClick={event => this.handleClickAcceptRequest(event, obj1.public_address)}>
                            Accept Request
                        </Button>
                        {obj.sentDate.slice(0,10)}
                      </TableCell>
                    </TableRow>
                  );
                  break;
                }
            }
            } else {
              for(var j = 0; j < this.state.providerdata.length; j++) {
                var obj1 = this.state.providerdata[j];

                if ( obj.replies.providerAddress == obj1.public_address ) {
                  console.log(obj.replies.providerAddress + " == " + obj1.public_address);
                  // consumers.push(createData(obj1.name, obj.subject, obj.sentDate));
                  consumers.push(
                    <TableRow key={(i+1947)} id={(i+1947)} hover onClick={event => this.handleClickMessage(event, obj1.public_address)} className="message-row">
                      <TableCell component="th" scope="row">
                        {obj1.name}
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
            }

            

          } else {

            consumers.push(
              <TableRow key={(i+1947)} id={(i+1947)} hover onClick={event => this.handleClickMessage(event, obj.public_address)} className="message-row">
                <TableCell component="th" scope="row">
                  Pending Reply
                </TableCell>
                <TableCell numeric>{obj.subject}</TableCell>
                <TableCell numeric>
                  {obj.sentDate.slice(0,10)}
                </TableCell>
              </TableRow>
            );

            // for(var j = 0; j < this.state.providerdata.length; j++) {
            //     var obj1 = this.state.providerdata[j];

            //     if ( obj.provider_address == obj1.public_address ) {
            //       console.log(obj.provider_address + " == " + obj1.public_address);
            //       // consumers.push(createData(obj1.name, obj.subject, obj.sentDate));
            //       consumers.push(
            //         <TableRow key={(i+1947)} id={(i+1947)} hover onClick={event => this.handleClickMessage(event, obj1.public_address)} className="message-row">
            //           <TableCell component="th" scope="row">
            //             {obj1.name}
            //           </TableCell>
            //           <TableCell numeric>{obj.subject}</TableCell>
            //           <TableCell numeric>
            //             {obj.sentDate.slice(0,10)}
            //           </TableCell>
            //         </TableRow>
            //       );
            //       break;
            //     }
            // }

          }
      }

    } else {
      consumers.push(
        <Typography variant="title" gutterBottom className="no-msgs-text">
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
  }



  render() {

      // const { value } = this.state;

      var valTab = 0;

      var urls = window.location.pathname.split("/");

      return (
          <div>
              <Header/>
              <Container fluid style={{ lineHeight: '32px' }}>
                <Subheader/>
                <Row >
                  <Col xs={6} md={2}>
                      <Sidebar/>
                  </Col>
                  <Col xs={6} md={10} className="msgs-tabs-col">
                      {/*<p>Request Hash: {this.state.request_hash}</p>
                      <p>Consumer Address: {this.state.consumerAddress}</p>
                      <p>Provider Address: {this.state.providerAddress}</p>
                      <p>Consumer ID: {this.state.consumerId}</p>
                      <p>Provider ID: {this.state.providerId}</p>*/}
                      {this.state.sendMessageRequest ?
                        <MessageRequestHandler
                            patient_id={this.state.patient_id}
                            gender={this.state.gender}
                            public_address={this.state.public_address}
                            age_group={this.state.age_group}
                            subject={this.state.subject}
                            desired_from_date={this.state.desired_from_date}
                            desired_to_date={this.state.desired_to_date}
                            estimated_budget={this.state.estimated_budget}
                            currency={this.state.currency}
                            sentDate={this.state.sentDate}
                            message_body={this.state.message_body}
                            category_id={this.state.category_id}
                            web3={this.state.web3}
                            action={this.whenRequestDone}
                        />
                        : null}
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
                      {valTab === 0 && (urls[1] === "inbox" || urls[2] === "inbox") &&
                          <TabContainer>
                            <Paper elevation={4} id="tabs-block-1" className="tabs-block">
                                <Tabs
                                  value={valTab}
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

                            <Button onClick={this.handleDeleteAll} variant="contained" color="primary" className="delete-all-btn">
                              Delete All
                            </Button>

                          </TabContainer>
                      }
                      {valTab === 1 &&
                          <TabContainer>
                              <Paper elevation={2} id="tabs-block-2" className="tabs-block">
                                  <Tabs
                                    value={valTab}
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
                                  <Button onClick={this.handleDeleteAll} variant="contained" color="primary" className="delete-all-btn">
                                    Delete All
                                  </Button>
                              </Paper>
                          </TabContainer>
                      }

                      {this.state.medicalform}

                  </Col>
                </Row>
              </Container>
              <Dialog
                open={this.state.openDialog}
                onClose={this.handleCloseDialog}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
              >
                <DialogTitle id="alert-dialog-title">
                  <Typography variant="title" align="center" gutterBottom>
                    Confirm Medical Request
                  </Typography>
                </DialogTitle>
                <DialogContent>
                  <DialogContentText id="alert-dialog-description">
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
                  <Button onClick={this.handleCloseDialog} color="primary">
                    Cancel
                  </Button>
                  <Button onClick={this.submitRequest.bind(this)} variant="contained" color="primary" autoFocus>
                    Continue
                  </Button>
                </DialogActions>
              </Dialog>
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
                    <img src="http://localhost:3000/images/metamask.png" alt="metamask dialog image" className="metamask-img" />
                    <Typography variant="body1" align="center" gutterBottom className="dialog-body-text">
                      When you click "Continue" we will pop up a Metamask dialog.
                    </Typography>
                    <Typography variant="body1" align="center" gutterBottom className="dialog-body-text">
                      The dialog will ask you to confirm your vote transaction, including the small ETH cost.
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
