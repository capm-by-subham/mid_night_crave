import cds from '@sap/cds';

import verifyMail from "./mail";

import { CreateUser } from "./zod";


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

      // firrt need to valid email before create the User

      await verifyMail(basicDetails.email);

      await INSERT.into(Addresses).entries(addressDetails);

      basicDetails.Address_ID = addressDetails.ID;

      await INSERT.into(Users).entries(basicDetails);

      return basicDetails.ID;
    })


    return super.init();
  }
}



