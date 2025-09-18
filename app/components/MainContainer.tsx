import Header from "./Header";

export const MainContainer = ({
  children,
  visibleHeader = false,
  headerLeft,
  headerCenter,
  headerRight,
  className,
}: {
  children: React.ReactNode;
  visibleHeader?: boolean;
  headerLeft?: React.ReactNode;
  headerCenter?: React.ReactNode;
  headerRight?: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className="w-full flex justify-center">
      <div
        className={`mx-auto w-full max-w-[768px] min-h-dvh flex flex-col ${className || ""}`}
        style={{
          paddingLeft: "var(--safe-left)",
          paddingRight: "var(--safe-right)",
        }}
      >
        {visibleHeader && (
          <Header left={headerLeft} center={headerCenter} right={headerRight} />
        )}
        <main
          className="flex-1"
          style={{ paddingBottom: "var(--safe-bottom)" }}
        >
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainContainer;
