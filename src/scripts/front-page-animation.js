window.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("background-canvas");
  const ctx = canvas.getContext("2d");

  let width, height;
  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }
  window.addEventListener("resize", resize);
  resize();

  const colors = ["#27aae1", "#be1e2d"];
  const circles = [];

  function createCircle(yVal=-20) {
    const rand = Math.random();
    let color;
    if (rand < 0.001) {
        color = "#ffd700";
    } else {
        color = colors[Math.floor(Math.random() * colors.length)];
    }
    return {
      x: Math.random() * width,
      y: yVal,
      radius: 12 + Math.random() * 12,
      color: color,
      speed: 0.25 + Math.random() * 2,
      drift: (Math.random() - 0.5) * 0.5,
    };
  }

  for (let i = 0; i < 80; i++) {
    circles.push(createCircle(-i*4));
  }

  function update() {
    ctx.clearRect(0, 0, width, height);
    for (let circle of circles) {
      circle.y += circle.speed;
      circle.x += circle.drift;

      ctx.beginPath();
      ctx.arc(circle.x, circle.y, circle.radius, 0, Math.PI * 2);
      ctx.fillStyle = circle.color + "80"; // semi-transparent
      ctx.fill();

      // If circle has fallen past screen
      if (circle.y - circle.radius > height) {
        Object.assign(circle, createCircle());
        circle.y = -circle.radius;
      }
    }
    requestAnimationFrame(update);
  }

  update();
});
