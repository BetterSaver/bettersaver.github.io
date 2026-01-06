import { Collection } from "tinacms";

const Page: Collection = {
  name: "pages",
  label: "Pages",
  path: "content/pages",
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
      type: "rich-text",
      name: "body",
      label: "Body",
      isBody: true,
    },
  ],
};

export default Page;
