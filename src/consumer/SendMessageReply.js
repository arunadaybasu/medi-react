import React, { Component } from 'react'
import getWeb3 from '../utils/getWeb3'
import MessageReplyHandler from '../service/MessageReplyHandler';

export default class SendMessageReply extends Component {
    constructor(props) {
        super(props)
    
        this.state = {
            request_hash: "zb2rhgkL51t8ZY5JnUp28pHE7TAFgZTyCgEdwFW3W8RCGoLvU",
            consumerAddress: "0xD8f647855876549d2623f52126CE40D053a2ef6A",
            providerAddress: "0x9aA7E9819D781eFf5B239b572c4Fe8F964a899c9",
            accessRequest: false,
            message: [
                {
                    id: "1",
                    to: "0005",
                    parent_msg_id: "0",
                    sentDate: "30-05-2018",
                    msg_body: "this is reply to Medical Request - to ropsten 00xxxxmmmm"
                },
                {
                    id: "2",
                    to: "0005",
                    parent_msg_id: "1",
                    sentDate: "30-05-2018",
                    msg_body: "this is reply to Medical Request Ropsten- 00xxxxmmmm"
                }
            ],
            sendMessageReply: false,
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
            sendMessageReply: true
        })
    }

    render() {
        return (
        <div>
            <button onClick={this.submitRequest.bind(this)}> Reply</button><br/>
            
            {this.state.sendMessageReply ? 
            <MessageReplyHandler 
                request_hash={this.state.request_hash}
                consumerAddress={this.state.consumerAddress}
                providerAddress={this.state.providerAddress}
                message={this.state.message}
                accessRequest={this.state.accessRequest}
                web3={this.state.web3}
            /> 
            : null}
        </div>
        )
  }
}
