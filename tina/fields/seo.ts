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
      {
        type: "boolean",
        name: "sitemap_exclude",
        label: "Exclude from sitemap",
        description:
          "When enabled, this page will not appear in the sitemap.xml file.",
      },
      {
        type: "string",
        name: "schema_type",
        label: "Schema.org Page Type",
        description:
          "Override the auto-detected schema type for this page. Leave blank for automatic detection.",
        options: [
          { value: "", label: "Auto-detect" },
          { value: "Article", label: "Article" },
          { value: "AboutPage", label: "About Page" },
          { value: "ContactPage", label: "Contact Page" },
          { value: "FAQPage", label: "FAQ Page" },
          { value: "Service", label: "Service" },
          { value: "WebPage", label: "Web Page" },
        ],
      },
    ],
  },
];

export default seoFields;
