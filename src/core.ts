import { Timer } from "./core/timer";


export class Core {
    static timer: Timer = null;

    static init() {
        Core.timer = new Timer();
    }
}