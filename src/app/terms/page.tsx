import { LegalDocumentView, legalMetadata } from '@/components/legal/LegalDocumentView';

const SLUG = 'terms';

export const generateMetadata = () => legalMetadata(SLUG, '/terms');

export default function Page() {
  return <LegalDocumentView slug={SLUG} />;
}
