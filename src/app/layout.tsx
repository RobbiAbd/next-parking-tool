import MainLayout from "@/components/templates/MainLayouts";
import { ReactNode } from "react";
import './globals.css'

type props = {
    children: ReactNode
}

export default function RootLayout({children} : props) {
  return <MainLayout>{children}</MainLayout>
}
