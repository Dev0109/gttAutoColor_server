const express = require("express");
const fs = require("fs");
const path = require("path");
const app = express();
const port = 3001;
const cors = require("cors");
const bodyParser = require("body-parser");
const axios = require("axios");
const FormData = require("form-data");
const products = require("./Product_details");

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));

app.post("/api/sendYear", (req, res) => {
  const receiveYear = req.body.year;
  const data = new FormData();
  data.append("year", JSON.parse(receiveYear));

  const config = {
    method: "post",
    url: "https://www.paintscratch.com/content/widgets/color_search/color_search_functions.php",
    data: data,
  };

  axios(config)
    .then(function (response) {
      res.json(response.data);
    })
    .catch(function (error) {
      console.log(error);
      res.status(500).send("Error occurred while fetching data");
    });
});

app.post("/api/sendModel", (req, res) => {
  const receiveVehicle = req.body.make;
  const receiveYear = req.body.year;
  var qs = require("qs");
  var data = qs.stringify({
    year: receiveYear,
    make: receiveVehicle,
  });

  const config = {
    method: "post",
    url: "https://www.paintscratch.com/content/widgets/color_search/color_search_functions.php",
    data: data,
  };

  axios(config)
    .then(function (response) {
      res.json(response.data);
    })
    .catch(function (error) {
      console.log(error);
      res.status(500).send("Error occurred while fetching data");
    });
});

app.post("/api/selectColor", (req, res) => {
  const receiveModel = req.body.model;
  const receiveVehicle = req.body.make;
  const receiveYear = req.body.year;

  var axios = require("axios");
  var qs = require("qs");
  var data = qs.stringify({
    model: receiveModel,
    year: receiveYear,
    make: receiveVehicle,
  });
  var config = {
    method: "post",
    url: "https://www.paintscratch.com/cgi-bin/select-color.cgi",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    data: data,
  };

  axios(config)
    .then(function (response) {
      res.json(response.data);
    })
    .catch(function (error) {
      console.log(error);
      res.status(500).send("Error occurred while fetching data");
    });
});

app.get("/api/vehicle", (req, res) => {
  const data = new FormData();
  data.append("year", "2020");

  const config = {
    method: "post",
    url: "https://www.paintscratch.com/content/widgets/color_search/color_search_functions.php",
    data: data,
  };

  axios(config)
    .then(function (response) {
      res.json(response.data);
    })
    .catch(function (error) {
      console.log(error);
      res.status(500).send("Error occurred while fetching data");
    });
});

app.get("/api/model", (req, res) => {
  const data = new FormData();
  data.append("year", "2020");
  data.append("make", "BMW-Motorcycles");

  const config = {
    method: "post",
    url: "https://www.paintscratch.com/content/widgets/color_search/color_search_functions.php",
    data: data,
  };

  axios(config)
    .then(function (response) {
      res.json(response.data);
    })
    .catch(function (error) {
      console.log(error);
      res.status(500).send("Error occurred while fetching data");
    });
});

app.get("/api/products", (req, res) => {
  res.json(products);
});

app.get("/api/products/id/:id", (req, res) => {
  const product = products.details.find((x) => x.id == req.params.id);
  if (product) {
    res.send(product);
  } else {
    res.status(404).send({ message: "Product Not Found" });
  }
});

app.get("/api/product/car/id/:id", (req, res) => {
  const folderPath = `public/products/product${req.params.id}`;
  console.log(folderPath);
  fs.readdir(folderPath, (err, files) => {
    console.log(err);
    if (err) {
      console.error(err);
      return res.status(200).json({ error: "Failed to read folder contents" });
    }

    // Filter out only the filenames (excluding subdirectories)
    const filenames = files.filter((file) => {
      const filePath = path.join(folderPath, file);
      return fs.statSync(filePath).isFile();
    });
    res.json({ filenames });
  });
});

app.get('api/filenames/id/:id"', (req, res) => {
  console.log(req.params.id);
  const id = products.details.find((x) => x.id == req.params);
  const folderPath = "path/to/folder"; // Specify the path to the folder

  // Read the contents of the folder
  fs.readdir(folderPath, (err, files) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Failed to read folder contents" });
    }

    // Filter out only the filenames (excluding subdirectories)
    const filenames = files.filter((file) => {
      const filePath = path.join(folderPath, file);
      return fs.statSync(filePath).isFile();
    });

    res.json({ filenames });
  });
});

app.get("/*", function (req, res) {
  res.sendFile(path.join(__dirname, "public/index.html"), function (err) {
    if (err) {
      res.status(500).send(err);
    }
  });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
