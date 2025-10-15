'use client'
import HeaderExplorePage from "@/components/explore_page/header.page";
import Footer from "@/components/footer";

const ExploreLayout = ({ children }: { children: React.ReactNode }) => {

    return (
        <>
            <div className="h-screen w-screen overflow-auto">
                <div className="mb-[64px] md:mb-[68px] lg:mb-[72px]">
                    <HeaderExplorePage />
                </div>
                <main className="">
                    {children}
                </main>
                <div className="mt-5">
                    <Footer />
                </div>
            </div>
        </>
    )
}

export default ExploreLayout;