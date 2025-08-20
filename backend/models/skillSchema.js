const mongoose = require("mongoose");

const skillSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  createdByAdmin: {
    type: Boolean,
    default: false,
  },
  active: {
    type: Boolean,
    default: true, 
  },
})


module.exports = mongoose.model("Skill", skillSchema);
