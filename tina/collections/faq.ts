import { Collection } from "tinacms";

const FaqPage: Collection = {
  name: "faqPage",
  label: "FAQ Page",
  path: "content/faq",
  match: {
    include: "_index",
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
      name: "icon_path",
      label: "Header Icon",
    },
    {
      type: "string",
      name: "icon_class",
      label: "Icon CSS Class",
    },
    {
      type: "boolean",
      name: "need_help",
      label: "Show 'Can't find an answer?' link",
    },
    {
      type: "string",
      name: "tags_label",
      label: "Tags Label",
      description: "Label shown above the category tags, e.g. 'Get help with'",
    },
    {
      type: "object",
      name: "sections",
      label: "FAQ Sections",
      list: true,
      ui: {
        itemProps: (item) => {
          return { label: item?.label || item?.id };
        },
      },
      fields: [
        {
          type: "string",
          name: "id",
          label: "Section ID",
          required: true,
          description:
            "Machine-readable ID (used as anchor link). Use snake_case, e.g. 'kiwisaver_basics'",
        },
        {
          type: "string",
          name: "label",
          label: "Display Label",
          required: true,
          description: "Shown as the tag button and section heading",
        },
        {
          type: "object",
          name: "items",
          label: "Questions",
          list: true,
          ui: {
            itemProps: (item) => {
              return { label: item?.title };
            },
          },
          fields: [
            {
              type: "string",
              name: "title",
              label: "Question",
              required: true,
            },
            {
              type: "rich-text",
              name: "content",
              label: "Answer",
              required: true,
            },
            {
              type: "boolean",
              name: "include_in_faq",
              label: "Include in short FAQ list on the homepage",
            },
          ],
        },
      ],
    },
  ],
};

export default FaqPage;
