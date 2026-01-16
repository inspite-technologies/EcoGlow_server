import FullServices from "../models/servicesSchema.js";

const createServicesSection = async (req, res) => {
  try {
    const existing = await FullServices.findOne();
    if (existing) return res.status(400).json({ success: false, message: "Use update." });

    const files = req.files || [];
    const body = req.body;

    const introSideImageFile = files.find(f => f.fieldname === "introSideImage");
    const bannerImageFile = files.find(f => f.fieldname === "bannerImage");

    let servicesList = JSON.parse(body.servicesList || "[]");
    servicesList = servicesList.map((item, index) => {
      const file = files.find(f => f.fieldname === `serviceImage_${index}`);
      return { ...item, image: file ? file.path : item.image };
    });

    const fullServices = new FullServices({
      ...body,
      bannerImage: bannerImageFile ? bannerImageFile.path : null,
      introSideImage: introSideImageFile ? introSideImageFile.path : null,
      servicesList,
      // ✅ Parse dynamic dropdowns
      cleaningForOptions: JSON.parse(body.cleaningForOptions || "[]"),
      bedroomOptions: JSON.parse(body.bedroomOptions || "[]")
    });

    await fullServices.save();
    res.status(201).json({ success: true, data: fullServices });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const updateServicesSection = async (req, res) => {
  try {
    let fullServices = await FullServices.findOne();
    if (!fullServices) fullServices = new FullServices();

    const files = req.files || [];
    const body = req.body;

    // Update Text Fields
    const fields = [
      "heroTitlePart1", "heroTitlePart2", "introLabel", "introMainTitle",
      "introDescription", "introLongText", "gridMainHeading", "gridSubheading",
      "trustedText", "newsletterTitle", "newsletterSubtitle", "contactEmail"
    ];
    fields.forEach(field => {
      if (body[field] !== undefined) fullServices[field] = body[field];
    });

    // ✅ Update Dynamic Dropdowns
    if (body.cleaningForOptions) fullServices.cleaningForOptions = JSON.parse(body.cleaningForOptions);
    if (body.bedroomOptions) fullServices.bedroomOptions = JSON.parse(body.bedroomOptions);

    // Update Static Images
    const bannerFile = files.find(f => f.fieldname === "bannerImage");
    if (bannerFile) fullServices.bannerImage = bannerFile.path;

    const introFile = files.find(f => f.fieldname === "introSideImage");
    if (introFile) fullServices.introSideImage = introFile.path;

    // Update Services List
    if (body.servicesList) {
      let parsedList = JSON.parse(body.servicesList);
      fullServices.servicesList = parsedList.map((item, index) => {
        const file = files.find(f => f.fieldname === `serviceImage_${index}`);
        return {
          ...item,
          image: file ? file.path : item.image
        };
      });
    }

    await fullServices.save();
    res.status(200).json({ success: true, data: fullServices });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const getServicesSection = async (req, res) => {
  try {
    const fullServices = await FullServices.findOne();
    if (!fullServices) return res.status(404).json({ success: false, message: "Not found" });
    res.status(200).json({ success: true, data: fullServices });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export { createServicesSection, updateServicesSection, getServicesSection };