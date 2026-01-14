import CommercialServices from "../models/commercialSchema.js";

const createServicesSection = async (req, res) => {
  try {
    const existing = await CommercialServices.findOne();
    if (existing) {
      return res.status(400).json({ success: false, message: "Use update." });
    }

    // Safety: Ensure files array exists
    const files = req.files || [];

    const {
      heroTitlePart1, heroTitlePart2, introLabel, introMainTitle,
      introDescription, introLongText, gridMainHeading, gridSubheading,
      trustedText, newsletterTitle, newsletterSubtitle,
    } = req.body;

    // 1. Handle Intro Side Image
    const introSideImageFile = files.find(f => f.fieldname === "introSideImage");
    const introSideImage = introSideImageFile ? introSideImageFile.path : null;

    // 2. Handle Banner Image
    const bannerImageFile = files.find(f => f.fieldname === "bannerImage");
    const bannerImage = bannerImageFile ? bannerImageFile.path : null;

    // 3. Handle Services List
    // ⚠️ FIXED: Logic now matches Frontend (uses index, not ID)
    let servicesList = JSON.parse(req.body.servicesList || "[]");
    
    servicesList = servicesList.map((item, index) => {
      // Frontend sends keys like: "serviceImage_0", "serviceImage_1"
      const file = files.find(f => f.fieldname === `serviceImage_${index}`);
      
      if (file) {
          return { ...item, image: file.path };
      }
      return item;
    });

    const fullServices = new CommercialServices({
      bannerImage,
      heroTitlePart1,
      heroTitlePart2,
      introLabel,
      introMainTitle,
      introDescription,
      introLongText,
      introSideImage,
      gridMainHeading,
      gridSubheading,
      servicesList,
      trustedText,
      newsletterTitle,
      newsletterSubtitle,
    });

    await fullServices.save();
    res.status(201).json({ success: true, data: fullServices });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
};

const updateServicesSection = async (req, res) => {
  try {
    let fullServices = await CommercialServices.findOne();
    if (!fullServices) fullServices = new CommercialServices();

    // Files are available via multer (req.files)
    const files = req.files || [];
    
    // Extract text fields
    const {
      heroTitlePart1, heroTitlePart2, introLabel, introMainTitle,
      introDescription, introLongText, gridMainHeading, gridSubheading,
      trustedText, newsletterTitle, newsletterSubtitle,
    } = req.body;

    // 1. Update Standard Text Fields (Only if sent)
    if (heroTitlePart1 !== undefined) fullServices.heroTitlePart1 = heroTitlePart1;
    if (heroTitlePart2 !== undefined) fullServices.heroTitlePart2 = heroTitlePart2;
    if (introLabel !== undefined) fullServices.introLabel = introLabel;
    if (introMainTitle !== undefined) fullServices.introMainTitle = introMainTitle;
    if (introDescription !== undefined) fullServices.introDescription = introDescription;
    if (introLongText !== undefined) fullServices.introLongText = introLongText;
    if (gridMainHeading !== undefined) fullServices.gridMainHeading = gridMainHeading;
    if (gridSubheading !== undefined) fullServices.gridSubheading = gridSubheading;
    if (trustedText !== undefined) fullServices.trustedText = trustedText;
    if (newsletterTitle !== undefined) fullServices.newsletterTitle = newsletterTitle;
    if (newsletterSubtitle !== undefined) fullServices.newsletterSubtitle = newsletterSubtitle;

    // 2. Update Single Images
    const introFile = files.find(f => f.fieldname === "introSideImage");
    if (introFile) fullServices.introSideImage = introFile.path;

    const bannerFile = files.find(f => f.fieldname === "bannerImage");
    if (bannerFile) fullServices.bannerImage = bannerFile.path;

    // 3. Update Services List
    if (req.body.servicesList) {
      let parsedList;
      try {
          // Handle case where it might already be an object vs a string
          parsedList = typeof req.body.servicesList === 'string' 
              ? JSON.parse(req.body.servicesList) 
              : req.body.servicesList;
      } catch (e) {
          console.error("JSON Parse Error for servicesList:", e);
          return res.status(400).json({ success: false, message: "Invalid JSON format for servicesList" });
      }

      // Map over the list. The frontend guarantees that if a file exists for item N,
      // it is named 'serviceImage_N' in req.files.
      parsedList = parsedList.map((item, index) => {
        // Validation: Prevent empty title crash
        if (!item.title || !item.title.trim()) item.title = "New Service";

        // Check for new file at this index
        const file = files.find(f => f.fieldname === `serviceImage_${index}`);
        
        // If new file exists, update path. If not, preserve existing path (sent from frontend)
        if (file) {
            return { ...item, image: file.path };
        }
        return item;
      });
      
      fullServices.servicesList = parsedList;
    }

    await fullServices.save();
    res.status(200).json({ success: true, data: fullServices });

  } catch (error) {
    console.error("Update Error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

const getServicesSection = async (req, res) => {
  try {
    const fullServices = await CommercialServices.findOne();
    if (!fullServices) {
      return res.status(404).json({ success: false, message: "Services section not found" });
    }
    
    
    res.status(200).json({ success: true, data: fullServices });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to fetch Services section", error: error.message });
  }
};

export { createServicesSection, updateServicesSection, getServicesSection };