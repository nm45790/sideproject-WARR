import Header from "./Header";

export const MainContainer = ({
  children,
  headerLeft,
  headerCenter,
  headerRight,
}: {
  children: React.ReactNode;
  headerLeft: React.ReactNode;
  headerCenter: React.ReactNode;
  headerRight: React.ReactNode;
}) => {
  return (
    <div
      className="mx-auto w-full max-w-[768px] min-h-dvh flex flex-col"
      style={{
        paddingLeft: "var(--safe-left)",
        paddingRight: "var(--safe-right)",
      }}
    >
      <Header left={headerLeft} center={headerCenter} right={headerRight} />
      <main
        className="flex-1 px-4 py-4"
        style={{ paddingBottom: "var(--safe-bottom)" }}
      >
        {children}
      </main>
    </div>
  );
};

export default MainContainer;
