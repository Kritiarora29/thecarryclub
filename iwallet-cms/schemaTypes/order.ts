export default {
  name: "order",
  title: "Order",
  type: "document",
  fields: [
    {
      name: "customerName",
      type: "string",
      title: "Customer Name",
    },
    {
      name: "email",
      type: "string",
    },
    {
      name: "color",
      type: "string",
      options: {
        list: ["Black", "Space Grey", "White"],
      },
    },
    {
      name: "orderDate",
      type: "datetime",
    },
    {
      name: "amount",
      type: "number",
    },
  ],
};