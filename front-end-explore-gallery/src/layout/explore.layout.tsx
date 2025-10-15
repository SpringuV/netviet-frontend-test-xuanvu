'use client'
import HeaderExplorePage from "@/components/explore_page/header.page";
import Footer from "@/components/footer";

const ExploreLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <>
            <div className="mb-[17%] md:mb-[20%]">
                <HeaderExplorePage />
            </div>
            {children}
            <div>
                <Footer />
            </div>
        </>
    )
}

export default ExploreLayout;