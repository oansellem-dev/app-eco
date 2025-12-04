declare module 'react-qr-scanner' {
    import * as React from 'react';

    export interface QrScannerProps {
        onError?: (error: any) => void;
        onScan?: (data: any) => void;
        style?: React.CSSProperties;
        delay?: number;
        constraints?: any;
        className?: string;
    }

    const QrScanner: React.ComponentType<QrScannerProps>;
    export default QrScanner;
}
