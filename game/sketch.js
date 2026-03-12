    var floorPos_y;
    var scrollPos;
    var isDead;
    var lives;
    var block;
    var blockLeft;
    var blockRight;
    let volume = "🔈";
    let startJump; 
    let currentJumpPos; 
    let musicIsPlaying = false;
    let playWinSound;
    let playEndSound;

    function preload() {
        font = loadFont('./fonts/font.ttf');
        font2 = loadFont('./fonts/font2.ttf');
        backgroundSound = loadSound('./sounds/melissa juice.mp3');
        popSound = loadSound('./sounds/pop.mp3');
        winSound = loadSound('./sounds/win.mp3');
        fallSound = loadSound('./sounds/fall.mp3');
        endSound = loadSound('./sounds/end.mp3');
        backgroundSound.setVolume(0.5);
        popSound.setVolume(0.5);
        fallSound.setVolume(0.4);
        endSound.setVolume(0.4);
        winSound.setVolume(0.7);
    }

    function startGame() 
    {
        playWinSound = true;
        playEndSound = true;
        isDead = false;
        char.isPlummeting = false;
        scrollPos = 0;
        
        char2 = {
            x: 2500,
            y: floorPos_y,
        }
        
        char = {
            x: 300,
            y: floorPos_y,
            canJump: true,
            isLeft: false,
            isRight: false,
            isFalling: false,
            isPlummeting: false,
            isJumping: false,

            move: function() 
            {
                if(char.isLeft && char.isFalling) {
                    drawIsJumpingLeft();
                }
                else if(char.isLeft) {
                    drawIsLeft();
                }
                else if(char.isRight && char.isFalling) {
                    drawIsJumpingRight();
                }
                else if(char.isRight) {
                    drawIsRight();
                }   
                else if(char.isFalling) {
                    drawIsFalling();
                }   
                else if(char.isPlummeting) {
                    drawIsFalling();
                }
                else {
                    isStanding();
                }    
                
                if (char.isLeft) {
                    char.x -= 5;
                    scrollPos +=5;
                }
                else if (char.isRight) {
                    char.x += 5;
                    scrollPos -=5;
                }
                if (char.y < floorPos_y) {
                    let onPlatform = false;
                    for (var i in platforms) {
                        if (platforms[i].checkPlatform(char.x, char.y)) {
                            char.isFalling = false;
                            char.isJumping = false;
                            onPlatform = true;
                            char.canJump = true;
                            break;
                        }
                        char.canJump = false;
                    }
                    if (!onPlatform) {
                        char.isFalling = true;
                        char.y += 4;
                    }
                } else {
                    char.isFalling = false;
                }
            }
        }
        
        
        moon = {
            x: width - 150,
            y: 100,
            size: 100
        }
        
        enemy = [
            {x: 1600, y: floorPos_y - 30, isReached: false},
            {x: 950, y: floorPos_y - 30, isReached: false}
        ]
        
        platforms = [];
        platforms.push(createPlatforms(625, floorPos_y - 80, 100));
        platforms.push(createPlatforms(1200, floorPos_y - 80, 100));  
        platforms.push(createPlatforms(900, floorPos_y - 80, 100));
        
        tree = [
            {size: 14, x: 100, y: floorPos_y - 50},
            {size: 16, x: 1200, y: floorPos_y - 50},
            {size: 13, x: 500, y: floorPos_y - 50},
            {size: 12, x: 800, y: floorPos_y - 50},
            {size: 14, x: 1600, y: floorPos_y - 50},
            {size: 12, x: 2300, y: floorPos_y - 50}
        ]
        
        canyon = [
            {x: 150, width: 100},
            {x: 570, width: 200},
            {x: 1400, width: 100}
        ]

        collectable = [
            {x: 400, y: floorPos_y - 20, size: 12, isFound: false},
            {x: 660, y: floorPos_y - 90, size: 12, isFound: false},
            {x: 1300, y: floorPos_y - 20, size: 12, isFound: false},
            {x: 1800, y: floorPos_y - 20, size: 12, isFound: false}
        ]

        cloud = [
            {x:160, y: 100, size: 50},
            {x:450, y: 160, size: 40}
        ]

        mountain = [
            {x: 600, size: 200},
            {x: 100, size: 250}
        ]
        
        game_score = {
            x: 25,
            y: 70,
            size: 10,
            count: 0
        }
        
        grave = {
            x: 1900,
            isReached: false
        }
        
    }

    function setup() {
        createCanvas(1024, 576);
        floorPos_y = 432; 
        lives = 3;  

        startGame();
    } 


    function draw()
    {
        
        background(172, 175, 250); 
        noStroke();
        drawMoon();
        jump(); 
        blockLeft = false;
        blockRight = false;
        block = false;
        //draw cloud
        for (let i = 0; i < cloud.length; i++) {
            drawCloud(cloud[i]);
        }
        
        //mountain
        for (let i = 0; i < mountain.length; i++) {
            drawMountain(mountain[i]);
        }
        
        //texts
        textAlign(CENTER);
        textSize(25);
        fill(200, 0, 0);
        text("🖤", 35, 40);
        text(volume, width * 20 / 21, height / 10);
        textSize(20);
        fill(30, 31, 64);
        text(lives, 68, 40);
        text(game_score.count, 68, 75);
        textFont('font', 17);
        text("press space to restart", width * 0.85, height / 28);
        
        stroke(24, 66, 63);
        strokeWeight(3);
        line(game_score.x, game_score.y, game_score.x + 10, game_score.y - 20);
        line(game_score.x + 10, game_score.y - 20, game_score.x + 20, game_score.y);
        stroke(190, 0, 0);
        strokeWeight(3);
        fill(230, 0, 50);
        ellipse(game_score.x, game_score.y, game_score.size, game_score.size);
        ellipse(game_score.x + 10 * 2, game_score.y, game_score.size, game_score.size);
        noStroke();
        
        translate(scrollPos,0);
        push();
        
        fill(99, 58, 53)
        rect(-400, 100, 400, height);
        fill(130, 102, 70);
        rect(-100, 150, 50, 70);
        rect(-100, 300, 50, 70);
        rect(-200, 300, 50, 70);
        rect(-200, 150, 50, 70);
        rect(-300, 300, 50, 70);
        rect(-300, 150, 50, 70);
        
        fill(0);
        rect(-130, floorPos_y - 50, 10, 50);
        fill(200, 200, 200)
        rect(-160, floorPos_y - 90, 70, 40, 10);
        fill(0);
        textFont('font2', 20)
        text("humans", -125, floorPos_y - 72);
        text("only", -125, floorPos_y - 59);
        
        fill(37, 92, 86);
        rect(-400, floorPos_y, 3500, width - floorPos_y);
        noStroke();
        noStroke();
        
        //tree
        for (let i = 0; i < tree.length; i++) {
            drawTree(tree[i]);
        }
        
        //canyon
        for (let i = 0; i < canyon.length; i++) { 
            drawCanyon(canyon[i]);
        }
        
        //collactable
        for (let i = 0; i < collectable.length; i++) {
            if (collectable[i].isFound == false) {
                drawCollectable(collectable[i]); 
            }
        }
        //enemy
        for (let i = 0; i < enemy.length; i++) {
            drawEnemy(enemy[i]);
        }
        
        //platform
        for (var i in platforms) {
            platforms[i].draw();
        }
        
        
        drawGrave();
        pop();
        
        char.move();
        
        for (var i in enemy) {
            enemy[i].x -= 3;
        }
        
        for(let i = 0; i < canyon.length; i++) {
            if (char.x > canyon[i].x + 20 && char.x < canyon[i].x + canyon[i].width - 20 && char.y == floorPos_y) {
                char.isPlummeting = true;
                fallSound.play();
            }
            if (char.isPlummeting == true) {
                char.y += 5;
                char.isLeft = false;
                char.isRight = false;
                block = true;
                if (isDead & lives > 0) {
                    startGame();
                } 
                if (isDead & lives < 1) {
                    text("game over \npress space to restart", char.x + 200, height / 3);
                    break;
                }
                checkDie();
            }
        }
        
        
    
        
        if (!grave.isReached) {
            checkGrave();
        }
        
        if (!enemy.isReached) {
            checkEnemy();  
        }
        
        if (grave.isReached) {
            char.isLeft = false;
            char.isRight = false;
            block = true;
            text("level complete", char.x + 200, height / 3);
            if (playWinSound) {
                winSound.play();    
                playWinSound = false;
            }
            let count = 0;
            for (var i in collectable) {
                if (collectable[i].isFound) {
                    count++;
                }
                if (count == collectable.length) {
                    goodEnding();
                }
            }   
        }
        
        if (enemy.isReached) {
            if (playEndSound) {
                endSound.play();
                playEndSound = false;
            } 
            text("game over \npress space to restart", char.x + 200, height / 3);
            block = true; 
            char.isLeft = false;
            char.isRight = false;
        }
        
        
        if (char.x <= 15) {
            char.isLeft = false;
            blockLeft = true;
        }
        if (char.x >= 2033) {
            char.isRight = false;
            blockRight = true;
        }
    }


    function keyPressed() 
    {
        if (keyCode === 32) {
                lives = 3;
                startGame();
        }
        if (keyCode === 77) {
                if (!musicIsPlaying) {
                    backgroundSound.play();
                    musicIsPlaying = true;
                    volume = "🔊"
                }
                else if (musicIsPlaying) {
                    backgroundSound.pause();
                    musicIsPlaying = false;
                    volume = "🔈";
                }
        }
        if (block == false) {
            if (blockRight == false) {
                if (keyCode === RIGHT_ARROW || keyCode === 68) {
                    char.isRight = true;
                }
            }
            if (blockLeft == false) {
                if (keyCode === LEFT_ARROW || keyCode === 65) {
                    char.isLeft = true;
                }
            }
            char.isJumping = false;
            if (keyCode === UP_ARROW || keyCode === 87) {
                for (var i in platforms) {
                    if (!char.isJumping && (char.y == floorPos_y || platforms[i].y == char.y || char.canJump)) {
                        char.isJumping = true;
                        startJump = char.y;
                        currentJumpPos = char.y;
                    }
                }
            }
            
        }
    }
    function keyReleased() 
    {
        if (keyCode === LEFT_ARROW || keyCode === 65) {
            char.isLeft = false;
        }
        else if (keyCode === RIGHT_ARROW || keyCode === 68) {
            char.isRight = false;
        }
    }

    function drawCanyon(canyon)
    {
            fill(90,61,48);
            rect(canyon.x, floorPos_y, canyon.width, 200);
            fill(24, 66, 63);
            rect(canyon.x - 25, floorPos_y - 5, 20, 30, 20);
            rect(canyon.x - 10, floorPos_y - 5, 20, 50, 20);
            rect(canyon.x + canyon.width - 5, floorPos_y - 5, 20, 90, 20);
            rect(canyon.x - 10, floorPos_y - 5, 20, 50, 20);
        }
    function drawCloud(cloud) 
    {
            fill(240, 240, 240);
            rect(cloud.x, cloud.y - 5, cloud.size * 4.35, cloud.size, 70);

            arc(cloud.x + cloud.size * 0.75, cloud.y + cloud.size/2.8, cloud.size * 1.5, cloud.size * 1.5, PI, TWO_PI);

            arc(cloud.x + cloud.size * 2, cloud.y + cloud.size/2.8, cloud.size * 2.5, cloud.size * 2.5, PI, TWO_PI);

            arc(cloud.x + cloud.size * 3.5, cloud.y + cloud.size/2.8, cloud.size * 1.7, cloud.size * 1.7, PI, TWO_PI);
        }
    function drawTree(tree) 
    {
            fill(80, 0, 0);
            rect(tree.x, tree.y, tree.size * 2, floorPos_y - tree.y);
            fill(30, 120, 103);
            ellipse(tree.size + tree.x, tree.y - 10, tree.size * 7, tree.size * 7);
            ellipse(tree.size + tree.x, tree.y-tree.size * 4, tree.size * 5, tree.size * 5);
            ellipse(tree.size + tree.x, tree.y-tree.size * 7, tree.size * 3, tree.size * 3);
        }
    function drawCollectable(collectable) 
    {
        //collectable item
        if (!collectable.isFound) {
            stroke(24, 66, 63);
            strokeWeight(4);
            line(collectable.x, collectable.y, collectable.size + collectable.x, collectable.y - collectable.size * 2);
            line(collectable.size + collectable.x, collectable.y - collectable.size * 2, collectable.x + collectable.size * 2, collectable.y);
            stroke(190, 0, 0);
            strokeWeight(4);
            fill(230, 0, 50);
            ellipse(collectable.x, collectable.y, collectable.size,collectable.size);
            ellipse(collectable.x + collectable.size * 2, collectable.y, collectable.size, collectable.size);
            noStroke();
        }  
        if (dist(char.x, char.y, collectable.x + 10, collectable.y) < collectable.size * 3) {
            game_score.count++;
            collectable.isFound = true;
            popSound.play();
        }
        return collectable.isFound; 
    }
    function drawEnemy(enemy) {
            fill(0);
            ellipse(enemy.x, enemy.y, 50, 50);
            fill(255, 0, 0)
            arc(enemy.x - 10, enemy.y - 5, 15, 15, QUARTER_PI, PI + QUARTER_PI);
            arc(enemy.x + 10, enemy.y - 5, 15, 15, -QUARTER_PI, PI - QUARTER_PI);    
    }


    function drawMountain(mountain) 
    {
            fill(150, 150, 160);
            triangle(mountain.x, floorPos_y, mountain.x + mountain.size / 1.5, floorPos_y - mountain.size / 1.5, mountain.x + mountain.size, floorPos_y); 
            fill(110, 110, 110);  
            triangle(mountain.x, floorPos_y, mountain.x + mountain.size / 1.5, floorPos_y - mountain.size / 1.5, mountain.x + mountain.size*2.5/3, floorPos_y);

    }
    function drawGrave() 
    {
        noStroke();
        fill(173, 148, 92);
        arc(grave.x, floorPos_y - 70, 70, 50, PI, TWO_PI);
        rect(grave.x - 35, floorPos_y - 70, 70, 70);
        fill(69, 55, 37);
        arc(grave.x, floorPos_y, 100, 40, PI, TWO_PI);
        fill(135, 116, 73);
        textSize(50);
        text("†", grave.x, floorPos_y - 40);
    }
    function drawMoon()
    {
        fill(240, 223, 175);
        ellipse(moon.x, moon.y, moon.size);
        fill(214, 199, 154);
        ellipse(moon.x - moon.size / 6, moon.y - moon.size / 5, moon.size / 3);
        ellipse(moon.x + moon.size / 5, moon.y - moon.size / 9, moon.size / 4);
        ellipse(moon.x + moon.size / 10, moon.y - moon.size / 3, moon.size / 7);
        ellipse(moon.x - moon.size / 3, moon.y + moon.size / 22, moon.size / 7);
    }

    function checkGrave() 
    {
        if (char.x == grave.x) {
            grave.isReached = true;
        }
    }
    function checkEnemy()
    {
        for (var i in enemy) {
            if (dist(char.x,char.y, enemy[i].x, floorPos_y) < 40) {
                enemy.isReached = true;
            }
        }
    }

    function checkDie() {
        if (char.y > height + 300) {
            isDead = true;
            lives--;
        }
    }
    function drawIsLeft() {
        fill(168, 64, 255);
        arc(char.x, char.y-45, 30, 30, PI, TWO_PI);
        quad(char.x-15, char.y-46, char.x-15, char.y-26, char.x+20, char.y-26, char.x+15, char.y-46);
        beginShape();
        vertex(char.x-15, char.y-27);
        vertex(char.x-15, char.y-15);
        vertex(char.x-5, char.y-27);
        vertex(char.x+5, char.y-15);
        vertex(char.x+10, char.y-27);
        vertex(char.x+25, char.y-15);
        vertex(char.x+20, char.y-27);
        endShape();
        //eyes
        fill(0);
        ellipse(char.x-5, char.y-40, 5, 7);
        //hat
        rect(char.x-15, char.y-60, 30, 5, 20);
        quad(char.x-10, char.y-60, char.x-7, char.y-70, char.x+7, char.y-70, char.x+10, char.y-60, 20);
    }
    function drawIsRight() {
        fill(168, 64, 255);
        arc(char.x, char.y-45, 30, 30, PI, TWO_PI);
        quad(char.x-15, char.y-46, char.x-20, char.y-26, char.x+15, char.y-26, char.x+15, char.y-46);
        beginShape();
        vertex(char.x-20, char.y-27);
        vertex(char.x-25, char.y-15);
        vertex(char.x-10, char.y-27);
        vertex(char.x-5, char.y-15);
        vertex(char.x+5, char.y-27);
        vertex(char.x+15, char.y-15);
        vertex(char.x+15, char.y-27);
        endShape();
        //eyes
        fill(0);
        ellipse(char.x+5, char.y-40, 5, 7);
        //hat
        rect(char.x-15, char.y-60, 30, 5, 20);
        quad(char.x-10, char.y-60, char.x-7, char.y-70, char.x+7, char.y-70, char.x+10, char.y-60, 20);
    }
    function drawIsFalling() {
        fill(168, 64, 255);
        arc(char.x, char.y-45, 30, 30, PI, TWO_PI);
        quad(char.x-15, char.y-46, char.x-20, char.y-26, char.x+20, char.y-26, char.x+15, char.y-46);
        beginShape();
        vertex(char.x-20, char.y-27);
        vertex(char.x-25, char.y-15);
        vertex(char.x-10, char.y-27);
        vertex(char.x, char.y-15);
        vertex(char.x+10, char.y-27);
        vertex(char.x+25, char.y-15);
        vertex(char.x+20, char.y-27);
        endShape();
        //eyes
        fill(0);
        arc(char.x-5, char.y-40, 7, 10, PI, TWO_PI);
        arc(char.x+5, char.y-40, 7, 10, PI, TWO_PI);
        //hat
        rect(char.x-15, char.y-60, 30, 5, 20);
        quad(char.x-10, char.y-60, char.x-7, char.y-70, char.x+7, char.y-70, char.x+10, char.y-60, 20);
    }
    function drawIsJumpingRight() {
        fill(168, 64, 255);
        arc(char.x, char.y-45, 30, 30, PI, TWO_PI);
        quad(char.x-15, char.y-46, char.x-20, char.y-26, char.x+20, char.y-26, char.x+15, char.y-46);
        beginShape();
        vertex(char.x-20, char.y-27);
        vertex(char.x-25, char.y-15);
        vertex(char.x-10, char.y-27);
        vertex(char.x, char.y-15);
        vertex(char.x+10, char.y-27);
        vertex(char.x+25, char.y-15);
        vertex(char.x+20, char.y-27);
        endShape();
        //eyes
        fill(0);
        arc(char.x+5, char.y-40, 7, 10, PI, TWO_PI);
        //hat
        rect(char.x-15, char.y-60, 30, 5, 20);
        quad(char.x-10, char.y-60, char.x-7, char.y-70, char.x+7, char.y-70, char.x+10, char.y-60, 20);
    }
    function drawIsJumpingLeft() {
        fill(168, 64, 255);
        arc(char.x, char.y-45, 30, 30, PI, TWO_PI);
        quad(char.x-15, char.y-46, char.x-20, char.y-26, char.x+20, char.y-26, char.x+15, char.y-46);
        beginShape();
        vertex(char.x-20, char.y-27);
        vertex(char.x-25, char.y-15);
        vertex(char.x-10, char.y-27);
        vertex(char.x, char.y-15);
        vertex(char.x+10, char.y-27);
        vertex(char.x+25, char.y-15);
        vertex(char.x+20, char.y-27);
        endShape();
        //eyes
        fill(0);
        arc(char.x-5, char.y-40, 7, 10, PI, TWO_PI);
        //hat
        rect(char.x-15, char.y-60, 30, 5, 20);
        quad(char.x-10, char.y-60, char.x-7, char.y-70, char.x+7, char.y-70, char.x+10, char.y-60, 20);
    }
    function isStanding() {
        fill(168, 64, 255);
        arc(char.x, char.y-45, 30, 30, PI, TWO_PI);
        rect(char.x-15, char.y-46, 30, 25);
        beginShape();
        vertex(char.x-15, char.y-21);
        vertex(char.x-15, char.y-10);
        vertex(char.x-5, char.y-21);
        vertex(char.x, char.y-10);
        vertex(char.x+5, char.y-21);
        vertex(char.x+15, char.y-10);
        vertex(char.x+15, char.y-21);
        endShape();
        //eyes
        fill(0);
        ellipse(char.x-5, char.y-40, 5, 7);
        ellipse(char.x+5, char.y-40, 5, 7);
        //hat
        rect(char.x-15, char.y-60, 30, 5, 20);
        quad(char.x-10, char.y-60, char.x-7, char.y-70, char.x+7, char.y-70, char.x+10, char.y-60, 20);
    }



    function jump() {
        if (char.isJumping) {
            currentJumpPos -= 8;
            if (currentJumpPos <= startJump - 100) {
                currentJumpPos = startJump - 100;
                char.isJumping = false;
            }
            char.y = currentJumpPos;
        }
    }

    function createPlatforms(x, y, length) 
    {
        var p = {
            x: x,
            y: y, 
            length: length,
            draw: function() {
                fill(44, 66, 52);
                rect(this.x, this.y, this.length, 10, 10);
            },
            checkPlatform: function(gc_x, gc_y) 
            {
                if (gc_x > this.x - 15 && gc_x < this.x + this.length + 15)   
                {
                    var d = this.y - gc_y;
                    if (d >= 0 && d <= 5) {
                        return true;
                    }
                }
                return false;
            }
        }
        return p;
    }
    function goodEnding() {
        if (char2.x != char.x + 50) {
            char2.x -= 5;
            drawIsRight2();
        }
        else {
            isStanding2();
        }
        
    }
    function drawIsRight2() {
        fill(65, 99, 232);
        arc(char2.x, char2.y-45, 30, 30, PI, TWO_PI);
        quad(char2.x-15, char2.y-46, char2.x-15, char2.y-26, char2.x+20, char2.y-26, char2.x+15, char2.y-46);
        beginShape();
        vertex(char2.x-15, char2.y-27);
        vertex(char2.x-15, char2.y-15);
        vertex(char2.x-5, char2.y-27);
        vertex(char2.x+5, char2.y-15);
        vertex(char2.x+10, char2.y-27);
        vertex(char2.x+25, char2.y-15);
        vertex(char2.x+20, char2.y-27);
        endShape();
        //eyes
        fill(0);
        ellipse(char2.x-5, char2.y-40, 5, 7);
        //hat
        rect(char2.x-15, char2.y-60, 30, 5, 20);
        quad(char2.x-10, char2.y-60, char2.x-7, char2.y-70, char2.x+7, char2.y-70, char2.x+10, char2.y-60, 20);
    }
    function isStanding2() {
        fill(65, 99, 232);
        arc(char2.x, char2.y-45, 30, 30, PI, TWO_PI);
        rect(char2.x-15, char2.y-46, 30, 25);
        beginShape();
        vertex(char2.x-15, char2.y-21);
        vertex(char2.x-15, char2.y-10);
        vertex(char2.x-5, char2.y-21);
        vertex(char2.x, char2.y-10);
        vertex(char2.x+5, char2.y-21);
        vertex(char2.x+15, char2.y-10);
        vertex(char2.x+15, char2.y-21);
        endShape();
        //eyes
        fill(0);
        ellipse(char2.x-5, char2.y-40, 5, 7);
        ellipse(char2.x+5, char2.y-40, 5, 7);
        //hat
        rect(char2.x-15, char2.y-60, 30, 5, 20);
        quad(char2.x-10, char2.y-60, char2.x-10, char2.y-70, char2.x+10, char2.y-70, char2.x+10, char2.y-60, 20);
    }