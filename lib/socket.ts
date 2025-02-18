import { io } from "socket.io-client";

const socket = io('ws://localhost:3003');

export default socket;
