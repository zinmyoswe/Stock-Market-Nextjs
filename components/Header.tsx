import React from 'react'
import Link from "next/link";
import Image from "next/image";
import NavItems from "@/components/NavItems";
import UserDropdown from "@/components/UserDropdown";

const Header = ({user} : { user:User}) => {
    return (
        <header className="sticty top-0 header">
            <div className="container header-wrapper">
                <Link href="/">
                    <Image src="/assets/icons/logo6.png"
                           alt="Stock Market Peach"
                           width={140}
                           height={42}
                           className="h-10 w-auto cursor-pointer"
                    />
                </Link>

                <nav className="hidden sm:block">
                    <NavItems />
                </nav>

                <UserDropdown user={user} />
            </div>
        </header>
    )
}
export default Header
