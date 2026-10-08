"use client"
import React, { forwardRef } from "react"
import * as LucideIcons from "lucide-react"
import { Icon as IconifyIcon } from "@iconify/react"

export type LucideIcon = React.ElementType

// Fallback icon map for custom icons if not directly named in Lucide
const iconifyMap: Record<string, string> = {
  "Facebook": "mdi:facebook",
  "Instagram": "mdi:instagram",
  "Linkedin": "mdi:linkedin",
  "Twitter": "mdi:twitter",
}

const createIcon = (name: string) => {
  const LucideComp = (LucideIcons as any)[name]
  
  return forwardRef<SVGSVGElement, any>(({ className, ...props }, ref) => {
    if (LucideComp) {
      return (
        <LucideComp 
          ref={ref} 
          className={`shrink-0 inline-block align-middle ${className || ''}`} 
          {...props} 
        />
      )
    }
    const iconId = iconifyMap[name] || "ph:circle-light"
    return (
      <IconifyIcon 
        icon={iconId} 
        ref={ref as any} 
        className={`shrink-0 inline-block align-middle ${className || ''}`} 
        {...props} 
      />
    )
  })
}

export const Zap = createIcon("Zap")
export const Clock = createIcon("Clock")
export const TrendingUp = createIcon("TrendingUp")
export const CheckCircle2 = createIcon("CheckCircle2")
export const BookMarked = createIcon("BookMarked")
export const Award = createIcon("Award")
export const Download = createIcon("Download")
export const ArrowLeft = createIcon("ArrowLeft")
export const Users = createIcon("Users")
export const CalendarDays = createIcon("CalendarDays")
export const Banknote = createIcon("Banknote")
export const BookOpen = createIcon("BookOpen")
export const CheckCircle = createIcon("CheckCircle")
export const GraduationCap = createIcon("GraduationCap")
export const Lock = createIcon("Lock")
export const Mail = createIcon("Mail")
export const CreditCard = createIcon("CreditCard")
export const User = createIcon("User")
export const Briefcase = createIcon("Briefcase")
export const Star = createIcon("Star")
export const Trophy = createIcon("Trophy")
export const Lightbulb = createIcon("Lightbulb")
export const Heart = createIcon("Heart")
export const Shield = createIcon("Shield")
export const Clock3 = createIcon("Clock3")
export const Users2 = createIcon("Users2")
export const MoveUpRight = createIcon("MoveUpRight")
export const Building2 = createIcon("Building2")
export const Landmark = createIcon("Landmark")
export const Cpu = createIcon("Cpu")
export const HeartPulse = createIcon("HeartPulse")
export const BadgeCheck = createIcon("BadgeCheck")
export const Flame = createIcon("Flame")
export const Sparkles = createIcon("Sparkles")
export const ChevronRight = createIcon("ChevronRight")
export const Medal = createIcon("Medal")
export const CalendarClock = createIcon("CalendarClock")
export const ShieldCheck = createIcon("ShieldCheck")
export const Gem = createIcon("Gem")
export const Target = createIcon("Target")
export const Home = createIcon("Home")
export const PhoneCall = createIcon("PhoneCall")
export const ArrowRight = createIcon("ArrowRight")
export const Headphones = createIcon("Headphones")
export const MessageCircle = createIcon("MessageCircle")
export const Presentation = createIcon("Presentation")
export const FileSpreadsheet = createIcon("FileSpreadsheet")
export const Scale = createIcon("Scale")
export const Calculator = createIcon("Calculator")
export const AlertCircle = createIcon("AlertCircle")
export const Search = createIcon("Search")
export const SlidersHorizontal = createIcon("SlidersHorizontal")
export const ChevronDown = createIcon("ChevronDown")
export const HelpCircle = createIcon("HelpCircle")
export const MessageSquare = createIcon("MessageSquare")
export const MapPin = createIcon("MapPin")
export const Phone = createIcon("Phone")
export const ArrowUpRight = createIcon("ArrowUpRight")
export const Send = createIcon("Send")
export const Menu = createIcon("Menu")
export const X = createIcon("X")
export const ChevronLeft = createIcon("ChevronLeft")
export const Play = createIcon("Play")
export const MessageSquareQuote = createIcon("MessageSquareQuote")
export const Facebook = createIcon("Facebook")
export const Instagram = createIcon("Instagram")
export const Linkedin = createIcon("Linkedin")
export const Twitter = createIcon("Twitter")