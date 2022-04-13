"use strict";

const { Contract } = require("fabric-contract-api");
const shim = require("fabric-shim");
const util = require("util");
class AGUStudent extends Contract {
  async initLedger(ctx) {
    console.info("============= START : Initialize Ledger ===========");
    const sinhvien = [
      {
        //keyid:
        mssv: "DTH185417",
        //thong tin ca nhan
        data: [
          {
            //thong tin co ban
            hoten: "Phan Ngọc Tuấn",
            ngaysinh: "04/02/2000",
            email: "pntuan_19th1@student.agu.edu.vn",
            cmnd: "352557777",
            sdt: "0976636511",
            gioitinh: "Nam",
            noisinh: "An Giang",
            diachi: "Long Xuyên, An Giang",
            ngayvaodoan: "01/01/2022",
            noivaodoan: "An Giang",
            ngayvaodang: "",
            noivaodang: "",

            dien: "Nghèo, Gia đình chính sách", //Hoàn cảnh thuộc diện
            tongiao: "Không",
            dantoc: "Kinh",
            lop: "DH19TH1",
          },
        ],
        thanhtich: [
          {
            thoigian: "01/01/2022",
            thanhtich: "Thành tích 1",
          },
          {
            thoigian: "02/02/2022",
            thanhtich: "Thàn tích 2",
          },
        ],
        diemhoctap: [
          {
            he10: 8,
            he4: 3.4,
          },
        ],
        diemrenluyen: [
          {
            namhoc: "2018-2019",
            hk1: "80",
            hk2: "80",
          },
          {
            namhoc: "2019-2020",
            hk1: "90",
            hk2: "90",
          },
        ],
        giadinh: [
          {
            quanhe: "Cha",
            hoten: "Phan Ngọc A",
            ngaysinh: "01/01/1970",
            diachi: "An Giang",
          },
          {
            quanhe: "Mẹ",
            hoten: "Nguyen Ngọc A",
            ngaysinh: "01/01/1970",
            diachi: "An Giang",
          },
        ],
        vanbanchungchi: [
          {
            ten: "A2",
            ngaycap: "01/01/2022",
            xeploai: "",
          },
          {
            ten: "Tin học",
            ngaycap: "01/01/2022",
            xeploai: "Tốt",
          },
        ],
        quatrinhhoctap: [
          {
            truong: "Trường THPT Nguyễn Bỉnh Khiêm",
            thoigian: "2015-2018",
            nganh: "",
            bang: "Tốt nghiệp THPT",
          },
          {
            truong: "THCS An Châu",
            thoigian: "2012-2015",
            nganh: "",
            bang: "Tốt nghiệp CS",
          },
          {
            truong: "Tiểu học",
            thoigian: "2008-2012",
            nganh: "",
            bang: "Tốt nghiệp TH",
          },
        ],
      },
    ];
    const gethistory = [
      {
        sinhvien: sinhvien,
        txid: "429b9455713c5833e17012fb66f674bf41223155170149ff1044fa0cbb8f156e",
        timestamp: "2022-01-01",
        isdelete: "false",
      },
    ];
    for (let i = 0; i < gethistory.length; i++) {
      //sinhvien[i].docType = 'AGU';
      let ma = 417;
      await ctx.stub.putState(
        "DTH185" + (ma + i),
        Buffer.from(JSON.stringify(gethistory[i]))
      );
      ma++;
      console.info("Added <--> ", gethistory[i]);
    }
    console.info("============= END : Initialize Ledger ===========");
  }
  //select student with id
  async queryStudent(ctx, studentNumber) {
    const studentAsBytes = await ctx.stub.getState(studentNumber); // get the car from chaincode state
    if (!studentAsBytes || studentAsBytes.length === 0) {
      throw new Error(`${studentNumber} does not exist`);
    }
    console.log(studentAsBytes.toString());
    return studentAsBytes.toString();
  }
  //select lichsu với mã TxID sau khi thêm
  async gethistory(ctx, TxID) {
    let iterator = await ctx.stub.getHistoryForKey(TxID);
    let result = [];
    let res = await iterator.next();
    while (!res.done) {
      if (res.value) {
        console.info(
          `found state update with value: ${res.value.value.toString("utf8")}`
        );
        const obj = JSON.parse(res.value.value.toString("utf8"));
        result.push(obj);
      }
      res = await iterator.next();
    }
    await iterator.close();
    return result;
  }
  async gethistory2(ctx, key) {
    const promiseOfIterator = ctx.stub.getHistoryForKey(key);

    const results = [];
    for await (const keyMod of promiseOfIterator) {
      const resp = {
        timestamp: timeConverter(keyMod.timestamp.seconds.low),
        txid: keyMod.txid,
      };
      if (keyMod.isdelete) {
        resp.data = "KEY DELETED";
      } else {
        resp.data = keyMod.value.toString("utf8");
      }
      results.push(resp);
      return results;
    }
  }

