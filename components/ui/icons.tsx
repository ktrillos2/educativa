"use client"
import React, { forwardRef } from "react"
import { Icon as IconifyIcon } from "@iconify/react"

export type LucideIcon = React.ElementType

const iconMap: Record<string, string> = {
  "ArrowLeft": "ph:arrow-left-light",
  "ArrowRight": "ph:arrow-right-light",
  "ArrowUpRight": "ph:arrow-up-right-light",
  "Award": "ph:medal-light",
  "Banknote": "ph:money-light",
  "BookMarked": "ph:bookmark-simple-light",
  "BookOpen": "ph:book-open-light",
  "Briefcase": "ph:briefcase-light",
  "CalendarDays": "ph:calendar-blank-light",
  "CheckCircle": "ph:check-circle-light",
  "CheckCircle2": "ph:check-circle-light",
  "ChevronDown": "ph:caret-down-light",
  "ChevronLeft": "ph:caret-left-light",
  "ChevronRight": "ph:caret-right-light",
  "Clock": "ph:clock-light",
  "Download": "ph:download-simple-light",
  "GraduationCap": "ph:graduation-cap-light",
  "Headphones": "ph:headphones-light",
  "Heart": "ph:heart-light",
  "HelpCircle": "ph:question-light",
  "Home": "ph:house-light",
  "Lightbulb": "ph:lightbulb-light",
  "Lock": "ph:lock-light",
  "Mail": "ph:envelope-simple-light",
  "MapPin": "ph:map-pin-light",
  "Menu": "ph:list-light",
  "MessageCircle": "ph:chat-circle-light",
  "MessageSquare": "ph:chat-text-light",
  "MessageSquareQuote": "ph:quotes-light",
  "Phone": "ph:phone-light",
  "PhoneCall": "ph:phone-call-light",
  "Play": "ph:play-light",
  "Send": "ph:paper-plane-right-light",
  "Shield": "ph:shield-check-light",
  "Star": "ph:star-light",
  "TrendingUp": "ph:trend-up-light",
  "Trophy": "ph:trophy-light",
  "User": "ph:user-light",
  "Users": "ph:users-light",
  "X": "ph:x-light",
  "Zap": "ph:lightning-light",
  "Building2": "ph:buildings-light",
  "Landmark": "ph:bank-light",
  "Cpu": "ph:cpu-light",
  "HeartPulse": "ph:heartbeat-light",
  "BadgeCheck": "ph:seal-check-light",
  "Flame": "ph:fire-light",
  "Sparkles": "ph:sparkle-light",
  "Search": "ph:magnifying-glass-light",
  "SlidersHorizontal": "ph:sliders-horizontal-light",
  "Clock3": "ph:clock-light",
  "Users2": "ph:users-light",
  "MoveUpRight": "ph:arrow-up-right-light",
  "Medal": "ph:medal-light",
  "CalendarClock": "ph:calendar-plus-light",
  "ShieldCheck": "ph:shield-check-light",
  "Gem": "ph:diamond-light",
  "AlertCircle": "ph:warning-circle-light",
  "Target": "ph:target-light",
  "Presentation": "ph:presentation-light",
  "FileSpreadsheet": "ph:file-xls-light",
  "Scale": "ph:scales-light",
  "Calculator": "ph:calculator-light",
}

const createIcon = (name: string) => {
  const iconId = iconMap[name] || "ph:circle-light"
  return forwardRef<SVGSVGElement, any>((props, ref) => {
    return <IconifyIcon icon={iconId} ref={ref} {...props} />
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