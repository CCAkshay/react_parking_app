import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom';
import {
  Container,
  Card,
  CardContent,
  Typography,
  Button,
  Modal,
  TextField,
} from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css';

interface ParkingChargesParams {
  slotNumber: string;
}

const ParkingCharges: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { slotNumber = '' } = useParams();
    const [formData, setFormData] = useState({ name: '', carNumber: '' });
    const [parkingCharge, setParkingCharge] = useState<number | null>(null);
    const bookingInfo = location.state?.bookingInfo;
    const [bookedSlots, setBookedSlots] = useState<{ slot: number; name: string; carNumber: string }[]>(
        JSON.parse(localStorage.getItem('bookedSlots') || '[]')
    );
    
    const [availableSlots, setAvailableSlots] = useState<number[]>(
        JSON.parse(localStorage.getItem('availableSlots') || '[]')
    );
    
    useEffect(() => {
    
        setFormData({ name: bookingInfo.name, carNumber: bookingInfo.carNumber });
        
}, []);

useEffect(() => {
    if (bookingInfo) {
        const { startTime } = bookingInfo;
        const currentTime = new Date().getTime();
        const elapsedSeconds = Math.floor((currentTime - startTime) / 1000);
        let totalCharge = 0;

        if (elapsedSeconds <= 10) {
            totalCharge = 10;
        } else {
            const additionalSeconds = elapsedSeconds - 10;
            const additionalCharge = Math.ceil(additionalSeconds / 5) * 10;
            totalCharge = 10 + additionalCharge;
        }
        setParkingCharge(totalCharge);
    }
}, [bookingInfo]);

const handlePaymentTaken = () => {
    axios
    .post('https://httpstat.us/200', {
        'car-registration': formData.carNumber,
        "charge": parkingCharge,
    })
    .then((response) => {
        if (response.data.code === 200) {
            const updatedBookedSlots = bookedSlots.filter((booking) => booking.slot !== parseInt(slotNumber));
            const updatedAvailableSlots = [...availableSlots, parseInt(slotNumber)];

            setFormData({ name: '', carNumber: '' });
            setParkingCharge(null);
            setBookedSlots(updatedBookedSlots);
            setAvailableSlots(updatedAvailableSlots);
            localStorage.setItem('bookedSlots', JSON.stringify(updatedBookedSlots));
            localStorage.setItem('availableSlots', JSON.stringify(updatedAvailableSlots));
    
            toast.success(`Payment taken: $${parkingCharge}`);
    
            navigate(-1);
        } else {
        toast.error('Payment failed. Please try again.');
        }
    })
    .catch((error) => {
        toast.error('Payment failed. Please try again.');
    });
};

  return (
    <Container>
        <h1>Parking Charges for Slot {slotNumber}</h1>
        <Card>
            <CardContent>
                <Typography variant="h5">Parking Charges</Typography>
                <Typography variant="body2">Slot Number: {slotNumber}</Typography>
                {formData.name && (
                    <Typography variant="body2">Name: {formData.name}</Typography>
                )}
                {formData.carNumber && (
                    <Typography variant="body2">Car Number: {formData.carNumber}</Typography>
                )}
                <Typography variant="body2">
                    Calculated Charge: ${parkingCharge !== null ? parkingCharge : 'Calculating...'}
                </Typography>
                <Button variant="contained" color="primary" onClick={handlePaymentTaken}>
                    Take Payment
                </Button>
            </CardContent>
        </Card>
        <div style={{ position: 'fixed', top: 0, right: 0, zIndex: 9999 }}>
            <ToastContainer />
        </div>
    </Container>
  );
};

export default ParkingCharges;
