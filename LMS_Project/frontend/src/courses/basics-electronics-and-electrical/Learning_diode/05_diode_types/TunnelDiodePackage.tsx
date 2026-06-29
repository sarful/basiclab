"use client";

type TunnelDiodeProps = {
  className?: string;
  partNumber?: string;
};

export default function TunnelDiode({ className = "", partNumber }: TunnelDiodeProps) {
  return (
    <div
      className={`relative flex min-h-[260px] w-full items-center justify-center overflow-visible bg-[#ececec] px-8 py-6 sm:px-12 ${className}`}
      role="img"
      aria-label={partNumber ? `Tunnel diode physical component ${partNumber}` : "Tunnel diode physical component"}
    >
      {/* Whole diode */}
      <div className="relative h-[220px] w-[580px] rotate-[10deg] scale-[0.92] sm:scale-[0.96] md:scale-100">
        {/* Leads */}
        <div
          className="absolute left-[-250px] top-[50%] h-[7px] w-[258px] rounded-full"
          style={{
            background: "linear-gradient(90deg,#7a5a1b,#c79a39,#8b6522,#d2a74d)",
            transform: "translateY(-50%)",
            boxShadow: "0 0 1px rgba(0,0,0,.3), inset 0 1px 1px rgba(255,255,255,.4)",
          }}
        />

        <div
          className="absolute right-[-250px] top-[50%] h-[7px] w-[258px] rounded-full"
          style={{
            background: "linear-gradient(90deg,#cfa64b,#8f6724,#c59a42,#73551d)",
            transform: "translateY(-50%)",
            boxShadow: "0 0 1px rgba(0,0,0,.3), inset 0 1px 1px rgba(255,255,255,.4)",
          }}
        />

        {/* Tunnel diode body */}
        <div className="relative h-[52px] w-[72px]">
          {/* Main cylinder */}
          <div
            className="absolute inset-0 rounded-[14px]"
            style={{
              background: `
                linear-gradient(
                  90deg,
                  #6f4d11 0%,
                  #d6ae59 14%,
                  #f2d27f 30%,
                  #c99736 48%,
                  #f0cb74 68%,
                  #a87521 100%
                )
              `,
              boxShadow: `
                inset -8px 0 10px rgba(0,0,0,.25),
                inset 5px 0 8px rgba(255,255,255,.25),
                0 4px 10px rgba(0,0,0,.18)
              `,
            }}
          />

          {/* Left flange */}
          <div
            className="absolute left-[-5px] top-[6px] h-[40px] w-[11px] rounded-full"
            style={{
              background: "linear-gradient(90deg,#7d5818,#e2bd6a,#8f6622)",
            }}
          />

          {/* Right flange */}
          <div
            className="absolute right-[-5px] top-[4px] h-[44px] w-[12px] rounded-full"
            style={{
              background: "linear-gradient(90deg,#8f6721,#efc971,#916822)",
            }}
          />

          {/* Right opening */}
          <div
            className="absolute right-[-2px] top-1/2 h-[20px] w-[13px] -translate-y-1/2 rounded-full"
            style={{
              background: "radial-gradient(circle,#b5842f 10%,#6f4b12 65%,#4a3208 100%)",
            }}
          />

          {/* Printed marking */}
          <div
            className="absolute left-[20px] top-[12px] select-none text-[18px] font-black text-black rotate-[82deg]"
            style={{
              filter: "blur(.2px)",
              opacity: 0.9,
            }}
          >
            E
          </div>

          <div
            className="absolute left-[25px] top-[28px] h-[6px] w-[18px] rounded bg-black"
            style={{
              transform: "rotate(82deg)",
            }}
          />

          {/* Specular highlight */}
          <div
            className="absolute left-[18px] top-[6px] h-[38px] w-[16px] rounded-full"
            style={{
              background: "linear-gradient(to bottom,rgba(255,255,255,.55),transparent)",
              filter: "blur(2px)",
            }}
          />
        </div>
      </div>
    </div>
  );
}
