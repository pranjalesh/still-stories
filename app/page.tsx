import Image from "next/image";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* Hero image */}
      <Image
        src="https://res.cloudinary.com/dsxqzjfjk/image/upload/w_1600,q_auto,f_auto/montreal_midnight_blue_20260327_151327_ycgbxo"
        alt="Still Stories — Street Photography"
        fill
        priority
        className="object-cover object-center"
        sizes="100vw"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/55" />

      {/* Content */}
      <div className="absolute inset-0 flex flex-col justify-end pb-20 px-8 md:px-16 lg:px-24">
        {/* Category tags */}
        <div className="flex gap-4 mb-6">
          {["candid", "urban", "night", "cars"].map((tag) => (
            <span
              key={tag}
              className="text-white/50 text-xs tracking-widest uppercase"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Tagline */}
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tight text-white leading-none mb-6 max-w-3xl">
          Still Stories —<br />
          The Street. Frozen.
        </h1>

        {/* CTA buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mt-2">
          <Link
            href="/gallery"
            className="inline-block px-8 py-3 bg-white text-black text-xs tracking-widest uppercase font-bold hover:bg-white/90 transition-colors"
          >
            View Portfolio
          </Link>
          <Link
            href="/booking"
            className="inline-block px-8 py-3 border border-white text-white text-xs tracking-widest uppercase font-bold hover:bg-white hover:text-black transition-colors"
          >
            Book a Session
          </Link>
        </div>
      </div>
    </div>
  );
}
