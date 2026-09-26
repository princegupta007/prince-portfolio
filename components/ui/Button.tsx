import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  ReactNode,
} from "react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "ghost";
type Size = "md" | "sm";

type BaseProps = {
  variant?: Variant;
  size?: Size;
  /** Opt-in hook for the Phase 5 InteractionLayer (pointer:fine only). */
  magnetic?: boolean;
  icon?: ReactNode;
  iconEnd?: ReactNode;
  className?: string;
  children: ReactNode;
};

type ButtonAsButton = BaseProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className" | "children"> & {
    href?: undefined;
  };

type ButtonAsAnchor = BaseProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "className" | "children"> & {
    href: string;
    /** Adds rel="noopener noreferrer" + target="_blank". */
    external?: boolean;
  };

export type ButtonProps = ButtonAsButton | ButtonAsAnchor;

const classes = (
  variant: Variant,
  size: Size,
  magnetic: boolean,
  className?: string,
) =>
  cn(
    "btn",
    variant === "ghost" ? "btn-ghost" : "btn-primary",
    size === "sm" && "btn-sm",
    magnetic && "magnetic",
    className,
  );

/** Design-system button — renders <a> when `href` is given, else <button>. */
export function Button(props: ButtonProps) {
  if (props.href !== undefined) {
    const {
      href,
      external,
      variant = "primary",
      size = "md",
      magnetic = false,
      icon,
      iconEnd,
      className,
      children,
      ...rest
    } = props;
    return (
      <a
        href={href}
        className={classes(variant, size, magnetic, className)}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        {...rest}
      >
        {icon}
        {children}
        {iconEnd}
      </a>
    );
  }

  const {
    variant = "primary",
    size = "md",
    magnetic = false,
    icon,
    iconEnd,
    className,
    children,
    type = "button",
    ...rest
  } = props;
  return (
    <button
      type={type}
      className={classes(variant, size, magnetic, className)}
      {...rest}
    >
      {icon}
      {children}
      {iconEnd}
    </button>
  );
}
