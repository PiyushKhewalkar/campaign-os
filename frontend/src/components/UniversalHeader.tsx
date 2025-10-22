import { Button } from "./ui/button"

interface UniversalHeaderProps {
    heading: string;
    subheading: string;
    buttonLabel: string;
    onButtonClick?: () => void;
}

const UniversalHeader = ({ heading, subheading, buttonLabel, onButtonClick }: UniversalHeaderProps) => {
    return (
        <div className="space-y-2">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-medium text-wrap">{heading}</h1>
                <Button onClick={onButtonClick}>{buttonLabel}</Button>
            </div>
            <p className="text-muted-foreground">{subheading}</p>
        </div>
    )
}

export default UniversalHeader