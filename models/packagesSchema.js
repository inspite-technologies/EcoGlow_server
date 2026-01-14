import mongoose from 'mongoose';

// --- Sub-Schema: Table Rows ---
// ✅ UPDATED: Changed from c1, c2, c3 to dynamic "cells" array
// This solves your issue of having different column counts (2 vs 3)
const TableRowSchema = new mongoose.Schema({
  cells: [{ type: String }], 
  isSubheader: { type: Boolean, default: false }
});

// --- Sub-Schema: Pricing Tables ---
const PricingTableSchema = new mongoose.Schema({
  id: { type: String, required: true }, 
  sectionLabel: { type: String, default: "" },
  title: { type: String, default: "" },
  columns: [{ type: String }],
  rows: [TableRowSchema]
});

// --- Sub-Schema: Card ---
const PackageCardSchema = new mongoose.Schema({
  title: { type: String, default: "" },
  features: { type: String, default: "" }, 
  price: { type: String, default: "" },
  min: { type: String, default: "" }
});

// --- Main Schema ---
const PackagesSchema = new mongoose.Schema({
  // 1. Hero
  heroSmall: { type: String, default: "" },
  heroLarge: { type: String, default: "" },
  heroBannerImg: { type: String, default: null },

  // 2. Intro
  introLabel: { type: String, default: "" },
  introTitle: { type: String, default: "" },
  introDesc: { type: String, default: "" },

  // 3. Residential Section
  residential: {
    heading: { type: String, default: "Residential" },
    card1: { type: PackageCardSchema, default: {} },
    card2: { type: PackageCardSchema, default: {} }
  },

  // 4. Commercial Section
  commercial: {
    heading: { type: String, default: "Commercial" },
    card1: { type: PackageCardSchema, default: {} },
    card2: { type: PackageCardSchema, default: {} }
  },

  // 5. Dynamic Tables
  tables: [PricingTableSchema]

}, { timestamps: true });

// ✅ FIX IS HERE: Check if model exists before defining it
const Packages = mongoose.models.Packages || mongoose.model("Packages", PackagesSchema);

export default Packages;