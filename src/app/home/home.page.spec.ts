import { ComponentFixture, fakeAsync, flush, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';

import { HomePage } from './home.page';

describe('HomePage', () => {
  let component: HomePage;
  let fixture: ComponentFixture<HomePage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [HomePage],
      imports: [IonicModule.forRoot(), FormsModule]
    }).compileComponents();

    fixture = TestBed.createComponent(HomePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('First command must be only PLACE, all other commands must be ignored', fakeAsync(() => {
    const compiled = fixture.debugElement.nativeElement;
    const input = compiled.querySelector('#input-command');
    const runBtn = compiled.querySelector('#run-btn');
    const commands = ['MOVE 1', 'LEFT', 'RIGHT', 'REPORT'];
    commands.forEach(cmd => {
      input.value = cmd;
      input.dispatchEvent(new Event('input'));
      tick();
      fixture.detectChanges();
      runBtn.click();
      // flush();
    });
    fixture.detectChanges();
    flush();
    const pawn = fixture.debugElement.query(By.css('.pawn')).nativeElement;
    expect(pawn.classList.contains('hidden')).toBeTrue();
  }));

    it('pawn must not fall from table on invalid moves', fakeAsync(() => {
    const compiled = fixture.debugElement.nativeElement;
    const input = compiled.querySelector('#input-command');
    const runBtn = compiled.querySelector('#run-btn');
    const commands = ['PLACE 0,0,NORTH,WHITE', 'LEFT', 'LEFT', 'MOVE 1', 'MOVE 1'];
    commands.forEach(cmd => {
      input.value = cmd;
      input.dispatchEvent(new Event('input'));
      tick();
      fixture.detectChanges();
      runBtn.click();
    });
    fixture.detectChanges();
    flush();
    const pawn = fixture.debugElement.query(By.css('.pawn')).nativeElement;
    expect(getComputedStyle(pawn).gridArea).toEqual('8 / 1 / 9 / 2');
  }));

  it('should test the command PLACE 0,0,NORTH,WHITE', fakeAsync(() => {
    const compiled = fixture.debugElement.nativeElement;
    const input = compiled.querySelector('#input-command');
    const runBtn = compiled.querySelector('#run-btn');
    input.value = 'PLACE 0,0,NORTH,WHITE';
    input.dispatchEvent(new Event('input'));
    tick();
    fixture.detectChanges();
    runBtn.click();
    fixture.detectChanges();
    flush();
    const pawn = fixture.debugElement.query(By.css('.pawn')).nativeElement;
    expect(getComputedStyle(pawn).gridArea).toEqual('8 / 1 / 9 / 2');
  }));


  it('pawn must change position from bottom left to top right corner', fakeAsync(() => {
    const compiled = fixture.debugElement.nativeElement;
    const input = compiled.querySelector('#input-command');
    const runBtn = compiled.querySelector('#run-btn');
    const commands = ['PLACE 0,0,NORTH,WHITE', 'PLACE 7,7,NORTH,WHITE'];
    commands.forEach(cmd => {
      input.value = cmd;
      input.dispatchEvent(new Event('input'));
      tick();
      fixture.detectChanges();
      runBtn.click();
    });
    fixture.detectChanges();
    flush();
    const pawn = fixture.debugElement.query(By.css('.pawn')).nativeElement;
    expect(getComputedStyle(pawn).gridArea).toEqual('1 / 8 / 2 / 9');
  }));
});

