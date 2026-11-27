import { Collection } from "tinacms";
import seoFields from "../fields/seo";

const Page: Collection = {
  name: "pages",
  label: "Pages",
  path: "content/pages",
  match: {
    exclude: "{How-to-Change-Your-KiwiSaver-Provider,How-to-Join-KiwiSaver,recommended-kiwisaver-funds,how-we-analyse,about,how-it-works}",
  },
  fields: [
    {
      type: "boolean",
      name: "draft",
      label: "Draft",
    },
    {
      type: "string",
      name: "title",
      label: "Title",
      isTitle: true,
      required: true,
    },
    {
      type: "datetime",
      label: "Date",
      name: "date",
    },
    {
      type: "string",
      name: "aliases",
      label: "Redirect from (old URLs)",
      description:
        "Old addresses that should send visitors to this page, e.g. /about-us. Leave alone unless you know you need it.",
      list: true,
    },
    {
      type: "rich-text",
      name: "body",
      label: "Body",
      isBody: true,
    },
    {
      type: "boolean",
      name: "faq",
      label: "Show FAQ",
    },
    ...seoFields,
  ],
};

export default Page;
