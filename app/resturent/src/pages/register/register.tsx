import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./register.css";
import { MessageStrip } from "@ui5/webcomponents-react";
import OtpValidate from "../../components/otp/otp";

type BasicDetails = {
  name: string;
  email: string;
  number: string;
  type: "C" | "R" | "D";
};

type AddressDetails = {
  addressLine1: string;
  addressLine2: string;
  city: string;
  stateProvince: string;
  postalCode: string;
};

type Tone = "error" | "success" | "info";
type Step = "form" | "otp";

interface AddressBoxProps {
  addressDetails: AddressDetails;
  setAddressDetails: React.Dispatch<React.SetStateAction<AddressDetails>>;
}

type MessageToastProps = {
  errMsg: string | null;
  onClose: () => void;
};

export default function Register() {
  const navigate = useNavigate();

  return (
    <div className="rg-root">
      {/* ── Left panel ── */}
      <div className="rg-left">
        <div className="rg-brand" onClick={() => navigate("/")}>
          <span className="rg-moon">🌙</span>
          <h1 className="rg-title">
            MidNight
            <br />
            Crave
          </h1>
        </div>

        <ul className="rg-perks">
          <li>🍕 Order from 50+ restaurants</li>
          <li>⚡ Delivered in under 30 mins</li>
          <li>📍 Save your favourite addresses</li>
        </ul>
      </div>

      {/* ── Right panel ── */}
      <div className="rg-right">
        <div className="rg-card">
          <RegisterPage />
        </div>
      </div>
    </div>
  );
}

function RegisterPage() {
  const navigate = useNavigate();

  const [step, setStep] = useState<Step>("form");
  const [errMsg, setErrMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // OTP step feedback
  const [tone, setTone] = useState<Tone | null>(null);
  const [otpMsg, setOtpMsg] = useState("");

  const [basicDetails, setBasicDetails] = useState<BasicDetails>({
    name: "Subham Sahoo",
    email: "test938514@gmail.com",
    number: "9348514583",
    type: "C",
  });

  const [addressDetails, setAddressDetails] = useState<AddressDetails>({
    addressLine1: "Address1",
    addressLine2: "Address2",
    city: "Hyderbad",
    stateProvince: "Telegana",
    postalCode: "Odisha",
  });

  // derived from type — no separate state needed
  const showAddress = basicDetails.type !== "D";

  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(basicDetails.email);
  const isAllFill = Boolean(
    basicDetails.name && isValidEmail && basicDetails.number,
  );

  // ── Shared: call backend to send OTP ──
  async function sendOtp(): Promise<{ ok: boolean; message?: string }> {
    const response = await fetch("/restaurant/verifyEmail", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: basicDetails.email }),
    });
    const data = await response.json();
    return { ok: Boolean(data.success), message: data.message };
  }

  // ── Step 1: form submit → send OTP → show OTP view ──
  async function handleSubmit() {
    setLoading(true);
    try {
      const { ok, message } = await sendOtp();
      if (ok) {
        setTone(null);
        setOtpMsg("");
        setStep("otp"); // switch view — form state stays alive
      } else {
        setErrMsg(message ?? "Could not send OTP");
      }
    } catch {
      setErrMsg("Server not reachable");
    } finally {
      setLoading(false);
    }
  }

  // ── Resend from OTP view ──
  async function handleResend() {
    try {
      const { ok, message } = await sendOtp();
      setTone(ok ? "info" : "error");
      setOtpMsg(ok ? "New code sent ✓" : message ?? "Could not resend OTP");
    } catch {
      setTone("error");
      setOtpMsg("Server not reachable");
    }
  }

  // ── Step 2: verify OTP, then create user ──
  const handleOtpComplete = useCallback(
    async (otp: string) => {
      setTone("info");
      setOtpMsg("Verifying...");
      try {
        const res = await fetch("/restaurant/verifyOtp", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: basicDetails.email, otp }),
        });
        const { message, attempt, SeasonKey } = await res.json();

        if (!SeasonKey) {
          setTone("error");
          setOtpMsg(
            attempt != null ? `${message} (attempts: ${attempt})` : message,
          );
          return; // stop here on invalid OTP
        }

        // email verified → create user
        const createRes = await fetch("/restaurant/createUser", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            basicDetails,
            addressDetails: showAddress ? addressDetails : null, // no address for delivery boy
            SeasonKey,
          }),
        });

        const { message: createMsg } = await createRes.json();
        if (createMsg !== "Insert Success") {
          throw new Error(createMsg ?? "Could not create account");
        }

        setTone("success");
        setOtpMsg("Account created ✓");
        setTimeout(() => navigate("/"), 1000);
      } catch (e) {
        setTone("error");
        setOtpMsg(e instanceof Error ? e.message : "Something went wrong");
      }
    },
    [basicDetails, addressDetails, showAddress, navigate],
  );

  // ── OTP view ──
  if (step === "otp") {
    return (
      <OtpValidate
        email={basicDetails.email}
        onEdit={() => setStep("form")}
        onResend={handleResend}
        onComplete={handleOtpComplete}
        tone={tone}
        slot={otpMsg}
      />
    );
  }

  // ── Form view ──
  return (
    <>
      <h2 className="rg-card-title">Create your account</h2>
      <p className="rg-card-sub">Fill in the details below to get started</p>

      <MessageToast errMsg={errMsg} onClose={() => setErrMsg(null)} />

      <form
        className="rg-form"
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        <section className="rg-section">
          <h3 className="rg-section-title">Personal Details</h3>

          <div className="rg-field">
            <label className="rg-label">Name</label>
            <input
              className="rg-input"
              placeholder="Enter Name"
              value={basicDetails.name}
              onInput={(e) =>
                setBasicDetails((prev) => ({
                  ...prev,
                  name: (e.target as HTMLInputElement).value,
                }))
              }
            />
          </div>

          <div className="rg-field">
            <label className="rg-label">Email</label>
            <input
              className="rg-input"
              placeholder="Enter Email"
              value={basicDetails.email}
              onInput={(e) =>
                setBasicDetails((prev) => ({
                  ...prev,
                  email: (e.target as HTMLInputElement).value,
                }))
              }
            />
          </div>

          <div className="rg-field">
            <label className="rg-label">Department</label>
            <select
              aria-label="Department"
              className="rg-select"
              value={basicDetails.type}
              onChange={(e) =>
                setBasicDetails((prev) => ({
                  ...prev,
                  type: e.target.value as BasicDetails["type"],
                }))
              }
            >
              <option value="C">CUSTOMER</option>
              <option value="R">RESTAURANT OWNER</option>
              <option value="D">DELIVERY BOY</option>
            </select>
          </div>

          <div className="rg-field">
            <label className="rg-label">Mobile Number</label>
            <input
              className="rg-input"
              placeholder="Enter Mobile Number"
              value={basicDetails.number}
              onInput={(e) =>
                setBasicDetails((prev) => ({
                  ...prev,
                  number: (e.target as HTMLInputElement).value,
                }))
              }
            />
          </div>
        </section>

        {showAddress && (
          <AddressBox
            addressDetails={addressDetails}
            setAddressDetails={setAddressDetails}
          />
        )}

        <button
          type="submit"
          className="rg-submit"
          disabled={!isAllFill || loading}
        >
          {loading ? "Sending OTP..." : "Create Account"}
        </button>
      </form>
    </>
  );
}

