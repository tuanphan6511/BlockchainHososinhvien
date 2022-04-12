/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Contract } = require('fabric-contract-api');

class AGUStudent extends Contract {

    async initLedger(ctx) {
        console.info('============= START : Initialize Ledger ===========');
        const sinhvien = [
            {
            	mssv:'DTH185417',
                hoten: 'Phan Ngọc Tuấn',
                ngaysinh: '04/02/2000',
                email: 'pntuan_19th1@student.agu.edu.vn',
                cmnd:'352557777',
                sdt:'0976636511',
                gioitinh:'Nam',
                tenkhoa:'Công Nghê Thông Tin',
                tennganh:'Công Nghê Thông Tin',
	            tenlop:'DH19TH1',
	            noisinh:'An Giang',
                diachithuongtru:'Châu Thành-An Giang',
                diachitamtru:'Châu Thành-An Giang',

                tentruong:'Đại học An Giang',
                thoigian:'2018-2022',
                chuyennganh:'CNTT',
                bangcap:'',

                tenchungchi:'A2',
                ngaycap:'01/01/2022',
                xeploai:'',

                stc_tichluy:'100',
                diemhe10:'8.0',
                diemhe4:'3.0',
                
                thanhtichnoibat:'',
                diemrenluyen:'80',
                matruycap:'',
            },
            {
            	mssv:'DTH185418',
                hoten: 'Nguyễn Văn A',
                ngaysinh: '02/12/2000',
                email: 'nva_19th1@student.agu.edu.vn',
                cmnd:'352558888',
                sdt:'0976636522',
                gioitinh:'Nam',
                tenkhoa:'Công Nghê Thông Tin',
                tennganh:'Công Nghê Thông Tin',
	            tenlop:'DH19TH2',
	            noisinh:'An Giang',
                diachithuongtru:'Châu Thành-An Giang',
                diachitamtru:'Châu Thành-An Giang',

                tentruong:'Đại học An Giang',
                thoigian:'2018-2022',
                chuyennganh:'CNTT',
                bangcap:'',

                tenchungchi:'A2',
                ngaycap:'22/22/2022',
                xeploai:'',

                stc_tichluy:'150',
                diemhe10:'7.0',
                diemhe4:'2.0',
                
                thanhtichnoibat:'',
                diemrenluyen:'68',
                matruycap:'',
            },
            {
            	mssv:'DTH185419',
                hoten: 'Lê Thị B',
                ngaysinh: '11/11/2000',
                email: 'ltb_19th1@student.agu.edu.vn',
                cmnd:'352559999',
                sdt:'0976636544',
                gioitinh:'Nữ',
                tenkhoa:'Công Nghê Thông Tin',
                tennganh:'Công Nghê Thông Tin',
	            tenlop:'DH19PM',
	            noisinh:'An Giang',
                diachithuongtru:'Châu Thành-An Giang',
                diachitamtru:'Châu Thành-An Giang',

                tentruong:'Đại học An Giang',
                thoigian:'2018-2022',
                chuyennganh:'CNTT',
                bangcap:'',

                tenchungchi:'A2',
                ngaycap:'01/01/2022',
                xeploai:'',

                stc_tichluy:'133',
                diemhe10:'8.4',
                diemhe4:'3.1',
                
                thanhtichnoibat:'',
                diemrenluyen:'90',
                matruycap:'',
            },
            
        ];
        
        for (let i = 0; i < sinhvien.length; i++) {
            //sinhvien[i].docType = 'AGU';
            let ma=417
            await ctx.stub.putState('DTH185' +(ma+i), Buffer.from(JSON.stringify(sinhvien[i])));
            ma++;
            console.info('Added <--> ', sinhvien[i]);
        }
        
        console.info('============= END : Initialize Ledger ===========');
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
//lay sinhvien theo truong khac
    async queryStudent2(ctx, mssv) {
        const studentAsBytes = await ctx.stub.getState(mssv); // get the car from chaincode state
        if (!studentAsBytes || studentAsBytes.length === 0) {
            throw new Error(`${mssv} does not exist`);
        }
        console.log(studentAsBytes.toString());
        return studentAsBytes.toString();
    }
//select all student
    async queryAllStudents(ctx) {
        const startKey = '';
        const endKey = '';
        const allResults = [];
        for await (const {key, value} of ctx.stub.getStateByRange(startKey, endKey)) {
            const strValue = Buffer.from(value).toString('utf8');
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
    
 //ceate 1 student (hoten,ngaysinh,quequan,diem)
 //mssv,hoten,ngaysinh,email,sdt,cmnd,gioitinh,tenkhoa,tennganh,tenlop,noisinh,diachithuongtru,diachitamtru,tentruong,thoigian,chuyennganh,bangcap,tenchungchi,ngaycap,xeploai,stc_tichluy,diemhe10,diemhe4,thanhtichnoibat,diemrenluyen,matruycap
    async createStudent(ctx, studentNumber, mssv, hoten, ngaysinh, email, sdt, cmnd, gioitinh, tenkhoa, tennganh, tenlop, noisinh, diachithuongtru, diachitamtru, tentruong, thoigian, chuyennganh, bangcap, tenchungchi, ngaycap, xeploai, stc_tichluy, diemhe10, diemhe4, thanhtichnoibat, diemrenluyen, matruycap) {
        console.info('============= START : Create student ===========');

        const sinhvien = {
            mssv,
            hoten,
            ngaysinh,
            email,
            sdt,
            cmnd,
            gioitinh,
            tenkhoa,
            tennganh,
            tenlop,
            noisinh,
            diachithuongtru,
            diachitamtru,
            tentruong,
            thoigian,
            chuyennganh,
            bangcap,
            tenchungchi,
            ngaycap,
            xeploai,
            stc_tichluy,
            diemhe10,
            diemhe4,
            thanhtichnoibat,
            diemrenluyen,
            matruycap,

        };

        await ctx.stub.putState(studentNumber, Buffer.from(JSON.stringify(sinhvien)));
        console.info('============= END : Create student ===========');
    }
    //Đổi tên
    async changename(ctx, studentNumber, newname) {
        console.info('============= START : changeCarOwner ===========');

        const studentAsBytes = await ctx.stub.getState(studentNumber); // get the car from chaincode state
        if (!studentAsBytes || studentAsBytes.length === 0) {
            throw new Error(`${studentNumber} does not exist`);
        }
        const sinhvien = JSON.parse(studentAsBytes.toString());
        sinhvien.hoten = newname;

        await ctx.stub.putState(studentNumber, Buffer.from(JSON.stringify(sinhvien)));
        console.info('============= END : changeCarOwner ===========');
    }
}

module.exports = AGUStudent;
