import { isAuthenticated } from "../../../middlewares";
import { prisma } from "../../../../generated/prisma-client";

export default {
  Mutation: {
    toggleLike: async (_, args, { request }) => {
      isAuthenticated(request);
      const { postId } = args;
      const { user } = request;

      const filterOptions = {
        AND: [
          {
            user: {
              id: user.id,
            },
          },
          {
            post: {
              id: postId,
            },
          },
        ],
      };
      try {
        const existingLike = await prisma.$exists.like(filterOptions);
        if (existingLike) {
          await prisma.deleteManyLikes(filterOptions);
          //다수의 Like 레코드를 삭제하는 이유는 무엇인가요?
          // 두 가지 이유가 있습니다.

          // 백앤드가 서버리스(AWS 람다) 환경에서 실행되기 때문에, 타임아웃이 발생하면 다수의 동일한 Like 레코드가 생성될 수 있습니다.
          // Post 컴포넌트에서 랜더링 관련 실수를 하면 다수의 동일한 Like 레코드가 생성될 수 있습니다.
        } else {
          await prisma.createLike({
            user: {
              connect: {
                id: user.id,
              },
            },
            post: {
              connect: {
                id: postId,
              },
            },
          });
        }
        return true;
      } catch {
        return false;
      }
    },
  },
};
