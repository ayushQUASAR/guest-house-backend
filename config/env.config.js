require('dotenv').config();

if(process.env.NODE_ENV === 'development') {
    require('dotenv').config({ path: `.env.local`, override: true });
}



const  {
 JWT_SECRET,
 REMOTE_URL,
 ADMIN_EMAIL,
 FRONTEND_URL,
 AUTH_KEY,
 AUTH_IV,
 CLIENT_CODE,
 USER_NAME,
 USER_PASS,
 CHANNEL_ID,
 STAGING_GATEWAY_URL,
 STAGING_TRANS_ENQUIRY_URL,
 STAGING_REFUND_URL
 } = process.env;

 module.exports = {
    JWT_SECRET,
    REMOTE_URL,
    ADMIN_EMAIL,
    FRONTEND_URL,
    AUTH_KEY,
    AUTH_IV,
    CLIENT_CODE,
    USER_NAME,
    USER_PASS,
    CHANNEL_ID,
    STAGING_GATEWAY_URL,
    STAGING_TRANS_ENQUIRY_URL,
    STAGING_REFUND_URL
 }