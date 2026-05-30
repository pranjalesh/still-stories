import Image from "next/image";
import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="pt-28 pb-20 px-6 md:px-12 lg:px-20 max-w-5xl mx-auto">
      <div className="mb-12">
        <p className="text-xs tracking-widest uppercase text-muted mb-3">
          The photographer
        </p>
        <h1 className="text-3xl md:text-5xl font-black tracking-tight text-white">
          About
        </h1>
      </div>

      <div className="grid md:grid-cols-[1fr_1.6fr] gap-14 items-start">
        {/* Profile photo */}
        <div className="relative aspect-[3/4] bg-surface overflow-hidden">
          <Image
            src="https://res.cloudinary.com/dsxqzjfjk/image/upload/w_600,q_auto,f_auto/6118F9B7-BBC6-401F-AEE8-EED585C371F3_1_105_c_ij5e8o"
            alt="Photographer profile"
            fill
            className="object-cover object-center"
            sizes="(max-width: 768px) 100vw, 400px"
          />
          <div className="absolute inset-0 border border-border" />
        </div>

        {/* Bio */}
        <div className="flex flex-col justify-start space-y-6 pt-2">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
            PG — Street Photographer
          </h2>

          <div className="space-y-4 text-white/70 leading-relaxed text-sm md:text-base">
            <p>
              I chase the unrepeatable — the glance between strangers, the
              geometry of shadow on wet concrete, the solitude buried inside
              rush hour. My camera is a quiet witness.
            </p>
            <p>
              Working across the four modes of street photography — candid
              portraits, urban architecture, night atmospheres, and the
              unguarded moments of people in public — I look for images that
              hold still long enough to say something true.
            </p>
            <p>
              Based wherever the light is interesting. Available for editorial
              commissions, personal sessions, and fine-art prints.
            </p>
          </div>

          {/* Category list */}
          <div className="pt-2">
            <p className="text-xs tracking-widest uppercase text-muted mb-3">
              Specialities
            </p>
            <div className="flex flex-wrap gap-3">
              {["Candid", "Urban", "Night", "Cars"].map((cat) => (
                <span
                  key={cat}
                  className="border border-border text-white/60 text-xs tracking-widest uppercase px-3 py-1.5"
                >
                  {cat}
                </span>
              ))}
            </div>
          </div>

          {/* CTAs */}
          <div className="flex gap-4 pt-4">
            <Link
              href="/gallery"
              className="px-6 py-2.5 bg-white text-black text-xs tracking-widest uppercase font-bold hover:bg-white/90 transition-colors"
            >
              See the work
            </Link>
            <Link
              href="/booking"
              className="px-6 py-2.5 border border-border text-white text-xs tracking-widest uppercase hover:border-white transition-colors"
            >
              Book a session
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
