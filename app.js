/**
 * Created by vishi on 11/7/15.
 */
var express = require('express');
var cardMapping = require('./controllers/card-mapping');
var Promise = require('bluebird');
var url = require('url');

var app = express();

app.get('/', function (req, res) {
    //var createData = cardMapping.createMapping();
    //var url_parts = url.parse(req.url, true),
      var senderId = req.query.senderId,
          receiverId = req.query.receiverId,
          fundingAmount = req.query.fAmt,
          receiverICA = null,
          receiverAccountNo = null,
          sendICA = null,
          sendAccountNo = null,
          SenderName = null,
          SenderAddress= null;

    var senderMapping = cardMapping.inquireMapping(senderId);
    senderMapping.then(function(result){

        var mappings = result.InquireMapping.Mappings,
            mapping = mappings.Mapping;
        for(var map in mapping){
            console.log('map  ' +map);
            if(map.AccountUsage == 'SENDING') {
                sendICA = map.ICA;
                sendAccountNo = map.AccountNumber;
            }
        }

        var a = {
            "InquireMapping": {
            "RequestId": "1244656",
                "Mappings": {
                "Mapping": [
                    {
                        "MappingId": "6374",
                        "SubscriberId": "903122132865",
                        "AccountUsage": "RECEIVING",
                        "DefaultIndicator": "T",
                        "Alias": "My Debit Card1",
                        "ICA": "9674",
                        "AccountNumber": "5184680420000073",
                        "CardholderFullName": {
                            "CardholderFirstName": "misc2",
                            "CardholderMiddleName": "K",
                            "CardholderLastName": "person2"
                        },
                        "Address": {
                            "Line1": "2266 Locust Street",
                            "City": "Somewhere",
                            "CountrySubdivision": "MO",
                            "PostalCode": "32654",
                            "Country": "USA"
                        },
                        "ReceivingEligibility": {
                            "Eligible": "true",
                            "Currency": {
                                "AlphaCurrencyCode": "USD",
                                "NumericCurrencyCode": "840"
                            },
                            "Country": {
                                "AlphaCountryCode": "USA",
                                "NumericCountryCode": "840"
                            },
                            "Brand": {
                                "AcceptanceBrandCode": "MCC",
                                "ProductBrandCode": "MCC"
                            }
                        },
                        "ExpiryDate": "201601"
                    },
                    {
                        "MappingId": "6374",
                        "SubscriberId": "903122132865",
                        "AccountUsage": "SENDING",
                        "DefaultIndicator": "T",
                        "Alias": "My Debit Card1",
                        "ICA": "9674",
                        "AccountNumber": "5184680420000073",
                        "CardholderFullName": {
                            "CardholderFirstName": "misc2",
                            "CardholderMiddleName": "K",
                            "CardholderLastName": "person2"
                        },
                        "Address": {
                            "Line1": "2266 Locust Street",
                            "City": "Somewhere",
                            "CountrySubdivision": "MO",
                            "PostalCode": "32654",
                            "Country": "USA"
                        },
                        "ExpiryDate": "201601"
                    }
                ]
            }
        }
        }

    }).error(function(reason){
        console.log('Error in inquire!');
    });

    var receiverMapping = cardMapping.inquireMapping(receiverId);
    receiverMapping.then(function(result){

        var mappings = result.InquireMapping.Mappings,
            mapping = mappings.Mapping;
        for(var map in mapping){
            console.log('map  ' +map);
            if(map.AccountUsage == 'RECEIVING') {
                receiverICA = map.ICA;
                receiverAccountNo = map.AccountNumber;
            }
        }

        var a = {
            "InquireMapping": {
                "RequestId": "1244656",
                "Mappings": {
                    "Mapping": [
                        {
                            "MappingId": "6374",
                            "SubscriberId": "903122132865",
                            "AccountUsage": "RECEIVING",
                            "DefaultIndicator": "T",
                            "Alias": "My Debit Card1",
                            "ICA": "9674",
                            "AccountNumber": "5184680420000073",
                            "CardholderFullName": {
                                "CardholderFirstName": "misc2",
                                "CardholderMiddleName": "K",
                                "CardholderLastName": "person2"
                            },
                            "Address": {
                                "Line1": "2266 Locust Street",
                                "City": "Somewhere",
                                "CountrySubdivision": "MO",
                                "PostalCode": "32654",
                                "Country": "USA"
                            },
                            "ReceivingEligibility": {
                                "Eligible": "true",
                                "Currency": {
                                    "AlphaCurrencyCode": "USD",
                                    "NumericCurrencyCode": "840"
                                },
                                "Country": {
                                    "AlphaCountryCode": "USA",
                                    "NumericCountryCode": "840"
                                },
                                "Brand": {
                                    "AcceptanceBrandCode": "MCC",
                                    "ProductBrandCode": "MCC"
                                }
                            },
                            "ExpiryDate": "201601"
                        },
                        {
                            "MappingId": "6374",
                            "SubscriberId": "903122132865",
                            "AccountUsage": "SENDING",
                            "DefaultIndicator": "T",
                            "Alias": "My Debit Card1",
                            "ICA": "9674",
                            "AccountNumber": "5184680420000073",
                            "CardholderFullName": {
                                "CardholderFirstName": "misc2",
                                "CardholderMiddleName": "K",
                                "CardholderLastName": "person2"
                            },
                            "Address": {
                                "Line1": "2266 Locust Street",
                                "City": "Somewhere",
                                "CountrySubdivision": "MO",
                                "PostalCode": "32654",
                                "Country": "USA"
                            },
                            "ExpiryDate": "201601"
                        }
                    ]
                }
            }
        }


    }).error(function(reason){
        console.log('Error in inquire!');
    });

    Promise.settle([senderMapping, receiverMapping]).then(function(results) {
        for (var j = 0; j < results.length; j++) {
            var result = results[j], isSender = false;
            if (j == 0)
                isSender = true;
            if (result.isFulfilled()) {
                var val = result.value();

                //console.log(val.InquireMapping);
                var mappings = val.InquireMapping.Mappings,
                    mapping1 = mappings[0].Mapping;
                //console.log(mapping1);
                //console.log(mapping1);
                for (var i = 0; i < mapping1.length; i++) {
                    var map = mapping1[i];
                    console.log('ICA : ' +map.ICA);
                    if (isSender && map.AccountUsage == 'SENDING') {
                        sendICA = map.ICA;
                        sendAccountNo = map.AccountNumber;
                    } else if (!isSender && map.AccountUsage == 'RECEIVING') {
                        receiverICA = map.ICA;
                        receiverAccountNo = map.AccountNumber;
                    }
                }

                //console.log('mapId : ' + map.ICA + '  acc no: ' +map.AccountNumber);
                //console.log(map);
            }else{
                console.log('result failed!!!!!');
                //failed reason
            }

        }



        console.log('HOla!!!  senderICA: ' +sendICA + '   receiver ICA:' +receiverICA);
        console.log('HOla!!!  sendAccountNo: ' +sendAccountNo + '   rreceiverAccountNo:' +receiverAccountNo);
    });


    //var testCall = cardMapping.testCall();
//    var checkPanEligibility = cardMapping.checkPanEligibility();
//    checkPanEligibility.then(function(result){
//        for(var r in result)
//            console.log(result[r]);
//
//        //var canSend = result.SendingEligibility.Eligible;
//        //var canReceive = result.ReceivingEligibility.Eligible;
//
////        var a = {
////            "PanEligibility": {
////            "RequestId": "123456",
////                "SendingEligibility": {
////                "Eligible": "true",
////                    "AccountNumber": "5555555555559999",
////                    "ICA": "001234",
////                    "Currency": {
////                    "AlphaCurrencyCode": "USD",
////                        "NumericCurrencyCode": "840"
////                },
////                "Country": {
////                    "AlphaCountryCode": "USA",
////                        "NumericCountryCode": "840"
////                },
////                "Brand": {
////                    "AcceptanceBrandCode": "MCC",
////                        "ProductBrandCode": "MCS"
////                }
////            },
////            "ReceivingEligibility": {
////                "Eligible": "false",
////                    "ReasonCode": "120017",
////                    "AccountNumber": "5555555555559998"
////            }
////        }
////        }
//    }).error(function(reason){
//        console.log('Error ' +reason);
//    });

    var transferF = cardMapping.transferFunds(fundingAmount);
    var transactionReference = null;
    transferF.then(function(response){
        console.log('Transfer response   '+response);
        transactionReference = response.TransactionReference;
        for(var c in response){
            console.log(response[c]);
        }
        //data.transactionReference = response.TransactionReference;
        var data = { transactionReference : response.TransactionReference};
        res.send(JSON.stringify(response));
    });





});

