const mongoose = require('mongoose')
const { isEmail } = require('validator')
const bcrypt = require('bcrypt')

const userSchema = new mongoose.Schema({
    email: {
       type: String,
       required: [true,'enter email'],
       unique: true,
       lowercase:true,
       validate: [ isEmail,'Pleade enter a valid email']
    },
    password: {
        type: String,
        required: [true, 'enter password'],
        minlength: [6,'Minimun password length is 6 characters']
    }
})

//fire a function before doc to db

userSchema.pre('save', async function(next){

    const salt = await bcrypt.genSalt()
    this.password = await bcrypt.hash(this.password, salt)
    next()
})

//fire a function after a doc has been saved to db

userSchema.post('save', function (doc, next){

    console.log('new user was created and saved', doc)
    next();
})


// static method to login user
userSchema.statics.login = async function(email, password) {
    
    const user = await this.findOne({ email });
    if (user) {
      const auth = await bcrypt.compare(password, user.password);
      if (auth) {
        return user;
      }
      console.log('123')
      throw Error('incorrect password');
    }
    console.log('345')

    throw Error('incorrect email');
  };


const User = mongoose.model('user', userSchema);
module.exports = User;