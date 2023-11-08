import P5, { Vector } from "p5";
import MyVector from "./MyVector";
import Chunkloader from "./Chunkloader";
import WorldGenerator from "./WorldGenerator";

new P5((p5: P5) => {
    const scl: number = 100;
    const moveSpeed = 9;

    const worldOffset: MyVector = new MyVector(0, 0);
    const playerChunk = new MyVector(0, 0);
    const playerPos = new MyVector(0, 0);
    const moving: MyVector = new MyVector(0, 0);

    let chunkLoader: Chunkloader;
    let worldGenerator: WorldGenerator;


    p5.setup = () => {
        const canvas = p5.createCanvas(p5.windowWidth - 10, p5.windowHeight - 10);
        canvas.parent("app");

        p5.randomSeed(110);
        p5.frameRate(30);

        worldGenerator = new WorldGenerator(scl, scl / 20);

        let xChunks = Math.floor(p5.windowWidth / scl);
        let yChunks = Math.floor(p5.windowHeight / scl);
        console.log(xChunks, yChunks)

        chunkLoader = new Chunkloader(p5, xChunks, yChunks, scl, worldGenerator);

        console.log(chunkLoader.tileLookupTable.get(-1).get(0))
    };

    p5.draw = () => {
        
        playerPos.x = -worldOffset.x + scl / 2;
        playerPos.y = -worldOffset.y + scl / 2;
        
        playerChunk.x = Math.floor((-worldOffset.x + scl / 2) / scl);
        playerChunk.y = Math.floor((-worldOffset.y + scl / 2) / scl);
        
        if (chunkLoader.canMove(playerPos.x + moving.x * moveSpeed, playerPos.y)) {
            worldOffset.x += -moving.x * moveSpeed;
        }

        if (chunkLoader.canMove(playerPos.x , playerPos.y + moving.y * moveSpeed)) {
            worldOffset.y += -moving.y * moveSpeed;
        } 
        p5.push();
        p5.translate(worldOffset.x, worldOffset.y);
        chunkLoader.displayLoadedChunks(p5, playerChunk.x, playerChunk.y);
        p5.pop();

        drawPlayer(p5);


        

        chunkLoader.updateLoadedChunks(p5, playerChunk.x, playerChunk.y);

        displayStats(p5);
    };

    function drawPlayer(p5: P5) {
        p5.push();
        p5.translate(p5.width / 2, p5.height / 2);
        p5.rectMode(p5.CENTER);
        p5.fill("lightgreen");
        p5.rect(0, 0, scl / 5, scl/5, scl/30);
        // Left eye
        p5.fill(0);
        p5.ellipse(-scl / 20, -scl / 25, scl / 13);
        p5.fill(255);
        p5.ellipse(-scl / 20, -scl / 25, scl / 25);

        // Right eye        
        p5.fill(0);
        p5.ellipse(scl / 20, -scl / 25, scl / 13);
        p5.fill(255);
        p5.ellipse(scl / 20, -scl / 25, scl / 25);

        p5.fill(0)
        p5.arc(0, scl/30, scl/7, scl/13, 0, p5.PI);

        p5.pop();
    }

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
