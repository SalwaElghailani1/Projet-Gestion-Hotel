import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfilManager } from './profil-manager';

describe('ProfilManager', () => {
  let component: ProfilManager;
  let fixture: ComponentFixture<ProfilManager>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfilManager]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfilManager);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
