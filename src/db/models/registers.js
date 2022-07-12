const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const studentsschema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 3,
  },
  number: {
    type: Number,
    min: 10,
    max: 100000000000,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: [true, "email id already present"],
    Validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error("invalid email");
      }
    },
  },
  password: {
    type: String,
    required: true,
  },
  confirmpassword: {
    type: String,
    required: true,
  },
  tokens: [{
    token: {
      type: String,
      required: true,
    },
}],
});
studentsschema.methods.generateAuthToken = async function () {
  try {
    const token = jwt.sign(
      { _id: this._id.toString()},
      process.env.SECRET_KEY
      
    );
    this.tokens=this.tokens.concat({token:token});
    await this.save()

    return token;
  } catch (err) {
    res.send("the error is" + err);
  }
};
studentsschema.pre("save", async function (next) {
  if (this.isModified("password")) {
    console.log(`ths current password is ${this.password}`);
    this.password = await bcrypt.hash(this.password, 10);
    console.log(`ths current password is ${this.password}`);
    this.confirmpassword = await bcrypt.hash(this.password, 10);

    // this.confirmpassword = undefined;
  }

  next();
});

const Student = new mongoose.model("Student", studentsschema);
module.exports = Student;
