interface GreetingProps {
  name?: string;
}

const Greeting = ({ name }: GreetingProps) => {
    return (
        <div className="space-y-2 mb-10">
            <h1 className="text-2xl font-medium text-wrap">👋🏻 Morning! <span className="font-thin">{name}</span></h1>
            <p className="text-muted-foreground">What are your marketing goals today?</p>
        </div>
    )
}

export default Greeting