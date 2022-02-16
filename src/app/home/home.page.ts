import { Component } from '@angular/core';
import { ToastController } from '@ionic/angular';

export class Pawn {
  isOnTheBoard: boolean;
  isFirstMove: boolean;
  direction: Direction | string;
  colour: Colour;
  imgUrl: string;
  posX: number;
  posY: number;
  logMoves: any[];
  constructor() {
    this.isFirstMove = true;
    this.isOnTheBoard = false;
    this.logMoves = [];
  }

  setPosition(posX: number, posY: number) {
    this.posX = posX;
    this.posY = posY;
  }

  setDirection(direction) {
    this.direction = direction;
  }

  setColour(colour: Colour) {
    this.colour = colour;
    if (this.colour === Colour.white) {
      this.imgUrl = '../assets/pawn-white.png';
    } else {
      this.imgUrl = '../assets/pawn-black.png';
    }
  }
}

export enum Direction {
  north = 'NORTH',
  east = 'EAST',
  south = 'SOUTH',
  west = 'WEST'
}

export enum Colour {
  black = 'BLACK',
  white = 'WHITE'
}

export enum Rotation {
  left = 'LEFT',
  right = 'RIGHT'
}

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  pawn = new Pawn();
  inputValue = '';
  constructor(public toastController: ToastController) { }

  onKeyPress(e: KeyboardEvent) {
    this.inputValue = this.inputValue.toUpperCase();
    if (e.key === 'ArrowUp' && this.pawn.logMoves.length) {
      this.inputValue = this.pawn.logMoves[this.pawn.logMoves.length - 1];
    }
    if (e.key !== 'Enter') {
      return;
    }
    this.runCommand();
  }

  runCommand() {
    if (this.inputValue.length === 0) {
      return;
    }
    if (!this.pawn.isOnTheBoard && !this.inputValue.includes('PLACE')) {
      this.toast('First command must be PLACE');
      return;
    }
    if (this.inputValue.includes('PLACE')) {
      //place
      const values = this.inputValue.replace('PLACE', '').split(','); // array with PLACE arguments
      if (values.length !== 4) {
        this.toast('Invalid command');
        return;
      }
      const [x, y, direction, colour] = values;
      if (isNaN(Number(x)) || Number(x) < 0 || Number(x) > 7) {
        this.toast('Invalid command, please provide x value in range  [0..7]');
        return;
      }
      if (isNaN(Number(y)) || Number(y) < 0 || Number(y) > 7) {
        this.toast('Invalid command, please provide y value in range  [0..7]');
        return;
      }
      const directions = Object.values(Direction).toString(); // string with all directions
      if (!directions.includes(direction)) {
        this.toast('Invalid command, please provide a valid direction like'); //directions
        return;
      }
      const colours = Object.values(Colour).toString(); // string with all colours
      if (!colours.includes(colour)) {
        this.toast('Invalid command, please provide a valid colour like'); //colours
        return;
      }
      this.pawn.setPosition(Number(x), Number(y));
      this.pawn.setDirection(direction);
      this.pawn.setColour(colour as Colour);
      this.placePawn();
    } else if (this.inputValue.includes('MOVE')) {
      //move
      let steps: any = this.inputValue.replace('MOVE', '').replace(' ', '');
      steps = Number(steps);
      if (isNaN(steps) || steps < 1) {
        this.toast('Invalid command, please provide the number of steps to move!');
        return;
      }
      if (this.pawn.isFirstMove && steps > 2) {
        this.toast('Invalid command, the number of steps on first move must be 1 or 2!');
        return;
      }
      if (!this.pawn.isFirstMove && steps > 1) {
        this.toast('Invalid command, the number of steps must be 1!');
        return;
      }
      switch (this.pawn.direction) {
        case 'NORTH':
          if (this.pawn.posY + steps > 7) {
            this.toast('Invalid command, the pawn is out of the board!');
            return;
          }
          this.pawn.setPosition(this.pawn.posX, this.pawn.posY + steps);
          break;
        case 'EAST':
          if (this.pawn.posX + steps > 7) {
            this.toast('Invalid command, the pawn is out of the board!');
            return;
          }
          this.pawn.setPosition(this.pawn.posX + steps, this.pawn.posY);
          break;
        case 'SOUTH':
          if (this.pawn.posY - steps < 0) {
            this.toast('Invalid command, the pawn is out of the board!');
            return;
          }
          this.pawn.setPosition(this.pawn.posX, this.pawn.posY - steps);
          break;
        case 'WEST':
          if (this.pawn.posX - steps < 0) {
            this.toast('Invalid command, the pawn is out of the board!');
            return;
          }
          this.pawn.setPosition(this.pawn.posX - steps, this.pawn.posY);
          break;
      }
      this.pawn.isFirstMove = false;
      this.movePawn();
    } else if (this.inputValue.includes('LEFT')) {
      //rotate left
      const directions: any = Object.values(Direction);
      let index = directions.indexOf(this.pawn.direction);
      if (index === 0) {
        index = directions.length - 1;
      } else {
        index--;
      }
      this.pawn.direction = directions[index];
    } else if (this.inputValue.includes('RIGHT')) {
      const directions: any = Object.values(Direction);
      let index = directions.indexOf(this.pawn.direction);
      if (index === directions.length - 1) {
        index = 0;
      } else {
        index++;
      }
      this.pawn.direction = directions[index];
      //rotate right
    } else if (this.inputValue.includes('REPORT')) {
      //report
      this.toast('X: ' + this.pawn.posX + ', Y: ' + this.pawn.posY + ', F: ' + this.pawn.direction + ', C: ' + this.pawn.colour); //colours
    } else {
      this.toast('Invalid command!'); //colours
      return;
    }
    this.pawn.logMoves.push(this.inputValue);
    this.inputValue = '';
  }

  placePawn() {
    this.pawn.isOnTheBoard = true;
    const uiPawn = document.querySelector('.pawn') as HTMLElement;
    uiPawn.style.gridColumnStart = (this.pawn.posX + 1).toString(); // css grid strats at 1
    uiPawn.style.gridColumnEnd = (this.pawn.posX + 2).toString();
    uiPawn.style.gridRowStart = (9 - this.pawn.posY - 1).toString(); //9: lines on css grid
    uiPawn.style.gridRowEnd = (9 - this.pawn.posY).toString();
  }

  movePawn() {
    const uiPawn = document.querySelector('.pawn') as HTMLElement;
    if (this.pawn.direction === Direction.north || this.pawn.direction === Direction.south) {
      uiPawn.style.gridRowStart = (9 - this.pawn.posY - 1).toString(); //9: lines on css grid
      uiPawn.style.gridRowEnd = (9 - this.pawn.posY).toString();
    }
    if (this.pawn.direction === Direction.west || this.pawn.direction === Direction.east) {
      uiPawn.style.gridColumnStart = (this.pawn.posX + 1).toString(); // css grid strats at 1
      uiPawn.style.gridColumnEnd = (this.pawn.posX + 2).toString();
    }
  }

  async toast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2000
    });
    toast.present();
  }

  clear() {
    this.pawn = new Pawn();
  }

}
