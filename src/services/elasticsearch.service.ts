import { getDocumentById } from '@auth/elasticsearch';

export async function getGigDetail(index: string, gigId: string) {
  const gig = await getDocumentById(index, gigId);
  return gig;
}
