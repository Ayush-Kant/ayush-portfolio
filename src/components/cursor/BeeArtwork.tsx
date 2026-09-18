import styles from "./BeeCursor.module.css";

export default function BeeArtwork() {
  return (
    <svg
      className={styles.artwork}
      viewBox="0 0 48 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <linearGradient
          id="bee-body-gradient"
          x1="10"
          y1="8"
          x2="39"
          y2="28"
        >
          <stop
            offset="0"
            stopColor="#FFE875"
          />
          <stop
            offset="1"
            stopColor="#EFB331"
          />
        </linearGradient>

        <linearGradient
          id="bee-wing-gradient"
          x1="5"
          y1="4"
          x2="37"
          y2="18"
        >
          <stop
            offset="0"
            stopColor="#FFFFFF"
            stopOpacity="0.92"
          />
          <stop
            offset="0.62"
            stopColor="#E4D9FF"
            stopOpacity="0.74"
          />
          <stop
            offset="1"
            stopColor="#B29AFF"
            stopOpacity="0.28"
          />
        </linearGradient>
      </defs>

      <g className={styles.wingLeft}>
        <path
          d="M17.7 12.3C11.1 5.8 6.3 6.3 5.2 10.1C4.2 13.8 8.1 17.6 15.8 17"
          fill="url(#bee-wing-gradient)"
          stroke="#FFFFFF"
          strokeOpacity="0.82"
          strokeWidth="0.9"
        />
      </g>

      <g className={styles.wingRight}>
        <path
          d="M25.7 10.7C29.1 4.4 35 3.4 37.6 6.6C40 9.6 36.4 14.4 29 15.4"
          fill="url(#bee-wing-gradient)"
          stroke="#FFFFFF"
          strokeOpacity="0.86"
          strokeWidth="0.9"
        />
      </g>

      <path
        d="M19.2 9.5C16.9 6.5 17 3.6 19 2"
        stroke="#29212B"
        strokeWidth="1"
        strokeLinecap="round"
      />

      <path
        d="M23.2 8.8C22.9 5.8 24.2 3.3 26.4 2.6"
        stroke="#29212B"
        strokeWidth="1"
        strokeLinecap="round"
      />

      <circle
        cx="19"
        cy="1.9"
        r="1.08"
        fill="#29212B"
      />

      <circle
        cx="26.7"
        cy="2.6"
        r="1.08"
        fill="#29212B"
      />

      <g className={styles.body}>
        <ellipse
          cx="21.5"
          cy="18.2"
          rx="11.7"
          ry="7.45"
          fill="url(#bee-body-gradient)"
          stroke="#28202A"
          strokeWidth="1"
        />

        <path
          d="M15 11.9C13.9 15.2 14.1 20.6 15.5 23.9"
          stroke="#28202A"
          strokeWidth="2.5"
          strokeLinecap="round"
        />

        <path
          d="M20.7 10.8C19.8 14.7 20 21.9 21.2 25.2"
          stroke="#28202A"
          strokeWidth="2.5"
          strokeLinecap="round"
        />

        <path
          d="M26.3 11.1C25.3 14.3 25.5 19.9 26.8 23.8"
          stroke="#28202A"
          strokeWidth="2.4"
          strokeLinecap="round"
        />

        <circle
          cx="30.1"
          cy="15.2"
          r="0.86"
          fill="#FFFFFF"
        />

        <circle
          cx="33.1"
          cy="15.4"
          r="0.86"
          fill="#FFFFFF"
        />

        <circle
          cx="30.12"
          cy="15.25"
          r="0.34"
          fill="#28202A"
        />

        <circle
          cx="33.12"
          cy="15.45"
          r="0.34"
          fill="#28202A"
        />

        <path
          d="M30 18.1C30.8 18.9 32.1 19 33 18.2"
          stroke="#FFFFFF"
          strokeOpacity="0.9"
          strokeWidth="0.65"
          strokeLinecap="round"
        />

        <ellipse
          cx="29.1"
          cy="18.2"
          rx="1.12"
          ry="0.62"
          fill="#EE91A1"
          opacity="0.72"
        />
      </g>

      <path
        d="M9.7 17.8L5 18.9L9.8 20.3"
        fill="#28202A"
      />
    </svg>
  );
}
