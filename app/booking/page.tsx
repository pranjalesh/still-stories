export default function BookingPage() {
  const calUrl =
    process.env.CAL_EMBED_URL ?? "https://cal.com/pg-w7nie3";

  return (
    <div className="pt-28 pb-20 px-6 md:px-12 lg:px-20 max-w-5xl mx-auto">
      <div className="mb-12">
        <p className="text-xs tracking-widest uppercase text-muted mb-3">
          Schedule
        </p>
        <h1 className="text-3xl md:text-5xl font-black tracking-tight text-white">
          Book a Session
        </h1>
        <p className="text-white/50 text-sm mt-4 max-w-lg">
          Pick a time that works for you. Sessions available for street
          portraits, urban walks, and night shoots.
        </p>
      </div>

      {/* Cal.com inline embed */}
      <div className="w-full min-h-[700px] bg-surface border border-border overflow-hidden">
        <iframe
          src={`${calUrl}?embed=true&theme=dark`}
          width="100%"
          height="700"
          frameBorder="0"
          title="Book a photography session"
          className="w-full"
        />
      </div>
    </div>
  );
}
