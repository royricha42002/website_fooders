import twilio from 'twilio';

// Twilio credentials
const accountSid = 'ACb82d6d672cc8ca8bf9f4823dd7586ad2';  // Replace with your actual account SID
const authToken = '01db3f7a290a988767f974b2eead1749';    // Replace with your actual auth token

const client = twilio(accountSid, authToken);

const sendSms = async (phoneNumber, message) => {
  try {
    const response = await client.messages.create({
      body: message,
      from: '7983788548', // Replace with your Twilio phone number
      to: phoneNumber
    });
    return response;
  } catch (error) {
    console.error('Error sending SMS:', error);
    throw new Error('Failed to send SMS');
  }
};

export { sendSms };
