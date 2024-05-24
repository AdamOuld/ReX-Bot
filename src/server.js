const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const axios = require("axios");

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3001",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
    credentials: true,
  },
});

const OPENAI_API_KEY =
  "sk-proj-yZVKPXLqwNSWcIAS0gtgT3BlbkFJED8iEGNofNF2k3OLJOuV";

io.on("connection", (socket) => {
  console.log("User has connected.");

  socket.on("chat-message", async (userMessages) => {
    const systemMessage = {
      role: "system",
      content:
        "You are Rex. You are a career advice assistant. You give advice to the user about his career.",
    };

    let apiMessages = userMessages.map((message) => {
      let role;
      if (message.type === "outgoing") {
        role = "user";
      } else {
        role = "assistant";
      }
      return {
        role: role,
        content: message.text,
      };
    });

    const apiRequestBody = {
      model: "gpt-3.5-turbo",
      messages: [systemMessage, ...apiMessages],
    };

    try {
      const response = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        apiRequestBody,
        {
          headers: {
            Authorization: "Bearer " + OPENAI_API_KEY,
            "Content-Type": "application/json",
          },
        }
      );
      const sendToFront = [
        ...userMessages,
        { text: response.data.choices[0].message.content, type: "incoming" },
      ];
      socket.emit("ai-response", sendToFront);
    } catch (error) {
      if (error.response) {
        console.error(
          "Error contacting OpenAI API:",
          JSON.stringify(error.response.data, null, 2)
        );
      } else {
        console.error("Error contacting OpenAI API:", error.message);
      }
      socket.emit("ai-response", "Error contacting AI service.");
    }
  });
});

server.listen(3000, () => {
  console.log("listening on *:3000");
});
