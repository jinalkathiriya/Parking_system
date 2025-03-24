import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Typography, Box, Stack } from "@mui/material";
import "./checkin.css"; // Import external CSS

const TOTAL_SLOTS = 10;
const API_URL = "http://localhost:3001/bookedSlots"; // ✅ Fixed API URL 
const RATE_PER_HOUR = 10;


const Checkin = () => {
  const [open, setOpen] = useState(false);
  const [bookedSlots, setBookedSlots] = useState([]);
  const [formData, setFormData] = useState({
    userName: "",
    carNumber: "",
    checkInTime: "",
    checkOutTime: "",
    totalHours: 0,
    totalAmount: 0,
  });

    // Fetch booked slots when component mounts
  useEffect(() => {
    fetchBookedSlots();
  }, []);

    // Function to fetch booked slots from API
  const fetchBookedSlots = async () => {
    try {
      const response = await axios.get(API_URL);
      setBookedSlots(response.data);
    } catch (error) {
      console.error("Error fetching booked slots:", error);
    }
  };

    // Function to handle input changes and update form data
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updatedForm = { ...prev, [name]: value };
      if (updatedForm.checkInTime && updatedForm.checkOutTime) {
        calculateTotal(updatedForm);
      }
      return updatedForm;
    });
  };

    // Function to calculate total hours and total amount
  const calculateTotal = (data) => {
    const inTime = new Date(data.checkInTime);
    const outTime = new Date(data.checkOutTime);

    if (outTime > inTime) {
      const hours = Math.ceil((outTime - inTime) / (1000 * 60 * 60));
      setFormData((prev) => ({
        ...prev,
        totalHours: hours,
        totalAmount: hours * RATE_PER_HOUR,
      }));
    }
  };

    // Function to handle check-in and store data
  const handleCheckin = async () => {
    if (bookedSlots.length < TOTAL_SLOTS) {
      try {
        const newSlot = { ...formData, id: Date.now().toString() };
        await axios.post(API_URL, newSlot);
        setBookedSlots([...bookedSlots, newSlot]);
        setOpen(false);
      } catch (error) {
        console.error("Error during check-in:", error);
      }
    } else {
      alert("No parking slots available!");
    }
  };

    // Function to handle slot click and clear booking
  const handleSlotClick = async (index) => {
    const bookedSlot = bookedSlots[index]; // Check if the slot is already booked
  
    if (bookedSlot) {
      try {
        await axios.delete(`${API_URL}/${bookedSlot.id}`);
        setBookedSlots((prev) => prev.filter((s) => s.id !== bookedSlot.id));
      } catch (error) {
        console.error("Error clearing slot:", error);
      }
    } else {
      setOpen(true); // Open check-in modal if the slot is empty
    }
  };
  
  return (
    <Box className="container">
      <Typography variant="h5">Total Hour Rate: {RATE_PER_HOUR} Rupees per Hour</Typography>
      <Box className="slot-info">
        {[{ label: "Total Slots:", value: TOTAL_SLOTS },
          { label: "Allocated Slots:", value: bookedSlots.length },
          { label: "Empty Slots:", value: TOTAL_SLOTS - bookedSlots.length },
        ].map((item, index) => (
          <Box key={index} className="info-box">
            <Typography className="label">{item.label}</Typography>
            <Typography className="value">{item.value}</Typography>
          </Box>
        ))}
      </Box>

      <Button variant="contained" color="primary" onClick={() => setOpen(true)} className="checkin-button">
        Check-in
      </Button>

      <Box className="slot-container">
  {Array.from({ length: TOTAL_SLOTS }, (_, index) => {
    const bookedSlot = bookedSlots.find((slot) => slot.slotIndex === index); // Find slot by index
    return (
      <Box
        key={index}
        className="slot"
        style={{ backgroundColor: bookedSlot ? "var(--secondary-color)" : "var(--primary-color)" }}
        title={bookedSlot ? `Booked by: ${bookedSlot.userName}` : "Available"}
        onClick={() => handleSlotClick(index)}
      >
        {bookedSlot ? "Booked" : "Empty"}
      </Box>
    );
  })}
</Box>


      <Dialog open={open} onClose={() => setOpen(false)} fullWidth>
        <DialogTitle>Check-in Details</DialogTitle>
        <DialogContent>
          <Stack spacing={2} className="dialog-stack">
            <TextField label="User Name" name="userName" variant="outlined" fullWidth onChange={handleChange} />
            <TextField label="Car Number" name="carNumber" variant="outlined" fullWidth onChange={handleChange} />
            <TextField type="datetime-local" label="Check-in Time" name="checkInTime" variant="outlined" fullWidth onChange={handleChange} InputLabelProps={{ shrink: true }} />
            <TextField type="datetime-local" label="Check-out Time" name="checkOutTime" variant="outlined" fullWidth onChange={handleChange} InputLabelProps={{ shrink: true }} />
            <Typography>Total Hours: {formData.totalHours}</Typography>
            <Typography>Total Amount: {formData.totalAmount} Rupees</Typography>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" color="success" onClick={handleCheckin}>Check-in</Button>
          <Button variant="outlined" color="secondary" onClick={() => setOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Checkin;

