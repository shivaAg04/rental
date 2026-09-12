import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { Hero } from "@/components/hero";
import { ListingsSection } from "@/components/listings-section";
import { toRentalItem } from "@/lib/mappers";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function Home() {
  const items = await prisma.rentalItem.findMany({
    where: { active: true },
    include: { pricing: true, images: { orderBy: { order: "asc" } } },
    orderBy: { createdAt: "asc" },
  });

  return (
    <>
      <Header />
      <main className="flex-1">
        <Hero />
        <ListingsSection items={items.map(toRentalItem)} />
      </main>
      <Footer />
    </>
  );
}