app.get('/inquire', function(req, res){
    var senderId = req.query.senderId;
    var senderMapping = cardMapping.inquireMapping(senderId);
    senderMapping.then(function(result){

        var mappings = result.InquireMapping.Mappings,
            mapping = mappings.Mapping;
        for(var map in mapping){
            console.log('map  ' +map);
            if(map.AccountUsage == 'SENDING') {
                sendICA = map.ICA;
                sendAccountNo = map.AccountNumber;
            }
        }

        var a = {
            "InquireMapping": {
                "RequestId": "1244656",
                "Mappings": {
                    "Mapping": [
                        {
                            "MappingId": "6374",
                            "SubscriberId": "903122132865",
                            "AccountUsage": "RECEIVING",
                            "DefaultIndicator": "T",
                            "Alias": "My Debit Card1",
                            "ICA": "9674",
                            "AccountNumber": "5184680420000073",
                            "CardholderFullName": {
                                "CardholderFirstName": "misc2",
                                "CardholderMiddleName": "K",
                                "CardholderLastName": "person2"
                            },
                            "Address": {
                                "Line1": "2266 Locust Street",
                                "City": "Somewhere",
                                "CountrySubdivision": "MO",
                                "PostalCode": "32654",
                                "Country": "USA"
                            },
                            "ReceivingEligibility": {
                                "Eligible": "true",
                                "Currency": {
                                    "AlphaCurrencyCode": "USD",
                                    "NumericCurrencyCode": "840"
                                },
                                "Country": {
                                    "AlphaCountryCode": "USA",
                                    "NumericCountryCode": "840"
                                },
                                "Brand": {
                                    "AcceptanceBrandCode": "MCC",
                                    "ProductBrandCode": "MCC"
                                }
                            },
                            "ExpiryDate": "201601"
                        },
                        {
                            "MappingId": "6374",
                            "SubscriberId": "903122132865",
                            "AccountUsage": "SENDING",
                            "DefaultIndicator": "T",
                            "Alias": "My Debit Card1",
                            "ICA": "9674",
                            "AccountNumber": "5184680420000073",
                            "CardholderFullName": {
                                "CardholderFirstName": "misc2",
                                "CardholderMiddleName": "K",
                                "CardholderLastName": "person2"
                            },
                            "Address": {
                                "Line1": "2266 Locust Street",
                                "City": "Somewhere",
                                "CountrySubdivision": "MO",
                                "PostalCode": "32654",
                                "Country": "USA"
                            },
                            "ExpiryDate": "201601"
                        }
                    ]
                }
            }
        }

    }).error(function(reason){
        console.log('Error in inquire!');
    });

});

app.get('/transfer', function(req, res){
    var fundingAmount = req.query.fAmt;
    var transferF = cardMapping.transferFunds(fundingAmount);
    var transactionReference = null;
    transferF.then(function(response){
        console.log('Transfer response   '+response);
        transactionReference = response.TransactionReference;
        for(var c in response){
            console.log(response[c]);
        }
        //data.transactionReference = response.TransactionReference;
        var data = { transactionReference : response.TransactionReference};
        res.send(JSON.stringify(response));
    });

});
var server = app.listen(8989, function () {

    var host = server.address().address;
    var port = server.address().port;

    console.log('Example app listening at http://%s:%s', host, port);
});