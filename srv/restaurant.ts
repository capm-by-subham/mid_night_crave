import cds from '@sap/cds';

import sendOtp from "./mail";

import { CreateUser } from "./zod";


export class RestaurantService extends cds.ApplicationService {
  init() {

    const { Users, Addresses } = this.entities;
    const { OtpValidation, validMail } = cds.entities("db");

    this.on("verifyEmail", async (req) => {
      try {
        await sendOtp(req.data.email);
        return { success: true, message: 'OTP sent' };
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to send OTP';
        return { success: false, message };
      }
    })

    this.on("verifyOtp", async (req) => {

      const { email, otp: userOTP } = req.data;

      const record = await SELECT.one.from(OtpValidation).where({ email }).forUpdate({ wait: 5 });

      if (!record) {
        return {
          message: "Invalid or expired OTP. Please request a new one.",
          attempt: ``,
          isValid: false
        }
      }

      const isExpired = new Date(record.validUpTo) < new Date(Date.now());

      if (isExpired) {
        await DELETE.from(OtpValidation).where({ email });

        return {
          message: "Otp is Expired Click Send Again",
          attempt: ``,
          isValid: false
        }
      }

      const sentOTP = record?.otp;

      if (userOTP === sentOTP) {

        await UPSERT.into(validMail).entries({ email, isVerify: true });
        await DELETE.from(OtpValidation).where({ email });

        return {
          message: "Valid OTP",
          isValid: true
        }
      } else {


        await UPDATE(OtpValidation, email).with({ attempt: { '-=': 1 } });

        const attemptLeft = record.attempt - 1;

        if (attemptLeft === 0) {

          await DELETE.from(OtpValidation).where({ email, attempt: 0 });

          return {
            message: "4 attempt Completed Please Request for new OTP",
            isValid: false
          }
        }

        return {
          message: "InValid OTP",
          attempt: `${attemptLeft} attempt Left`,
          isValid: false
        }
      }

    })

    this.on("createUser", async (req) => {
      const typeCheckRes = CreateUser.safeParse(req.data);

      if (!typeCheckRes.success) {
        return req.reject(400, typeCheckRes.error.message);
      }

      const res = typeCheckRes.data;

      const { basicDetails, addressDetails } = res;

      await INSERT.into(Addresses).entries(addressDetails);

      basicDetails.Address_ID = addressDetails.ID;

      await INSERT.into(Users).entries(basicDetails);

      return basicDetails.ID;
    })


    return super.init();
  }
}



