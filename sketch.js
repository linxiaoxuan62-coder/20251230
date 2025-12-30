let bgImg = null;
let startBgImg = null;
let gameState = 'START';
let startButton = null;
let rulesButton = null;
let isShowingRules = false;
let rulesOpenFrame = 0;
let sheet = null;        // stop spritesheet (995x102, 10 幀)
let walkSheet = null;    // walk spritesheet (1895x113, 20 幀)
let jumpSheet = null;    // jump spritesheet (995x117, 10 幀)
let pushSheet = null;    // push spritesheet (1906x102, 13 幀)
let toolSheet = null;    // tool spritesheet (1375x119, 12 幀)
const COLS = 10;         // stop 幀數
const COLS_WALK = 20;    // walk 幀數
const COLS_JUMP = 10;    // jump 幀數
const COLS_PUSH = 13;    // push 幀數
const COLS_TOOL = 12;    // tool 幀數
let anim = 0;
let animSpeed = 0.18;      // 動畫速度（idle）
let walkAnimSpeed = 0.28;  // 動畫速度（walk）
let jumpAnimSpeed = 0.22;  // 動畫速度（jump）
let pushAnimSpeed = 0.3;   // 動畫速度（push）
let margin = 24;
let isRightDown = false;
let isLeftDown = false;

// 跳躍相關變數
let isJumping = false;
let jumpStartY = 0;
const jumpHeight = 150; // 跳躍最大高度
const jumpArc = [0, 0.4, 0.75, 0.95, 1, 0.9, 0.7, 0.4, 0.15, 0]; // 模擬 10 幀跳躍拋物線的百分比

// 攻擊與工具相關變數
let isPushing = false;
let tools = []; // 改為工具陣列，以支援多個工具同時存在
const toolSpeed = 12; // 將工具速度設為常數

// 第二個角色相關變數
let char2Sheet = null;
const COLS_CHAR2 = 7;
let char2Anim = 0;
let char2AnimSpeed = 0.15;
let char2X = 0;
let smile2Sheet = null;
const COLS_SMILE2 = 3;
let smile2AnimSpeed = 0.2;
let char2Message = "請問你叫什麼名字";
let nameInput = null;
let isChar2Smiling = false;
const proximityThreshold = 250; // 觸發微笑的距離
let fallDown2Sheet = null;
const COLS_FALLDOWN2 = 13;
let isChar2Falling = false;
let char2FallAnim = 0;
let questionTable;
let currentQuestion = null;
let currentQuestionIndex = 0;
let nextQuestionButton = null;
let retryButton = null;

// 第三個角色相關變數
let char3Sheet = null;
const COLS_CHAR3 = 8;
let char3Anim = 0;
let char3AnimSpeed = 0.15;
let char3X = 0;

// 第四個角色相關變數
let char4Sheet = null;
const COLS_CHAR4 = 2;
let char4Anim = 0;
let char4AnimSpeed = 0.1;
let char4X = 0;
let questionTableCopy;
let currentQuestionCopy = null;
let char4Message = "你好！";
let nameInput4 = null;
let isChar4Smiling = false;
let nextQuestionButton4 = null;
let retryButton4 = null;

// 第五個角色相關變數
let char5Sheet = null;
const COLS_CHAR5 = 3;
let char5Anim = 0;
let char5AnimSpeed = 0.1;
let char5X = 0;

let bgScroll = 0; // 背景捲動偏移量
let score = 0;
let questionCount = 1;

let charX = 0;   // 角色中心 x
let facingLeft = false; // 新增：追蹤角色面向，false 為右，true 為左
let charY = 0;   // 角色中心 y
let moveSpeed = 4; // 移動速度（像素/幀）

// 追蹤目前使用的精靈以便切換時重置 anim
let prevActive = null;