  //select all student
  async queryAllStudents(ctx) {
    const startKey = "";
    const endKey = "";
    const allResults = [];
    for await (const { key, value } of ctx.stub.getStateByRange(
      startKey,
      endKey
    )) {
      const strValue = Buffer.from(value).toString("utf8");
      let record;
      try {
        record = JSON.parse(strValue);
      } catch (err) {
        console.log(err);
        record = strValue;
      }
      allResults.push({ Key: key, Record: record });
    }
    console.info(allResults);
    return JSON.stringify(allResults);
  }
  async createStudent(
    ctx,
    mssv,
    data,
    thanhtich,
    diemhoctap,
    diemrenluyen,
    giadinh,
    vanbanchungchi,
    quatrinhhoctap
  ) {
    console.info("============= START : Create student ===========");
    data = JSON.parse(data);
    thanhtich = JSON.parse(thanhtich);
    diemhoctap = JSON.parse(diemhoctap);
    diemrenluyen = JSON.parse(diemrenluyen);
    giadinh = JSON.parse(giadinh);
    vanbanchungchi = JSON.parse(vanbanchungchi);
    quatrinhhoctap = JSON.parse(quatrinhhoctap);
    const sinhvien = {};
    sinhvien["mssv"] = mssv;

    if (!(Object.getOwnPropertyNames(data).length === 0)) {
      sinhvien["data"] = data;
    }
    if (!(Object.getOwnPropertyNames(thanhtich).length === 0)) {
      sinhvien["thanhtich"] = thanhtich;
    }
    if (!(Object.getOwnPropertyNames(diemhoctap).length === 0)) {
      sinhvien["diemhoctap"] = diemhoctap;
    }
    if (!(Object.getOwnPropertyNames(diemrenluyen).length === 0)) {
      sinhvien["diemrenluyen"] = diemrenluyen;
    }
    if (!(Object.getOwnPropertyNames(giadinh).length === 0)) {
      sinhvien["giadinh"] = giadinh;
    }
    if (!(Object.getOwnPropertyNames(vanbanchungchi).length === 0)) {
      sinhvien["vanbanchungchi"] = vanbanchungchi;
    }
    if (!(Object.getOwnPropertyNames(quatrinhhoctap).length === 0)) {
      sinhvien["quatrinhhoctap"] = quatrinhhoctap;
    }
    sinhvien["txid"] = ctx.stub.getTxID();
    //const txid = ctx.stub.getTxID();
    await ctx.stub.putState(mssv, Buffer.from(JSON.stringify(sinhvien)));
    // let indexName = "mssv~txid";

    // let colorNameIndexKey = await ctx.stub.createCompositeKey(indexName, [
    //   sinhvien.mssv,
    //   ctx.stub.getTxID(),
    // ]);
    //await ctx.stub.putState(colorNameIndexKey, Buffer.from("\u0000"));
    return ctx.stub.getTxID();
    //return ctx.GetStub().GetTxID();

    console.info("============= END : Create student ===========");
  }
  //C2 Đưa toàn bộ file Json về object javascript
  async createStudent2(ctx, studentNumber, sinhvien) {
    console.info("============= START : Create student ===========");
    await ctx.stub.putState(
      studentNumber,
      //Buffer.from(JSON.stringify(sinhvien))
      Buffer.from(sinhvien)
    );
    return ctx.stub.getTxID();
    console.info("============= END : Create student ===========");
  }
  //Đổi tên
  async change(
    ctx,
    mssv,
    data,
    thanhtich,
    diemhoctap,
    diemrenluyen,
    giadinh,
    vanbanchungchi,
    quatrinhhoctap
  ) {
    console.info("============= START : changeCarOwner ===========");

    const studentAsBytes = await ctx.stub.getState(mssv); // get the car from chaincode state
    if (!studentAsBytes || studentAsBytes.length === 0) {
      throw new Error(`${mssv} does not exist`);
    }

    data = JSON.parse(data);
    thanhtich = JSON.parse(thanhtich);
    diemhoctap = JSON.parse(diemhoctap);
    diemrenluyen = JSON.parse(diemrenluyen);
    giadinh = JSON.parse(giadinh);
    vanbanchungchi = JSON.parse(vanbanchungchi);
    quatrinhhoctap = JSON.parse(quatrinhhoctap);

    const sinhvien = JSON.parse(studentAsBytes.toString());
    console.info("============= START : changeCarOwner ===========");

    if (!(Object.getOwnPropertyNames(data).length === 0)) {
      sinhvien["data"] = data;
    }
    if (!(Object.getOwnPropertyNames(thanhtich).length === 0)) {
      sinhvien["thanhtich"] = thanhtich;
    }
    if (!(Object.getOwnPropertyNames(diemhoctap).length === 0)) {
      sinhvien["diemhoctap"] = diemhoctap;
    }
    if (!(Object.getOwnPropertyNames(diemrenluyen).length === 0)) {
      sinhvien["diemrenluyen"] = diemrenluyen;
    }
    if (!(Object.getOwnPropertyNames(giadinh).length === 0)) {
      sinhvien["giadinh"] = giadinh;
    }
    if (!(Object.getOwnPropertyNames(vanbanchungchi).length === 0)) {
      sinhvien["vanbanchungchi"] = vanbanchungchi;
    }
    if (!(Object.getOwnPropertyNames(quatrinhhoctap).length === 0)) {
      sinhvien["quatrinhhoctap"] = quatrinhhoctap;
    }
    await ctx.stub.putState(mssv, Buffer.from(JSON.stringify(sinhvien)));
    console.info("============= END : changeCarOwner ===========");
  }
  async deleteid(ctx, studentNumber) {
    await ctx.stub.deleteState(studentNumber);
    console.log("Student Marks deleted from the ledger Succesfully..");
    return ctx.stub.getTxID();
  }
}
function timeConverter(UNIX_timestamp) {
  var a = new Date(UNIX_timestamp * 1000);
  var months = [
    "01",
    "02",
    "03",
    "04",
    "05",
    "06",
    "07",
    "08",
    "09",
    "10",
    "11",
    "12",
  ];
  var year = a.getFullYear();
  var month = months[a.getMonth()];
  var date = a.getDate();
  var hour = a.getHours() < 10 ? "0" + a.getHours() : a.getHours() + 7;
  hour > 24 ? ("0" + (a.getHours() - 24), date + 1) : hour;
  var min = a.getMinutes() < 10 ? "0" + a.getMinutes() : a.getMinutes();
  var sec = a.getSeconds() < 10 ? "0" + a.getSeconds() : a.getSeconds();

  var time =
    date + "/" + month + "/" + year + " " + hour + ":" + min + ":" + sec;
  return time;
}
module.exports = AGUStudent;
