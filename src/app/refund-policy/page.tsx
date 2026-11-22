import { LegalDocumentView, legalMetadata } from '@/components/legal/LegalDocumentView';

const SLUG = 'refund-policy';

export const generateMetadata = () => legalMetadata(SLUG, '/refund-policy');

export default function Page() {
  return <LegalDocumentView slug={SLUG} />;
}
