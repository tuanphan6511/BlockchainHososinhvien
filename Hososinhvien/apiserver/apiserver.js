var express = require("express");
var bodyParser = require("body-parser");

var app = express();
app.use(bodyParser.json());
const { Gateway, Wallets } = require("fabric-network");
const path = require("path");
const fs = require("fs");
const { request } = require("http");
app.use(express.static("public"));
app.get("/", (req, res) => {
  res.status(200).json({
    Server: "Welcome to Hyperledger Fabric - Student!",
  });
});
app.get("/api", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});
app.get("/test", (req, res) => {
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
      method: `queryallstudents`,
      response: JSON.parse(result.toString()),
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
      return res.status(201).send({
        message: `missing params in url mssv`,
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
      method: "select sinhvien with mssv",
      response: JSON.parse(result.toString()),
    });
    console.log(JSON.parse(result));
  } catch (error) {
    console.error(`Failed to evaluate transaction: ${error}`);
    res.status(500).json({ error: error });
    process.on();
  }
});
app.get("/api/TxID/:TxID", async function (req, res) {
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
    // if (!req.params.TxID || req.params.TxID.length != 64) {
    //   return res.status(201).send({
    //     message: `missing params in url TxID or length <64`,
    //   });
    // }
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
      "gethistory2",
      req.params.TxID
    );
    console.log(
      `Transaction has been evaluated, result is: ${result.toString()}`
    );
    //getHistoryForKey
    res.status(200).json({
      TxID: req.params.TxID,
      response: JSON.parse(result.toString()),
    });
  } catch (error) {
    console.error(`Failed to evaluate transaction: ${error}`);
    res.status(500).json({ error: error });
    //process.exit(1);
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
      success: "true",
      method:
        "add sinhvien(mssv,data[],thanhtich[],diemhoctap[],diemrenluyen[],giadinh[],vanbanchungchi[],quatrinhhoctap[])",
      TxID: result.toString(),
      message: `Create asset ${req.body.mssv} successed`,
      //data: `${JSON.stringify(req.body.data)}`,
    });
    await gateway.disconnect();
  } catch (error) {
    console.error(`Failed to submit transaction: ${error}`);
    return res.status(404).send({
      method:
        "add sinhvien(mssv,data[],thanhtich[],diemhoctap[],diemrenluyen[],giadinh[],vanbanchungchi[],quatrinhhoctap[])",
      success: "false",
      message: `Failed addstudent API`,
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
      message: `Transaction has been submitted`,
    });
    await gateway.disconnect();
  } catch (error) {
    console.error(`Failed to submit transaction: ${error}`);
    process.on();
  }
});
app.listen(8080, function (err) {
  if (err) console.log(err);
  console.log("Server listening on PORT 8080 \n Wellcome Fabric- I'm elrealy");
});

//app.post("/api/add/", async function (req, res) {
//   let myjson = req.body;
//   const obj = JSON.stringify(myjson);

//   try {
//     const ccpPath = path.resolve(
//       __dirname,
//       "..",
//       "..",
//       "test-network",
//       "organizations",
//       "peerOrganizations",
//       "org1.example.com",
//       "connection-org1.json"
//     );
//     const ccp = JSON.parse(fs.readFileSync(ccpPath, "utf8"));

//     // Create a new file system based wallet for managing identities.
//     const walletPath = path.join(process.cwd(), "wallet");
//     const wallet = await Wallets.newFileSystemWallet(walletPath);
//     console.log(`Wallet path: ${walletPath}`);

//     // Check to see if we've already enrolled the user.
//     const identity = await wallet.get("appUser");
//     if (!identity) {
//       console.log(
//         'An identity for the user "appUser" does not exist in the wallet'
//       );
//       console.log("Run the registerUser.js application before retrying");
//       return;
//     }
//     // Create a new gateway for connecting to our peer node.
//     const gateway = new Gateway();
//     await gateway.connect(ccp, {
//       wallet,
//       identity: "appUser",
//       discovery: { enabled: true, asLocalhost: true },
//     });

//     // Get the network (channel) our contract is deployed to.
//     const network = await gateway.getNetwork("mychannel");

//     // Get the contract from the network.
//     const contract = network.getContract("Hososinhvien");
//     // Submit the specified transaction.
//     // createCar transaction - requires 5 argument, ex: ('createCar', 'CAR12', 'Honda', 'Accord', 'Black', 'Tom')
//     // changeCarOwner transaction - requires 2 args , ex: ('changeCarOwner', 'CAR10', 'Dave')
//     const result = await contract.submitTransaction(
//       "createStudent2",
//       req.body.mssv,
//       obj
//     );
//     console.log("Transaction has been submitted");
//     //res.send('Transaction has been submitted'+ "TxID" +result.toString());
//     return res.status(201).send({
//       success: "true",
//       TxID: result.toString(),
//       message: `Create sinhvien ${req.body.mssv} successed`,
//     });
//     // Disconnect from the gateway.
//     await gateway.disconnect();
//   } catch (error) {
//     console.error(`Failed to submit transaction: ${error}`);
//     return res.status(404).send({
//       success: "false",
//       message: `Failed addstudent API`,
//     });
//     //process.exit(1);
//     process.on();
//   }
// });
