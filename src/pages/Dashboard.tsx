// src/pages/Dashboard.tsx
import React, { useEffect, useState,useCallback,useMemo } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

interface Room {
  number: number;
  floor: number;
  isBooked: boolean;
  _id: string;
}

const Dashboard = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [numRooms, setNumRooms] = useState(1);
  const [message, setMessage] = useState('');

const authHeaders = useMemo(() => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem('token')}`
  },
  withCredentials: true
}), []);


const fetchRooms = useCallback(async () => {
  try {
    const res = await axios.get('https://hotel-booking-server-qrno.onrender.com/rooms', authHeaders);
    const data = Array.isArray(res.data?.data) ? res.data.data : [];
    setRooms(data);
    toast.success("Fetched rooms successfully");
  } catch (error) {
    console.error("Failed to fetch rooms:", error);
    toast.error("Failed to fetch rooms");
  }
}, [authHeaders]);

const resetRooms = async () => {
  try {
    const res = await axios.post('https://hotel-booking-server-qrno.onrender.com/rooms/reset', {}, authHeaders);
    if (res.status === 200) {
      toast.success("Rooms reset successfully");
    }
    fetchRooms();
  } catch (err) {
    toast.error("Failed to reset rooms");
  }
};

const randomOccupy = async () => {
  try {
    await axios.post('https://hotel-booking-server-qrno.onrender.com/rooms/random', {}, authHeaders);
    toast.success("Rooms randomly occupied");
    fetchRooms();
  } catch (err) {
    toast.error("Failed to randomly occupy rooms");
  }
};

const bookRooms = async () => {
  try {
    const res = await axios.post('https://hotel-booking-server-qrno.onrender.com/rooms/book', { numRooms }, authHeaders);
    const msg = `Booked Rooms: ${res.data.bookedRooms.map((r: Room) => r.number).join(', ')} | Travel Time: ${res.data.travelTime} mins`;
    setMessage(msg);
    toast.success("Rooms booked successfully");
    fetchRooms();
  } catch (err: any) {
    const errorMsg = err.response?.data?.error || 'Booking failed';
    setMessage(errorMsg);
    toast.error(errorMsg);
  }
};

  useEffect(() => {
    fetchRooms();
  }, [fetchRooms]);

  return (
    <div className="p-8 min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-6">Hotel Room Booking Dashboard</h1>

      <div className="mb-4 flex gap-4">
        <input
          type="number"
          min="1"
          max="5"
          value={numRooms}
          onChange={(e) => setNumRooms(Number(e.target.value))}
          className="border px-4 py-2 rounded w-24"
        />
        <button onClick={bookRooms} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Book</button>
        <button onClick={randomOccupy} className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600">Random Occupancy</button>
        <button onClick={resetRooms} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">Reset</button>
      </div>

      {message && <div className="mb-4 text-green-700 font-semibold">{message}</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 10 }, (_, i) => {
          const floor = i + 1;
          const floorRooms = Array.isArray(rooms) ? rooms.filter(r => r.floor === floor) : [];
          return (
            <div key={floor} className="bg-white p-4 rounded shadow">
              <h3 className="text-xl font-semibold mb-2">Floor {floor}</h3>
              <div className="flex flex-wrap gap-2">
                {floorRooms.map(room => (
                  <span
                    key={room._id}
                    className={`px-3 py-1 rounded text-sm font-medium ${room.isBooked ? 'bg-red-400 text-white' : 'bg-green-300 text-black'}`}
                  >
                    {room.number}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Dashboard;
