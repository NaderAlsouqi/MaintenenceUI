import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllDeviceDECComponent } from './all-device-dec.component';

describe('AllDeviceDECComponent', () => {
  let component: AllDeviceDECComponent;
  let fixture: ComponentFixture<AllDeviceDECComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AllDeviceDECComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllDeviceDECComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
