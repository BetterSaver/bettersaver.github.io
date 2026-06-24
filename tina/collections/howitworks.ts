import { Collection } from "tinacms";
import seoFields from "../fields/seo";

const HowItWorks: Collection = {
  name: "howitworks",
  label: "How It Works Page",
  path: "content/pages",
  match: {
    include: "how-it-works",
  },
  format: "md",
  ui: {
    allowedActions: {
      create: false,
      delete: false,
    },
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
      type: "string",
      name: "description",
      label: "Description",
      ui: { component: "textarea" },
    },
    {
      type: "image",
      name: "featured_image",
      label: "Featured Image",
    },
    {
      type: "image",
      name: "icon_path",
      label: "Hero Icon",
    },
    {
      type: "string",
      name: "icon_class",
      label: "Hero Icon CSS Class",
    },
    {
      type: "datetime",
      name: "date",
      label: "Date",
    },
    {
      type: "string",
      name: "page_block",
      label: "Page Block (template key)",
      description:
        "Hugo partial name. Do not change unless you know what you are doing.",
    },

    // HERO
    {
      type: "string",
      name: "hero_heading",
      label: "Hero - Heading",
      ui: { component: "textarea" },
    },
    {
      type: "string",
      name: "hero_heading_highlight",
      label: "Hero - Highlighted Line",
      description: "The purple line under the hero heading.",
    },

    // STEP 1
    {
      type: "string",
      name: "step1_heading",
      label: "Step 1 - Heading",
      ui: { component: "textarea" },
    },
    {
      type: "string",
      name: "step1_body",
      label: "Step 1 - Body",
      ui: { component: "textarea" },
    },
    {
      type: "string",
      name: "step1_ask_heading",
      label: "Step 1 - List Heading",
    },
    {
      type: "object",
      name: "step1_ask_items",
      label: "Step 1 - List Items",
      list: true,
      ui: {
        itemProps: (item) => ({ label: item?.text }),
      },
      fields: [
        {
          type: "string",
          name: "text",
          label: "Item",
          ui: { component: "textarea" },
        },
      ],
    },
    {
      type: "string",
      name: "step1_footer",
      label: "Step 1 - Footer",
      ui: { component: "textarea" },
    },

    // STEP 2
    {
      type: "string",
      name: "step2_heading",
      label: "Step 2 - Heading",
      ui: { component: "textarea" },
    },
    {
      type: "string",
      name: "step2_body",
      label: "Step 2 - Body",
      ui: { component: "textarea" },
    },
    {
      type: "string",
      name: "step2_how_heading",
      label: "Step 2 - List One Heading",
    },
    {
      type: "object",
      name: "step2_how_items",
      label: "Step 2 - List One Items",
      list: true,
      ui: {
        itemProps: (item) => ({ label: item?.text }),
      },
      fields: [
        {
          type: "string",
          name: "text",
          label: "Item",
          ui: { component: "textarea" },
        },
      ],
    },
    {
      type: "string",
      name: "step2_ready_heading",
      label: "Step 2 - List Two Heading",
    },
    {
      type: "object",
      name: "step2_ready_items",
      label: "Step 2 - List Two Items",
      list: true,
      ui: {
        itemProps: (item) => ({ label: item?.text }),
      },
      fields: [
        {
          type: "string",
          name: "text",
          label: "Item",
          ui: { component: "textarea" },
        },
      ],
    },
    {
      type: "string",
      name: "step2_footer",
      label: "Step 2 - Footer",
      ui: { component: "textarea" },
    },

    // STEP 3
    {
      type: "string",
      name: "step3_heading",
      label: "Step 3 - Heading",
      ui: { component: "textarea" },
    },
    {
      type: "string",
      name: "step3_body",
      label: "Step 3 - Body",
      ui: { component: "textarea" },
    },
    {
      type: "string",
      name: "step3_get_heading",
      label: "Step 3 - List Heading",
    },
    {
      type: "object",
      name: "step3_get_items",
      label: "Step 3 - List Items",
      list: true,
      ui: {
        itemProps: (item) => ({ label: item?.text }),
      },
      fields: [
        {
          type: "string",
          name: "text",
          label: "Item",
          ui: { component: "textarea" },
        },
      ],
    },
    {
      type: "string",
      name: "step3_footer",
      label: "Step 3 - Footer",
      ui: { component: "textarea" },
    },

    // FINAL CTA
    {
      type: "string",
      name: "cta_heading",
      label: "Final CTA - Heading",
      ui: { component: "textarea" },
    },
    {
      type: "string",
      name: "cta_body",
      label: "Final CTA - Body",
      ui: { component: "textarea" },
    },
    {
      type: "string",
      name: "cta_button_label",
      label: "Final CTA - Button Label",
    },
    {
      type: "string",
      name: "cta_button_url",
      label: "Final CTA - Button URL",
    },

    ...seoFields,
  ],
};

export default HowItWorks;
