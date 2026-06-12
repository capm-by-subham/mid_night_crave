using db from '../db/db-model';

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
}
