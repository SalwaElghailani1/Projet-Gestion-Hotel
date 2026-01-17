import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoomStats } from './room-stats';

describe('RoomStats', () => {
  let component: RoomStats;
  let fixture: ComponentFixture<RoomStats>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RoomStats]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RoomStats);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
