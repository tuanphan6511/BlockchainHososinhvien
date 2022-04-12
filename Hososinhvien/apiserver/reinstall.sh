rm  -r wallet
cd ../
./startFabric.sh javascript
cd apiserver
node enrollAdmin.js
node registerUser.js
nodemon apiserver.js