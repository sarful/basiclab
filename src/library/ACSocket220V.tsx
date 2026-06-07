"use client";

type Props = {
  className?: string;
  width?: number;
};

export default function ACSocket220V({ className = "", width = 900 }: Props) {
  return (
    <div className={`w-full flex justify-center ${className}`}>
      <svg
        width={width}
        viewBox="0 0 1200 760"
        xmlns="http://www.w3.org/2000/svg"
        className="max-w-full"
      >
        <defs>
          <linearGradient id="plate" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="55%" stopColor="#eeeeea" />
            <stop offset="100%" stopColor="#d8d8d4" />
          </linearGradient>

          <linearGradient id="darkHole" x1="0" x2="1">
            <stop offset="0%" stopColor="#050505" />
            <stop offset="55%" stopColor="#15130f" />
            <stop offset="100%" stopColor="#000000" />
          </linearGradient>

          <linearGradient id="switchFace" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="65%" stopColor="#f5f5f2" />
            <stop offset="100%" stopColor="#cfcfcb" />
          </linearGradient>

          <filter id="shadow">
            <feDropShadow
              dx="0"
              dy="16"
              stdDeviation="16"
              floodOpacity="0.22"
            />
          </filter>
        </defs>

        <g filter="url(#shadow)">
          <rect
            x="65"
            y="45"
            width="1070"
            height="665"
            rx="42"
            fill="url(#plate)"
          />
          <rect
            x="165"
            y="120"
            width="870"
            height="560"
            rx="22"
            fill="none"
            stroke="#777"
            strokeWidth="3"
          />
          <rect
            x="170"
            y="126"
            width="860"
            height="548"
            rx="18"
            fill="none"
            stroke="#fff"
            strokeWidth="2"
          />

          <rect
            x="215"
            y="180"
            width="560"
            height="455"
            rx="20"
            fill="url(#plate)"
            stroke="#9b9b98"
            strokeWidth="3"
          />

          <text x="335" y="405" fontSize="38" fill="#333" fontFamily="Arial">
            220V
          </text>

          <text x="585" y="405" fontSize="38" fill="#333" fontFamily="Arial">
            AC
          </text>

          {/* Upper universal socket */}
          <g>
            <circle cx="495" cy="300" r="48" fill="url(#darkHole)" />
            <rect
              x="470"
              y="228"
              width="50"
              height="85"
              rx="15"
              fill="url(#darkHole)"
            />
            <circle cx="495" cy="404" r="39" fill="url(#darkHole)" />
            <rect
              x="468"
              y="365"
              width="54"
              height="75"
              rx="10"
              fill="url(#darkHole)"
            />
            <rect
              x="485"
              y="240"
              width="18"
              height="68"
              rx="8"
              fill="#7b4618"
              opacity=".75"
            />
          </g>

          {/* Left lower socket */}
          <g>
            <path
              d="M305 500 H350 L370 485 H410 Q420 485 420 495 V555 Q420 565 410 565 H370 L350 550 H305 Z"
              fill="url(#darkHole)"
            />
            <path
              d="M298 492 H350 L370 477 H415 Q432 477 432 494 V560 Q432 577 415 577 H370 L350 560 H298 Z"
              fill="none"
              stroke="#fff"
              strokeWidth="8"
              opacity=".55"
            />
            <rect
              x="405"
              y="495"
              width="14"
              height="65"
              rx="5"
              fill="#7b4618"
              opacity=".65"
            />
          </g>

          {/* Right lower socket */}
          <g>
            <path
              d="M685 500 H640 L620 485 H580 Q570 485 570 495 V555 Q570 565 580 565 H620 L640 550 H685 Z"
              fill="url(#darkHole)"
            />
            <path
              d="M692 492 H640 L620 477 H575 Q558 477 558 494 V560 Q558 577 575 577 H620 L640 560 H692 Z"
              fill="none"
              stroke="#fff"
              strokeWidth="8"
              opacity=".55"
            />
            <rect
              x="570"
              y="495"
              width="14"
              height="65"
              rx="5"
              fill="#7b4618"
              opacity=".65"
            />
          </g>

          {/* Switch */}
          <g>
            <rect
              x="835"
              y="220"
              width="145"
              height="350"
              rx="10"
              fill="#060606"
            />
            <rect
              x="845"
              y="230"
              width="125"
              height="330"
              rx="8"
              fill="url(#switchFace)"
            />
            <rect
              x="848"
              y="230"
              width="119"
              height="300"
              rx="8"
              fill="#f8f8f6"
            />
            <rect
              x="885"
              y="260"
              width="58"
              height="12"
              rx="6"
              fill="#f31918"
              stroke="#9b0000"
            />
            <rect
              x="852"
              y="525"
              width="115"
              height="35"
              rx="6"
              fill="#d4d4d0"
            />
          </g>
        </g>
      </svg>
    </div>
  );
}
