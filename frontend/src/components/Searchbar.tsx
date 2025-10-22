import { Input } from "./ui/input"
import { Search } from "lucide-react"

interface SearchBarProps {
    placeholder?: string;
}

const SearchBar = ({ placeholder }: SearchBarProps) => {
    return (
        <div className="relative w-full">
            <Input className="w-full pr-10" placeholder={placeholder} />
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        </div>
    )
}

export default SearchBar