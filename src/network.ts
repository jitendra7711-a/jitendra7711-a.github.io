// An original isometric network landscape. No models, images, or WebGL runtime.
// Fixed geometry and a small particle set keep animation work bounded.
export function mountNetwork(canvas: HTMLCanvasElement, isPaused: () => boolean) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const context = ctx;
  const art = canvas.parentElement!;
  type Point = { x: number; y: number };
  type Tower = { x: number; y: number; h: number; core?: boolean };
  const towers: Tower[] = [
    { x: -2, y: -2, h: .8 }, { x: 0, y: -2, h: 1.3 },
    { x: 2, y: -1, h: .9 }, { x: -2, y: 0, h: 1.5 },
    { x: 0, y: 0, h: 2.2, core: true }, { x: 2, y: 1, h: 1.25 },
    { x: -1, y: 2, h: .65 }, { x: 1, y: 3, h: .95 },
  ].sort((a, b) => a.x + a.y - b.x - b.y);
  const routes = towers.filter(t => !t.core).map(t => [{ x: t.x, y: t.y }, { x: t.x, y: 0 }, { x: 0, y: 0 }]);
  let width = 600, height = 540, visible = true, elapsed = 0, lastTime = 0;
  let pointerX = 0, pointerY = 0, targetX = 0, targetY = 0;

  function project(x: number, y: number, z = 0): Point {
    const unit = Math.min(width / 12, height / 10.5);
    return {
      x: width * .54 + (x - y) * unit * .82 + pointerX * 8,
      y: height * .6 + (x + y) * unit * .405 - z * unit * 1.14 + pointerY * 6,
    };
  }
  function polygon(points: Point[], fill: string, stroke = '#0e2942', lineWidth = .8) {
    context.beginPath();
    points.forEach((p, i) => i ? context.lineTo(p.x, p.y) : context.moveTo(p.x, p.y));
    context.closePath(); context.fillStyle = fill; context.fill();
    if (stroke) { context.strokeStyle = stroke; context.lineWidth = lineWidth; context.stroke(); }
  }
  function line(points: Point[], color: string, lineWidth = 1) {
    context.beginPath();
    points.forEach((p, i) => i ? context.lineTo(p.x, p.y) : context.moveTo(p.x, p.y));
    context.strokeStyle = color; context.lineWidth = lineWidth; context.stroke();
  }
  function drawTower(t: Tower) {
    const s = .63;
    const top = [project(t.x-s,t.y-s,t.h), project(t.x+s,t.y-s,t.h), project(t.x+s,t.y+s,t.h), project(t.x-s,t.y+s,t.h)];
    const bottom = [project(t.x-s,t.y-s), project(t.x+s,t.y-s), project(t.x+s,t.y+s), project(t.x-s,t.y+s)];
    // Ground plate, two visible faces, and a sharply lit top.
    polygon([project(t.x-.82,t.y-.82),project(t.x+.82,t.y-.82),project(t.x+.82,t.y+.82),project(t.x-.82,t.y+.82)], '#96b6c9', '#7092a8');
    polygon([top[3],top[2],bottom[2],bottom[3]], t.core ? '#bed95e' : '#315a76');
    polygon([top[1],top[2],bottom[2],bottom[1]], t.core ? '#92b33a' : '#153950');
    polygon(top, t.core ? '#e1ff8c' : '#9bc2d9');
    const inset = .36;
    polygon([project(t.x-inset,t.y-inset,t.h+.015),project(t.x+inset,t.y-inset,t.h+.015),project(t.x+inset,t.y+inset,t.h+.015),project(t.x-inset,t.y+inset,t.h+.015)], t.core ? '#d3f373' : '#5c8eab', '#315a76', .6);
    const slots = Math.max(2, Math.round(t.h * 4));
    for (let i = 0; i < slots; i++) {
      const z = .18 + i * (t.h - .28) / slots;
      line([project(t.x-.43,t.y+.635,z),project(t.x+.29,t.y+.635,z)], t.core ? '#4a661e' : '#7aa8c3', 1.2);
      const led = project(t.x+.4,t.y+.64,z);
      context.fillStyle = t.core ? '#34500d' : '#d5f578'; context.fillRect(led.x-1,led.y-1,2,2);
    }
    if (t.core) {
      const p = project(t.x,t.y,t.h+.45);
      context.fillStyle = '#0e2942'; context.font = '14px "Inter Variable",sans-serif'; context.textAlign = 'center';
      context.fillText('RELIABILITY',p.x,p.y);
      line([project(t.x,t.y,t.h+.33),project(t.x,t.y,t.h+.1)],'#54758b',.7);
    }
  }
  function render() {
    context.clearRect(0,0,width,height);
    // Architectural survey grid. The scene is illustrative, not live telemetry.
    for (let i = -4; i <= 4; i++) {
      line([project(i,-4),project(i,4)],'#8aabba55',.65);
      line([project(-4,i),project(4,i)],'#8aabba55',.65);
    }
    polygon([project(-3.4,-3.4,-.15),project(3.4,-3.4,-.15),project(3.4,3.4,-.15),project(-3.4,3.4,-.15)],'#a7c6d64d','#7299b180',.8);
    routes.forEach((route, index) => {
      const points = route.map(p=>project(p.x,p.y,.02));
      line(points,'#487b9a',2.5); line(points,'#d9f580',1);
      const progress = (elapsed * .00012 + index * .17) % 1;
      const segment = progress < .5 ? 0 : 1, local = (progress * 2) % 1;
      const p = { x: points[segment].x+(points[segment+1].x-points[segment].x)*local, y: points[segment].y+(points[segment+1].y-points[segment].y)*local };
      context.fillStyle='#365e7a'; context.fillRect(p.x-2.5,p.y-2.5,5,5);
    });
    towers.forEach(drawTower);
  }
  function resize() {
    width=art.clientWidth; height=art.clientHeight;
    const ratio=Math.min(devicePixelRatio||1,2);
    canvas.width=width*ratio; canvas.height=height*ratio;
    context.setTransform(ratio,0,0,ratio,0,0); render();
  }
  new ResizeObserver(resize).observe(art);
  new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;},{rootMargin:'100px'}).observe(art);
  art.addEventListener('pointermove',event=>{const rect=art.getBoundingClientRect();targetX=(event.clientX-rect.left)/rect.width-.5;targetY=(event.clientY-rect.top)/rect.height-.5;});
  art.addEventListener('pointerleave',()=>{targetX=0;targetY=0;});
  function frame(time:number) {
    requestAnimationFrame(frame);
    if (time-lastTime<40) return;
    const delta=Math.min(time-lastTime,100); lastTime=time;
    if (!visible||document.hidden||isPaused()) return;
    elapsed+=delta; pointerX+=(targetX-pointerX)*.08; pointerY+=(targetY-pointerY)*.08; render();
  }
  resize(); requestAnimationFrame(frame);
}
