const {Schema, model} = require('mongoose');

const transactionSchema  = new Schema({
payerEmail: {
    required: true,
    type: String
},
payerName: {
    type: String,
    required: true
},
payerMobile : {
    type: String,
    required: true
},
clientTxnId: {
        type: String,
    required: true
},
amount: {
    type: Number,
    required: true
},

spTxnId: {
    type: String
},
channelId: {
    type: String,
    required: true
},
mcc: {
    type: String,
    required: true
},
transDate: {
    type: Date,
    required: true
},
status: {
    type: String,
    enum: ['success', 'failure']
}, 
spTxnId: {
    type: String
},
paymentMode: {
type: String
}, 

bankName: {
    type: String
},

statusCode: {
    type: String
},
spMessage: {
    type: String
}, 

bankErrorCode: {
    type: String
}

});

const Transaction = model('Transaction',transactionSchema );
module.exports = Transaction;
