import { Collection } from "tinacms";
import seoFields from "../fields/seo";

const HowToChangeProvider: Collection = {
  name: "howtochangeprovider",
  label: "How to Change Provider Page",
  path: "content/pages",
  match: {
    include: "How-to-Change-Your-KiwiSaver-Provider",
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

    // HOW IT WORKS
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
      label: "What You'll Need - Illustration",
    },
    {
      type: "string",
      name: "need_image_alt",
      label: "What You'll Need - Illustration Alt Text",
    },

    // WHAT HAPPENS WHEN YOU SWITCH
    {
      type: "string",
      name: "switch_tag",
      label: "What Happens - Section Tag",
    },
    {
      type: "string",
      name: "switch_heading",
      label: "What Happens - Heading",
    },
    {
      type: "string",
      name: "switch_subheading",
      label: "What Happens - Subheading",
      ui: { component: "textarea" },
    },
    {
      type: "object",
      name: "switch_items",
      label: "What Happens - Bullet List",
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
      type: "object",
      name: "switch_cards",
      label: "What Happens - Cards",
      list: true,
      ui: {
        itemProps: (item) => ({ label: item?.title }),
      },
      fields: [
        {
          type: "string",
          name: "label",
          label: "Card Label",
        },
        {
          type: "string",
          name: "title",
          label: "Card Title",
        },
        {
          type: "string",
          name: "description",
          label: "Card Description",
          ui: { component: "textarea" },
        },
      ],
    },

    // SWITCHING THROUGH BETTERSAVER
    {
      type: "string",
      name: "paths_tag",
      label: "Switching Paths - Section Tag",
    },
    {
      type: "string",
      name: "paths_heading",
      label: "Switching Paths - Heading",
    },
    {
      type: "string",
      name: "paths_subheading",
      label: "Switching Paths - Subheading",
      ui: { component: "textarea" },
    },
    {
      type: "object",
      name: "paths_cards",
      label: "Switching Paths - Cards",
      list: true,
      ui: {
        itemProps: (item) => ({ label: item?.title }),
      },
      fields: [
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
          type: "image",
          name: "image",
          label: "Card Image",
        },
        {
          type: "string",
          name: "image_alt",
          label: "Card Image Alt Text",
        },
      ],
    },

    // CONTRIBUTION RATE
    {
      type: "string",
      name: "contrib_tag",
      label: "Contribution Rate - Section Tag",
    },
    {
      type: "string",
      name: "contrib_heading",
      label: "Contribution Rate - Heading",
    },
    {
      type: "string",
      name: "contrib_subheading",
      label: "Contribution Rate - Subheading",
      ui: { component: "textarea" },
    },
    {
      type: "string",
      name: "contrib_title",
      label: "Contribution Rate - Rates Title",
    },
    {
      type: "string",
      name: "contrib_sub",
      label: "Contribution Rate - Rates Sub",
      ui: { component: "textarea" },
    },
    {
      type: "image",
      name: "contrib_image",
      label: "Contribution Rate - Illustration",
    },
    {
      type: "string",
      name: "contrib_image_alt",
      label: "Contribution Rate - Illustration Alt Text",
    },

    // NOT IN KIWISAVER YET
    {
      type: "string",
      name: "new_tag",
      label: "New to KiwiSaver - Section Tag",
    },
    {
      type: "string",
      name: "new_heading",
      label: "New to KiwiSaver - Heading",
    },
    {
      type: "string",
      name: "new_body_2",
      label: "New to KiwiSaver - Secondary Body",
      ui: { component: "textarea" },
    },

    // COSTS & PAYMENT
    {
      type: "string",
      name: "costs_tag",
      label: "Costs - Section Tag",
    },
    {
      type: "string",
      name: "costs_heading",
      label: "Costs - Heading",
      ui: { component: "textarea" },
    },
    {
      type: "object",
      name: "costs_cards",
      label: "Costs - Cards",
      list: true,
      ui: {
        itemProps: (item) => ({ label: item?.title }),
      },
      fields: [
        {
          type: "string",
          name: "label",
          label: "Card Label",
        },
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
          type: "object",
          name: "notices",
          label: "Notice Paragraphs",
          list: true,
          ui: {
            itemProps: (item) => ({ label: item?.text }),
          },
          fields: [
            {
              type: "string",
              name: "text",
              label: "Notice",
              ui: { component: "textarea" },
            },
          ],
        },
        {
          type: "image",
          name: "image",
          label: "Card Image",
        },
        {
          type: "string",
          name: "image_alt",
          label: "Card Image Alt Text",
        },
      ],
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

    // PRIVACY QUOTE
    {
      type: "string",
      name: "privacy_body",
      label: "Privacy Quote",
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
      description:
        "Use {{appUrl}} as a placeholder for the app URL, or a full path.",
    },

    ...seoFields,
  ],
};

export default HowToChangeProvider;
