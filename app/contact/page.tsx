import ContactForm from "@/components/ContactForm";

export default function ContactPage() {
  return (
    <div className="pt-28 pb-20 px-6 md:px-12 lg:px-20 max-w-5xl mx-auto">
      <div className="mb-12">
        <p className="text-xs tracking-widest uppercase text-muted mb-3">
          Get in touch
        </p>
        <h1 className="text-3xl md:text-5xl font-black tracking-tight text-white">
          Contact
        </h1>
        <p className="text-white/50 text-sm mt-4 max-w-md">
          Commissions, print enquiries, or just want to talk photography —
          send a message and I&apos;ll get back to you.
        </p>
      </div>

      <div className="grid md:grid-cols-[1fr_1.4fr] gap-14 items-start">
        {/* Left — info */}
        <div className="space-y-8">
          <div>
            <p className="text-xs tracking-widest uppercase text-muted mb-2">
              Response time
            </p>
            <p className="text-white/70 text-sm">Usually within 24–48 hours.</p>
          </div>
          <div>
            <p className="text-xs tracking-widest uppercase text-muted mb-2">
              Based in
            </p>
            <p className="text-white/70 text-sm">
              Montreal, Canada.
            </p>
          </div>
          <div>
            <p className="text-xs tracking-widest uppercase text-muted mb-2">
              For bookings
            </p>
            <p className="text-white/70 text-sm">
              Use the{" "}
              <a href="/booking" className="text-white underline underline-offset-2">
                booking page
              </a>{" "}
              to schedule directly.
            </p>
          </div>
        </div>

        {/* Right — form */}
        <ContactForm />
      </div>
    </div>
  );
}
