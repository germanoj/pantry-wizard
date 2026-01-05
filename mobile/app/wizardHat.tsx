import React from "react";
import Svg, { Path } from "react-native-svg";

const WizardHatIcon = ({
  size = 24,
  color = "#000",
  strokeWidth = 2,
}) => {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <Path
        fill={color}
        d="M21 22H3v-2h18zm-2-3H5l6.1-16.4q.3-.6.9-.6l6 3h-4.1zM10 7.5l1.04.47L11.5 9l.47-1.03L13 7.5l-1.03-.47L11.5 6l-.46 1.03zm3 7.5l-2.06-.93L10 12l-.93 2.07L7 15l2.07.93L10 18l.94-2.07zm.97-3.03L15 11.5l-1.03-.47L13.5 10l-.46 1.03l-1.04.47l1.04.47l.46 1.03zm2 4L17 15.5l-1.03-.47L15.5 14l-.46 1.03l-1.04.47l1.04.47l.46 1.03z"
      />
    </Svg>
  );
};

export default WizardHatIcon;
