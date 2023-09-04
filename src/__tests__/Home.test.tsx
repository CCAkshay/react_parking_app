import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import Home from '../components/Home';

const mockUseNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockUseNavigate,
}));

describe('Home Component', () => {
    it('renders the component', () => {
        render(<Home />, { wrapper: MemoryRouter });
        const heading = screen.getByText('Create Parking Slots');
        
        expect(heading).toBeInTheDocument();
    });

    it("navigates to the correct URL when form is submitted with valid input", () => {
        render(
          <MemoryRouter>
            <Home />
          </MemoryRouter>
        );
    
        const numSlots = 5;
        const inputField = screen.getByLabelText("Number of Slots");
        fireEvent.change(inputField, { target: { value: numSlots.toString() } });
    
        const createButton = screen.getByText("Create");
        fireEvent.click(createButton);
    
        expect(mockUseNavigate).toHaveBeenCalledWith("/parking-slots", {
          state: { numSlots },
        });
      });

      it("does not navigate when numSlots is not valid", () => {
        render(<Home />);
    
        // Simulate entering an invalid numSlots value (e.g., null or <= 0)
        fireEvent.change(screen.getByLabelText("Number of Slots"), {
          target: { value: "0" },
        });
    
        // Simulate form submission
        fireEvent.click(screen.getByText("Create"));
    
        // Ensure that navigate is not called
        expect(mockUseNavigate).not.toHaveBeenCalled();
      });

   });
