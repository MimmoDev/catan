"use client"

import * as React from "react"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

interface AccordionItemProps {
  value: string
  children: React.ReactNode
}

interface AccordionProps {
  type?: "single" | "multiple"
  defaultValue?: string | string[]
  children: React.ReactNode
}

export function Accordion({ type = "single", defaultValue, children }: AccordionProps) {
  const [openItems, setOpenItems] = React.useState<string[]>(
    Array.isArray(defaultValue) ? defaultValue : defaultValue ? [defaultValue] : []
  )

  const toggleItem = (value: string) => {
    if (type === "single") {
      setOpenItems(openItems.includes(value) ? [] : [value])
    } else {
      setOpenItems(
        openItems.includes(value)
          ? openItems.filter((item) => item !== value)
          : [...openItems, value]
      )
    }
  }

  return (
    <div className="space-y-2">
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child) && child.type === AccordionItem) {
          return React.cloneElement(child, {
            isOpen: openItems.includes(child.props.value),
            onToggle: () => toggleItem(child.props.value),
          } as any)
        }
        return child
      })}
    </div>
  )
}

export function AccordionItem({
  value,
  children,
  isOpen,
  onToggle,
}: AccordionItemProps & { isOpen?: boolean; onToggle?: () => void }) {
  return (
    <div className="border rounded-lg overflow-hidden">
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          if (child.type === AccordionTrigger) {
            return React.cloneElement(child, {
              isOpen,
              onToggle,
            } as any)
          }
          if (child.type === AccordionContent) {
            return React.cloneElement(child, {
              isOpen,
            } as any)
          }
        }
        return child
      })}
    </div>
  )
}

export function AccordionTrigger({
  children,
  isOpen,
  onToggle,
}: {
  children: React.ReactNode
  isOpen?: boolean
  onToggle?: () => void
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
    >
      <div className="flex-1 text-left">{children}</div>
      <ChevronDown
        className={cn(
          "h-4 w-4 transition-transform",
          isOpen && "transform rotate-180"
        )}
      />
    </button>
  )
}

export function AccordionContent({
  children,
  isOpen,
}: {
  children: React.ReactNode
  isOpen?: boolean
}) {
  if (!isOpen) return null

  return <div className="px-4 pb-4">{children}</div>
}


