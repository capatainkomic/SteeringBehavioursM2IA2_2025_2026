// Fonction pour obtenir une couleur arc-en-ciel basée sur un indice
function getRainbowColor(index, total) {
  // Formule HSB pour créer l'arc-en-ciel
  let hue = map(index, 0, total, 0, 360);
  return color(hue, 100, 80);
}

// HeadSnake - la tête du serpent, sous-classe de Vehicle
class HeadSnake extends Vehicle {
  constructor(x, y) {
    super(x, y);
    this.r = 12; // légèrement plus petite que la tête normale
    this.tongueTime = 0; // Tracker pour la langue
    this.tongueActive = false;
    this.tonguePhase = 0; // Phase d'animation de la langue (0-1)
  }

  // Mettre à jour l'état de la langue
  updateTongue() {
    this.tongueTime += deltaTime / 1000; // En secondes
    
    // Toutes les 3 secondes, activer la langue pour 0.5 secondes
    if (this.tongueTime >= 3) {
      this.tongueActive = true;
      this.tonguePhase = 0;
      this.tongueTime = 0;
    }
    
    if (this.tongueActive) {
      this.tonguePhase += deltaTime / 500; // Animation de 0.5s
      if (this.tonguePhase > 1) {
        this.tongueActive = false;
      }
    }
  }

  show() {
    stroke("red"); // Rouge clair pour la tête
    strokeWeight(2);
    fill("red"); // Rouge pour la tête
    push();
    translate(this.pos.x, this.pos.y);
    rotate(this.vel.heading());
    triangle(-this.r, -this.r / 2, -this.r, this.r / 2, this.r, 0);
    pop();
    
    // Dessiner la langue fourchue
    this.drawTongue();
  }

  drawTongue() {
    if (this.tongueActive) {
      push();
      translate(this.pos.x, this.pos.y);
      rotate(this.vel.heading());
      
      // Animation sinusoidale de la langue
      let tongueLength = 30 + sin(this.tonguePhase * PI) * 20;
      
      // Couleur jaune avec transparence
      stroke("yellow");
      // opacite
      
      strokeWeight(3);
      
      // Langue fourchue - deux branches
      let forkAngle = 0.4; // Angle entre les deux branches
      
      // Branche gauche
      line(0, -5, tongueLength * cos(-forkAngle), tongueLength * sin(-forkAngle) - 5);
      // Branche droite
      line(0, 5, tongueLength * cos(forkAngle), tongueLength * sin(forkAngle) + 5);
      
      // Pointe de la langue
      fill("yellow");
      noStroke();
      circle(tongueLength * cos(0), tongueLength * sin(0), 3);
      
      pop();
    }
  }
}

// BodySegment - anneau du corps, sous-classe de Vehicle
class BodySegment extends Vehicle {
  constructor(x, y) {
    super(x, y);
    this.r = 10;
    this.sizeRatio = 1; // Ratio pour la diminution de taille
    this.rainbowColor = color(0, 100, 100); // Couleur primaire
  }

  show() {
    // Utiliser la couleur arc-en-ciel assignée
    stroke(this.rainbowColor);
    strokeWeight(2);
    fill(this.rainbowColor);
    let currentRadius = this.r * this.sizeRatio;
    circle(this.pos.x, this.pos.y, currentRadius * 2);
  }
}

// Snake - classe principale, sous-classe de Vehicle
class Snake extends Vehicle {
  constructor(x, y, bodyLength = 10) {
    super(x, y);
    this.head = new HeadSnake(x, y);
    this.bodySegments = [];
    this.bodyLength = bodyLength;
    
    // Créer les anneaux du corps
    for (let i = 0; i < bodyLength; i++) {
      let segment = new BodySegment(x - (i + 1) * 15, y);
      this.bodySegments.push(segment);
    }
  }

  // Faire arriver la tête vers une cible (la souris)
  arrive(target, d = 0) {
    return this.head.arrive(target, d);
  }

  // Mettre à jour tous les composants du serpent
  update() {
    // Mettre à jour la langue
    this.head.updateTongue();
    
    // Appliquer la force à la tête
    this.head.update();

    // Chaque anneau suit l'anneau précédent à distance 30
    for (let i = 0; i < this.bodySegments.length; i++) {
      let target;
      
      if (i === 0) {
        // Le premier anneau suit la tête à 30 pixels
        target = this.head.pos;
      } else {
        // Les autres anneaux suivent le segment précédent à 30 pixels
        target = this.bodySegments[i - 1].pos;
      }

      // Appliquer la force d'arrivée avec distance de freinage de 30
      let steeringForce = this.bodySegments[i].arrive(target, 30);
      this.bodySegments[i].applyForce(steeringForce);
      this.bodySegments[i].update();
      
      // Mettre à jour le ratio de taille : diminue avec la distance par rapport à la tête
      // Le premier anneau a un ratio de 1, le dernier a un ratio plus petit
      this.bodySegments[i].sizeRatio = 1 - (i / this.bodyLength) * 0.7;
    }
  }

  // Appliquer une force au serpent (surtout utile pour la tête)
  applyForce(force) {
    this.head.applyForce(force);
  }

  // Afficher tous les composants du serpent
  show() {
    // Dessiner les lignes entre les anneaux avec couleurs arc-en-ciel
    this.drawConnectingLines();
    
    // Afficher la tête
    this.head.show();
    
    // Afficher les anneaux du corps avec leurs couleurs arc-en-ciel
    for (let i = 0; i < this.bodySegments.length; i++) {
      // Assigner la couleur arc-en-ciel à chaque anneau
      this.bodySegments[i].rainbowColor = getRainbowColor(i, this.bodyLength);
      this.bodySegments[i].show();
    }
  }

  // Dessiner les lignes connectant la tête aux anneaux
  drawConnectingLines() {
    push();
    strokeWeight(20); // Deux fois le rayon (rayon = 10, donc 2*10 = 20)
    
    // Ligne de la tête au premier anneau - couleur 0
    let hueVal = map(0, 0, this.bodyLength, 0, 360);
    stroke(hueVal, 100, 80, 150); // Semi-transparente
    line(this.head.pos.x, this.head.pos.y, this.bodySegments[0].pos.x, this.bodySegments[0].pos.y);
    
    // Lignes entre les anneaux - couleur i+1
    for (let i = 0; i < this.bodySegments.length - 1; i++) {
      let hueVal = map(i + 1, 0, this.bodyLength, 0, 360);
      stroke(hueVal, 100, 80, 150); // Semi-transparente
      line(this.bodySegments[i].pos.x, this.bodySegments[i].pos.y, 
           this.bodySegments[i + 1].pos.x, this.bodySegments[i + 1].pos.y);
    }
    
    pop();
  }

  // Ajouter un anneau au serpent
  addSegment() {
    let lastSegment = this.bodySegments[this.bodySegments.length - 1];
    let newSegment = new BodySegment(lastSegment.pos.x, lastSegment.pos.y);
    this.bodySegments.push(newSegment);
    this.bodyLength++;
  }
}
