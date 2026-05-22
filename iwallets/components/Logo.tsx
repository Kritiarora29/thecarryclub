import Image from "next/image";

interface LogoProps {
  className?: string;
  width?: number;
  height?: number;
}

export default function Logo({ className = "", width = 120, height = 120 }: LogoProps) {
  return (
    <div className={`relative flex items-center select-none ${className}`}>
      <Image
        src="/logo.png"
        alt="theCarryClub Logo"
        width={width}
        height={height}
        className="object-contain mix-blend-multiply"
        priority
      />
    </div>
  );
}
