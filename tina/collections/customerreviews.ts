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
          label: '5',
        },
        {
          value: '4',
          label: '4',
        },
        {
          value: '3',
          label: '3',
        },
        {
          value: '2',
          label: '2',
        },
        {
          value: '1',
          label: '1',
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
