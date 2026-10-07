using db from '../db/db-model';


type BasicDetailsT {
    name   : String;
    email  : String;
    number : String;
    type   : String enum {
        C = 'Customer';
        R = 'Retsurent Owner';
        D = 'Delivery Person';
    };
};

type AddressDetailsT {
    addressLine1  : String;
    addressLine2  : String;
    city          : String;
    stateProvince : String;
    postalCode    : String;
};

service RestaurantService {
    entity Users       as
        projection on db.User {
            ID,
            name,
            email,
            number,
            role.type,
            address
        }

    entity Addresses   as projection on db.Addresses;

    entity Restaurants as
        projection on db.Restaurant {
            *,
            status @readonly
        }
        excluding {
            owner
        }


    entity MenuItems   as projection on db.MenuItems;

    entity Food        as projection on db.Food;

    // entity OtpValidation as projection on db.OtpValidation;

    action verifyEmail(email: String, role: String(1))                      returns {
        message : String(50);
        success : Boolean;
    };

    action verifyOtp(email: String, otp: String(4))                         returns {
        message   : String(50);
        attempt   : String(50);
        SeasonKey : String(1000);
    };

    action createUser(basicDetails: BasicDetailsT, SeasonKey: String(1000)) returns {
        message : String(50);
        ID      : db.User:ID
    };
}
