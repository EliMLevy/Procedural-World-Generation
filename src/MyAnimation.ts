import TextureSlice from "./TextureSlice";

export default class MyAnimation {
    slices: TextureSlice[];
    speed: number;

    constructor(slices: TextureSlice[], speed: number) {
        this.slices = slices;
        this.speed = speed;
    }
}