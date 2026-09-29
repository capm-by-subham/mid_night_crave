import SapCfMailer from "sap-cf-mailer";
import cds from '@sap/cds';

const { OtpValidation } = cds.entities("db");
const LOGS = cds.log("Mail");
const crypto = require('crypto');
const otpValidity = 5; //in Min

function generateOtp(): string {
  return String(crypto.randomInt(0, 10000)).padStart(4, '0');
}

async function sendMail(mail: string, otp: string) {
  try {
    const transporter = new SapCfMailer("mail");

    const otpHtml = `
    <div style="background:#0f0e17;padding:48px 0;font-family:'Segoe UI',system-ui,sans-serif;">
      <table align="center" width="440" cellpadding="0" cellspacing="0" style="background:#1a1826;border-radius:16px;overflow:hidden;box-shadow:0 8px 32px rgba(255,107,53,0.15);">
    
        <!-- Header -->
        <tr>
          <td style="padding:40px 40px 16px;text-align:center;">
            <div style="font-size:2.4rem;line-height:1;margin-bottom:8px;">🌙</div>
            <h1 style="margin:0;font-size:1.8rem;font-weight:800;color:#fffffe;letter-spacing:-0.5px;">MidNight Crave</h1>
            <p style="margin:6px 0 0;font-size:0.85rem;color:#a7a9be;">Late-night hunger sorted.</p>
          </td>
        </tr>
    
        <!-- OTP block -->
        <tr>
          <td style="padding:24px 40px 8px;text-align:center;">
            <p style="color:#fffffe;font-size:15px;margin:0 0 6px;">Your verification code</p>
            <p style="color:#a7a9be;font-size:12.5px;margin:0 0 22px;">Enter this to confirm your order</p>
    
            <div style="display:inline-block;background:linear-gradient(135deg,#ff6b35,#f7931e,#ffd166);border-radius:14px;padding:2px;margin-bottom:22px;">
              <div style="background:#0f0e17;border-radius:12px;padding:16px 32px;">
                <span style="font-size:34px;letter-spacing:10px;font-weight:800;background:linear-gradient(135deg,#ff6b35,#ffd166);-webkit-background-clip:text;-webkit-text-fill-color:transparent;">${otp}</span>
              </div>
            </div>
    
            <p style="color:#6e7086;font-size:12.5px;margin:0 0 4px;">Expires in <b style="color:#a7a9be;">${otpValidity} minutes</b></p>
            <p style="color:#3e3e4a;font-size:11.5px;margin:0;">Didn't request this? Ignore this email.</p>
          </td>
        </tr>
    
        <!-- Footer -->
        <tr>
          <td style="padding:24px 40px 32px;text-align:center;border-top:1px solid rgba(255,255,255,0.06);margin-top:20px;">
            <p style="color:#3e3e4a;font-size:10.5px;letter-spacing:0.5px;text-transform:uppercase;margin:16px 0 0;">
              © ${new Date().getFullYear()} MidNight Crave. All rights reserved.
            </p>
          </td>
        </tr>
    
      </table>
    </div>
    `;
    await transporter.sendMail({
      to: mail,
      cc: "",
      subject: "Your MidNight Crave Verification Code",
      html: otpHtml
    });
    return `Email sent successfully`;
  } catch (error) {
    LOGS.error("sendMail Failed", error);
    throw new Error("sendMail  Failed");
  }
}

async function sendOtp(mail: string) {
  try {
    const otp: string = generateOtp();
    await UPSERT.into(OtpValidation).entries({ email: mail, otp: otp, validUpTo: new Date(Date.now() + otpValidity * 60 * 1000) });
    await sendMail(mail, otp);
  } catch (error) {
    LOGS.error("sendOtp Failed", error);
    throw new Error("Otp send Failed");
  }
}

export default sendOtp;
