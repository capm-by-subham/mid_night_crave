namespace db;

using {
    cuid,
    managed,
} from '@sap/cds/common';

@assert.unique: {oneEmail: [email]}
entity User : cuid, managed {
    name    : String(150);
    email   : String(250);
    number  : String(10);
    role    : Composition of many Role
                  on role.user = $self;
    // One User Can Can have Mutiple Role like a Driver Can be Customer and Order.
    address : Composition of many Addresses
                  on address.user = $self;
}

@assert.unique: {RolePerUserID: [
    type,
    user
]}
entity Role : cuid {
    type : String enum {
        C = 'Customer';
        R = 'Retsurent Owner';
        D = 'Delivery Person';
    };
    user : Association to User;
}


entity Addresses : cuid {
    addressLine1  : String(150) not null;
    addressLine2  : String(150);
    city          : String(100) not null;
    stateProvince : String(100);

    postalCode    : String(20);
    restaurant    : Association to Restaurant;
    user          : Association to User;
}

entity Restaurant : cuid, managed {
    name              : String(250);
    description       : String(1000);
    rating            : Decimal(2, 1);
    cuisine           : String(400); // we may create another entity for that
    owner             : Association to User;
    status            : String enum {
        A = 'Approved';
        P = 'Pending';
        S = 'Suspended'
    } default 'Pending';
    isOpen            : Boolean default false;
    isAvailable       : Boolean default false;
    openTime          : DateTime;
    closeTime         : DateTime;
    restaurantAddress : Composition of one Addresses
                            on restaurantAddress.restaurant = $self;
    menu              : Composition of many MenuItems
                            on menu.restaurant = $self;
}

entity MenuItems : cuid, managed {
    name        : String;
    description : String;
    price       : Decimal(10, 2);
    image       : String;
    restaurant  : Association to Restaurant;
    itmes       : Composition of many Food
                      on itmes.category = $self;
}

entity Food : cuid, managed {
    name        : String(150) not null;
    description : String(1000);
    price       : Decimal(10, 2) not null;
    category    : Association to MenuItems;
    isAvailable : Boolean default true;
    imageUrl    : String(255);
}

entity Cart : cuid, managed {
    customerEmail : String(255) not null;
    items         : Composition of many CartItems
                        on items.cart = $self;
}


entity CartItems : cuid {
    cart      : Association to Cart not null;
    foodId    : UUID not null;
    foodName  : String(255) not null;
    quantity  : Integer not null;
    unitPrice : Decimal(10, 2) not null;
}


entity Orders : cuid, managed {
    orderNumber     : String(30) not null;
    customerEmail   : String(255) not null;
    orderStatus     : String(20) enum {
        PENDING = 'PENDING';
        PAID = 'PAID';
        SHIPPED = 'SHIPPED';
        CANCELLED = 'CANCELLED';
    } default 'PENDING';

    // Financial Breakdowns
    grossAmount     : Decimal(10, 2) not null; // Total before discounts/tax
    discountAmount  : Decimal(10, 2) default 0.00;
    taxAmount       : Decimal(10, 2) not null;
    netAmount       : Decimal(10, 2) not null; // Final amount charged to customer

    shippingAddress : Association to Addresses;

    // Relationships
    coupon          : Association to Coupons; // Which coupon was used (if any)
    items           : Composition of many OrderItems
                          on items.order = $self;
    payments        : Association to many Payments
                          on payments.order = $self;

    delveryPerson   : Association to User; // The delivery person assigned to this order
}

entity OrderItems : cuid {
    order      : Association to Orders not null;
    foodId     : UUID not null; // Reference to your core Product master data
    foodName   : String(255) not null;
    quantity   : Integer not null;
    unitPrice  : Decimal(10, 2) not null; // Price per item at checkout
    totalPrice : Decimal(10, 2) not null; // quantity * unitPrice
}

entity Payments : cuid, managed {
    order         : Association to Orders not null;
    paymentMethod : String(50) not null; // 'CREDIT_CARD', 'PAYPAL', 'STRIPE', etc.
    paymentStatus : String(20) not null; // 'PENDING', 'COMPLETED', 'FAILED', 'REFUNDED'
    transactionId : String(100); // The ID returned by Stripe/PayPal gateway
    amount        : Decimal(10, 2) not null;
}


// entity Reviews : cuid, managed { // nedd To Entry mnanlly to the Food inside a menu inside a restaurant
//     productId     : UUID not null;
//     orderItem     : Association to OrderItems;
//     customerEmail : String(255) not null;
//     rating        : Integer not null; // 1 to 5 star rating
//     comment       : String(1000);
// }


entity Coupons : cuid, managed {
    code          : String(50) not null; // e.g., "SUMMER50", "WELCOME10"
    discountType  : String(20) not null; // 'PERCENTAGE' or 'FIXED_AMOUNT'
    discountValue : Decimal(10, 2) not null;
    minOrderValue : Decimal(10, 2);
    validFrom     : DateTime;
    validTo       : DateTime;
    maxUses       : Integer;
    usesCount     : Integer default 0;
    isActive      : Boolean default true;
}

entity OtpValidation {
    key email     : String(100) not null;
        otp       : String(4) not null;
        validUpTo : DateTime not null;
        attempt   : Integer default 4;
}
