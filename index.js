const express = require("express");
const cors = require("cors");
const app = express();

//PORT
const port = process.env.PORT || 5000;

//Middleware
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Ema-John node server running.");
});

app.listen(port, () => {
  console.log("Server running to the port ", port);
});
