import { Collection } from "tinacms";
import seoFields from "../fields/seo";

const HowToJoinKiwiSaver: Collection = {
  name: "howtojoinkiwisaver",
  label: "How to Join KiwiSaver Page",
  path: "content/pages",
  match: {
    include: "How-to-Join-KiwiSaver",
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
      ui: {
        component: "textarea",
      },
    },
    {
      type: "image",
      name: "featured_image",
      label: "Featured Image",
      description:
        "Large hero background. Leave blank to use the simple title header.",
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

    // INTRO / FRAMING
    {
      type: "string",
      name: "intro_tag",
      label: "Intro - Section Tag",
    },
    {
      type: "string",
      name: "intro_heading",
      label: "Intro - Heading",
      ui: { component: "textarea" },
    },
    {
      type: "string",
      name: "intro_body_2",
      label: "Intro - Secondary Body",
      ui: { component: "textarea" },
    },
    {
      type: "string",
      name: "intro_cta_label",
      label: "Intro - CTA Button Label",
    },
    {
      type: "string",
      name: "intro_cta_url",
      label: "Intro - CTA Button URL",
      description:
        "Use {{appUrl}} as a placeholder for the app URL, or a full path like /faq/.",
    },

    // WHO CAN JOIN
    {
      type: "string",
      name: "eligible_tag",
      label: "Who Can Join - Section Tag",
    },
    {
      type: "string",
      name: "eligible_heading",
      label: "Who Can Join - Heading",
    },
    {
      type: "string",
      name: "eligible_subheading",
      label: "Who Can Join - Subheading",
      ui: { component: "textarea" },
    },
    {
      type: "object",
      name: "eligible_items",
      label: "Who Can Join - Items",
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
      name: "eligible_footnote",
      label: "Who Can Join - Footnote",
      ui: { component: "textarea" },
    },

    // WHY JOIN
    {
      type: "string",
      name: "why_tag",
      label: "Why Join - Section Tag",
    },
    {
      type: "string",
      name: "why_heading",
      label: "Why Join - Heading",
    },
    {
      type: "string",
      name: "why_body",
      label: "Why Join - Body",
      ui: { component: "textarea" },
    },
    {
      type: "object",
      name: "why_cards",
      label: "Why Join - Cards",
      list: true,
      ui: {
        itemProps: (item) => ({ label: item?.title }),
      },
      fields: [
        {
          type: "string",
          name: "title",
          label: "Title",
        },
        {
          type: "string",
          name: "description",
          label: "Description",
          ui: { component: "textarea" },
        },
      ],
    },

    // HOW TO JOIN
    {
      type: "string",
      name: "how_tag",
      label: "How It Works - Section Tag",
    },
    {
      type: "string",
      name: "how_heading",
      label: "How It Works - Heading",
    },
    {
      type: "string",
      name: "how_subheading",
      label: "How It Works - Subheading",
      ui: { component: "textarea" },
    },
    {
      type: "object",
      name: "how_steps",
      label: "How It Works - Steps",
      list: true,
      ui: {
        itemProps: (item) => ({ label: item?.title }),
      },
      fields: [
        {
          type: "string",
          name: "number",
          label: "Step Number",
        },
        {
          type: "string",
          name: "title",
          label: "Title",
        },
        {
          type: "string",
          name: "description",
          label: "Description",
          ui: { component: "textarea" },
        },
      ],
    },

    // WHAT YOU'LL NEED
    {
      type: "string",
      name: "need_tag",
      label: "What You'll Need - Section Tag",
    },
    {
      type: "string",
      name: "need_heading",
      label: "What You'll Need - Heading",
    },
    {
      type: "string",
      name: "need_subheading",
      label: "What You'll Need - Subheading",
      ui: { component: "textarea" },
    },
    {
      type: "object",
      name: "need_items",
      label: "What You'll Need - Items",
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
      type: "image",
      name: "need_image",
      label: "What You'll Need - Image",
    },
    {
      type: "string",
      name: "need_image_alt",
      label: "What You'll Need - Image Alt Text",
    },

    // AUTOMATIC ENROLMENT
    {
      type: "string",
      name: "auto_tag",
      label: "Automatic Enrolment - Section Tag",
    },
    {
      type: "string",
      name: "auto_heading",
      label: "Automatic Enrolment - Heading",
    },
    {
      type: "string",
      name: "auto_body",
      label: "Automatic Enrolment - Body",
      ui: { component: "textarea" },
    },
    {
      type: "string",
      name: "auto_cta_label",
      label: "Automatic Enrolment - CTA Button Label",
    },
    {
      type: "string",
      name: "auto_cta_url",
      label: "Automatic Enrolment - CTA Button URL",
    },

    // READY TO CHOOSE
    {
      type: "string",
      name: "choose_tag",
      label: "Ready to Choose - Section Tag",
    },
    {
      type: "string",
      name: "choose_heading",
      label: "Ready to Choose - Heading",
    },
    {
      type: "string",
      name: "choose_body",
      label: "Ready to Choose - Body",
      ui: { component: "textarea" },
    },
    {
      type: "string",
      name: "choose_cta_label",
      label: "Ready to Choose - CTA Button Label",
    },
    {
      type: "string",
      name: "choose_cta_url",
      label: "Ready to Choose - CTA Button URL",
      description:
        "Use {{appUrl}} as a placeholder for the app URL, or a full path.",
    },
    {
      type: "string",
      name: "choose_footnote",
      label: "Ready to Choose - Footnote",
      ui: { component: "textarea" },
    },

    // IMPORTANT INFORMATION
    {
      type: "string",
      name: "privacy_body",
      label: "Important Information Quote",
      ui: { component: "textarea" },
    },

    // FAQ
    {
      type: "string",
      name: "faq_heading",
      label: "FAQ - Heading",
    },
    {
      type: "string",
      name: "faq_subheading",
      label: "FAQ - Subheading",
      ui: { component: "textarea" },
    },
    {
      type: "string",
      name: "faq_button_label",
      label: "FAQ - Button Label",
    },
    {
      type: "string",
      name: "faq_button_url",
      label: "FAQ - Button URL",
    },
    {
      type: "object",
      name: "faq_items",
      label: "FAQ - Items",
      list: true,
      ui: {
        itemProps: (item) => ({ label: item?.question }),
      },
      fields: [
        {
          type: "string",
          name: "question",
          label: "Question",
        },
        {
          type: "string",
          name: "answer",
          label: "Answer",
          ui: { component: "textarea" },
        },
      ],
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

export default HowToJoinKiwiSaver;
