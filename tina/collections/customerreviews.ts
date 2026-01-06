import { Collection } from "tinacms";

const CustomerReviews: Collection = {
  name: "customerreviews",
  label: "Customer Reviews",
  path: "content/customer-reviews",
  fields: [
    {
      isTitle: true,
      required: true,
      label: "Name",
      name: "name",
      type: "string",
    },
    {
      type: "image",
      label: "Profile picture",
      name: "img_src",
    },
    {
    name: 'stars',
    type: 'string',
    options: [
        {
          value: '5',
          label: '* * * * *',
        },
        {
          value: '4',
          label: '* * * *',
        },
        {
          value: '3',
          label: '* * *',
        },
        {
          value: '2',
          label: '* *',
        },
        {
          value: '1',
          label: '*',
        },
      ],
    },
    {
      required: true,
      label: "Review",
      name: "review",
      type: "rich-text",
    }
  ],
};

export default CustomerReviews;
