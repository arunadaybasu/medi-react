import React, { Component } from 'react'
import getWeb3 from '../utils/getWeb3'
import MessageRequestHandler from '../service/MessageRequestHandler';

export default class SendMessageRequest extends Component {
    constructor(props) {
        super(props)
    
        this.state = {
            patient_id: '0005',
            public_address: '0x5AEDA56215b167893e80B4fE645BA6d5Bab767DE',
            gender: 'female',
            age_group: '25-30',
            subject: "Plastic Surgery - 06",
            desired_from_date: "05-06-2018",
            desired_to_date: "05-06-2018",
            estimated_budget: "100000",
            currency: "USD",
            sentDate: "05-06-2018",
            message_body: "Plastic Surgery Rhinoplasty consultation Request - Sent to ropsten network",
            category_id : "2200",
            sendMessageRequest: false,
            web3: null
        }
    }

    componentWillMount() {
        
      // Get network provider and web3 instance.
      // See utils/getWeb3 for more info.
      getWeb3
      .then(results => {
          this.setState({
          web3: results.web3
          })
          
      })
      .catch(() => {
          console.log('Error finding web3.')
      })
    }

    submitRequest (e){
       e.preventDefault();

        this.setState({
            sendMessageRequest: true
        })
        console.log(this.state.sendMessageRequest)
    }

    render() {
        return (
        <div>
            <button onClick={this.submitRequest.bind(this)}> Send</button><br/>
            
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
            /> 
            : null}
        </div>
        )
  }
}
