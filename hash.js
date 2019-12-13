const bcrypt = require('bcrypt');

async function run(){
    // Here we are generating the salt
    // In genSalt method we have passed 10, it means that algorithm will run 10 times
    // to generate complex salt
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash('1234', salt);
    console.log(salt);
    // hashed will contain the salt and the password in hash form
    console.log(hashed);
}

run();