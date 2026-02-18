import { Collection } from "tinacms";

const Homepage: Collection = {
  name: "homepage",
  label: "Homepage",
  path: "content",
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
      type: "string",
      name: "why_heading",
      label: "Why BetterSaver - Heading",
    },
    {
      type: "string",
      name: "why_description",
      label: "Why BetterSaver - Description",
      ui: {
        component: "textarea",
      },
    },
    {
      type: "object",
      name: "why_boxes",
      label: "Why BetterSaver - Feature Boxes",
      list: true,
      ui: {
        itemProps: (item) => {
          return { label: item?.title };
        },
      },
      fields: [
        {
          type: "image",
          name: "icon",
          label: "Icon",
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
          ui: {
            component: "textarea",
          },
        },
      ],
    },
    {
      type: "string",
      name: "how_heading",
      label: "How It Works - Heading",
    },
    {
      type: "string",
      name: "how_description",
      label: "How It Works - Description",
      ui: {
        component: "textarea",
      },
    },
    {
      type: "object",
      name: "how_steps",
      label: "How It Works - Steps",
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
          label: "Title",
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
          name: "image",
          label: "Step Image",
        },
      ],
    },
  ],
};

export default Homepage;
