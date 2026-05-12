export function formatPostWithCounts<
  T extends { _count: { likes: number; comments: number } }
>(post: T) {
  const { _count, ...postData } = post;

  return {
    ...postData,
    likeCount: _count.likes,
    commentCount: _count.comments
  };
}
