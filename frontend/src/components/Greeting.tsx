import { useState, useEffect } from 'react';

interface GreetingProps {
  name?: string;
}

const Greeting = ({ name }: GreetingProps) => {
    const [greeting, setGreeting] = useState('');


    useEffect(() => {
        const updateGreeting = () => {
            const currentHour = new Date().getHours();
            
            if (currentHour >= 5 && currentHour < 12) {
                setGreeting('Morning!');
            } else if (currentHour >= 12 && currentHour < 17) {
                setGreeting('Afternoon!');
            } else {
                setGreeting('Evening!');
            }
        };

        // Set initial greeting
        updateGreeting();

        // Update greeting every minute to handle day transitions
        const interval = setInterval(updateGreeting, 60000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="space-y-2 mb-10">
            <h1 className="text-2xl font-medium text-wrap">
                {greeting} <span className="font-thin">{name}</span>
            </h1>
            <p className="text-muted-foreground">Let's design some winning campaigns today</p>
        </div>
    )
}

export default Greeting