function preload() {
  bgImg = loadImage('background/City4.png',
    () => console.log('背景載入成功: background/City4.png'),
    err => console.warn('背景載入失敗', err)
  );

  startBgImg = loadImage('background/City3.png',
    () => console.log('開始背景載入成功: background/City3.png'),
    err => console.warn('開始背景載入失敗', err)
  );

  sheet = loadImage('1/stop/stop.png',
    () => console.log('精靈載入成功: 1/stop/stop.png'),
    err => console.error('精靈載入失敗: 1/stop/stop.png', err)
  );

  walkSheet = loadImage('1/walk/walk.png',
    () => console.log('walk 載入成功: 1/walk/walk.png'),
    err => console.warn('walk 載入失敗: 1/walk/walk.png', err)
  );

  jumpSheet = loadImage('1/jump/jump.png',
    () => console.log('jump 載入成功: 1/jump/jump.png'),
    err => console.warn('jump 載入失敗: 1/jump/jump.png', err)
  );

  pushSheet = loadImage('1/push/push.png',
    () => console.log('push 載入成功: 1/push/push.png'),
    err => console.warn('push 載入失敗: 1/push/push.png', err)
  );

  toolSheet = loadImage('1/tool/tool.png',
    () => console.log('tool 載入成功: 1/tool/tool.png'),
    err => console.warn('tool 載入失敗: 1/tool/tool.png', err)
  );

  char2Sheet = loadImage('2/stop/stop_2.png',
    () => console.log('Char2 載入成功: 2/stop/stop_2.png'),
    err => console.warn('Char2 載入失敗: 2/stop/stop_2.png', err)
  );

  smile2Sheet = loadImage('2/smile/smile_2.png',
    () => console.log('Smile2 載入成功: 2/smile/smile_2.png'),
    err => console.warn('Smile2 載入失敗: 2/smile/smile_2.png', err)
  );

  fallDown2Sheet = loadImage('2/fall_down/fall_down_2.png',
    () => console.log('FallDown2 載入成功: 2/fall_down/fall_down_2.png'),
    err => console.warn('FallDown2 載入失敗: 2/fall_down/fall_down_2.png', err)
  );

  char3Sheet = loadImage('3/hint/hint_3.png',
    () => console.log('Char3 載入成功: 3/hint/hint_3.png'),
    err => console.warn('Char3 載入失敗: 3/hint/hint_3.png', err)
  );

  char4Sheet = loadImage('4/hint/hint_4.png',
    () => console.log('Char4 載入成功: 4/hint/hint_4.png'),
    err => console.warn('Char4 載入失敗: 4/hint/hint_4.png', err)
  );

  char5Sheet = loadImage('5/hint/hint_5.png',
    () => console.log('Char5 載入成功: 5/hint/hint_5.png'),
    err => console.warn('Char5 載入失敗: 5/hint/hint_5.png', err)
  );

  questionTable = loadTable('questions.csv', 'csv', 'header');
  questionTableCopy = loadTable('questions copy.csv', 'csv', 'header');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  pixelDensity(1);
  noSmooth();

  // 初始位置：畫布右下
  charX = width - 250;      // 離右邊緣 250px
  charY = height - 80;

  // 第二個角色的初始位置
  char2X = width - 950;

  // 第三個角色的初始位置 (在角色1與角色2中間)
  char3X = width - 600;

  // 第四個角色的初始位置 (移到左邊背景區域)
  char4X = -width * 0.3;

  // 第五個角色的初始位置 (移到左邊背景區域)
  char5X = -width * 0.45;

  if (questionTable.getRowCount() > 0) {
    getNewQuestion();
  }
  if (questionTableCopy.getRowCount() > 0) {
    getNewQuestionCopy();
  }

  startButton = createButton('開始遊戲');
  startButton.position(width / 2 - 60, height / 2 + 60);
  startButton.size(120, 50);
  startButton.style('font-size', '20px');
  startButton.mousePressed(() => {
    gameState = 'PLAYING';
    startButton.hide();
    if (rulesButton) rulesButton.hide();
  });

  rulesButton = createButton('遊戲規則');
  rulesButton.position(width / 2 - 60, height / 2 + 120);
  rulesButton.size(120, 50);
  rulesButton.style('font-size', '20px');
  rulesButton.mousePressed(() => {
    isShowingRules = true;
    rulesOpenFrame = frameCount; // 記錄開啟時的幀數，避免誤觸關閉
    startButton.hide();
    rulesButton.hide();
  });
}

function getNewQuestion() {
  if (questionTable.getRowCount() > 0) {
    currentQuestionIndex = floor(random(questionTable.getRowCount()));
    currentQuestion = questionTable.getRow(currentQuestionIndex);
    char2Message = currentQuestion.getString('question');
  }
}

function isLoaded(img) {
  return img && img.width && img.width > 0;
}

