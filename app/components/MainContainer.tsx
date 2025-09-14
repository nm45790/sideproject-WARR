import Header from "./Header";

export const MainContainer = ({
  children,
  visibleHeader,
  headerLeft,
  headerCenter,
  headerRight,
}: {
  children: React.ReactNode;
  visibleHeader?: boolean;
  headerLeft?: React.ReactNode;
  headerCenter?: React.ReactNode;
  headerRight?: React.ReactNode;
}) => {
  return (
    <div
      className="mx-auto w-full max-w-[768px] min-h-dvh flex flex-col"
      style={{
        paddingLeft: "var(--safe-left)",
        paddingRight: "var(--safe-right)",
      }}
    >
      {visibleHeader && (
        <Header left={headerLeft} center={headerCenter} right={headerRight} />
      )}
      <main className="flex-1" style={{ paddingBottom: "var(--safe-bottom)" }}>
        {children}
      </main>
    </div>
  );
};

export default MainContainer;
