import ProductsPage from "@/components/explore_page/content.page";
import { getPostMetadata } from "@/lib/metadata";
import { Metadata } from "next";

// 1️⃣ generateMetadata cho trang
export async function generateMetadata(): Promise<Metadata> {
  const meta = await getPostMetadata("Explore Gallery");
  return {
    title: meta.title,
    description: meta.description,
  };
}

export default async function Home() {
    return (
        <>
            <div id="explore-list">
                <ProductsPage />
            </div>
        </>
    );
}
