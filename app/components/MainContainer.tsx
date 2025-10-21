import { authService } from "../utils/auth";

export const MainContainer = ({
  children,
  className,
  bg = "white",
}: {
  children: React.ReactNode;
  className?: string;
  bg?: string;
}) => {
  return (
    <div className="w-full flex justify-center bg-gray-300">
      <div
        className={`mx-auto w-full max-w-[768px] min-h-dvh flex flex-col ${className || ""} bg-white`}
        style={{
          paddingLeft: "var(--safe-left)",
          paddingRight: "var(--safe-right)",
        }}
      >
        <main
          className="flex-1"
          style={{ paddingBottom: "var(--safe-bottom)" }}
        >
          <div
            className={`bg-[${bg}] relative w-full min-h-dvh px-5 flex flex-col`}
          >
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default MainContainer;
