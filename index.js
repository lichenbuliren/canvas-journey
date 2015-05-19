var RADIUS,
    MARGIN_TOP,
    MARGIN_LEFT,
    WINDOW_WIDTH,
    WINDOW_HEIGHT;
var endTime = new Date();
// 距离当前时间5个小时
endTime.setTime(endTime.getTime() + 3600*1000);
var curShowTimeSeconds = 0;

// 小球数组
var balls = [];
const colors = ['#33B5E5', '#0099CC', '#AA66CC', '#9933CC', '#99CC00', '#669900', '#FFBB33', '#FF8800', '#FF4444', '#CC0000'];
window.onload = function() {

    WINDOW_WIDTH = document.documentElement.clientWidth - 20;
    WINDOW_HEIGHT = document.documentElement.clientHeight - 20;

    // 两遍留白各10%，画布占4/5；
    MARGIN_LEFT = Math.round(WINDOW_WIDTH / 10);
    // 108表示所有的数字中，秒数各位数的距离左边MARGIN_LEFT + 93*(RADIUS + 1),
    // 而一个数字是由15个单元组成，所以共有108*(RADIUS + 1) = WINDOW_WIDTH;
    RADIUS = Math.round(WINDOW_WIDTH * 4 / 5 / 108) - 1;

    MARGIN_TOP = Math.round(WINDOW_HEIGHT / 5);

    var canvas = document.getElementById('count-canvas');
    var context = canvas.getContext('2d');

    canvas.width = WINDOW_WIDTH;
    canvas.height = WINDOW_HEIGHT;

    curShowTimeSeconds = getCurrentShowTimeSecond();
    render(context);
    setInterval(function() {
        render(context);
        upate();
    }, 50);
}

function getCurrentShowTimeSecond() {
    var curTime = new Date();
    // var ret = endTime.getTime() - curTime.getTime();
    // ret = Math.round(ret / 1000);
    var ret = curTime.getHours()*3600 + curTime.getMinutes()*60 + curTime.getSeconds();
    return ret >= 0 ? ret : 0;
}

function upate() {
    var nextShowTimeSeconds = getCurrentShowTimeSecond();

    var nextHours = parseInt(nextShowTimeSeconds / 3600),
        nextMinutes = parseInt((nextShowTimeSeconds - nextHours * 3600) / 60),
        nextSeconds = parseInt(nextShowTimeSeconds % 60);

    var curHours = parseInt(curShowTimeSeconds / 3600),
        curMinutes = parseInt((curShowTimeSeconds - curHours * 3600) / 60),
        curSeconds = parseInt(curShowTimeSeconds % 60);


    if (nextSeconds != curSeconds) {
        if (parseInt(curHours / 10) != parseInt(nextHours / 10)) {
            addBalls(MARGIN_LEFT + 0, MARGIN_TOP, parseInt(curHours / 10));
        }

        if (parseInt(curHours % 10) != parseInt(nextHours % 10)) {
            addBalls(MARGIN_LEFT + 15 * (RADIUS + 1), MARGIN_TOP, parseInt(curHours % 10));
        }

        if (parseInt(curMinutes / 10) != parseInt(nextMinutes / 10)) {
            addBalls(MARGIN_LEFT + 39 * (RADIUS + 1), MARGIN_TOP, parseInt(curMinutes / 10));
        }

        if (parseInt(curMinutes % 10) != parseInt(nextMinutes % 10)) {
            addBalls(MARGIN_LEFT + 54 * (RADIUS + 1), MARGIN_TOP, parseInt(curMinutes % 10));
        }

        if (parseInt(curSeconds / 10) != parseInt(nextSeconds / 10)) {
            addBalls(MARGIN_LEFT + 78 * (RADIUS + 1), MARGIN_TOP, parseInt(curSeconds / 10));
        }

        if (parseInt(curSeconds % 10) != parseInt(nextSeconds % 10)) {
            addBalls(MARGIN_LEFT + 93 * (RADIUS + 1), MARGIN_TOP, parseInt(curSeconds % 10));
        }
        curShowTimeSeconds = nextShowTimeSeconds;
    }
    updateBalls();
}

