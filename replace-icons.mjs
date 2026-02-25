import fs from "fs"
import path from "path"

function getFiles(dir, files = []) {
    if (!fs.existsSync(dir)) return files
    const list = fs.readdirSync(dir)
    for (const file of list) {
        const fullPath = path.join(dir, file)
        if (fs.statSync(fullPath).isDirectory()) {
            getFiles(fullPath, files)
        } else if (fullPath.endsWith(".tsx") || fullPath.endsWith(".ts")) {
            files.push(fullPath)
        }
    }
    return files
}

const allFiles = [...getFiles("app"), ...getFiles("components")]
const allIconNames = new Set()

for (const file of allFiles) {
    let content = fs.readFileSync(file, "utf8")
    const regex = /import\s+(type\s+)?{([^}]+)}\s+from\s+["']lucide-react["']/g

    let match
    let modified = false
    while ((match = regex.exec(content)) !== null) {
        if (!content.includes('"lucide-react"')) continue // safety check

        const isType = Boolean(match[1])
        const importsStr = match[2]
        const imports = importsStr.split(",").map(i => i.trim()).filter(Boolean)

        for (let imp of imports) {
            if (imp.startsWith("type ")) {
                imp = imp.replace("type ", "")
            }
            if (imp === "LucideIcon") continue
            allIconNames.add(imp)
        }
        modified = true
    }

    if (modified) {
        content = content.replace(/from\s+["']lucide-react["']/g, 'from "@/components/ui/icons"')
        fs.writeFileSync(file, content, "utf8")
    }
}

const iconMap = {
    ArrowLeft: "ph:arrow-left-light",
    ArrowRight: "ph:arrow-right-light",
    ArrowUpRight: "ph:arrow-up-right-light",
    Award: "ph:medal-light",
    Banknote: "ph:money-light",
    BookMarked: "ph:bookmark-simple-light",
    BookOpen: "ph:book-open-light",
    Briefcase: "ph:briefcase-light",
    CalendarDays: "ph:calendar-blank-light",
    CheckCircle: "ph:check-circle-light",
    CheckCircle2: "ph:check-circle-light",
    ChevronDown: "ph:caret-down-light",
    ChevronLeft: "ph:caret-left-light",
    ChevronRight: "ph:caret-right-light",
    Clock: "ph:clock-light",
    Download: "ph:download-simple-light",
    GraduationCap: "ph:graduation-cap-light",
    Headphones: "ph:headphones-light",
    Heart: "ph:heart-light",
    HelpCircle: "ph:question-light",
    Home: "ph:house-light",
    Lightbulb: "ph:lightbulb-light",
    Lock: "ph:lock-light",
    Mail: "ph:envelope-simple-light",
    MapPin: "ph:map-pin-light",
    Menu: "ph:list-light",
    MessageCircle: "ph:chat-circle-light",
    MessageSquare: "ph:chat-text-light",
    MessageSquareQuote: "ph:quotes-light",
    Phone: "ph:phone-light",
    PhoneCall: "ph:phone-call-light",
    Play: "ph:play-light",
    Send: "ph:paper-plane-right-light",
    Shield: "ph:shield-check-light",
    Star: "ph:star-light",
    TrendingUp: "ph:trend-up-light",
    Trophy: "ph:trophy-light",
    User: "ph:user-light",
    Users: "ph:users-light",
    X: "ph:x-light",
    Zap: "ph:lightning-light",
    Building2: "ph:buildings-light",
    Landmark: "ph:bank-light",
    Cpu: "ph:cpu-light",
    HeartPulse: "ph:heartbeat-light",
    BadgeCheck: "ph:seal-check-light",
    Flame: "ph:fire-light",
    Sparkles: "ph:sparkle-light",
    Search: "ph:magnifying-glass-light",
    SlidersHorizontal: "ph:sliders-horizontal-light"
}

const exportsContent = [
    '"use client"',
    'import React, { forwardRef } from "react"',
    'import { Icon as IconifyIcon } from "@iconify/react"',
    '',
    'export type LucideIcon = React.ElementType',
    '',
    `const iconMap: Record<string, string> = ${JSON.stringify(iconMap, null, 2)}`,
    '',
    'const createIcon = (name: string) => {',
    '  const iconId = iconMap[name] || "ph:circle-light"',
    '  return forwardRef<SVGSVGElement, any>((props, ref) => {',
    '    return <IconifyIcon icon={iconId} ref={ref} {...props} />',
    '  })',
    '}',
    '',
    Array.from(allIconNames).map(name => `export const ${name} = createIcon("${name}")`).join("\\n"),
].join("\\n")

// ensure components/ui/ exists
if (!fs.existsSync("components/ui")) {
    fs.mkdirSync("components/ui", { recursive: true })
}

fs.writeFileSync("components/ui/icons.tsx", exportsContent, "utf8")
console.log("Done replacing! Icons exported:", Array.from(allIconNames).join(", "))
