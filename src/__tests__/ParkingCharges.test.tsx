import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ParkingCharges from "../components/ParkingCharges";
import { MemoryRouter, Route } from "react-router-dom";
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
        bookingInfo: {
          name: "John Doe",
          carNumber: "ABC 123",
          startTime: new Date().getTime(),
        },
      },
    };
  },
}));

describe("ParkingCharges Component", () => {
  beforeEach(() => {
    mockedAxios.post.mockReset();
    mockNavigate.mockReset();
    localStorage.clear();
  });

  it("renders the ParkingCharges component with calculated charges", async () => {
    mockedAxios.post.mockResolvedValueOnce({
        data: {
          code: 200,
        },
      });
    render(
      <MemoryRouter>
          <ParkingCharges />
      </MemoryRouter>
    );

    await waitFor(() => {
      const parkingChargesTitle = screen.getByText("Parking Charges for Slot");
      expect(parkingChargesTitle).toBeInTheDocument();
    });

    const takePaymentButton = screen.getByText("Take Payment");
    fireEvent.click(takePaymentButton);
  

  });

  it("renders the ParkingCharges component with calculated charges", async () => {
    mockedAxios.post.mockRejectedValueOnce({
        data: {
          code: 200,
        },
      });
    render(
      <MemoryRouter>
          <ParkingCharges />
      </MemoryRouter>
    );

    await waitFor(() => {
      const parkingChargesTitle = screen.getByText("Parking Charges for Slot");
      expect(parkingChargesTitle).toBeInTheDocument();
    });

    const takePaymentButton = screen.getByText("Take Payment");
    fireEvent.click(takePaymentButton);
  

  });

  it("renders the ParkingCharges component with wrong axios response", async () => {
    mockedAxios.post.mockResolvedValueOnce({
        data: {
          code: 401,
        },
      });
    render(
      <MemoryRouter>
          <ParkingCharges />
      </MemoryRouter>
    );

    await waitFor(() => {
      const parkingChargesTitle = screen.getByText("Parking Charges for Slot");
      expect(parkingChargesTitle).toBeInTheDocument();
    });

    const takePaymentButton = screen.getByText("Take Payment");
    fireEvent.click(takePaymentButton);
  });

  it('renders the ParkingCharges component with calculated charges', async () => {

    mockedAxios.post.mockResolvedValueOnce({
        data: {
          code: 200,
        },
      });

    render(
      <MemoryRouter>
        <ParkingCharges />
      </MemoryRouter>
    );

    await waitFor(() => {
      const parkingChargesTitle = screen.getByText('Parking Charges for Slot');
      expect(parkingChargesTitle).toBeInTheDocument();
    });

    const takePaymentButton = screen.getByText('Take Payment');
    setTimeout(() => {
        fireEvent.click(takePaymentButton);
      }, 12000);
  });

  it('renders the ParkingCharges component with calculated charges (Test 1)', async () => {
    // Mock a startTime that's more than 10 seconds ago
    const currentTime = new Date().getTime();
    const tenSecondsAgo = currentTime - 11 * 1000; // 11 seconds ago
    mockedAxios.post.mockResolvedValueOnce({
      data: {
        code: 200,
      },
    });
  
    jest.spyOn(require('react-router-dom'), 'useLocation').mockImplementationOnce(() => ({
      state: {
        bookingInfo: {
          name: 'John Doe',
          carNumber: 'ABC 123',
          startTime: tenSecondsAgo, // Use the past time
        },
      },
    }));
  
    render(
      <MemoryRouter>
        <ParkingCharges />
      </MemoryRouter>
    );
  
    await waitFor(() => {
      const parkingChargesTitle = screen.getByText('Parking Charges for Slot');
      expect(parkingChargesTitle).toBeInTheDocument();
    });
  
    const takePaymentButton = screen.getByText('Take Payment');
    setTimeout(() => {
      fireEvent.click(takePaymentButton);
    }, 12000);
  });
  
});
