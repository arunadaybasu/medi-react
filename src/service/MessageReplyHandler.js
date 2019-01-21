import React, { Component } from 'react'
import ipfs from '../utils/ipfs'
import MedipediaContract from '../../build/contracts/Medipedia.json'

/**
 * Message reply should come in the below format
 
 "request_hash": "zb2rheaPbXRuw3wMzRPJbekKaN6YvBKoG59ZKiFcLXzFtMk1s",
  "consumerAddress": "0x821aEa9a577a9b44299B9c15c88cf3087F3b5544",
  "providerAddress": "0xf17f52151EbEF6C7334FAD080c5704D77216b732",
  "message": [
    {
      "id": "1",
      "to": "0005",
      "parent_msg_id": "0",
      "sentDate": "30-05-2018",
      "msg_body": "this is reply to Medical Request - 00xxxxmmmm"
    }
  ]
 */

export default class MessageReplyHandler extends Component {
  constructor(props) {
    super(props)
    this.state = {
      request_hash: props.request_hash,
      consumerAddress: props.consumerAddress,
      providerAddress: props.providerAddress,
      accessRequest: props.accessRequest,
      message: props.message,
      result: '',
      messageReplyIpfsHash:'',
      sentStatus: false,
      web3: props.web3
    }
  }

  async componentDidMount() {

    const messageReply = JSON.stringify({
      request_hash: this.state.request_hash,
      consumerAddress: this.state.public_address,
      providerAddress: this.state.providerAddress,
      accessRequest:this.state.accessRequest,
      message: this.state.message,
    });

    console.log('messageReply : ' +messageReply);
    
    const messageReplyIpfsHash = await ipfs.add(messageReply)
    console.log('messageReplyIpfsHash : ' +messageReplyIpfsHash);
    let status = this.state.sentStatus
    

    const contract = require('truffle-contract');
    const medipedia = contract(MedipediaContract);
    medipedia.setProvider(this.state.web3.currentProvider);

    this.state.web3.eth.getAccounts(async(error, accounts) => {
      
      const medipediaInstance = await medipedia.deployed();
      console.log('this.state.consumerAddress ;;;; ' + this.state.consumerAddress)
      
      let blockchainResponse = await medipediaInstance.addReplies((this.state.consumerAddress).toString(),[this.state.providerAddress],
       this.state.request_hash,messageReplyIpfsHash, {from: accounts[0], gas:4612388 ,gasPrice: this.state.web3.toWei(6, 'gwei') })

      console.log(JSON.stringify(blockchainResponse))

      let result = await medipediaInstance.getMessageCommunicationHash((this.state.providerAddress).toString(),1);
      console.log('provider result hash : '+result)
      if(result.toString().length>0){
        let resultIpfsOutput = await ipfs.cat(result);
        console.log('result for providerAddress '+ this.state.providerAddress +': ' + result);
        console.log('resultIpfsOutput : '+resultIpfsOutput)
      }
      

      let resultpatient = await medipediaInstance.getMessageCommunicationHash((this.state.consumerAddress).toString(),1);
      if(result.toString().length>0){
        console.log('patient result hash : '+resultpatient)
        let resultpatientIpfsOutput = await ipfs.cat(resultpatient);
        console.log('result for consumerAddress '+ this.state.consumerAddress +': ' + resultpatient);
        console.log('resultpatientIpfsOutput : '+resultpatientIpfsOutput);
        this.props.action();
      }
      
    });

    this.setState({
      result: '',
      sentStatus: !status
    });
    
  }
  render() {
    
    return (
      <div>
        <br />
        {'Reply is sent to receiver.'}
      </div>
    )
  }
}
