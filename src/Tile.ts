import P5 from "p5";
import WorldGenerator from "./WorldGenerator";

/**
 * A tile is 32x32 pixels
 * It will have an x and y coordinate which it will use in the 2d perlin
 * noise. The result of the noise will determine the location of pond pixels
 * and land pixels. COntinguous pond pixels will be found and coelesced into
 * a single shape represented by an array of corrdinates. Same with the land
 * pixels.
 */

export default class Tile {
    x: number;
    y: number;
    scl: number;

    terrainMap: number[][];

    constructor(p5: P5, chunkX: number, chunkY: number, scl: number, worldGenerator: WorldGenerator) {
        this.x = chunkX;
        this.y = chunkY;

        this.scl = scl;

        this.terrainMap = worldGenerator.generateChunk(p5, this.x * this.scl, this.y * this.scl);
        // console.log(this.terrainMap)
        // console.log(chunkX, chunkY)
    }

    valueOf(posX: number, posY: number) {
        let col = Math.floor(posX / (this.scl / WorldGenerator.pointsPerChunkRow));
        let row = Math.floor(posY / (this.scl / WorldGenerator.pointsPerChunkRow));

        return this.terrainMap[row][col];

    }

    display(p5: P5) {
        let centerX = this.x * this.scl;
        let centerY = this.y * this.scl;
        let ppChunkRow = WorldGenerator.pointsPerChunkRow;
        let miniTileWidth = this.scl / ppChunkRow;

        p5.rectMode(p5.CORNER);
        p5.noStroke();
        for (let i = -ppChunkRow / 2; i < ppChunkRow / 2; i++) {
            for (let j = -ppChunkRow / 2; j < ppChunkRow / 2; j++) {
                let val = this.terrainMap[i + ppChunkRow / 2][j + ppChunkRow / 2];
                if (val == 0) {
                    p5.fill("blue");
                } else if (val == 1) {
                    p5.fill("green");
                } else if (val == 2) {
                    p5.fill("darkgreen");
                } else if (val == 3) {
                    p5.fill("gray");
                } else if (val == 4) {
                    p5.fill("tan");
                }

                p5.rect(centerX + j * miniTileWidth, centerY + i * miniTileWidth, miniTileWidth);
            }
        }

        // p5.rectMode(p5.CENTER);

        // p5.strokeWeight(3);
        // p5.stroke(255);
        // p5.noFill();
        // p5.rect(centerX, centerY, this.scl, this.scl);
    }
}
