import CommercialServices from "../models/commercialSchema.js";

const createServicesSection = async (req, res) => {
  try {
    const existing = await CommercialServices.findOne();
    if (existing) {
      return res.status(400).json({ success: false, message: "Use update." });
    }

    const files = req.files || [];

    const {
      heroTitlePart1, heroTitlePart2, introLabel, introMainTitle,
      introDescription, introLongText, gridMainHeading, gridSubheading,
      trustedText, newsletterTitle, newsletterSubtitle, contactEmail // <--- 1. Capture Email
    } = req.body;

    // 1. Handle Intro Side Image
    const introSideImageFile = files.find(f => f.fieldname === "introSideImage");
    const introSideImage = introSideImageFile ? introSideImageFile.path : null;

    // 2. Handle Banner Image
    const bannerImageFile = files.find(f => f.fieldname === "bannerImage");
    const bannerImage = bannerImageFile ? bannerImageFile.path : null;

    // 3. Handle Services List
    let servicesList = JSON.parse(req.body.servicesList || "[]");

    servicesList = servicesList.map((item, index) => {
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
      contactEmail
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

    const files = req.files || [];
    const {
      heroTitlePart1, heroTitlePart2, introLabel, introMainTitle,
      introDescription, introLongText, gridMainHeading, gridSubheading,
      trustedText, newsletterTitle, newsletterSubtitle, contactEmail
    } = req.body;

    // Update Text Fields
    const fields = {
      heroTitlePart1, heroTitlePart2, introLabel, introMainTitle,
      introDescription, introLongText, gridMainHeading,
      gridSubheading, trustedText, newsletterTitle, newsletterSubtitle,
      contactEmail
    };

    Object.keys(fields).forEach(key => {
      if (fields[key] !== undefined) fullServices[key] = fields[key];
    });

    // Update Images
    const introFile = files.find(f => f.fieldname === "introSideImage");
    if (introFile) fullServices.introSideImage = introFile.path;

    const bannerFile = files.find(f => f.fieldname === "bannerImage");
    if (bannerFile) fullServices.bannerImage = bannerFile.path;

    // 3. Update Services List
    if (req.body.servicesList) {
      let parsedList = typeof req.body.servicesList === 'string'
        ? JSON.parse(req.body.servicesList)
        : req.body.servicesList;

      fullServices.servicesList = parsedList.map((item, index) => {
        if (!item.title || !item.title.trim()) item.title = "New Service";

        const file = files.find(f => f.fieldname === `serviceImage_${index}`);

        return {
          ...item,
          image: file ? file.path : item.image,
        };
      });
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