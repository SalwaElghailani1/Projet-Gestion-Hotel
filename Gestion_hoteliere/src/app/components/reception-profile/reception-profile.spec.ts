import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceptionProfile } from './reception-profile';

describe('ReceptionProfile', () => {
  let component: ReceptionProfile;
  let fixture: ComponentFixture<ReceptionProfile>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReceptionProfile]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReceptionProfile);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
