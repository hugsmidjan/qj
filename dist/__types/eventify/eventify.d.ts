declare type Callback = (...args: any) => void;
declare type Eventified<T extends object> = T & {
    on(eventName: string, callback: Callback): Eventified<T>;
    off(eventName: string, callback: Callback): Eventified<T>;
    emit<E extends {
        type: string;
    }>(event: string | E, ...args: Array<any>): Eventified<T>;
};
export default function eventify<T extends object>(object: T): Eventified<T>;
export {};
