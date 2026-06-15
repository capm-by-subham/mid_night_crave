// import { useEffect } from "react";

import "@ui5/webcomponents-fiori/dist/Page.js"

import {
  Page, Bar, Title, Form,
  FormGroup,
  FormItem,
  Input,
  Select,
  Option,
  FlexBox
} from "@ui5/webcomponents-react";


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
  return (
    <div style={{}}>
      <Form
        style={{}}
      >
        <FormGroup >

          <FormItem labelContent={<span>Name</span>}>
            <Input placeholder="Enter Name" />
          </FormItem>

          <FormItem labelContent={<span>Email</span>}>
            <Input
              type="Email"
              placeholder="Enter Email"
            />
          </FormItem>

        </FormGroup>
        <FormGroup >


          <FormItem labelContent={<span>Department</span>}>
            <Select >
              <Option>CUSTOMER</Option>
              <Option>RESTURENT OWNER</Option>
              <Option>DELIVERY BOY</Option>
            </Select>
          </FormItem>

          <FormItem labelContent={<span>Number</span>}>
            <Input
              type="Number"
              placeholder="Enter Mobile Number"
            />
          </FormItem>

        </FormGroup>
        <FormGroup >

          <FormItem >
            <AddressBox />
          </FormItem>

        </FormGroup>
      </Form>
    </div>

  )
}


function AddressBox() {
  return (
    <div style={{}}>
      <Form
        style={{}}
      >
        <FormGroup >

          <FormItem labelContent={<span>Address Line1</span>}>
            <Input placeholder="addressLine1" />
          </FormItem>

          <FormItem labelContent={<span>Address Line2</span>}>
            <Input
              placeholder="addressLine2"
            />
          </FormItem>

        </FormGroup>
        <FormGroup >

          <FormItem labelContent={<span>City</span>}>
            <Input placeholder="Enter City"></Input>
          </FormItem>

          <FormItem labelContent={<span>State</span>}>
            <Input placeholder="Enter State"></Input>
          </FormItem>

        </FormGroup>
        <FormGroup >

          <FormItem labelContent={<span>Pin Code</span>}>
            <Input placeholder="Enter Pin"></Input>
          </FormItem>


        </FormGroup>
      </Form>
    </div>
  )
}