function AddressBox({ addressDetails, setAddressDetails }: AddressBoxProps) {
  return (
    <section className="rg-section">
      <h3 className="rg-section-title">Address</h3>

      <div className="rg-field">
        <label className="rg-label">Address Line 1</label>
        <input
          className="rg-input"
          placeholder="Address Line 1"
          value={addressDetails.addressLine1}
          onInput={(e) =>
            setAddressDetails((prev) => ({
              ...prev,
              addressLine1: (e.target as HTMLInputElement).value,
            }))
          }
        />
      </div>

      <div className="rg-field">
        <label className="rg-label">Address Line 2</label>
        <input
          className="rg-input"
          placeholder="Address Line 2"
          value={addressDetails.addressLine2}
          onInput={(e) =>
            setAddressDetails((prev) => ({
              ...prev,
              addressLine2: (e.target as HTMLInputElement).value,
            }))
          }
        />
      </div>

      <div className="rg-field-row">
        <div className="rg-field">
          <label className="rg-label">City</label>
          <input
            className="rg-input"
            placeholder="Enter City"
            value={addressDetails.city}
            onInput={(e) =>
              setAddressDetails((prev) => ({
                ...prev,
                city: (e.target as HTMLInputElement).value,
              }))
            }
          />
        </div>

        <div className="rg-field">
          <label className="rg-label">State</label>
          <input
            className="rg-input"
            placeholder="Enter State"
            value={addressDetails.stateProvince}
            onInput={(e) =>
              setAddressDetails((prev) => ({
                ...prev,
                stateProvince: (e.target as HTMLInputElement).value,
              }))
            }
          />
        </div>

        <div className="rg-field rg-field--pin">
          <label className="rg-label">PIN</label>
          <input
            className="rg-input"
            placeholder="Pin Code"
            value={addressDetails.postalCode}
            onInput={(e) =>
              setAddressDetails((prev) => ({
                ...prev,
                postalCode: (e.target as HTMLInputElement).value,
              }))
            }
          />
        </div>
      </div>
    </section>
  );
}

function MessageToast({ errMsg, onClose }: MessageToastProps) {
  if (!errMsg) return null;

  return (
    <MessageStrip design="Negative" onClose={onClose}>
      {errMsg}
    </MessageStrip>
  );
}