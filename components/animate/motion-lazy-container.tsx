"use client"

import { LazyMotion, domAnimation, m } from "framer-motion"
import type { HTMLMotionProps, ForwardRefComponent } from "framer-motion"
import type { ReactNode, ElementType } from "react"

interface MotionLazyContainerProps {
  children: ReactNode
  component?: ElementType | ForwardRefComponent<any, any> // Allow specifying the motion component type
  props?: HTMLMotionProps<any> // Allow passing props to the motion component
}

export function MotionLazyContainer({ children, component = m.div, ...props }: MotionLazyContainerProps) {
  const MotionComponent = component as ElementType // Cast to ElementType for JSX
  return (
    <LazyMotion features={domAnimation} strict>
      <MotionComponent {...props}>{children}</MotionComponent>
    </LazyMotion>
  )
}
