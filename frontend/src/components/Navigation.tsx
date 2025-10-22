import { useState } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { useIsMobile } from "../hooks/use-mobile"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
} from "./ui/sidebar"
import Nav from "./Nav"
import {
  Home,
  Megaphone,
  Plus,
  Calendar,
  LogOut,
} from "lucide-react"

// Desktop Sidebar Component
const DesktopSidebar = () => {
  const location = useLocation()
  const { signout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    signout()
    navigate("/login")
  }

  const isActive = (path: string) => {
    if (path === "/home") {
      return location.pathname === "/" || location.pathname === "/home"
    }
    return location.pathname.startsWith(path)
  }

  return (
    <Sidebar>
      <SidebarHeader className="border-b border-sidebar-border">
        <div className="flex items-center gap-2 px-4 py-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <Megaphone className="h-4 w-4 text-primary-foreground" />
          </div>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-semibold">Social Media Manager</span>
            <span className="truncate text-xs text-muted-foreground">Campaign Dashboard</span>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive("/home")}>
                  <Link to="/home">
                    <Home className="h-4 w-4" />
                    <span>Home</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive("/campaigns")}>
                  <Link to="/campaigns">
                    <Megaphone className="h-4 w-4" />
                    <span>Campaigns</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to="/campaigns/create">
                    <Plus className="h-4 w-4" />
                    <span>New Campaign</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive("/calendar")}>
                  <Link to="/calendar">
                    <Calendar className="h-4 w-4" />
                    <span>Calendar</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter className="border-t border-sidebar-border">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={handleLogout}>
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}

// Mobile Tray Component
const MobileTray = () => {
  const location = useLocation()
  const { signout } = useAuth()
  const navigate = useNavigate()
  const [activeScreen, setActiveScreen] = useState(() => {
    if (location.pathname === "/" || location.pathname === "/home") return "home"
    if (location.pathname.startsWith("/campaigns")) return "campaigns"
    if (location.pathname.startsWith("/calendar")) return "calendar"
    return "home"
  })

  const handleLogout = () => {
    signout()
    navigate("/login")
  }

  const isActive = (screen: string) => activeScreen === screen

  return (
    <div className="fixed -bottom-1 left-0 right-0 z-50 border-t border-border bg-background/80 backdrop-blur-sm">
      <div className="flex justify-center items-center py-4 px-6">
        <div className="flex justify-center space-x-4 max-w-md w-full">
          
          <Link to="/home" className="no-underline">
            <div 
              className={`flex flex-col items-center space-y-2 cursor-pointer transition-all duration-200 ${
                isActive("home") 
                  ? "opacity-100" 
                  : "opacity-60 hover:opacity-80"
              }`}
              onClick={() => setActiveScreen("home")}
            >
              <div className={`rounded-full h-8 w-8 flex items-center justify-center transition-all duration-200 ${
                isActive("home") 
                  ? "bg-accent border-2 border-accent-foreground/20" 
                  : "bg-muted hover:bg-muted/80"
              }`}>
                <Home className={`h-4 w-4 transition-colors duration-200 ${
                  isActive("home") 
                    ? "text-accent-foreground" 
                    : "text-muted-foreground"
                }`} />
              </div>
              <p className={`text-xs font-medium text-center transition-colors duration-200 ${
                isActive("home") 
                  ? "text-accent-foreground font-semibold" 
                  : "text-muted-foreground"
              }`}>Home</p>
            </div>
          </Link>

          <Link to="/campaigns" className="no-underline">
            <div 
              className={`flex flex-col items-center space-y-2 cursor-pointer transition-all duration-200 ${
                isActive("campaigns") 
                  ? "opacity-100" 
                  : "opacity-60 hover:opacity-80"
              }`}
              onClick={() => setActiveScreen("campaigns")}
            >
              <div className={`rounded-full h-8 w-8 flex items-center justify-center transition-all duration-200 ${
                isActive("campaigns") 
                  ? "bg-accent border-2 border-accent-foreground/20" 
                  : "bg-muted hover:bg-muted/80"
              }`}>
                <Megaphone className={`h-4 w-4 transition-colors duration-200 ${
                  isActive("campaigns") 
                    ? "text-accent-foreground" 
                    : "text-muted-foreground"
                }`} />
              </div>
              <p className={`text-xs font-medium text-center transition-colors duration-200 ${
                isActive("campaigns") 
                  ? "text-accent-foreground font-semibold" 
                  : "text-muted-foreground"
              }`}>Campaigns</p>
            </div>
          </Link>
          
          <Link to="/campaigns/create" className="no-underline">
            <div className="flex flex-col items-center space-y-2 cursor-pointer hover:scale-110 transition-all duration-200">
              <div className="rounded-full bg-primary h-10 w-10 flex items-center justify-center shadow-lg hover:shadow-xl">
                <Plus className="h-5 w-5 text-primary-foreground" />
              </div>
              <p className="text-xs text-primary font-semibold text-center">New</p>
            </div>
          </Link>

          <Link to="/calendar" className="no-underline">
            <div 
              className={`flex flex-col items-center space-y-2 cursor-pointer transition-all duration-200 ${
                isActive("calendar") 
                  ? "opacity-100" 
                  : "opacity-60 hover:opacity-80"
              }`}
              onClick={() => setActiveScreen("calendar")}
            >
              <div className={`rounded-full h-8 w-8 flex items-center justify-center transition-all duration-200 ${
                isActive("calendar") 
                  ? "bg-accent border-2 border-accent-foreground/20" 
                  : "bg-muted hover:bg-muted/80"
              }`}>
                <Calendar className={`h-4 w-4 transition-colors duration-200 ${
                  isActive("calendar") 
                    ? "text-accent-foreground" 
                    : "text-muted-foreground"
                }`} />
              </div>
              <p className={`text-xs font-medium text-center transition-colors duration-200 ${
                isActive("calendar") 
                  ? "text-accent-foreground font-semibold" 
                  : "text-muted-foreground"
              }`}>Calendar</p>
            </div>
          </Link>

          <button 
            onClick={handleLogout}
            className="flex flex-col items-center space-y-2 cursor-pointer transition-all duration-200 opacity-60 hover:opacity-80"
          >
            <div className="rounded-full h-8 w-8 flex items-center justify-center transition-all duration-200 bg-muted hover:bg-muted/80">
              <LogOut className="h-4 w-4 text-muted-foreground" />
            </div>
            <p className="text-xs font-medium text-center text-muted-foreground">Logout</p>
          </button>

        </div>
      </div>
    </div>
  )
}

// Main Navigation Component
const Navigation = () => {
  const isMobile = useIsMobile()

  if (isMobile) {
    return <MobileTray />
  }

  return <DesktopSidebar />
}

// Navigation with Provider and content inset
const NavigationWithProvider = ({ children }: { children?: React.ReactNode }) => {
  return (
    <SidebarProvider>
      <Navigation />
      <SidebarInset>
        <div className="px-4 sm:px-6 lg:px-8 py-6 pb-24">
          <div className="flex items-center gap-2 mb-4">
            <div className="hidden sm:block">
              <SidebarTrigger />
            </div>
            <div className="flex-1">
              <Nav />
            </div>
          </div>
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

export default NavigationWithProvider
export { SidebarTrigger }