const SubSection = require("../models/subsection");
const Section = require("../models/section");
const { uploadImageToCloudinary } = require("../utils/imageUploader");

 

exports.createSubSection = async (req, res) => {
    try{
         
            const {sectionId, title, timeDuration, description} = req.body;
           
            const video  = req.files.videoFile;
       
            if(!sectionId || !title || !timeDuration || !description || !video) {
                return res.status(400).json({
                    success:false,
                    message:'All fields are required',
                });
            }
            
            const uploadDetails = await uploadImageToCloudinary(video, process.env.FOLDER_NAME);
         
            const subSectionDetails = await SubSection.create({
                title:title,
                timeDuration:timeDuration,
                description:description,
                videoUrl:uploadDetails.secure_url,
            })
             
            const updatedSection = await Section.findByIdAndUpdate({_id:sectionId},
                                                        {$push:{
                                                            subSection:subSectionDetails._id,
                                                        }},
                                                        {new:true});

            //HW: log updated section here, after adding populate query
            //return response
            
            return res.status(200).json({
                succcess:true,
                message:'Sub Section Created Successfully',
                updatedSection,
            });
    }
    catch(error) {
        return res.status(500).json({
            success:false,
            message:"Internal Server Error",
            error:error.message,
        })
    }
};

//HW: updateSubSection

//HW:deleteSubSection