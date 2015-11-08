/**
 * Created by vishi on 11/7/15.
 */
var Promise = require('bluebird');
var cardMappingServiceClass = require('mastercard-api/services/moneysend/CardMappingService');
var locationService = require('mastercard-api/services/locations/atms/CountryAtmLocationService');
var panEligibility = Promise.promisifyAll(require('mastercard-api/services/moneysend/PanEligibilityService'));
var environment = require('mastercard-api/common/Environment');
var transferServiceClass = require('mastercard-api/services/moneysend/TransferService');
var FS = require("fs");

var testUtilConstantsClass = {
    production_private_key_path: '/Users/vishi/WebstormProjects/MoneySend/node_modules/mastercard-api/keys/privatekey.pem',
    sandbox_private_key_path: '/Users/vishi/WebstormProjects/MoneySend/node_modules/mastercard-api/keys/privatekey.pem'
}
this.generatePrivateKeyForTest = function(env){
    var pem;
    if (env == environment.production){ pem = FS.readFileSync(testUtilConstantsClass.production_private_key_path); }else { pem = FS.readFileSync(testUtilConstantsClass.sandbox_private_key_path); }
    return pem.toString('utf8')
};
var privateKey = this.generatePrivateKeyForTest('dev');
var service = new cardMappingServiceClass.CardMappingService(
    '-a_NjUeeHYgEFNXjB0Np1NhWR7jO_tfExPoI5mbCbfcb8dc4!45337549693662746b62334f53616e702f74307a30773d3d',
    this.generatePrivateKeyForTest('dev'),
    environment.sandbox);
var service1 = new cardMappingServiceClass.CardMappingService(
    '-a_NjUeeHYgEFNXjB0Np1NhWR7jO_tfExPoI5mbCbfcb8dc4!45337549693662746b62334f53616e702f74307a30773d3d',
    this.generatePrivateKeyForTest('dev'),
    environment.sandbox);
var panEligibilityService =  new panEligibility.PanEligibilityService(
    '-a_NjUeeHYgEFNXjB0Np1NhWR7jO_tfExPoI5mbCbfcb8dc4!45337549693662746b62334f53616e702f74307a30773d3d',
    this.generatePrivateKeyForTest('dev'),
    environment.sandbox);
var transferService = new transferServiceClass.TransferService(
    '-a_NjUeeHYgEFNXjB0Np1NhWR7jO_tfExPoI5mbCbfcb8dc4!45337549693662746b62334f53616e702f74307a30773d3d',
    this.generatePrivateKeyForTest('dev'),
    environment.sandbox
);
//mapping id: 22177, alias: VisheshAccount12   acc: 5184680430000022
//mapping id: 22183, alias: VisheshAccount123  acc:5184680430000022 8454534776
//mapping id: 22185, alias: VisheshAccount1234 acc:5184680430000030 8454534777

