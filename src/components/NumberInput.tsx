import type { NumberInputProps } from "../../types/visualization";

export function NumberInput({ id, label, value, step = 0.1, onChange }: NumberInputProps) {
    return(
        <div>
            <label htmlFor={id} className="block text-sm mb-2"
            dangerouslySetInnerHTML={{ __html: label }} />
            <input
            id={id}
            type="number"
            value={value}
            step={step}
            onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
            className="w-full px-3 py-2 rounded-lg text-white placeholder-white/50 outline-none
                bg-white/5 backdrop-blur-sm border border-white/20
                focus:bg-white/10 focus:border-white/40 focus:ring-2 focus:ring-indigo-400/20
                transition-all duration-300"
            />
        </div>
    )
};