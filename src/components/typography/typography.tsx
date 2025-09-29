// src/components/ui/Typography.tsx
import React from "react";
import { cn } from "@/lib/utils"; // clsx + twMerge

interface Props {
  className?: string;
  children: React.ReactNode;
}

export const H1: React.FC<Props> = ({ className, children }) => (
  <h1
    className={cn(
      "scroll-m-20 text-4xl font-extrabold tracking-tight font-poppins lg:text-5xl",
      className
    )}
  >
    {children}
  </h1>
);

export const H2: React.FC<Props> = ({ className, children }) => (
  <h2
    className={cn(
      "scroll-m-20 text-3xl font-semibold tracking-tight first:mt-0",
      className
    )}
  >
    {children}
  </h2>
);

export const H3: React.FC<Props> = ({ className, children }) => (
  <h3
    className={cn(
      "scroll-m-20 text-2xl font-semibold tracking-tight font-poppins",
      className
    )}
  >
    {children}
  </h3>
);

export const H4: React.FC<Props> = ({ className, children }) => (
  <h4
    className={cn(
      "scroll-m-20 text-xl font-semibold tracking-tight font-poppins",
      className
    )}
  >
    {children}
  </h4>
);

export const H5: React.FC<Props> = ({ className, children }) => (
  <h5
    className={cn(
      "scroll-m-20 text-xl font-semibold tracking-tight font-poppins",
      className
    )}
  >
    {children}
  </h5>
);

export const H6: React.FC<Props> = ({ className, children }) => (
  <h6
    className={cn(
      "scroll-m-20 text-lg font-semibold tracking-tight font-poppins",
      className
    )}
  >
    {children}
  </h6>
);

export const P: React.FC<Props> = ({ className, children }) => (
  <p className={cn("text-base font-poppins", className)}>{children}</p>
);

export const Li: React.FC<Props> = ({ className, children }) => (
  <li className={cn("text-xl list-none", className)}>{children}</li>
);

export const Blockquote: React.FC<Props> = ({ className, children }) => (
  <blockquote className={cn("mt-6 border-l-2 pl-6 italic", className)}>
    {children}
  </blockquote>
);
