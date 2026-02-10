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

        <main className="grow-0 w-full relative overflow-y-auto overflow-x-hidden pt-[50px] pb-[110px]">
          <Header />
          <div className="mx-[10px] h-full w-[calc(100%-20px)]">
            {children}
          </div>
        </main>
      </div>

      <BottomPlayer />
    </>
  );
}
