const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({

    name: {
        type: String
    },
    description: {
        type: string
    },
    instructor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    LearningInThisCourse: {
        type: String
    },
    courseContent: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Section"
        }
    ],
    ratingsAndreviews: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "RatingAndReviews"
        }
    ],
    tags: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "tags"
        }
    ],
    price: {
        type: Number
    },
    thumbnail: {
        type: String
    },
    studentsEnrolled: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        }
    ]


})
module.exports = mongoose.model("Course", courseSchema) 
