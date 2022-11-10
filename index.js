const express = require("express");
const cors = require("cors");
const mongodb = require("mongodb");
const mongoclient = mongodb.MongoClient;
const app = express();
const dotenv = require("dotenv").config();
const URL = process.env.DB;
const bcrypt = require('bcrypt');

app.use(
  cors({
    orgin: "https://roaring-druid-e5075c.netlify.app", //"http://localhost:3000/",
  })
);

app.use(express.json());

let products = [];

app.post("/user/register", async (req, res) => {
  try {
    //connect the Database
    const connection = await mongoclient.connect(URL);

    //select the DB
    const db = connection.db("B39WDT2");

    //Hash the password
    var salt = await bcrypt.genSalt(10);
    var hash = await bcrypt.hash(req.body.password,salt)
    //Select the Collection

    //select the Collection
    //Do operation (CRUD)
    const user = await db.collection("users").insertOne(req.body);
    console.log(user);
    //close the connection
    await connection.close();
    res.json({ message: "users created"});
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
});


//create
app.post("/product", async (req, res) => {
  try {
    //connect the Database
    const connection = await mongoclient.connect(URL);

    //select the DB
    const db = connection.db("B39WDT2");

    //select the Collection
    //Do operation (CRUD)
    const product = await db.collection("products").insertOne(req.body);

    //close the connection
    await connection.close();
    res.json({ message: "Product created", id: product.insertedId });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }

  //   req.body.id = products.length + 1;
  //   products.push(req.body);
  //   res.json({ message: "product addded", id: products.length });
});

//read
app.get("/products", async (req, res) => {
  try {
    //connect the Database
    const connection = await mongoclient.connect(URL);

    //select the DB
    const db = connection.db("B39WDT2");

    //select the Collection
    //Do operation (CRUD)
    const product = await db.collection("products").find({}).toArray();

    //close the connection
    await connection.close();

    res.json(product);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
});

//update
//URL Parameter
app.put("/product/:productId", async (req, res) => {
  try {
    //connect the Database
    const connection = await mongoclient.connect(URL);

    //select the DB
    const db = connection.db("B39WDT2");

    const productData = await db
      .collection("products")
      .findOne({ _id: mongodb.ObjectId(req.params.productId) });

    if (productData) {
      //select the Collection
      //Do operation (CRUD)
      delete req.body._id
      const product = await db
        .collection("products")
        .updateOne(
          { _id: mongodb.ObjectId(req.params.productId) },
          { $set: req.body }
        );

      //close the connection
      await connection.close();

      res.json(product);
    } else {
      res.status(404).json({ message: "Product Not Found" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }

  // const productId = req.params.productId; //id = URL id
  // const productIndex = products.findIndex((prod) => prod.id == productId);

  // if (productIndex != -1) {
  //   const keys = Object.keys(req.body);

  //   keys.forEach((key) => {
  //     products[productIndex][key] = req.body[key];
  //   });

  //   // console.log(productId);
  //   // console.log(req.body);
  //   res.json({ message: "Done" });
  // } else {
  //   res.status(404).json({ message: "Product not found" });
  // }
});

//delete
app.delete("/product/:productId", async (req, res) => {
  try {
    //connect the Database
    const connection = await mongoclient.connect(URL);

    //select the DB
    const db = connection.db("B39WDT2");

    const productData = await db
      .collection("products")
      .findOne({ _id: mongodb.ObjectId(req.params.productId) });

    if (productData) {
      //select the Collection
      //Do operation (CRUD)
      const product = await db
        .collection("products")
        .deleteOne({ _id: mongodb.ObjectId(req.params.productId) });
      //close the connection
      await connection.close();
      res.json(product);
    } else {
      res.status(404).json({ message: "Product Not Found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }

  // const productId = req.params.productId;
  // const productIndex = products.findIndex((prod) => prod.id == productId);
  // if (productIndex != -1) {
  //   products.splice(productIndex, 1);
  //   res.json({ message: "Deleted" });
  // } else {
  //   res.status(404).json({ message: "Product not found" });
  // }
});

app.get("/product/:productId", async (req, res) => {
  try {
    //connect the Database
    const connection = await mongoclient.connect(URL);

    //select the DB
    const db = connection.db("B39WDT2");

    //select the Collection
    //Do operation (CRUD)
    const productData = await db
      .collection("products")
      .findOne({ _id: mongodb.ObjectId(req.params.productId) });

    //close the connection
    await connection.close();

    if (productData) {
      res.json(productData);
    } else {
      res.status(404).json({ message: "Product Not Found" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
  // const productId = req.params.productId;
  // const productIndex = products.findIndex((prod) => prod.id == productId);
  // if (productIndex != -1) {
  //   res.json(products[productIndex]);
  // } else {
  //   res.status(404).json({ message: "Product not found" });
  // }
});

app.listen(process.env.PORT || 3003);
