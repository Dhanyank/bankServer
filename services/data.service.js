//jsonwebtoken import
const jwt = require('jsonwebtoken')

//import db
const db = require('./db')

database = {
  1000: { acno: 1000, uname: "Meera", pwd: 1000, balance: 5000, transaction: [] },
  1001: { acno: 1001, uname: "Seema", pwd: 1001, balance: 3000, transaction: [] },
  1002: { acno: 1002, uname: "Raju", pwd: 1002, balance: 8000, transaction: [] }

}

const register = (uname, acno, pwd) => {
  // asynchronous
  return db.User.findOne({ acno })
    .then(user => {
      console.log(user);
      if (user) {
        // already exist acno
        return {
          statusCode: 401,
          status: false,
          message: "Account number already exist...."
        }
      } else {
        const newUser = new db.User({
          acno,
          uname,
          pwd,
          balance: 0,
          transaction: []

        })
        newUser.save()
        return {
          statusCode: 200,
          status: true,
          message: "Successfully registered please login....."

        }

      }

    })
}

// -----------------------------------------------------------------------------------------
//login

const login = (acno, pswd) => {
  // asynchronous
  return db.User.findOne({ acno, password: pswd })
    .then(user => {
      //console.log(user);
      if (user) {
        currentUser = user.uname
        currentAcno = acno
        // token generation
        const token = jwt.sign({ currentAcno: acno }, 'supersecret123456')

        return {
          statusCode: 200,
          status: true,
          message: "Login successfull.....",
          token,
          currentAcno,
          currentUser
        }
      }
      else {
        return {
          statusCode: 422,
          status: false,
          message: "Invalid Credential...."
        }
      }
    })
}

// -----------------------------------------------------------------------------------
// deposit
const deposit = (acno, pswd, amount) => {
  var amount = parseInt(amount)

  return db.User.findOne({ acno, password: pswd })
    .then(user => {
      if (user) {
        user.balance += amount

        user.transaction.push(
          {
            type: "CREDIT",
            amount: amount
          }
        )
        user.save()
        // console.log(database);

        return {
          statusCode: 200,
          status: true,
          message: `${amount} deposited and new balance is ${user.balance}`
        }
      }
      else {
        return {
          statusCode: 422,
          status: false,
          message: "Invalid Credential...."
        }
      }
    })


}
// ------------------------------------------------------------------------------------------------
// withdraw
const withdraw = (req, acno, pswd, amount) => {
  var amount = parseInt(amount)

  return db.User.findOne({ acno, password: pswd })
    .then(user => {
      if (req.currentAcno != acno) {
        return {
          statusCode: 422,
          status: false,
          message: "Operation denied...."
        }
      }

      if (user) {
        if (user.balance > amount) {
          user.balance -= amount
          user.transaction.push(
            {
              type: "DEBIT",
              amount: amount
            }
          )

          //console.log(database);
          user.save()


          return {
            statusCode: 200,
            status: true,
            message: `${amount} debited and new balance is ${user.balance}`
          }



        } else {

          return {
            statusCode: 422,
            status: false,
            message: "Insufficient balance!!!"
          }

        }

      }
      else {
        return {
          statusCode: 422,
          status: false,
          message: "Invalid Credential...."
        }
      }

    })

}
// ----------------------------------------------------------------------------

//transaction 
const transaction = (acno) => {

  return db.User.findOne({ acno })
    .then(user => {
      if (user) {
        return {
          statusCode: 200,
          status: true,
          transaction: user.transaction
        }

      }
      else {
        return {
          statusCode: 401,
          status: false,
          message: "User does not exist"
        }

      }

    })

}


const deleteAcc=(acno)=>{
  return db.User.deleteOne({acno})
  .then(user=>{
    if(!user){
      return {
        statusCode: 401,
        status: false,
        message: "Operation Failed"
      }

    }
    else{
      return {
        statusCode: 200,
        status: true,
        message: "Account Number "+acno+" deleted successfully.."
      }
    }
  })
}


module.exports = {
  register,
  login,
  deposit,
  withdraw,
  transaction,
  deleteAcc
}
