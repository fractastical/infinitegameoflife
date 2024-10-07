# Multi-Dimensional Conway's Game of Life

## Overview

This is an extended version of Conway's Game of Life, featuring multiple dimensions, age absorption mechanics, and a scoring system. The game is implemented in HTML5 and JavaScript, allowing for an interactive, browser-based experience.

## Features

1. **Multi-Dimensional Gameplay**: Supports up to 7 dimensions, each with its own color.
2. **Age Absorption**: Living cells can absorb the "age" of dying neighboring cells.
3. **Visual Age Representation**: Cells change color and opacity based on their age.
4. **Numerical Age Display**: Each cell displays its current age.
5. **Scoring System**: Score is calculated based on the age and number of living cells across all dimensions.
6. **Timer**: Tracks the duration of the game session.
7. **Interval Scoring**: Records scores at 2, 5, and 10 minutes for performance tracking.

## How to Play

1. Open the HTML file in a web browser to start the game.
2. Use the control buttons to interact with the game:
   - Switch between dimensions
   - Add new dimensions (up to 7)
   - Add various patterns to the active dimension
   - Adjust game parameters like propagation rate and lifespan

## Game Rules

1. **Basic Rules**: Follow Conway's Game of Life rules:
   - Any live cell with 2 or 3 live neighbors survives
   - Any dead cell with exactly 3 live neighbors becomes a live cell
   - All other live cells die, and all other dead cells stay dead

2. **Age Mechanics**:
   - New cells start with an age of 1
   - Surviving cells increase their age by 1 each generation
   - When a cell dies, its neighboring living cells absorb a portion of its age

3. **Dimensional Interaction**: 
   - Each dimension operates independently
   - Switching dimensions allows you to add patterns to different layers

## Controls

- **Switch Dimension**: Change the active dimension
- **Add Dimension**: Create a new dimension (up to 7)
- **Add Patterns**: 
  - Glider
  - Blinker
  - Toad
  - Beacon
  - Spaceship
- **Increase Propagation Rate**: Speed up the game
- **Increase Lifespan**: Adjust the lifespan parameter (visual only)

## Scoring

- Score is calculated based on the age of living cells across all dimensions
- Older cells contribute more to the score (exponential scoring)
- Scores are recorded at 2, 5, and 10 minutes for performance tracking

## Tips for Playing

1. Experiment with different patterns in various dimensions to create complex interactions.
2. Try to create stable structures that can absorb age from dying neighbors.
3. Balance between adding new cells and maintaining existing ones to maximize your score.
4. Use the different dimensions strategically to isolate or combine different patterns.

## Technical Notes

- The game is implemented in vanilla JavaScript and HTML5 Canvas.
- Each dimension is represented by a separate canvas layer.
- The game loop updates cell states, calculates scores, and refreshes the display at regular intervals.

Enjoy exploring the multi-dimensional possibilities of this enhanced Game of Life!
