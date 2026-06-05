"use client";

/**
 * theCarryClub Core UI Components
 *
 * Import from here instead of writing inline classNames on every page.
 * All tokens come from globals.css @theme — change once, reflects everywhere.
 *
 * Usage:
 *   import { Button, Card, PageShell, PageHeader, Heading, Eyebrow, PriceTag, BackButton } from "@/components/ui/tcc";
 */

import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Button ──────────────────────────────────────────────────────────────────
// variant="primary"  → black bg, hover amber (main CTAs)
// variant="secondary"→ white/muted bg, border  (alternative actions)
// variant="ghost"    → transparent, border, no fill
// Add size="lg" for full-section CTAs, size="sm" for compact actions.

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  href?: string;
  fullWidth?: boolean;
}

export function Button({
  variant = "primary",
  size = "md",
  href,
  fullWidth,
  className,
  children,
  ...props
}: ButtonProps) {
  const base = cn(
    "inline-flex items-center justify-center gap-2",
    "font-black uppercase tracking-widest rounded-full",
    "transition-all duration-200 transform hover:-translate-y-0.5",
    "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0",
    fullWidth && "w-full"
  );

  const variants = {
    primary:   "bg-primary text-primary-foreground hover:bg-brand shadow-lg",
    secondary: "bg-muted text-primary border border-border hover:bg-muted/60",
    ghost:     "bg-transparent border border-border text-primary hover:bg-muted",
  };

  const sizes = {
    sm: "text-[10px] px-5 py-2.5",
    md: "text-xs px-8 py-3.5",
    lg: "text-sm px-10 py-4",
  };

  const cls = cn(base, variants[variant], sizes[size], className);

  if (href) {
    return <Link href={href} className={cls}>{children}</Link>;
  }

  return <button className={cls} {...props}>{children}</button>;
}

// ─── Card ─────────────────────────────────────────────────────────────────────
// Standard white rounded container with shadow.
// size="sm" for tight UI cards, "xl" for full page content panels.

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg" | "xl";
}

