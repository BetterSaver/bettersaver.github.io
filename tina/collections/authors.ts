import { Collection } from "tinacms";

const Authors: Collection = {
  name: "authors",
  label: "Authors",
  path: "content/authors",
  format: "md",
  fields: [
    {
      type: "string",
      name: "name",
      label: "Name",
      isTitle: true,
      required: true,
    },
    {
      type: "image",
      name: "profile_image",
      label: "Profile picture",
    },
    {
      type: "string",
      name: "link",
      label: "Link (optional)",
      description:
        "Optional URL that wraps the profile picture and name on blog posts (e.g. LinkedIn, bio page).",
    },
  ],
};

export default Authors;
