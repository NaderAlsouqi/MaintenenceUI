import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VewiDeviceDECComponent } from './vewi-device-dec.component';

describe('VewiDeviceDECComponent', () => {
  let component: VewiDeviceDECComponent;
  let fixture: ComponentFixture<VewiDeviceDECComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VewiDeviceDECComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VewiDeviceDECComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
