import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookRecommendationsComponent } from './book-recommendations.component';

describe('BookRecommendationsComponent', () => {
  let component: BookRecommendationsComponent;
  let fixture: ComponentFixture<BookRecommendationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookRecommendationsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BookRecommendationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