export function Card({ size = "md", className, children, ...props }: CardProps) {
  const sizes = {
    sm: "rounded-2xl p-5 md:p-6",
    md: "rounded-3xl p-6 md:p-10",
    lg: "rounded-[2.5rem] p-8 md:p-12",
    xl: "rounded-[3rem] p-10 md:p-20",
  };

  return (
    <div
      className={cn(
        "bg-surface-card border border-border shadow-xl shadow-border/60",
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

// ─── PageShell ────────────────────────────────────────────────────────────────
// Wraps every page: off-white bg + standard top/bottom padding for the Navbar.

export interface PageShellProps extends React.HTMLAttributes<HTMLElement> {
  spacing?: "sm" | "md" | "lg";
  as?: "section" | "main" | "div";
}

export function PageShell({
  spacing = "md",
  as: Tag = "section",
  className,
  children,
  ...props
}: PageShellProps) {
  const spacings = {
    sm: "pt-24 md:pt-32 pb-16",
    md: "pt-28 md:pt-40 pb-20",
    lg: "pt-32 md:pt-48 pb-24",
  };

  return (
    <Tag
      className={cn("min-h-screen bg-surface", spacings[spacing], className)}
      {...props}
    >
      {children}
    </Tag>
  );
}

// ─── Eyebrow ──────────────────────────────────────────────────────────────────
// Small all-caps label above headings. color="brand" = amber, "muted" = gray.

export interface EyebrowProps extends React.HTMLAttributes<HTMLParagraphElement> {
  color?: "brand" | "muted";
}

export function Eyebrow({ color = "brand", className, children, ...props }: EyebrowProps) {
  return (
    <p
      className={cn(
        "text-[10px] md:text-[11px] font-black uppercase tracking-[0.4em]",
        color === "brand" ? "text-brand" : "text-muted-foreground",
        className
      )}
      {...props}
    >
      {children}
    </p>
  );
}

// ─── Heading ──────────────────────────────────────────────────────────────────
// Serif display headings. as="h1" is the large page title; h2/h3 for sections.
// Wrap accent words in <em> for italic Playfair Display: <Heading>Style<em>.</em></Heading>

export interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  as?: "h1" | "h2" | "h3" | "h4";
}

export function Heading({ as: Tag = "h1", className, children, ...props }: HeadingProps) {
  const sizes: Record<string, string> = {
    h1: "text-4xl md:text-7xl",
    h2: "text-3xl md:text-5xl",
    h3: "text-2xl md:text-3xl",
    h4: "text-xl md:text-2xl",
  };

  return (
    <Tag
      className={cn(
        "font-bold font-serif tracking-tighter leading-[0.9]",
        sizes[Tag],
        className
      )}
      {...props}
    >
      {children}
    </Tag>
  );
}

// ─── PageHeader ───────────────────────────────────────────────────────────────
// Composed: Eyebrow + Heading + optional subtitle. Used at the top of every page.

export interface PageHeaderProps {
  eyebrow?: string;
  title: React.ReactNode;
  subtitle?: string;
  align?: "left" | "center";
  className?: string;
}

export function PageHeader({
  eyebrow,
  title,
  subtitle,
  align = "center",
  className,
}: PageHeaderProps) {
  return (
    <div
      className={cn(
        "mb-12 md:mb-20",
        align === "center" && "text-center",
        className
      )}
    >
      {eyebrow && <Eyebrow className="mb-4">{eyebrow}</Eyebrow>}
      <Heading as="h1">{title}</Heading>
      {subtitle && (
        <p className="mt-4 text-muted-foreground font-medium max-w-xl mx-auto text-sm md:text-base leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );
}

// ─── PriceTag ─────────────────────────────────────────────────────────────────
// Amber ₹ price. Formats with Indian locale (1,599 not 1599).

export interface PriceTagProps extends React.HTMLAttributes<HTMLSpanElement> {
  amount: number;
  size?: "sm" | "md" | "lg" | "xl";
}

export function PriceTag({ amount, size = "md", className, ...props }: PriceTagProps) {
  const sizes = {
    sm: "text-lg font-black",
    md: "text-2xl md:text-3xl font-black",
    lg: "text-3xl md:text-4xl font-black",
    xl: "text-4xl md:text-5xl font-black",
  };

  return (
    <span
      className={cn("text-brand tracking-tighter", sizes[size], className)}
      {...props}
    >
      ₹{amount.toLocaleString("en-IN")}
    </span>
  );
}

// ─── BackButton ───────────────────────────────────────────────────────────────
// Pill-style back navigation. Pass href for Link, or onClick for client navigation.

export interface BackButtonProps {
  href?: string;
  onClick?: () => void;
  label?: string;
  className?: string;
}

export function BackButton({ href, onClick, label = "Back", className }: BackButtonProps) {
  const cls = cn(
    "inline-flex items-center gap-2",
    "bg-surface-card px-5 py-2.5 rounded-full",
    "border border-border shadow-sm",
    "text-muted-foreground hover:text-primary hover:shadow-md",
    "font-bold uppercase tracking-[0.2em] text-[10px] md:text-xs",
    "transition-all transform hover:-translate-y-0.5",
    className
  );

  if (href) {
    return <Link href={href} className={cls}><ArrowLeft size={12} />{label}</Link>;
  }

  return (
    <button type="button" onClick={onClick} className={cls}>
      <ArrowLeft size={12} />{label}
    </button>
  );
}

// ─── Divider ──────────────────────────────────────────────────────────────────

export function Divider({ className }: { className?: string }) {
  return <hr className={cn("border-0 border-t border-border", className)} />;
}

// ─── Badge ────────────────────────────────────────────────────────────────────
// Small pill labels. color="brand" for amber, "success" for green, "muted" for gray.

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  color?: "brand" | "success" | "muted";
  pulse?: boolean;
}

export function Badge({ color = "brand", pulse, className, children, ...props }: BadgeProps) {
  const colors = {
    brand:   "bg-brand-light text-brand border-brand/20",
    success: "bg-emerald-50 text-emerald-700 border-emerald-200",
    muted:   "bg-muted text-muted-foreground border-border",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full border",
        "text-[10px] font-black uppercase tracking-widest",
        colors[color],
        pulse && "animate-pulse",
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
