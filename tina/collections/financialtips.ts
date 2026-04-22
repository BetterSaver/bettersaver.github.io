import { Collection } from "tinacms";
import seoFields from "../fields/seo";

const FinancialTips: Collection = {
  name: "financialtips",
  label: "Financial Tips",
  path: "content/financial-tips",
  defaultItem: () => ({
    draft: true,
    date: new Date().toISOString(),
  }),
  fields: [
    {
      type: "boolean",
      name: "draft",
      label: "Draft",
    },
    {
      type: "string",
      name: "tags",
      label: "Tags",
      list: true,
    },
    {
      type: "datetime",
      label: "Date",
      name: "date",
      required: true,
      description:
        "Publication date. Shown on the article and summary card. Defaults to the current date when creating a new article.",
    },
    {
      type: "reference",
      name: "author",
      label: "Author",
      collections: ["authors"],
    },
    {
      type: "string",
      name: "title",
      label: "Title",
      isTitle: true,
      required: true,
    },
    {
      type: "string",
      name: "description",
      label: "Description",
      required: true,
    },
    {
      type: "image",
      label: "Hero image",
      name: "img_src",
    },
    {
      type: "rich-text",
      name: "body",
      label: "Body",
      isBody: true,
    },
    ...seoFields,
  ],
};

export default FinancialTips;
