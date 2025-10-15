'use client'
import HeaderExplorePage from "@/components/explore_page/header.page";

const ExploreLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <>
            <HeaderExplorePage/>
            {children}
        </>
    )
}

export default ExploreLayout;