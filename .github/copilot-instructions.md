# 🧠 AGENTS.md — Steering Behaviors (p5.js, Craig Reynolds)

## 🎯 Purpose

This repository implements **autonomous agents using steering behaviors** as defined by Craig Reynolds (GDC 1999).

The goal is to produce **emergent, lifelike motion** using:

* local rules
* vector-based forces
* behavior composition

NOT scripted movement.

---

## 🧱 Core Principles (NON-NEGOTIABLE)

### 1. Vehicle Model

All entities are **vehicles**:

* position (p5.Vector)
* velocity (p5.Vector)
* acceleration (p5.Vector)
* maxSpeed
* maxForce

Movement is controlled via forces, NOT direct position changes. ([natureofcode.com][1])

---

### 2. Steering Law (FUNDAMENTAL)

All behaviors MUST follow:

```
steering = desired_velocity - current_velocity
```

* desired_velocity is direction × maxSpeed
* steering is limited by maxForce

👉 This rule is the foundation of ALL behaviors. ([/SKILL][2])

---

### 3. Layered Architecture

System MUST respect:

1. Action Selection → WHAT to do
2. Steering → HOW to move
3. Locomotion → APPLY movement

This repo focuses ONLY on **steering layer**.

---

### 4. Emergence over scripting

* No hardcoded paths
* No direct motion logic
* Behavior emerges from force combination

👉 Complex motion = sum of simple behaviors

---

## 🚨 HARD CONSTRAINTS

### 🔒 Vehicle.js is IMMUTABLE

* NEVER modify `Vehicle.js`
* NEVER duplicate its behaviors
* NEVER override its internal logic

---

### 🧬 EVERYTHING IS A VEHICLE

* EVERY visible object MUST extend `Vehicle`
* NO exceptions

✅ Valid:

```js
class Enemy extends Vehicle {}
class Player extends Vehicle {}
class Boid extends Vehicle {}
```

❌ Invalid:

```js
class Bullet {}           // ❌ forbidden
class Particle {}         // ❌ forbidden
```

---

### ⚙️ Behavior Rules

* NEVER create monolithic movement logic
* NEVER bypass `applyForce`
* NEVER directly mutate position

❌ Forbidden:

```js
this.position.add(this.velocity)
```

---

### 🧩 Composition Rule

All behaviors must be:

* independent
* reusable
* combinable

Combination methods:

* weighted sum
* priority system

👉 Behaviors must NOT be fused into one function

---

## ⚙️ Steering Behaviors Reference

### Seek / Flee

* base behaviors
* opposite directions

---

### Arrive

* identical to seek when far
* slows down near target ([red3d.com][3])

---

### Wander

* continuous random variation
* NEVER random per frame (no jitter)
* must preserve direction continuity ([red3d.com][3])

---

### Pursue / Evade

* predict future position
* then apply seek/flee

---

### Flocking (if used)

* separation → avoid crowding
* alignment → match velocity
* cohesion → group center ([red3d.com][3])

---

## 🧩 Code Architecture

### Required Structure

```
Vehicle.js           // core (immutable)

entities/
  Enemy.js           // extends Vehicle
  Player.js          // extends Vehicle

behaviors/
  SeekBehavior.js
  WanderBehavior.js
  CompositeBehavior.js

controllers/
  SteeringController.js
```

---

## 🎮 p5.js Rules

* MUST use `p5.Vector`
* NO external physics engine
* NO external dependencies

---

## 🧠 Agent Responsibilities

When generating code, an AI agent MUST:

### 1. Respect invariants

* Do not modify `Vehicle.js`
* Ensure all entities extend `Vehicle`

---

### 2. Declare file changes

ALWAYS specify:

* files to create
* files to modify

---

### 3. Use composition

Example:

```js
let force = createVector(0, 0);

force.add(this.seek(target));
force.add(this.wander().mult(0.5));

this.applyForce(force);
```

---

### 4. Stay within steering paradigm

* No pathfinding unless explicitly required
* No global planning
* Only local perception

---

## 🧪 Validation Checklist

Before outputting code, ALWAYS verify:

* [ ] Is it using forces?
* [ ] Is it based on desired_velocity - velocity?
* [ ] Is every entity a Vehicle subclass?
* [ ] Are behaviors composable?
* [ ] Is Vehicle.js untouched?

If ANY answer is NO → fix before responding.

---

## 🎯 Design Goals

The system should produce:

* smooth motion
* believable agents
* emergent behaviors
* scalable simulation (many agents)

---

## 🔁 Failure Conditions

Any generated solution is INVALID if:

* it modifies `Vehicle.js`
* it creates non-Vehicle entities
* it uses direct movement instead of forces
* it merges behaviors into one function
* it ignores Reynolds principles

---

## 🧠 Philosophy

> Simple rules + local perception → complex behavior

Agents should **feel alive**, not scripted.

---

## 📌 Final Rule

When in doubt:

👉 reuse existing behaviors
👉 combine forces
👉 NEVER break the vehicle model

[1]: https://natureofcode.com/autonomous-agents/?utm_source=chatgpt.com "Chapter 5: Autonomous Agents"
[2]: https://www.slashskill.com/steering-behaviors-for-game-ai-avoidance-and-anti-oscillation-in-godot-4/?utm_source=chatgpt.com "Steering Behaviors for Game AI: How to Build Avoidance and ..."
[3]: https://www.red3d.com/cwr/steer/gdc99/?utm_source=chatgpt.com "Steering Behaviors For Autonomous Characters - red3d.com"
