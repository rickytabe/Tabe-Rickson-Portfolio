import { PortableText } from "@portabletext/react";
import { createImageUrlBuilder } from "@sanity/image-url";
import { client } from "@/lib/sanity/client";
import Image from "next/image";

const builder = createImageUrlBuilder(client);
function urlFor(source: any) {
  return builder.image(source);
}

const components = {
  types: {
    image: ({ value }: any) => {
      if (!value?.asset?._ref) {
        return null;
      }
      return (
        <div className="relative w-full aspect-video my-8 rounded-xl overflow-hidden border border-card-border">
          <Image
            src={urlFor(value).url()}
            alt={value.alt || "Blog image"}
            fill
            className="object-cover"
          />
        </div>
      );
    },
  },
  marks: {
    link: ({ children, value }: any) => {
      const rel = !value.href.startsWith("/") ? "noreferrer noopener" : undefined;
      return (
        <a href={value.href} rel={rel} className="text-[#39FF14] hover:underline">
          {children}
        </a>
      );
    },
  },
  block: {
    h1: ({ children }: any) => <h1 className="text-4xl font-bold font-sans mt-10 mb-4">{children}</h1>,
    h2: ({ children }: any) => <h2 className="text-3xl font-bold font-sans mt-8 mb-4">{children}</h2>,
    h3: ({ children }: any) => <h3 className="text-2xl font-bold font-sans mt-6 mb-3">{children}</h3>,
    normal: ({ children }: any) => <p className="text-foreground/80 font-inter mb-4 leading-relaxed">{children}</p>,
    blockquote: ({ children }: any) => <blockquote className="border-l-4 border-[#39FF14] pl-4 italic my-4 text-foreground/60">{children}</blockquote>,
  },
};

export default function PortableTextRenderer({ value }: { value: any }) {
  return <PortableText value={value} components={components} />;
}
