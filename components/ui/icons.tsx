"use client"
import React, { forwardRef } from "react"
import { Icon as IconifyIcon } from "@iconify/react"

export type LucideIcon = React.ElementType

const iconMap: Record<string, string> = {
  "ArrowLeft": "solar:arrow-left-bold-duotone",
  "ArrowRight": "solar:arrow-right-bold-duotone",
  "ArrowUpRight": "solar:arrow-right-up-bold-duotone",
  "Award": "solar:medal-ribbon-star-bold-duotone",
  "Banknote": "solar:wallet-money-bold-duotone",
  "BookMarked": "solar:bookmark-square-bold-duotone",
  "BookOpen": "solar:book-bookmark-bold-duotone",
  "Briefcase": "solar:case-bold-duotone",
  "CalendarDays": "solar:calendar-date-bold-duotone",
  "CheckCircle": "solar:check-circle-bold-duotone",
  "CheckCircle2": "solar:check-circle-bold-duotone",
  "ChevronDown": "solar:alt-arrow-down-bold-duotone",
  "ChevronLeft": "solar:alt-arrow-left-bold-duotone",
  "ChevronRight": "solar:alt-arrow-right-bold-duotone",
  "Clock": "solar:clock-circle-bold-duotone",
  "Download": "solar:download-square-bold-duotone",
  "GraduationCap": "solar:diploma-bold-duotone",
  "Headphones": "solar:headphones-round-bold-duotone",
  "Heart": "solar:heart-bold-duotone",
  "HelpCircle": "solar:question-circle-bold-duotone",
  "Home": "solar:home-angle-bold-duotone",
  "Lightbulb": "solar:lightbulb-minimalistic-bold-duotone",
  "Lock": "solar:lock-keyhole-bold-duotone",
  "Mail": "solar:letter-bold-duotone",
  "MapPin": "solar:map-point-bold-duotone",
  "Menu": "solar:hamburger-menu-bold-duotone",
  "MessageCircle": "solar:chat-round-dots-bold-duotone",
  "MessageSquare": "solar:chat-square-bold-duotone",
  "MessageSquareQuote": "solar:chat-square-quote-bold-duotone",
  "Phone": "solar:phone-calling-bold-duotone",
  "PhoneCall": "solar:phone-calling-bold-duotone",
  "Play": "solar:play-circle-bold-duotone",
  "Send": "solar:plain-bold-duotone",
  "Shield": "solar:shield-check-bold-duotone",
  "Star": "solar:star-bold-duotone",
  "TrendingUp": "solar:graph-up-bold-duotone",
  "Trophy": "solar:cup-star-bold-duotone",
  "User": "solar:user-bold-duotone",
  "Users": "solar:users-group-rounded-bold-duotone",
  "X": "solar:close-circle-bold-duotone",
  "Zap": "solar:bolt-bold-duotone",
  "Building2": "solar:buildings-bold-duotone",
  "Landmark": "solar:bank-bold-duotone",
  "Cpu": "solar:cpu-bold-duotone",
  "HeartPulse": "solar:heart-pulse-bold-duotone",
  "BadgeCheck": "solar:verified-check-bold-duotone",
  "Flame": "solar:fire-bold-duotone",
  "Sparkles": "solar:stars-bold-duotone",
  "Search": "solar:magnifer-bold-duotone",
  "SlidersHorizontal": "solar:tuning-bold-duotone",
  "Clock3": "solar:clock-circle-bold-duotone",
  "Users2": "solar:users-group-two-rounded-bold-duotone",
  "MoveUpRight": "solar:arrow-right-up-bold-duotone",
  "Medal": "solar:medal-ribbon-bold-duotone",
  "CalendarClock": "solar:calendar-date-bold-duotone",
  "ShieldCheck": "solar:shield-check-bold-duotone",
  "Gem": "solar:diamonds-bold-duotone",
  "AlertCircle": "solar:danger-circle-bold-duotone",
  "Target": "solar:target-bold-duotone",
  "Presentation": "solar:presentation-bold-duotone",
  "FileSpreadsheet": "solar:document-text-bold-duotone",
  "Scale": "solar:scale-bold-duotone",
  "Calculator": "solar:calculator-bold-duotone",
  "Facebook": "mdi:facebook",
  "Instagram": "mdi:instagram",
  "Linkedin": "mdi:linkedin",
  "Twitter": "mdi:twitter",
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
export const Facebook = createIcon("Facebook")
export const Instagram = createIcon("Instagram")
export const Linkedin = createIcon("Linkedin")
export const Twitter = createIcon("Twitter")