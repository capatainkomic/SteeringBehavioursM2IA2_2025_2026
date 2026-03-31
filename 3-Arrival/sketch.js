let target;
let snakes = [];
let vehicles = [];
let points = [];
let mode = "snake";

// Appelée avant de démarrer l'animation
function preload() {
  // en général on charge des images, des fontes de caractères etc.
  font = loadFont("./assets/inconsolata.otf");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  // Activer le mode HSB pour les couleurs arc-en-ciel
  colorMode(HSB, 360, 100, 100, 255);

  // La cible, ce sera la position de la souris
  target = createVector(random(width), random(height));

  // On générer une chaine de caractères et on va utiliser la fonction text2points
  // pour obtenir une liste de points à partir de cette chaine de caractères
  // Paramètres = texte, position x, position y, taille du texte,
  // paramètres optionnels (sampleFactor = 0.1, simplifyThreshold = 0)
  points = font.textToPoints("IA2", 100, 400, 512, { sampleFactor: 0.03 });

  // on cree des vehicules, autant que de points
  creerVehicules(points.length);

  // Créer deux instances de Snake
  const s1 = new Snake(width / 2, height / 2, 15); // Snake de 15 segments
  const s2 = new Snake(random(width), random(height), 30); // Snake de 30 segments
  snakes.push(s1);
  s1.maxSpeed = 5; // Vitesse maximale plus lente pour s1
  s1.maxForce = 0.3; // Force maximale plus faible pour s1
  s2.maxSpeed = 8; // Vitesse maximale plus rapide pour s2
  s2.maxForce = 0.5; // Force maximale plus élevée pour s2
  snakes.push(s2);
  
}

function creerVehicules(n) {
  for (let i = 0; i < n; i++) {
    let v = new Vehicle(random(width), random(height));
    vehicles.push(v);
  }
}

// appelée 60 fois par seconde
function draw() {
  // couleur pour effacer l'écran
  background(0);

  // On dessine les points
  push();
  stroke("white");
  strokeWeight(2);
  noFill();
  points.forEach((point) => {
    ellipse(point.x, point.y, 16);
  });
  pop();

  // pour effet psychedelique
  //background(0, 0, 0, 10);

  target.x = mouseX;
  target.y = mouseY;

  // dessin de la cible à la position de la souris
  push();
  fill("red");
  noStroke();
  ellipse(target.x, target.y, 32);
  pop();

  // Gestion du mode
  if (mode === "snake") {
    // Faire arriver la tête du snake vers la souris
    snakes.forEach((snake) => {
      let steeringForce = snake.arrive(target, 0);
      snake.applyForce(steeringForce);
      snake.update();
      snake.show();
    });
  } else if (mode === "text") {
    // Afficher les véhicules qui suivent les points
    vehicles.forEach((vehicle, index) => {
      // Le véhicule d'index index va sur la cible points[index]
      let steeringForce = vehicle.arrive(new createVector(points[index].x, points[index].y), 0);
      vehicle.applyForce(steeringForce);
      vehicle.update();
      vehicle.show();
    });
  }
}

function keyPressed() {
  if (key === "d") {
    Vehicle.debug = !Vehicle.debug;
  } else if (key === "s") {
    mode = "snake";
  } else if (key === "t") {
    mode = "text";
  }
}
