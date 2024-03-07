interface Detected {
    browser: {
        stock: boolean;
        hidden: boolean;
        channel: string;
        name: string;
        version: any;
    }
    engine: {
        name: string;
        version: any;
    }
    os: {
        name: string;
        version: any;
    }
    device:{
        type: 'tablet' | 'mobile' | 'desktop';
        identified: boolean;
        manufacturer?: string;
        model: string;
    }
}
export default function uaDevice(uaString: string): Detected;