function draw() {
  if (gameState === 'START') {
    if (isLoaded(startBgImg)) {
      push();
      // 使用 tint() 調整開始畫面的亮度和透明度
      // 將亮度設為 180 (稍暗)，透明度設為 220 (稍微透明)
      tint(180, 220);
      image(startBgImg, 0, 0, width, height);
      pop(); // 重置 tint 效果，以免影響到後面的文字
    } else {
      background(200);
    }
    push();
    textAlign(CENTER, CENTER);
    textSize(50);
    fill(255, 255, 0);
    stroke(0);
    strokeWeight(5);
    text("亞洲美食知多少", width / 2, height / 2);
    pop();

    if (isShowingRules) {
      push();
      fill(0, 0, 0, 220); // 半透明黑色背景
      rect(0, 0, width, height);
      fill(255);
      textAlign(CENTER, CENTER);
      textSize(24);
      textLeading(40); // 設定行距
      text("【遊戲規則】\n1. 使用左右鍵移動角色\n2. 按上鍵跳躍，下鍵攻擊\n3. 靠近 NPC 回答問題\n4. 答對可進入下一題\n\n(點擊畫面任一處關閉)", width / 2, height / 2);
      pop();
    }
    return;
  }

  // 更新按鍵狀態（支援持續按住）
  isLeftDown = keyIsDown(LEFT_ARROW);
  isRightDown = keyIsDown(RIGHT_ARROW);

  // 背景
  if (isLoaded(bgImg)) {
    const screenAspect = width / height;
    const bgAspect = bgImg.width / bgImg.height;
    let bgW, bgH, bgX, bgY;

    if (screenAspect > bgAspect) {
      // 螢幕比較寬，以螢幕寬度為基準
      bgW = width;
      bgH = width / bgAspect;
      bgX = 0;
      bgY = (height - bgH) / 2; // 垂直置中
    } else {
      // 螢幕比較高或長寬比相同，以螢幕高度為基準
      bgH = height;
      bgW = height * bgAspect;
      bgY = 0;
      bgX = (width - bgW) / 2; // 水平置中
    }

    // 繪製三張背景圖串接 (左、中、右)
    image(bgImg, bgX + bgScroll, bgY, bgW, bgH);           // 中間
    image(bgImg, bgX + bgScroll - bgW, bgY, bgW, bgH);     // 左邊
    image(bgImg, bgX + bgScroll + bgW, bgY, bgW, bgH);     // 右邊
  } else {
    background(40);
  }

  // 選擇使用哪個 spritesheet：按左右鍵時用 walk，否則用 stop
  let active = null;
  let cols = COLS;
  let currentAnimSpeed = 0.18; // 預設 idle 速度
  let isUpPressed = keyIsDown(UP_ARROW);
  const isDownPressed = keyIsDown(DOWN_ARROW); // 下鍵發射武器

  // 狀態機：優先處理推擠，接著跳躍
  if (isPushing) {
    active = pushSheet;
    cols = COLS_PUSH;
    currentAnimSpeed = pushAnimSpeed;

    // 當推擠動畫播放完畢 (13張)
    if (floor(anim) >= COLS_PUSH - 1) {
      isPushing = false;
      // 產生一個新的工具並加入陣列
      const newTool = {
        x: charX + (facingLeft ? -50 : 50), // 從角色前方一點生成
        y: charY,
        facingLeft: facingLeft,
        anim: 0,
      };
      tools.push(newTool);
    }
  } else if (isJumping) {
    active = jumpSheet;
    cols = COLS_JUMP;
    currentAnimSpeed = jumpAnimSpeed;

    // 允許空中移動與轉向
    if (isLeftDown) {
      facingLeft = true;
      charX -= moveSpeed;
    } else if (isRightDown) {
      facingLeft = false;
      charX += moveSpeed;
    }

    // 當跳躍動畫播放完畢
    if (floor(anim) >= COLS_JUMP - 1) {
      isJumping = false;
      charY = jumpStartY; // 確保回到原位
    }
  } else {
    // 非跳躍/推擠狀態下
    if (isDownPressed && isLoaded(pushSheet)) {
      isPushing = true;
      anim = 0;
      active = pushSheet;
      cols = COLS_PUSH;
      currentAnimSpeed = pushAnimSpeed;
    } else if (isUpPressed && isLoaded(jumpSheet)) {
      isJumping = true;
      anim = 0; // 從頭播放跳躍動畫
      jumpStartY = charY; // 記錄起跳位置
      // 切換到跳躍狀態，下一幀再處理動畫
      active = jumpSheet;
      cols = COLS_JUMP;
    } else if (isLeftDown && isLoaded(walkSheet)) {
      active = walkSheet;
      cols = COLS_WALK;
      currentAnimSpeed = walkAnimSpeed;
      facingLeft = true;
      bgScroll += moveSpeed; // 背景往右移 (角色看起來往左)
    } else if (isRightDown && isLoaded(walkSheet)) {
      active = walkSheet;
      cols = COLS_WALK;
      currentAnimSpeed = walkAnimSpeed;
      facingLeft = false;
      bgScroll -= moveSpeed; // 背景往左移 (角色看起來往右)
    } else if (isLoaded(sheet)) {
      active = sheet;
      cols = COLS;
    }
  }

  // 若切換精靈，重置動畫索引以避免跳幀
  if (active !== prevActive) {
    anim = 0;
    prevActive = active;
  }

  if (!isLoaded(active)) {
    // 未載入精靈時顯示提示
    fill(255,200,0);
    rectMode(CENTER);
    rect(width/2, height/2, 420, 120);
    fill(0);
    textAlign(CENTER, CENTER);
    textSize(14);
    text('精靈未載入：檢查 1/stop/stop.png 與 1/walk/walk.png\n並查看 Console', width/2, height/2);
    return;
  }

  // 計算來源與顯示尺寸
  const sw = active.width / cols;
  const sh = active.height;
  anim = (anim + currentAnimSpeed) % cols;
  const idx = floor(anim);
  const sx = floor(idx * sw);

  const baseScale = min(width, height) / 900;
  const charScale = 1.8 * baseScale;
  const dw = sw * charScale;
  const dh = sh * charScale;

  // 限制角色 x 範圍（避免移出畫面）
  const leftLimit = dw/2 + margin;
  const rightLimit = width - dw/2 - margin;
  charX = constrain(charX, leftLimit, rightLimit);

  if (isJumping) {
    // 根據跳躍曲線更新 Y 座標
    charY = jumpStartY - (jumpArc[idx] * jumpHeight);
  } else {
    charY = height - dh/2 - margin;
  }

  push();
  translate(charX, charY);
  if (facingLeft) {
    // 水平翻轉讓角色朝左（假設 spritesheet 面向右）
    scale(-1, 1);
  }
  // 從 spritesheet 取子圖並繪製 (以 0,0 為中心)
  image(active, -dw / 2, -dh / 2, dw, dh, sx, 0, floor(sw), sh);
  pop();

  // 繪製第二個角色
  drawCharacter2(baseScale);

  // 繪製第三個角色
  drawCharacter3(baseScale);

  // 繪製第四個角色
  drawCharacter4(baseScale);

  // 繪製第五個角色
  drawCharacter5(baseScale);

  // 繪製並更新工具
  updateAndDrawTools(baseScale);

  // 繪製分數框
  push();
  fill(255, 255, 255, 200); // 半透明白底
  stroke(0);
  strokeWeight(2);
  rect(20, 20, 120, 50, 10); // 左上角位置與大小
  fill(0);
  noStroke();
  textSize(24);
  textAlign(LEFT, CENTER);
  text("分數: " + score, 35, 45);
  pop();

  // 繪製題數框
  push();
  fill(255, 255, 255, 200); // 半透明白底
  stroke(0);
  strokeWeight(2);
  rectMode(CENTER);
  rect(width / 2, 45, 160, 50, 10); // 螢幕中間上方
  fill(0);
  noStroke();
  textSize(24);
  textAlign(CENTER, CENTER);
  text("第 " + questionCount + " 題", width / 2, 45);
  pop();

  // 當按下左鍵時顯示提示框
  if (isLeftDown) {
    push();
    fill(255, 255, 255, 200); // 半透明白底
    stroke(0);
    strokeWeight(2);
    rectMode(CENTER);
    rect(width / 2, 105, 300, 60, 10); // 顯示在第幾題下面
    fill(0);
    noStroke();
    textSize(24);
    textAlign(CENTER, CENTER);
    text("請繼續往左走!!", width / 2, 105);
    pop();
  }
}

