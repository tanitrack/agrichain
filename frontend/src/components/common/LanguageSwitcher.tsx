
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const LanguageSwitcher = () => {
  const { language, setLanguage } = useLanguage();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className="h-8 gap-1 border-primary/20 hover:bg-primary/5 bg-white shadow-sm text-primary"
        >
          <Globe className="h-4 w-4" />
          <span className="hidden md:inline font-medium">
            {language === "id" ? "Indonesia" : "English"}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className="bg-white shadow-md border-none p-1 min-w-[150px]"
      >
        <DropdownMenuItem 
          onClick={() => setLanguage("id")} 
          className={`cursor-pointer ${language === "id" ? "bg-primary/10" : ""} rounded-md my-1 transition-colors hover:bg-primary/5`}
        >
          <div className="flex items-center gap-2 py-1">
            <div className="w-5 h-5 rounded-full overflow-hidden flex-shrink-0 border">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 3 2">
                <path fill="#fff" d="M0 0h3v2H0z"/>
                <path fill="#ce1126" d="M0 0h3v1H0z"/>
              </svg>
            </div>
            <span className={language === "id" ? "font-bold text-primary" : ""}>
              Indonesia (ID)
            </span>
          </div>
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => setLanguage("en")} 
          className={`cursor-pointer ${language === "en" ? "bg-primary/10" : ""} rounded-md my-1 transition-colors hover:bg-primary/5`}
        >
          <div className="flex items-center gap-2 py-1">
            <div className="w-5 h-5 rounded-full overflow-hidden flex-shrink-0 border">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 6">
                <path fill="#bd3d44" d="M0 0h10v1H0zm0 2h10v1H0zm0 2h10v1H0zm0 2h10v1H0z"/>
                <path fill="#fff" d="M0 1h10v1H0zm0 2h10v1H0zm0 2h10v1H0z"/>
                <path fill="#192f5d" d="M0 0h4v4H0z"/>
              </svg>
            </div>
            <span className={language === "en" ? "font-bold text-primary" : ""}>
              English (EN)
            </span>
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSwitcher;
