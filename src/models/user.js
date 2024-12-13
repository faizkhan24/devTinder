const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, 'First name is required'], // Custom error message
      minLength: [4, 'First name must be at least 4 characters'],
      maxLength: [50, 'First name cannot exceed 50 characters'],
      trim: true, // Removes leading/trailing spaces
    },
    lastName: {
      type: String,
      trim: true, // Removes unnecessary spaces
    },
    emailId: {
      type: String,
      lowercase: true, // Converts to lowercase
      required: [true, 'Email is required'],
      unique: true, // Ensures no duplicates in the database
      trim: true, // Removes unnecessary spaces
      validate: {
        validator: (value) => /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value), // Basic email validation
        message: 'Invalid email format',
      },
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minLength: [8, 'Password must be at least 8 characters long'], // Basic password length validation
    },
    age: {
      type: Number,
      min: [18, 'Age must be at least 18'], // Enforce minimum age
      max: [120, 'Age must not exceed 120'], // Reasonable upper limit
      validate: {
        validator: (value) => Number.isInteger(value), // Ensure age is an integer
        message: 'Age must be an integer',
      },
    },
    gender: {
      type: String,
      enum: {
        values: ['male', 'female', 'others'], // Ensures only valid options
        message: 'Gender must be either male, female, or others',
      },
    },
    photoUrl: {
      type: String,
      default:
        'https://media.istockphoto.com/id/1327592506/vector/default-avatar-photo-placeholder-icon-grey-profile-picture-business-man.jpg?s=612x612&w=0&k=20&c=BpR0FVaEa5F24GIw7K8nMWiiGmbb8qmhfkpXcp1dhQg=',
      validate: {
        validator: (value) => /^(http|https):\/\/[^\s$.?#].[^\s]*$/.test(value), // Basic URL validation
        message: 'Invalid URL format for photoUrl',
      },
    },
    about: {
      type: String,
      default: 'This is a default about of the user!',
      maxLength: [300, 'About section cannot exceed 300 characters'], // Enforce maximum length
    },
    skills: {
      type: [String], // Array of strings
      validate: {
        validator: (skills) => skills.every((skill) => skill.length <= 30), // Ensure each skill is short
        message: 'Each skill must not exceed 30 characters',
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
