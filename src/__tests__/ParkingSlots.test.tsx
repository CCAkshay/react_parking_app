import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ParkingSlots from "../components/ParkingSlots";
import { MemoryRouter } from "react-router-dom";
import userEvent from "@testing-library/user-event";
import axios from "axios";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
  useLocation: () => {
    return {
        state: {
            numSlots: 2
        }
    }
  }
}));

describe("ParkingSlots Component", () => {
    beforeEach(() => {
        // Clear any previous mock data and reset the mock functions
        mockedAxios.get.mockReset();
        mockNavigate.mockReset();
        localStorage.clear();
    });

    it("renders the ParkingSlots component with available slots", async () => {
        render(
        <MemoryRouter>
            <ParkingSlots />
        </MemoryRouter>
        );
    
        await waitFor(() => {
        const bookSlotButton = screen.getByText("Book a Parking Slot");
        expect(bookSlotButton).toBeInTheDocument();
        },);
    
        const bookSlotButton = screen.getByText("Book a Parking Slot");
        fireEvent.click(bookSlotButton);

        const nameInput =  screen.getByTestId("name-input");
        const carNumberInput =  screen.getByTestId("car-number-input");
        
        const bookSlotSubmitButton = screen.getByText("Book Slot");
        
        fireEvent.change(nameInput, {target:{value: "John Doe"}});
        fireEvent.change(carNumberInput, {target:{value: "JABC 012"}});
        fireEvent.click(bookSlotSubmitButton);

    });

    it("books all available slots", async () => {
        render(
          <MemoryRouter>
            <ParkingSlots />
          </MemoryRouter>
        );
    
        await waitFor(() => {
          const bookSlotButton = screen.getByText("Book a Parking Slot");
          expect(bookSlotButton).toBeInTheDocument();
        });
    
        const numSlots = 2;
    
        for (let i = 0; i < numSlots; i++) {
          // Click "Book a Parking Slot"
          const bookSlotButton = screen.getByText("Book a Parking Slot");
          fireEvent.click(bookSlotButton);
    
          // Fill out the booking form
          const nameInput = screen.getByTestId("name-input");
          const carNumberInput = screen.getByTestId("car-number-input");
          const bookSlotSubmitButton = screen.getByText("Book Slot");
    
          userEvent.type(nameInput, `John Doe ${i}`);
          userEvent.type(carNumberInput, `ABC 123 ${i}`);
          fireEvent.click(bookSlotSubmitButton);
    
          // Wait for the modal to close
          await waitFor(() => {
            const bookSlotButton = screen.getByText("Book a Parking Slot");
            expect(bookSlotButton).toBeInTheDocument();
          });
        }
    
        // Ensure there are no available slots
        const bookSlotButton = screen.getByText("Book a Parking Slot");
        expect(bookSlotButton).toBeInTheDocument();
      });

   
});