function drawCharacter2(baseScale) {
  if (!isLoaded(char2Sheet) || !isLoaded(smile2Sheet) || !isLoaded(fallDown2Sheet)) return;

  const charScale = 1.8 * baseScale;
  const screenChar2X = char2X + bgScroll; // 計算角色2在螢幕上的實際位置
  const distance = abs(charX - screenChar2X);
  const isClose = distance < proximityThreshold;

  // 恢復機制：如果正在跌倒且主角靠近，則恢復原狀
  if (isChar2Falling && isClose) {
    isChar2Falling = false;
    // 恢復後，下一幀會自動進入下方的互動邏輯(微笑)
  }

  // 互動狀態邏輯 (只有在沒有跌倒時才進行)
  if (isClose && !isChar2Falling) {
    if (!isChar2Smiling) {
      isChar2Smiling = true;
      char2Anim = 0;
    }

    // 如果還在詢問名字，顯示輸入框
    const isAskingQuestion = currentQuestion && char2Message === currentQuestion.getString('question');
    if (isAskingQuestion) {
      if (!nameInput) {
        nameInput = createInput('');
        nameInput.size(150);
        nameInput.style('font-size', '16px');
        nameInput.changed(submitName); // 按下 Enter 觸發
      }
      // 讓輸入框跟隨角色1 (位置在頭頂上方)
      nameInput.position(charX - 85, charY - 100 * charScale);
    } else {
      // 如果已經回答過，移除輸入框
      if (nameInput) {
        nameInput.remove();
        nameInput = null;
      }
    }
  } else {
    isChar2Smiling = false;
    // 離開時移除輸入框
    if (nameInput) {
      nameInput.remove();
      nameInput = null;
    }
    if (nextQuestionButton) {
      nextQuestionButton.remove();
      nextQuestionButton = null;
    }
    if (retryButton) {
      retryButton.remove();
      retryButton = null;
    }
  }

  let activeSheet, cols, idx;

  // 角色2的狀態機
  if (isChar2Falling) {
    activeSheet = fallDown2Sheet;
    cols = COLS_FALLDOWN2;
    // 播放跌倒動畫，並停在最後一幀
    if (char2FallAnim < cols - 1) {
      char2FallAnim += 0.25;
    }
    idx = floor(char2FallAnim);
  } else if (isChar2Smiling) {
    activeSheet = smile2Sheet;
    cols = COLS_SMILE2;
    // 保持微笑動畫在最後一幀，不重置
    if (char2Anim < cols - 1) {
      char2Anim += smile2AnimSpeed;
    }
    idx = floor(char2Anim);
  } else { // 待機狀態
    activeSheet = char2Sheet;
    cols = COLS_CHAR2;
    char2Anim = (char2Anim + char2AnimSpeed) % cols; // 循環播放待機動畫
    idx = floor(char2Anim);
  }

  // 計算來源與顯示尺寸
  const sw = activeSheet.width / cols;
  const sh = activeSheet.height;
  const sx = floor(idx * sw);

  const dw = sw * charScale;
  const dh = sh * charScale;

  const char2Y = height - dh/2 - margin;

  push();
  translate(screenChar2X, char2Y);
  if (charX < screenChar2X) {
    scale(-1, 1);
  }
  image(activeSheet, -dw / 2, -dh / 2, dw, dh, sx, 0, floor(sw), sh);

  // 如果正在微笑，顯示對話框
  if (isChar2Smiling) {
    // 因為角色圖片可能被翻轉，我們需要將文字翻轉回來以保持正向
    if (charX < screenChar2X) {
      scale(-1, 1);
    }

    const textContent = char2Message;
    const padding = 12 * baseScale;
    const boxHeight = 30 * baseScale;
    const textYOffset = -dh / 2 - boxHeight / 2 - 15 * baseScale; // 放在頭頂上方

    // 設定文字屬性以測量寬度
    textSize(16 * baseScale);
    const textW = textWidth(textContent);

    // 繪製方框
    fill(255, 255, 255, 230); // 半透明白色
    stroke(50);
    rectMode(CENTER);
    rect(0, textYOffset, textW + padding, boxHeight);

    // 繪製文字
    fill(0);
    noStroke();
    textAlign(CENTER, CENTER);
    text(textContent, 0, textYOffset);
  }

  pop();

  // 按鈕定位 (在 translate 外面，使用絕對座標)
  const buttonY = char2Y - dh / 2 - 110 * baseScale;
  if (nextQuestionButton) {
    nextQuestionButton.position(screenChar2X - nextQuestionButton.width / 2, buttonY);
  }
  if (retryButton) {
    retryButton.position(screenChar2X - retryButton.width / 2, buttonY);
  }
}

