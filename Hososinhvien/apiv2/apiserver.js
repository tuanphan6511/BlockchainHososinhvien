var express = require("express");
const port = 8080;
var app = express();

var bodyParser = require("body-parser");
app.use(bodyParser.json());
const { Gateway, Wallets } = require("fabric-network");

const path = require("path");

const fs = require("fs");

const { request } = require("http");

app.use(express.urlencoded({ extended: true }));

app.use(express.static("public"));

app.use("/css", express.static(__dirname + "public/css"));
app.use("/js", express.static(__dirname + "public/js"));
app.use("/img", express.static(__dirname + "public/img"));
app.use("/vendor", express.static(__dirname + "public/vendor"));
app.set("views", "./views");
app.set("view engine", "ejs");
//app.set("views", "./views/include")
app.get("/api", async (req, res) => {
  // res.status(200).json({
  //   Server: "Welcome to Hyperledger Fabric - Student!",
  // });
  //res.sendFile(__dirname + "/views/index.html");
  try {
    const ccpPath = path.resolve(
      __dirname,
      "..",
      "..",
      "test-network",
      "organizations",
      "peerOrganizations",
      "org1.example.com",
      "connection-org1.json"
    );
    const ccp = JSON.parse(fs.readFileSync(ccpPath, "utf8"));
    const walletPath = path.join(process.cwd(), "wallet");
    const wallet = await Wallets.newFileSystemWallet(walletPath);
    console.log(`Wallet path: ${walletPath}`);
    const identity = await wallet.get("appUser");
    if (!identity) {
      console.log(
        'An identity for the user "appUser" does not exist in the wallet'
      );
      console.log("Run the registerUser.js application before retrying");
      return;
    }
    const gateway = new Gateway();
    await gateway.connect(ccp, {
      wallet,
      identity: "appUser",
      discovery: { enabled: true, asLocalhost: true },
    });
    const network = await gateway.getNetwork("mychannel");
    const contract = network.getContract("Hososinhvien");
    const result = await contract.evaluateTransaction("queryAllStudents");
    console.log(
      `Transaction has been evaluated, result is: ${result.toString()}`
    );
    //console.log(JSON.parse(result)[0]["Record"]);
    // res.status(200).json({
    //   response: JSON.parse(result.toString()),
    // });

    res.render("index", {
      text: "select",
    });
  } catch (error) {
    console.error(`Failed to evaluate transaction: ${error}`);
    res.status(500).json({ error: error });
    //process.exit(1);
    process.on();
  }
});
app.get("/", (req, res) => {
  //res.sendFile(__dirname + "index.html");
  res.render("index", { text: "tttt" });
});

