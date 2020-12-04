import { prisma } from "../../../generated/prisma-client";

export default {
  User: {
    fullName: (parent) => {
      return `${parent.lastName} ${parent.firstName}`;
    },
    isSelf: (parent, _, { request }) => {
      const { user } = request;
      const { id: parentId } = parent;

      return user.id === parentId;
    },
    isFollowing: async (parent, _, { request }) => {
      const { user } = request;
      const { id: parentId } = parent;
      try {
        return prisma.$exists.user({
          AND: [{ id: user.id }, { following_some: { id: parentId } }],
        });
      } catch {
        return false;
      }
    },
  },
  Post: {
    isLiked: (parent, _, { request }) => {
      const { user } = request;
      const { id } = parent;

      return prisma.$exists.like({
        AND: [{ user: { id: user.id } }, { post: { id } }],
      });
    },
  },
};
