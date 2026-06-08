import { Collection } from "tinacms";
import seoFields from "../fields/seo";

const HowWeAnalyse: Collection = {
  name: "howweanalyse",
  label: "How We Analyse Page",
  path: "content/pages",
  match: {
    include: "how-we-analyse",
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

    // CATEGORIES
    {
      type: "string",
      name: "cats_tag",
      label: "Categories - Section Tag",
    },
    {
      type: "string",
      name: "cats_heading",
      label: "Categories - Heading",
      ui: { component: "textarea" },
    },
    {
      type: "string",
      name: "cats_body",
      label: "Categories - Body",
      ui: { component: "textarea" },
    },
    {
      type: "string",
      name: "cats_body_2",
      label: "Categories - Secondary Body",
      ui: { component: "textarea" },
    },

    // PRINCIPLES
    {
      type: "string",
      name: "principles_tag",
      label: "Principles - Section Tag",
    },
    {
      type: "string",
      name: "principles_heading",
      label: "Principles - Heading",
    },
    {
      type: "string",
      name: "principles_subheading",
      label: "Principles - Subheading",
      ui: { component: "textarea" },
    },
    {
      type: "object",
      name: "principles_items",
      label: "Principles - Items",
      list: true,
      ui: {
        itemProps: (item) => ({ label: item?.title }),
      },
      fields: [
        { type: "string", name: "number", label: "Number" },
        {
          type: "string",
          name: "title",
          label: "Title",
          ui: { component: "textarea" },
        },
        {
          type: "string",
          name: "description",
          label: "Description",
          ui: { component: "textarea" },
        },
      ],
    },

    // FOUR CORE CHECKS
    {
      type: "string",
      name: "checks_tag",
      label: "Four Core Checks - Section Tag",
    },
    {
      type: "string",
      name: "checks_heading",
      label: "Four Core Checks - Heading",
    },
    {
      type: "string",
      name: "checks_subheading",
      label: "Four Core Checks - Subheading",
      ui: { component: "textarea" },
    },
    {
      type: "object",
      name: "checks_items",
      label: "Four Core Checks - Items",
      list: true,
      ui: {
        itemProps: (item) => ({ label: item?.title }),
      },
      fields: [
        { type: "string", name: "number", label: "Number" },
        { type: "string", name: "tag", label: "Tag (e.g. Check one)" },
        {
          type: "string",
          name: "title",
          label: "Title",
          ui: { component: "textarea" },
        },
        {
          type: "string",
          name: "intro",
          label: "Intro",
          ui: { component: "textarea" },
        },
        {
          type: "object",
          name: "bullets",
          label: "Bullets",
          list: true,
          ui: {
            itemProps: (item) => ({ label: item?.text }),
          },
          fields: [
            {
              type: "string",
              name: "text",
              label: "Bullet",
              ui: { component: "textarea" },
            },
          ],
        },
        {
          type: "string",
          name: "kicker",
          label: "Kicker",
          ui: { component: "textarea" },
        },
      ],
    },

    // TRANSITION QUOTE
    {
      type: "string",
      name: "quote_body",
      label: "Transition Quote",
      ui: { component: "textarea" },
    },

    // WEIGHTING
    {
      type: "string",
      name: "weighting_tag",
      label: "Weighting - Section Tag",
    },
    {
      type: "string",
      name: "weighting_heading",
      label: "Weighting - Heading",
      ui: { component: "textarea" },
    },
    {
      type: "string",
      name: "weighting_body",
      label: "Weighting - Body",
      ui: { component: "textarea" },
    },

    // GRADES
    {
      type: "string",
      name: "grades_tag",
      label: "Grades - Section Tag",
    },
    {
      type: "string",
      name: "grades_heading",
      label: "Grades - Heading",
      ui: { component: "textarea" },
    },
    {
      type: "string",
      name: "grades_subheading",
      label: "Grades - Subheading",
      ui: { component: "textarea" },
    },
    {
      type: "object",
      name: "grades_cards",
      label: "Grades - Cards",
      list: true,
      ui: {
        itemProps: (item) => ({ label: item?.label }),
      },
      fields: [
        {
          type: "string",
          name: "badge",
          label: "Badge",
          description: "Use *italics* for special styling, e.g. A*+* renders the plus in italic.",
        },
        { type: "string", name: "css_class", label: "CSS Modifier (e.g. aplus, a, b)" },
        { type: "string", name: "status", label: "Status Text" },
        { type: "string", name: "label", label: "Label" },
        {
          type: "string",
          name: "description",
          label: "Description",
          ui: { component: "textarea" },
        },
      ],
    },
    {
      type: "string",
      name: "grades_low_title",
      label: "Grades Low - Title",
      ui: { component: "textarea" },
    },
    {
      type: "string",
      name: "grades_low_body",
      label: "Grades Low - Body",
      ui: { component: "textarea" },
    },
    {
      type: "string",
      name: "grades_low_note_label",
      label: "Grades Low - Note Label (the pill)",
    },
    {
      type: "string",
      name: "grades_low_note",
      label: "Grades Low - Note",
      ui: { component: "textarea" },
    },
    {
      type: "string",
      name: "grades_callout_tag",
      label: "Grades Callout - Tag",
    },
    {
      type: "string",
      name: "grades_callout_heading",
      label: "Grades Callout - Heading",
      ui: { component: "textarea" },
    },
    {
      type: "object",
      name: "grades_callout_bullets",
      label: "Grades Callout - Bullets",
      list: true,
      ui: {
        itemProps: (item) => ({ label: item?.text }),
      },
      fields: [
        {
          type: "string",
          name: "text",
          label: "Bullet",
          ui: { component: "textarea" },
        },
      ],
    },

    // DATA & COMMISSIONS
    {
      type: "string",
      name: "data_tag",
      label: "Data - Section Tag",
    },
    {
      type: "string",
      name: "data_heading",
      label: "Data - Heading",
      ui: { component: "textarea" },
    },
    {
      type: "object",
      name: "data_cards",
      label: "Data - Cards",
      list: true,
      ui: {
        itemProps: (item) => ({ label: item?.label }),
      },
      fields: [
        { type: "string", name: "label", label: "Card Label" },
        {
          type: "string",
          name: "title",
          label: "Card Title",
          ui: { component: "textarea" },
        },
        {
          type: "string",
          name: "description",
          label: "Card Description",
          ui: { component: "textarea" },
        },
        {
          type: "string",
          name: "description_2",
          label: "Secondary Paragraph",
          ui: { component: "textarea" },
        },
        {
          type: "string",
          name: "notice",
          label: "Notice Paragraph",
          ui: { component: "textarea" },
        },
        {
          type: "object",
          name: "ranked",
          label: "Ranked List (numbered)",
          list: true,
          ui: {
            itemProps: (item) => ({ label: item?.text }),
          },
          fields: [
            { type: "string", name: "number", label: "Number (e.g. 01)" },
            {
              type: "string",
              name: "text",
              label: "Item",
              ui: { component: "textarea" },
            },
          ],
        },
      ],
    },
    {
      type: "string",
      name: "cadence_title",
      label: "Cadence - Title",
    },
    {
      type: "string",
      name: "cadence_sub",
      label: "Cadence - Sub",
      ui: { component: "textarea" },
    },
    {
      type: "image",
      name: "cadence_image",
      label: "Cadence - Illustration",
    },
    {
      type: "string",
      name: "cadence_image_alt",
      label: "Cadence - Illustration Alt Text",
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
        { type: "string", name: "question", label: "Question" },
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

export default HowWeAnalyse;
