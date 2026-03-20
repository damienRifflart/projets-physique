interface GlassCardProps {
    children: React.ReactNode;
    className?: string;
}
 
export const GlassCard = ({ children, className = "" }: GlassCardProps) => (
    <div
        className={`
            bg-white/15 backdrop-blur-lg border border-white/20
            shadow-[0_4px_16px_rgba(0,0,0,0.1),inset_0_1px_0_rgba(255,255,255,0.3)]
            transition-all duration-300 ${className}
        `}
    >
        {children}
    </div>
);
 