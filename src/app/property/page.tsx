import { PublicLayout } from "@/components/layout/PublicLayout";
import { PropertyDetailsPage } from "@/components/pages/PropertyDetailsPage";

interface PropertyDetailsPageProps {
  searchParams: Promise<{ id?: string }>;
}

export default async function PropertyDetails({
  searchParams,
}: PropertyDetailsPageProps) {
  const { id } = await searchParams;

  return (
    <PublicLayout>
      <PropertyDetailsPage propertyId={id || ""} />
    </PublicLayout>
  );
}
