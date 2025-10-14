import { AlertStatus } from "@/types/type";
import { ReactNode, useEffect, useState } from "react";
import { faCheckCircle, faExclamationCircle, faInfoCircle, faTriangleExclamation, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
interface AlertProps {
    title: string;
    message: string;
    icon?: ReactNode; // có thể truyền custom icon
    type?: AlertStatus;
    duration?: number; // thời gian tự tắt, ms, default 3000
}

const iconMap: Record<AlertStatus, IconDefinition> = {
    success: faCheckCircle,
    error: faExclamationCircle,
    info: faInfoCircle,
    warning: faTriangleExclamation,
};

const colorMap: Record<AlertStatus, string> = {
    success: 'bg-green-100 border-green-500 text-green-700',
    error: 'bg-red-100 border-red-500 text-red-700',
    info: 'bg-blue-100 border-blue-500 text-blue-700',
    warning: 'bg-yellow-100 border-yellow-500 text-yellow-700',
};
const Alert: React.FC<AlertProps> = ({ title, message, icon, type = 'info', duration = 3000 }) => {
    const [show, setShow] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setShow(false), duration);
        return () => clearTimeout(timer);
    }, [duration]);
    return (
        <>
            {show && (
                <div className={`flex items-start gap-3 p-4 border-l-4 rounded-md shadow-md ${colorMap[type]} max-w-md w-full`}>
                    <div className="mt-1">
                        {icon ? icon : <FontAwesomeIcon icon={iconMap[type]} size="lg" />}
                    </div>
                    <div className="flex-1">
                        <p className="font-semibold">{title}</p>
                        <p className="text-sm">{message}</p>
                    </div>
                    <button onClick={() => setShow(false)} className="ml-2 font-bold text-lg leading-none">&times;</button>
                </div>
            )}
        </>
    )
}

export default Alert;