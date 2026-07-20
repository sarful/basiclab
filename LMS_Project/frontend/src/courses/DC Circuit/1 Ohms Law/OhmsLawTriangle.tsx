export default function OhmsLawTriangle() {
  const stroke = 4;

  const textStyle = {
    fontFamily: 'Times New Roman, serif',
    fill: 'black',
    fontWeight: 'bold',
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-white p-6">
      <div className="w-full max-w-md bg-white">
        <svg
          viewBox="0 0 400 420"
          className="h-auto w-full"
          xmlns="http://www.w3.org/2000/svg"
          role="img"
          aria-labelledby="title desc"
        >
          <title id="title">Ohms Law Triangle</title>
          <desc id="desc">
            Black and white Ohms Law Triangle with V at the top, I at the
            bottom-left, and R at the bottom-right.
          </desc>

          <rect width="400" height="420" fill="white" />

          <polygon
            points="200,20 20,340 380,340"
            fill="white"
            stroke="black"
            strokeWidth={stroke}
            strokeLinejoin="round"
          />

          <line
            x1="74"
            y1="180"
            x2="326"
            y2="180"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          <line
            x1="200"
            y1="180"
            x2="200"
            y2="340"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          <text
            x="200"
            y="125"
            textAnchor="middle"
            dominantBaseline="middle"
            style={{ ...textStyle, fontSize: 52 }}
          >
            V
          </text>

          <text
            x="125"
            y="265"
            textAnchor="middle"
            dominantBaseline="middle"
            style={{ ...textStyle, fontSize: 52 }}
          >
            I
          </text>

          <text
            x="275"
            y="265"
            textAnchor="middle"
            dominantBaseline="middle"
            style={{ ...textStyle, fontSize: 52 }}
          >
            R
          </text>
        </svg>
      </div>
    </main>
  );
}
