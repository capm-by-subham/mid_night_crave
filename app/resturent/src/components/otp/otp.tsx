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
    /** Anything rendered here appears in the slot below the boxes. */
    slot?: ReactNode;
    /** Email the code was sent to (shown masked). */
    email?: string;
    /** Shows an "Edit" link next to the email. */
    onEdit?: () => void;
    /** Shows a "Resend code" link with a cooldown timer. */
    onResend?: () => Promise<void> | void;
    /** Cooldown in seconds before resend is allowed. Default 30. */
    resendAfter?: number;
}

/** sub***@gmail.com */
const maskEmail = (email: string) => {
    const [user, domain] = email.split("@");
    if (!domain) return email;
    return `${user.slice(0, 2)}${"*".repeat(Math.max(user.length - 2, 1))}@${domain}`;
};

export default function OtpValidate({
    length = 4,
    onComplete,
    tone = null,
    slot = null,
    email,
    onEdit,
    onResend,
    resendAfter = 30,
}: OtpValidateProps) {
    const [digits, setDigits] = useState<string[]>(() => Array(length).fill(""));
    const [secondsLeft, setSecondsLeft] = useState(resendAfter);
    const [resending, setResending] = useState(false);
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

    // Resend cooldown: tick down 1 per second until 0
    useEffect(() => {
        if (secondsLeft <= 0) return;
        const t = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
        return () => clearTimeout(t);
    }, [secondsLeft]);

    const focusInput = (index: number) => {
        inputsRef.current[index]?.focus();
    };

    const handleResend = async () => {
        setResending(true);
        try {
            await onResend?.();
            setDigits(Array(length).fill("")); // clear old code
            setSecondsLeft(resendAfter);       // restart cooldown
            focusInput(0);
        } finally {
            setResending(false);
        }
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
                    next[index] = "";
                } else if (index > 0) {
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
        <div className="otp-container">
            <span className="otp-icon">🌙</span>
            <h2 className="otp-heading">Verify your email</h2>

            <p className="otp-desc">
                Enter the {length}-digit code sent to{" "}
                {email ? <strong>{maskEmail(email)}</strong> : "your email"}
                {onEdit && (
                    <button type="button" className="otp-link" onClick={onEdit}>
                        ✎ Edit
                    </button>
                )}
            </p>

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

            {onResend && (
                <p className="otp-resend">
                    Didn't get the code?{" "}
                    {secondsLeft > 0 ? (
                        <span className="otp-timer">
                            Resend in 0:{String(secondsLeft).padStart(2, "0")}
                        </span>
                    ) : (
                        <button
                            type="button"
                            className="otp-link"
                            onClick={handleResend}
                            disabled={resending}
                        >
                            {resending ? "Sending..." : "Resend code"}
                        </button>
                    )}
                </p>
            )}
        </div>
    );
}