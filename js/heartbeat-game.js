window.R = window.R || {};

window.R.HeartbeatGame = (function() {
  var SEGMENT_SIZE = 40;
  var CELL_BAG = [
    'normal','normal','normal','normal','normal','normal','normal','normal',
    'normal','normal','normal','normal','normal','normal','normal','normal',
    'double','double','double','double','double',
    'boost','boost','boost','boost','boost',
    'reverse','reverse','reverse',
    'choice','choice','choice',
    'rest','rest','rest',
    'reward','reward',
    'penalty','penalty',
    'reroll'
  ];

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function seededShuffle(items, seed) {
    var result = items.slice();
    var value = seed + 1;
    for (var i = result.length - 1; i > 0; i--) {
      value = (value * 9301 + 49297) % 233280;
      var j = Math.floor((value / 233280) * (i + 1));
      var temp = result[i];
      result[i] = result[j];
      result[j] = temp;
    }
    return result;
  }

  function pick(items) {
    return items[Math.floor(Math.random() * items.length)];
  }

  function nextLevel(level, direction) {
    var order = window.R.HeartbeatContent.levelOrder;
    var index = order.indexOf(level);
    var nextIndex = Math.max(0, Math.min(order.length - 1, index + direction));
    return order[nextIndex];
  }

  function drawCard(level) {
    var pool = window.R.HeartbeatContent.cards[level] || window.R.HeartbeatContent.cards.beginner;
    return clone(pick(pool));
  }

  function generateSegment(startIndex) {
    var segmentNumber = Math.floor(startIndex / SEGMENT_SIZE);
    var shuffled = seededShuffle(CELL_BAG, segmentNumber);
    return shuffled.map(function(type, offset) {
      return { index: startIndex + offset, type: type };
    });
  }

  function ensureBoard(session, position) {
    var updated = clone(session);
    while (position + 12 >= updated.board.length) {
      var nextStart = updated.board.length;
      updated.board = updated.board.concat(generateSegment(nextStart));
    }
    return updated;
  }

  function createSession() {
    return {
      currentLevel: 'beginner',
      currentPlayer: 'A',
      players: {
        A: { position: 0 },
        B: { position: 0 }
      },
      board: generateSegment(0),
      currentResult: null,
      rollHistory: [],
      cardHistory: [],
      startedAt: new Date().toISOString()
    };
  }

  function resolveCell(session, player, cell, rollValue) {
    var level = session.currentLevel;
    var content = window.R.HeartbeatContent;
    var result = {
      player: player,
      partner: player === 'A' ? 'B' : 'A',
      roll: rollValue,
      cell: cell,
      level: level,
      card: null,
      alternateCard: null,
      effect: null,
      addOn: null
    };

    if (cell.type === 'rest') {
      result.effect = '休息格：本回合不派发任务，自然调整节奏。';
      return result;
    }

    if (cell.type === 'reward') {
      result.effect = pick(content.rewards);
      result.card = drawCard(nextLevel(level, -1));
      result.level = nextLevel(level, -1);
      return result;
    }

    if (cell.type === 'penalty') {
      result.effect = pick(content.penalties);
      result.card = drawCard(nextLevel(level, 1));
      result.level = nextLevel(level, 1);
      return result;
    }

    if (cell.type === 'reverse') {
      result.effect = '反转格：本回合玩家/伴侣身份临时互换。';
      result.player = player === 'A' ? 'B' : 'A';
      result.partner = player;
      result.card = drawCard(level);
      return result;
    }

    if (cell.type === 'double') {
      result.effect = '双抽格：两张任务卡二选一。';
      result.card = drawCard(level);
      result.alternateCard = drawCard(level);
      return result;
    }

    if (cell.type === 'boost') {
      result.effect = '加码格：本回合任务追加一个轻量条件。';
      result.card = drawCard(level);
      result.addOn = pick(content.boosts);
      return result;
    }

    if (cell.type === 'choice') {
      result.effect = '选择格：可以按当前状态选择执行当前层级、轻一级或强一级。';
      result.card = drawCard(level);
      result.alternateCard = drawCard(nextLevel(level, 1));
      return result;
    }

    if (cell.type === 'reroll') {
      result.effect = '再掷格：派发任务后，当前玩家获得一次额外掷骰机会。';
      result.card = drawCard(level);
      return result;
    }

    result.card = drawCard(level);
    return result;
  }

  function roll(session, forcedRoll) {
    var updated = clone(session || createSession());
    var player = updated.currentPlayer || 'A';
    var rollValue = forcedRoll || (Math.floor(Math.random() * 6) + 1);
    updated.players[player].position += rollValue;
    updated = ensureBoard(updated, updated.players[player].position);

    var cell = updated.board[updated.players[player].position];
    var result = resolveCell(updated, player, cell, rollValue);
    updated.currentResult = result;
    updated.rollHistory.push({
      at: new Date().toISOString(),
      player: player,
      roll: rollValue,
      position: updated.players[player].position,
      cellType: cell.type
    });
    if (result.card) {
      updated.cardHistory.push({
        at: new Date().toISOString(),
        player: result.player,
        partner: result.partner,
        level: result.level,
        cellType: cell.type,
        title: result.card.title
      });
    }
    updated.currentPlayer = player === 'A' ? 'B' : 'A';

    return { session: updated, roll: rollValue, player: player, cell: cell, card: result.card, effect: result.effect, result: result };
  }

  function setLevel(session, level) {
    var updated = clone(session || createSession());
    if (window.R.HeartbeatContent.levels[level]) {
      updated.currentLevel = level;
    }
    return updated;
  }

  return {
    createSession: createSession,
    generateSegment: generateSegment,
    roll: roll,
    setLevel: setLevel
  };
})();
