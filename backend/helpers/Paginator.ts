import { RequestGetNFTsQuery } from "./RequestType";

export const getPaginationFromQuery = (query: RequestGetNFTsQuery) => {
  let offset: number = 30;
  let nextPage: number = 1;
  const MAX_OFFSET = 100;

  if (query.offset) {
    query.offset = +query.offset;
  } else {
    query.offset = offset;
  }

  offset =
    query.offset <= MAX_OFFSET && query.offset > 0 ? +query.offset : offset;

  nextPage = query.nextPage ? +query.nextPage : nextPage;

  let skip: number = (nextPage - 1) * offset;

  nextPage++;

  return { nextPage, offset, skip };
};
