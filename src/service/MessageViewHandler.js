import React, { Component } from 'react'

//import getWeb3 from '../utils/getWeb3'
import ipfs from '../utils/ipfs'
import MedipediaContract from '../../build/contracts/Medipedia.json'

export default class MessageViewHandler extends Component {
    constructor(props) {
        super(props)
        this.state = {
            messageList: null,
            userAddress: props.userAddress,
            web3: props.web3
        }
    }

    async componentDidMount() {
        // const contract = require('truffle-contract');
        // const medipedia = contract(MedipediaContract);
        // medipedia.setProvider(this.state.web3.currentProvider);

        // this.state.web3.eth.getAccounts(async(error, accounts) => {

        //     const medipediaInstance = await medipedia.deployed();
            
        //     //get number of medical requests
        //     const noOfRequests = await medipediaInstance.getNoOfMsgs((this.state.userAddress).toString());
        //     console.log('noOfRequests ' + noOfRequests)
        //     let index;
        //     var messages = new Array(noOfRequests);
        //     for (index = 0; index < noOfRequests; index++) { 
        //         let message = await medipediaInstance.getMessageCommunicationHash(this.state.userAddress, index+1);
        //         let messageRequest = await medipediaInstance.getMessageRequestHash(this.state.userAddress, index+1);
        //         let ipfsMsgRequestOutput = await ipfs.cat(messageRequest);
                
        //         var output = JSON.parse(ipfsMsgRequestOutput);
                
        //         let ipfsMsgOutput;
        //         if(message.length > 0){
        //             ipfsMsgOutput = await ipfs.cat(message);
        //             output['replies'] = JSON.parse(ipfsMsgOutput)
        //         }
        //         messages[index] = output;
        //         console.log('output '+ output)
        //     }
            
        // });

        this.setState({messageList: 
            [  
           {  
              "patient_id":"0005",
              "public_address":"0x821aEa9a577a9b44299B9c15c88cf3087F3b5544",
              "gender":"female",
              "age_group":"25-30",
              "subject":"Enquiry about Opthalmology",
              "desired_from_date":"01-June-2018",
              "desired_to_date":"10-June-2018",
              "estimated_budget":"100000",
              "currency":"KWR",
              "sentDate":"31-05-2018",
              "message_body":"Plastic Surgery Rhinoplasty consultation request - need to check many things",
              "category_id":"2200",
              "replies":{  
                 "request_hash":"zb2rheaPbXRuw3wMzRPJbekKaN6YvBKoG59ZKiFcLXzFtMk1s",
                 "consumerAddress":"0x821aEa9a577a9b44299B9c15c88cf3087F3b5544",
                 "providerAddress":"0xf17f52151EbEF6C7334FAD080c5704D77216b732",
        "accessRequest":false,
                 "message":[  
                    {  
                       "id":"1",
                       "to":"0005",
                       "parent_msg_id":"0",
                       "date":"30-05-2018",
                       "msg_body":"this is reply to Medical Request - 00xxxxmmmm"
                    },
                    {  
                       "id":"2",
                       "to":"00000002",
                       "parent_msg_id":"1",
                       "date":"30-05-2018",
                       "msg_body":"this is Reply to message id 1 - yyyyyy"
                    }
                 ]
              }
           },
           {  
              "patient_id":"0005",
              "public_address":"0x821aEa9a577a9b44299B9c15c88cf3087F3b5544",
              "gender":"female",
              "age_group":"25-30",
              "subject":"Plastic Surgery - 03",
              "desired_from_date":"01-June-2018",
              "desired_to_date":"10-June-2018",
              "estimated_budget":"100000",
              "currency":"KWR",
              "sentDate":"31-05-2018",
              "message_body":"Plastic Surgery Rhinoplasty consultation request - need to check many things",
              "category_id":"2200",
              "replies":{  
                 "request_hash":"zb2rheaPbXRuw3wMzRPJbekKaN6YvBKoG59ZKiFcLXzFtMk1s",
                 "consumerAddress":"0x821aEa9a577a9b44299B9c15c88cf3087F3b5544",
                 "providerAddress":"0xf17f52151EbEF6C7334FAD080c5704D77216b732",
             "accessRequest":true,
                 "message":[  
                    {  
                       "id":"1",
                       "to":"0005",
                       "parent_msg_id":"0",
                       "date":"30-05-2018",
                       "msg_body":"this is reply to Medical Request - 00xxxxmmmm"
                    },
                    {  
                       "id":"2",
                       "to":"00000002",
                       "parent_msg_id":"1",
                       "date":"30-05-2018",
                       "msg_body":"this is Reply to message id 1 - yyyyyy"
                    }
                 ]
              }
           },
        {  
              "patient_id":"0005",
              "public_address":"0x821aEa9a577a9b44299B9c15c88cf3087F3b5544",
              "gender":"female",
              "age_group":"25-30",
              "subject":"Plastic Surgery - 03",
              "desired_from_date":"01-June-2018",
              "desired_to_date":"10-June-2018",
              "estimated_budget":"100000",
              "currency":"KWR",
              "sentDate":"31-05-2018",
              "message_body":"Plastic Surgery Rhinoplasty consultation request - need to check many things",
              "category_id":"2200"
           }
        ]
    });

        
    }
    render() {
        return (
        <div>
            Message List 
            <br/>
            {this.state.messageList}
        </div>
        )
    }
}
