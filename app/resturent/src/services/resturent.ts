// type AddressDetails = {
//     addressLine1: string;
//     addressLine2: string;
//     city: string;
//     stateProvince: string;
//     postalCode: string;
// };

// type BasicDetails = {
//     name: string;
//     email: string;
//     number: string;
//     address?: AddressDetails
// };


// const CLIENT_ID = "sb-mid_night_crave-b1d9f557trial-dev!t649277";
// const CLIENT_SECRET = "12d65443-e326-4668-a635-46db16593650$3KZCSGwpJYjTeasjhSXW8RAk85OcemtiB5_4pGRZuS8=";

// async function getToken() {
//     const response = await fetch(`/oauth/token`, {
//         method: "POST",
//         headers: {
//             "Content-Type": "application/x-www-form-urlencoded",
//         },
//         body: new URLSearchParams({
//             grant_type: "client_credentials",
//             client_id: CLIENT_ID,
//             client_secret: CLIENT_SECRET,
//         }),
//     });

//     const data = await response.json();
//     return data.access_token;

// }



// async function createAddress(basicDetails: BasicDetails) {
//     const token = await getToken();

//     const response = await fetch(`/odata/v4/catalog/YourEntity`, {
//         headers: {
//             Authorization: `Bearer ${token}`,
//         },
//     });

//     const data = await response.json();
//     console.log(data);
// }

// function createUser(basicDetails: BasicDetails) {
//     const token = await getToken();

//     const response = await fetch(`${APP_URL}/odata/v4/catalog/YourEntity`, {
//         headers: {
//             Authorization: `Bearer ${token}`,
//         },
//     });

//     const data = await response.json();
//     console.log(data);
// }