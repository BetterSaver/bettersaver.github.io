import { Collection } from "tinacms";
import seoFields from "../fields/seo";

const AboutUs: Collection = {
  name: "aboutus",
  label: "About Us Page",
  path: "content/pages",
  match: {
    include: "about",
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
      type: "string",
      name: "featured_image_fit",
      label: "Featured Image Fit",
      description: "e.g. contain, cover",
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

    // FRAMING
    {
      type: "string",
      name: "framing_tag",
      label: "Framing - Section Tag",
    },
    {
      type: "string",
      name: "framing_heading",
      label: "Framing - Heading",
      ui: { component: "textarea" },
    },
    {
      type: "string",
      name: "framing_body",
      label: "Framing - Body",
      ui: { component: "textarea" },
    },
    {
      type: "string",
      name: "framing_button_label",
      label: "Framing - Button Label",
    },
    {
      type: "string",
      name: "framing_button_url",
      label: "Framing - Button URL",
    },

    // STEPS (Three things we do differently)
    {
      type: "string",
      name: "steps_tag",
      label: "Steps - Section Tag",
    },
    {
      type: "string",
      name: "steps_heading",
      label: "Steps - Heading",
      ui: { component: "textarea" },
    },
    {
      type: "string",
      name: "steps_subheading",
      label: "Steps - Subheading",
      ui: { component: "textarea" },
    },
    {
      type: "object",
      name: "steps_items",
      label: "Steps - Items",
      list: true,
      ui: {
        itemProps: (item) => ({ label: item?.title }),
      },
      fields: [
        { type: "string", name: "number", label: "Number (e.g. 01)" },
        {
          type: "string",
          name: "title",
          label: "Title",
          ui: { component: "textarea" },
        },
        {
          type: "string",
          name: "body",
          label: "Body",
          ui: { component: "textarea" },
        },
      ],
    },

    // STORY
    {
      type: "image",
      name: "story_image",
      label: "Story - Illustration",
    },
    {
      type: "string",
      name: "story_image_alt",
      label: "Story - Illustration Alt Text",
    },
    {
      type: "string",
      name: "story_tag",
      label: "Story - Section Tag",
    },
    {
      type: "string",
      name: "story_heading",
      label: "Story - Heading",
      ui: { component: "textarea" },
    },
    {
      type: "string",
      name: "story_intro",
      label: "Story - Intro",
      ui: { component: "textarea" },
    },
    {
      type: "string",
      name: "story_body",
      label: "Story - Body",
      ui: { component: "textarea" },
    },
    {
      type: "string",
      name: "story_button_label",
      label: "Story - Button Label",
    },
    {
      type: "string",
      name: "story_button_url",
      label: "Story - Button URL",
    },

    // QUOTES
    {
      type: "string",
      name: "quotes_tag",
      label: "Quotes - Section Tag",
    },
    {
      type: "string",
      name: "quotes_heading",
      label: "Quotes - Heading",
      ui: { component: "textarea" },
    },
    {
      type: "string",
      name: "quotes_subheading",
      label: "Quotes - Subheading",
      ui: { component: "textarea" },
    },
    {
      type: "object",
      name: "quotes_items",
      label: "Quotes - Items",
      list: true,
      ui: {
        itemProps: (item) => ({ label: item?.name }),
      },
      fields: [
        {
          type: "string",
          name: "body",
          label: "Quote",
          ui: { component: "textarea" },
        },
        {
          type: "string",
          name: "avatar_letter",
          label: "Avatar Letter",
        },
        {
          type: "string",
          name: "avatar_class",
          label: "Avatar Style (qa1, qa2, qa3, qa4)",
        },
        { type: "string", name: "name", label: "Name" },
        {
          type: "string",
          name: "meta",
          label: "Meta (location · descriptor)",
        },
      ],
    },

    // PARTNER
    {
      type: "string",
      name: "partner_title",
      label: "Partner - Title",
    },
    {
      type: "string",
      name: "partner_sub",
      label: "Partner - Subtitle",
      ui: { component: "textarea" },
    },
    {
      type: "string",
      name: "partner_button_label",
      label: "Partner - Button Label",
    },
    {
      type: "string",
      name: "partner_button_url",
      label: "Partner - Button URL",
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
      name: "cta_button_label",
      label: "Final CTA - Button Label",
    },
    {
      type: "string",
      name: "cta_button_url",
      label: "Final CTA - Button URL",
      description:
        "Use {{appUrl}} as a placeholder for the app URL, or a full path.",
    },
    {
      type: "string",
      name: "cta_subnote",
      label: "Final CTA - Subnote",
    },

    ...seoFields,
  ],
};

export default AboutUs;
