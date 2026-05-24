import { urls } from '@/api/urls';
import { mapReview, mapReviewList } from '@/lib/mappers';
import { apiRequest } from '@/services/apiClient';
import type { Review, ReviewCreateRequest } from '@/types/api';

export async function getReviews(): Promise<Review[]> {
  const raw = await apiRequest<unknown>(urls.review.list);
  return mapReviewList(raw);
}

export async function getReviewById(id: number): Promise<Review> {
  const raw = await apiRequest<unknown>(urls.review.byId(id));
  return mapReview(raw);
}

export async function createReview(data: ReviewCreateRequest): Promise<Review> {
  const raw = await apiRequest<unknown>(urls.review.list, {
    method: 'POST',
    body: data,
  });
  return mapReview(raw);
}
