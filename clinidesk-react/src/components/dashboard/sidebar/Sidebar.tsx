"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
    ChevronDown,
    ChevronRight,
    ChevronLeft,
    Menu,
    X,
    LogOut,
    Calendar,
    Users,
    FileText,
    MessageSquare,
    DollarSign,
    Settings,
    Building,
    Bot,
    User
} from "lucide-react";

interface SidebarProps {
    userType: "professional" | "clinic";
    userName: string;
    userAvatar?: string;
    onLogout: () => void;
    onToggle?: (collapsed: boolean) => void;
}

interface MenuItem {
    title: string;
    path?: string;
    icon: React.ReactNode;
    userTypes: Array<"professional" | "clinic">;
    submenu?: MenuItem[];
}

export default function Sidebar({ userType, userName, userAvatar, onLogout, onToggle }: SidebarProps) {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [expandedMenus, setExpandedMenus] = useState<string[]>([]);
    const [hoveringItem, setHoveringItem] = useState<string | null>(null);
    const pathname = usePathname();

    // Menu items configuration
    const menuItems: MenuItem[] = [
        // Itens para profissionais
        {
            title: "Minha Agenda",
            path: "/dashboard/professional/appointments",
            icon: <Calendar className="h-5 w-5" />,
            userTypes: ["professional"]
        },
        {
            title: "Pacientes",
            path: "/dashboard/professional/patients",
            icon: <Users className="h-5 w-5" />,
            userTypes: ["professional"]
        },
        {
            title: "Bot",
            path: "/dashboard/professional/whatsapp",
            icon: <Bot className="h-5 w-5" />,
            userTypes: ["professional"]
        },
        {
            title: "Meu Financeiro",
            icon: <DollarSign className="h-5 w-5" />,
            userTypes: ["professional"],
            submenu: [
                {
                    title: "Faturamento",
                    path: "/dashboard/professional/financial/billing",
                    icon: <DollarSign className="h-5 w-5" />,
                    userTypes: ["professional"]
                },
                {
                    title: "Relatórios",
                    path: "/dashboard/professional/financial/reports",
                    icon: <FileText className="h-5 w-5" />,
                    userTypes: ["professional"]
                }
            ]
        },
        {
            title: "Configurações",
            path: "/dashboard/professional/settings",
            icon: <Settings className="h-5 w-5" />,
            userTypes: ["professional"]
        },

        // Itens para clínicas
        {
            title: "Agenda",
            path: "/dashboard/clinic/appointments",
            icon: <Calendar className="h-5 w-5" />,
            userTypes: ["clinic"]
        },
        {
            title: "Pacientes",
            path: "/dashboard/clinic/patients",
            icon: <Users className="h-5 w-5" />,
            userTypes: ["clinic"]
        },
        {
            title: "Prontuários",
            path: "/dashboard/clinic/records",
            icon: <FileText className="h-5 w-5" />,
            userTypes: ["clinic"]
        },
        {
            title: "Bot",
            path: "/dashboard/clinic/whatsapp",
            icon: <Bot className="h-5 w-5" />,
            userTypes: ["clinic"]
        },
        {
            title: "Financeiro",
            icon: <DollarSign className="h-5 w-5" />,
            userTypes: ["clinic"],
            submenu: [
                {
                    title: "Faturamento",
                    path: "/dashboard/clinic/financial/billing",
                    icon: <DollarSign className="h-5 w-5" />,
                    userTypes: ["clinic"]
                },
                {
                    title: "Relatórios",
                    path: "/dashboard/clinic/financial/reports",
                    icon: <FileText className="h-5 w-5" />,
                    userTypes: ["clinic"]
                }
            ]
        },
        {
            title: "Profissionais",
            path: "/dashboard/clinic/professionals",
            icon: <User className="h-5 w-5" />,
            userTypes: ["clinic"]
        },
        {
            title: "Configurações",
            path: "/dashboard/clinic/settings",
            icon: <Settings className="h-5 w-5" />,
            userTypes: ["clinic"]
        }
    ];

    // Toggle sidebar collapse
    const toggleSidebar = () => {
        const newCollapsedState = !isCollapsed;
        setIsCollapsed(newCollapsedState);
        if (onToggle) {
            onToggle(newCollapsedState);
        }
    };

    // Toggle submenu expansion
    const toggleSubmenu = (title: string) => {
        setExpandedMenus(prev =>
            prev.includes(title)
                ? prev.filter(item => item !== title)
                : [...prev, title]
        );
    };

    // Check if a menu item is active
    const isActive = (path?: string) => {
        if (!path) return false;
        return pathname === path || pathname.startsWith(path);
    };

    // Filter menu items based on user type
    const filteredMenuItems = menuItems.filter(item =>
        item.userTypes.includes(userType)
    );

    return (
        <aside
            className={`fixed left-0 top-0 h-screen bg-primary text-primary-foreground border-r border-border/20 transition-all duration-300 z-40 ${isCollapsed ? "w-16" : "w-64"
                }`}
        >
            <div className="flex flex-col h-full">
                {/* Toggle button */}
                <button
                    onClick={toggleSidebar}
                    className="absolute -right-3 top-6 bg-background text-foreground rounded-full p-1 shadow-md z-50"
                >
                    {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
                </button>

                {/* User profile */}
                <div className={`h-16 border-b border-border/20 flex items-center gap-3 px-4 ${isCollapsed ? "justify-center" : ""}`}>
                    <div className="relative h-10 w-10 rounded-full overflow-hidden bg-background">
                        {userAvatar ? (
                            <Image
                                src={userAvatar}
                                alt={userName}
                                fill
                                className="object-cover"
                            />
                        ) : (
                            <div className="h-full w-full flex items-center justify-center bg-background/20 text-primary-foreground">
                                {userType === "professional" ? <User className="h-6 w-6" /> : <Building className="h-6 w-6" />}
                            </div>
                        )}
                    </div>

                    {!isCollapsed && (
                        <div className="overflow-hidden">
                            <p className="font-medium truncate">{userName}</p>
                            <p className="text-xs text-primary-foreground/80 capitalize">{userType}</p>
                        </div>
                    )}
                </div>

                {/* Menu items */}
                <nav className="flex-1 overflow-y-auto py-4">
                    <ul className="space-y-2 px-5">
                        {filteredMenuItems.map((item) => (
                            <li key={item.title}>
                                {item.submenu ? (
                                    <div
                                        onMouseEnter={() => isCollapsed && setHoveringItem(item.title)}
                                        onMouseLeave={() => isCollapsed && setHoveringItem(null)}
                                    >
                                        <button
                                            onClick={() => toggleSubmenu(item.title)}
                                            className={`w-full flex items-center justify-between p-2 rounded-md ${expandedMenus.includes(item.title) ? "bg-background/10" : "hover:bg-background/5"
                                                } transition-colors ${isCollapsed ? "justify-center relative group" : ""}`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className={isCollapsed ? "relative" : ""}>
                                                    {item.icon}
                                                    {isCollapsed && (
                                                        <div className="absolute left-full ml-2 top-0 z-50 hidden group-hover:block">
                                                            <div className="bg-primary border border-border/20 rounded-md shadow-md p-2 whitespace-nowrap">
                                                                {item.title}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                                {!isCollapsed && <span>{item.title}</span>}
                                            </div>
                                            {!isCollapsed && (
                                                <ChevronDown
                                                    className={`h-4 w-4 transition-transform ${expandedMenus.includes(item.title) ? "rotate-180" : ""
                                                        }`}
                                                />
                                            )}
                                        </button>

                                        {(expandedMenus.includes(item.title) || (isCollapsed && hoveringItem === item.title)) && (
                                            <ul className={`space-y-1 mt-1 ${isCollapsed
                                                ? "absolute left-full top-8 ml-2 bg-primary border border-border/20 rounded-md shadow-md p-2 min-w-48 z-50"
                                                : "pl-10"
                                                }`}>
                                                {item.submenu?.map((subItem, subIndex) => (
                                                    <li key={subIndex}>
                                                        <Link
                                                            href={subItem.path || "#"}
                                                            className={`flex items-center p-2 rounded-md ${isActive(subItem.path)
                                                                ? "bg-background/20 font-medium"
                                                                : "hover:bg-background/10"
                                                                } transition-colors`}
                                                        >
                                                            {subItem.icon}
                                                            <span className="ml-3">{subItem.title}</span>
                                                        </Link>
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>
                                ) : (
                                    <Link
                                        href={item.path || "#"}
                                        className={`flex items-center gap-3 p-2 rounded-md ${isActive(item.path)
                                            ? "bg-background/20 font-medium"
                                            : "hover:bg-background/10"
                                            } transition-colors ${isCollapsed ? "justify-center relative group" : ""}`}
                                    >
                                        <div className={isCollapsed ? "relative" : ""}>
                                            {item.icon}
                                            {isCollapsed && (
                                                <div className="absolute left-full ml-2 top-0 z-50 hidden group-hover:block">
                                                    <div className="bg-primary border border-border/20 rounded-md shadow-md p-2 whitespace-nowrap">
                                                        {item.title}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                        {!isCollapsed && <span>{item.title}</span>}
                                    </Link>
                                )}
                            </li>
                        ))}
                    </ul>
                </nav>

                {/* Logout button */}
                <div className="p-4 border-t border-border/20">
                    <button
                        onClick={onLogout}
                        className={`flex items-center gap-3 p-2 rounded-md text-primary-foreground hover:bg-background/10 transition-colors w-full ${isCollapsed ? "justify-center" : ""
                            }`}
                    >
                        <LogOut className="h-5 w-5" />
                        {!isCollapsed && <span>Sair</span>}
                    </button>
                </div>
            </div>
        </aside>
    );
} 