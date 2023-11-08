import P5 from "p5";

export default class WorldGenerator {
    /**
     * A chunk is a square with side length of scl
     * To generate the terrain, we will tile the chunk with terrain tiles.
     * These tiles can be water, empty land, land with tree, or land with rock.
     * The number of tiles per chunk will be X*X. We will call X pointsPerChunkRow
     */

    scl: number;
    static pointsPerChunkRow: number;

    noiseScl: number = 255;
    noiseStep: number = 0.0005;
    waterThreshold: number = 90;

    forestThreshold: number = 65;
    desertThreshold: number = 190;

    OCEAN: number = 0;
    LAND: number = 1;
    TREE: number = 2;
    ROCK: number = 3;
    SAND: number = 4;

    constructor(scl: number, pointsPerChunkRow: number) {
        this.scl = scl;
        WorldGenerator.pointsPerChunkRow = pointsPerChunkRow;
    }

    generateChunk(p5: P5, x: number, y: number) {
        let delta = this.scl / WorldGenerator.pointsPerChunkRow;
        let result: number[][] = [];
        for (let j = y; j < y + this.scl; j += delta) {
            result[(j - y) / delta] = [];
            for (let i = x; i < x + this.scl; i += delta) {
                result[(j - y) / delta][(i - x) / delta] = this.evaluate(p5, i, j);
                // let ocean = this.isOcean(p5, i, j);

                // if (ocean) {
                //     result[(j - y) / delta][(i - x) / delta] = this.OCEAN;
                // } else {
                //     let r = Math.floor(p5.random(0, 100));
                //     if (r < 90) {
                //         result[(j - y) / delta][(i - x) / delta] = this.LAND;
                //     } else if (r < 95) {
                //         result[(j - y) / delta][(i - x) / delta] = this.TREE;
                //     } else if (r < 100) {
                //         result[(j - y) / delta][(i - x) / delta] = this.ROCK;
                //     }
                // }
            }
        }

        return result;
    }

    evaluate(p5: P5, x: number, y: number) {
        // console.log(x, y)
        p5.noiseSeed(110);
        let ocean = p5.noise(x * this.noiseStep + 1_000_000, y * this.noiseStep + 1_000_000) * this.noiseScl;
        if (ocean < this.waterThreshold) return this.OCEAN;
        
        
        let biome = p5.noise(x * this.noiseStep - 6_023_000, y * this.noiseStep - 6_022_999.9) * this.noiseScl;
        if (biome < this.forestThreshold) return this.TREE;
        else if(biome > this.desertThreshold) return this.SAND;

        let r = p5.random(100);
        if (r < 1) return this.ROCK;
        else if (r < 4) return this.TREE;
        else return this.LAND;
    }
}
