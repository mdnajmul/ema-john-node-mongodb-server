const express = require("express");
const cors = require("cors");
const { MongoClient } = require("mongodb");
require("dotenv").config();
const app = express();

//PORT
const port = process.env.PORT || 5000;

//Middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.3u7yr.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    await client.connect();

    const database = client.db("online_shop");
    const productCollection = database.collection("products");

    //GET API (Fetch all products from database)
    app.get("/products", async (req, res) => {
      const cursor = productCollection.find({});

      const page = req.query.page;
      const size = parseInt(req.query.size);

      const count = await cursor.count();

      let products;
      if (page) {
        products = await cursor
          .skip(page * size)
          .limit(size)
          .toArray();
      } else {
        products = await cursor.toArray();
      }

      res.send({ count, products });
    });

    //POST API to get data by keys
    app.post("/products/byKeys", async (req, res) => {
      const keys = req.body;
      const query = { key: { $in: keys } };
      const products = await productCollection.find(query).toArray();
      res.json(products);
    });
  } finally {
    //   await client.close();
  }
}

run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Ema-John node server running.");
});

app.listen(port, () => {
  console.log("Server running at port ", port);
});
