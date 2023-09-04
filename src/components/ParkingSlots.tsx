import React, { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import {
  Container,
  Card,
  CardContent,
  Typography,
  Button,
  Modal,
  TextField,
} from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const ParkingSlots: React.FC = () => {
  // const { numSlots } = useParams<{ numSlots?: string }>();
  const location = useLocation();
  const numSlots = location.state?.numSlots;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: "", carNumber: "" });
  const [bookedSlots, setBookedSlots] = useState<
    { slot: number; name: string; carNumber: string }[]
  >([]);
  const [availableSlots, setAvailableSlots] = useState<number[]>([]);

  useEffect(() => {
    const bookedSlotsFromStorage = JSON.parse(
      localStorage.getItem("bookedSlots") || "[]"
    );
    const availableSlotsFromStorage = JSON.parse(
      localStorage.getItem("availableSlots") || JSON.stringify(
        Array.from({ length: parseInt(numSlots!) }, (_, index) => index + 1)
      )
    );
    setBookedSlots(bookedSlotsFromStorage);
    setAvailableSlots(availableSlotsFromStorage);
  }, [numSlots]);

  const handleBookingSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (availableSlots.length === 0) {
      toast.error('Parking slots not available.', { autoClose: 3000 });
      return;
    }
    const randomSlotIndex = Math.floor(Math.random() * availableSlots.length);
    const bookedSlot = availableSlots[randomSlotIndex];
    const newBooking = {
      slot: bookedSlot,
      name: formData.name,
      carNumber: formData.carNumber,
      startTime: new Date().getTime(),
    };
    setBookedSlots([...bookedSlots, newBooking]);
    setAvailableSlots(availableSlots.filter((slot) => slot !== bookedSlot));

    localStorage.setItem("bookedSlots", JSON.stringify([...bookedSlots, newBooking]));
    localStorage.setItem("availableSlots", JSON.stringify(availableSlots.filter((slot) => slot !== bookedSlot)));

    setIsModalOpen(false);
    setFormData({ name: '', carNumber: '' });
  };

  const renderSlots = () => {
    const slots = [];

    for (let i = 1; i <= parseInt(numSlots!); i++) {
      const bookedSlot = bookedSlots.find((booking) => booking.slot === i);
      const slotStyle = {
        marginTop: "10px",
        width: "200px",
        height: "200px",
        borderRadius: "10px",
        border: "1px solid #ccc",
        display: "inline-block",
        marginRight: "10px",
        marginBottom: "10px",
       
      };

      slots.push(
        <Card key={i} style={slotStyle}>
          <CardContent>
            <Typography variant="h5">Slot {i}</Typography>
            {bookedSlot && (
              <div>
                <Typography variant="body2">Booked</Typography>
                <Typography variant="body2">Name: {bookedSlot.name}</Typography>
                <Typography variant="body2">
                  Car Number: {bookedSlot.carNumber}
                </Typography>
                <br/>
                <br/>
                <Link
                  to={`/parking-charges/${i}`}
                  state={{ bookingInfo: bookedSlot }}
                >
                  <Button variant="contained" color="primary">
                    Make payment
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      );
    }

    return slots;
  };

  return (
    <Container>
      <h1>Parking Slots</h1>
      <Button
        variant="contained"
        color="primary"
        onClick={() => {
          if (availableSlots.length === 0) {
            toast.error('Parking slots not available.', { autoClose: 3000 });
          } else {
            setIsModalOpen(true);
          }
        }}
      >
        Book a Parking Slot
      </Button>
      <div>{renderSlots()}</div>
      <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            backgroundColor: "white",
            padding: "20px",
            borderRadius: "10px",
          }}
        >
          <Typography variant="h6">Book a Parking Slot</Typography>
          <form onSubmit={handleBookingSubmit}>
            <TextField
              label="Name"
              inputProps={{"data-testid":"name-input"}}
              
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              fullWidth
              required
              style={{ marginBottom: "10px" }}
            />
            <TextField
              label="Car Number"
              inputProps={{"data-testid":"car-number-input"}}
              value={formData.carNumber}
              onChange={(e) =>
                setFormData({ ...formData, carNumber: e.target.value })
              }
              fullWidth
              required
              style={{ marginBottom: "10px" }}
            />
            <Button type="submit" variant="contained" color="primary">
              Book Slot
            </Button>
          </form>
        </div>
      </Modal>
      <ToastContainer />
    </Container>
  );
};

export default ParkingSlots;
