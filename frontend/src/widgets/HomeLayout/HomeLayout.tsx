'use client';

import { observer } from "mobx-react-lite";
import { BottomPlayer, Header, MobileMenu, Sidebar } from "@/widgets";

export const HomeLayout = observer(
    ({ children }: { children: React.ReactNode }) => {
        return (
            <>
                <div className="flex w-full h-full relative">
                    <Sidebar />

                    <MobileMenu />

                    <main className="grow w-full relative overflow-y-auto overflow-x-hidden">
                        <Header />

                        <div className="grow mx-[15px] h-full w-[calc(100%-30px)]">
                            {children}
                        </div>
                    </main>
                </div>

                <BottomPlayer />
            </>
        );
    }
);