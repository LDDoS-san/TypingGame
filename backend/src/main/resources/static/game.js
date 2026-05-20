(() => {
  const canvas = document.getElementById("arena");
  const ctx = canvas.getContext("2d");
  const promptZone = document.querySelector(".prompt-zone");
  const displayPhraseEl = document.getElementById("displayPhrase");
  const phraseEl = document.getElementById("phrase");
  const typingLineEl = document.getElementById("typingLine");
  const feedbackEl = document.getElementById("feedback");
  const playerHpEl = document.getElementById("playerHp");
  const enemyHpEl = document.getElementById("enemyHp");
  const comboTextEl = document.getElementById("comboText");
  const difficultyTextEl = document.getElementById("difficultyText");
  const roundTimeEl = document.getElementById("roundTime");
  const mistakeBubble = document.getElementById("mistakeBubble");
  const keyboardPanel = document.getElementById("keyboardPanel");
  const keyboardEl = document.getElementById("keyboard");
  const mistakeCopyEl = document.getElementById("mistakeCopy");
  const keyHintEl = document.getElementById("keyHint");
  const startOverlay = document.getElementById("startOverlay");
  const resultOverlay = document.getElementById("resultOverlay");
  const startButton = document.getElementById("startButton");
  const restartButton = document.getElementById("restartButton");
  const hintDirectButton = document.getElementById("hintDirect");
  const hintAboveButton = document.getElementById("hintAbove");
  const settingsToggle = document.getElementById("settingsToggle");
  const settingsBody = document.getElementById("settingsBody");
  const profileNameInput = document.getElementById("profileNameInput");
  const createProfileButton = document.getElementById("createProfileButton");
  const loginProfileButton = document.getElementById("loginProfileButton");
  const profileStatus = document.getElementById("profileStatus");
  const levelSelect = document.getElementById("levelSelect");
  const symbolsToggle = document.getElementById("symbolsToggle");
  const volumeSlider = document.getElementById("volumeSlider");
  const volumeValue = document.getElementById("volumeValue");
  const codeFreqSlider = document.getElementById("codeFreqSlider");
  const codeFreqValue = document.getElementById("codeFreqValue");
  const resultTitle = document.getElementById("resultTitle");
  const resultKicker = document.getElementById("resultKicker");
  const resultStats = document.getElementById("resultStats");

  const physicalRows = [
    [["1", "!"], ["2", "\""], ["3", "#"], ["4", "$"], ["5", "%"], ["6", "&"], ["7", "'"], ["8", "("], ["9", ")"], ["0", ""], ["-", "="], ["^", "~"], ["\\", ""]],
    [["q", "Q"], ["w", "W"], ["e", "E"], ["r", "R"], ["t", "T"], ["y", "Y"], ["u", "U"], ["i", "I"], ["o", "O"], ["p", "P"], ["@", "`"], ["[", "{"]],
    [["a", "A"], ["s", "S"], ["d", "D"], ["f", "F"], ["g", "G"], ["h", "H"], ["j", "J"], ["k", "K"], ["l", "L"], [";", "+"], [":", "*"], ["]", "}"]],
    [["z", "Z"], ["x", "X"], ["c", "C"], ["v", "V"], ["b", "B"], ["n", "N"], ["m", "M"], [",", "<"], [".", ">"], ["/", "?"], ["\\", "_"]],
    [[" ", " "]]
  ];
  const letterRows = [
    [["q", "Q"], ["w", "W"], ["e", "E"], ["r", "R"], ["t", "T"], ["y", "Y"], ["u", "U"], ["i", "I"], ["o", "O"], ["p", "P"]],
    [["a", "A"], ["s", "S"], ["d", "D"], ["f", "F"], ["g", "G"], ["h", "H"], ["j", "J"], ["k", "K"], ["l", "L"]],
    [["z", "Z"], ["x", "X"], ["c", "C"], ["v", "V"], ["b", "B"], ["n", "N"], ["m", "M"]],
    [[" ", " "]]
  ];
  const keyPositions = {};

  const moves = [
    ["ジャブ", "jab"], ["クロス", "cross"], ["フック", "hook"], ["アッパー", "uppercut"],
    ["ボディ", "body blow"], ["ワンツー", "one two"], ["ダブルジャブ", "double jab"],
    ["左フック", "left hook"], ["右ストレート", "right straight"], ["カウンター", "counter"],
    ["スリップ", "slip"], ["ダック", "duck"], ["ウィーブ", "weave"], ["パリー", "parry"],
    ["ブロック", "block"], ["クリンチ", "clinch"], ["ステップイン", "step in"],
    ["ステップバック", "step back"], ["ピボット", "pivot"], ["フェイント", "feint"]
  ];

  const commands = [
    ["ガードを上げろ", "guard up"], ["距離を取れ", "keep distance"], ["足を使え", "use footwork"],
    ["ロープから出ろ", "leave the ropes"], ["ガードを割れ", "break the guard"],
    ["ボディから顔へ", "body to head"], ["打ったら戻せ", "punch and return"],
    ["ジャブで測れ", "measure with jab"], ["ラウンドを取れ", "win the round"],
    ["コーナーへ詰めろ", "cut the ring"], ["相手の右を外せ", "slip the right"],
    ["左で止めて右を打て", "jab then cross"], ["息を整えろ", "control breathing"],
    ["手数を増やせ", "increase volume"], ["リング中央へ戻れ", "return to center"]
  ];

  const boxingWords = [
    "jab", "cross", "hook", "uppercut", "guard", "counter", "clinch", "parry", "slip",
    "duck", "weave", "pivot", "corner", "canvas", "round", "bell", "range", "stance",
    "tempo", "rhythm", "pressure", "southpaw", "orthodox", "rope", "ring", "body",
    "chin", "glove", "referee", "combination", "knockdown"
  ];

  const codePatterns = [
    ["guard();", "guard();"], ["jab + cross;", "jab + cross;"], ["combo++", "combo++"],
    ["if (guard) { counter(); }", "if (guard) { counter(); }"],
    ["while (round < 12) punch();", "while (round < 12) punch();"],
    ["damage += hook;", "damage += hook;"], ["stance = \"southpaw\";", "stance = \"southpaw\";"],
    ["const combo = jab + cross;", "const combo = jab + cross;"],
    ["block && counter;", "block && counter;"], ["hp -= uppercut;", "hp -= uppercut;"],
    ["for (let i=0; i<3; i++) jab();", "for (let i=0; i<3; i++) jab();"],
    ["return guard ? parry : slip;", "return guard ? parry : slip;"]
  ];

  const promptMoves = moves.concat([
    ["ジャブ", "jab"], ["クロス", "cross"], ["フック", "hook"], ["アッパー", "uppercut"],
    ["ボディブロー", "body blow"], ["ワンツー", "one two"], ["ダブルジャブ", "double jab"],
    ["トリプルジャブ", "triple jab"], ["左フック", "left hook"], ["右フック", "right hook"],
    ["左ボディ", "left body"], ["右ボディ", "right body"], ["右ストレート", "right straight"],
    ["左ストレート", "left straight"], ["ショートフック", "short hook"], ["ロングフック", "long hook"],
    ["チェックフック", "check hook"], ["オーバーハンド", "overhand"], ["リードジャブ", "lead jab"],
    ["パワージャブ", "power jab"], ["ボディジャブ", "body jab"], ["スリップ左", "slip left"],
    ["スリップ右", "slip right"], ["ダッキング", "duck"], ["ウィービング", "weave"],
    ["ショルダーロール", "shoulder roll"], ["ハイガード", "high guard"], ["ロングガード", "long guard"],
    ["サイドステップ", "side step"], ["リングカット", "cut off"], ["肩フェイント", "shoulder feint"],
    ["レベルチェンジ", "level change"], ["ラッシュ", "rush"], ["プレッシャー", "pressure"],
    ["リセット", "reset"], ["インファイト", "inside fight"], ["アウトボクシング", "outside boxing"]
  ]);

  const promptCommands = commands.concat([
    ["ガードを上げろ", "guard up"], ["距離を取れ", "keep distance"], ["足を使え", "use footwork"],
    ["ロープから出ろ", "leave the ropes"], ["ガードを割れ", "break the guard"],
    ["ボディから顔へ", "body to head"], ["顔からボディへ", "head to body"], ["打ったら戻せ", "punch and return"],
    ["ジャブで測れ", "measure with jab"], ["ラウンドを取れ", "win the round"],
    ["コーナーへ詰めろ", "cut the ring"], ["相手の右を外せ", "slip the right"],
    ["左で止めて右を打て", "jab then cross"], ["息を整えろ", "control breathing"],
    ["手数を増やせ", "increase volume"], ["リング中央へ戻れ", "return to center"],
    ["前手で距離を作れ", "make range with lead hand"], ["後ろ足を残せ", "keep the rear foot"],
    ["顎を引け", "tuck the chin"], ["肘を締めろ", "keep elbows tight"],
    ["相手の肩を見ろ", "watch the shoulders"], ["打ち終わりを狙え", "catch the exit"],
    ["ロープ際で回れ", "turn off the ropes"], ["右を見せて左を刺せ", "show right then jab"],
    ["左を散らして右を通せ", "mix jab and cross"], ["上体を振れ", "move the head"],
    ["手を出して先手を取れ", "throw first"], ["休まず角度を変えろ", "change angle"],
    ["ベルまで攻めろ", "fight to the bell"], ["被弾したら返せ", "answer every hit"],
    ["深追いするな", "do not chase"], ["打つ前にフェイント", "feint before punching"],
    ["右を外して右を返せ", "slip right and return right"], ["相手の呼吸を読め", "read the breathing"]
  ]);

  const promptWords = boxingWords.concat([
    "knockout", "scorecard", "head movement", "lead hand", "rear hand", "center line",
    "inside angle", "outside angle", "high guard", "long guard", "shoulder roll",
    "check hook", "body shot", "overhand", "footwork", "ring generalship", "volume",
    "timing", "distance", "defense", "offense", "championship", "southpaw trap"
  ]);

  const promptCodePatterns = codePatterns.concat([
    ["if (range > 2) { jab(); }", "if (range > 2) { jab(); }"],
    ["combo = [jab, cross, hook];", "combo = [jab, cross, hook];"],
    ["score += cleanHit * 10;", "score += cleanHit * 10;"],
    ["guard = hp < 30 ? high : long;", "guard = hp < 30 ? high : long;"],
    ["opponent.state = \"hurt\";", "opponent.state = \"hurt\";"],
    ["ring.center += footwork;", "ring.center += footwork;"],
    ["while (pressure) { pivot(); }", "while (pressure) { pivot(); }"],
    ["const ko = damage >= chin;", "const ko = damage >= chin;"],
    ["slip(left) && counter(right);", "slip(left) && counter(right);"],
    ["rounds.push({ bell: true });", "rounds.push({ bell: true });"],
    ["guardMap[\"body\"] = block;", "guardMap[\"body\"] = block;"],
    ["if (!guard) uppercut();", "if (!guard) uppercut();"],
    ["angle += pivot * 45;", "angle += pivot * 45;"],
    ["combo += \" jab-cross\";", "combo += \" jab-cross\";"],
    ["return hp <= 0 ? \"KO\" : \"BOX\";", "return hp <= 0 ? \"KO\" : \"BOX\";"]
  ]);

  const japanesePrompts = [
    ["ジャブを打て", "jabu wo ute"], ["右を打て", "migi wo ute"], ["左を刺せ", "hidari wo sase"],
    ["足を止めるな", "ashi wo tomeruna"], ["顎を引け", "ago wo hike"], ["息を吐け", "iki wo hake"],
    ["前へ出ろ", "mae e dero"], ["下がるな", "sagaruna"], ["回り込め", "mawarikome"],
    ["距離を測れ", "kyori wo hakare"], ["手を戻せ", "te wo modose"], ["肩を抜け", "kata wo nuke"],
    ["腰を入れろ", "koshi wo irero"], ["膝を使え", "hiza wo tsukae"], ["ガードを固めろ", "ga-do wo katamero"],
    ["相手を見ろ", "aite wo miro"], ["目を切るな", "me wo kiruna"], ["打ち返せ", "uchikaese"],
    ["先に触れ", "saki ni fure"], ["角度を作れ", "kakudo wo tsukure"], ["右へ回れ", "migi e maware"],
    ["左へ回れ", "hidari e maware"], ["ロープを背負うな", "ro-pu wo seouna"], ["中央を取れ", "chuuou wo tore"],
    ["強く踏め", "tsuyoku fume"], ["力むな", "rikimuna"], ["流れを切れ", "nagare wo kire"],
    ["相手を押し戻せ", "aite wo oshimodose"], ["深追いするな", "fukaoi suruna"], ["ベルまで打て", "beru made ute"],
    ["ジャブから右", "jabu kara migi"], ["右から左", "migi kara hidari"], ["上から下", "ue kara shita"],
    ["下から上", "shita kara ue"], ["ワンツーから回れ", "wantsuu kara maware"], ["ボディを混ぜろ", "bodi wo mazero"],
    ["フェイントして入れ", "feinto shite ire"], ["よけて返せ", "yokete kaese"], ["止めて打て", "tomete ute"],
    ["受けて返せ", "ukete kaese"], ["外して打て", "hazushite ute"], ["一歩だけ入れ", "ippo dake ire"],
    ["二発で止めるな", "nihatsu de tomeruna"], ["三発目を狙え", "sanpatsume wo nerae"], ["勝負を急ぐな", "shoubu wo isoguna"],
    ["相手の癖を読め", "aite no kuse wo yome"], ["打つ前に見せろ", "utsu mae ni misero"], ["守って終わるな", "mamotte owaruna"],
    ["攻めて戻れ", "semete modore"], ["踏み込んで打て", "fumikonde ute"], ["半歩ずらせ", "hanpo zurase"]
  ];

  const japaneseSentences = [
    ["ジャブで距離を作って右を通せ", "jabu de kyori wo tsukutte migi wo toose"],
    ["相手が出た瞬間に左を合わせろ", "aite ga deta shunkan ni hidari wo awasero"],
    ["ロープ際では止まらず横へ逃げろ", "ro-pu giwa dewa tomarazu yoko e nigero"],
    ["ボディを見せてから顔へ返せ", "bodi wo misete kara kao e kaese"],
    ["ガードの上を叩いて隙間を作れ", "ga-do no ue wo tataite sukima wo tsukure"],
    ["打ち終わりに必ず頭を動かせ", "uchiowari ni kanarazu atama wo ugokase"],
    ["前手で触って相手の反応を見ろ", "maete de sawatte aite no hannou wo miro"],
    ["焦らず中央を取り返してから攻めろ", "aserazu chuuou wo torikaeshite kara semero"],
    ["右を外したらすぐ右で返せ", "migi wo hazushitara sugu migi de kaese"],
    ["足を止めた相手に連打をまとめろ", "ashi wo tometa aite ni renda wo matomero"],
    ["一発狙いではなく流れで倒せ", "ippatsu nerai dewa naku nagare de taose"],
    ["相手の肩が動いたら先にずれろ", "aite no kata ga ugoitara saki ni zurero"],
    ["深追いせずに角度だけ変えろ", "fukaoi sezu ni kakudo dake kaero"],
    ["打たれた直後こそ姿勢を戻せ", "utareta chokugo koso shisei wo modose"],
    ["ベルが鳴るまで手数を落とすな", "beru ga naru made tekazu wo otosuna"]
  ];

  const extraJapanesePrompts = [
    ["ジャブで入れ", "jabu de haire"], ["右へ逃げるな", "migi he nigeruna"], ["左へ詰めろ", "hidari he tsumero"],
    ["顔へ返せ", "kao he kaese"], ["ボディへ散らせ", "bodi he chirase"], ["外へ回れ", "soto he maware"],
    ["内へ入れ", "uchi he haire"], ["リングへ戻れ", "ringu he modore"], ["コーナーへ追え", "ko-na- he oe"],
    ["ガードへ触れ", "ga-do he fure"], ["ロープへ押すな", "ro-pu he osuna"], ["懐へ入れ", "futokoro he haire"],
    ["中へ刺せ", "naka he sase"], ["半歩へらせ", "hanpo herase"], ["一歩入れ", "ippo haire"],
    ["二歩目で入れ", "nihopome de haire"], ["打って入れ", "utte haire"], ["沈んで入れ", "shizunde haire"],
    ["肩で押せ", "kata de ose"], ["肘を締めろ", "hiji wo shimero"], ["胸を向けるな", "mune wo mukeruna"],
    ["軸を残せ", "jiku wo nokose"], ["足から動け", "ashi kara ugoke"], ["目線を散らせ", "mesen wo chirase"],
    ["中央へ戻せ", "chuuou he modose"], ["ワンツーで入れ", "wantsu- de haire"], ["ショートで返せ", "sho-to de kaese"],
    ["チャンスを逃すな", "chansu wo nogasuna"], ["チューニングしろ", "chu-ningu shiro"], ["集中を切るな", "shuuchuu wo kiruna"],
    ["勝負を急ぐな", "shoubu wo isoguna"], ["逆へずれろ", "gyaku he zurero"], ["斜めへ入れ", "naname he haire"]
  ];

  const extraJapaneseSentences = [
    ["左へ回って右を返せ", "hidari he mawatte migi wo kaese"],
    ["ガードへ触れてから中へ入れ", "ga-do he furete kara naka he haire"],
    ["ワンツーを見せて外へ回れ", "wantsu- wo misete soto he maware"],
    ["ロープへ詰めずに角度を作れ", "ro-pu he tsumezu ni kakudo wo tsukure"],
    ["顔へ散らしてボディへ落とせ", "kao he chirashite bodi he otose"],
    ["相手が出たら半歩へらして返せ", "aite ga detara hanpo herashite kaese"],
    ["中央へ戻ってから強く踏め", "chuuou he modotte kara tsuyoku fume"],
    ["チャンスの前に小さく触れ", "chansu no mae ni chiisaku fure"],
    ["ショートで止めて右へ回れ", "sho-to de tomete migi he maware"],
    ["沈んで入れたら頭を残すな", "shizunde hairetara atama wo nokosuna"]
  ];

  japanesePrompts.push(...extraJapanesePrompts);
  japaneseSentences.push(...extraJapaneseSentences);

  promptCodePatterns.push(
    ["const guard = { high: true, low: false };", "const guard = { high: true, low: false };"],
    ["if (combo >= 3) { pressure += 2; }", "if (combo >= 3) { pressure += 2; }"],
    ["damage = Math.max(0, punch - block);", "damage = Math.max(0, punch - block);"],
    ["queue.push({ type: \"jab\", speed: 12 });", "queue.push({ type: \"jab\", speed: 12 });"],
    ["for (const punch of combo) hit(punch);", "for (const punch of combo) hit(punch);"],
    ["stance === \"southpaw\" ? slipRight() : slipLeft();", "stance === \"southpaw\" ? slipRight() : slipLeft();"],
    ["guardMap[\"head\"] += parry ? 1 : -1;", "guardMap[\"head\"] += parry ? 1 : -1;"],
    ["while (timer-- > 0) { jab(); pivot(); }", "while (timer-- > 0) { jab(); pivot(); }"],
    ["const angle = (pivot + step) % 360;", "const angle = (pivot + step) % 360;"],
    ["result = hp <= 0 ? \"KO\" : \"DECISION\";", "result = hp <= 0 ? \"KO\" : \"DECISION\";"]
  );

  const extraMoveFragments = [
    ["ジャブ", "jab"], ["クロス", "cross"], ["フック", "hook"], ["アッパー", "uppercut"],
    ["ボディ", "body"], ["右ストレート", "right straight"], ["左フック", "left hook"],
    ["ショート", "short"], ["カウンター", "counter"], ["ガード", "guard"],
    ["ステップ", "step"], ["ピボット", "pivot"], ["フェイント", "feint"], ["パリー", "parry"]
  ];
  const extraTactics = [
    ["で入れ", " de haire"], ["から返せ", " kara kaese"], ["を見せろ", " wo misero"],
    ["で止めろ", " de tomero"], ["へつなげ", " he tsunage"], ["を散らせ", " wo chirase"],
    ["で押せ", " de ose"], ["から外せ", " kara hazuse"], ["で崩せ", " de kuzuse"]
  ];
  extraMoveFragments.forEach(([moveJa, moveInput]) => {
    extraTactics.forEach(([tacticJa, tacticInput]) => {
      japanesePrompts.push([`${moveJa}${tacticJa}`, `${moveInput}${tacticInput}`]);
    });
  });
  for (let a = 0; a < extraMoveFragments.length; a += 1) {
    for (let b = 0; b < extraMoveFragments.length; b += 1) {
      if (a !== b && (a + b) % 3 === 0) {
        const first = extraMoveFragments[a];
        const second = extraMoveFragments[b];
        promptMoves.push([`${first[0]}から${second[0]}`, `${first[1]} into ${second[1]}`]);
      }
    }
  }

  const state = {
    running: false,
    transitioning: false,
    pendingNextLevel: false,
    phrase: "",
    display: "",
    isJapanesePrompt: false,
    typed: "",
    acceptedInputs: [],
    index: 0,
    playerHp: 100,
    enemyHp: 100,
    enemyMaxHp: 100,
    combo: 0,
    maxCombo: 0,
    hits: 0,
    mistakes: 0,
    level: 1,
    maxUnlockedLevel: 1,
    recentPrompts: [],
    includeSymbols: false,
    shiftDown: false,
    lastExpectedKey: "",
    lastPressedKey: "",
    lastWasMistake: false,
    timeLeft: 120,
    lastSecond: 120,
    lastInputAt: performance.now(),
    opponentIntentAt: performance.now() + 3600,
    flash: 0,
    redFlash: 0,
    shake: 0,
    punchSide: "left",
    punchPower: 0,
    enemyLean: 0,
    enemyPain: 0,
    enemyAttack: 0,
    particles: [],
    shockwaves: [],
    speedLines: [],
    floating: [],
    hintMode: 0,
    currentProfile: "",
    volume: .7,
    codeFrequency: .28,
    audio: null,
    lastTime: performance.now()
  };

  function currentRows() {
    return state.includeSymbols ? physicalRows : letterRows;
  }

  function rebuildKeyPositions() {
    Object.keys(keyPositions).forEach((key) => delete keyPositions[key]);
    currentRows().forEach((row, y) => {
      row.forEach((pair, x) => {
        const normal = keyLabel(pair[0]);
        const shifted = keyLabel(pair[1]);
        keyPositions[normal] = { x, y };
        if (shifted) keyPositions[shifted] = { x, y };
      });
    });
  }

  function renderKeyboard(expected, pressed) {
    rebuildKeyPositions();
    keyboardEl.innerHTML = "";
    currentRows().forEach((row) => {
      const rowEl = document.createElement("div");
      const isSpaceRow = row.length === 1 && row[0][0] === " ";
      rowEl.className = isSpaceRow ? "key-row space-row" : "key-row";
      rowEl.style.gridTemplateColumns = `repeat(${row.length}, minmax(18px, 1fr))`;
      row.forEach((pair) => {
        const normal = keyLabel(pair[0]);
        const shifted = keyLabel(pair[1]);
        const label = state.shiftDown ? shifted : normal;
        const key = document.createElement("div");
        const isExpected = normal === expected || (shifted && shifted === expected);
        const isPressed = normal === pressed || (shifted && shifted === pressed);
        key.className = `key${isExpected ? " expected" : ""}${isPressed ? " pressed" : ""}${isExpected && isPressed ? " both" : ""}`;
        key.textContent = label;
        rowEl.appendChild(key);
      });
      keyboardEl.appendChild(rowEl);
    });
  }

  function keyLabel(char) {
    return char === " " || char === "space" ? "SPACE" : char.toUpperCase();
  }

  function renderLastKeyboard() {
    renderKeyboard(state.lastExpectedKey, state.lastWasMistake ? state.lastPressedKey : "");
  }

  function levelStats(level = state.level) {
    return {
      time: 110 + Math.min(70, Math.floor(level * 1.6)),
      enemyHp: 125 + level * 7,
      slowBase: Math.max(1750, 4200 - level * 18),
      minSlow: Math.max(850, 1850 - level * 6),
      enemyMiss: 7 + Math.floor(level / 9),
      enemySlow: 5 + Math.floor(level / 12),
      damage: Math.max(.68, 1.18 - level * .004)
    };
  }

  function fillLevels() {
    for (let i = 1; i <= 100; i += 1) {
      const option = document.createElement("option");
      option.value = String(i);
      option.textContent = `LV ${i}`;
      levelSelect.appendChild(option);
    }
    updateLevelLocks();
  }

  function updateLevelLocks() {
    Array.from(levelSelect.options).forEach((option) => {
      option.disabled = Number(option.value) > state.maxUnlockedLevel;
    });
  }

  function normalizeHintMode(mode) {
    if (mode === "direct") return 1;
    if (mode === "above") return 0;
    return Number(mode) === 1 ? 1 : 0;
  }

  function setHintMode(mode) {
    state.hintMode = normalizeHintMode(mode);
    promptZone.classList.toggle("hint-direct", state.hintMode === 1);
    promptZone.classList.toggle("hint-above", state.hintMode === 0);
    hintDirectButton.classList.toggle("active", state.hintMode === 1);
    hintAboveButton.classList.toggle("active", state.hintMode === 0);
    saveCurrentProfile();
  }

  function setLevel(level) {
    state.level = Math.max(1, Math.min(state.maxUnlockedLevel, Number(level) || 1));
    levelSelect.value = String(state.level);
    if (!state.running) {
      const stats = levelStats();
      state.timeLeft = stats.time;
      state.lastSecond = stats.time;
      state.enemyMaxHp = stats.enemyHp;
      state.enemyHp = stats.enemyHp;
      updateBars();
    }
    saveCurrentProfile();
  }

  function setSymbols(enabled) {
    state.includeSymbols = enabled;
    if (symbolsToggle) symbolsToggle.checked = enabled;
    clearLastKeys();
    saveCurrentProfile();
  }

  function setVolume(value) {
    state.volume = Math.max(0, Math.min(1, Number(value) / 100));
    volumeSlider.value = String(Math.round(state.volume * 100));
    volumeValue.textContent = `${Math.round(state.volume * 100)}%`;
    saveCurrentProfile();
  }

  function setCodeFrequency(value) {
    state.codeFrequency = Math.max(0, Math.min(1, Number(value) / 100));
    codeFreqSlider.value = String(Math.round(state.codeFrequency * 100));
    codeFreqValue.textContent = `${Math.round(state.codeFrequency * 100)}%`;
    saveCurrentProfile();
  }

  function profileKey(name) {
    return `typeFighter.profile.${name.trim().toLowerCase()}`;
  }

  function currentSettingsSnapshot() {
    return {
      name: state.currentProfile,
      level: state.level,
      maxUnlockedLevel: state.maxUnlockedLevel,
      includeSymbols: state.includeSymbols,
      hintMode: state.hintMode,
      volume: Math.round(state.volume * 100),
      codeFrequency: Math.round(state.codeFrequency * 100)
    };
  }

  function saveCurrentProfile() {
    if (!state.currentProfile) return;
    try {
      localStorage.setItem(profileKey(state.currentProfile), JSON.stringify(currentSettingsSnapshot()));
      profileStatus.textContent = `${state.currentProfile} 保存済み`;
    } catch (error) {
      profileStatus.textContent = "保存できません";
    }
  }
  /*
  function applyProfile(profile) {
    await loadMyPage();
    return;

    state.currentProfile = profile.name || state.currentProfile;
    profileNameInput.value = state.currentProfile;
    state.maxUnlockedLevel = Math.max(1, Math.min(100, Number(profile.maxUnlockedLevel || profile.level || 1)));
    updateLevelLocks();
    setLevel(Math.min(Number(profile.level || 1), state.maxUnlockedLevel));
    setSymbols(profile.includeSymbols !== false);
    setHintMode(profile.hintMode);
    setVolume(profile.volume ?? 70);
    setCodeFrequency(profile.codeFrequency ?? 28);
    profileStatus.textContent = `${state.currentProfile} 読み込み済み`;
    saveCurrentProfile();
  }
  */
  function createProfile() {
    const name = profileNameInput.value.trim();
    if (!name) {
      profileStatus.textContent = "名前を入力";
      return;
    }
    state.currentProfile = name;
    state.maxUnlockedLevel = 1;
    updateLevelLocks();
    setLevel(1);
    saveMyPage();
  }

  /*
  function loginProfile() {
    const name = profileNameInput.value.trim();
    if (!name) {
      profileStatus.textContent = "名前を入力";
      return;
    }
    try {
      const raw = localStorage.getItem(profileKey(name));
      if (!raw) {
        profileStatus.textContent = "見つかりません";
        return;
      }
      applyProfile({ ...JSON.parse(raw), name });
    } catch (error) {
      profileStatus.textContent = "読み込めません";
    }
  }
  */
  async function loginProfile() {
    const name = profileNameInput.value.trim();

    if (!name) {
        profileStatus.textContent = "名前を入力";
        return;
    }

    await loadMyPage();
  }

  function ensureAudio() {
    if (!state.audio) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return null;
      state.audio = new AudioContext();
      state.master = state.audio.createGain();
      state.compressor = state.audio.createDynamicsCompressor();
      state.compressor.threshold.value = -18;
      state.compressor.knee.value = 18;
      state.compressor.ratio.value = 8;
      state.compressor.attack.value = .003;
      state.compressor.release.value = .16;
      state.master.connect(state.compressor);
      state.compressor.connect(state.audio.destination);
    }
    if (state.audio.state === "suspended") state.audio.resume();
    return state.audio;
  }

  function audioOut() {
    return state.master || ensureAudio()?.destination;
  }

  function playTone({ freq = 180, endFreq = 70, duration = .08, gain = .25, type = "square" }) {
    const audio = ensureAudio();
    if (!audio || state.volume <= 0) return;
    const now = audio.currentTime;
    const osc = audio.createOscillator();
    const amp = audio.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, now);
    osc.frequency.exponentialRampToValueAtTime(Math.max(20, endFreq), now + duration);
    amp.gain.setValueAtTime(.0001, now);
    amp.gain.exponentialRampToValueAtTime(Math.max(.0001, gain * state.volume), now + .012);
    amp.gain.exponentialRampToValueAtTime(.0001, now + duration);
    osc.connect(amp);
    amp.connect(audioOut());
    osc.start(now);
    osc.stop(now + duration + .025);
  }

  function playClick({ freq = 900, duration = .025, gain = .12 }) {
    const audio = ensureAudio();
    if (!audio || state.volume <= 0) return;
    const now = audio.currentTime;
    const osc = audio.createOscillator();
    const amp = audio.createGain();
    const filter = audio.createBiquadFilter();
    osc.type = "square";
    osc.frequency.setValueAtTime(freq, now);
    osc.frequency.exponentialRampToValueAtTime(freq * .45, now + duration);
    filter.type = "bandpass";
    filter.frequency.value = freq;
    filter.Q.value = 5;
    amp.gain.setValueAtTime(Math.max(.0001, gain * state.volume), now);
    amp.gain.exponentialRampToValueAtTime(.0001, now + duration);
    osc.connect(filter);
    filter.connect(amp);
    amp.connect(audioOut());
    osc.start(now);
    osc.stop(now + duration + .015);
  }

  function playNoise({ duration = .08, gain = .22, lowpass = 1800, highpass = 80 }) {
    const audio = ensureAudio();
    if (!audio || state.volume <= 0) return;
    const now = audio.currentTime;
    const length = Math.max(1, Math.floor(audio.sampleRate * duration));
    const buffer = audio.createBuffer(1, length, audio.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < length; i += 1) {
      const decay = 1 - i / length;
      data[i] = (Math.random() * 2 - 1) * decay * decay;
    }
    const src = audio.createBufferSource();
    const hp = audio.createBiquadFilter();
    const lp = audio.createBiquadFilter();
    const amp = audio.createGain();
    hp.type = "highpass";
    hp.frequency.value = highpass;
    lp.type = "lowpass";
    lp.frequency.value = lowpass;
    amp.gain.setValueAtTime(.0001, now);
    amp.gain.exponentialRampToValueAtTime(Math.max(.0001, gain * state.volume), now + .006);
    amp.gain.exponentialRampToValueAtTime(.0001, now + duration);
    src.buffer = buffer;
    src.connect(hp);
    hp.connect(lp);
    lp.connect(amp);
    amp.connect(audioOut());
    src.start(now);
    src.stop(now + duration + .02);
  }

  function playHitSound(heavy) {
    playTone({ freq: heavy ? 92 : 132, endFreq: heavy ? 42 : 58, duration: heavy ? .16 : .105, gain: heavy ? .5 : .32, type: "sine" });
    playTone({ freq: heavy ? 280 : 360, endFreq: heavy ? 105 : 145, duration: heavy ? .075 : .055, gain: heavy ? .24 : .16, type: "triangle" });
    playNoise({ duration: heavy ? .115 : .075, gain: heavy ? .5 : .31, lowpass: heavy ? 6200 : 5200, highpass: heavy ? 720 : 900 });
    playClick({ freq: heavy ? 2200 : 1850, duration: heavy ? .026 : .02, gain: heavy ? .22 : .15 });
    playClick({ freq: heavy ? 3600 : 2850, duration: .014, gain: heavy ? .12 : .08 });
    window.setTimeout(() => {
      playTone({ freq: heavy ? 950 : 760, endFreq: heavy ? 310 : 280, duration: .035, gain: heavy ? .1 : .065, type: "square" });
      playNoise({ duration: .03, gain: heavy ? .16 : .09, lowpass: 9800, highpass: 2400 });
    }, 14);
  }

  function playMissSound() {
    playTone({ freq: 140, endFreq: 45, duration: .22, gain: .34, type: "triangle" });
    playNoise({ duration: .13, gain: .22, lowpass: 900, highpass: 70 });
  }

  function pick(array) {
    return array[Math.floor(Math.random() * array.length)];
  }

  function makePrompt() {
    const level = state.level;
    const useCode = state.includeSymbols && (Math.random() < state.codeFrequency);
    if (useCode) {
      const [display, input] = pick(promptCodePatterns);
      return { display: `CODE: ${display}`, input };
    }
    if (Math.random() < Math.min(.86, .68 + level * .003)) {
      return level < 25 ? promptJapaneseShort() : promptJapaneseAny();
    }
    if (level < 8) {
      const [display, input] = pick(promptMoves);
      return { display, input };
    }
    if (level < 22) {
      return Math.random() < .45 ? promptCombo(2) : promptCommand();
    }
    if (level < 55) {
      return Math.random() < .62 ? promptCombo(2 + Math.floor(Math.random() * 2)) : promptCommand();
    }
    return Math.random() < .7 ? promptCombo(3 + Math.floor(Math.random() * 2)) : promptSentence();
  }

  function promptJapaneseShort() {
    const [display, input] = pick(japanesePrompts);
    return { display, input: normalizeJapaneseInput(display, input).replace(/\s+/g, ""), type: "ja" };
  }

  function promptJapaneseAny() {
    const source = Math.random() < .55 ? japanesePrompts : japaneseSentences;
    const [display, input] = pick(source);
    return { display, input: normalizeJapaneseInput(display, input).replace(/\s+/g, ""), type: "ja" };
  }

  function normalizeJapaneseInput(display, input) {
    let normalized = input.toLowerCase();
    const longMarkWords = [
      ["ガード", "gaado", "ga-do"],
      ["ロープ", "roopu", "ro-pu"],
      ["ワンツー", "wantsuu", "wantsu-"]
    ];
    longMarkWords.forEach(([word, from, to]) => {
      if (display.includes(word)) normalized = normalized.split(from).join(to);
    });
    const loanwordDisplayInputs = [
      ["ジャブ", "jab", "jabu"],
      ["クロス", "cross", "kurosu"],
      ["フック", "hook", "hukku"],
      ["アッパー", "uppercut", "appa-katto"],
      ["カウンター", "counter", "kaunta-"],
      ["ガード", "guard", "ga-do"],
      ["ステップ", "step", "suteppu"],
      ["ピボット", "pivot", "pibotto"],
      ["フェイント", "feint", "feinto"],
      ["パリー", "parry", "pari-"],
      ["ショート", "short", "sho-to"],
      ["ロング", "long", "rongu"],
      ["ボディブロー", "body blow", "bodi buro-"],
      ["ボディ", "body", "bodi"],
      ["右ストレート", "right straight", "migi sutore-to"],
      ["左ストレート", "left straight", "hidari sutore-to"],
      ["右フック", "right hook", "migi hukku"],
      ["左フック", "left hook", "hidari hukku"],
      ["右ボディ", "right body", "migi bodi"],
      ["左ボディ", "left body", "hidari bodi"],
      ["ショルダーロール", "shoulder roll", "shoruda- ro-ru"],
      ["ハイガード", "high guard", "hai ga-do"],
      ["ロングガード", "long guard", "rongu ga-do"],
      ["レベルチェンジ", "level change", "reberu chenji"],
      ["プレッシャー", "pressure", "puressha-"],
      ["ラッシュ", "rush", "rasshu"],
      ["ウィーブ", "weave", "wi-bu"],
      ["ダック", "duck", "dakku"],
      ["スリップ", "slip", "surippu"]
    ];
    loanwordDisplayInputs.forEach(([word, from, to]) => {
      if (display.includes(word)) normalized = normalized.split(from).join(to);
    });
    normalized = normalized
      .replace(/right hukku/g, "migi hukku")
      .replace(/left hukku/g, "hidari hukku")
      .replace(/right bodi/g, "migi bodi")
      .replace(/left bodi/g, "hidari bodi")
      .replace(/high ga-do/g, "hai ga-do")
      .replace(/long ga-do/g, "rongu ga-do");
    normalized = normalized
      .replace(/hidariemaware/g, "hidarihemaware")
      .replace(/mae e dero/g, "maehedero")
      .replace(/migi e maware/g, "migihemaware")
      .replace(/hidari e maware/g, "hidarihemaware")
      .replace(/yoko e nigero/g, "yokohenigero")
      .replace(/kao e kaese/g, "kaohekaese")
      .replace(/feinto shite ire/g, "feinto shite haire")
      .replace(/ippo dake ire/g, "ippo dake haire")
      .replace(/dake ire/g, "dake haire");
    return normalized;
  }

  function promptCommand() {
    const [display, input] = pick(promptCommands);
    return { display, input };
  }

  function promptCombo(count) {
    const selected = Array.from({ length: count }, () => pick(promptMoves));
    return {
      display: selected.map((item) => item[0]).join(" → "),
      input: selected.map((item) => item[1]).join(" ")
    };
  }

  function promptSentence() {
    const a = pick(promptWords);
    const b = pick(promptWords);
    const c = pick(promptWords);
    const templates = [
      [`${a}から${b}へつなげ`, `${a} into ${b}`],
      [`${a}を見せて${b}を打て`, `show ${a} then hit ${b}`],
      [`${c}を保って${a}を狙え`, `keep ${c} and find ${a}`],
      [`${a}で距離を作り${b}で倒せ`, `make range with ${a} finish with ${b}`]
    ];
    const [display, input] = pick(templates);
    return { display, input };
  }

  function setPhrase() {
    let next = makePrompt();
    for (let i = 0; i < 18 && state.recentPrompts.includes(next.input); i += 1) {
      next = makePrompt();
    }
    state.recentPrompts.push(next.input);
    if (state.recentPrompts.length > 24) state.recentPrompts.shift();
    state.display = next.display;
    state.isJapanesePrompt = next.type === "ja";
    state.phrase = next.input.toLowerCase();
    state.typed = "";
    state.acceptedInputs = state.isJapanesePrompt ? japaneseInputVariants(state.display, state.phrase) : [state.phrase];
    state.index = 0;
    updatePhrase();
  }

  function updatePhrase() {
    displayPhraseEl.textContent = state.isJapanesePrompt ? "" : state.display;
    phraseEl.innerHTML = "";
    typingLineEl.innerHTML = "";
    if (state.isJapanesePrompt) {
      phraseEl.textContent = state.display;
      [...japaneseVisibleInput()].forEach((char, i) => {
        const span = document.createElement("span");
        span.textContent = char;
        if (i < state.index) span.classList.add("done");
        if (i === state.index) span.classList.add("current");
        typingLineEl.appendChild(span);
      });
      return;
    }
    [...state.phrase].forEach((char, i) => {
      const span = document.createElement("span");
      span.dataset.index = i;
      span.textContent = char === " " ? "\u00a0" : char;
      if (char === " ") span.classList.add("space-char");
      if (i < state.index) span.classList.add("done");
      if (i === state.index) span.classList.add("current");
      phraseEl.appendChild(span);
    });
    typingLineEl.textContent = `${state.index}/${state.phrase.length}`;
  }

  function japaneseInputVariants(display, input) {
    const sources = new Set([input.toLowerCase()]);
    if (hasJapanese(display)) {
      Array.from(sources).forEach((source) => loanwordVariants(source).forEach((variant) => sources.add(variant)));
    }
    return romajiVariants(Array.from(sources));
  }

  function hasJapanese(text) {
    return /[ぁ-んァ-ン一-龯]/.test(text);
  }

  function loanwordVariants(input) {
    const sources = new Set([input]);
    const groups = [
      ["jab", "jabu"],
      ["cross", "kurosu"],
      ["hook", "hukku", "fukku"],
      ["uppercut", "appa-katto"],
      ["counter", "kaunta-"],
      ["guard", "ga-do"],
      ["step", "suteppu"],
      ["pivot", "pibotto"],
      ["feint", "feinto"],
      ["parry", "pari-"],
      ["short", "sho-to"],
      ["long", "rongu"],
      ["bodyblow", "bodiburo-"],
      ["body", "bodi"],
      ["rightstraight", "migisutore-to"],
      ["leftstraight", "hidarisutore-to"],
      ["righthook", "migihukku", "migifukku"],
      ["lefthook", "hidarihukku", "hidarifukku"],
      ["rightbody", "migibodi"],
      ["leftbody", "hidaribodi"],
      ["shoulderroll", "shoruda-ro-ru"],
      ["highguard", "haiga-do"],
      ["longguard", "ronguga-do"],
      ["levelchange", "reberuchenji"],
      ["pressure", "puressha-"],
      ["rush", "rasshu"],
      ["weave", "wi-bu"],
      ["duck", "dakku"],
      ["slip", "surippu"]
    ];
    groups.forEach((group) => {
      Array.from(sources).forEach((source) => {
        group.forEach((from) => {
          group.forEach((to) => {
            if (from !== to) sources.add(source.split(from).join(to));
          });
        });
      });
    });
    return Array.from(sources);
  }

  function romajiVariants(inputs) {
    const sources = new Set(Array.isArray(inputs) ? inputs.map((input) => input.toLowerCase()) : [inputs.toLowerCase()]);
    const groups = [
      ["shi", "si"],
      ["chi", "ti"],
      ["tsu", "tu"],
      ["fu", "hu"],
      ["ji", "zi"],
      ["ja", "zya"],
      ["ju", "zyu"],
      ["jo", "zyo"],
      ["sha", "sya"],
      ["shu", "syu"],
      ["sho", "syo"],
      ["cha", "tya"],
      ["chu", "tyu"],
      ["cho", "tyo"]
    ];
    groups.forEach(([a, b]) => {
      Array.from(sources).forEach((source) => {
        sources.add(source.split(a).join(b));
        sources.add(source.split(b).join(a));
      });
    });
    Array.from(sources).forEach((source) => {
      sources.add(source.split("-").join(""));
      sources.add(source.replace(/a-/g, "aa").replace(/i-/g, "ii").replace(/u-/g, "uu").replace(/e-/g, "ee").replace(/o-/g, "oo"));
    });
    return Array.from(sources).sort((a, b) => a.length - b.length || a.localeCompare(b));
  }

  function primaryExpectedChar() {
    return state.phrase[state.index] || "";
  }

  function japaneseExpectedChar() {
    return japaneseVisibleInput()[state.typed.length] || "";
  }

  function syncJapaneseIndex() {
    state.index = state.typed.length;
  }

  function japaneseVisibleInput() {
    if (state.phrase.startsWith(state.typed)) return state.phrase;
    const candidates = state.acceptedInputs.filter((input) => input.startsWith(state.typed));
    if (!candidates.length) return state.phrase;
    return candidates.sort((a, b) => a.length - b.length || a.localeCompare(b))[0];
  }

  function showLastKeys(expected, pressed, wasMistake) {
    state.lastExpectedKey = expected;
    state.lastPressedKey = pressed;
    state.lastWasMistake = wasMistake;
    mistakeCopyEl.textContent = wasMistake ? pressed || "?" : "OK";
    keyHintEl.textContent = expected || "-";
    renderLastKeyboard();
  }

  function clearLastKeys() {
    state.lastExpectedKey = "";
    state.lastPressedKey = "";
    state.lastWasMistake = false;
    mistakeCopyEl.textContent = "LAST";
    keyHintEl.textContent = "-";
    renderLastKeyboard();
  }

  function startLevel(resetPlayer = true) {
    const stats = levelStats();
    state.running = true;
    state.transitioning = false;
    state.pendingNextLevel = false;
    if (resetPlayer) state.playerHp = 100;
    state.enemyMaxHp = stats.enemyHp;
    state.enemyHp = stats.enemyHp;
    state.combo = 0;
    state.maxCombo = 0;
    state.hits = 0;
    state.mistakes = 0;
    state.timeLeft = stats.time;
    state.lastSecond = stats.time;
    state.lastInputAt = performance.now() + 1200;
    state.opponentIntentAt = performance.now() + 4800;
    state.particles = [];
    state.shockwaves = [];
    state.speedLines = [];
    state.floating = [];
    startOverlay.classList.add("hidden");
    resultOverlay.classList.add("hidden");
    keyboardPanel.classList.add("visible");
    hideMistakeFocus();
    clearLastKeys();
    feedback(`LV ${state.level}: 打て。リズムを奪え。`, "");
    setPhrase();
    updateBars();
  }

  function startGame() {
    if (state.pendingNextLevel && state.level < 100) {
      setLevel(state.level + 1);
      saveCurrentProfile();
    }
    startLevel(true);
  }

  function finishGame(reason) {
    state.running = false;
    state.transitioning = false;
    state.pendingNextLevel = false;
    const win = state.enemyHp <= 0 || (state.playerHp > 0 && reason === "time" && state.enemyHp < state.enemyMaxHp * .38);
    if (win && state.level < 100) {
      state.maxUnlockedLevel = Math.max(state.maxUnlockedLevel, state.level + 1);
      updateLevelLocks();
      saveCurrentProfile();
    }
    resultKicker.textContent = reason === "time" ? "TIME UP" : "RESULT";
    resultTitle.textContent = win ? "LEVEL CLEAR" : "DOWN";
    state.pendingNextLevel = win && state.level < 100;
    resultStats.textContent = `LV ${state.level} / HIT ${state.hits} / MISS ${state.mistakes} / MAX COMBO ${state.maxCombo}${state.pendingNextLevel ? " / SPACEで次へ" : ""}`;
    restartButton.textContent = state.pendingNextLevel ? "NEXT LEVEL" : "REMATCH";
    resultOverlay.classList.remove("hidden");
  }

  function updateBars() {
    playerHpEl.style.transform = `scaleX(${Math.max(0, state.playerHp) / 100})`;
    enemyHpEl.style.transform = `scaleX(${Math.max(0, state.enemyHp) / state.enemyMaxHp})`;
    comboTextEl.textContent = `COMBO ${state.combo}`;
    difficultyTextEl.textContent = `LV ${state.level}`;
    roundTimeEl.textContent = Math.max(0, Math.ceil(state.timeLeft));
  }

  function feedback(text, type) {
    feedbackEl.textContent = text;
    feedbackEl.className = `feedback ${type}`;
  }

  function addText(text, x, y, color, size = 26) {
    state.floating.push({ text, x, y, color, size, life: 1, vy: -75 });
  }

  function addSparks(x, y, color, count, speed) {
    for (let i = 0; i < count; i += 1) {
      const angle = Math.random() * Math.PI * 2;
      const velocity = speed * (.4 + Math.random() * .9);
      state.particles.push({ x, y, vx: Math.cos(angle) * velocity, vy: Math.sin(angle) * velocity - 40, r: 2 + Math.random() * 6, color, life: .45 + Math.random() * .35 });
    }
  }

  function addShockwave(x, y, color, size = 90) {
    state.shockwaves.push({ x, y, color, size, life: .34 });
  }

  function addSpeedLines(power = 1) {
    const count = Math.floor(12 + power * 18);
    for (let i = 0; i < count; i += 1) {
      const side = Math.random() < .5 ? -1 : 1;
      state.speedLines.push({
        x: window.innerWidth * (.5 + side * (.18 + Math.random() * .36)),
        y: window.innerHeight * (.18 + Math.random() * .62),
        len: 70 + Math.random() * 120,
        side,
        life: .22 + Math.random() * .16
      });
    }
  }

  function screenShake(kind) {
    document.body.classList.remove("shake", "heavy-shake");
    void document.body.offsetWidth;
    document.body.classList.add(kind === "heavy" ? "heavy-shake" : "shake");
    state.shake = kind === "heavy" ? 15 : 8;
  }

  function hitEnemy(char) {
    const expectedKey = keyLabel(char);
    const now = performance.now();
    const delay = now - state.lastInputAt;
    state.lastInputAt = now;
    state.combo += 1;
    state.maxCombo = Math.max(state.maxCombo, state.combo);
    state.hits += 1;
    const stats = levelStats();
    const speedBonus = delay < 140 ? 2.5 : delay < 230 ? 1.6 : .7;
    const damage = (3.4 + Math.min(7, state.combo * .2) + speedBonus) * stats.damage;
    state.enemyHp -= damage;
    state.punchSide = state.punchSide === "left" ? "right" : "left";
    state.punchPower = 1;
    state.enemyLean = state.punchSide === "left" ? -1 : 1;
    state.enemyPain = 1;
    state.flash = .28;
    const heavy = state.combo % 10 === 0 || damage > 8.5;
    screenShake(heavy ? "heavy" : "light");
    const impactX = window.innerWidth * (.5 + state.enemyLean * .06);
    const impactY = window.innerHeight * .28;
    playHitSound(heavy);
    addSparks(impactX, impactY, heavy ? "#f4c15d" : "#65f3bd", heavy ? 62 : 34, heavy ? 440 : 310);
    addShockwave(impactX, impactY, heavy ? "#f4c15d" : "#65f3bd", heavy ? 150 : 95);
    addSpeedLines(heavy ? 1.6 : .8);
    addText(heavy ? "SMASH" : char.toUpperCase(), window.innerWidth * .52, window.innerHeight * .22, heavy ? "#f4c15d" : "#65f3bd", heavy ? 44 : 28);
    feedback(state.combo >= 8 ? `${state.combo} COMBO!` : "HIT", "hit");
    hideMistakeFocus();
    showLastKeys(expectedKey, expectedKey, false);
    updateBars();
    if (state.enemyHp <= 0) finishGame("ko");
  }

  function showMistake(expected, pressed) {
    const e = keyLabel(expected);
    const p = keyLabel(pressed);
    renderKeyboard(e, p);
    mistakeCopyEl.textContent = p || "?";
    keyHintEl.textContent = e;
    showLastKeys(e, p, true);
    showMistakeFocus();
  }

  function showMistakeFocus() {
    const current = phraseEl.querySelector(".current");
    if (!current) return;
    current.classList.add("mistake-target");
  }

  function hideMistakeFocus() {
    mistakeBubble.classList.remove("visible");
    const target = phraseEl.querySelector(".mistake-target");
    if (target) target.classList.remove("mistake-target");
  }

  function enemyStrike(reason) {
    const stats = levelStats();
    state.playerHp -= reason === "slow" ? stats.enemySlow : stats.enemyMiss;
    state.combo = 0;
    state.enemyAttack = 1;
    state.redFlash = .38;
    playMissSound();
    screenShake("heavy");
    addSparks(window.innerWidth * .5, window.innerHeight * .55, "#ff4e4e", 32, 300);
    addText(reason === "slow" ? "TOO SLOW" : "COUNTER", window.innerWidth * .5, window.innerHeight * .34, "#ff4e4e", 38);
    feedback(reason === "slow" ? "遅い。相手のパンチ!" : "ミス。カウンター!", "bad");
    state.opponentIntentAt = performance.now() + 2500 + Math.random() * 1500;
    updateBars();
    if (state.playerHp <= 0) finishGame("down");
  }

  function handleKey(event) {
    if (event.target && ["INPUT", "SELECT", "BUTTON"].includes(event.target.tagName)) return;
    if (event.key === "Shift") {
      state.shiftDown = true;
      renderLastKeyboard();
      return;
    }
    if (event.repeat) return;
    if (!state.running) {
      if (event.code === "Space" || event.code === "Enter") startGame();
      return;
    }
    if (event.key.length !== 1) return;
    event.preventDefault();
    const pressed = event.key.toLowerCase();
    if (state.isJapanesePrompt) {
      const candidate = state.typed + pressed;
      const isCorrect = state.acceptedInputs.some((input) => input.startsWith(candidate));
      const isComplete = state.acceptedInputs.some((input) => input === candidate);
      const expected = japaneseExpectedChar();
      if (isCorrect) {
        state.typed = candidate;
        syncJapaneseIndex();
        hitEnemy(pressed);
        if (isComplete) {
          addText("COMBINATION", window.innerWidth * .5, window.innerHeight * .18, "#f4c15d", 34);
          setPhrase();
        } else {
          updatePhrase();
        }
      } else {
        state.mistakes += 1;
        updatePhrase();
        showMistake(expected, event.key);
        enemyStrike("miss");
      }
      return;
    }
    const expected = primaryExpectedChar();
    if (pressed === expected) {
      state.index += 1;
      hitEnemy(expected);
      if (state.index >= state.phrase.length) {
        addText("COMBINATION", window.innerWidth * .5, window.innerHeight * .18, "#f4c15d", 34);
        setPhrase();
      } else {
        updatePhrase();
      }
    } else {
      state.mistakes += 1;
      updatePhrase();
      showMistake(expected, event.key);
      enemyStrike("miss");
    }
  }

  function handleKeyUp(event) {
    if (event.key === "Shift") {
      state.shiftDown = false;
      renderLastKeyboard();
    }
  }

  function drawRing(w, h) {
    const grd = ctx.createLinearGradient(0, h * .05, 0, h);
    grd.addColorStop(0, "#1a2529");
    grd.addColorStop(.52, "#0c1114");
    grd.addColorStop(1, "#070809");
    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, w, h);
    ctx.strokeStyle = "rgba(120,168,255,.32)";
    ctx.lineWidth = Math.max(2, w * .004);
    for (let i = 0; i < 3; i += 1) {
      const y = h * (.27 + i * .09);
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.bezierCurveTo(w * .3, y - h * .05, w * .7, y - h * .05, w, y);
      ctx.stroke();
    }
    ctx.fillStyle = "rgba(255,255,255,.04)";
    for (let i = 0; i < 14; i += 1) ctx.fillRect((i * w / 14) - 1, h * .55, 2, h * .45);
    const floor = ctx.createRadialGradient(w * .5, h * .8, 0, w * .5, h * .8, w * .65);
    floor.addColorStop(0, "rgba(244,193,93,.16)");
    floor.addColorStop(1, "rgba(0,0,0,.08)");
    ctx.fillStyle = floor;
    ctx.beginPath();
    ctx.ellipse(w * .5, h * .84, w * .56, h * .18, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  function drawOpponent(w, h) {
    const cx = w * .5 + state.enemyLean * w * .035 * state.enemyPain;
    const bob = Math.sin(performance.now() / 260) * h * .008;
    const scale = Math.min(w / 1280, h / 720);
    ctx.save();
    ctx.translate(cx, h * .34 + bob);
    ctx.rotate(state.enemyLean * state.enemyPain * -.08);
    ctx.scale(scale, scale);
    ctx.shadowColor = "rgba(0,0,0,.45)";
    ctx.shadowBlur = 22;
    ctx.fillStyle = "#2d3538";
    roundRect(-92, -8, 184, 178, 34);
    ctx.fill();
    ctx.fillStyle = "#15191b";
    roundRect(-68, 18, 136, 130, 24);
    ctx.fill();
    ctx.fillStyle = state.enemyPain > .35 ? "#ff9a7d" : "#c88a62";
    roundRect(-56, -116, 112, 126, 42);
    ctx.fill();
    ctx.fillStyle = "#1d1514";
    roundRect(-60, -127, 120, 38, 22);
    ctx.fill();
    ctx.fillStyle = "#090909";
    ctx.fillRect(-32, -66, 18, 8);
    ctx.fillRect(16, -66, 18, 8);
    ctx.fillStyle = state.enemyPain > .25 ? "#ff4e4e" : "#5d2626";
    ctx.fillRect(-16, -30, 32, 7);
    drawGlove(-118, -2, .95, "#b72831");
    drawGlove(118, -2, .95, "#b72831");
    if (state.enemyAttack > .05) drawGlove(0, 116 + state.enemyAttack * 170, 1.35 + state.enemyAttack * .45, "#cf2e38");
    ctx.restore();
  }

  function drawGlove(x, y, scale, color) {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(scale, scale);
    ctx.fillStyle = color;
    roundRect(-34, -28, 68, 62, 24);
    ctx.fill();
    ctx.fillStyle = "rgba(255,255,255,.18)";
    roundRect(-18, -21, 26, 13, 8);
    ctx.fill();
    ctx.fillStyle = "#3a1014";
    ctx.fillRect(-28, 25, 56, 18);
    ctx.restore();
  }

  function drawPlayerHands(w, h) {
    const baseY = h * .92;
    const leftPunch = state.punchSide === "left" ? state.punchPower : 0;
    const rightPunch = state.punchSide === "right" ? state.punchPower : 0;
    drawPlayerGlove(w * (.32 + leftPunch * .17), baseY - leftPunch * h * .31, 1.2 + leftPunch * .55, -0.22 + leftPunch * .3, "#245f8f");
    drawPlayerGlove(w * (.68 - rightPunch * .17), baseY - rightPunch * h * .31, 1.2 + rightPunch * .55, 0.22 - rightPunch * .3, "#245f8f");
  }

  function drawPlayerGlove(x, y, scale, rot, color) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rot);
    ctx.scale(scale, scale);
    ctx.fillStyle = color;
    roundRect(-58, -48, 116, 100, 34);
    ctx.fill();
    ctx.fillStyle = "#113554";
    roundRect(-38, 32, 76, 42, 12);
    ctx.fill();
    ctx.fillStyle = "rgba(255,255,255,.2)";
    roundRect(-28, -35, 34, 18, 9);
    ctx.fill();
    ctx.restore();
  }

  function drawEffects(dt, w, h) {
    state.speedLines = state.speedLines.filter((line) => {
      line.life -= dt;
      line.x -= line.side * 1050 * dt;
      ctx.globalAlpha = Math.max(0, line.life * 3.8);
      ctx.strokeStyle = "rgba(255,255,255,.75)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(line.x, line.y);
      ctx.lineTo(line.x + line.side * line.len, line.y + line.side * 14);
      ctx.stroke();
      ctx.globalAlpha = 1;
      return line.life > 0;
    });
    if (state.flash > 0) {
      ctx.fillStyle = `rgba(255,236,151,${state.flash * .22})`;
      ctx.fillRect(0, 0, w, h);
    }
    if (state.redFlash > 0) {
      ctx.fillStyle = `rgba(255,45,45,${state.redFlash * .38})`;
      ctx.fillRect(0, 0, w, h);
    }
    state.particles = state.particles.filter((p) => {
      p.life -= dt;
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.vy += 240 * dt;
      ctx.globalAlpha = Math.max(0, p.life);
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
      return p.life > 0;
    });
    state.shockwaves = state.shockwaves.filter((wave) => {
      wave.life -= dt;
      const t = 1 - Math.max(0, wave.life) / .34;
      ctx.globalAlpha = Math.max(0, wave.life * 2.1);
      ctx.strokeStyle = wave.color;
      ctx.lineWidth = 5 * (1 - t) + 1;
      ctx.beginPath();
      ctx.arc(wave.x, wave.y, wave.size * (.25 + t), 0, Math.PI * 2);
      ctx.stroke();
      ctx.globalAlpha = 1;
      return wave.life > 0;
    });
    state.floating = state.floating.filter((f) => {
      f.life -= dt;
      f.y += f.vy * dt;
      ctx.globalAlpha = Math.max(0, f.life);
      ctx.fillStyle = f.color;
      ctx.font = `900 ${f.size}px Segoe UI, sans-serif`;
      ctx.textAlign = "center";
      ctx.strokeStyle = "rgba(0,0,0,.7)";
      ctx.lineWidth = 5;
      ctx.strokeText(f.text, f.x, f.y);
      ctx.fillText(f.text, f.x, f.y);
      ctx.globalAlpha = 1;
      return f.life > 0;
    });
  }

  function roundRect(x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }

  function resize() {
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.floor(window.innerWidth * ratio);
    canvas.height = Math.floor(window.innerHeight * ratio);
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  }

  function tick(now) {
    const dt = Math.min(.05, (now - state.lastTime) / 1000);
    state.lastTime = now;
    const w = window.innerWidth;
    const h = window.innerHeight;
    if (state.running) {
      state.timeLeft -= dt;
      if (Math.ceil(state.timeLeft) !== state.lastSecond) {
        state.lastSecond = Math.ceil(state.timeLeft);
        updateBars();
      }
      if (state.timeLeft <= 0) finishGame("time");
      const stats = levelStats();
      const slowLimit = Math.max(stats.minSlow, stats.slowBase - state.combo * 80);
      if (now - state.lastInputAt > slowLimit) {
        state.lastInputAt = now;
        enemyStrike("slow");
      } else if (now > state.opponentIntentAt) {
        state.opponentIntentAt = now + 2600 + Math.random() * 1800;
      }
    }
    state.punchPower = Math.max(0, state.punchPower - dt * 5.4);
    state.enemyPain = Math.max(0, state.enemyPain - dt * 3.8);
    state.enemyAttack = Math.max(0, state.enemyAttack - dt * 3.6);
    state.enemyLean *= Math.max(0, 1 - dt * 3.2);
    state.flash = Math.max(0, state.flash - dt * 1.9);
    state.redFlash = Math.max(0, state.redFlash - dt * 2.4);
    state.shake = Math.max(0, state.shake - dt * 45);
    ctx.save();
    if (state.shake > 0) ctx.translate((Math.random() - .5) * state.shake, (Math.random() - .5) * state.shake);
    drawRing(w, h);
    drawOpponent(w, h);
    drawPlayerHands(w, h);
    drawEffects(dt, w, h);
    ctx.restore();
    requestAnimationFrame(tick);
  }



  async function saveMyPage(){
    const name = profileNameInput.value.trim();
    if (name === "") return;
    const response = await fetch("http://localhost:8080/api/mypages",{
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            name: name,
            level: state.maxUnlockedLevel,
            soundVolume: Math.round(state.volume * 100),
            programProblemRate: Math.round(state.codeFrequency * 100),
            keyDisplayMode: state.hintMode
        })
    });

    if(!response.ok){    
        profileStatus.textContent = `${name} は作成済みです`;
        return;
    }

    const data = await response.json();
    console.log("saved", data);
    profileStatus.textContent = `${name} を保存しました`;
  }

  async function loadMyPage(){
    const name = profileNameInput.value.trim();
    if (name === "") return null;
    console.log("LOAD NAME =", name);

    const response = await fetch(`http://localhost:8080/api/mypages/${encodeURIComponent(name)}`);
    if(!response.ok){
        console.log("user not found");
        profileStatus.textContent = `${name} は未登録です`;
        return null;
    }

    const mypage = await response.json();
    profileNameInput.value = mypage.name;
    state.currentProfile = mypage.name;
    state.maxUnlockedLevel = mypage.level;
    updateLevelLocks();
    setVolume(mypage.soundVolume);
    setCodeFrequency(mypage.programProblemRate);
    setHintMode(mypage.keyDisplayMode);

    profileStatus.textContent = `${name} をロードしました`;
  }



  startButton.addEventListener("click", startGame);
  restartButton.addEventListener("click", startGame);
  hintDirectButton.addEventListener("click", () => setHintMode(1));
  hintAboveButton.addEventListener("click", () => setHintMode(0));
  settingsToggle.addEventListener("click", () => settingsBody.classList.toggle("open"));
  createProfileButton.addEventListener("click", createProfile);
  loginProfileButton.addEventListener("click", loginProfile);
  profileNameInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      loginProfile();
    }
  });
  levelSelect.addEventListener("change", () => setLevel(levelSelect.value));
  if (symbolsToggle) symbolsToggle.addEventListener("change", () => setSymbols(symbolsToggle.checked));
  volumeSlider.addEventListener("input", () => setVolume(volumeSlider.value));
  codeFreqSlider.addEventListener("input", () => setCodeFrequency(codeFreqSlider.value));
  window.addEventListener("keydown", handleKey);
  window.addEventListener("keyup", handleKeyUp);
  window.addEventListener("resize", resize);

  fillLevels();
  setHintMode(0);
  state.maxUnlockedLevel = 1;
  updateLevelLocks();
  setLevel(1);
  setSymbols(true);
  setVolume(70);
  setCodeFrequency(28);
  resize();
  updateBars();
  setPhrase();
  clearLastKeys();
  requestAnimationFrame(tick);
})();
