import { prisma } from "../../../../generated/prisma-client";

export default {
  Query: {
    searchUser: async (_, args) => {
      const { term } = args;
      const users = prisma.users({
        where: {
          OR: [
            { username_contains: term },
            { lastName_contains: term },
            { lastName_contains: term },
          ],
        },
      });
      return users;
    },
  },
};
