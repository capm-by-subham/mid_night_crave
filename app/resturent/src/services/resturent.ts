type AddressDetails = {
    addressLine1: string;
    addressLine2: string;
    city: string;
    stateProvince: string;
    postalCode: string;
};

type BasicDetails = {
    name: string;
    email: string;
    number: string;
    address?: AddressDetails
};



function createUser(basicDetails:BasicDetails) {
    
}