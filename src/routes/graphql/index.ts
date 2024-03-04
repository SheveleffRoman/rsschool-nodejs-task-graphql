import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { createGqlResponseSchema, gqlResponseSchema } from './schemas.js';
import { graphql, parse, validate } from 'graphql';
import depthLimit from 'graphql-depth-limit';
import { getAllRestHandlers } from './handlers/handlers.js';
import { getDataLoaders } from './loaders/getDataLoaders.js';
import { MyAppSchema } from './rootSchema.js';

const plugin: FastifyPluginAsyncTypebox = async (fastify) => {
  const { prisma } = fastify;

  fastify.route({
    url: '/',
    method: 'POST',
    schema: {
      ...createGqlResponseSchema,
      response: {
        200: gqlResponseSchema,
      },
    },
    async handler(req) {
      const { query, variables } = req.body;
      const errors = validate(MyAppSchema, parse(query), [depthLimit(5)]);
      if (errors.length) {
        return { errors };
      }
      const response = await graphql({
        schema: MyAppSchema,
        source: query,
        rootValue: getAllRestHandlers(),
        variableValues: variables,
        contextValue: { prisma: prisma, ...getDataLoaders(prisma) },
      });
      return response;
    },
  });
};

export default plugin;
