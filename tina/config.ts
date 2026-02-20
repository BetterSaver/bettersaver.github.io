import { defineConfig } from "tinacms";
// import Post from "./collections/post";
import Page from "./collections/page";
import FaqPage from "./collections/faq";
import FinancialTips from "./collections/financialtips";
import CustomerReviews from "./collections/customerreviews";
import Homepage from "./collections/homepage";

export default defineConfig({
  clientId: process.env.TINA_CLIENT_ID!,
  branch:
    process.env.TINA_BRANCH! || // custom branch env override
    process.env.VERCEL_GIT_COMMIT_REF! || // Vercel branch env
    process.env.HEAD!, // Netlify branch env
  token: process.env.TINA_TOKEN!,
  build: {
    outputFolder: "admin",
    publicFolder: "static",
  },
  media: {
    tina: {
      mediaRoot: "uploads",
      publicFolder: "static",
    },
  },
  schema: {
    collections: [Homepage, Page, FinancialTips, FaqPage, CustomerReviews],
  },
});