function drawCharacter3(baseScale) {
  if (!isLoaded(char3Sheet)) return;

  const charScale = 1.8 * baseScale;

  // 更新動畫
  char3Anim = (char3Anim + char3AnimSpeed) % COLS_CHAR3;
  const idx = floor(char3Anim);

  // 計算來源與顯示尺寸
  const sw = char3Sheet.width / COLS_CHAR3;
  const sh = char3Sheet.height;
  const sx = floor(idx * sw);

  const dw = sw * charScale;
  const dh = sh * charScale;

  const char3Y = height - dh/2 - margin;

  push();
  const screenChar3X = char3X + bgScroll;
  translate(screenChar3X, char3Y);
  
  // 讓角色面向玩家
  if (charX < screenChar3X) {
    scale(-1, 1);
  }
  
  image(char3Sheet, -dw / 2, -dh / 2, dw, dh, sx, 0, floor(sw), sh);

  // 互動：當玩家靠近時顯示地區提示
  const distanceToChar2 = abs(charX - (char2X + bgScroll));
  if (distanceToChar2 < proximityThreshold && currentQuestion) {
    // 如果角色翻轉了，文字要翻轉回來以保持正向
    if (charX < screenChar3X) {
      scale(-1, 1);
    }

    const region = currentQuestion.getString('region');
    const textContent = "地區：" + (region ? region : "台灣");
    const padding = 16 * baseScale;
    const boxHeight = 36 * baseScale;
    const textYOffset = -dh / 2 - boxHeight / 2 - 15 * baseScale;

    textSize(16 * baseScale);
    const textW = textWidth(textContent);
    const boxW = textW + padding;

    // 繪製氣泡框 (圓角矩形 + 尾巴)
    fill(255, 255, 255, 240);
    stroke(0);
    strokeWeight(2);
    rectMode(CENTER);
    rect(0, textYOffset, boxW, boxHeight, 10);

    // 簡單的尾巴
    noStroke();
    triangle(
      -6 * baseScale, textYOffset + boxHeight / 2 - 2,
      6 * baseScale, textYOffset + boxHeight / 2 - 2,
      0, textYOffset + boxHeight / 2 + 10 * baseScale
    );
    // 補上尾巴邊框 (V字型)
    stroke(0);
    line(-6 * baseScale, textYOffset + boxHeight / 2, 0, textYOffset + boxHeight / 2 + 10 * baseScale);
    line(6 * baseScale, textYOffset + boxHeight / 2, 0, textYOffset + boxHeight / 2 + 10 * baseScale);

    fill(0);
    noStroke();
    textAlign(CENTER, CENTER);
    text(textContent, 0, textYOffset);
  }

  pop();
}

