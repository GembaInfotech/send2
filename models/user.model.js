const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const userSchema = new Schema(
  {
   
    contact: {
      type: Number,
    },
   
    pincode: {
      type: String,
    
    
    },
    address: {
      type: String,
     
      uppercase:true
    },
   
    city: {
      type: String,
    
      uppercase:true

    },
    state: {
      type: String,
      required: false,
      uppercase:true

    },
    country: {
      type: String,
      required: false,
      uppercase:true

    },
   
    licence_no: {
      type: String,
      uppercase: true,
    },
   
   
  
 
    vehicle: [
      {
        vehicle_name: {
          type: String,
          uppercase:true
        },
         vehicle_number: {
          type: String,
          uppercase:true
        },
        vehicle_type: {
          type: String,
          enum: ["four wheeler", "two wheeler"],
          
        },
        isDefault:{
          type:Boolean,
          default:false,
         
        }
      },
    ],
    bookings: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Booking",
      },
    ],


    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    createdOnDate: {
      type: String,
    },
    userActive: {
      type: Boolean,
      default: false,
    },
    acceptedTerms: {
      type: Boolean,
    },
    userStatus: {
      type: String,
      enum:["pending", "active", "inactive"],
      default: 'pending',
    },
    uniqueId: {
      type: String,
      required: false,
    },
    avatar: {
      type: String,
    },
    followers: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    following: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    location: {
      type: String,
      default: "",
    },

    bio: {
      type: String,
      default: "",
    },

    interests: {
      type: String,
      default: "",
    },

    role: {
      type: String,
      enum: ["general", "moderator", "admin"],
      default: "general",
    },

    savedPosts: [
      {
        type: Schema.Types.ObjectId,
        ref: "Post",
        default: [],
      },
    ],

    isEmailVerified: {
      type: Boolean,
      default: false,
    },
  },
 
  { timestamps: true }
);


userSchema.index({ name: "text" });

module.exports = mongoose.model('User', userSchema);
