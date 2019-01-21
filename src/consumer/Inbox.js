import React, { Component } from 'react'
import MessageViewHandler from '../service/MessageViewHandler'

import getWeb3 from '../utils/getWeb3'

export default class Inbox extends Component {

    constructor(props) {
        super(props)
    
        this.state = {
            userAddress: "0xf17f52151EbEF6C7334FAD080c5704D77216b732",
            web3: null,
            isWeb3InstanceLoaded: false
        }
    }

    componentWillMount() {
        // Get network provider and web3 instance.
        // See utils/getWeb3 for more info.
        getWeb3
        .then(results => {
            this.setState({
                web3: results.web3,
                isWeb3InstanceLoaded: true
            })
            
        })
        .catch(() => {
            console.log('Error finding web3.')
        })

    }
    render() {
        return (
        <div>
            {
                this.state.isWeb3InstanceLoaded ?
                <MessageViewHandler 
                userAddress={this.state.userAddress} 
                web3={this.state.web3} />
                :null
            }
            
        </div>
        )
    }
}
