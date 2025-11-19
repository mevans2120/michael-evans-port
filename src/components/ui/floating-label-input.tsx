import * as React from "react"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

interface FloatingLabelInputProps extends React.ComponentProps<typeof Input> {
    label: string
    error?: string
}
interface FloatingLabelTextareaProps extends React.ComponentProps<typeof Textarea> {
    label: string
    error?: string
}

const FloatingLabelInput = React.forwardRef<HTMLInputElement, FloatingLabelInputProps>(
    ({ id, label, error, className, ...props }, ref) => {
        return (
            <div className="relative">
                <Input
                    id={id}
                    className={cn(
                        "peer pt-6 pb-2 h-14 placeholder:text-transparent focus:placeholder:text-transparent",
                        error && "border-destructive focus-visible:ring-destructive",
                        className
                    )}
                    placeholder={label} // Placeholder needed for :placeholder-shown
                    ref={ref}
                    {...props}
                />
                <label
                    htmlFor={id}
                    className={cn(
                        "absolute left-3 top-4 z-10 origin-[0] -translate-y-2.5 scale-75 transform text-muted-foreground duration-200 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-3 peer-focus:scale-75 peer-focus:text-foreground peer-focus:left-3",
                        error && "text-destructive peer-focus:text-destructive"
                    )}
                >
                    {label}
                </label>
                {error && (
                    <p className="text-sm font-medium text-destructive mt-1 ml-1">
                        {error}
                    </p>
                )}
            </div>
        )
    }
)
FloatingLabelInput.displayName = "FloatingLabelInput"

const FloatingLabelTextarea = React.forwardRef<HTMLTextAreaElement, FloatingLabelTextareaProps>(
    ({ id, label, error, className, ...props }, ref) => {
        return (
            <div className="relative">
                <Textarea
                    id={id}
                    className={cn(
                        "peer pt-6 pb-2 min-h-[120px] placeholder:text-transparent focus:placeholder:text-transparent resize-none",
                        error && "border-destructive focus-visible:ring-destructive",
                        className
                    )}
                    placeholder={label}
                    ref={ref}
                    {...props}
                />
                <label
                    htmlFor={id}
                    className={cn(
                        "absolute left-3 top-4 z-10 origin-[0] -translate-y-2.5 scale-75 transform text-muted-foreground duration-200 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-3 peer-focus:scale-75 peer-focus:text-foreground peer-focus:left-3",
                        error && "text-destructive peer-focus:text-destructive"
                    )}
                >
                    {label}
                </label>
                {error && (
                    <p className="text-sm font-medium text-destructive mt-1 ml-1">
                        {error}
                    </p>
                )}
            </div>
        )
    }
)
FloatingLabelTextarea.displayName = "FloatingLabelTextarea"

export { FloatingLabelInput, FloatingLabelTextarea }
