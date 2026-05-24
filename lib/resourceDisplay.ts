import type { Resource, ResourceDisplay, Review, UserProfile } from '@/types/api';

export function buildResourceDisplayList(
  resources: Resource[],
  users: UserProfile[],
  reviews: Review[]
): ResourceDisplay[] {
  const userById = new Map(users.map((u) => [u.id, u]));

  return resources.map((resource) => {
    const resourceReviews = reviews.filter((r) => r.resourceId === resource.id);
    const reviewCount = resourceReviews.length;
    const averageRating =
      reviewCount > 0
        ? resourceReviews.reduce((sum, r) => sum + r.rating, 0) / reviewCount
        : null;

    const owner = userById.get(resource.ownerId);

    return {
      ...resource,
      ownerName: owner?.fullName ?? `Owner #${resource.ownerId}`,
      averageRating,
      reviewCount,
    };
  });
}