function updateBalls() {

    for (var i = 0; i < balls.length; i++) {
        var curBall = balls[i];
        curBall.x += curBall.vx;
        curBall.y += curBall.vy;
        curBall.vy += curBall.g;

        if (curBall.y >= WINDOW_HEIGHT - RADIUS) {
            curBall.y = WINDOW_HEIGHT - RADIUS;
            curBall.vy = -curBall.vy * 0.75;
        }
    }

    // 性能优化，对于跑出画布的小球，删除它
    var count = 0; //记录存在于画布内的小球数量
    for (var i = 0; i < balls.length; i++) {
        if (balls[i].x + RADIUS > 0 && balls[i].x - RADIUS < WINDOW_WIDTH) {
            balls[count++] = balls[i];
        }
    }

    // 删除超出的小球，最多保留300个
    while (balls.length > Math.min(300, count)) {
        balls.pop();
    }
}

function addBalls(x, y, num) {
    for (var i = 0; i < digit[num].length; i++) {
        var curNum = digit[num][i];
        for (var j = 0; j < curNum.length; j++) {
            if (curNum[j] == 1) {
                var aBall = {
                    x: x + j * 2 * (RADIUS + 1) + (RADIUS + 1),
                    y: y + i * 2 * (RADIUS + 1) + (RADIUS + 1),
                    g: 1.5 + Math.random(),
                    vx: Math.pow(-1, Math.ceil(Math.random() * 1000)) * 4,
                    vy: -5,
                    color: colors[Math.floor(Math.random() * colors.length)]
                }

                balls.push(aBall);
            }
        }
    }
}

function render(ctx) {

    ctx.clearRect(0, 0, WINDOW_WIDTH, WINDOW_HEIGHT);
    var hours = parseInt(curShowTimeSeconds / 3600),
        minutes = parseInt((curShowTimeSeconds - hours * 3600) / 60),
        seconds = curShowTimeSeconds % 60;

    // 小时的十位数
    renderDigit(MARGIN_LEFT, MARGIN_TOP, parseInt(hours / 10), ctx);
    // 一个数字的宽度是7，直径是2*(RANDIUS + 1)
    // 改成15，增加（RADIUS + 1）点距离，
    // 小时的个位数
    renderDigit(MARGIN_LEFT + 15 * (RADIUS + 1), MARGIN_TOP, parseInt(hours % 10), ctx);

    // 绘制冒号
    renderDigit(MARGIN_LEFT + 30 * (RADIUS + 1), MARGIN_TOP, 10, ctx);

    // 分钟的十位数
    renderDigit(MARGIN_LEFT + 39 * (RADIUS + 1), MARGIN_TOP, parseInt(minutes / 10), ctx);
    // 一个数字的宽度是7，直径是2*(RANDIUS + 1)
    //分钟的个位数
    renderDigit(MARGIN_LEFT + 54 * (RADIUS + 1), MARGIN_TOP, parseInt(minutes % 10), ctx);

    // 绘制冒号
    renderDigit(MARGIN_LEFT + 69 * (RADIUS + 1), MARGIN_TOP, 10, ctx);

    // 秒数的十位数
    renderDigit(MARGIN_LEFT + 78 * (RADIUS + 1), MARGIN_TOP, parseInt(seconds / 10), ctx);
    // 秒数的个位数
    renderDigit(MARGIN_LEFT + 93 * (RADIUS + 1), MARGIN_TOP, parseInt(seconds % 10), ctx);

    // 绘制小球
    for (var i = 0; i < balls.length; i++) {
        var curBall = balls[i];
        ctx.fillStyle = curBall.color;

        ctx.beginPath();
        ctx.arc(curBall.x, curBall.y, RADIUS, 0, 2 * Math.PI, true);
        ctx.closePath();
        ctx.fill();
    }
}

function renderDigit(x, y, num, ctx) {

    ctx.fillStyle = 'rgb(0,102,153)';

    // 遍历数据表里面对应的每个数字所对应的点阵数组
    for (var i = 0; i < digit[num].length; i++) {
        var curRow = digit[num][i];
        for (var j = 0; j < curRow.length; j++) {
            if (curRow[j] == 1) {
                ctx.beginPath();
                // 如果为1，则画出实心圆
                var cur_x = x + j * 2 * (RADIUS + 1) + (RADIUS + 1),
                    cur_y = y + i * 2 * (RADIUS + 1) + (RADIUS + 1);
                ctx.arc(cur_x, cur_y, RADIUS, 0, 2 * Math.PI);
                ctx.closePath();
                ctx.fill();
            }
        }
    }
}