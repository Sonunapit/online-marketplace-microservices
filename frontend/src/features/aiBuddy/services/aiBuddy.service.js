import { io } from "socket.io-client";


const socket = io(`Market-ALB-2034128545.ap-south-1.elb.amazonaws.com`, {
  withCredentials: true,
  transports: ["websocket"],
});

socket.on("connect", () => {
  console.log("✅ CONNECTED:", socket.id);
});

socket.on("connect_error", (err) => {
  console.log("❌ CONNECT ERROR:", err.message);
});

export default socket;