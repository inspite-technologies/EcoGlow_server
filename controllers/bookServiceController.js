import BookService from '../models/bookServiceSchema.js'

const getBooking = async (req,res) =>{
    try{
        const settings = await BookService.findOne()
        if(!settings){
            return res.status(200).json({message:"No settings found,using defaults.."})
        }
        res.status(200).json(settings);
  } catch (error) {
    res.status(500).json({ message: "Error fetching settings", error: error.message });
  }
}

const upsertBooking = async (req, res) => {
  try {
    const updateData = {
      heroSmallText: req.body.heroSmallText,
      heroLargeText: req.body.heroLargeText,
      topLabel: req.body.topLabel,
      sectionMainTitle: req.body.sectionMainTitle,
      sectionSubtitle: req.body.sectionSubtitle,
      sectionSmallLabel: req.body.sectionSmallLabel // Added this
    };

    // If a new file was uploaded by multer
    if (req.file) {
      updateData.heroBannerImage = req.file.path; 
    } else if (req.body.existingImagePath) {
      // Keep the old image sent from frontend
      updateData.heroBannerImage = req.body.existingImagePath;
    }

    // FIX: Use 'BookService' (your imported name), NOT 'BookingModel'
    const updated = await BookService.findOneAndUpdate(
      {}, 
      updateData, 
      { upsert: true, new: true }
    );

    res.status(200).json(updated);
  } catch (error) {
    console.error("Backend Error:", error); // This shows in your terminal
    res.status(500).json({ message: error.message });
  }
};

export {getBooking,upsertBooking}