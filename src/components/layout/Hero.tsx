import Link from "next/link";
import Image from "next/image";
export default function Hero({
  image,
  name,
}: {
  image?: string;
  name?: string;
}) {
  return (
    <section className="w-full bg-[#F5F0E7] px-6 pb-14 pt-32 md:pb-20 md:pt-40">
      <div className="mx-auto grid max-w-7xl items-center gap-10 md:grid-cols-[1.1fr_1fr] md:gap-16">
        <div>
          <p className="mb-6 text-xs font-semibold uppercase tracking-[.22em] text-primary">
            Twaana / For their everyday
          </p>
          <h1 className="text-5xl font-medium leading-[1.03] tracking-[-.055em] sm:text-6xl lg:text-8xl">
            Small things.
            <br />
            <span className="font-serif italic text-primary">
              Whole worlds.
            </span>
          </h1>
          <p className="mt-7 max-w-md text-lg leading-relaxed text-muted-foreground">
            The getting-dressed, heading-out, one-more-cuddle kind of
            essentials.
          </p>
          <Link
            href="/shop"
            className="mt-8 inline-flex min-h-12 items-center gap-8 rounded-full bg-foreground px-7 py-4 text-sm font-semibold text-white"
          >
            Find their next favourite <span aria-hidden="true">↗</span>
          </Link>
          <div className="mt-10 flex gap-6 border-t border-foreground/15 pt-5 text-xs uppercase tracking-wider text-muted-foreground">
            <span>Everyday essentials</span>
            <span>Prices in KES</span>
          </div>
        </div>
        <div className="relative aspect-[4/5] overflow-hidden rounded-t-[48%] bg-[#E7C9A8]">
          {image ? (
            <Image
              src={image}
              alt={name || "From the Twaana collection"}
              fill
              priority
              sizes="(max-width: 767px) 100vw, 48vw"
              className="object-cover"
            />
          ) : (
            <div className="flex h-full flex-col justify-center gap-8 px-8 py-24 text-center text-[#402B25]">
              <span className="text-xs uppercase tracking-[.2em]">
                A little note from Twaana
              </span>
              <p className="font-serif text-5xl italic leading-tight lg:text-6xl">
                For the days
                <br />
                that become
                <br />
                the memories.
              </p>
              <span className="border-t border-current/30 pt-5 text-sm">
                Little things, lots of love.
              </span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
