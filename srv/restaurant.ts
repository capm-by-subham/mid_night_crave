import cds from '@sap/cds';

import { z } from 'zod';

const BasicDetails = z.object({
  name: z.string().min(1),
  email: z.email(),
  phone: z.string().regex(/^\d{10}$/, "Phone must be 10 digits"),
});

type BasicDetails = z.infer<typeof BasicDetails>;

const AddressDetails = z.object({
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

    async function addNewAddress(addressDetails: AddressDetails) {
      console.log(addNewAddress)
      await INSERT.into(Addresses).entries(addressDetails)
      console.log(addNewAddress)

    }


    this.on("createUser", async (req) => {
      const typeCheckRes = CreateUser.safeParse(req.data);

      if (!typeCheckRes.success) {
        return req.reject(400, typeCheckRes.error.message);
      }

      const res = typeCheckRes.data;

      const { basicDetails, addressDetails } = res;

      await addNewAddress(addressDetails);





    })


    return super.init();
  }
}