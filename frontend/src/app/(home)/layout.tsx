import { HomeLayout } from "@/widgets";

export default function Layout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return <HomeLayout>{children}</HomeLayout>;
}