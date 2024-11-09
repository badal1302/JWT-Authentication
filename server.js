const express = require("express");
const jsonwebtoken = require("jsonwebtoken");

const JWT_SECRET = "goK!pusp6ThEdURUtRenOwUhAsWUCLheBazl!uJLPlS8EbreWLdrupIwabRAsiBu";
const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

app.post("/login", (req, res) => {
  const { username, password } = req.body;
  console.log(`${username} is trying to login ..`);

  if (username === "admin" && password === "admin") {
    return res.json({
      token: jsonwebtoken.sign({ user: "admin" }, JWT_SECRET),
    });
  }

  return res
    .status(401)
    .json({ message: "The username and password you provided are invalid" });
});

app.get("/super-secure-resource", (req, res) => {
  if (!req.headers.authorization) {
    return res.status(401).json({ error: "Not Authorized" });
  }

  const authHeader = req.headers.authorization;
  const token = authHeader.split(" ")[1];

  try {
    const { user } = jsonwebtoken.verify(token, JWT_SECRET);
    return res.status(200).json({
      message: `Congrats ${user}! You can now access the super secret resource`,
    });
  } catch (error) {
    return res.status(401).json({ error: "Not Authorized" });
  }
});

app.listen(3001, () => {
  console.log("API running on localhost:3001");
});
