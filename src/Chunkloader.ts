import P5 from "p5";
import MyVector from "./MyVector";
import Tile from "./Tile";
import WorldGenerator from "./WorldGenerator";

const MAX_LOADED_TILES = 500;

export default class Chunkloader {
    loadedTiles: Tile[];
    tileLookupTable: Map<number, Map<number, Tile>>;
    loadedRadiusX: number;
    loadedRadiusY: number;

    loadedCenter: MyVector;

    scl: number;

    worldGenerator: WorldGenerator;

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

        let chunkX = Math.floor(posX/this.scl);
        let chunkY = Math.floor(posY/this.scl);
        // console.log(chunkX, chunkY)

        if (!this.tileLookupTable.has(chunkX) || this.tileLookupTable.get(chunkX).get(chunkY) == undefined) {
            throw new Error("Trying to move to tile that hasnt been loaded!" + chunkX + "," + JSON.stringify(this.tileLookupTable.get(chunkX)));
        }

        let tile = this.tileLookupTable.get(chunkX).get(chunkY);


        let offsetX = Math.abs(posX) % this.scl;
        let offsetY = Math.abs(posY) % this.scl;

        if(posX < 0 && offsetX != 0) {
            offsetX = this.scl - offsetX;
        } 

        if (posY < 0 && offsetY != 0) {
            offsetY = this.scl - offsetY;
        } 

        let val = tile.valueOf(offsetX, offsetY);
        if(val == 1 || val == 4) return true;
        else return false;

    }

    addToLookupTable(tile: Tile) {
        if(!this.tileLookupTable.has(tile.x)) {
            this.tileLookupTable.set(tile.x, new Map());
        }
        this.tileLookupTable.get(tile.x).set(tile.y, tile);
        // this.tileLookupTable[tile.x].set(tile.y, tile);
        // this.tileLookupTable[tile.x][tile.y] = tile;
        // console.log("Adding", tile.x, tile.y, this.tileLookupTable)
    }

    removeFromLookupTable(tile: Tile) {
        if (!this.tileLookupTable.has(tile.x)) {
            return;
        }

        this.tileLookupTable.get(tile.x).delete(tile.y);

        if(this.tileLookupTable.get(tile.x).size == 0) {
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
        if (playerXChunk - this.loadedCenter.x > 0) {
            // Load chunks to the right
            for (let i = -this.loadedRadiusY; i <= this.loadedRadiusY; i++) {
                let newTileChunkX = playerXChunk + this.loadedRadiusX;
                let newTileChunkY = playerYChunk + i;
                let tile = new Tile(p5, newTileChunkX, newTileChunkY, this.scl, this.worldGenerator);
                this.loadedTiles.push(tile);
                this.addToLookupTable(tile)
            }
        }
        if (playerXChunk - this.loadedCenter.x < 0) {
            // Load chunks to the left
            for (let i = -this.loadedRadiusY; i <= this.loadedRadiusY; i++) {
                let newTileChunkX = playerXChunk - this.loadedRadiusX;
                let newTileChunkY = playerYChunk + i;
                let tile = new Tile(p5, newTileChunkX, newTileChunkY, this.scl, this.worldGenerator);
                this.loadedTiles.push(tile);
                this.addToLookupTable(tile)
            }
        }

        if (playerYChunk - this.loadedCenter.y > 0) {
            // Load chunks downward
            for (let i = -this.loadedRadiusX; i <= this.loadedRadiusX; i++) {
                let newTileChunkX = playerXChunk + i;
                let newTileChunkY = playerYChunk + this.loadedRadiusY;
                let tile = new Tile(p5, newTileChunkX, newTileChunkY, this.scl, this.worldGenerator);
                this.loadedTiles.push(tile);
                this.addToLookupTable(tile)
            }
        }
        if (playerYChunk - this.loadedCenter.y < 0) {
            // Load chunks above
            for (let i = -this.loadedRadiusX; i <= this.loadedRadiusX; i++) {
                let newTileChunkX = playerXChunk + i;
                let newTileChunkY = playerYChunk - this.loadedRadiusY;
                let tile = new Tile(p5, newTileChunkX, newTileChunkY, this.scl, this.worldGenerator);
                this.loadedTiles.push(tile);
                this.addToLookupTable(tile)
            }
        }
        // Shift the player center
        this.loadedCenter.x = playerXChunk;
        this.loadedCenter.y = playerYChunk;
    }
}
