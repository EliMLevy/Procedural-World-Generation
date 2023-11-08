import P5, { Vector } from "p5";
import Tile from "./Tile";
import MyVector from "./MyVector";
import Chunkloader from "./Chunkloader";
import WorldGenerator from "./WorldGenerator";

new P5((p5: P5) => {
    const scl: number = 100;
    const worldOffset: MyVector = new MyVector(0, 0);

    const moving: MyVector = new MyVector(0, 0);

    const moveSpeed = 9;

    let chunkLoader: Chunkloader;
    let worldGenerator: WorldGenerator;

    const playerChunk = new MyVector(0, 0);
    const playerPos = new MyVector(0, 0);

    p5.setup = () => {
        const canvas = p5.createCanvas(p5.windowWidth - 10, p5.windowHeight - 10);
        canvas.parent("app");

        p5.randomSeed(110);
        p5.frameRate(30);

        worldGenerator = new WorldGenerator(scl, scl / 20);
        chunkLoader = new Chunkloader(p5, 8, 5, scl, worldGenerator);
    };

    p5.draw = () => {
        
        playerPos.x = -worldOffset.x + scl / 2;
        playerPos.y = -worldOffset.y + scl / 2;
        
        playerChunk.x = Math.floor((-worldOffset.x + scl / 2) / scl);
        playerChunk.y = Math.floor((-worldOffset.y + scl / 2) / scl);
        
        if (chunkLoader.canMove(playerPos.x + moving.x * moveSpeed, playerPos.y)) {
            worldOffset.x += -moving.x * moveSpeed;
        } else {
            console.log("Cant move x");
        }

        if (chunkLoader.canMove(playerPos.x , playerPos.y + moving.y * moveSpeed)) {
            worldOffset.y += -moving.y * moveSpeed;
        }  else {
            
            console.log("Cant move y");
        }
        p5.push();
        p5.translate(worldOffset.x, worldOffset.y);
        chunkLoader.displayLoadedChunks(p5, playerChunk.x, playerChunk.y);
        p5.pop();

        p5.fill("cyan");
        p5.ellipse(p5.width / 2, p5.height / 2, scl * 0.4);

        chunkLoader.updateLoadedChunks(p5, playerChunk.x, playerChunk.y);

        displayStats(p5);
    };

    function displayStats(p5: P5) {
        p5.textSize(20);
        p5.fill(255);
        p5.stroke(0);
        p5.strokeWeight(1);
        p5.text("FPS: " + Math.floor(p5.frameRate()), 10, 20);
        p5.text("Loaded Chunks: " + chunkLoader.loadedTiles.length, 10, 40);
    }

    p5.keyPressed = (e: KeyboardEvent) => {
        if (e.key == "a") {
            moving.x += -1;
        } else if (e.key == "d") {
            moving.x += 1;
        }
        if (e.key == "w") {
            moving.y += -1;
        } else if (e.key == "s") {
            moving.y += 1;
        }
    };

    p5.keyReleased = (e: KeyboardEvent) => {
        if (e.key == "a") {
            moving.x -= -1;
        } else if (e.key == "d") {
            moving.x -= 1;
        }
        if (e.key == "w") {
            moving.y -= -1;
        } else if (e.key == "s") {
            moving.y -= 1;
        }
    };
});
