const consumerData = [  
   {  
      "patient_id":"0001",
      "public_address":"0x5AEDA56215b167893e80B4fE645BA6d5Bab767DE",
      "gender":"female",
      "age_group":"25-30",
      "subject":"Enquiry about Opthalmology",
      "desired_from_date":"01-June-2018",
      "desired_to_date":"10-June-2018",
      "estimated_budget":"100000",
      "currency":"KWR",
      "sentDate":"29-05-2018",
      "message_body":"Eyes consultation request - need to check many things",
      "category_id": 1100,
      "replies":{  
         "request_hash":"zb2rheaPbXRuw3wMzRPJbekKaN6YvBKoG59ZKiFcLXzFtMk1s",
         "consumerAddress":"0x821aEa9a577a9b44299B9c15c88cf3087F3b5544",
         "providerAddress":"0xf17f52151EbEF6C7334FAD080c5704D77216b732",
  		 "accessRequest":true,
         "message":[  
            {  
               "id":"1",
               "to":"0001",
               "parent_msg_id":"0",
               "date":"30-05-2018",
               "msg_body":"this is reply to Medical Request - 00xxxxmmmm"
            },
            {  
               "id":"2",
               "to":"00000003",
               "parent_msg_id":"1",
               "date":"31-05-2018",
               "msg_body":"this is Reply to message id 1 - yyyyyy"
            }
         ]
      }
   },
   {  
      "patient_id":"0002",
      "public_address":"0x821aEa9a577a9b44299A9c15c88cf3087F3b5544",
      "gender":"female",
      "age_group":"25-30",
      "subject":"Plastic Surgery - 03",
      "desired_from_date":"01-June-2018",
      "desired_to_date":"10-June-2018",
      "estimated_budget":"100000",
      "currency":"KWR",
      "sentDate":"30-05-2018",
      "message_body":"Plastic Surgery Rhinoplasty consultation request - need to check many things",
      "category_id": 2100,
      "replies":{  
         "request_hash":"zb2rheaPbXRuw3wMzRPJbekKaN6YvBKoG59ZKiFcLXzFtMk1s",
         "consumerAddress":"0x6330A553Fc93768F612722BB8c2eC78aC90B3bbc",
         "providerAddress":"0xC5fdf4076b8F3A5357c5E395ab970B5B54098Fef",
         "accessRequest":true,
         "message":[  
            {  
               "id":"1",
               "to":"0002",
               "parent_msg_id":"0",
               "date":"30-05-2018",
               "msg_body":"this is reply to Medical Request - 00xxxxmmmm"
            },
            {  
               "id":"2",
               "to":"00000001",
               "parent_msg_id":"1",
               "date":"31-05-2018",
               "msg_body":"this is Reply to message id 1 - yyyyyy"
            }
         ]
      }
   },
{  
      "patient_id":"0001",
      "public_address":"0x821aEa9a577a9b45299B9c15c88cf3087F3b5544",
      "gender":"female",
      "age_group":"25-30",
      "subject":"Plastic Surgery - 03",
      "desired_from_date":"01-June-2018",
      "desired_to_date":"10-June-2018",
      "estimated_budget":"100000",
      "currency":"KWR",
      "sentDate":"31-05-2018",
      "message_body":"Plastic Surgery Rhinoplasty consultation request - need to check many things",
      "category_id": 2200
   }
];

export default consumerData