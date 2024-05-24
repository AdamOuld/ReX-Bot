const jsonServer = require("json-server");
const fs = require("fs");
const path = require("path");
const server = jsonServer.create();
const router = jsonServer.router("data/db.json");
const middlewares = jsonServer.defaults();
const port = process.env.PORT || 3500;

server.use(middlewares);
server.use(jsonServer.bodyParser);

server.post("/save-session", (req, res) => {
  const sessionsFilePath = path.join(__dirname, "data", "sessions.json");

  console.log("Received data:", req.body);

  if (!req.body || typeof req.body !== "object") {
    return res.status(400).send("Invalid session data");
  }

  const newSession = req.body;

  let sessions = [];
  if (fs.existsSync(sessionsFilePath)) {
    const sessionsData = fs.readFileSync(sessionsFilePath, "utf-8");
    sessions = JSON.parse(sessionsData);
  }

  const existingSessionIndex = sessions.findIndex(
    (session) => session.id === newSession.id
  );

  if (existingSessionIndex !== -1) {
    sessions[existingSessionIndex] = newSession;
  } else {
    sessions.push(newSession);
  }

  fs.writeFileSync(sessionsFilePath, JSON.stringify(sessions, null, 2));

  res.status(200).send("Session saved");
});

server.get("/sessions", (req, res) => {
  const sessionsFilePath = path.join(__dirname, "data", "sessions.json");

  // Read sessions from file
  if (fs.existsSync(sessionsFilePath)) {
    const sessionsData = fs.readFileSync(sessionsFilePath, "utf-8");
    const sessions = JSON.parse(sessionsData);
    res.status(200).json(sessions);
  } else {
    res.status(404).send("Sessions not found");
  }
});

// Define endpoint to retrieve session by ID
server.get("/sessions/:id", (req, res) => {
  const sessionId = req.params.id;
  const sessionsFilePath = path.join(__dirname, "data", "sessions.json");

  // Read sessions from file
  if (fs.existsSync(sessionsFilePath)) {
    const sessionsData = fs.readFileSync(sessionsFilePath, "utf-8");
    const sessions = JSON.parse(sessionsData);

    // Find session with matching ID
    const session = sessions.find((session) => session.id === sessionId);
    if (session) {
      res.status(200).json(session);
    } else {
      res.status(404).send("Session not found");
    }
  } else {
    res.status(404).send("Sessions not found");
  }
});

// Define endpoint to end a session by ID
server.post("/end-session", (req, res) => {
  const { id } = req.body;
  const sessionsFilePath = path.join(__dirname, "data", "sessions.json");

  if (!id) {
    return res.status(400).send("Invalid session ID");
  }

  if (fs.existsSync(sessionsFilePath)) {
    const sessionsData = fs.readFileSync(sessionsFilePath, "utf-8");
    const sessions = JSON.parse(sessionsData);

    const sessionIndex = sessions.findIndex((session) => session.id === id);

    if (sessionIndex !== -1) {
      sessions[sessionIndex].isSessionEnded = true;
      fs.writeFileSync(sessionsFilePath, JSON.stringify(sessions, null, 2));
      res.status(200).send("Session ended");
    } else {
      res.status(404).send("Session not found");
    }
  } else {
    res.status(404).send("Sessions not found");
  }
});

server.post("/delete-session", (req, res) => {
  const { id } = req.body;
  const sessionsFilePath = path.join(__dirname, "data", "sessions.json");

  if (!id) {
    return res.status(400).send("Invalid session ID");
  }

  if (fs.existsSync(sessionsFilePath)) {
    const sessionsData = fs.readFileSync(sessionsFilePath, "utf-8");
    const sessions = JSON.parse(sessionsData);

    const sessionIndex = sessions.findIndex((session) => session.id === id);

    if (sessionIndex !== -1) {
      sessions.splice(sessionIndex, 1);
      fs.writeFileSync(sessionsFilePath, JSON.stringify(sessions, null, 2));
      res.status(200).send("Session deleted");
    } else {
      res.status(404).send("Session not found");
    }
  } else {
    res.status(404).send("Sessions not found");
  }
});

server.use(router);

server.listen(port, () => {
  console.log(`JSON Server is running on port ${port}`);
});
