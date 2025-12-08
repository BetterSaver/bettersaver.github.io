import { Collection } from "tinacms";

const Help: Collection = {
  name: "help",
  label: "Help",
  path: "content/help",
  fields: [
    {
      type: "string",
      name: "title",
      label: "Title",
      isTitle: true,
      required: true,
    },
    {
      type: "datetime",
      label: "Date",
      name: "date",
    },
    {
      type: "boolean",
      name: "draft",
      label: "Draft",
    },
    {
      type: "rich-text",
      name: "body",
      label: "Body",
      isBody: true,
    },
    {
      label: "KiwiSaver Basics",
      name: "kiwisaver_basics",
      type: "object",
      list: true,
      ui: {
        itemProps: (item) => {
          // Field values are accessed by item?.<Field name>
          return { label: item?.title };
        },
      },
      fields: [
        {
          type: 'boolean',
          name: 'include_in_faq',
          label: 'Include in short FAQ list on the homepage, etc'
        },
        {
          label: "Title",
          name: "title",
          type: "string"
        },
        {
          label: "Content",
          name: "content",
          type: "rich-text",
        }
      ]
    },
    {
      label: "Transferring & Leaving",
      name: "transferring_leaving",
      type: "object",
      list: true,
      ui: {
        itemProps: (item) => {
          // Field values are accessed by item?.<Field name>
          return { label: item?.title };
        },
      },
      fields: [
        {
          type: 'boolean',
          name: 'include_in_faq',
          label: 'Include in short FAQ list on the homepage, etc'
        },
        {
          label: "Title",
          name: "title",
          type: "string"
        },
        {
          label: "Content",
          name: "content",
          type: "rich-text",
        }
      ]
    },
    {
      label: "Contributions",
      name: "contributions",
      type: "object",
      list: true,
      ui: {
        itemProps: (item) => {
          // Field values are accessed by item?.<Field name>
          return { label: item?.title };
        },
      },
      fields: [
        {
          type: 'boolean',
          name: 'include_in_faq',
          label: 'Include in short FAQ list on the homepage, etc'
        },
        {
          label: "Title",
          name: "title",
          type: "string"
        },
        {
          label: "Content",
          name: "content",
          type: "rich-text",
        }
      ]
    },
    {
      label: "Withdrawals",
      name: "withdrawals",
      type: "object",
      list: true,
      ui: {
        itemProps: (item) => {
          // Field values are accessed by item?.<Field name>
          return { label: item?.title };
        },
      },
      fields: [
        {
          type: 'boolean',
          name: 'include_in_faq',
          label: 'Include in short FAQ list on the homepage, etc'
        },
        {
          label: "Title",
          name: "title",
          type: "string"
        },
        {
          label: "Content",
          name: "content",
          type: "rich-text",
        }
      ]
    },
    {
      label: "BetterSaver & Funds",
      name: "betterSaver_funds",
      type: "object",
      list: true,
      ui: {
        itemProps: (item) => {
          // Field values are accessed by item?.<Field name>
          return { label: item?.title };
        },
      },
      fields: [
        {
          type: 'boolean',
          name: 'include_in_faq',
          label: 'Include in short FAQ list on the homepage, etc'
        },
        {
          label: "Title",
          name: "title",
          type: "string"
        },
        {
          label: "Content",
          name: "content",
          type: "rich-text",
        }
      ]
    },
    {
      label: "My Account",
      name: "my_account",
      type: "object",
      list: true,
      ui: {
        itemProps: (item) => {
          // Field values are accessed by item?.<Field name>
          return { label: item?.title };
        },
      },
      fields: [
        {
          type: 'boolean',
          name: 'include_in_faq',
          label: 'Include in short FAQ list on the homepage, etc'
        },
        {
          label: "Title",
          name: "title",
          type: "string"
        },
        {
          label: "Content",
          name: "content",
          type: "rich-text",
        }
      ]
    }
  ],
};

export default Help;
