import Loading from "./loading";
export default function UserCard({ name, buddy }) {
  return (
    <div className="bg-white rounded-lg flex flex-col items-center justify-center h-64 w-64 space-y-4">
      {!buddy ? (
        <svg
          viewBox="0 0 36 36"
          fill="none"
          role="img"
          xmlns="http://www.w3.org/2000/svg"
          width="80"
          height="80"
        >
          <mask
            id=":ru:"
            maskUnits="userSpaceOnUse"
            x="0"
            y="0"
            width="36"
            height="36"
          >
            <rect width="36" height="36" rx="72" fill="#FFFFFF"></rect>
          </mask>
          <g mask="url(#:ru:)">
            <rect width="36" height="36" fill="#f78376"></rect>
            <rect
              x="0"
              y="0"
              width="36"
              height="36"
              transform="translate(8 -4) rotate(198 18 18) scale(1)"
              fill="#8f3c68"
              rx="6"
            ></rect>
            <g transform="translate(4 0) rotate(-8 18 18)">
              <path
                d="M15 19c2 1 4 1 6 0"
                stroke="#FFFFFF"
                fill="none"
                strokeLinecap="round"
              ></path>
              <rect
                x="11"
                y="14"
                width="1.5"
                height="2"
                rx="1"
                stroke="none"
                fill="#FFFFFF"
              ></rect>
              <rect
                x="23"
                y="14"
                width="1.5"
                height="2"
                rx="1"
                stroke="none"
                fill="#FFFFFF"
              ></rect>
            </g>
          </g>
        </svg>
      ) : (
        <svg
          viewBox="0 0 36 36"
          fill="none"
          role="img"
          xmlns="http://www.w3.org/2000/svg"
          width="80"
          height="80"
        >
          <mask
            id=":r11:"
            maskUnits="userSpaceOnUse"
            x="0"
            y="0"
            width="36"
            height="36"
          >
            <rect width="36" height="36" rx="72" fill="#FFFFFF"></rect>
          </mask>
          <g mask="url(#:r11:)">
            <rect width="36" height="36" fill="#c6a9ac"></rect>
            <rect
              x="0"
              y="0"
              width="36"
              height="36"
              transform="translate(7 7) rotate(333 18 18) scale(1)"
              fill="#e64e81"
              rx="6"
            ></rect>
            <g transform="translate(3.5 3.5) rotate(-3 18 18)">
              <path d="M13,19 a1,0.75 0 0,0 10,0" fill="#000000"></path>
              <rect
                x="11"
                y="14"
                width="1.5"
                height="2"
                rx="1"
                stroke="none"
                fill="#000000"
              ></rect>
              <rect
                x="23"
                y="14"
                width="1.5"
                height="2"
                rx="1"
                stroke="none"
                fill="#000000"
              ></rect>
            </g>
          </g>
        </svg>
      )}
      {!buddy && <h1 className="font-josefinBold text-black">{name}</h1>}
      {buddy ? (
        <Loading />
      ) : (
        <div className="flex items-center space-x-2">
          <span className="inline-block h-3 w-3 rounded-full bg-green-500"></span>
          <span className="text-green-700">Connected</span>
        </div>
      )}
    </div>
  );
}
