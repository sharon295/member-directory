import { INDUSTRIES } from "./constants";

export const FIELD_META = {
  firstName: { label: "First Name", type: "text", required: true },
  lastName: { label: "Last Name", type: "text", required: true },
  companyName: { label: "Company Name", type: "text", required: true },
  email: { label: "Email", type: "email", required: true },
  phone: { label: "Phone", type: "tel", required: false },
  website: { label: "Website", type: "text", required: false, placeholder: "yourwebsite.com" },
  cityState: { label: "City/State", type: "text", required: true, placeholder: "Austin, TX" },
  industry: { label: "Industry", type: "select", required: true, options: INDUSTRIES },
  headshot: { label: "Headshot", type: "file", required: false },
  logo: { label: "Logo", type: "file", required: false },
  bio: { label: "Bio", type: "textarea", required: false },
  tagline: { label: "Tagline / Banner", type: "text", required: false },
  instagram: { label: "Instagram", type: "text", required: false, placeholder: "@handle" },
  linkedin: { label: "LinkedIn", type: "text", required: false, placeholder: "linkedin.com/in/you" },
};
