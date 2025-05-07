import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DocumentViewerPage } from './document-viewer.page';

describe('DocumentViewerPage', () => {
  let component: DocumentViewerPage;
  let fixture: ComponentFixture<DocumentViewerPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentViewerPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
