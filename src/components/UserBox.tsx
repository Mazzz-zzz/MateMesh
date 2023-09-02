import React from "react";
import "./UserBox.css";

interface Props {
  dropshipping: string;
  cooking: string;
  styling: string;
  text: string;
  profile: string;
  textBox: string;
  className: any;
}

export const UserBox = ({
  dropshipping = "✅ dropshipping",
  cooking = "✅ Cooking",
  styling = "✅ Styling",
  text = "✅ CopyWriting",
  profile,
  textBox,
  className,
}: Props): JSX.Element => {
  return (
    <div className={`user-box ${className}`}>
      <div className={`overlap ${profile} ${textBox}`}>
        <div className="platform">
          <img
            className="vector-4"
            alt="Vector"
            src="https://generation-sessions.s3.amazonaws.com/1b66bd5cec3522c7f7a7221f76445de2/img/vector-31.svg"
          />
        </div>
        <img
          className="fire"
          alt="Fire"
          src={
            profile === "default"
              ? "https://generation-sessions.s3.amazonaws.com/1b66bd5cec3522c7f7a7221f76445de2/img/fire-12.svg"
              : "https://generation-sessions.s3.amazonaws.com/1b66bd5cec3522c7f7a7221f76445de2/img/fire-13.svg"
          }
        />
        <div className="ask">
          <div className="cars-wrapper">
            <div className="cars">
              {profile === "default" && <>✅ Cars</>}
              {profile !== "default" && <>{text}</>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
