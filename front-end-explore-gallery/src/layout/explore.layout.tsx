'use client'
import HeaderExplorePage from "@/components/explore_page/header.page";
import Footer from "@/components/footer";

const ExploreLayout = ({ children }: { children: React.ReactNode }) => {

    return (
        <>
            <header id="explore-header">
                <HeaderExplorePage />
            </header>
            <main className="mt-16 md:mt-[68px] lg:mt-[72px]">
                {children}
            </main>
            <div>
                <Footer />
            </div>
        </>
    )
}

export default ExploreLayout;