const express = require("express");
const { connectDB } = require("./db");

const app = express();

app.use(express.json());
app.use((_req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  next();
});

app.use("/api/books", require("./routes/books"));
app.use("/api/users", require("./routes/users"));

module.exports = {
  listen: (port) => {
    app.listen(port, async () => {
      console.log(`Library app listening on port ${port}`);
      await connectDB();
    });
  },
};
