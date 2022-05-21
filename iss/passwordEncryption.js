const bcrypt = require('bcrypt');

const hashPassword = async (plainPw) => {
    const salt = await bcrypt.genSalt(12);      //12 is the salt count
    const hash = await bcrypt.hash(plainPw, salt);
       //plain password and salt count without using two function making it simple

    console.log(hash);
}

// hashPassword('Thilak');

const login = async (pwd, hashedPwd) => {
    const matchedPwd = await bcrypt.compare(pwd, hashedPwd);
    if(matchedPwd){
        console.log('Matched');
    }
    else{
        console.log('Not Matched');
    }
}

