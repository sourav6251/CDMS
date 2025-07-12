import { useCallback } from "react";
import { Button } from "@/components/ui/button";
import { useThemeStore } from "@/store";
import { Moon, Sun, Bell, Search } from "lucide-react";
import { useAuthStore } from "../../store/authStore";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Header() {
    const { theme, toggleTheme } = useThemeStore();
    const isDarkMode = theme === "dark";

    const { user } = useAuthStore();
    console.log("useAuthStore=>",user);
    
    console.log(",user?.department",user?.department);
     
    const handleToggleTheme = useCallback(() => {
        toggleTheme();
    }, [toggleTheme]);


    return (
        <header className="border-b border-border h-16 px-4 flex items-center justify-between bg-background">
            <div className="flex items-center">
                <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <input
                        type="search"
                        placeholder="Search..."
                        className="w-64 h-9 rounded-md bg-background border border-input px-8 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    />
                </div>
            </div>

            <div className="flex items-center gap-2">
                <Button
                    variant="ghost"
                    size="icon"
                    className="relative"
                    aria-label="Notifications"
                >
                </Button>

                <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleToggleTheme}
                    aria-label="Toggle theme"
                >
                    {isDarkMode ? (
                        <Sun className="h-5 w-5" />
                    ) : (
                        <Moon className="h-5 w-5" />
                    )}
                </Button>

                <DropdownMenu>
                    <DropdownMenuTrigger
                        className="flex items-center justify-center"
                        asChild
                    >
                        <Button
                            variant="ghost"
                            size="icon"
                            className="rounded-full border border-gray-500 overflow-hidden"
                            aria-label="User profile"
                        >
                             <img src="favicon.ico"  className="h-5 w-5 " />
                          
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuLabel>My Account</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>{user?.name}</DropdownMenuItem>
                        <DropdownMenuItem>{user?.department}</DropdownMenuItem>
                        <DropdownMenuItem>{user?.email}</DropdownMenuItem>
                        <DropdownMenuItem className="capitalize">
                            {user?.role}
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    );
}
