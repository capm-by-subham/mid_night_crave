import { useState } from "react";

import "./home.css";

import {
  Page,
  Bar,
  Title,
  Form,
  FormGroup,
  FormItem,
  Input,
  Select,
  Option,
  Card,
  Button
} from "@ui5/webcomponents-react";

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

export default function Home() {
  // useEffect(()=>{
  //     console.log("Hello React")
  // })

  return (
    <div className="MainContainer">
      <Page
        header={
          <Bar>
            <Title>Register</Title>
          </Bar>
        }
      >
        <Register />
      </Page>
    </div>
  );
}

function Register() {
  const [showAddress, setShowAddress] = useState<boolean>(true);

  const [basicDetails, setBasicDetails] = useState<BasicDetails>({
    name: "",
    email: "",
    number: "",
    type: "C"
  });
  const [addressDetails, setAddressDetails] = useState<AddressDetails>({
    addressLine1: "",
    addressLine2: "",
    city: "",
    stateProvince: "",
    postalCode: "",
  });

  const isAllFill = Boolean(basicDetails.name && basicDetails.email && basicDetails.number);

  async function handleSubmit() {
    const response = await fetch('/restaurant/createUser', {
      method: "POST",
      body: JSON.stringify({ basicDetails: basicDetails, addressDetails: addressDetails }),
      headers: {
        "Content-Type": "application/json"
      }
    })
    const data = await response.json();   // ← parses the JSON body
    const userId = data.value;
  }

  return (
    <div className="cardContainer">
      <Card
        style={{
          width: "700px",
          padding: "1rem",
          margin: "1rem",
        }}
      >
        <Form>
          <FormGroup headerText="Employee Details">
            <FormItem labelContent={<span>Name</span>}>
              <Input
                placeholder="Enter Name"
                value={basicDetails.name}
                onInput={(e) => {
                  setBasicDetails((prev) => ({
                    ...prev,
                    name: e.target.value,
                  }));
                }}
              />
            </FormItem>

            <FormItem labelContent={<span>Email</span>}>
              <Input
                placeholder="Enter Email"
                value={basicDetails.email}
                onInput={(e) => {
                  setBasicDetails((prev) => ({
                    ...prev,
                    email: e.target.value,
                  }));
                }}
              />
            </FormItem>


            <FormItem labelContent={<span>Department</span>}>
              <Select
                onChange={(e) => {
                  setShowAddress(e.detail.selectedOption.innerText !== "DELIVERY BOY")
                  setBasicDetails((prev) => ({
                    ...prev, type: e.detail.selectedOption.value as "C" | "R" | "D"
                  }))
                }

                }
              >
                <Option value="C">CUSTOMER</Option>
                <Option value="R">RESTAURANT OWNER</Option>
                <Option value="D">DELIVERY BOY</Option>
              </Select>
            </FormItem>
            <FormItem labelContent={<span>Mobile Number</span>}>
              <Input
                placeholder="Enter Mobile Number"
                value={basicDetails.number}
                onInput={(e) => {
                  setBasicDetails((prev) => ({
                    ...prev,
                    number: e.target.value,
                  }));
                }}
              />
            </FormItem>
          </FormGroup>

          {showAddress && (
            <AddressBox
              addressDetails={addressDetails}
              setAddressDetails={setAddressDetails}
            />
          )}
        </Form>
        <Button disabled={!isAllFill} onClick={handleSubmit}>Submit</Button>
      </Card>
    </div>
  );
}

function AddressBox({ addressDetails, setAddressDetails }: AddressBoxProps) {
  return (
    <FormGroup headerText="Address">
      <FormItem labelContent={<span>Address Line 1</span>}>
        <Input
          placeholder="Address Line 1"
          value={addressDetails.addressLine1}
          onInput={(e) => {
            setAddressDetails((prev) => ({
              ...prev,
              addressLine1: e.target.value,
            }));
          }}
        />
      </FormItem>

      <FormItem labelContent={<span>Address Line 2</span>}>
        <Input
          placeholder="Address Line 2"
          value={addressDetails.addressLine2}
          onInput={(e) => {
            setAddressDetails((prev) => ({
              ...prev,
              addressLine2: e.target.value,
            }));
          }}
        />
      </FormItem>

      <FormItem labelContent={<span>City</span>}>
        <Input
          placeholder="Enter City"
          value={addressDetails.city}
          onInput={(e) => {
            setAddressDetails((prev) => ({
              ...prev,
              city: e.target.value,
            }));
          }}
        />
      </FormItem>

      <FormItem labelContent={<span>State</span>}>
        <Input
          placeholder="Enter State"
          value={addressDetails.stateProvince}
          onInput={(e) => {
            setAddressDetails((prev) => ({
              ...prev,
              stateProvince: e.target.value,
            }));
          }}
        />
      </FormItem>
      <FormItem labelContent={<span>PIN</span>}>
        <Input
          placeholder="Pin Code"
          value={addressDetails.postalCode}
          onInput={(e) => {
            setAddressDetails((prev) => ({
              ...prev,
              postalCode: e.target.value,
            }));
          }}
        />
      </FormItem>
    </FormGroup>
  );
}
