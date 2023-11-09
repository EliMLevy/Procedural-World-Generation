import P5 from "p5";
import MyVector from "./MyVector";
import Tile from "./Tile";
import WorldGenerator from "./WorldGenerator";
import TextureSlice from "./TextureSlice";

const MAX_LOADED_TILES = 500;

export default class Chunkloader {
    loadedTiles: Tile[];
    tileLookupTable: Map<number, Map<number, Tile>>;
    loadedRadiusX: number;
    loadedRadiusY: number;

    loadedCenter: MyVector;

    scl: number;

    worldGenerator: WorldGenerator;

    static grassTextureLoaded: boolean;
    static grassTextureSlices: P5.Image[] = [];

    static treeTextureLoaded: boolean;
    static treeTextureSlices: P5.Image[] = [];

    static rockTextureLoaded: boolean;
    static rockTextureSlices: P5.Image[] = [];

    static waterTextureLoaded: boolean;
    static waterTextureSlices: P5.Image[] = [];

    constructor(p5: P5, radiusX: number, radiusY: number, scl: number, worldGenerator: WorldGenerator) {
        this.scl = scl;
        this.loadedRadiusX = radiusX;
        this.loadedRadiusY = radiusY;
        this.loadedCenter = new MyVector(0, 0);
        this.loadedTiles = [];
        this.tileLookupTable = new Map();

        this.worldGenerator = worldGenerator;

        for (let i = -this.loadedRadiusX; i <= this.loadedRadiusX; i++) {
            for (let j = -this.loadedRadiusY; j <= this.loadedRadiusY; j++) {
                let tile = new Tile(p5, i, j, scl, worldGenerator);
                this.loadedTiles.push(tile);
                this.addToLookupTable(tile);
            }
        }
    }

    canMove(posX: number, posY: number) {
        let chunkX = Math.floor(posX / this.scl);
        let chunkY = Math.floor(posY / this.scl);
        // console.log(chunkX, chunkY)

        if (!this.tileLookupTable.has(chunkX) || this.tileLookupTable.get(chunkX).get(chunkY) == undefined) {
            throw new Error("Trying to move to tile that hasnt been loaded!" + chunkX + "," + JSON.stringify(this.tileLookupTable.get(chunkX)));
        }

        let tile = this.tileLookupTable.get(chunkX).get(chunkY);

        let offsetX = Math.abs(posX) % this.scl;
        let offsetY = Math.abs(posY) % this.scl;

        if (posX < 0 && offsetX != 0) {
            offsetX = this.scl - offsetX;
        }

        if (posY < 0 && offsetY != 0) {
            offsetY = this.scl - offsetY;
        }

        let val = tile.valueOf(offsetX, offsetY);
        let type = Math.floor(val / 100) * 100;
        // console.log(val)
        if (type == WorldGenerator.LAND || type == WorldGenerator.SAND) return true;
        else return false;
    }

    addToLookupTable(tile: Tile) {
        if (!this.tileLookupTable.has(tile.x)) {
            this.tileLookupTable.set(tile.x, new Map());
        }
        this.tileLookupTable.get(tile.x).set(tile.y, tile);
    }

    removeFromLookupTable(tile: Tile) {
        if (!this.tileLookupTable.has(tile.x)) {
            throw new Error("Tried removing tile that was not loaded." + JSON.stringify(tile));
        }

        this.tileLookupTable.get(tile.x).delete(tile.y);

        if (this.tileLookupTable.get(tile.x).size == 0) {
            this.tileLookupTable.delete(tile.x);
        }
    }

    displayLoadedChunks(p5: P5, playerXChunk: number, playerYChunk: number) {
        // p5.push();
        p5.translate(p5.width / 2, p5.height / 2);
        p5.background(0);

        for (let i = this.loadedTiles.length - 1; i >= 0; i--) {
            // If this tile is in the radius, display it, otherwise remove it
            let tile = this.loadedTiles[i];
            if (Math.abs(tile.x - playerXChunk) > this.loadedRadiusX || Math.abs(tile.y - playerYChunk) > this.loadedRadiusY) {
                // console.log("Not visible: ", tile.x, tile.y)
                if (this.loadedTiles.length > MAX_LOADED_TILES) {
                    this.removeFromLookupTable(tile);
                    this.loadedTiles.splice(i, 1);
                }
            } else {
                this.loadedTiles[i].display(p5);
            }
        }

        // p5.pop();
    }

    updateLoadedChunks(p5: P5, playerXChunk: number, playerYChunk: number) {
        if (playerXChunk - this.loadedCenter.x > 0 || playerXChunk - this.loadedCenter.x < 0) {
            // Load chunks to the right or left
            let dir = playerXChunk - this.loadedCenter.x > 0 ? 1 : -1;

            for (let i = -this.loadedRadiusY; i <= this.loadedRadiusY; i++) {
                let newTileChunkX = playerXChunk + dir * this.loadedRadiusX;
                let newTileChunkY = playerYChunk + i;
                if (!this.tileLookupTable.has(newTileChunkX) || !this.tileLookupTable.get(newTileChunkX).has(newTileChunkY)) {
                    let tile = new Tile(p5, newTileChunkX, newTileChunkY, this.scl, this.worldGenerator);
                    this.loadedTiles.push(tile);
                    this.addToLookupTable(tile);
                }
            }
        }

        if (playerYChunk - this.loadedCenter.y > 0 || playerYChunk - this.loadedCenter.y < 0) {
            // Load chunks downward or upward
            let dir = playerYChunk - this.loadedCenter.y > 0 ? 1 : -1;
            for (let i = -this.loadedRadiusX; i <= this.loadedRadiusX; i++) {
                let newTileChunkX = playerXChunk + i;
                let newTileChunkY = playerYChunk + dir * this.loadedRadiusY;
                if (!this.tileLookupTable.has(newTileChunkX) || !this.tileLookupTable.get(newTileChunkX).has(newTileChunkY)) {
                    let tile = new Tile(p5, newTileChunkX, newTileChunkY, this.scl, this.worldGenerator);
                    this.loadedTiles.push(tile);
                    this.addToLookupTable(tile);
                }
            }
        }
        // Shift the player center
        this.loadedCenter.x = playerXChunk;
        this.loadedCenter.y = playerYChunk;
    }

    setGrass(img: P5.Image, slices: TextureSlice[]) {
        if (slices.length > 0) Chunkloader.grassTextureLoaded = true;
        slices.forEach((slice) => {
            Chunkloader.grassTextureSlices.push(img.get(slice.x, slice.y, slice.w, slice.h));
        });
    }

    setTree(img: P5.Image, slices: TextureSlice[]) {
        if (slices.length > 0) Chunkloader.treeTextureLoaded = true;
        slices.forEach((slice) => {
            Chunkloader.treeTextureSlices.push(img.get(slice.x, slice.y, slice.w, slice.h));
        });
    }

    setRock(img: P5.Image, slices: TextureSlice[]) {
        if (slices.length > 0) Chunkloader.rockTextureLoaded = true;
        slices.forEach((slice) => {
            Chunkloader.rockTextureSlices.push(img.get(slice.x, slice.y, slice.w, slice.h));
        });
    }

    setWater(img: P5.Image, slices: TextureSlice[]) {
        if (slices.length > 0) Chunkloader.waterTextureLoaded = true;
        slices.forEach((slice) => {
            Chunkloader.waterTextureSlices.push(img.get(slice.x, slice.y, slice.w, slice.h));
        });
    }
}
