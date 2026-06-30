import {
    useRef,
    useState,
    useEffect,
    type KeyboardEvent,
    type ChangeEvent,
    type ClipboardEvent,
    type ReactNode,
} from "react";
import "./otp.css";

type Tone = "error" | "success" | "info";

interface OtpValidateProps {
    /** Number of OTP boxes. Default 4. */
    length?: number;
    /** Fires when all boxes are filled. */
    onComplete?: (otp: string) => void;
    /** Colors the box borders. Pass null/undefined for neutral. */
    tone?: Tone | null;
    /** Anything rendered here appears in the transparent slot below
     *  (plain string, styled message, popover component, etc.) */
    slot?: ReactNode;
}

export default function OtpValidate(
    {
        length = 4,
        onComplete,
        tone = null,
        slot = null,
    }: OtpValidateProps
) {
    const [digits, setDigits] = useState<string[]>(() => Array(length).fill(""));
    const inputsRef = useRef<Array<HTMLInputElement | null>>([]);

    // Focus first box on mount
    useEffect(() => {
        inputsRef.current[0]?.focus();
    }, []);

    // Fire onComplete once all boxes are filled
    useEffect(() => {
        if (digits.every((d) => d !== "")) {
            onComplete?.(digits.join(""));
        }
    }, [digits, onComplete]);

    const focusInput = (index: number) => {
        inputsRef.current[index]?.focus();
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement>, index: number) => {
        const value = e.target.value;
        // accept only a single digit (or empty)
        if (!/^\d?$/.test(value)) return;

        setDigits((prev) => {
            const next = [...prev];
            next[index] = value;
            return next;
        });

        if (value && index < length - 1) focusInput(index + 1);
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, index: number) => {
        if (e.key === "Backspace") {
            e.preventDefault();
            setDigits((prev) => {
                const next = [...prev];
                if (next[index]) {
                    // clear current box
                    next[index] = "";
                } else if (index > 0) {
                    // jump back and clear previous
                    next[index - 1] = "";
                    focusInput(index - 1);
                }
                return next;
            });
        } else if (e.key === "ArrowLeft" && index > 0) {
            focusInput(index - 1);
        } else if (e.key === "ArrowRight" && index < length - 1) {
            focusInput(index + 1);
        }
    };

    const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
        e.preventDefault();
        const pasted = e.clipboardData
            .getData("text")
            .replace(/\D/g, "")
            .slice(0, length);
        if (!pasted) return;

        const next = Array<string>(length).fill("");
        for (let i = 0; i < pasted.length; i++) next[i] = pasted[i];
        setDigits(next);

        focusInput(Math.min(pasted.length, length - 1));
    };

    const toneBoxClass = tone ? `otp-box--${tone}` : "";
    const toneSlotClass = tone ? `otp-slot--${tone}` : "";

    return (
        <div className="otp-page">
            <div className="otp-card">
                <span className="otp-icon">🌙</span>
                <h2 className="otp-heading">Verify your number</h2>
                <p className="otp-desc">Enter the code sent to your Email</p>

                <div className="otp-wrapper">
                    <div className="otp-inputs" role="group" aria-label="One-time password">
                        {digits.map((digit, index) => (
                            <input
                                key={index}
                                ref={(el) => {
                                    inputsRef.current[index] = el;
                                }}
                                type="text"
                                inputMode="numeric"
                                autoComplete="one-time-code"
                                maxLength={1}
                                value={digit}
                                onChange={(e) => handleChange(e, index)}
                                onKeyDown={(e) => handleKeyDown(e, index)}
                                onPaste={handlePaste}
                                className={`otp-box ${toneBoxClass}`}
                                aria-label={`Digit ${index + 1}`}
                            />
                        ))}
                    </div>

                    <div
                        className={`otp-slot ${toneSlotClass}`}
                        role={tone === "error" ? "alert" : "status"}
                        aria-live="polite"
                    >
                        {slot}
                    </div>
                </div>
            </div>
        </div>
    );
}