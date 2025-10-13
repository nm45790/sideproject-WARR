interface IconProps {
  className?: string;
}

export const CloseIcon = ({ className }: IconProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="17"
      height="17"
      viewBox="0 0 17 17"
      fill="none"
      className={className}
    >
      <path
        d="M8.5 10.3099L2.1654 16.6445C1.92839 16.8815 1.62674 17 1.26046 17C0.89417 17 0.592522 16.8815 0.355513 16.6445C0.118504 16.4075 0 16.1058 0 15.7395C0 15.3733 0.118504 15.0716 0.355513 14.8346L6.69011 8.5L0.355513 2.1654C0.118504 1.92839 0 1.62674 0 1.26046C0 0.89417 0.118504 0.592522 0.355513 0.355513C0.592522 0.118504 0.89417 0 1.26046 0C1.62674 0 1.92839 0.118504 2.1654 0.355513L8.5 6.69011L14.8346 0.355513C15.0716 0.118504 15.3733 0 15.7395 0C16.1058 0 16.4075 0.118504 16.6445 0.355513C16.8815 0.592522 17 0.89417 17 1.26046C17 1.62674 16.8815 1.92839 16.6445 2.1654L10.3099 8.5L16.6445 14.8346C16.8815 15.0716 17 15.3733 17 15.7395C17 16.1058 16.8815 16.4075 16.6445 16.6445C16.4075 16.8815 16.1058 17 15.7395 17C15.3733 17 15.0716 16.8815 14.8346 16.6445L8.5 10.3099Z"
        fill="currentColor"
      />
    </svg>
  );
};

export const CheckboxIcon = ({
  className,
  checked,
}: IconProps & { checked?: boolean }) => {
  if (checked) {
    return (
      <svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
      >
        <circle cx="10" cy="10" r="10" fill="#3F55FF" />
        <path
          d="M6 10L9 13L14 7"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <circle cx="10" cy="10" r="9.5" fill="white" stroke="#D2D2D2" />
    </svg>
  );
};

export const ArrowLeftIcon = ({ className }: IconProps) => {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M15 18L9 12L15 6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export const ArrowDownIcon = ({ className }: IconProps) => {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M4 6L8 10L12 6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export const PrevIcon = ({ className }: IconProps) => {
  return (
    <svg
      width="26"
      height="22"
      viewBox="0 0 26 22"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M11.3047 0C11.6048 0 11.8932 0.115826 12.1055 0.322266C12.3177 0.528791 12.4365 0.809491 12.4365 1.10156C12.4364 1.3935 12.3176 1.67343 12.1055 1.87988L3.85742 9.90332H24.8701C25.1698 9.90336 25.457 10.0194 25.6689 10.2256C25.8809 10.4318 26 10.7113 26 11.0029C26 11.2946 25.8809 11.575 25.6689 11.7812C25.457 11.9872 25.1697 12.1025 24.8701 12.1025H3.86426L12.1055 20.1201C12.3176 20.3265 12.4364 20.6065 12.4365 20.8984C12.4365 21.1905 12.3177 21.4712 12.1055 21.6777C11.8932 21.8842 11.6048 22 11.3047 22C11.0047 21.9999 10.717 21.8841 10.5049 21.6777L0.332031 11.7783C0.226836 11.6762 0.14292 11.5554 0.0859375 11.4219C0.0289526 11.2883 0 11.1447 0 11C7.92695e-06 10.8553 0.0289603 10.7117 0.0859375 10.5781C0.142919 10.4446 0.226862 10.3238 0.332031 10.2217L10.5049 0.322266C10.717 0.11594 11.0048 0.000124262 11.3047 0Z"
        fill="black"
      />
    </svg>
  );
};

const Icons = {
  Close: CloseIcon,
  Checkbox: CheckboxIcon,
  ArrowLeft: ArrowLeftIcon,
  ArrowDown: ArrowDownIcon,
  Prev: PrevIcon,
};

export default Icons;
