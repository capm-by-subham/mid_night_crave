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
            type,
            Address
        }

    entity Addresses   as projection on db.Addresses;

    entity Restaurants as
        projection on db.Restaurant {
            ID,
            name,
            description,
            cuisine,
            Address,
            menu
        }


    entity MenuItems   as projection on db.MenuItems;

    entity Food        as projection on db.Food;

    action createUser(basicDetails: BasicDetailsT, addressDetails: AddressDetailsT) returns db.User:ID;

    entity getUserDetails as projection on db.USERDETAILS; // just for exper
}
