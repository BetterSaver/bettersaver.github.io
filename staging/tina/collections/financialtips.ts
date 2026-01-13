import { Collection } from "tinacms";

const FinancialTips: Collection = {
  name: "financialtips",
  label: "Financial Tips",
  path: "content/financial-tips",
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
    },
    {
      type: "string",
      name: "author",
      label: "Author",
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
  ],
};

export default FinancialTips;
