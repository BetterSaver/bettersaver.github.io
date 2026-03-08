import { TinaField } from "tinacms";

const seoFields: TinaField[] = [
  {
    type: "object",
    name: "seo",
    label: "SEO & Social Media",
    fields: [
      {
        type: "string",
        name: "title",
        label: "SEO Title",
        description:
          "Custom title for search results. Leave blank to use the page title. Keep under 60 characters.",
      },
      {
        type: "string",
        name: "description",
        label: "Meta Description",
        description:
          "Description shown in search results. Aim for 150\u2013160 characters.",
        ui: {
          component: "textarea",
        },
      },
      {
        type: "string",
        name: "keywords",
        label: "Keywords",
        description:
          "Comma-separated keywords, e.g. kiwisaver, retirement, savings",
      },
      {
        type: "image",
        name: "image",
        label: "Social Share Image",
        description:
          "Image shown when shared on social media. Recommended size: 1200x630px.",
      },
      {
        type: "string",
        name: "image_alt",
        label: "Social Image Alt Text",
        description: "Describe the social share image for accessibility.",
      },
      {
        type: "boolean",
        name: "noindex",
        label: "Hide from search engines",
        description:
          "When enabled, search engines will not index this page.",
      },
    ],
  },
];

export default seoFields;
