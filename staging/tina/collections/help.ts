import { Collection } from "tinacms";

const Help: Collection = {
  name: "help",
  label: "Help",
  path: "content/help",
  fields: [
    {
      type: 'boolean',
      name: 'include_in_faq',
      label: 'Include in short FAQ list on the homepage, etc'
    },
    {
    name: 'category',
    type: 'string',
    options: [
        {
          value: 'kiwisaver_basics',
          label: 'KiwiSaver Basics',
        },
        {
          value: 'transferring_leaving',
          label: 'Transferring & Leaving',
        },
        {
          value: 'contributions',
          label: 'Contributions',
        },
        {
          value: 'withdrawals',
          label: 'Withdrawals',
        },
        {
          value: 'betterSaver_funds',
          label: 'BetterSaver & Funds',
        },
        {
          value: 'my_account',
          label: 'My Account',
        },
      ],
    },
    {
      isTitle: true,
      required: true,
      label: "Title",
      name: "title",
      type: "string",
    },
    {
      required: true,
      label: "Content",
      name: "content",
      type: "rich-text",
    }
  ],
};

export default Help;
