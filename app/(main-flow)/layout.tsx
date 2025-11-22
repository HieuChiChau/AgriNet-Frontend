export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <div className="homepage bg-blue">
      <div className="content-wrap">
        {children}
      </div>
    </div>
  );
}
