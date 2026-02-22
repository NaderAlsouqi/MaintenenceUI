import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditDeviceDECComponent } from './edit-device-dec.component';

describe('EditDeviceDECComponent', () => {
  let component: EditDeviceDECComponent;
  let fixture: ComponentFixture<EditDeviceDECComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditDeviceDECComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditDeviceDECComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
