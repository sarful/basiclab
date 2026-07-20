export default function OhmsLawMatrixTable() {
  const stroke = 2;

  const textStyle = {
    fontFamily: "Arial, Helvetica, sans-serif",
    fill: "black",
  };

  const titleStyle = {
    ...textStyle,
    fontSize: 24,
    fontWeight: "bold",
  };

  const headerStyle = {
    ...textStyle,
    fontSize: 16,
    fontWeight: "bold",
  };

  const bodyStyle = {
    ...textStyle,
    fontSize: 15,
  };

  const formulaStyle = {
    ...textStyle,
    fontSize: 20,
    fontWeight: "bold",
  };

  const x0 = 40;
  const y0 = 40;
  const tableWidth = 920;
  const titleHeight = 56;
  const headerHeight = 72;
  const rowHeight = 70;

  const colWidths = [155, 191, 191, 191, 192];
  const rowLabels = [
    "Current &\nResistance",
    "Voltage &\nCurrent",
    "Power &\nCurrent",
    "Voltage &\nResistance",
    "Power &\nResistance",
    "Voltage &\nPower",
  ];

  const headers = [
    "Known\nValues",
    "Resistance\n(R)",
    "Current\n(I)",
    "Voltage\n(V)",
    "Power\n(P)",
  ];

  const formulas = [
    ["---", "---", "V = I×R", "P = I²R"],
    ["R = V/I", "---", "---", "P = V×I"],
    ["R = P/I²", "---", "V = P/I", "---"],
    ["---", "I = V/R", "---", "P = V²/R"],
    ["---", "I = √(P/R)", "V = √(P×R)", "---"],
    ["R = V²/P", "I = P/V", "---", "---"],
  ];

  const getX = (columnIndex: number) => {
    let x = x0;
    for (let i = 0; i < columnIndex; i += 1) {
      x += colWidths[i];
    }
    return x;
  };

  const cellText = (
    text: string,
    x: number,
    y: number,
    width: number,
    height: number,
    style: Record<string, string | number>,
    lineHeight = 20
  ) => {
    const lines = text.split("\n");
    const startY = y + height / 2 - ((lines.length - 1) * lineHeight) / 2;

    return (
      <text
        x={x + width / 2}
        y={startY}
        textAnchor="middle"
        dominantBaseline="middle"
        style={style}
      >
        {lines.map((line, index) => (
          <tspan key={`${line}-${index}`} x={x + width / 2} dy={index === 0 ? 0 : lineHeight}>
            {line}
          </tspan>
        ))}
      </text>
    );
  };

  const cellRect = (x: number, y: number, width: number, height: number) => (
    <rect
      x={x}
      y={y}
      width={width}
      height={height}
      fill="white"
      stroke="black"
      strokeWidth={stroke}
    />
  );

  return (
    <main className="flex min-h-screen items-center justify-center bg-white p-6">
      <div className="w-full max-w-6xl bg-white">
        <svg
          viewBox="0 0 1000 600"
          className="h-auto w-full"
          xmlns="http://www.w3.org/2000/svg"
          role="img"
          aria-labelledby="title desc"
        >
          <title id="title">Ohms Law Matrix Table</title>
          <desc id="desc">
            Black and white Ohms Law matrix table showing formulas for
            resistance, current, voltage, and power based on known values.
          </desc>

          <rect width="1000" height="600" fill="white" />

          {/* Title row */}
          {cellRect(x0, y0, tableWidth, titleHeight)}
          <text
            x={x0 + tableWidth / 2}
            y={y0 + titleHeight / 2}
            textAnchor="middle"
            dominantBaseline="middle"
            style={titleStyle}
          >
            Ohms Law Formulas
          </text>

          {/* Column headers */}
          {headers.map((header, columnIndex) => {
            const x = getX(columnIndex);
            const y = y0 + titleHeight;
            const width = colWidths[columnIndex];

            return (
              <g key={header}>
                {cellRect(x, y, width, headerHeight)}
                {cellText(header, x, y, width, headerHeight, headerStyle, 20)}
              </g>
            );
          })}

          {/* Body rows */}
          {rowLabels.map((rowLabel, rowIndex) => {
            const y = y0 + titleHeight + headerHeight + rowIndex * rowHeight;

            return (
              <g key={rowLabel}>
                {/* Known values column */}
                {cellRect(getX(0), y, colWidths[0], rowHeight)}
                {cellText(rowLabel, getX(0), y, colWidths[0], rowHeight, bodyStyle, 18)}

                {/* Formula columns */}
                {formulas[rowIndex].map((formula, formulaIndex) => {
                  const columnIndex = formulaIndex + 1;
                  const x = getX(columnIndex);
                  const width = colWidths[columnIndex];

                  return (
                    <g key={`${rowIndex}-${formulaIndex}`}>
                      {cellRect(x, y, width, rowHeight)}
                      {cellText(formula, x, y, width, rowHeight, formulaStyle, 20)}
                    </g>
                  );
                })}
              </g>
            );
          })}

          {/* Outer border */}
          <rect
            x={x0}
            y={y0}
            width={tableWidth}
            height={titleHeight + headerHeight + rowHeight * rowLabels.length}
            fill="none"
            stroke="black"
            strokeWidth="4"
          />
        </svg>
      </div>
    </main>
  );
}
