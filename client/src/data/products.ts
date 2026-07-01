export type Category =
  | "Peptides"
  | "Longevity"
  | "Metabolic"
  | "Hormone"
  | "Recovery"
  | "Telehealth";

export interface Product {
  id: string;
  name: string;
  category: Category;
  price: number;
  rxRequired: boolean;
  subscription?: boolean;
  description: string;
  overview: string;
  benefits: string[];
  risks: string[];
  dosingNotes: string;
}

export const categories: { name: Category; icon: string }[] = [
  { name: "Peptides", icon: "sparkle" },
  { name: "Longevity", icon: "infinity" },
  { name: "Metabolic", icon: "bolt" },
  { name: "Hormone", icon: "pulse" },
  { name: "Recovery", icon: "heart" },
  { name: "Telehealth", icon: "video" },
];

export const products: Product[] = [
  {
    id: "bpc-157-5mg",
    name: "BPC-157 5mg",
    category: "Recovery",
    price: 89.99,
    rxRequired: false,
    description: "Body Protection Compound for accelerated healing and gut repair.",
    overview:
      "BPC-157 is a synthetic peptide derived from a protein found in gastric juice, studied for its role in accelerating tissue repair across muscle, tendon, ligament, and gut lining.",
    benefits: ["Supports gut lining repair", "May accelerate tendon and ligament healing", "Studied for anti-inflammatory effects"],
    risks: ["Limited long-term human trial data", "Not FDA-approved for any indication", "Sourcing quality varies widely"],
    dosingNotes: "Commonly researched at 200-500mcg once or twice daily via subcutaneous injection, typically cycled over 4-8 weeks.",
  },
  {
    id: "tb-500-5mg",
    name: "TB-500 5mg",
    category: "Recovery",
    price: 109.99,
    rxRequired: false,
    description: "Thymosin Beta-4 for tissue repair, flexibility, and inflammation reduction.",
    overview:
      "TB-500 is a synthetic fragment of Thymosin Beta-4, a naturally occurring peptide involved in cell migration and repair, often researched alongside BPC-157 for recovery protocols.",
    benefits: ["Supports flexibility and range of motion", "Studied for wound healing", "May reduce inflammation"],
    risks: ["Limited human clinical data", "Potential for injection site irritation", "Not evaluated by the FDA"],
    dosingNotes: "Typical research protocols use 2-2.5mg twice weekly during an initial loading phase, then taper to weekly maintenance.",
  },
  {
    id: "sermorelin-6mg",
    name: "Sermorelin 6mg",
    category: "Hormone",
    price: 149.99,
    rxRequired: true,
    description: "Growth hormone releasing hormone analog for anti-aging and body composition.",
    overview:
      "Sermorelin stimulates the pituitary gland to naturally increase growth hormone production, and is prescribed off-label for body composition, recovery, and age-related GH decline.",
    benefits: ["May improve body composition", "Supports sleep quality", "Encourages natural GH pulsatility"],
    risks: ["Requires physician oversight", "May cause injection site flushing", "Contraindicated with certain pituitary conditions"],
    dosingNotes: "Typically dosed at 200-300mcg subcutaneously before bed to align with natural GH release cycles.",
  },
  {
    id: "semaglutide-5mg",
    name: "Semaglutide 5mg",
    category: "Metabolic",
    price: 299.99,
    rxRequired: true,
    description: "GLP-1 receptor agonist for metabolic health and weight management.",
    overview:
      "Semaglutide is a GLP-1 receptor agonist that regulates appetite and insulin secretion, FDA-approved for type 2 diabetes and chronic weight management under brand names like Ozempic and Wegovy.",
    benefits: ["Clinically proven weight reduction", "Improves glycemic control", "Reduces cardiovascular risk markers"],
    risks: ["GI side effects are common", "Requires dose titration under supervision", "Not suitable for those with a personal/family history of MTC"],
    dosingNotes: "Weekly subcutaneous injection, titrated slowly from 0.25mg up to a maintenance dose per practitioner guidance.",
  },
  {
    id: "nad-plus-500mg",
    name: "NAD+ 500mg",
    category: "Longevity",
    price: 129.99,
    rxRequired: false,
    description: "Nicotinamide adenine dinucleotide for cellular energy and longevity.",
    overview:
      "NAD+ is a coenzyme essential for cellular energy metabolism and DNA repair. Levels decline with age, and supplementation is researched for its role in longevity and mitochondrial function.",
    benefits: ["Supports mitochondrial function", "May improve cellular energy", "Studied for cognitive and metabolic aging"],
    risks: ["Infusions can cause flushing or nausea", "Effects vary by delivery method", "Long-term outcome data still emerging"],
    dosingNotes: "Available via subcutaneous injection or IV; common research doses range from 100-500mg per session, 1-2x weekly.",
  },
  {
    id: "ipamorelin-cjc-1295",
    name: "Ipamorelin / CJC-1295 Blend",
    category: "Peptides",
    price: 179.99,
    rxRequired: true,
    description: "Synergistic growth hormone secretagogue blend for lean muscle and recovery.",
    overview:
      "This blend pairs Ipamorelin, a selective GH secretagogue, with CJC-1295, a GHRH analog, to produce a synergistic and sustained pulse of natural growth hormone release.",
    benefits: ["Supports lean muscle retention", "May improve recovery and sleep depth", "Selective GH release with minimal cortisol impact"],
    risks: ["Requires physician oversight", "Water retention possible initially", "Not evaluated for long-term safety"],
    dosingNotes: "Commonly dosed at 100-300mcg subcutaneously before bed, 5-7 nights per week.",
  },
  {
    id: "pt-141-10mg",
    name: "PT-141 10mg",
    category: "Hormone",
    price: 139.99,
    rxRequired: true,
    description: "Bremelanotide for sexual health and libido optimization.",
    overview:
      "PT-141 (Bremelanotide) acts on melanocortin receptors in the central nervous system to influence sexual arousal, and is FDA-approved under the brand Vyleesi for hypoactive sexual desire disorder.",
    benefits: ["Supports libido and arousal", "Acts independent of vascular pathways", "Effective for both men and women in research settings"],
    risks: ["May cause nausea or flushing", "Can transiently raise blood pressure", "Not for use with certain cardiovascular conditions"],
    dosingNotes: "Typically 1.75mg subcutaneously as needed, at least 45 minutes before activity, no more than once in 24 hours.",
  },
  {
    id: "epithalon-10mg",
    name: "Epithalon 10mg",
    category: "Longevity",
    price: 119.99,
    rxRequired: false,
    description: "Tetrapeptide for telomere elongation and cellular longevity.",
    overview:
      "Epithalon is a synthetic tetrapeptide studied for its potential to activate telomerase, an enzyme linked to telomere length and cellular lifespan, alongside effects on circadian regulation.",
    benefits: ["Studied for telomerase activation", "May support circadian rhythm regulation", "Researched antioxidant properties"],
    risks: ["Human longevity data is preliminary", "Long-term safety not established", "Sourcing and purity vary"],
    dosingNotes: "Research protocols often use 5-10mg daily via subcutaneous injection over a 10-20 day cycle, repeated periodically.",
  },
  {
    id: "dsip-2mg",
    name: "DSIP 2mg",
    category: "Peptides",
    price: 79.99,
    rxRequired: false,
    description: "Delta Sleep-Inducing Peptide for deep sleep optimization and stress reduction.",
    overview:
      "DSIP is a naturally occurring neuropeptide studied for its influence on slow-wave (delta) sleep, stress hormone regulation, and circadian rhythm support.",
    benefits: ["May promote deep, restorative sleep", "Studied for cortisol regulation", "May support stress resilience"],
    risks: ["Mechanism of action not fully understood", "Limited controlled human trials", "Effects can vary significantly between individuals"],
    dosingNotes: "Commonly researched at 100-200mcg subcutaneously before bed, a few nights per week.",
  },
  {
    id: "telehealth-initial-consult",
    name: "Initial Telehealth Consultation",
    category: "Telehealth",
    price: 199.0,
    rxRequired: false,
    description: "60-minute virtual consultation with a licensed practitioner.",
    overview:
      "A comprehensive 60-minute video visit with a licensed practitioner to review your health history, goals, and lab work, and determine which protocols may be appropriate for you.",
    benefits: ["Personalized protocol recommendations", "Review of labs and health history", "Direct access to a licensed prescriber"],
    risks: ["Availability varies by state", "Follow-up visits may be required", "Not a substitute for emergency care"],
    dosingNotes: "One-time visit; scheduling is available within 48 hours of purchase.",
  },
  {
    id: "telehealth-monthly-plan",
    name: "Monthly Telehealth Plan",
    category: "Telehealth",
    price: 149.0,
    rxRequired: false,
    subscription: true,
    description: "Ongoing monthly care plan with quarterly check-ins and protocol adjustments.",
    overview:
      "A recurring care membership that pairs you with a licensed practitioner for ongoing protocol management, with quarterly check-ins to adjust dosing as your goals evolve.",
    benefits: ["Continuity of care with one practitioner", "Quarterly protocol adjustments", "Priority messaging support"],
    risks: ["Auto-renews monthly until cancelled", "Requires an initial consultation first", "Availability varies by state"],
    dosingNotes: "Billed monthly; includes one check-in per quarter plus async messaging in between.",
  },
];
