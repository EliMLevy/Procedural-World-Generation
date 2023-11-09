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

    static OCEAN: number = 0;
    static LAND: number = 100;
    static TREE: number = 200;
    static ROCK: number = 300;
    static SAND: number = 400;

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
            }
        }

        return result;
    }

    // Evaluate without calculating the subtype
    simpleEvaluation(p5: P5, x: number, y: number) {
        // console.log(x, y)
        p5.noiseSeed(110);
        let ocean = p5.noise(x * this.noiseStep + 1_000_000, y * this.noiseStep + 1_000_000) * this.noiseScl;
        if (ocean < this.waterThreshold) {
            return WorldGenerator.OCEAN;
        }

        let biome = p5.noise(x * this.noiseStep - 6_023_000, y * this.noiseStep - 6_022_999.9) * this.noiseScl;
        if (biome < this.forestThreshold) {
            return WorldGenerator.TREE;
        } else if (biome > this.desertThreshold) {
            return WorldGenerator.SAND;
        }

        let r = p5.random(100);
        if (r < 1) {
            return WorldGenerator.ROCK;
        } else if (r < 4) {
            return WorldGenerator.TREE;
        } else {
            return WorldGenerator.LAND;
        }
    }

    evaluate(p5: P5, x: number, y: number) {
        // console.log(x, y)
        p5.noiseSeed(110);
        let ocean = p5.noise(x * this.noiseStep + 1_000_000, y * this.noiseStep + 1_000_000) * this.noiseScl;
        if (ocean < this.waterThreshold) {
            return WorldGenerator.OCEAN + Math.floor(Math.random() * 4);
        }

        let biome = p5.noise(x * this.noiseStep - 6_023_000, y * this.noiseStep - 6_022_999.9) * this.noiseScl;
        if (biome < this.forestThreshold) {
            return WorldGenerator.TREE + this.findGrassSubType(p5, x, y);
        } else if (biome > this.desertThreshold) {
            return WorldGenerator.SAND;
        }

        let r = p5.random(100);
        if (r < 1) {
            return WorldGenerator.ROCK + this.findGrassSubType(p5, x, y);
        } else if (r < 4) {
            return WorldGenerator.TREE + this.findGrassSubType(p5, x, y);
        } else {
            let subtype = this.findGrassSubType(p5, x, y);
            if(subtype == 4) {
                if(r < 8) {
                    subtype = 9 + Math.floor(Math.random() * 3);
                }
            }
            return WorldGenerator.LAND + subtype;
        }
    }

    findGrassSubType(p5: P5, x: number, y: number) {
        let subtype = 0;

        let delta = this.scl / WorldGenerator.pointsPerChunkRow;

        let left = this.simpleEvaluation(p5, x - delta, y);
        let right = this.simpleEvaluation(p5, x + delta, y);
        let up = this.simpleEvaluation(p5, x, y - delta);
        let down = this.simpleEvaluation(p5, x, y + delta);

        if (left == WorldGenerator.OCEAN) {
            if (up == WorldGenerator.OCEAN) {
                subtype = 0;
            } else if (down == WorldGenerator.OCEAN) {
                subtype = 2;
            } else {
                subtype = 1;
            }
        } else if (right == WorldGenerator.OCEAN) {
            if (up == WorldGenerator.OCEAN) {
                subtype = 6;
            } else if (down == WorldGenerator.OCEAN) {
                subtype = 8;
            } else {
                subtype = 7;
            }
        } else {
            if (up == WorldGenerator.OCEAN) {
                subtype = 3;
            } else if (down == WorldGenerator.OCEAN) {
                subtype = 5;
            } else {
                subtype = 4;
            }
        }

        return subtype;
    }
}
