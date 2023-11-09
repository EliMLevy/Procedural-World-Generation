import P5 from "p5";
import TextureSlice from "./TextureSlice";
import MyAnimation from "./MyAnimation";

export default class Player {
    /**Character states */
    static STANDING_FRONT = 0;
    static STANDING_BACK = 1;
    static STANDING_LEFT = 2;
    static STANDING_RIGHT = 3;
    static WALKING_BACK = 4;
    static WALKING_FRONT = 5;
    static WALKING_LEFT = 6;
    static WALKING_RIGHT = 7;

    x: number;
    y: number;
    w: number;
    h: number;
    currentState: number = Player.STANDING_FRONT;
    animIndex: number = 0;

    animations: Map<number, MyAnimation> = new Map();
    characterAtlas: P5.Image;
    defaultSpriteSlice: TextureSlice;


    constructor(x: number, y: number, w: number, h: number, spriteSheet: P5.Image, defaultSpriteSlice: TextureSlice) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.characterAtlas = spriteSheet;
        this.defaultSpriteSlice = defaultSpriteSlice;
    }

    addAnimation(state: number, frames: TextureSlice[], speed: number) {
        console.log(this.animations);
        this.animations.set(state, new MyAnimation(frames, speed));
    }


    display(p5: P5) {
        p5.push()
        p5.translate(this.x - this.w / 2, this.y - this.h / 2);

        let animation = this.animations.get(this.currentState);

        if (animation != undefined) {
            let slice = animation.slices[Math.floor(this.animIndex)];
            p5.copy(this.characterAtlas, slice.x, slice.y, slice.w, slice.h, 0,0, this.w, this.h);
            this.animIndex = (this.animIndex + animation.speed) % animation.slices.length;

        } else {
            p5.copy(
                this.characterAtlas,
                this.defaultSpriteSlice.x,
                this.defaultSpriteSlice.y,
                this.defaultSpriteSlice.w,
                this.defaultSpriteSlice.h,
                this.x - this.w / 2,
                this.y - this.h / 2,
                this.w,
                this.h
            );
        }

        p5.pop();
    }

    moveUp() {
        if (this.currentState != Player.WALKING_BACK) {
            this.currentState = Player.WALKING_BACK;
            this.animIndex = 0;
        }
    }

    moveDown() {
        if (this.currentState != Player.WALKING_FRONT) {
            this.currentState = Player.WALKING_FRONT;
            this.animIndex = 0;
        }
    }

    moveLeft() {
        if (this.currentState != Player.WALKING_LEFT) {
            this.currentState = Player.WALKING_LEFT;
            this.animIndex = 0;
        }
    }

    moveRight() {
        if (this.currentState != Player.WALKING_RIGHT) {
            this.currentState = Player.WALKING_RIGHT;
            this.animIndex = 0;
        }
    }

    stopWalking() {
        if (this.currentState == Player.WALKING_BACK) {
            this.currentState = Player.STANDING_BACK;
        } else if (this.currentState == Player.WALKING_FRONT) {
            this.currentState = Player.STANDING_FRONT;
        } else if (this.currentState == Player.WALKING_LEFT) {
            this.currentState = Player.STANDING_LEFT;
        } else if (this.currentState == Player.WALKING_RIGHT) {
            this.currentState = Player.STANDING_RIGHT;
        }

        this.animIndex = 0;
    }
}
