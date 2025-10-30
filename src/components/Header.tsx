import { GraduationCap, Menu, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  onToggleHistory: () => void;
  onSignOut?: () => void;
  userName?: string;
}

const Header = ({ onToggleHistory, onSignOut, userName }: HeaderProps) => {
  return (
    <header className="gradient-primary text-primary-foreground shadow-card sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 animate-fade-in">
            <div className="bg-primary-foreground/10 p-2 rounded-lg backdrop-blur-sm">
              <GraduationCap className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">EvalScript</h1>
              <p className="text-sm text-primary-foreground/80">Answer Script Evaluation System</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {userName && (
              <span className="text-sm text-primary-foreground/90 hidden sm:inline">
                Welcome, {userName}
              </span>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggleHistory}
              className="lg:hidden text-primary-foreground hover:bg-primary-foreground/10"
            >
              <Menu className="h-6 w-6" />
            </Button>
            {onSignOut && (
              <Button
                onClick={onSignOut}
                variant="ghost"
                size="sm"
                className="hidden sm:flex items-center gap-2 text-primary-foreground hover:bg-primary-foreground/10"
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
