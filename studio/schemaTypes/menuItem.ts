import { defineField, defineType } from "sanity";

const categories = ["Burgers","Rolls","Pizzas","BBQ","Broast","Platters","Pasta","Sandwiches","Deals"];

export default defineType({
  name: "menuItem", title: "Menu Item", type: "document",
  fields: [
    defineField({ name: "name", title: "Item name", type: "string", validation: (rule) => rule.required() }),
    defineField({ name: "slug", title: "ID / slug", type: "slug", options: { source: "name", maxLength: 96 }, validation: (rule) => rule.required() }),
    defineField({ name: "category", title: "Category", type: "string", options: { list: categories.map((value) => ({ title: value, value })) }, validation: (rule) => rule.required() }),
    defineField({ name: "description", title: "Description", type: "text", rows: 3 }),
    defineField({ name: "price", title: "Price (Rs)", type: "number", hidden: ({ document }) => document?.category === "Pizzas", validation: (rule) => rule.min(0) }),
    defineField({
      name: "prices", title: "Pizza sizes & prices", type: "object",
      hidden: ({ document }) => document?.category !== "Pizzas",
      fields: [
        defineField({ name: "S", title: "Small", type: "number", validation: (rule) => rule.min(0) }),
        defineField({ name: "M", title: "Medium", type: "number", validation: (rule) => rule.min(0) }),
        defineField({ name: "L", title: "Large", type: "number", validation: (rule) => rule.min(0) }),
        defineField({ name: "XL", title: "X-Large", type: "number", validation: (rule) => rule.min(0) })
      ]
    }),
    defineField({ name: "image", title: "Food image", type: "image", options: { hotspot: true } }),
    defineField({ name: "legacyImagePath", title: "Existing website image path (optional)", type: "string", description: "Use this temporarily for an existing local menu image. New items should use Food image." }),
    defineField({ name: "highlight", title: "Highlight deal", type: "boolean", initialValue: false }),
    defineField({ name: "isAvailable", title: "Available on website", type: "boolean", initialValue: true }),
    defineField({ name: "sortOrder", title: "Sort order", type: "number", initialValue: 100 })
  ],
  preview: { select: { title: "name", subtitle: "category", media: "image" } }
});
