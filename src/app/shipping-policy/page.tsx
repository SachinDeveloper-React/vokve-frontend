import { LegalDocumentView, legalMetadata } from '@/components/legal/LegalDocumentView';

const SLUG = 'shipping-policy';

export const generateMetadata = () => legalMetadata(SLUG, '/shipping-policy');

export default function Page() {
  return <LegalDocumentView slug={SLUG} />;
}
