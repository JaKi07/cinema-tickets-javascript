import { jest } from "@jest/globals";
import TicketService from "../src/pairtest/TicketService.js";
import TicketTypeRequest from "../src/pairtest/lib/TicketTypeRequest.js";
import InvalidPurchaseException from "../src/pairtest/lib/InvalidPurchaseException.js";
import TicketPaymentService from "../src/thirdparty/paymentgateway/TicketPaymentService.js";
import SeatReservationService from "../src/thirdparty/seatbooking/SeatReservationService.js";
import { adultType, childType, infantType } from "../src/pairtest/constants.js";

describe("Unit tests for ticket service", () => {
  const ticketService = new TicketService();
  let ticketRequestAdult;
  let ticketRequestInfant;
  let ticketRequestChild;
  let ticketRequestAdultNegative;
  const logSpy = jest.spyOn(console, "log");

  beforeEach(() => {
    ticketRequestAdult = new TicketTypeRequest(adultType, 5);
    ticketRequestInfant = new TicketTypeRequest(infantType, 6);
    ticketRequestChild = new TicketTypeRequest(childType, 8);
    ticketRequestAdultNegative = new TicketTypeRequest(adultType, -2);
  });

  it("Should be a valid account ID", () => {
    const t0 = () => {
      ticketService.purchaseTickets(
        "x",
        ticketRequestAdult,
        ticketRequestChild
      );
    };
    expect(t0).toThrow(InvalidPurchaseException);
    expect(t0).toThrow(
      "x is not a valid Account Id, it should be an integer greater than 0"
    );

    const t1 = () => {
      ticketService.purchaseTickets(
        "0",
        ticketRequestAdult,
        ticketRequestChild
      );
    };
    expect(t1).toThrow(InvalidPurchaseException);
    expect(t1).toThrow(
      "0 is not a valid Account Id, it should be an integer greater than 0"
    );

    ticketService.purchaseTickets(5, ticketRequestAdult, ticketRequestChild);
    expect(logSpy).toHaveBeenCalledWith("Ticket created successfully");
  });

  it("Should include an Adult when purchasing tickets", () => {
    const t0 = () => {
      ticketService.purchaseTickets(5, ticketRequestChild);
    };
    expect(t0).toThrow(InvalidPurchaseException);
    expect(t0).toThrow("Only an adult can purchase the tickets");

    const t1 = () => {
      ticketService.purchaseTickets(
        10,
        ticketRequestInfant,
        ticketRequestChild
      );
    };
    expect(t1).toThrow(InvalidPurchaseException);
    expect(t1).toThrow("Only an adult can purchase the tickets");

    ticketService.purchaseTickets(5, ticketRequestAdult);
    expect(logSpy).toHaveBeenCalledWith("Ticket created successfully");
  });

  it("Should allow only a maximum purchase of 20 tickets per request", () => {
    const t0 = () => {
      ticketService.purchaseTickets(
        5,
        ticketRequestAdult,
        ticketRequestChild,
        ticketRequestInfant,
        ticketRequestChild
      );
    };
    expect(t0).toThrow(InvalidPurchaseException);
    expect(t0).toThrow("Maximum ticket purchase limit is 20 per request");

    ticketService.purchaseTickets(5, ticketRequestAdult);
    expect(logSpy).toHaveBeenCalledWith("Ticket created successfully");
  });

  it("Should allow only zero or more tickets per request", () => {
    const t0 = () => {
      ticketService.purchaseTickets(
        5,
        ticketRequestAdultNegative,
        ticketRequestChild,
        ticketRequestInfant,
        ticketRequestChild
      );
    };
    expect(t0).toThrow(InvalidPurchaseException);
    expect(t0).toThrow("Ticket count can only be zero or greater");

    ticketService.purchaseTickets(5, ticketRequestAdult);
    expect(logSpy).toHaveBeenCalledWith("Ticket created successfully");
  });

  it("Should compute total amount and call payment service", () => {
    const makePayment = jest
      .spyOn(TicketPaymentService.prototype, "makePayment")
      .mockImplementation(() => {
        console.log("mocked function");
      });
    ticketService.purchaseTickets(
      5,
      ticketRequestAdult,
      ticketRequestChild,
      ticketRequestInfant
    );
    expect(makePayment).toHaveBeenCalledWith(5, 180);
    expect(logSpy).toHaveBeenCalledWith(
      "Total amount paid for the tickets 180"
    );
    expect(logSpy).toHaveBeenCalledWith("Ticket created successfully");
  });

  it("Should compute total seats and call reserve seat", () => {
    const reserveSeat = jest
      .spyOn(SeatReservationService.prototype, "reserveSeat")
      .mockImplementation(() => {
        console.log("mocked function");
      });
    ticketService.purchaseTickets(
      5,
      ticketRequestAdult,
      ticketRequestChild,
      ticketRequestInfant
    );
    expect(reserveSeat).toHaveBeenCalledWith(5, 13);
    expect(logSpy).toHaveBeenCalledWith("Total seats reserved 13");
    expect(logSpy).toHaveBeenCalledWith("Ticket created successfully");
  });
});
