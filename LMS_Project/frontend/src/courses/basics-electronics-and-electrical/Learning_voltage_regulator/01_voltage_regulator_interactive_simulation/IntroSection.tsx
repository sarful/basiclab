export default function IntroSection() {
  return (
    <div className="col-span-full rounded-3xl border bg-white p-5 shadow-sm">
      <h2 className="text-2xl font-black text-slate-900">
        What is a Voltage Regulator?
      </h2>
      <p className="mt-3 leading-relaxed text-slate-700">
        A voltage regulator is an electronic component or circuit that gives a
        stable output voltage even if the input voltage changes. It helps protect
        circuits from overvoltage, ripple, and unstable power.
      </p>
      <div className="mt-4 grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border bg-white p-4">
          <h3 className="font-black text-blue-700">78XX Series</h3>
          <p className="mt-2 text-sm text-slate-600">
            Positive fixed-voltage linear regulators. The last two digits show the
            output voltage. Example: 7805 = +5V, 7809 = +9V, 7812 = +12V.
          </p>
        </div>
        <div className="rounded-2xl border bg-white p-4">
          <h3 className="font-black text-red-700">79XX Series</h3>
          <p className="mt-2 text-sm text-slate-600">
            Negative fixed-voltage linear regulators. Example: 7905 = -5V and
            7912 = -12V. These are used when a circuit needs a negative supply.
          </p>
        </div>
        <div className="rounded-2xl border bg-white p-4">
          <h3 className="font-black text-green-700">LM317</h3>
          <p className="mt-2 text-sm text-slate-600">
            Adjustable positive linear regulator. You can set the output voltage
            with external resistors. It is commonly adjustable from about 1.25V up
            to 37V.
          </p>
        </div>
      </div>
    </div>
  );
}
