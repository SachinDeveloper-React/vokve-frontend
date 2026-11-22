import { LegalDocumentView, legalMetadata } from '@/components/legal/LegalDocumentView';

const SLUG = 'rewards-policy';

export const generateMetadata = () => legalMetadata(SLUG, '/rewards-policy');

export default function Page() {
  return <LegalDocumentView slug={SLUG} />;
}
