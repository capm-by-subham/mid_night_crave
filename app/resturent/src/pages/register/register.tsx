import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./register.css";

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

interface AddressBoxProps {
  addressDetails: AddressDetails;
  setAddressDetails: React.Dispatch<React.SetStateAction<AddressDetails>>;
}

export default function Register() {
  const navigate = useNavigate();

  return (
    <div className="rg-root">
      {/* ── Left panel ── */}
      <div className="rg-left">
        <div
          className="rg-brand"
          onClick={() => navigate("/")}
        >
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

      {/* ── Right panel (form) ── */}
      <div className="rg-right">
        <div className="rg-card">
          <h2 className="rg-card-title">Create your account</h2>
          <p className="rg-card-sub">
            Fill in the details below to get started
          </p>
          <RegisterPage />
        </div>
      </div>
    </div>
  );
}

function RegisterPage() {
  const [showAddress, setShowAddress] = useState<boolean>(true);

  const [basicDetails, setBasicDetails] = useState<BasicDetails>({
    name: "",
    email: "@gmail.com",
    number: "",
    type: "C",
  });

  const [addressDetails, setAddressDetails] = useState<AddressDetails>({
    addressLine1: "",
    addressLine2: "",
    city: "",
    stateProvince: "",
    postalCode: "",
  });

  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(basicDetails.email);

  const isAllFill = Boolean(
    basicDetails.name && isValidEmail && basicDetails.number,
  );

  async function handleSubmit() {
    const response = await fetch("/restaurant/createUser", {
      method: "POST",
      body: JSON.stringify({
        basicDetails: basicDetails,
        addressDetails: addressDetails,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    const userId = data.value;
    console.log(userId);
  }

  return (
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
            onInput={(e) => {
              setBasicDetails((prev) => ({
                ...prev,
                name: (e.target as HTMLInputElement).value,
              }));
            }}
          />
        </div>

        <div className="rg-field">
          <label className="rg-label">Email</label>
          <input
            className="rg-input"
            placeholder="Enter Email"
            value={basicDetails.email}
            onInput={(e) => {
              setBasicDetails((prev) => ({
                ...prev,
                email: (e.target as HTMLInputElement).value,
              }));
            }}
          />
        </div>

        <div className="rg-field">
          <label className="rg-label">Department</label>
          <select
            aria-label="Department"
            className="rg-select"
            value={basicDetails.type}
            onChange={(e) => {
              setShowAddress(
                e.target.options[e.target.selectedIndex].text !==
                  "DELIVERY BOY",
              );
              setBasicDetails((prev) => ({
                ...prev,
                type: e.target.value as "C" | "R" | "D",
              }));
            }}
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
            onInput={(e) => {
              setBasicDetails((prev) => ({
                ...prev,
                number: (e.target as HTMLInputElement).value,
              }));
            }}
          />
        </div>
      </section>

      {showAddress && (
        <AddressBox
          addressDetails={addressDetails}
          setAddressDetails={setAddressDetails}
        />
      )}

      <button type="submit" className="rg-submit" disabled={!isAllFill}>
        Create Account
      </button>
    </form>
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
          onInput={(e) => {
            setAddressDetails((prev) => ({
              ...prev,
              addressLine1: (e.target as HTMLInputElement).value,
            }));
          }}
        />
      </div>

      <div className="rg-field">
        <label className="rg-label">Address Line 2</label>
        <input
          className="rg-input"
          placeholder="Address Line 2"
          value={addressDetails.addressLine2}
          onInput={(e) => {
            setAddressDetails((prev) => ({
              ...prev,
              addressLine2: (e.target as HTMLInputElement).value,
            }));
          }}
        />
      </div>

      <div className="rg-field-row">
        <div className="rg-field">
          <label className="rg-label">City</label>
          <input
            className="rg-input"
            placeholder="Enter City"
            value={addressDetails.city}
            onInput={(e) => {
              setAddressDetails((prev) => ({
                ...prev,
                city: (e.target as HTMLInputElement).value,
              }));
            }}
          />
        </div>

        <div className="rg-field">
          <label className="rg-label">State</label>
          <input
            className="rg-input"
            placeholder="Enter State"
            value={addressDetails.stateProvince}
            onInput={(e) => {
              setAddressDetails((prev) => ({
                ...prev,
                stateProvince: (e.target as HTMLInputElement).value,
              }));
            }}
          />
        </div>

        <div className="rg-field rg-field--pin">
          <label className="rg-label">PIN</label>
          <input
            className="rg-input"
            placeholder="Pin Code"
            value={addressDetails.postalCode}
            onInput={(e) => {
              setAddressDetails((prev) => ({
                ...prev,
                postalCode: (e.target as HTMLInputElement).value,
              }));
            }}
          />
        </div>
      </div>
    </section>
  );
}
