# cinema-tickets

>Cinema ticket booking system

This is a javascript cinema tickets purchase service that perform required operations that are provided as per the assignment.

The changes are made in the below files:

1. [src/pairtest/TicketService.js](src/pairtest/TicketService.js) - modified to hold validation and perform ticket purchase request
2. [src/pairtest/lib/InvalidPurchaseException.js](src/pairtest/lib/InvalidPurchaseException.js) - modified to handle exception providing appropriate message
3. [test/TicketService.test.js](test/TicketService.test.js) - jest test suite: handles all unit test cases

The objective is achieved by performing the below steps:

Validations carried out:

1. The first step is to validate the `accountId` of the user, if the `accountId` is greater than zero then it is considered as a valid account else it is an invalid id (checks for a non-negative integer).

2. The purchase tickets request can only be made by an adult i.e., at least one adult should be present in the request made for purchasing the tickets, therefore the purchase request is validated to check if at least one adult is present when the request for purchasing tickets is made.

3. The third step is to check for a valid ticket count. Only non-negative integer greater than or equal to zero can be provided for individual ticket type. The maximum number of tickets that can be bought per request is 20. Therefore a validation check is made to ensure a maximum of 20 tickets is requested per purchase request.

The exceptions are thrown for any of the invalid purchase ticket request cases mentioned above. The `InvalidPurchaseException` is thrown with an appropriate message for all three invalid cases.

Service calls after the validations:

4. If the purchase request is valid upon checking the above three validations, the total amount to pay for the requested tickets is calcualted and the `TicketPaymentService` is called with the `accountId` and the `totalAmountToPay`.

5. After the payment service is called, the seats are reserved by calling `SeatReservationService` with `accountId` and `totalSeatsToAllocate` to allocate by calculating the total seats that are required for the purchase.

---

## *How to run*
---

>Pre-requisites to execute the program:
Install the latest version of Node.js from the link - https://nodejs.org/en/download/

**Step 1:** Clone the repository using the link - https://github.com/JaKi07/cinema-tickets-javascript.git

**Step 2:** Navigate to `/cinema-tickets-javascript` and execute `npm install`.

**Step 3:** After the necessary packages are downloaded, navigate to `/cinema-tickets/src/pairtest` and execute `node ./TicketService.js` to run TicketService.

**Step 4:** To execute the test suite, run `npm test`.