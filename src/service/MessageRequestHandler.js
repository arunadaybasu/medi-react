import React, { Component } from 'react'
import medicalProviders from '../model/MedicalProviders'
import getWeb3 from '../utils/getWeb3'
import ipfs from '../utils/ipfs'
import MedipediaContract from '../../build/contracts/Medipedia.json'

export default class MessageRequestHandler extends Component {
  constructor(props) {
    super(props)
    this.state = {
      patient_id: props.patient_id,
      public_address: props.public_address,
      gender: props.gender,
      age_group: props.age_group,
      subject: props.subject,
      desired_from_date: props.desired_from_date,
      desired_to_date: props.desired_to_date,
      estimated_budget: props.estimated_budget,
      currency: props.currency,
      sentDate: props.sentDate,
      message_body: props.message_body,
      category_id : props.category_id,
      result: '',
      messageRequestIpfsHash:'',
      sentStatus: false,
      web3: null
    }
  }

  async componentDidMount() {
    getWeb3
      .then(results => {
          this.setState({
          web3: results.web3
          })
          this.addToBlockchain();
      })
      .catch(() => {
          console.log('Error finding web3.')
      })
    const messageRequest = await this.getMessageRequestInJSON();
    // console.log("Message request:" + messageRequest);
  }
  async addToBlockchain(){
    
    const contract = require('truffle-contract');
    const medipedia = contract(MedipediaContract);
    medipedia.setProvider(this.state.web3.currentProvider);
    console.log(medicalProviders);
    const providers = medicalProviders.filter(p => 
      (p.services.find(service => service.id.toString().includes(this.state.category_id, 0))));
      
      let provider_accs = [];
      providers.forEach(async (provider) => {
        console.log("Provider address at Message Request: " + provider.public_address);
        await provider_accs.push(provider.public_address);
      });

     

     this.state.web3.eth.getAccounts(async(error, accounts) => {

        const medipediaInstance = await medipedia.deployed();
        

        const messageRequest = await this.getMessageRequestInJSON();
            
        const messageRequestIpfsHash = await ipfs.add(messageRequest)
        
        let ipfsOutput = await ipfs.cat(messageRequestIpfsHash);
        console.log('ipfsOutput = ' + ipfsOutput)

        let transactionHash = await medipediaInstance.addMessageRequest((this.state.public_address).toString(),provider_accs,messageRequestIpfsHash, {from: accounts[0], gas:4612388 ,gasPrice: this.state.web3.toWei(6, 'gwei')})
        console.log('transactionHash:::' + JSON.stringify(transactionHash))
        let result = await medipediaInstance.getMessageRequestHash(this.state.public_address,1);
        
        console.log('result for provider_accs[0] '+ provider_accs[0] +': ' + result);

      this.props.action();
      
     });
     
  }
  async getMessageRequestInJSON(){
    const messageRequest = JSON.stringify({
      patient_id: this.state.patient_id,
      public_address: this.state.public_address,
      gender: this.state.gender,
      age_group: this.state.age_group,
      subject: this.state.subject,
      desired_from_date: this.state.desired_from_date,
      desired_to_date: this.state.desired_to_date,
      estimated_budget: this.state.estimated_budget,
      currency: this.state.currency,
      sentDate: this.state.sentDate,
      message_body: this.state.message_body,
      category_id : this.state.category_id
    });
    return messageRequest;
  }
  render() {
    
    return (
      <div>
        {'Message request is sent to all Required Medical Providers'}
        {/*<br/>
        <h4>Information sent to all matching medical providers:</h4>
        <p>Patient ID: {this.state.patient_id}</p>
        <p>Patient Public Address: {this.state.public_address}</p>
        <p>Patient Gender: {this.state.gender}</p>
        <p>Patient Age Group: {this.state.age_group}</p>
        <p>Desired From Date: {this.state.desired_from_date}</p>
        <p>Desired To Date: {this.state.desired_to_date}</p>
        <p>Estmated Budget: {this.state.estimated_budget}</p>
        <p>Currency: {this.state.currency}</p>
        <p>Sent Date: {this.state.sentDate}</p>
        <p>Subject: {this.state.subject}</p>
        <p>Message: {this.state.message_body}</p>
        <p>Category: {this.state.category_id}</p>*/}
      </div>
    )
  }
}
