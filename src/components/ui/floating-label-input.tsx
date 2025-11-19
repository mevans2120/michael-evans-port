import * as React from "react"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

interface FloatingLabelInputProps extends React.ComponentProps<typeof Input> {
    label: string
}
interface FloatingLabelTextareaProps extends React.ComponentProps<typeof Textarea> {
    label: string
}

const FloatingLabelInput = React.forwardRef<HTMLInputElement, FloatingLabelInputProps>(
    ({ id, label, className, ...props }, ref) => {
        return (
            <div className="relative">
                <Input
                    id={id}
                    className={cn(
                        "peer pt-6 pb-2 h-14 placeholder:text-transparent focus:placeholder:text-transparent",
                        className
                    )}
                    placeholder={label} // Placeholder needed for :placeholder-shown
                    ref={ref}
                    {...props}
                />
                <label
                    htmlFor={id}
                    className="absolute left-3 top-4 z-10 origin-[0] -translate-y-2.5 scale-75 transform text-muted-foreground duration-200 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-3 peer-focus:scale-75 peer-focus:text-foreground peer-focus:left-3"
                >
                    {label}
                </label>
            </div>
        )
    }
)
FloatingLabelInput.displayName = "FloatingLabelInput"

const FloatingLabelTextarea = React.forwardRef<HTMLTextAreaElement, FloatingLabelTextareaProps>(
    ({ id, label, className, ...props }, ref) => {
        return (
            <div className="relative">
                <Textarea
                    id={id}
                    className={cn(
                        "peer pt-6 pb-2 min-h-[120px] placeholder:text-transparent focus:placeholder:text-transparent resize-none",
                        className
                    )}
                    placeholder={label}
                    ref={ref}
                    {...props}
                />
                <label
                    htmlFor={id}
                    className="absolute left-3 top-4 z-10 origin-[0] -translate-y-2.5 scale-75 transform text-muted-foreground duration-200 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-3 peer-focus:scale-75 peer-focus:text-foreground peer-focus:left-3"
                >
                    {label}
                </label>
            </div>
        )
    }
)
FloatingLabelTextarea.displayName = "FloatingLabelTextarea"

export { FloatingLabelInput, FloatingLabelTextarea }
