import FullServices from "../models/servicesSchema.js";

const createServicesSection = async (req, res) => {
  try {
    const existing = await FullServices.findOne();
    if (existing) {
      return res.status(400).json({ success: false, message: "Use update." });
    }

    const files = req.files || [];
    const {
      heroTitlePart1, heroTitlePart2, introLabel, introMainTitle,
      introDescription, introLongText, gridMainHeading, gridSubheading,
      trustedText, newsletterTitle, newsletterSubtitle, contactEmail
    } = req.body;

    const introSideImageFile = files.find(f => f.fieldname === "introSideImage");
    const introSideImage = introSideImageFile ? introSideImageFile.path : null;

    const bannerImageFile = files.find(f => f.fieldname === "bannerImage");
    const bannerImage = bannerImageFile ? bannerImageFile.path : null;

    // --- HANDLE SERVICES LIST ---
    let servicesList = JSON.parse(req.body.servicesList || "[]");

    servicesList = servicesList.map((item, index) => {
      const file = files.find(f => f.fieldname === `serviceImage_${index}`);
      return {
        ...item,
        image: file ? file.path : item.image,
      };
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
    let fullServices = await FullServices.findOne();
    if (!fullServices) {
      fullServices = new FullServices();
    }

    const files = req.files || [];
    const body = req.body;

    // Update Simple Text Fields
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
    if (body.contactEmail !== undefined) fullServices.contactEmail = body.contactEmail;

    // Update Static Images
    const bannerFile = files.find(f => f.fieldname === "bannerImage");
    if (bannerFile) fullServices.bannerImage = bannerFile.path;

    const introFile = files.find(f => f.fieldname === "introSideImage");
    if (introFile) fullServices.introSideImage = introFile.path;

    // --- UPDATE DYNAMIC SERVICES LIST ---
    if (body.servicesList) {
      let parsedList = JSON.parse(body.servicesList);

      fullServices.servicesList = parsedList.map((item, index) => {
        const file = files.find(f => f.fieldname === `serviceImage_${index}`);

        return {
          title: item.title || "",
          subtitle: item.subtitle || "",
          desc: item.desc || "",
          phoneNumber: item.phoneNumber || "",
          whatsappNumber: item.whatsappNumber || "",
          image: file ? file.path : item.image
        };
      });
    }

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