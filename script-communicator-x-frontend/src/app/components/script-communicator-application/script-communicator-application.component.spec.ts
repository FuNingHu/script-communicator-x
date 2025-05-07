import {ComponentFixture, TestBed} from '@angular/core/testing';
import {ScriptCommunicatorApplicationComponent} from "./script-communicator-application.component";
import {TranslateLoader, TranslateModule} from "@ngx-translate/core";
import {Observable, of} from "rxjs";

describe('ScriptCommunicatorApplicationComponent', () => {
  let fixture: ComponentFixture<ScriptCommunicatorApplicationComponent>;
  let component: ScriptCommunicatorApplicationComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ScriptCommunicatorApplicationComponent],
      imports: [TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader, useValue: {
            getTranslation(): Observable<Record<string, string>> {
              return of({});
            }
          }
        }
      })],
    }).compileComponents();

    fixture = TestBed.createComponent(ScriptCommunicatorApplicationComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });
});
