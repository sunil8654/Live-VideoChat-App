const { Server } = require("socket.io");

const io = new Server(8000, {
  cors: true,
});

const emailToSocketIdMap = new Map();
const socketidToEmailMap = new Map();

io.on("connection", (socket) => {
  console.log(`Socket Connected`, socket.id);

  socket.on("room:join", (data) => {
    const { email, room } = data;
    emailToSocketIdMap.set(email, socket.id);
    socketidToEmailMap.set(socket.id, email);
    io.to(room).emit("user:joined", { email, id: socket.id });
    socket.join(room);
    io.to(socket.id).emit("room:join", data);
  });

  socket.on("user:call", ({ to, offer }) => {
    io.to(to).emit("incoming:call", { from: socket.id, offer });
  });

  socket.on("call:accepted", ({ to, ans }) => {
    io.to(to).emit("call:accepted", { from: socket.id, ans });
  });

  socket.on("peer:nego:needed", ({ to, offer }) => {
    console.log("peer:nego:needed", offer);
    io.to(to).emit("peer:nego:needed", { from: socket.id, offer });
  });

  socket.on("peer:nego:done", ({ to, ans }) => {
    console.log("peer:nego:done", ans);
    io.to(to).emit("peer:nego:final", { from: socket.id, ans });
  });

  // Handling audio-related events
  socket.on("user:audio_call", ({ to, audioOffer }) => {
    io.to(to).emit("incoming:audio_call", { from: socket.id, audioOffer });
  });

  socket.on("audio_call:accepted", ({ to, audioAnswer }) => {
    io.to(to).emit("audio_call:accepted", { from: socket.id, audioAnswer });
  });

  socket.on("audio:nego:needed", ({ to, audioOffer }) => {
    console.log("audio:nego:needed", audioOffer);
    io.to(to).emit("audio:nego:needed", { from: socket.id, audioOffer });
  });

  socket.on("audio:nego:done", ({ to, audioAnswer }) => {
    console.log("audio:nego:done", audioAnswer);
    io.to(to).emit("audio:nego:final", { from: socket.id, audioAnswer });
  });

  // Handle end call event
  socket.on("end:call", ({ to }) => {
    io.to(to).emit("call:ended", { from: socket.id });
  });
});

module.exports = io;
