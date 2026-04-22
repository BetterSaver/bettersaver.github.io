import { defineConfig } from "tinacms";
import * as React from "react";
// import Post from "./collections/post";
import Page from "./collections/page";
import FaqPage from "./collections/faq";
import FinancialTips from "./collections/financialtips";
import CustomerReviews from "./collections/customerreviews";
import Homepage from "./collections/homepage";
import Authors from "./collections/authors";

const DeployScreenPlugin = {
  __type: "screen",
  name: "Deploy to Production",
  Icon: () =>
    React.createElement(
      "span",
      { style: { fontSize: "1.2rem", lineHeight: 1 } },
      "\u{1F680}"
    ),
  layout: "fullscreen",
  Component: () =>
    React.createElement("iframe", {
      src: "/admin/deploy.html",
      style: {
        width: "100%",
        height: "100%",
        border: 0,
        display: "block",
      },
      title: "Deploy to Production",
    }),
};

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
  cmsCallback: (cms) => {
    cms.plugins.add(DeployScreenPlugin);
    return cms;
  },
  schema: {
    collections: [Homepage, Page, FinancialTips, FaqPage, CustomerReviews, Authors],
  },
});
