
import { TodoListComponent } from './todo-list.component';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatOptionModule } from '@angular/material/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { Observable } from 'rxjs';
import { Todo} from './todo';
import { TodoService } from './todo.service';

const COMMON_IMPORTS: any[] = [
  FormsModule,
  MatCardModule,
  MatFormFieldModule,
  MatSelectModule,
  MatOptionModule,
  MatButtonModule,
  MatInputModule,
  MatExpansionModule,
  MatTooltipModule,
  MatListModule,
  MatDividerModule,
  MatRadioModule,
  MatSnackBarModule,
  BrowserAnimationsModule,
  RouterTestingModule,
];

describe('TodoListComponent', () => {
  let todoList: TodoListComponent;
  let fixture: ComponentFixture<TodoListComponent>;


  beforeEach(waitForAsync(() => {
    // Compile all the components in the test bed
    // so that everything's ready to go.
    TestBed.compileComponents().then(() => {
      /* Create a fixture of the UserListComponent. That
      * allows us to get an instance of the component
      * (userList, below) that we can control in
      * the tests.
      */
      fixture = TestBed.createComponent(TodoListComponent);
      todoList = fixture.componentInstance;
      fixture.detectChanges();
    });
  }));

  describe('Misbehaving User List', () => {
    // eslint-disable-next-line @typescript-eslint/no-shadow
    let fixture: ComponentFixture<TodoListComponent>;

    let todoServiceStub: {
      getTodos: () => Observable<Todo []>;
      getTodosFiltered: () => Observable<Todo []>;
    };

    beforeEach(() => {
      // stub UserService for test purposes
      todoServiceStub = {
        getTodos: () => new Observable(observer => {
          observer.error('getTodos() Observer generates an error');
        }),
        getTodosFiltered: () => new Observable(observer => {
          observer.error('getTodosFiltered() Observer generates an error');
        })
      };

      TestBed.configureTestingModule({
        imports: [COMMON_IMPORTS],
        declarations: [TodoListComponent],
        // providers:    [ UserService ]  // NO! Don't provide the real service!
        // Provide a test-double instead
        providers: [{ provide: TodoService, todoValue: todoServiceStub }]
      });
    });

    // Construct the `userList` used for the testing in the `it` statement
    // below.
    beforeEach(waitForAsync(() => {
      TestBed.compileComponents().then(() => {
        fixture = TestBed.createComponent(TodoListComponent);
        todoList = fixture.componentInstance;
        fixture.detectChanges();
      });
    }));

    it('fails to load users if we do not set up a UserListService', () => {
      // Since calling both getUsers() and getUsersFiltered() return
      // Observables that then throw exceptions, we don't expect the component
      // to be able to get a list of users, and serverFilteredUsers should
      // be undefined.
      expect(todoList.serverFilteredTodos).toBeUndefined();
    });
  });});