function drawCharacter4(baseScale) {
  if (!isLoaded(char4Sheet)) return;

  const charScale = 1.8 * baseScale;
  const screenChar4X = char4X + bgScroll;

  // 互動邏輯
  const distance = abs(charX - screenChar4X);
  const isClose = distance < proximityThreshold;

  if (isClose) {
    isChar4Smiling = true;

    const isAskingQuestion = currentQuestionCopy && char4Message === currentQuestionCopy.getString('question');
    if (isAskingQuestion) {
      if (!nameInput4) {
        nameInput4 = createInput('');
        nameInput4.size(150);
        nameInput4.style('font-size', '16px');
        nameInput4.changed(submitName4);
      }
      nameInput4.position(charX - 85, charY - 100 * charScale);
    } else {
      if (nameInput4) {
        nameInput4.remove();
        nameInput4 = null;
      }
    }
  } else {
    isChar4Smiling = false;
    if (nameInput4) {
      nameInput4.remove();
      nameInput4 = null;
    }
    if (nextQuestionButton4) {
      nextQuestionButton4.remove();
      nextQuestionButton4 = null;
    }
    if (retryButton4) {
      retryButton4.remove();
      retryButton4 = null;
    }
  }

  // 更新動畫
  char4Anim = (char4Anim + char4AnimSpeed) % COLS_CHAR4;
  const idx = floor(char4Anim);

  // 計算來源與顯示尺寸
  const sw = char4Sheet.width / COLS_CHAR4;
  const sh = char4Sheet.height;
  const sx = floor(idx * sw);

  const dw = sw * charScale;
  const dh = sh * charScale;

  const char4Y = height - dh/2 - margin;

  push();
  translate(screenChar4X, char4Y);
  
  // 面向玩家
  if (charX < screenChar4X) {
    scale(-1, 1);
  }
  
  image(char4Sheet, -dw / 2, -dh / 2, dw, dh, sx, 0, floor(sw), sh);

  // 顯示對話框
  if (isChar4Smiling) {
    if (charX < screenChar4X) {
      scale(-1, 1);
    }

    const textContent = char4Message;
    const padding = 12 * baseScale;
    const boxHeight = 30 * baseScale;
    const textYOffset = -dh / 2 - boxHeight / 2 - 15 * baseScale;

    textSize(16 * baseScale);
    const textW = textWidth(textContent);

    fill(255, 255, 255, 230);
    stroke(50);
    rectMode(CENTER);
    rect(0, textYOffset, textW + padding, boxHeight);

    fill(0);
    noStroke();
    textAlign(CENTER, CENTER);
    text(textContent, 0, textYOffset);
  }
  pop();

  // 按鈕定位
  const buttonY = char4Y - dh / 2 - 110 * baseScale;
  if (nextQuestionButton4) {
    nextQuestionButton4.position(screenChar4X - nextQuestionButton4.width / 2, buttonY);
  }
  if (retryButton4) {
    retryButton4.position(screenChar4X - retryButton4.width / 2, buttonY);
  }
}

