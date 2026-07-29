type FormFieldProps = {
  label: string;
  labelEn: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
};

export function FormField({ label, labelEn, required, error, children }: FormFieldProps) {
  return (
    <div>
      <label className="block mb-2">
        <span className="font-anton uppercase text-sm">{labelEn}</span>
        <span className="ml-2 font-zen font-black text-sm">{label}</span>
        {required && <span className="ml-1 text-magenta">*</span>}
      </label>
      {children}
      {error && <p className="mt-1 text-magenta text-sm font-zen font-bold">{error}</p>}
    </div>
  );
}

export const inputStyles =
  "w-full border-[3px] border-black rounded-2xl px-4 py-3 font-zen font-bold bg-cream-light focus:bg-cream focus:outline-none focus:ring-4 focus:ring-magenta/30 transition";
