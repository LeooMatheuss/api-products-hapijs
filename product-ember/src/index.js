"use strict";

require("./services/database");
const Product = require("./models/Product");

const Hapi = require("@hapi/hapi");
const Joi = require("@hapi/joi");

const init = async () => {
  const server = Hapi.server({
    port: 3000,
    host: "localhost",
  });

  server.route({
    method: "POST",
    path: "/products",
    options: {
      validate: {
        payload: Joi.object({
          name: Joi.string().min(5).required(),
          unitprice: Joi.number().min(5).required(),
          sku: Joi.string().min(5).required(),
          description: Joi.string(),
        }),
        failAction: (request, h, error) => {
          return error.isJoi
            ? h.response(error.details[0]).takeover()
            : h.response(error).takeover();
        },
      },
    },
    handler: async (request, h) => {
      try {
        const product = new Product(request.payload);
        const productSaved = await product.save();
        return h.response(productSaved);
      } catch (error) {
        return h.response(error).code(500);
      }
    },
  });

  server.route({
    method: "GET",
    path: "/products",
    handler: async (request, h) => {
      try {
        const products = await Product.find();
        return h.response(products);
      } catch (error) {
        return h.response(error).code(500);
      }
    },
  });

  server.route({
    method: "GET",
    path: "/products/{id}",
    handler: async (request, h) => {
      try {
        const product = await Product.findById(request.params.id);
        return h.response(product);
      } catch (error) {
        return h.response(error).code(500);
      }
    },
  });

  server.route({
    method: "PUT",
    path: "/products/{id}",
    options: {
      validate: {
        payload: Joi.object({
          name: Joi.string().optional(),
          unitprice: Joi.number().optional(),
          sku: Joi.string().required(),
          description: Joi.string().optional(),
        }),
        failAction: (request, h, error) => {
          return error.isJoi
            ? h.response(error.details[0]).takeover()
            : h.response(error).takeover();
        },
      },
    },
    handler: async (request, h) => {
      try {
        const updatedProduct = await Product.findByIdAndUpdate(
          request.params.id,
          request.payload,
          {
            new: true,
          }
        );
        return h.response(updatedProduct);
      } catch (error) {
        return h.response(error).code(500);
      }
    },
  });

  server.route({
    method: "DELETE",
    path: "/products/{id}",
    handler: async (request, h) => {
      try {
        const deletedProduct = await Product.findByIdAndDelete(
          request.params.id
        );
        return h.response(deletedProduct);
      } catch (error) {
        return h.response(error).code(500);
      }
    },
  });

  await server.start();
  console.log(`Server running on ${server.info.uri}`);
};

process.on("unhandledRejection", (err) => {
  console.log(err);
  process.exit(1);
});

init();
