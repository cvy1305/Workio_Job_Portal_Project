import mongoose from "mongoose";

const userSchema = mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  image: { type: String, required: true },
  userType: { 
    type: String, 
    required: true, 
    enum: ['candidate', 'recruiter'],
    default: 'candidate'
  },
  resume: { type: String, default: "" }, // Only for candidates
});

const User = mongoose.model("User", userSchema);

export default User;
