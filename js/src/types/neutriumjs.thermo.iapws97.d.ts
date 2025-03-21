declare module 'neutriumjs.thermo.iapws97' {
    export class IAPWS97 {
        setPT(pressure: number, temperature: number): {
            t: number;
            p: number;
            v: number;
            h: number;
            s: number;
            x: number;
        };
        setPX(pressure: number, quality: number): {
            t: number;
            p: number;
            v: number;
            h: number;
            s: number;
            x: number;
        };
        setTX(temperature: number, quality: number): {
            t: number;
            p: number;
            v: number;
            h: number;
            s: number;
            x: number;
        };
    }
}