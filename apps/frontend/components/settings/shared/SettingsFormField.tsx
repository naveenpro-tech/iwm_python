"use client"

import React from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

interface SettingsFormFieldProps {
  label: string
  name: string
  type?: "text" | "email" | "password" | "number" | "tel" | "url" | "textarea"
  placeholder?: string
  helpText?: string
  error?: string
  disabled?: boolean
  required?: boolean
  maxLength?: number
  value?: string | number
  onChange?: (value: string | number) => void
  onBlur?: () => void
  className?: string
  inputClassName?: string
}

/**
 * Reusable form field component for settings forms
 * Includes label, input, error message, and help text
 * Accessible with aria-invalid and aria-describedby
 */
export const SettingsFormField = React.forwardRef<
  HTMLInputElement | HTMLTextAreaElement,
  SettingsFormFieldProps
>(
  (
    {
      label,
      name,
      type = "text",
      placeholder,
      helpText,
      error,
      disabled = false,
      required = false,
      maxLength,
      value,
      onChange,
      onBlur,
      className,
      inputClassName,
    },
    ref
  ) => {
    const fieldId = `field-${name}`
    const errorId = `error-${name}`
    const helpId = `help-${name}`

    const handleChange = (
      e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
      onChange?.(e.target.value)
    }

    return (
      <div className={cn("space-y-2", className)}>
        <Label
          htmlFor={fieldId}
          className={cn(
            "text-sm font-medium",
            error && "text-destructive",
            disabled && "text-muted-foreground"
          )}
        >
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </Label>

        {type === "textarea" ? (
          <Textarea
            ref={ref as React.Ref<HTMLTextAreaElement>}
            id={fieldId}
            name={name}
            placeholder={placeholder}
            disabled={disabled}
            value={value}
            onChange={handleChange}
            onBlur={onBlur}
            maxLength={maxLength}
            aria-invalid={!!error}
            aria-describedby={error ? errorId : helpText ? helpId : undefined}
            className={cn(
              "min-h-[100px]",
              error && "border-destructive focus-visible:ring-destructive",
              inputClassName
            )}
          />
        ) : (
          <Input
            ref={ref as React.Ref<HTMLInputElement>}
            id={fieldId}
            name={name}
            type={type}
            placeholder={placeholder}
            disabled={disabled}
            value={value}
            onChange={handleChange}
            onBlur={onBlur}
            maxLength={maxLength}
            aria-invalid={!!error}
            aria-describedby={error ? errorId : helpText ? helpId : undefined}
            className={cn(
              error && "border-destructive focus-visible:ring-destructive",
              inputClassName
            )}
          />
        )}

        {error && (
          <p
            id={errorId}
            className="text-sm font-medium text-destructive"
            role="alert"
          >
            {error}
          </p>
        )}

        {helpText && !error && (
          <p
            id={helpId}
            className="text-sm text-muted-foreground"
          >
            {helpText}
          </p>
        )}

        {maxLength && type === "textarea" && (
          <p className="text-xs text-muted-foreground text-right">
            {String(value).length}/{maxLength}
          </p>
        )}
      </div>
    )
  }
)

SettingsFormField.displayName = "SettingsFormField"