app.get("/selectexample", (req, res) => {
  res.sendFile(__dirname + "/views/test.json");
});
app.get("/api/student/all", async function (req, res) {
  try {
    const ccpPath = path.resolve(
      __dirname,
      "..",
      "..",
      "test-network",
      "organizations",
      "peerOrganizations",
      "org1.example.com",
      "connection-org1.json"
    );
    const ccp = JSON.parse(fs.readFileSync(ccpPath, "utf8"));
    const walletPath = path.join(process.cwd(), "wallet");
    const wallet = await Wallets.newFileSystemWallet(walletPath);
    console.log(`Wallet path: ${walletPath}`);
    const identity = await wallet.get("appUser");
    if (!identity) {
      console.log(
        'An identity for the user "appUser" does not exist in the wallet'
      );
      console.log("Run the registerUser.js application before retrying");
      return;
    }
    const gateway = new Gateway();
    await gateway.connect(ccp, {
      wallet,
      identity: "appUser",
      discovery: { enabled: true, asLocalhost: true },
    });
    const network = await gateway.getNetwork("mychannel");
    const contract = network.getContract("Hososinhvien");
    const result = await contract.evaluateTransaction("queryAllStudents");
    console.log(
      `Transaction has been evaluated, result is: ${result.toString()}`
    );
    console.log(JSON.parse(result)[0]["Record"]);
    res.status(200).json({
      response: JSON.parse(result.toString()),
    });
  } catch (error) {
    console.error(`Failed to evaluate transaction: ${error}`);
    res.status(500).json({ error: error });
    //process.exit(1);
    process.on();
  }
});
app.get("/web/student/all", async function (req, res) {
  try {
    const ccpPath = path.resolve(
      __dirname,
      "..",
      "..",
      "test-network",
      "organizations",
      "peerOrganizations",
      "org1.example.com",
      "connection-org1.json"
    );
    const ccp = JSON.parse(fs.readFileSync(ccpPath, "utf8"));
    const walletPath = path.join(process.cwd(), "wallet");
    const wallet = await Wallets.newFileSystemWallet(walletPath);
    console.log(`Wallet path: ${walletPath}`);
    const identity = await wallet.get("appUser");
    if (!identity) {
      console.log(
        'An identity for the user "appUser" does not exist in the wallet'
      );
      console.log("Run the registerUser.js application before retrying");
      return;
    }
    const gateway = new Gateway();
    await gateway.connect(ccp, {
      wallet,
      identity: "appUser",
      discovery: { enabled: true, asLocalhost: true },
    });
    const network = await gateway.getNetwork("mychannel");
    const contract = network.getContract("Hososinhvien");
    const result = await contract.evaluateTransaction("queryAllStudents");
    console.log(
      `Transaction has been evaluated, result is: ${result.toString()}`
    );
    console.log(JSON.parse(result)[0]["Record"]);
    res.render("selectall", {
      dataUser: JSON.parse(result.toString()),
      text: "select",
    });
  } catch (error) {
    console.error(`Failed to evaluate transaction: ${error}`);
    res.status(500).json({ error: error });
    //process.exit(1);
    process.on();
  }
});
app.get("/api/student/:mssv", async function (req, res) {
  try {
    const ccpPath = path.resolve(
      __dirname,
      "..",
      "..",
      "test-network",
      "organizations",
      "peerOrganizations",
      "org1.example.com",
      "connection-org1.json"
    );
    if (!req.params.mssv) {
      return res.status(404).send({
        message: `missing params in mssv`,
      });
    }
    const ccp = JSON.parse(fs.readFileSync(ccpPath, "utf8"));
    const walletPath = path.join(process.cwd(), "wallet");
    const wallet = await Wallets.newFileSystemWallet(walletPath);
    console.log(`Wallet path: ${walletPath}`);
    const identity = await wallet.get("appUser");
    if (!identity) {
      console.log(
        'An identity for the user "appUser" does not exist in the wallet'
      );
      console.log("Run the registerUser.js application before retrying");
      return;
    }
    const gateway = new Gateway();
    await gateway.connect(ccp, {
      wallet,
      identity: "appUser",
      discovery: { enabled: true, asLocalhost: true },
    });
    const network = await gateway.getNetwork("mychannel");
    const contract = network.getContract("Hososinhvien");
    const result = await contract.evaluateTransaction(
      "queryStudent",
      req.params.mssv
    );
    console.log(
      `Transaction has been evaluated, result is: ${result.toString()}`
    );
    res.status(200).json({
      Key: req.params.mssv,
      response: JSON.parse(result.toString()),
    });
    console.log(JSON.parse(result));
  } catch (error) {
    console.error(`Failed to evaluate transaction: ${error}`);
    res.status(500).json({ error: error });
    process.on();
  }
});
app.get("/api/history/:key", async function (req, res) {
  try {
    const ccpPath = path.resolve(
      __dirname,
      "..",
      "..",
      "test-network",
      "organizations",
      "peerOrganizations",
      "org1.example.com",
      "connection-org1.json"
    );
    if (!req.params.key) {
      return res.status(404).send({
        message: `missing params in url key`,
      });
    }
    const ccp = JSON.parse(fs.readFileSync(ccpPath, "utf8"));
    // Create a new file system based wallet for managing identities.
    const walletPath = path.join(process.cwd(), "wallet");
    const wallet = await Wallets.newFileSystemWallet(walletPath);
    console.log(`Wallet path: ${walletPath}`);

    // Check to see if we've already enrolled the user.
    const identity = await wallet.get("appUser");
    if (!identity) {
      console.log(
        'An identity for the user "appUser" does not exist in the wallet'
      );
      console.log("Run the registerUser.js application before retrying");
      return;
    }
    const gateway = new Gateway();
    await gateway.connect(ccp, {
      wallet,
      identity: "appUser",
      discovery: { enabled: true, asLocalhost: true },
    });
    const network = await gateway.getNetwork("mychannel");
    const contract = network.getContract("Hososinhvien");

    const result = await contract.evaluateTransaction(
      "gethistory",
      req.params.key
    );
    console.log(
      `Transaction has been evaluated, result is: ${result.toString()}`
    );
    res.status(200).json({
      Key: req.params.TxID,
      response: JSON.parse(result),
    });
  } catch (error) {
    console.error(`Failed to evaluate transaction: ${error}`);
    res.status(500).json({ error: error });
    process.on();
  }
});
app.post("/api/student/add", async function (req, res) {
  try {
    const ccpPath = path.resolve(
      __dirname,
      "..",
      "..",
      "test-network",
      "organizations",
      "peerOrganizations",
      "org1.example.com",
      "connection-org1.json"
    );
    if (!req.body.mssv) {
      return res.status(201).send({
        message: `missing params in url mssv`,
      });
    }
    if (!req.body.data) {
      return res.status(404).send({
        message: `missing thong tin sinh vien params data`,
      });
    }

    if (!req.body.thanhtich) {
      req.body.thanhtich = {};
    }
    if (!req.body.diemhoctap) {
      req.body.diemhoctap = {};
    }
    if (!req.body.diemrenluyen) {
      req.body.diemrenluyen = {};
    }
    if (!req.body.giadinh) {
      req.body.giadinh = {};
    }
    if (!req.body.vanbanchungchi) {
      req.body.vanbanchungchi = {};
    }
    if (!req.body.quatrinhhoctap) {
      req.body.quatrinhhoctap = {};
    }
    const ccp = JSON.parse(fs.readFileSync(ccpPath, "utf8"));
    const walletPath = path.join(process.cwd(), "wallet");
    const wallet = await Wallets.newFileSystemWallet(walletPath);
    console.log(`Wallet path: ${walletPath}`);
    const identity = await wallet.get("appUser");
    if (!identity) {
      console.log(
        'An identity for the user "appUser" does not exist in the wallet'
      );
      console.log("Run the registerUser.js application before retrying");
      return;
    }
    const gateway = new Gateway();
    await gateway.connect(ccp, {
      wallet,
      identity: "appUser",
      discovery: { enabled: true, asLocalhost: true },
    });
    const network = await gateway.getNetwork("mychannel");
    const contract = network.getContract("Hososinhvien");
    const result = await contract.submitTransaction(
      "createStudent",
      req.body.mssv,
      JSON.stringify(req.body.data),
      JSON.stringify(req.body.thanhtich),
      JSON.stringify(req.body.diemhoctap),
      JSON.stringify(req.body.diemrenluyen),
      JSON.stringify(req.body.giadinh),
      JSON.stringify(req.body.vanbanchungchi),
      JSON.stringify(req.body.quatrinhhoctap)
    );
    console.log("Transaction has been submitted");
    return res.status(201).send({
      Key: req.body.mssv,
      TxID: result.toString(),

      message: `Create asset ${req.body.mssv} successed`,
    });
    await gateway.disconnect();
  } catch (error) {
    console.error(`Failed to submit transaction: ${error}`);
    return res.status(404).send({
      message: `Failed addstudent API`,
      error: `${error}`,
    });
    process.on();
  }
});
app.put("/api/student/change/", async function (req, res) {
  try {
    const ccpPath = path.resolve(
      __dirname,
      "..",
      "..",
      "test-network",
      "organizations",
      "peerOrganizations",
      "org1.example.com",
      "connection-org1.json"
    );
    if (!req.body.mssv) {
      return res.status(201).send({
        message: `missing params mssv`,
      });
    }
    if (!req.body.data) {
      req.body.data = {};
    }
    if (!req.body.thanhtich) {
      req.body.thanhtich = {};
    }
    if (!req.body.diemhoctap) {
      req.body.diemhoctap = {};
    }
    if (!req.body.diemrenluyen) {
      req.body.diemrenluyen = {};
    }
    if (!req.body.giadinh) {
      req.body.giadinh = {};
    }
    if (!req.body.vanbanchungchi) {
      req.body.vanbanchungchi = {};
    }
    if (!req.body.quatrinhhoctap) {
      req.body.quatrinhhoctap = {};
    }

    const ccp = JSON.parse(fs.readFileSync(ccpPath, "utf8"));
    const walletPath = path.join(process.cwd(), "wallet");
    const wallet = await Wallets.newFileSystemWallet(walletPath);
    console.log(`Wallet path: ${walletPath}`);
    const identity = await wallet.get("appUser");
    if (!identity) {
      console.log(
        'An identity for the user "appUser" does not exist in the wallet'
      );
      console.log("Run the registerUser.js application before retrying");
      return;
    }
    const gateway = new Gateway();
    await gateway.connect(ccp, {
      wallet,
      identity: "appUser",
      discovery: { enabled: true, asLocalhost: true },
    });
    const network = await gateway.getNetwork("mychannel");
    const contract = network.getContract("Hososinhvien");
    console.log("Transaction has been submitted");
    await contract.submitTransaction(
      "change",
      req.body.mssv,
      JSON.stringify(req.body.data),
      JSON.stringify(req.body.thanhtich),
      JSON.stringify(req.body.diemhoctap),
      JSON.stringify(req.body.diemrenluyen),
      JSON.stringify(req.body.giadinh),
      JSON.stringify(req.body.vanbanchungchi),
      JSON.stringify(req.body.quatrinhhoctap)
    );

    console.log("Transaction has been submitted");

    return res.status(201).send({
      message: `Update successed with key: ${req.body.mssv}`,
    });
    await gateway.disconnect();
  } catch (error) {
    console.error(`Failed to submit transaction: ${error}`);
    process.on();
  }
});
app.listen(port, function (err) {
  if (err) console.log(err);
  console.log(
    `Server listening on PORT 8080 \n Wellcome Fabric- I'm elrealy ${port}`
  );
});
