import { HttpClient, HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { filter } from 'rxjs';
import { Todo } from './todo';
import { TodoService } from './todo.service';

describe('TodoService', () => {
  //small collection of test todos

  const testTodos: Todo[] = [
    {
      _id: 'chenfei_id',
      owner: 'Chenfei',
      status: false,
      body: 'He is going to beewehjejh tonight.',
      category: 'software design',
    },
    {
      _id: 'harry_id',
      owner:'Harry',
      status: true,
      body: 'Metal under tension beggin you to touch and go',
      category: 'homework',
    },
    {
      _id: 'kk_id',
      owner: 'KK',
      status: true,
      body: 'Highway to the Danger Zone ride into the Danger Zone',
      category: 'video games',
    },
    {
      _id: 'Peter_id',
      owner: 'Peter',
      status: false,
      body: 'Headin into twilight spreadin out her wings tonight',
      category: 'groceries',
    },
  ];
  let service: TodoService;
  // These are used to mock the HTTP requests so that we (a) don't have to
  // have the server running and (b) we can check exactly which HTTP
  // requests were made to ensure that we're making the correct requests.
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    // Set up the mock handling of the HTTP requests
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
    // Construct an instance of the service with the mock
    // HTTP client.
    service = new TodoService(httpClient);
  });

  afterEach(() => {
    // After every test, assert that there are no more pending requests.
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getTodos()', () => {

    it('calls `api/todos` when `getTodos()` is called with no parameters', () => {
      // Assert that the todos we get from this call to getTodos()
      // should be our set of test todos. Because we're subscribing
      // to the result of getTodos(), this won't actually get
      // checked until the mocked HTTP request 'returns' a response.
      // This happens when we call req.flush(testTodos) a few lines
      // down.
      service.getTodos().subscribe(
        todos => expect(todos).toBe(testTodos)
      );

      // Specify that (exactly) one request will be made to the specified URL.
      const req = httpTestingController.expectOne(service.todoUrl);
      // Check that the request made to that URL was a GET request.
      expect(req.request.method).toEqual('GET');
      // Check that the request had no query parameters.
      expect(req.request.params.keys().length).toBe(0);
      // Specify the content of the response to that request. This
      // triggers the subscribe above, which leads to that check
      // actually being performed.
      req.flush(testTodos);
    });
  });

  describe('Calling getTodos() with parameters correctly forms the HTTP request', () => {
    /*
     * We really don't care what `getTodos()` returns in the cases
     * where the filtering is happening on the getTodos. Since all the
     * filtering is happening on the server, `getUsers()` is really
     * just a "pass through" that returns whatever it receives, without
     * any "post processing" or manipulation. So the tests in this
     * `describe` block all confirm that the HTTP request is properly formed
     * and sent out in the world, but don't _really_ care about
     * what `getTodos()` returns as long as it's what the HTTP
     * request returns.
     *
     * So in each of these tests, we'll keep it simple and have
     * the (mocked) HTTP request return the entire list `testTodos`
     * even though in "real life" we would expect the server to
     * return return a filtered subset of the users.
     */

    it('correctly calls api/todos with filter parameter \'owner\'', () => {
      service.getTodos({ owner: 'Harry' }).subscribe(
        todos => expect(todos).toBe(testTodos)
      );

      // Specify that (exactly) one request will be made to the specified URL with the owner parameter.
      const req = httpTestingController.expectOne(
        (request) => request.url.startsWith(service.todoUrl) && request.params.has('owner')
      );

      // Check that the request made to that URL was a GET request.
      expect(req.request.method).toEqual('GET');

      // Check that the role parameter was 'admin'
      expect(req.request.params.get('owner')).toEqual('Harry');

      req.flush(testTodos);
    });

    it('correctly calls api/todos with filter parameter \'category\'', () => {
      service.getTodos({ category: 'software design' }).subscribe(
        todos => expect(todos).toBe(testTodos)
      );

      // Specify that (exactly) one request will be made to the specified URL with the owner parameter.
      const req = httpTestingController.expectOne(
        (request) => request.url.startsWith(service.todoUrl) && request.params.has('category')
      );

      // Check that the request made to that URL was a GET request.
      expect(req.request.method).toEqual('GET');

      // Check that the role parameter was 'admin'
      expect(req.request.params.get('category')).toEqual('software design');

      req.flush(testTodos);
    });


    it('correctly calls api/todos with filter parameter \'body\'', () => {
      service.getTodos({ body: 'beewehjejh' }).subscribe(
        todos => expect(todos).toBe(testTodos)
      );

      // Specify that (exactly) one request will be made to the specified URL with the owner parameter.
      const req = httpTestingController.expectOne(
        (request) => request.url.startsWith(service.todoUrl) && request.params.has('body')
      );

      // Check that the request made to that URL was a GET request.
      expect(req.request.method).toEqual('GET');

      // Check that the role parameter was 'admin'
      expect(req.request.params.get('body')).toEqual('beewehjejh');

      req.flush(testTodos);
    });

  });

  describe('filterTodos()', () => {
    /*
     * Since `filterTodos` actually filters "locally" (in
     * Angular instead of on the server), we do want to
     * confirm that everything it returns has the desired
     * properties. Since this doesn't make a call to the server,
     * though, we don't have to use the mock HttpClient and
     * all those complications.
     */
    it('filters by owner', () => {
      const owner = 'Chenfei';
      const filteredTodos = service.filterTodos(testTodos, { owner });
      // There should be two users with an 'i' in their
      // name: Chris and Jamie.
      expect(filteredTodos.length).toBe(1);
      // Every returned user's name should contain an 'i'.
      filteredTodos.forEach(todo => {
        expect(todo.owner.indexOf(owner)).toBeGreaterThanOrEqual(0);
      });
    });

    it('filters by category', () => {
      const category = 'software design';
      const filteredTodos = service.filterTodos(testTodos, { category });
      // There should be just one user that has UMM as their company.
      expect(filteredTodos.length).toBe(1);
      // Every returned user's company should contain 'UMM'.
      filteredTodos.forEach(todo => {
        expect(todo.category.indexOf(category)).toBeGreaterThanOrEqual(0);
      });
    });

    it('filters by body', () => {
      const bodyContents = 'beewehjejh';
      const filteredTodos = service.filterTodos(testTodos, { body: bodyContents });
      // There should be just one user that has UMM as their company.
      expect(filteredTodos.length).toBe(1);
      // Every returned user's company should contain 'UMM'.
      filteredTodos.forEach(todo => {
        expect(todo.body.toLowerCase().indexOf(bodyContents)).toBeGreaterThanOrEqual(0);
      });
    });

    it('filters by complete', () => {
      const filteredTodos = service.filterTodos(testTodos, { status: 'complete' });
      // There should be just one user that has UMM as their company.
      expect(filteredTodos.length).toBe(2);
      // Every returned user's company should contain 'UMM'.
      filteredTodos.forEach(todo => {
        expect(todo.status).toBe(true);
      });
    });

    it('filters by incomplete', () => {
      const filteredTodos = service.filterTodos(testTodos, { status: 'incomplete' });
      // There should be just one user that has UMM as their company.
      expect(filteredTodos.length).toBe(2);
      // Every returned user's company should contain 'UMM'.
      filteredTodos.forEach(todo => {
        expect(todo.status).toBe(false);
      });
    });

    it('filters by name and category', () => {
      // There's only one user (Chris) whose name
      // contains an 'i' and whose company contains
      // an 'M'. There are two whose name contains
      // an 'i' and two whose company contains an
      // an 'M', so this should test combined filtering.
      const owner = 'Harry';
      const category = 'homework';
      const filters = { owner, category };
      const filteredTodos = service.filterTodos(testTodos, filters);
      // There should be just one user with these properties.
      expect(filteredTodos.length).toBe(1);
      // Every returned user should have _both_ these properties.
      filteredTodos.forEach(todo => {
        expect(todo.owner.indexOf(owner)).toBeGreaterThanOrEqual(0);
        expect(todo.category.indexOf(category)).toBeGreaterThanOrEqual(0);
      });
    });
  });
});