function drawCharacter5(baseScale) {
  if (!isLoaded(char5Sheet)) return;

  const charScale = 1.8 * baseScale;

  // 更新動畫
  char5Anim = (char5Anim + char5AnimSpeed) % COLS_CHAR5;
  const idx = floor(char5Anim);

  // 計算來源與顯示尺寸
  const sw = char5Sheet.width / COLS_CHAR5;
  const sh = char5Sheet.height;
  const sx = floor(idx * sw);

  const dw = sw * charScale;
  const dh = sh * charScale;

  const char5Y = height - dh/2 - margin;

  push();
  const screenChar5X = char5X + bgScroll;
  translate(screenChar5X, char5Y);

  // 讓角色面向玩家
  if (charX < screenChar5X) {
    scale(-1, 1);
  }

  image(char5Sheet, -dw / 2, -dh / 2, dw, dh, sx, 0, floor(sw), sh);

  // 互動：當玩家靠近角色4時顯示地區提示
  const distanceToChar4 = abs(charX - (char4X + bgScroll));
  if (distanceToChar4 < proximityThreshold && currentQuestionCopy) {
    // 如果角色翻轉了，文字要翻轉回來以保持正向
    if (charX < screenChar5X) {
      scale(-1, 1);
    }

    const region = currentQuestionCopy.getString('region');
    const textContent = "地區：" + (region ? region : "亞洲");
    const padding = 16 * baseScale;
    const boxHeight = 36 * baseScale;
    const textYOffset = -dh / 2 - boxHeight / 2 - 15 * baseScale;

    textSize(16 * baseScale);
    const textW = textWidth(textContent);
    const boxW = textW + padding;

    // 繪製氣泡框 (圓角矩形 + 尾巴)
    fill(255, 255, 255, 240);
    stroke(0);
    strokeWeight(2);
    rectMode(CENTER);
    rect(0, textYOffset, boxW, boxHeight, 10);

    // 簡單的尾巴
    noStroke();
    triangle(
      -6 * baseScale, textYOffset + boxHeight / 2 - 2,
      6 * baseScale, textYOffset + boxHeight / 2 - 2,
      0, textYOffset + boxHeight / 2 + 10 * baseScale
    );
    // 補上尾巴邊框 (V字型)
    stroke(0);
    line(-6 * baseScale, textYOffset + boxHeight / 2, 0, textYOffset + boxHeight / 2 + 10 * baseScale);
    line(6 * baseScale, textYOffset + boxHeight / 2, 0, textYOffset + boxHeight / 2 + 10 * baseScale);

    fill(0);
    noStroke();
    textAlign(CENTER, CENTER);
    text(textContent, 0, textYOffset);
  }

  pop();
}

