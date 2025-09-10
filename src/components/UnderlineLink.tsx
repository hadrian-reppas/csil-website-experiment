import Link from "next/link";

const UnderlineLink: React.FC<{ href: string; text: string }> = ({
  href,
  text,
}) => {
  return (
    <Link
      href={href}
      className="group relative inline-block text-[#1E53F3] no-underline"
    >
      <span className="relative">{text}</span>
      <span className="pointer-events-none absolute right-0 bottom-0 left-0 h-px w-full bg-current [will-change:transform] group-hover:animate-[underline-slide_500ms_ease-in-out_1] group-focus-visible:animate-[underline-slide_500ms_ease-in-out_1]" />
    </Link>
  );
};

export default UnderlineLink;
