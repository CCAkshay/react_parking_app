import React, { useEffect, useState } from "react";
import { Container, TextField, Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Home: React.FC = () => {
  const [numSlots, setNumSlots] = useState<number | null>(null);
  const navigate = useNavigate();

  const handleFormSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (numSlots !== null && numSlots > 0) {
      navigate(`/parking-slots/${numSlots}`);
    }
  };

  useEffect(() => {
    // Clear local storage when the Home page component is mounted
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
          <TextField
            type="number"
            label="Number of Slots"
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
