import { BottomPlayer, Header, Sidebar } from "@/widgets";


export default function HomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <div className="flex w-full h-full relative ">
        <Sidebar />

        <main className="w-full relative overflow-auto pt-[50px] pb-[110px]">
          <Header />
          <div className="mx-[10px] w-[calc(100%-20px)]">
            {children}
          </div>
        </main>
      </div>

      <BottomPlayer />
    </>
  );
}
