import twilio from 'twilio';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

const client = twilio(accountSid, authToken);

// Generate a 6-digit OTP
export const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send OTP via SMS
export const sendOTP = async (phoneNumber, otp, countryCode = '+91') => {
  try {
    if (!twilioPhoneNumber) {
      throw new Error('Twilio phone number not configured');
    }

    // Format phone number to E.164 format if not already formatted
    let formattedPhone = phoneNumber;
    if (!phoneNumber.startsWith('+')) {
      formattedPhone = `${countryCode}${phoneNumber}`;
    }

    const message = await client.messages.create({
      body: `Your verification code is: ${otp}. It will expire in 10 minutes.`,
      from: twilioPhoneNumber,
      to: formattedPhone,
    });

    console.log(`OTP sent successfully. Message SID: ${message.sid}`);
    return { success: true, messageSid: message.sid };
  } catch (error) {
    console.error('Error sending OTP:', error);
    throw new Error(`Failed to send OTP: ${error.message}`);
  }
};

// Verify OTP
export const verifyOTP = (storedOTP, enteredOTP, expiresAt) => {
  // Check if OTP has expired
  if (new Date() > new Date(expiresAt)) {
    return { success: false, message: 'OTP has expired' };
  }

  // Check if OTP matches
  if (storedOTP === enteredOTP) {
    return { success: true, message: 'OTP verified successfully' };
  }

  return { success: false, message: 'Invalid OTP' };
};
