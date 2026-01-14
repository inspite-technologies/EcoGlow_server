  import FullServices from "../models/servicesSchema.js";

  const createServicesSection = async (req, res) => {
    try {
      const existing = await FullServices.findOne();
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

      const fullServices = new FullServices({
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
    // 1. Find or Create the Document (Singleton approach)
    let fullServices = await FullServices.findOne();
    if (!fullServices) {
      fullServices = new FullServices();
    }

    const files = req.files || [];
    const body = req.body;

    // --- 2. Update Simple Text Fields ---
    // We check if the field exists in body before updating to avoid overwriting with undefined
    if (body.heroTitlePart1 !== undefined) fullServices.heroTitlePart1 = body.heroTitlePart1;
    if (body.heroTitlePart2 !== undefined) fullServices.heroTitlePart2 = body.heroTitlePart2;
    
    if (body.introLabel !== undefined) fullServices.introLabel = body.introLabel;
    if (body.introMainTitle !== undefined) fullServices.introMainTitle = body.introMainTitle;
    if (body.introDescription !== undefined) fullServices.introDescription = body.introDescription;
    if (body.introLongText !== undefined) fullServices.introLongText = body.introLongText;
    
    if (body.gridMainHeading !== undefined) fullServices.gridMainHeading = body.gridMainHeading;
    if (body.gridSubheading !== undefined) fullServices.gridSubheading = body.gridSubheading;
    
    if (body.trustedText !== undefined) fullServices.trustedText = body.trustedText;
    if (body.newsletterTitle !== undefined) fullServices.newsletterTitle = body.newsletterTitle;
    if (body.newsletterSubtitle !== undefined) fullServices.newsletterSubtitle = body.newsletterSubtitle;

    // --- 3. Update Static Images (Banner & Intro) ---
    // Multer puts files in req.files array. We search by fieldname.
    
    const bannerFile = files.find(f => f.fieldname === "bannerImage");
    if (bannerFile) {
      fullServices.bannerImage = bannerFile.path; // Works for Cloudinary or Local
    }

    const introFile = files.find(f => f.fieldname === "introSideImage");
    if (introFile) {
      fullServices.introSideImage = introFile.path;
    }

    // --- 4. Update Dynamic Services List ---
    if (body.servicesList) {
      // Frontend sends stringified JSON, so we parse it
      let parsedList = JSON.parse(body.servicesList);

      fullServices.servicesList = parsedList.map((item, index) => {
        // ✅ THE FIX: Look for file using the INDEX (serviceImage_0, serviceImage_1)
        // This matches exactly how the React Frontend sends the FormData.
        const file = files.find(f => f.fieldname === `serviceImage_${index}`);

        return {
          title: item.title || "",
          subtitle: item.subtitle || "",
          desc: item.desc || "", // Ensure 'desc' is mapped if your schema uses it
          // If a new file was uploaded, use it. Otherwise, keep the existing string.
          image: file ? file.path : item.image 
        };
      });
    }

    // 5. Save and Return
    await fullServices.save();
    res.status(200).json({ success: true, data: fullServices });

  } catch (error) {
    console.error("Error updating services:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};
  const getServicesSection = async (req, res) => {
    try {
      const fullServices = await FullServices.findOne();
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