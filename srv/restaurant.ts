import cds from '@sap/cds';

import sendOtp from "./mail";

// import { CreateUser } from "./zod";

const LOGS = cds.log("restaurantsService");


export class RestaurantService extends cds.ApplicationService {
  init() {

    this.on("verifyEmail", this.onVerifyEmail);
    this.on("verifyOtp", this.onVerifyOTP);

    return super.init();
  }

  async onVerifyEmail(req: cds.Request) {
    try {
      const email = req.data.email;
      if (!this.isValidEmail(email)) {
        req.reject("Not a Valid Email");
      }
      await sendOtp(email);
      return { success: true, message: 'OTP sent' };
    } catch (error) {
      LOGS.error("verifyEmail Failed", error);
      return { success: false, message: "Failed To Send Otp  Try Again" };
    }
  }

  async onVerifyOTP(req: cds.Request) {
    try {
      const { OtpValidation, validMail } = cds.entities("db");

      const { email, otp: userOTP } = req.data;

      if (!this.isValidEmail(email)) req.error("Invalid Email");

      const record = await SELECT.one.from(OtpValidation).where({ email }).forUpdate({ wait: 5 });
      if (!record) return { message: "Invalid or expired OTP. Please request a new one.", attempt: ``, isValid: false };

      const isExpired = new Date(record.validUpTo) < new Date(Date.now());
      if (isExpired) {
        await DELETE.from(OtpValidation).where({ email });
        return { message: "Otp is Expired Click Send Again", attempt: ``, isValid: false }
      }

      const sentOTP = record?.otp;
      if (userOTP === sentOTP) {
        await UPSERT.into(validMail).entries({ email, isVerify: true });
        await DELETE.from(OtpValidation).where({ email });
        return { message: "Valid OTP", isValid: true };
      } else {
        await UPDATE(OtpValidation, email).with({ attempt: { '-=': 1 } });
        const attemptLeft = record.attempt - 1;
        if (attemptLeft === 0) {
          await DELETE.from(OtpValidation).where({ email, attempt: 0 });
          return { message: "4 attempt Completed Please Request for new OTP", isValid: false };
        }
        return { message: "InValid OTP", attempt: `${attemptLeft} attempt Left`, isValid: false }
      }
    } catch (error) {
      LOGS.error("verifyOtp Failed", error);
      return { message: "Request failed", attempt: ``, isValid: false };
    }

  }


  // utill Function
  isValidEmail(email: string): Boolean {
    const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return EMAIL_REGEX.test(email.trim());
  }
}