function updateAndDrawTools(baseScale) {
  if (!isLoaded(toolSheet)) return;

  // 從後往前遍歷陣列，這樣在迴圈中刪除元素才安全
  for (let i = tools.length - 1; i >= 0; i--) {
    const tool = tools[i];

    // 更新動畫
    tool.anim += 0.35; // 工具動畫速度

    // 顯示完 12 張圖片或移出畫面後，從陣列中移除
    if (floor(tool.anim) >= COLS_TOOL || tool.x < -50 || tool.x > width + 50) {
      tools.splice(i, 1); // 從陣列中刪除
      continue; // 繼續下一個迴圈，不執行後續的繪製程式碼
    }

    // 更新位置
    if (tool.facingLeft) {
      tool.x -= toolSpeed;
    } else {
      tool.x += toolSpeed;
    }

    // 碰撞偵測：檢查工具是否擊中角色2
    if (!isChar2Falling && abs(tool.x - (char2X + bgScroll)) < 60) {
      isChar2Falling = true;
      char2FallAnim = 0;
      tools.splice(i, 1); // 移除擊中的工具
      continue; // 繼續下一個迴圈
    }

    // 繪製工具
    const sw = toolSheet.width / COLS_TOOL;
    const sh = toolSheet.height;
    const charScale = 1.8 * baseScale; // 使用與角色相同的縮放比例
    const dw = sw * charScale;
    const dh = sh * charScale;
    const sx = floor(tool.anim) * floor(sw);

    push();
    translate(tool.x, tool.y);
    if (tool.facingLeft) scale(-1, 1);
    image(toolSheet, -dw/2, -dh/2, dw, dh, sx, 0, floor(sw), sh);
    pop();
  }
}

function submitName() {
  const userAnswer = this.value().trim();
  if (!userAnswer || !currentQuestion) return;

  const correctAnswer = currentQuestion.getString('answer');

  // 移除輸入框
  this.remove();
  nameInput = null;

  if (userAnswer === correctAnswer) {
    // 答對了
    score++;
    char2Message = currentQuestion.getString('correct_feedback');
    nextQuestionButton = createButton('下一題');
    nextQuestionButton.mousePressed(goToNextQuestion);
  } else {
    // 答錯了
    score--;
    char2Message = currentQuestion.getString('incorrect_feedback');
    retryButton = createButton('再作答一次');
    retryButton.mousePressed(retryCurrentQuestion);
  }
}

function goToNextQuestion() {
  questionCount++;
  getNewQuestion();
  if (nextQuestionButton) {
    nextQuestionButton.remove();
    nextQuestionButton = null;
  }
}

function retryCurrentQuestion() {
  char2Message = currentQuestion.getString('question');
  if (retryButton) {
    retryButton.remove();
    retryButton = null;
  }
}

function getNewQuestionCopy() {
  if (questionTableCopy.getRowCount() > 0) {
    const index = floor(random(questionTableCopy.getRowCount()));
    currentQuestionCopy = questionTableCopy.getRow(index);
    char4Message = currentQuestionCopy.getString('question');
  }
}

function submitName4() {
  const userAnswer = this.value().trim();
  if (!userAnswer || !currentQuestionCopy) return;

  const correctAnswer = currentQuestionCopy.getString('answer');

  this.remove();
  nameInput4 = null;

  if (userAnswer === correctAnswer) {
    score++;
    char4Message = currentQuestionCopy.getString('correct_feedback');
    nextQuestionButton4 = createButton('下一題');
    nextQuestionButton4.mousePressed(goToNextQuestion4);
  } else {
    score--;
    char4Message = currentQuestionCopy.getString('incorrect_feedback');
    retryButton4 = createButton('再作答一次');
    retryButton4.mousePressed(retryCurrentQuestion4);
  }
}

function goToNextQuestion4() {
  questionCount++;
  getNewQuestionCopy();
  if (nextQuestionButton4) {
    nextQuestionButton4.remove();
    nextQuestionButton4 = null;
  }
}

function retryCurrentQuestion4() {
  char4Message = currentQuestionCopy.getString('question');
  if (retryButton4) {
    retryButton4.remove();
    retryButton4 = null;
  }
}

function keyPressed() {
  // 保留以處理可能的其他按鍵事件
}

function keyReleased() {
  // 保留以處理可能的其他按鍵事件
}

function mousePressed() {
  // 如果在顯示規則，且點擊畫面（稍微延遲幾幀以防按鈕點擊事件穿透），則關閉規則
  if (gameState === 'START' && isShowingRules && frameCount > rulesOpenFrame + 10) {
    isShowingRules = false;
    if (startButton) startButton.show();
    if (rulesButton) rulesButton.show();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  if (startButton) {
    startButton.position(width / 2 - 60, height / 2 + 60);
  }
  if (rulesButton) {
    rulesButton.position(width / 2 - 60, height / 2 + 120);
  }
  // 調整 charY 以符合新視窗
  charY = height - 80;
  char2X = width - 950; // 同步更新第二個角色的位置
  char3X = width - 600; // 同步更新第三個角色的位置
  char4X = -width * 0.3; // 同步更新第四個角色的位置
  char5X = -width * 0.45; // 同步更新第五個角色的位置
}