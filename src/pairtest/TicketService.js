import TicketTypeRequest from "./lib/TicketTypeRequest.js";
import InvalidPurchaseException from "./lib/InvalidPurchaseException.js";
import TicketPaymentService from "../thirdparty/paymentgateway/TicketPaymentService.js";
import SeatReservationService from "../thirdparty/seatbooking/SeatReservationService.js";
import { ticketPrice, allocateSeat, infantType, childType, 
         adultType, maximumTicketCount, minimumTicketCountThreshold } from "./constants.js";

export default class TicketService {
  // If the account id is a non-negative integer greater than zero, then it is a valid account id
  #isValidAccountId(accountId) {
    if (!Number.isInteger(accountId) || accountId <= 0) {
      throw new InvalidPurchaseException(
        `${accountId} is not a valid Account Id, it should be an integer greater than 0`
      );
    }
  }

  // If the ticket purchase request have at least one adult, then it is a valid purchase request
  #includesAdult(...ticketTypeRequests) {
    let adultFound = false;
    for (const ttr of ticketTypeRequests) {
      if (ttr.getTicketType() == adultType) {
        adultFound = true;
        break;
      }
    }
    if (!adultFound) {
      throw new InvalidPurchaseException(
        `Only an adult can purchase the tickets`
      );
    }
  }

  // a maximum of 20 tickets per ticket purchase request can be made
  #isValidTicketCount(...ticketTypeRequests) {
    let totalTickets = 0;
    for (const i of ticketTypeRequests) {
      totalTickets += i.getNoOfTickets();
      if (i.getNoOfTickets() < minimumTicketCountThreshold) {
        throw new InvalidPurchaseException(
          `Ticket count can only be zero or greater`
        );
      }
      if (totalTickets > maximumTicketCount) {
        throw new InvalidPurchaseException(
          `Maximum ticket purchase limit is 20 per request`
        );
      }
    }
  }

  // if the ticket purchase request is valid then compute total amount to pay and call ticket payment service
  #calculateTotalAmountAndPay(accountId, ...ticketTypeRequests) {
    let totalAmount = 0;
    for (const ttr of ticketTypeRequests) {
      totalAmount += ttr.getNoOfTickets() * ticketPrice[ttr.getTicketType()];
    }
    const ticketPayment = new TicketPaymentService();
    ticketPayment.makePayment(accountId, totalAmount);
    console.log(`Total amount paid for the tickets ${totalAmount}`);
  }

  // After the ticket payment is made, calcualte seats to reserve and call seat reservation service
  #calculateSeatsAndReserve(accountId, ...ticketTypeRequests) {
    let totalSeats = 0;
    for (const ttr of ticketTypeRequests) {
      totalSeats += ttr.getNoOfTickets() * allocateSeat[ttr.getTicketType()];
    }
    const seatReservation = new SeatReservationService();
    seatReservation.reserveSeat(accountId, totalSeats);
    console.log(`Total seats reserved ${totalSeats}`);
  }

  // purchase tickets will verify validity of the purchase request and then creates the tickets upon successful validation
  purchaseTickets(accountId, ...ticketTypeRequests) {
    this.#isValidAccountId(accountId);
    this.#includesAdult(...ticketTypeRequests);
    this.#isValidTicketCount(...ticketTypeRequests);
    this.#calculateTotalAmountAndPay(accountId, ...ticketTypeRequests);
    this.#calculateSeatsAndReserve(accountId, ...ticketTypeRequests);
    console.log("Ticket created successfully");
  }
}

// test code to call purchase tickets request, a separate test-suite is also written to do this
const requestTicket = new TicketService();
const ttr = new TicketTypeRequest(adultType, 5);
const ttr1 = new TicketTypeRequest(infantType, 7);
const ttr2 = new TicketTypeRequest(childType, 2);

requestTicket.purchaseTickets(3, ttr, ttr1, ttr2);