this.createMapping = function(){
    var request =
    {
        CreateMappingRequest: {
            SubscriberId: subscriberId = "8454534777",
            SubscriberType: subscriberType = "PHONE_NUMBER",
            AccountUsage: accountUsage = "SEND_RECV",
            DefaultIndicator: defaultIndicator = "T",
            Alias: alias = "VisheshAccount1234",
            ICA: ica = "009674",
            AccountNumber: accountNumber = "5184680430000030",

            ExpiryDate: '201809',
//        ExpiryDate: expiryDate = "201409",
            CardholderFullName: {
                CardholderFirstName: cardholderFirstName = "John",
                CardholderMiddleName: cardholderMiddleName = "Q",
                CardholderLastName: cardholderLastName = "Public"
            },
            Address: {
                Line1: line1 = "123 Main Street",
                Line2: line2 = "#5A",
                City: city = "OFallon",
                CountrySubdivision: countrySubdivision = "MO",
                PostalCode: postalCode = "63368",
                Country: country = "USA"
            },
            DateOfBirth: dateOfBirth = "19460102"
        }
    };
    var createMap = service.getCreateMapping(request);
    console.log(createMap);
    return createMap;
}
this.inquireMapping = function(suscriberId){


    return new Promise(function(resolve, reject){
        var request =
        {
            InquireMappingRequest: {
                SubscriberId: subscriberId = suscriberId, //"8454534776",
                SubscriberType: subscriberType = "PHONE_NUMBER"
//            ,
//            AccountUsage: accountUsage = "SENDING",
//            Alias: alias = "My Debit Card",
//            DataResponseFlag: dataResponseFlag = "3"

            }
        };
        service1.setCallback(function(response){
            resolve(response);

        });
        var inquireMap = service1.getInquireMapping(request);
    });

}
this.deleteMapping = function(){
    var request =
    {
        InquireMappingRequest: {
            SubscriberId: subscriberId = "8454534774",
            SubscriberType: subscriberType = "PHONE_NUMBER"
//            ,
//            AccountUsage: accountUsage = "SENDING",
//            Alias: alias = "My Debit Card",
//            DataResponseFlag: dataResponseFlag = "3"

        }
    };
    //var inquireMap = service. (request);
    //console.log(inquireMap);
    //return inquireMap;
}
this.checkPanEligibility = function(){

    //panEligibilityService.
    return new Promise(function(resolve, reject){
        var request =
        {
            PanEligibilityRequest: {
                SendingAccountNumber: sendingAccountNumber = "5184680430000022",
                ReceivingAccountNumber: receivingAccountNumber = "5184680430000030"
            }
        };
        panEligibilityService.setCallback(function(response){
            console.log('This is response in callback!!!!!!!!!!!!!   ' +response);
            resolve(response);

        });

        var panEligibility = panEligibilityService.getPanEligibility(request);
    });
    //return panEligibility;
}
this.getTransactionId = function(){
    var aa = Math.random() * 1E19;
    return aa;
}
this.transferFunds = function(fundingAmount){
    var self = this;
    //panEligibilityService.
    return new Promise(function(resolve, reject){
        var request =
        {
            TransferRequest: {
                LocalDate: localDate = "1218",
                LocalTime: localTime = "161222",
                TransactionReference: transactionReference = self.getTransactionId(),
                SenderName: senderName = "John Doe",
                SenderAddress: {
                    Line1: line1 = "123 Main Street",
                    Line2: line2 = "#5A",
                    City: city = "Arlington",
                    CountrySubdivision: countrySubdivision = "VA",
                    PostalCode: postalCode = "22207",
                    Country: country = "USA"
                },
                FundingCard: {
                    AccountNumber: accountNumber = "5184680430000006",
                    ExpiryMonth: expiryMonth = "11",
                    ExpiryYear: expiryYear = "2018"
                },
                FundingUCAF: fundingUCAF = "MjBjaGFyYWN0ZXJqdW5rVUNBRjU=1111",
                FundingMasterCardAssignedId: fundingMasterCardAssignedId = "123456",
                FundingAmount: {
                    Value: value = fundingAmount,
                    Currency: currency = "840"
                },
                ReceiverName: receiverName = "Jose Lopez",
                ReceiverAddress: {
                    Line1: line1 = "Pueblo Street",
                    Line2: line2 = "PO BOX 12",
                    City: city = "El PASO",
                    CountrySubdivision: countrySubdivision = "TX",
                    PostalCode: postalCode = "79906",
                    Country: country = "USA"
                },
                ReceiverPhone: receiverPhone = "1800639426",
                ReceivingCard: {
                    AccountNumber: accountNumber = "5184680430000006"
                },
                ReceivingAmount: {
                    Value: value = "182207",
                    Currency: currency = "484"
                },
                Channel: channel = "W",
                UCAFSupport: ucafSupport = "false",
                ICA: ica = "009674",
                ProcessorId: processorId = "9000000442",
                RoutingAndTransitNumber: routingAndTransitNumber = "990442082",
                CardAcceptor: {
                    Name: name = "My Local Bank",
                    City: city = "Saint Louis",
                    State: state = "MO",
                    PostalCode: postalCode = "63101",
                    Country: country = "USA"
                },
                TransactionDesc: transactionDesc = "P2P",
                MerchantId: merchantId = "123456"
            }
        };
        transferService.setCallback(function(response){
            console.log('This is response in callback!!!!!!!!!!!!!   ' +response);
            resolve(response);

        });

        var panEligibility = transferService.getTransfer(request);
    })
    //return panEligibility;
}
this.testCall = function(){
    var url = 'https://sandbox.api.mastercard.com/atms/v1/atm?Format=XML&PageOffset=0&PageLength=10&AddressLine1=70 Main St&PostalCode=63366&Country=USA&InternationalMaestroAccepted=1';
    var locationService1 = new locationService.CountryAtmLocationService('-a_NjUeeHYgEFNXjB0Np1NhWR7jO_tfExPoI5mbCbfcb8dc4!45337549693662746b62334f53616e702f74307a30773d3d',
        this.generatePrivateKeyForTest('dev'),
        environment.sandbox);
    console.log(locationService1);
}
module.exports.test = cardMappingServiceClass;
module.exports.privateKey = privateKey;
module.exports.createMapping = this.createMapping;
module.exports.inquireMapping = this.inquireMapping;
module.exports.testCall = this.testCall;
module.exports.checkPanEligibility = this.checkPanEligibility;
module.exports.transferFunds = this.transferFunds;