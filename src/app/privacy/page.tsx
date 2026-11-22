import { LegalDocumentView, legalMetadata } from '@/components/legal/LegalDocumentView';

const SLUG = 'privacy';

export const generateMetadata = () => legalMetadata(SLUG, '/privacy');

export default function Page() {
  return <LegalDocumentView slug={SLUG} />;
}
