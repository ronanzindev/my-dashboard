import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function avatarName(input: string) {
  if (!input) return "G"
  const splitedTag = input.trim().split(" ")
  const avatar = splitedTag.length > 1 ? splitedTag[0][0].toUpperCase() + splitedTag[0][1].toUpperCase() : splitedTag[0][0].toUpperCase()
  return avatar
}