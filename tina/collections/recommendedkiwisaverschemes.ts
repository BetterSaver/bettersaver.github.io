import { Collection } from "tinacms";
import seoFields from "../fields/seo";

const fundRowFields = [
  {
    type: "string" as const,
    name: "provider",
    label: "Provider (scheme)",
  },
  {
    type: "string" as const,
    name: "fund",
    label: "Fund",
  },
  {
    type: "string" as const,
    name: "return_5yr",
    label: "5yr return p.a.",
    description: "Include the % sign, e.g. 7.4%",
  },
  {
    type: "string" as const,
    name: "fee",
    label: "Total annual fee",
    description: "Include the % sign, e.g. 0.85%",
  },
  {
    type: "boolean" as const,
    name: "partner",
    label: "Partner",
  },
];

const RecommendedKiwiSaverSchemes: Collection = {
  name: "recommendedkiwisaverschemes",
  label: "Recommended KiwiSaver Schemes Page",
  path: "content/pages",
  match: {
    include: "recommended-kiwisaver-schemes",
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
      label: "Title (H1)",
      isTitle: true,
      required: true,
    },
    {
      type: "string",
      name: "url",
      label: "URL",
      description: "Do not change: the page lives at the site root.",
    },
    {
      type: "string",
      name: "description",
      label: "Hero intro",
      ui: { component: "textarea" },
    },
    {
      type: "image",
      name: "featured_image",
      label: "Featured Image",
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

    // HERO CTA + REVIEW STAMP
    {
      type: "string",
      name: "cta_text",
      label: "Hero - Primary Button Label",
    },
    {
      type: "string",
      name: "cta_link",
      label: "Hero - Primary Button URL",
      description:
        "Use {{appUrl}} as a placeholder for the app URL, or a full path.",
    },
    {
      type: "string",
      name: "cta_secondary_text",
      label: "Hero - Secondary Link Label",
    },
    {
      type: "string",
      name: "cta_secondary_link",
      label: "Hero - Secondary Link URL",
    },
    {
      type: "datetime",
      name: "review_last",
      label: "Last reviewed",
      description:
        "Shown as Month Year under the hero CTA. Also used as the page's dateModified in search results. Update it every time the lists are refreshed.",
    },
    {
      type: "datetime",
      name: "review_next",
      label: "Next review",
    },

    // HOW WE CHOOSE
    {
      type: "string",
      name: "choose_heading",
      label: "How We Choose - Heading",
    },
    {
      type: "string",
      name: "choose_body",
      label: "How We Choose - Body",
      ui: { component: "textarea" },
    },
    {
      type: "object",
      name: "choose_checks",
      label: "How We Choose - Checks",
      list: true,
      ui: {
        itemProps: (item) => ({ label: item?.text?.slice(0, 60) }),
      },
      fields: [
        {
          type: "string",
          name: "text",
          label: "Text",
          description: "Wrap the check name in **double asterisks** to bold it.",
          ui: { component: "textarea" },
        },
      ],
    },
    {
      type: "string",
      name: "choose_footer",
      label: "How We Choose - Footer",
      ui: { component: "textarea" },
    },

    // RECOMMENDED FUNDS
    {
      type: "string",
      name: "funds_heading",
      label: "Recommended Funds - Heading",
    },
    {
      type: "string",
      name: "funds_body",
      label: "Recommended Funds - Body",
      ui: { component: "textarea" },
    },
    {
      type: "object",
      name: "fund_groups",
      label: "Recommended Funds - Risk Types",
      description:
        "One table per risk type. These rows also feed the page's ItemList schema.",
      list: true,
      ui: {
        itemProps: (item) => ({ label: item?.name }),
      },
      fields: [
        {
          type: "string",
          name: "name",
          label: "Risk type heading",
        },
        {
          type: "string",
          name: "description",
          label: "Description",
          ui: { component: "textarea" },
        },
        {
          type: "object",
          name: "funds",
          label: "Funds",
          list: true,
          ui: {
            itemProps: (item) => ({
              label: [item?.provider, item?.fund].filter(Boolean).join(" – "),
            }),
          },
          fields: fundRowFields,
        },
      ],
    },
    {
      type: "string",
      name: "funds_footnote",
      label: "Recommended Funds - Footnote",
      ui: { component: "textarea" },
    },

    // NOT RECOMMENDED
    {
      type: "string",
      name: "nr_heading",
      label: "Not Recommended - Heading",
    },
    {
      type: "string",
      name: "nr_body",
      label: "Not Recommended - Body",
      ui: { component: "textarea" },
    },
    {
      type: "object",
      name: "not_recommended",
      label: "Not Recommended - Funds",
      description:
        "Both not-recommended sections stay hidden until this list has rows.",
      list: true,
      ui: {
        itemProps: (item) => ({
          label: [item?.provider, item?.fund].filter(Boolean).join(" – "),
        }),
      },
      fields: [
        ...fundRowFields.slice(0, 2),
        {
          type: "string",
          name: "risk_type",
          label: "Risk type",
          options: ["Defensive", "Conservative", "Balanced", "Growth", "Aggressive", "Single sector"],
        },
        ...fundRowFields.slice(2),
        {
          type: "string",
          name: "reason",
          label: "Why it is not on the list",
          ui: { component: "textarea" },
        },
      ],
    },
    {
      type: "string",
      name: "nr_meaning_heading",
      label: "What It Does Not Mean - Heading",
    },
    {
      type: "string",
      name: "nr_meaning_body",
      label: "What It Does Not Mean - Body",
      ui: { component: "textarea" },
    },

    // COMMISSIONS
    {
      type: "string",
      name: "commissions_heading",
      label: "Commissions - Heading",
    },
    {
      type: "string",
      name: "commissions_body",
      label: "Commissions - Body",
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
      description: "Also emitted as FAQPage schema.",
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

    // IMPORTANT INFORMATION
    {
      type: "string",
      name: "important_heading",
      label: "Important Information - Heading",
    },
    {
      type: "string",
      name: "important_body",
      label: "Important Information - Body",
      ui: { component: "textarea" },
    },

    // FOOT CTA
    {
      type: "string",
      name: "cta_heading",
      label: "Foot CTA - Heading",
      ui: { component: "textarea" },
    },
    {
      type: "string",
      name: "cta_body",
      label: "Foot CTA - Body",
      ui: { component: "textarea" },
    },
    {
      type: "string",
      name: "cta_button_label",
      label: "Foot CTA - Button Label",
    },
    {
      type: "string",
      name: "cta_button_url",
      label: "Foot CTA - Button URL",
      description:
        "Use {{appUrl}} as a placeholder for the app URL, or a full path.",
    },
    {
      type: "string",
      name: "cta_subnote",
      label: "Foot CTA - Subnote",
    },

    ...seoFields,
  ],
};

export default RecommendedKiwiSaverSchemes;
