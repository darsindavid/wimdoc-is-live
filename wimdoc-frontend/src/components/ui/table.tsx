import * as React from "react";
import { cn } from "@/lib/utils";

export function Table({ className, ...props }: React.HTMLAttributes<HTMLTableElement>) {
  return (
    <table
      className={cn(
        `
        w-full text-sm
        text-black dark:text-white
        border-separate border-spacing-0
      `,
        className
      )}
      {...props}
    />
  );
}

export function TableHeader({
  className,
  ...props
}: React.HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <thead
      className={cn("text-black/70 dark:text-white/70", className)}
      {...props}
    />
  );
}

export function TableBody({
  className,
  ...props
}: React.HTMLAttributes<HTMLTableSectionElement>) {
  return <tbody className={cn(className)} {...props} />;
}

export function TableRow({
  className,
  ...props
}: React.HTMLAttributes<HTMLTableRowElement>) {
  return (
    <tr
      className={cn(
        `
        hover:bg-black/5 dark:hover:bg-white/10
        transition
      `,
        className
      )}
      {...props}
    />
  );
}

export function TableHead({
  className,
  ...props
}: React.ThHTMLAttributes<HTMLTableCellElement>) {
  return (
    <th
      className={cn(
        `
        px-4 py-3 text-left font-medium
        bg-black/5 dark:bg-white/10
        border-b border-black/10 dark:border-white/10
        first:rounded-tl-lg last:rounded-tr-lg
      `,
        className
      )}
      {...props}
    />
  );
}

export function TableCell({
  className,
  ...props
}: React.TdHTMLAttributes<HTMLTableCellElement>) {
  return (
    <td
      className={cn(
        `
        px-4 py-3
        border-b border-black/5 dark:border-white/5
      `,
        className
      )}
      {...props}
    />
  );
}

export function TableCaption({
  className,
  ...props
}: React.HTMLAttributes<HTMLTableCaptionElement>) {
  return (
    <caption
      className={cn("text-black/50 dark:text-white/50 mt-2 text-sm", className)}
      {...props}
    />
  );
}