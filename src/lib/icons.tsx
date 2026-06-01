import {
  Activity,
  Baby,
  Building2,
  ClipboardList,
  FlaskConical,
  HeartPulse,
  Scan,
  Scissors,
  Stethoscope,
  Syringe,
  type LucideIcon,
} from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  "heart-pulse": HeartPulse,
  "building-2": Building2,
  scissors: Scissors,
  syringe: Syringe,
  baby: Baby,
  activity: Activity,
  "flask-conical": FlaskConical,
  scan: Scan,
  "clipboard-list": ClipboardList,
  stethoscope: Stethoscope,
};

export function getServiceIcon(name: string): LucideIcon {
  return iconMap[name] || Stethoscope;
}
