'use client';

import { motion } from "framer-motion"
import { type CSSProperties, useState } from "react"

interface AuditButtonProps {
    text: string
    width?: number
    height?: number
    fontSize?: number
    fontFamily?: string
    textColor?: string
    blurAmount?: number
    borderRadius?: number
    shineDuration?: number
    shineOpacity?: number
    glowColor?: string
    glowIntensity?: number
    strokeWidth?: number
    strokeColor?: string
    strokeColorHover?: string
    enableFontScaling?: boolean
    link?: string
    onClick?: () => void
    style?: CSSProperties
}

export default function AuditButton({
    text,
    width = 380,
    height = 60,
    fontSize = 16,
    fontFamily = "Inter, Arial, sans-serif",
    textColor = "#2563eb",
    blurAmount = 10,
    borderRadius = 30,
    shineDuration = 2.5,
    shineOpacity = 0.5,
    glowColor = "#3B82F6",
    glowIntensity = 0.5,
    strokeWidth = 2,
    strokeColor = "rgba(59, 130, 246, 0.4)",
    strokeColorHover = "rgba(59, 130, 246, 0.7)",
    enableFontScaling = true,
    link,
    onClick,
    style,
}: AuditButtonProps) {
    const [isHovered, setIsHovered] = useState(false)
    const isResponsive = style?.width === "100%" || style?.height === "100%"

    const handleClick = () => {
        console.log("Button clicked!")

        if (link && typeof window !== "undefined") {
            // Si c'est une ancre (#section), scroll fluide
            if (link.startsWith("#")) {
                const targetId = link.substring(1)
                const targetElement = document.getElementById(targetId)

                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: "smooth",
                        block: "start",
                    })
                }
            } else {
                // Sinon, navigation normale
                window.location.href = link
            }
        }

        if (onClick) {
            onClick()
        }
    }

    return (
        <motion.button
            onClick={handleClick}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            whileHover={{
                scale: 1.03,
                transition: { duration: 0.15, ease: "easeOut" },
            }}
            whileTap={{
                scale: 0.97,
                transition: { duration: 0.1 },
            }}
            style={{
                position: "relative",
                width: isResponsive ? "100%" : width,
                height: isResponsive ? "100%" : height,
                background: "rgba(59, 130, 246, 0.08)",
                backdropFilter: `blur(${blurAmount}px)`,
                WebkitBackdropFilter: `blur(${blurAmount}px)`,
                border: `${strokeWidth}px solid ${isHovered ? strokeColorHover : strokeColor}`,
                borderRadius: borderRadius,
                fontSize:
                    enableFontScaling && isHovered ? fontSize * 1.02 : fontSize,
                fontFamily: fontFamily,
                fontWeight: 600,
                color: textColor,
                cursor: "pointer",
                overflow: "hidden",
                textShadow: isHovered
                    ? `0 0 10px ${strokeColorHover}60, 0 0 20px ${strokeColorHover}40, 0 0 30px ${strokeColorHover}30, 0 1px 3px rgba(0, 0, 0, 0.8)`
                    : "0 1px 2px rgba(0, 0, 0, 0.5)",
                letterSpacing: "0.3px",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "0 20px",
                userSelect: "none",
                outline: "none",
                zIndex: 1,
                boxShadow: isHovered
                    ? `0 10px 35px rgba(0, 0, 0, 0.15), 
                       inset 0 1px 2px rgba(255, 255, 255, 0.15), 
                       0 0 ${glowIntensity * 15}px ${glowColor}40, 
                       0 0 ${glowIntensity * 25}px ${glowColor}20`
                    : `0 8px 32px rgba(0, 0, 0, 0.1), 
                       inset 0 1px 0 rgba(255, 255, 255, 0.1)`,
                transition:
                    "border 0s, box-shadow 0.15s ease-out, font-size 0.15s ease-out, text-shadow 0.15s ease-out",
                transform: "translateZ(0)",
                willChange: "transform",
                ...style,
            }}
        >
            {/* Text */}
            <span
                style={{
                    position: "relative",
                    zIndex: 2,
                    pointerEvents: "none",
                }}
            >
                {text}
            </span>

            {/* Shine effect */}
            <motion.div
                style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: 40,
                    height: "100%",
                    background: `linear-gradient(
                        90deg,
                        transparent,
                        rgba(255,255,255,${shineOpacity * 0.6}),
                        rgba(255,255,255,${shineOpacity}),
                        rgba(255,255,255,${shineOpacity * 0.6}),
                        transparent
                    )`,
                    transform: "skewX(-15deg)",
                    pointerEvents: "none",
                    zIndex: 1,
                }}
                animate={{
                    x: [-100, isResponsive ? "calc(100vw + 60px)" : width + 60],
                }}
                transition={{
                    duration: shineDuration,
                    repeat: Infinity,
                    ease: "easeInOut",
                    repeatDelay: 0.5,
                }}
            />

            {/* Simple hover overlay */}
            <motion.div
                style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background:
                        "linear-gradient(135deg, rgba(59,130,246,0) 0%, rgba(59,130,246,0.06) 100%)",
                    opacity: isHovered ? 1 : 0,
                    borderRadius: borderRadius,
                    pointerEvents: "none",
                    zIndex: 0,
                    transition: "opacity 0.15s ease-out",
                }}
            />
        </motion.button>
    )
}
