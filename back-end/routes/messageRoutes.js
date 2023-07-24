import { Server } from 'socket.io';
import { insertMessage } from '../controller/messageControler.js';

const userSocketMap = {};

const messageRoutes = (io) => {
  io.use((socket, next) => {
    const customId = socket.handshake.query.customId;
    if (customId) {
      socket.data.customId = customId;
    }
    next();
  });

  io.on('connection', (socket) => {
    const customId = socket.data.customId;
    if (customId) {
      userSocketMap[customId] = socket.id;
    }

    socket.on("sendMessage", async (data) => {
      const { receiverUserId } = data;

      await insertMessage(customId, receiverUserId, data.message);

      const receiverSocketId = await userSocketMap[receiverUserId];

      if (receiverSocketId) {
        io.to(receiverSocketId).emit("receiveMessage", { message: data.message });
      } else {
        console.log("Message could not be sent");
      }
    });

    socket.on('disconnect', () => {
      console.log("Disconnected")
      const userToRemove = Object.keys(userSocketMap).find(
        (key) => userSocketMap[key] === socket.id
      );
      if (userToRemove) {
        delete userSocketMap[userToRemove];
      }
    });
  });
};

export default messageRoutes;