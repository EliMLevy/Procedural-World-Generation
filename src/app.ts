import P5, { Vector } from "p5";
import MyVector from "./MyVector";
import Chunkloader from "./Chunkloader";
import WorldGenerator from "./WorldGenerator";
import TextureSlice from "./TextureSlice";
import Player from "./Player";

new P5((p5: P5) => {
    const scl: number = 100;
    const moveSpeed = 9;

    const worldOffset: MyVector = new MyVector(0, 0);
    const playerChunk = new MyVector(0, 0);
    const playerPos = new MyVector(0, 0);
    const moving: MyVector = new MyVector(0, 0);

    let chunkLoader: Chunkloader;
    let worldGenerator: WorldGenerator;

    let grassAtlas: P5.Image, waterAtlas: P5.Image, treeAtlas: P5.Image, playerAtlas: P5.Image;

    let player: Player;

    p5.preload = () => {
        grassAtlas = p5.loadImage("assets/Grass.png");
        waterAtlas = p5.loadImage("assets/Water.png");
        treeAtlas = p5.loadImage("assets/Basic Grass Biom things 1.png");
        playerAtlas = p5.loadImage("assets/Basic Charakter Spritesheet.png");
    };

    p5.setup = () => {

        console.log("Huge thanks to Cup Nooble for the game assets! You can find the original assets at https://cupnooble.itch.io/sprout-lands-asset-pack");

        let xChunks = p5.min(Math.floor(p5.windowWidth / scl), 6);
        let yChunks = p5.min(Math.floor(p5.windowHeight / scl), 4);

        const canvas = p5.createCanvas((xChunks * 2 - 1) * scl, (yChunks * 2 - 1) * scl);
        canvas.parent("app");

        p5.randomSeed(110);
        p5.frameRate(30);

        worldGenerator = new WorldGenerator(scl, scl / 50);

        console.log(xChunks, yChunks);

        chunkLoader = new Chunkloader(p5, xChunks, yChunks, scl, worldGenerator);
        chunkLoader.setGrass(grassAtlas, [
            // Cardinal directions
            new TextureSlice(18 + 16 * 0, 50 + 16 * 0, 16, 16),
            new TextureSlice(18 + 16 * 0, 50 + 16 * 1, 16, 16),
            new TextureSlice(18 + 16 * 0, 46 + 16 * 2, 16, 16),
            new TextureSlice(16 + 16 * 1, 50 + 16 * 0, 16, 16),
            new TextureSlice(16 + 16 * 1, 48 + 16 * 1, 16, 16),
            new TextureSlice(16 + 16 * 1, 46 + 16 * 2, 16, 16),
            new TextureSlice(14 + 16 * 2, 50 + 16 * 0, 16, 16),
            new TextureSlice(14 + 16 * 2, 48 + 16 * 1, 16, 16),
            new TextureSlice(14 + 16 * 2, 46 + 16 * 2, 16, 16),
            // vegetation texture
            new TextureSlice(0, 0, 16, 16),
            new TextureSlice(16, 0, 16, 16),
            new TextureSlice(32, 0, 16, 16),
        ]);
        chunkLoader.setTree(treeAtlas, [new TextureSlice(16, 0, 33, 33)]);
        chunkLoader.setRock(treeAtlas, [new TextureSlice(127, 16, 17, 17)]);
        chunkLoader.setWater(waterAtlas, [new TextureSlice(0, 0, 16, 16), new TextureSlice(16, 0, 16, 16), new TextureSlice(32, 0, 16, 16), new TextureSlice(48, 0, 16, 16)]);

        player = new Player(p5.width / 2, p5.height / 2, scl / 3, scl / 3, playerAtlas, new TextureSlice(15, 15, 18, 18));
        player.addAnimation(Player.STANDING_FRONT, [new TextureSlice(15, 15, 18, 18), new TextureSlice(63, 15, 18, 18)], 0.1);
        player.addAnimation(Player.STANDING_BACK, [new TextureSlice(15, 15 + 48, 18, 18), new TextureSlice(63, 15 + 48, 18, 18)], 0.1);
        player.addAnimation(Player.STANDING_LEFT, [new TextureSlice(15, 15 + 48 + 48, 18, 18), new TextureSlice(63, 15 + 48 + 48, 18, 18)], 0.1);
        player.addAnimation(Player.STANDING_RIGHT, [new TextureSlice(15, 15 + 48 + 48 + 48, 18, 18), new TextureSlice(63, 15 + 48 + 48 + 48, 18, 18)], 0.1);
        
        player.addAnimation(Player.WALKING_FRONT, [new TextureSlice(15 + 48 * 2, 15 + 48 * 0, 18, 18), new TextureSlice(15 + 48 * 3, 15 + 48 * 0, 18, 18)], 0.3);
        player.addAnimation(Player.WALKING_BACK,  [new TextureSlice(15 + 48 * 2, 15 + 48 * 1, 18, 18), new TextureSlice(15 + 48 * 3, 15 + 48 * 1, 18, 18)], 0.3);
        player.addAnimation(Player.WALKING_LEFT,  [new TextureSlice(15 + 48 * 2, 15 + 48 * 2, 18, 18), new TextureSlice(15 + 48 * 3, 15 + 48 * 2, 18, 18)], 0.3);
        player.addAnimation(Player.WALKING_RIGHT, [new TextureSlice(15 + 48 * 2, 15 + 48 * 3, 18, 18), new TextureSlice(15 + 48 * 3, 15 + 48 * 3, 18, 18)], 0.3);
        // player.addAnimation(Player.WALKING_BACK, [new TextureSlice(15 + 48 + 48, 15 + 48, 18, 18), new TextureSlice(63 + 48 + 48, 15 + 48, 18, 18)], 0.3);
        // player.addAnimation(Player.WALKING_LEFT, [new TextureSlice(15 + 48 + 48, 15 + 48, 18, 18), new TextureSlice(63 + 48 + 48, 15 + 48, 18, 18)], 0.3);
        // player.addAnimation(Player.WALKING_RIGHT, [new TextureSlice(15 + 48 + 48, 15 + 48, 18, 18), new TextureSlice(63 + 48 + 48, 15 + 48, 18, 18)], 0.3);
    };

    p5.draw = () => {
        playerPos.x = -worldOffset.x + scl / 2;
        playerPos.y = -worldOffset.y + scl / 2;

        playerChunk.x = Math.floor((-worldOffset.x + scl / 2) / scl);
        playerChunk.y = Math.floor((-worldOffset.y + scl / 2) / scl);

        if (chunkLoader.canMove(playerPos.x + moving.x * moveSpeed, playerPos.y)) {
            worldOffset.x += -moving.x * moveSpeed;
        }

        if (chunkLoader.canMove(playerPos.x, playerPos.y + moving.y * moveSpeed)) {
            worldOffset.y += -moving.y * moveSpeed;
        }

        if(moving.x < 0) {
            player.moveLeft();
        } else if(moving.x > 0) {
            player.moveRight();
        } else if(moving.y < 0) {
            player.moveUp();
        } else if(moving.y > 0) {
            player.moveDown();
        } else {
            player.stopWalking();
        }

        p5.push();
        p5.translate(worldOffset.x, worldOffset.y);
        // p5.scale(1.5);

        chunkLoader.displayLoadedChunks(p5, playerChunk.x, playerChunk.y);
        p5.pop();

        // drawPlayer(p5);

        player.display(p5);

        chunkLoader.updateLoadedChunks(p5, playerChunk.x, playerChunk.y);

        // displayStats(p5);
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
