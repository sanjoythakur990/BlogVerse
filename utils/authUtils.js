const isEmailRgex = ({key}) => {
    const isEmail =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/i.test(
        key
      );
    return isEmail;
  };

  function isValidPassword(password) {
    const regex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(password);
  }

const userDataValidation=({name, email ,username, password})=>{
    return new Promise((resolve, reject)=> {
        if(!email || !username || !password) reject("Missing user data")

        if(typeof email !== 'string') reject("Email is not a text")
        if(typeof username !== 'string') reject("Username is not a text")
        if(typeof password !== 'string') reject("Password is not a text")

        if(!isEmailRgex({key: email})) reject("Email format is incorrect")
        // if(!isValidPassword(password)) reject("Password should be alphanumeric(A-Z,a-z,0-9) and it should contain atleast one special character(@,# etc)")

        resolve()
    })
}

module.exports= {userDataValidation}