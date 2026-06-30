import cds from '@sap/cds';

import { z } from 'zod';

const BasicDetails = z.object({
  ID: z.uuid().optional(),
  name: z.string().min(1),
  email: z.email(),
  number: z.string().regex(/^\d{10}$/, "number must be 10 digits"),
  type: z.enum(["C", "R", "D"]),
  Address_ID: z.uuid().optional()
});

type BasicDetails = z.infer<typeof BasicDetails>;

const AddressDetails = z.object({
  ID: z.uuid().optional(),
  addressLine1: z.string().min(1),
  addressLine2: z.string(),
  city: z.string().min(1),
  stateProvince: z.string().min(1),
  postalCode: z.string().length(6, "Postal code must be 6 digits"),
})

type AddressDetails = z.infer<typeof AddressDetails>;


const CreateUser = z.object({
  basicDetails: BasicDetails,
  addressDetails: AddressDetails
});

type CreateUser = z.infer<typeof CreateUser>;


export class RestaurantService extends cds.ApplicationService {
  init() {

    const { Users, Addresses } = this.entities;

    this.on("createUser", async (req) => {
      const typeCheckRes = CreateUser.safeParse(req.data);

      if (!typeCheckRes.success) {
        return req.reject(400, typeCheckRes.error.message);
      }

      const res = typeCheckRes.data;

      const { basicDetails, addressDetails } = res;

      // firrt need to valid email beofre create the USer

      await INSERT.into(Addresses).entries(addressDetails);

      basicDetails.Address_ID = addressDetails.ID;

      await INSERT.into(Users).entries(basicDetails);

      return basicDetails.ID;
    })


    return super.init();
  }
}

// resend api key :=> re_CrpFha74_4wrrTR4aQ2Jmrsz1bRmP2UNp