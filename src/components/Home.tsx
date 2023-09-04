import React, { useEffect, useState } from "react";
import { Container, TextField, Button, Typography, InputLabel } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Home: React.FC = () => {
    const [numSlots, setNumSlots] = useState<number | null>(null);
    const navigate = useNavigate();

    const handleFormSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        if (numSlots !== null && numSlots > 0) {
            navigate(`/parking-slots`, { state: { numSlots } });
        }
    };

    useEffect(() => {
        window.localStorage.clear();
    }, []);

    return (
        <Container>
        <div
            style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            marginTop: "100px",
            }}
        >
            <Typography variant="h5">Create Parking Slots</Typography>
            <form
            onSubmit={handleFormSubmit}
            style={{ display: "flex", alignItems: "center", marginTop: "20px" }}
            >
            <InputLabel htmlFor="numSlots">Number of Slots</InputLabel>
            <TextField
                type="number"
                id="numSlots"
                value={numSlots}
                onChange={(e) => {
                setNumSlots(parseInt(e.target.value));
                }}
                inputMode="numeric"
                required
            />
            <Button
                type="submit"
                variant="contained"
                color="primary"
                style={{ marginLeft: "10px" }}
            >
                Create
            </Button>
            </form>
        </div>
        </Container>
    );
};

export default Home;
