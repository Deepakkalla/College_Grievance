const mongoose = require("mongoose");

const GenerateToken = require("../utils/GenerateTicket")

const GrievanceSchema = new mongoose.Schema(
    {
        ticketId: {
            type: String,
            unique: true,
            default: GenerateToken,
        },
        title: {
            type: String,
            required: true,
            trim: true,
            maxlength: 150,
        },
        description: {
            type: String,
            required: true,
            trim: true,
        },
        category: {
            type: String,
            required: true,
            enum: [
                "hostel",
                "academics",
                "exam",
                "fees",
                "library",
                "transport",
                "other",
            ],
        },
        department: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Department",
        },
        priority: {
            type: String,
            enum: ["low", "medium", "high"],
            default: "medium",
        },
        status: {
            type: String,
            enum: [
                "submitted",
                "under_review",
                "in_progress",
                "resolved",
                "rejected",
            ],
            default: "submitted",
        },
        attachment: {
            type: [
                {
                    url: { type: String, require: true },
                    publicId: { type: String },
                    fileName: { type: String },
                    FileType: { type: String }
                }


            ],
           
            
            validate: {
                validator: function (arr) {
                    if(!arr) return true
                    return arr.length <= 3
                },
                message: "you upload too many files"
            }

        },
        createdBy:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        },
        assignedTo:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
            
        },
        isAnonymous:{
            type:Boolean,
            default:false
        }

    },
    {
        timestamps: true,
    },
);

module.exports = mongoose.model("Grievance", GrievanceSchema);
