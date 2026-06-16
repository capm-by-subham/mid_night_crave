import { useState } from "react";

import {
  Page, Bar, Title, Form,
  FormGroup,
  FormItem,
  Input,
  Select,
  Option,
  Card
} from "@ui5/webcomponents-react";

type BasicDetails = {
  name: string,
  email: string,
  number: string
};

type AddressDetails = {
  addressLine1: string,
  addressLine2: string,
  city: string,
  stateProvince: string,
  postalCode: BigInteger,
};


export default function Home() {
  // useEffect(()=>{
  //     console.log("Hello React")
  // })

  return (

    <div style={{ height: "100vh" }}>
      <Page header={

        <Bar>
          <Title>Register</Title>
        </Bar>

      }

      >
        <Register />
      </Page>
    </div>

  )
}


function Register() {

  const [showAddress, setShowAddress] = useState<boolean>(true);


  const [basicDetails, setBasicDetails] = useState<BasicDetails>({ name: "", email: "", number: "" });
  const [addressDetails, setaddressDetails] = useState<AddressDetails>({
    addressLine1: "",
    addressLine2: "",
    city: "",
    stateProvince: "",
    postalCode: null,
  });

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        padding: "2rem"
      }}
    >
      <Card
        style={{
          width: "700px",
          padding: "1rem",
          margin: "1rem"
        }}
      >
        <Form>
          <FormGroup headerText="Employee Details">
            <FormItem labelContent={<span>Name</span>}>
              <Input placeholder="Enter Name" value={basicDetails.name} onInput={(e) => {
                setBasicDetails(prev => ({ ...prev, name: e.target.value }))
              }} />
            </FormItem>

            <FormItem labelContent={<span>Email</span>}>
              <Input placeholder="Enter Email" value={basicDetails.email} onInput={(e) => {
                setBasicDetails(prev => ({ ...prev, email: e.target.value }))
              }} />
            </FormItem>

            <FormItem labelContent={<span>Department</span>}>
              <Select
                onChange={(e) => (e.detail.selectedOption.innerText === 'DELIVERY BOY') ? setShowAddress(false) : setShowAddress(true)}>
                <Option>CUSTOMER</Option>
                <Option>RESTAURANT OWNER</Option>
                <Option>DELIVERY BOY</Option>
              </Select>
            </FormItem>

            <FormItem labelContent={<span>Mobile Number</span>}>
              <Input placeholder="Enter Mobile Number" value={basicDetails.number} onInput={(e) => {
                setBasicDetails(prev => ({ ...prev, number: e.target.value }))
              }} />
            </FormItem>
          </FormGroup>

          {showAddress && <AddressBox addressDetails={addressDetails} setaddressDetails={setaddressDetails}  />}
        </Form>
      </Card>
    </div>
  );
}


function AddressBox({addressDetails, setaddressDetails}) {
  return (
    <FormGroup headerText="Address">
      <FormItem labelContent={<span>Address Line 1</span>}>
        <Input placeholder="Address Line 1" value={addressDetails.addressLine1} />
      </FormItem>

      <FormItem labelContent={<span>Address Line 2</span>}>
        <Input placeholder="Address Line 2" value={addressDetails.addressLine2} />
      </FormItem>

      <FormItem labelContent={<span>City</span>}>
        <Input placeholder="Enter City" value={addressDetails.city} />
      </FormItem>

      <FormItem labelContent={<span>State</span>}>
        <Input placeholder="Enter State" value={addressDetails.stateProvince} />
      </FormItem>
    </FormGroup>
  );
}
