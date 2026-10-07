import cds from '@sap/cds';
import sendOtp from "./mail";
const crypto = require('crypto');
const LOGS = cds.log("restaurantsService");

import { CreateUser } from "./zod";
type PayLoad = { email: string, ExpireAt: number };
const mySecrete = "hello cap";

export class RestaurantService extends cds.ApplicationService {
  init() {

    this.on("verifyEmail", this.onVerifyEmail);
    this.on("verifyOtp", this.onVerifyOTP);
    this.on("createUser", this.onCreateUser);

    return super.init();
  }

  async onCreateUser(req: cds.Request) {
    try {
      const { basicDetails, SeasonKey }: CreateUser = req.data;
      const { User, Role } = cds.entities("db");
      const [hash, expiry] = SeasonKey.split(".");

      if (!hash || !expiry) return req.reject(400, "Invalid SeasonKey");

      const expireAt = Number(expiry);
      if (Number.isNaN(expireAt)) return req.reject(400, "Invalid SeasonKey");
      if (Date.now() > expireAt) return req.reject(401, "SeasonKey expired");

      const payLoad: PayLoad = { email: basicDetails.email, ExpireAt: expireAt };
      const isValidEmail = this.isValidPayLoad(hash, payLoad);
      if (!isValidEmail) return req.reject(401, "Invalid Season");


      let existUserID = (await SELECT.one.from(User).columns(["ID", "email"]).where({ email: basicDetails.email }))?.ID;
      if (!existUserID) {
        const user = { ...basicDetails, role: [{ type: basicDetails.type }] };
        await INSERT.into(User).entries(user);
        existUserID = user.ID;
      } else {// for same user with Mutiple Role like a driver can be an custmer;
        let existUserRole = await SELECT.one.from(Role).where({ "type": basicDetails.type, "user_ID": existUserID });
        if (existUserRole) return { message: "User Exist", ID: existUserID };
        else await INSERT.into(Role).entries({ "type": basicDetails.type, "user_ID": existUserID });
      }

      return { message: "Insert Success", ID: existUserID };
    } catch (error) {
      LOGS.error("Error in onCreateUser", error);
      return { message: "Failed to Create User", ID: "" };
    }

  }

  async onVerifyEmail(req: cds.Request) {
    try {
      const { email, role } = req.data;
      const { User, Role } = cds.entities("db");
      if (!this.isValidEmail(email)) {
        req.reject("Not a Valid Email");
      }

      let existUserID = (await SELECT.one.from(User).columns(["ID", "email"]).where({ email: email }))?.ID;
      if (existUserID) {
        let existUserRole = await SELECT.one.from(Role).where({ "type": role, "user_ID": existUserID });
        if (existUserRole) return { success: false, message: 'User Exist For This Mail Pls Login' };
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
      const { OtpValidation } = cds.entities("db");

      const { email, otp: userOTP } = req.data;

      if (!this.isValidEmail(email)) req.error("Invalid Email");

      const record = await SELECT.one.from(OtpValidation).where({ email }).forUpdate({ wait: 5 });
      if (!record) return { message: "Invalid or expired OTP. Please request a new one.", attempt: ``, SeasonKey: "" };

      const isExpired = new Date(record.validUpTo) < new Date(Date.now());
      if (isExpired) {
        await DELETE.from(OtpValidation).where({ email });
        return { message: "Otp is Expired Click Send Again", attempt: ``, SeasonKey: "" };
      }

      const sentOTP = record?.otp;
      if (userOTP === sentOTP) {
        const ExpireAt = new Date(Date.now() + 15 * 60 * 1000).getTime();
        const payLoad: PayLoad = { email: email, ExpireAt: ExpireAt };
        let seasonKey = this.getSeasonKey(payLoad);
        seasonKey = [seasonKey, ExpireAt].join(".");
        await DELETE.from(OtpValidation).where({ email });
        return { message: "Valid OTP", SeasonKey: seasonKey };
      } else {
        await UPDATE(OtpValidation, email).with({ attempt: { '-=': 1 } });
        const attemptLeft = record.attempt - 1;
        if (attemptLeft === 0) {
          await DELETE.from(OtpValidation).where({ email, attempt: 0 });
          return { message: "4 attempt Completed Please Request for new OTP", SeasonKey: "" };
        }
        return { message: "InValid OTP", attempt: `${attemptLeft} attempt Left`, SeasonKey: "" };
      }
    } catch (error) {
      LOGS.error("verifyOtp Failed", error);
      return { message: "Request failed", attempt: ``, SeasonKey: "" };
    }

  }


  // utill Function
  isValidEmail(email: string): Boolean {
    const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return EMAIL_REGEX.test(email.trim());
  }


  getSeasonKey(payLoad: PayLoad): string {
    const base64PayLoad = Buffer.from(JSON.stringify(payLoad)).toString('base64');
    return crypto.createHmac('sha256', mySecrete).update(base64PayLoad).digest('hex');
  }

  isValidPayLoad(SeasonKey: string, payLoad: PayLoad) {
    const base64PayLoad = Buffer.from(JSON.stringify(payLoad)).toString('base64');
    const expected = crypto.createHmac('sha256', mySecrete).update(base64PayLoad).digest('hex');
    return crypto.timingSafeEqual(
      Buffer.from(expected),
      Buffer.from(SeasonKey)
    );
  }
}



